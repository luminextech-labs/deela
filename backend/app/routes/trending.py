"""
Trending router - fetches from products list and sorts by trending score.
Primary: urllib+ssl (works reliably on Render). Fallback: httpx.
"""
from fastapi import APIRouter, Query
import logging
import ssl
import urllib.request
import json
import os
from typing import Optional

import httpx

logger = logging.getLogger(__name__)
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dtdkjtqwnwqvozkayeps.supabase.co")
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjE2OTMsImV4cCI6MjA5NTUzNzY5M30.6tA5yXBxtG618IqCVo6N8lBml96ssUBFrRF7ft6t4ks"

router = APIRouter()


def _supabase_headers():
    key = os.getenv("SUPABASE_SERVICE_KEY") or ANON_KEY
    return {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}


def _fetch_products_via_urllib(limit: int) -> Optional[list]:
    """Fetch products using urllib+ssl (primary - works on Render)."""
    try:
        ctx = ssl._create_unverified_context()
        params = f"select=id,name,slug,description,image_url,category_id,created_at,prices(price,discount_percent,rating,sold_count)&limit={limit}"
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/products?{params}",
            headers=_supabase_headers(),
            method="GET"
        )
        with urllib.request.urlopen(req, context=ctx) as resp:
            return json.loads(resp.read())
    except Exception as e:
        logger.warning(f"urllib error: {e}")
        return None


def _fetch_products_via_httpx(limit: int) -> Optional[list]:
    """Fetch products using httpx (fallback)."""
    try:
        transport = httpx.HTTPTransport(retries=1)
        with httpx.Client(timeout=15.0, transport=transport) as client:
            r = client.get(
                f"{SUPABASE_URL}/rest/v1/products",
                headers=_supabase_headers(),
                params={"select": "id,name,slug,description,image_url,category_id,created_at,prices(price,discount_percent,rating,sold_count)", "limit": limit}
            )
        if not r.ok:
            logger.warning(f"httpx request failed: status={r.status_code}")
            return None
        return r.json()
    except httpx.RequestError as e:
        logger.warning(f"httpx request error: {e}")
        return None
    except Exception as e:
        logger.warning(f"httpx unexpected error: {e}")
        return None


@router.get("/deals")
def get_trending_deals(limit: int = Query(20, ge=1, le=100)):
    """Get trending deals sorted by discount + rating."""
    try:
        # Try urllib first (primary), then httpx fallback
        products = _fetch_products_via_urllib(limit)
        if products is None:
            products = _fetch_products_via_httpx(limit)
        if not products:
            logger.warning("trending/deals: no products fetched")
            return []
        
        scored = []
        for p in products:
            prices = p.get("prices", []) or []
            if not prices:
                continue
            try:
                max_disc = max([px.get("discount_percent", 0) or 0 for px in prices])
                hi_rating = max([px.get("rating") or 0 for px in prices])
                total_sold = sum([px.get("sold_count", 0) or 0 for px in prices])
                score = (max_disc * 0.3) + (float(hi_rating) * 10 * 0.3) + (min(total_sold, 10000) / 100 * 0.4)
                scored.append((score, p))
            except Exception as e:
                logger.warning(f"trending/deals: error scoring product {p.get('id')}: {e}")
                continue
        scored.sort(key=lambda x: x[0], reverse=True)
        result = []
        for score, p in scored[:limit]:
            prices = p.get("prices", []) or []
            result.append({
                "id": p["id"],
                "name": p["name"],
                "slug": p.get("slug"),
                "description": p.get("description"),
                "image_url": p.get("image_url"),
                "category_id": p.get("category_id"),
                "created_at": p.get("created_at"),
                "lowest_price": min([px["price"] for px in prices], default=None) if prices else None,
                "highest_rating": max([px["rating"] for px in prices if px.get("rating")], default=None) if prices else None,
                "prices": prices,
            })
        return result
    except Exception as e:
        import traceback
        logger.warning(f"trending/deals failed: {type(e).__name__}: {e}\n{traceback.format_exc()}")
        return []