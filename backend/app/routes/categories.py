"""
Categories router with SQLAlchemy fallback to Supabase REST API.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import httpx
import os

from app.database import get_db
from app.models.models import Category, Product, Price
from app.models.schemas import CategoryResponse, ProductListResponse

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dylbygcuwigngtkiekylg.supabase.co")
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjE2OTMsImV4cCI6MjA5NTUzNzY5M30.6tA5yXBxtG618IqCVo6N8lBml96ssUBFrRF7ft6t4ks"

def _supabase_headers():
    key = os.getenv("SUPABASE_SERVICE_KEY") or ANON_KEY
    return {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}


def _list_categories_via_rest():
    try:
        transport = httpx.HTTPTransport(retries=1)
        with httpx.Client(timeout=15.0, transport=transport) as client:
            r = client.get(
                f"{SUPABASE_URL}/rest/v1/categories",
                headers=_supabase_headers(),
                params={"order": "name"}
            )
        if not r.ok:
            return None
        return r.json()
    except httpx.RequestError:
        return None


def _get_category_products_via_rest(slug: str, limit: int = 20, offset: int = 0):
    try:
        transport = httpx.HTTPTransport(retries=1)
        with httpx.Client(timeout=15.0, transport=transport) as client:
            cat_r = client.get(
                f"{SUPABASE_URL}/rest/v1/categories",
                headers=_supabase_headers(),
                params={"slug": f"eq.{slug}", "select": "id,name,slug"}
            )
            if not cat_r.ok or not cat_r.json():
                return None
            cat_data = cat_r.json()[0]
            
            products_r = client.get(
                f"{SUPABASE_URL}/rest/v1/products",
                headers=_supabase_headers(),
                params={"category_id": f"eq.{cat_data['id']}", "select": "*,prices(*)", "limit": limit, "offset": offset, "order": "created_at.desc"}
            )
            if not products_r.ok:
                return None
            products = products_r.json()
            
            result = []
            for p in products:
                prices = p.get("prices", []) or []
                result.append({
                    "id": p["id"],
                    "name": p["name"],
                    "slug": p["slug"],
                    "description": p.get("description"),
                    "image_url": p.get("image_url"),
                    "category_id": p.get("category_id"),
                    "created_at": p.get("created_at"),
                    "lowest_price": min([px["price"] for px in prices], default=None) if prices else None,
                    "highest_rating": max([px["rating"] for px in prices if px.get("rating")], default=None) if prices else None,
                })
            return {"category": cat_data, "products": result}
    except httpx.RequestError:
        return None


@router.get("/", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    """List all categories."""
    try:
        categories = db.query(Category).all()
        return categories
    except Exception:
        rest_result = _list_categories_via_rest()
        if rest_result:
            return [CategoryResponse(**c) for c in rest_result]
        return []


@router.get("/{slug}", response_model=CategoryResponse)
def get_category(slug: str, db: Session = Depends(get_db)):
    """Get category by slug."""
    try:
        category = db.query(Category).filter(Category.slug == slug).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        return category
    except Exception:
        rest_result = _list_categories_via_rest()
        if rest_result:
            matches = [c for c in rest_result if c.get("slug") == slug]
            if matches:
                return CategoryResponse(**matches[0])
        raise HTTPException(status_code=404, detail="Category not found")


@router.get("/{slug}/products", response_model=List[ProductListResponse])
def get_category_products(
    slug: str,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    """Get products in a category."""
    try:
        category = db.query(Category).filter(Category.slug == slug).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        products = db.query(Product).filter(
            Product.category_id == category.id
        ).offset(offset).limit(limit).all()
        
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
        rest_result = _get_category_products_via_rest(slug, limit, offset)
        if rest_result:
            return [ProductListResponse(**p) for p in rest_result["products"]]
        return []