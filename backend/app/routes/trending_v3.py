"""
Trending Products API v3
Uses SQLAlchemy to fetch products from database.
Ranking: Score = (sold×50%) + (rating×30%) + (discount×20%)
"""

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.database import get_db
from app.models.models import Product, Price

router = APIRouter()

# API Keys from memory
LAZADA_LITEAPP_KEY = "105827"
LAZADA_SECRET = "r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF"
LAZADA_USER_TOKEN = "1b50f4e90bf44f7b8bf3a1c67d3cd4cf"
TIKTOK_APP_KEY = "6k6fni5mt91k1"
TIKTOK_APP_SECRET = "e9a07b4299f91f23347df80a86f26a5148d54bf5"

POPULAR_KEYWORDS = ["iphone", "samsung", "airpods", "xiaomi", "dyson", "ipad", "macbook"]


def calculate_score(sold_count: int, rating: float, discount: float) -> float:
    """Calculate product score: (sold×50%) + (rating×30%) + (discount×20%)"""
    sold_score = min(sold_count, 10000) / 100 * 0.5
    rating_score = float(rating) * 10 * 0.3
    discount_score = float(discount) * 0.2
    return round(sold_score + rating_score + discount_score, 2)


@router.get("/trending/v3")
async def get_trending_v3(
    keyword: Optional[str] = Query(None, description="Filter by keyword"),
    platform: Optional[str] = Query(None, description="Filter by platform (lazada/tiktok)"),
    limit: int = Query(20, ge=1, le=100, description="Number of products to return"),
    db: Session = Depends(get_db)
):
    """
    Get trending products with scoring.
    Score = (sold_count × 50%) + (rating × 30%) + (discount × 20%)
    """
    try:
        # Build query - join Product with Price
        query = db.query(
            Product.id,
            Product.name,
            Product.slug,
            Product.image_url,
            Product.description,
            func.max(Price.price).label("price"),
            func.max(Price.discount_percent).label("discount"),
            func.max(Price.rating).label("rating"),
            func.max(Price.sold_count).label("sold_count"),
        ).join(Price, Product.id == Price.product_id, isouter=True)

        # Filter by keyword if provided
        if keyword:
            search_term = f"%{keyword}%"
            query = query.filter(Product.name.ilike(search_term))

        # Filter by platform if provided
        if platform:
            query = query.filter(Price.platform == platform)

        # Group by product
        query = query.group_by(Product.id, Product.name, Product.slug, Product.image_url, Product.description)

        # Apply limit
        query = query.limit(limit)

        # Execute
        results = query.all()

        # Format response with calculated score
        products = []
        for r in results:
            sold = r.sold_count or 0
            rating = float(r.rating) if r.rating else 0
            discount = float(r.discount) if r.discount else 0
            score = calculate_score(sold, rating, discount)
            
            products.append({
                "id": str(r.id),
                "name": r.name,
                "slug": r.slug,
                "image_url": r.image_url,
                "description": r.description,
                "price": float(r.price) if r.price else 0,
                "rating": rating,
                "discount": discount,
                "sold_count": sold,
                "score": score,
            })

        # Sort by score descending
        products.sort(key=lambda x: x["score"], reverse=True)

        return {
            "status": "ok",
            "count": len(products),
            "products": products,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")


@router.get("/trending/v3/keywords")
async def get_keywords():
    """Get list of popular keywords being tracked."""
    return {
        "keywords": POPULAR_KEYWORDS,
        "count": len(POPULAR_KEYWORDS),
    }


@router.post("/trending/v3/refresh")
async def refresh_trending(
    keyword: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Manually trigger a refresh of trending products.
    In production, this would be called by a cron job.
    """
    refresh_keywords = [keyword] if keyword else POPULAR_KEYWORDS
    results = []

    for kw in refresh_keywords:
        count = db.query(Product).filter(
            Product.name.ilike(f"%{kw}%")
        ).count()

        results.append({
            "keyword": kw,
            "products_found": count,
            "status": "scanned",
        })

    return {
        "status": "ok",
        "results": results,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/trending/v3/status")
async def get_status(db: Session = Depends(get_db)):
    """Get system status and statistics."""
    try:
        total_products = db.query(Product).count()

        platform_counts = db.query(
            Price.platform,
            func.count(Price.id).label("count")
        ).join(Product, Price.product_id == Product.id, isouter=True).group_by(Price.platform).all()

        platforms = {p.platform or "unknown": p.count for p in platform_counts}

        return {
            "status": "operational",
            "keywords_tracked": len(POPULAR_KEYWORDS),
            "total_products": total_products,
            "platforms": platforms,
            "api_keys_configured": {
                "lazada": bool(LAZADA_LITEAPP_KEY and LAZADA_SECRET),
                "tiktok": bool(TIKTOK_APP_KEY and TIKTOK_APP_SECRET),
            },
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "keywords_tracked": len(POPULAR_KEYWORDS),
            "api_keys_configured": {
                "lazada": bool(LAZADA_LITEAPP_KEY and LAZADA_SECRET),
                "tiktok": bool(TIKTOK_APP_KEY and TIKTOK_APP_SECRET),
            },
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }