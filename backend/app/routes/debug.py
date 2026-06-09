"""
Debug router - test endpoints to verify functionality.
"""
from fastapi import APIRouter
import ssl
import urllib.request
import json
import os

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dylbygcuwigngtkiekylg.supabase.co")
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjE2OTMsImV4cCI6MjA5NTUzNzY5M30.6tA5yXBxtG618IqCVo6N8lBml96ssUBFrRF7ft6t4ks"


def _supabase_headers():
    key = os.getenv("SUPABASE_SERVICE_KEY") or ANON_KEY
    return {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}


@router.get("/debug/urllib")
def debug_urllib():
    """Test urllib+ssl directly."""
    try:
        ctx = ssl._create_unverified_context()
        params = "select=id,name,prices(price,discount_percent,rating,sold_count)&limit=5"
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/products?{params}",
            headers=_supabase_headers(),
            method="GET"
        )
        with urllib.request.urlopen(req, context=ctx) as resp:
            products = json.loads(resp.read())
        
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
                scored.append((score, p["name"], len(prices)))
            except Exception as e:
                continue
        
        scored.sort(key=lambda x: x[0], reverse=True)
        return {"status": "ok", "products": len(products), "scored": len(scored), "top3": scored[:3]}
    except Exception as e:
        import traceback
        return {"status": "error", "error": str(e), "trace": traceback.format_exc()}