"""
Trending Products API v3
Uses real Affiliate API keys to fetch products from Lazada and TikTok.
Ranking: Score = (sold×50%) + (rating×30%) + (discount×20%)
"""

import hashlib
import hmac
import time
import json
import ssl
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.models import Product, Price

router = APIRouter()

# API Keys
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


def sign_lazada(params: dict) -> str:
    """Generate Lazada API signature"""
    sorted_params = sorted(params.items())
    sign_str = LAZADA_SECRET
    for k, v in sorted_params:
        sign_str += str(k) + str(v)
    return hashlib.sha256(sign_str.encode()).hexdigest().upper()


def fetch_lazada_products(keyword: str, limit: int = 20) -> List[dict]:
    """Fetch products from Lazada Affiliate API"""
    timestamp = str(int(time.time() * 1000))
    
    params = {
        "app_key": LAZADA_LITEAPP_KEY,
        "sign_method": "sha256",
        "timestamp": timestamp,
        "v": "1.0",
        "format": "json",
        "action": "item_search",
        "keyword": keyword,
        "limit": limit,
    }
    
    params["sign"] = sign_lazada(params)
    
    query_str = "&".join([f"{urllib.parse.quote(str(k))}={urllib.parse.quote(str(v))}" for k, v in params.items()])
    url = f"https://api.lazada.co.th/router?{query_str}"
    
    headers = {
        "Authorization": f"Bearer {LAZADA_USER_TOKEN}",
        "Content-Type": "application/json",
    }
    
    ctx = ssl._create_unverified_context()
    req = urllib.request.Request(url, headers=headers, method="GET")
    
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            data = json.loads(resp.read())
            if data.get("code") == "0" or data.get("success"):
                return data.get("data", {}).get("products", [])
    except Exception as e:
        print(f"Lazada API error for '{keyword}': {e}")
    
    return []


def store_product_to_db(db: Session, product_data: dict, platform: str) -> Optional[Product]:
    """Store or update product in database"""
    try:
        # Check if product already exists
        existing = db.query(Product).filter(
            Product.platform_product_id == product_data.get("platform_product_id", "")
        ).first()
        
        if existing:
            # Update existing product
            existing.name = product_data.get("name", existing.name)
            existing.image_url = product_data.get("image_url", existing.image_url)
            existing.description = product_data.get("description", existing.description)
            existing.updated_at = datetime.now(timezone.utc)
            db.commit()
            return existing
        
        # Create new product
        new_product = Product(
            name=product_data.get("name", ""),
            slug=product_data.get("name", "").lower().replace(" ", "-")[:100],
            description=product_data.get("description", ""),
            image_url=product_data.get("image_url", ""),
            category=product_data.get("category", "general"),
            platform=platform,
            platform_product_id=product_data.get("platform_product_id", ""),
            affiliate_url=product_data.get("affiliate_url", ""),
            sold_count=product_data.get("sold_count", 0),
            discount=product_data.get("discount", 0),
            score=product_data.get("score", 0),
        )
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return new_product
    except Exception as e:
        db.rollback()
        print(f"Error storing product: {e}")
        return None


def store_price_to_db(db: Session, product_id: str, price_data: dict, platform: str) -> Optional[Price]:
    """Store price info in database"""
    try:
        price = Price(
            product_id=product_id,
            platform=platform,
            price=price_data.get("price", 0),
            discount_percent=price_data.get("discount", 0),
            rating=price_data.get("rating", 0),
            sold_count=price_data.get("sold_count", 0),
            score=price_data.get("score", 0),
        )
        db.add(price)
        db.commit()
        db.refresh(price)
        return price
    except Exception as e:
        db.rollback()
        print(f"Error storing price: {e}")
        return None


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

        if keyword:
            query = query.filter(Product.name.ilike(f"%{keyword}%"))
        if platform:
            query = query.filter(Price.platform == platform)

        query = query.group_by(Product.id, Product.name, Product.slug, Product.image_url, Product.description)
        query = query.limit(limit)

        results = query.all()

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
    keyword: Optional[str] = Query(None, description="Specific keyword to refresh"),
    db: Session = Depends(get_db)
):
    """
    Refresh trending products by fetching from Lazada/TikTok APIs.
    This updates the database with real product data and images.
    """
    keywords_to_refresh = [keyword] if keyword else POPULAR_KEYWORDS
    results = []
    
    for kw in keywords_to_refresh:
        # Fetch from Lazada
        lazada_products = fetch_lazada_products(kw, limit=20)
        
        stored_count = 0
        for p in lazada_products:
            # Calculate score
            score = calculate_score(
                sold_count=p.get("sold_count", 0),
                rating=p.get("rating", 0),
                discount=p.get("discount", 0),
            )
            
            # Prepare product data
            product_data = {
                "name": p.get("title", ""),
                "platform_product_id": str(p.get("item_id", "")),
                "image_url": p.get("image_url", ""),
                "description": p.get("title", ""),
                "category": kw,
                "platform": "lazada",
                "affiliate_url": p.get("affiliate_url", ""),
                "sold_count": p.get("sold_count", 0),
                "discount": p.get("discount", 0),
                "score": score,
            }
            
            # Store product
            product = store_product_to_db(db, product_data, "lazada")
            if product:
                # Store price
                price_data = {
                    "price": p.get("price", 0),
                    "discount": p.get("discount", 0),
                    "rating": p.get("rating", 0),
                    "sold_count": p.get("sold_count", 0),
                    "score": score,
                }
                store_price_to_db(db, product.id, price_data, "lazada")
                stored_count += 1
        
        results.append({
            "keyword": kw,
            "platform": "lazada",
            "fetched": len(lazada_products),
            "stored": stored_count,
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