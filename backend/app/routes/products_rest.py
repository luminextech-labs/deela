"""
Products router using Supabase REST API (PostgREST) instead of direct PG connection.
"""
from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
import httpx
import os

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dylbygcuwigngtkiekylg.supabase.co")
# Full anon key
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjE2OTMsImV4cCI6MjA5NTUzNzY5M30.6tA5yXBxtG618IqCVo6N8lBml96ssUBFrRF7ft6t4ks"
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "") or ANON_KEY

router = APIRouter()


def _headers():
    key = os.getenv("SUPABASE_SERVICE_KEY") or ANON_KEY
    return {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}


@router.get("/categories")
def list_categories():
    """List all categories."""
    try:
        transport = httpx.HTTPTransport(retries=1)
        with httpx.Client(timeout=15.0, transport=transport) as client:
            r = client.get(f"{SUPABASE_URL}/rest/v1/categories", headers=_headers(), params={"order": "name"})
        if not r.ok:
            raise HTTPException(status_code=502, detail=f"Supabase error: {r.text[:200]}")
        return r.json()
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")


@router.get("/products")
def list_products(
    category: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """List products with optional category filter."""
    try:
        params = {"select": "*,prices(*),category:categories(name,slug)", "limit": limit, "offset": offset, "order": "created_at.desc"}
        
        transport = httpx.HTTPTransport(retries=1)
        with httpx.Client(timeout=15.0, transport=transport) as client:
            if category:
                cat_r = client.get(f"{SUPABASE_URL}/rest/v1/categories", headers=_headers(), params={"slug": f"eq.{category}", "select": "id"})
                if not cat_r.ok or not cat_r.json():
                    return []
                params["category_id"] = f"eq.{cat_r.json()[0]['id']}"
            
            r = client.get(f"{SUPABASE_URL}/rest/v1/products", headers=_headers(), params=params)
        
        if not r.ok:
            raise HTTPException(status_code=502, detail=f"Supabase error: {r.text[:200]}")
        
        products = r.json()
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
                "prices": prices,
                "category": p.get("category"),
            })
        return result
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")


@router.get("/search")
def search_products(
    q: str = Query(..., min_length=1),
    category: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """Search products."""
    try:
        params = {
            "select": "*,prices(*),category:categories(name,slug)",
            "name": f"ilike.*{q}*",
            "limit": limit,
            "offset": offset,
        }
        transport = httpx.HTTPTransport(retries=1)
        with httpx.Client(timeout=15.0, transport=transport) as client:
            if category:
                cat_r = client.get(f"{SUPABASE_URL}/rest/v1/categories", headers=_headers(), params={"slug": f"eq.{category}", "select": "id"})
                if cat_r.ok and cat_r.json():
                    params["category_id"] = f"eq.{cat_r.json()[0]['id']}"
            
            r = client.get(f"{SUPABASE_URL}/rest/v1/products", headers=_headers(), params=params)
        
        if not r.ok:
            raise HTTPException(status_code=502, detail=f"Supabase error: {r.text[:200]}")
        
        products = r.json()
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
        return {"products": result, "total": len(result), "query": q}
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")


@router.get("/products/{slug}")
def get_product(slug: str):
    """Get product details with all prices."""
    try:
        transport = httpx.HTTPTransport(retries=1)
        with httpx.Client(timeout=15.0, transport=transport) as client:
            r = client.get(
                f"{SUPABASE_URL}/rest/v1/products",
                headers=_headers(),
                params={"slug": f"eq.{slug}", "select": "*,prices(*),category:categories(name,slug)"}
            )
        if not r.ok:
            raise HTTPException(status_code=502, detail=f"Supabase error: {r.text[:200]}")
        products = r.json()
        if not products:
            raise HTTPException(status_code=404, detail="Product not found")
        p = products[0]
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
            "category": p.get("category"),
        }
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")