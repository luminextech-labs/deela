"""
Trending router - fetches from products list and sorts by trending score.
"""
from fastapi import APIRouter, Query, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Product, Price
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)


@router.get("/deals")
def get_trending_deals(limit: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    """Get trending deals sorted by discount + rating."""
    try:
        # Fetch products with prices from database
        products = db.query(Product).limit(limit * 2).all()  # Fetch extra to account for products without prices
        
        if not products:
            logger.warning("trending/deals: no products in DB")
            return []
        
        scored = []
        for product in products:
            # Get all prices for this product
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
                logger.warning(f"trending/deals: error scoring product {product.id}: {e}")
                continue
        
        scored.sort(key=lambda x: x[0], reverse=True)
        result = []
        for score, product, prices in scored[:limit]:
            result.append({
                "id": str(product.id),
                "name": product.name,
                "slug": product.slug,
                "description": product.description,
                "image_url": product.image_url,
                "category_id": str(product.category_id) if product.category_id else None,
                "created_at": product.created_at.isoformat() if product.created_at else None,
                "lowest_price": min([p.price for p in prices]) if prices else None,
                "highest_rating": max([float(p.rating) for p in prices if p.rating]) if prices else None,
                "prices": [
                    {
                        "id": str(p.id),
                        "price": float(p.price),
                        "original_price": float(p.original_price) if p.original_price else None,
                        "discount_percent": p.discount_percent,
                        "rating": float(p.rating) if p.rating else None,
                        "sold_count": p.sold_count,
                        "platform": p.platform,
                    }
                    for p in prices
                ],
            })
        
        logger.warning(f"trending/deals: returning {len(result)} results (from {len(scored)} scored)")
        return result
    except Exception as e:
        import traceback
        logger.warning(f"trending/deals failed: {type(e).__name__}: {e}\n{traceback.format_exc()}")
        return []