"""
Products router with SQLAlchemy fallback to Supabase REST API.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
import ssl
import urllib.request
import json

import httpx
import os

from app.database import get_db
from app.models.models import Product, Category, Price
from app.models.schemas import ProductResponse, ProductListResponse, SearchResponse, PriceResponse

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dtdkjtqwnwqvozkayeps.supabase.co")
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjE2OTMsImV4cCI6MjA5NTUzNzY5M30.6tA5yXBxtG618IqCVo6N8lBml96ssUBFrRF7ft6t4ks"

def _supabase_headers():
    key = os.getenv("SUPABASE_SERVICE_KEY") or ANON_KEY
    return {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}


def _product_from_supabase(p: dict) -> dict:
    prices = p.get("prices", []) or []
    return {
        "id": p["id"],
        "name": p["name"],
        "slug": p["slug"],
        "description": p.get("description"),
        "image_url": p.get("image_url"),
        "category_id": p.get("category_id"),
        "created_at": p.get("created_at"),
        "lowest_price": min([px["price"] for px in prices], default=None) if prices else None,
        "highest_rating": max([px["rating"] for px in prices if px.get("rating")], default=None) if prices else None,
        "prices": prices,
    }


def _search_via_rest(q: str, limit: int = 20, offset: int = 0):
    try:
        ctx = ssl._create_unverified_context()
        params = f"select=*,prices(*)&name=ilike.*{q}*&limit={limit}&offset={offset}"
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/products?{params}",
            headers=_supabase_headers(),
            method="GET"
        )
        with urllib.request.urlopen(req, context=ctx) as resp:
            products = json.loads(resp.read())
            return {"products": [_product_from_supabase(p) for p in products], "total": len(products), "query": q}
    except Exception:
        return None


def _list_via_rest(limit: int = 20, offset: int = 0):
    try:
        ctx = ssl._create_unverified_context()
        params = f"select=*,prices(*)&limit={limit}&offset={offset}&order=created_at.desc"
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/products?{params}",
            headers=_supabase_headers(),
            method="GET"
        )
        with urllib.request.urlopen(req, context=ctx) as resp:
            products = json.loads(resp.read())
            return [_product_from_supabase(p) for p in products]
    except Exception:
        return None


def _get_product_via_rest(slug: str):
    try:
        ctx = ssl._create_unverified_context()
        params = f"slug=eq.{slug}&select=*,prices(*)"
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/products?{params}",
            headers=_supabase_headers(),
            method="GET"
        )
        with urllib.request.urlopen(req, context=ctx) as resp:
            products = json.loads(resp.read())
            if not products:
                return None
            return _product_from_supabase(products[0])
    except Exception:
        return None


@router.get("/search", response_model=SearchResponse)
def search_products(
    q: str = Query(..., min_length=1),
    category: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Search products across all platforms."""
    try:
        query = db.query(Product)
        
        if q:
            search_term = f"%{q}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term)
                )
            )
        
        if category:
            cat = db.query(Category).filter(Category.slug == category).first()
            if cat:
                query = query.filter(Product.category_id == cat.id)
        
        total = query.count()
        products = query.offset(offset).limit(limit).all()
        
        result = []
        for product in products:
            prices = db.query(Price).filter(Price.product_id == product.id).all()
            lowest_price = min([p.price for p in prices], default=None) if prices else None
            highest_rating = max([p.rating for p in prices if p.rating], default=None) if prices else None
            
            result.append(ProductListResponse(
                id=product.id,
                name=product.name,
                slug=product.slug,
                description=product.description,
                image_url=product.image_url,
                category_id=product.category_id,
                created_at=product.created_at,
                lowest_price=lowest_price,
                highest_rating=highest_rating
            ))
        
        return SearchResponse(products=result, total=total, query=q)
    except Exception:
        # Fallback to REST API
        rest_result = _search_via_rest(q, limit, offset)
        if rest_result:
            return SearchResponse(
                products=[ProductListResponse(**p) for p in rest_result["products"]],
                total=rest_result["total"],
                query=rest_result["query"]
            )
        raise HTTPException(status_code=500, detail="Both DB and REST API failed")


@router.get("/{slug}", response_model=ProductResponse)
def get_product(slug: str, db: Session = Depends(get_db)):
    """Get product details with all prices."""
    try:
        product = db.query(Product).filter(Product.slug == slug).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except Exception:
        rest_result = _get_product_via_rest(slug)
        if rest_result:
            return rest_result
        raise HTTPException(status_code=404, detail="Product not found")


@router.get("/{slug}/prices", response_model=List[PriceResponse])
def get_product_prices(slug: str, db: Session = Depends(get_db)):
    """Get all prices for a product across platforms."""
    try:
        product = db.query(Product).filter(Product.slug == slug).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        prices = db.query(Price).filter(Price.product_id == product.id).all()
        return prices
    except Exception:
        rest_result = _get_product_via_rest(slug)
        if rest_result and rest_result.get("prices"):
            return rest_result["prices"]
        raise HTTPException(status_code=404, detail="Product not found")


@router.get("/", response_model=List[ProductListResponse])
def list_products(
    category: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """List products with pagination."""
    try:
        query = db.query(Product)
        
        if category:
            cat = db.query(Category).filter(Category.slug == category).first()
            if cat:
                query = query.filter(Product.category_id == cat.id)
        
        products = query.offset(offset).limit(limit).all()
        
        result = []
        for product in products:
            prices = db.query(Price).filter(Price.product_id == product.id).all()
            lowest_price = min([p.price for p in prices], default=None) if prices else None
            highest_rating = max([p.rating for p in prices if p.rating], default=None) if prices else None
            
            result.append(ProductListResponse(
                id=product.id,
                name=product.name,
                slug=product.slug,
                description=product.description,
                image_url=product.image_url,
                category_id=product.category_id,
                created_at=product.created_at,
                lowest_price=lowest_price,
                highest_rating=highest_rating
            ))
        
        return result
    except Exception:
        rest_result = _list_via_rest(limit, offset)
        if rest_result:
            return [ProductListResponse(**p) for p in rest_result]
        return []