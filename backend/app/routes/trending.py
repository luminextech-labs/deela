"""
Trending router - Real implementation with Supabase REST API.
"""
from fastapi import APIRouter, Query
import ssl
import urllib.request
import json
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dylbygcuwigngtkiekylg.supabase.co")
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjE2OTMsImV4cCI6MjA5NTUzNzY5M30.6tA5yXBxtG618IqCVo6N8lBml96ssUBFrRF7ft6t4ks"


def _supabase_headers():
    key = os.getenv("SUPABASE_SERVICE_KEY") or ANON_KEY
    return {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}


def _fetch_trending_deals(limit: int = 20):
    """Fetch trending deals from Supabase REST API."""
    try:
        ctx = ssl._create_unverified_context()
        # Query products with prices, ordered by created_at
        params = f"select=*,prices(*)&order=created_at.desc&limit={limit * 2}"
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/products?{params}",
            headers=_supabase_headers(),
            method="GET"
        )
        with urllib.request.urlopen(req, context=ctx) as resp:
            products = json.loads(resp.read())
            
        if not products:
            return []
        
        scored = []
        for p in products:
            prices = p.get("prices", []) or []
            if not prices:
                continue
            
            try:
                max_disc = max([px.get("discount_percent") or 0 for px in prices])
                hi_rating = max([float(px.get("rating") or 0) for px in prices if px.get("rating")], default=0)
                total_sold = sum([px.get("sold_count") or 0 for px in prices])
                score = (max_disc * 0.3) + (hi_rating * 10 * 0.3) + (min(total_sold, 10000) / 100 * 0.4)
                
                scored.append({
                    "score": score,
                    "product": {
                        "id": p["id"],
                        "name": p["name"],
                        "slug": p["slug"],
                        "image_url": p.get("image_url"),
                        "lowest_price": min([px["price"] for px in prices]) if prices else None,
                        "highest_rating": max([px.get("rating") for px in prices if px.get("rating")], default=None),
                    },
                    "prices": prices
                })
            except Exception as e:
                logger.warning(f"Error scoring product {p.get('id')}: {e}")
                continue
        
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:limit]
        
    except Exception as e:
        logger.error(f"Failed to fetch trending deals: {e}")
        return []


@router.get("/deals")
def get_deals(limit: int = Query(20, ge=1, le=100)):
    """Get trending deals sorted by discount + rating."""
    return _fetch_trending_deals(limit)
