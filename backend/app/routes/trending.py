"""
Trending router v3 - direct DB query with debug flag.
"""
from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Product, Price
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

DEBUG_VERSION = "v3-db-query"


@router.get("/deals")
def get_deals(limit: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    """Get trending deals sorted by discount + rating."""
    try:
        products = db.query(Product).limit(limit * 2).all()
        
        if not products:
            logger.warning(f"deals {DEBUG_VERSION}: no products in DB")
            return [{"error": "no products", "version": DEBUG_VERSION}]
        
        scored = []
        for product in products:
            prices = db.query(Price).filter(Price.product_id == product.id).all()
            if not prices:
                continue
            
            try:
                max_disc = max([p.discount_percent or 0 for p in prices])
                hi_rating = max([float(p.rating) for p in prices if p.rating] or [0])
                total_sold = sum([p.sold_count or 0 for p in prices])
                score = (max_disc * 0.3) + (hi_rating * 10 * 0.3) + (min(total_sold, 10000) / 100 * 0.4)
                scored.append((score, product, prices))
            except Exception as e:
                logger.warning(f"deals {DEBUG_VERSION}: error scoring {product.id}: {e}")
                continue
        
        scored.sort(key=lambda x: x[0], reverse=True)
        result = {
            "debug_version": DEBUG_VERSION,
            "total_products_in_db": len(products),
            "scored_products": len(scored),
            "returned": min(limit, len(scored)),
            "items": []
        }
        
        for score, product, prices in scored[:limit]:
            result["items"].append({
                "id": str(product.id),
                "name": product.name,
                "slug": product.slug,
                "lowest_price": min([p.price for p in prices]) if prices else None,
                "highest_rating": max([float(p.rating) for p in prices if p.rating]) if prices else None,
                "score": round(score, 2),
                "prices_count": len(prices),
            })
        
        logger.warning(f"deals {DEBUG_VERSION}: returning {len(result)} items")
        return result
    except Exception as e:
        import traceback
        logger.warning(f"deals {DEBUG_VERSION} failed: {type(e).__name__}: {e}\n{traceback.format_exc()}")
        return [{"error": str(e), "version": DEBUG_VERSION}]