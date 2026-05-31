"""
Trending router v2 - using direct DB query.
"""
from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Product, Price
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/deals")
def get_deals(limit: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    """Get trending deals sorted by discount + rating."""
    try:
        products = db.query(Product).limit(limit * 2).all()
        
        if not products:
            logger.warning("deals v2: no products in DB")
            return []
        
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
                logger.warning(f"deals v2: error scoring {product.id}: {e}")
                continue
        
        scored.sort(key=lambda x: x[0], reverse=True)
        result = []
        for score, product, prices in scored[:limit]:
            result.append({
                "id": str(product.id),
                "name": product.name,
                "slug": product.slug,
                "lowest_price": min([p.price for p in prices]) if prices else None,
                "highest_rating": max([float(p.rating) for p in prices if p.rating]) if prices else None,
                "prices": [{"platform": p.platform, "price": float(p.price), "discount_percent": p.discount_percent} for p in prices],
            })
        
        logger.warning(f"deals v2: returning {len(result)} from {len(scored)} scored")
        return result
    except Exception as e:
        import traceback
        logger.warning(f"deals v2 failed: {type(e).__name__}: {e}\n{traceback.format_exc()}")
        return []