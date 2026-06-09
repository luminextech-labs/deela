"""
Trending Phones API
Returns top 10 best-selling phones from Lazada and TikTok Shop.
GET /api/trending/phones
"""
import ssl
import urllib.request
import json
import re
import time
from typing import Optional, List, Dict
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

SUPABASE_URL = "https://dylbygcuwigngtkiekylg.supabase.co"
SERVICE_KEY = "eyJhbG…H0sM"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}


def fetch_html(url: str) -> Optional[str]:
    """Fetch HTML from URL"""
    try:
        ctx = ssl._create_unverified_context()
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,th;q=0.8",
        })
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            return resp.read().decode('utf-8', errors='ignore')
    except Exception:
        return None


def extract_json_data(html: str, key_pattern: str) -> Optional[dict]:
    """Extract JSON data from HTML script tags"""
    patterns = [
        rf'{key_pattern}',
        r'window\.__INITIAL_STATE__\s*=\s*({.*?});',
        r'data-src="([^"]+)"',
    ]
    for pattern in patterns:
        matches = re.findall(pattern, html, re.DOTALL)
        if matches:
            try:
                return json.loads(matches[0])
            except:
                pass
    return None


def scrape_lazada_phones() -> List[Dict]:
    """Scrape top phones from Lazada"""
    phones = []
    url = "https://www.lazada.co.th/catalog/?q=%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%96%E0%B8%B7%E0%B8%AD&sort=priceasc&rating=true"
    
    html = fetch_html(url)
    if not html:
        return phones
    
    # Extract product data from HTML
    # Look for product cards in the HTML
    product_patterns = [
        r'"name":"([^"]+)".*?"price":"([^"]+)".*?"image":"(https://[^"]+\.jpg[^"]*)"',
        r'"rawTitle":"([^"]+)".*?"price":"([^"]+)".*?"image":"(https://[^"]+\.jpg[^"]*)"',
        r'data-product="([^"]+)"',
    ]
    
    for pattern in product_patterns:
        matches = re.findall(pattern, html, re.DOTALL)
        for match in matches[:10]:
            if isinstance(match, tuple) and len(match) >= 3:
                name, price, image = match[0], match[1], match[2]
                image = image.replace('\\/', '/')
                phones.append({
                    "name": name,
                    "price": price,
                    "image": image,
                    "source": "lazada",
                    "url": f"https://www.lazada.co.th/search/?q={name}"
                })
    
    return phones[:10]


def scrape_tiktok_phones() -> List[Dict]:
    """Scrape top phones from TikTok Shop"""
    phones = []
    url = "https://www.tiktok.com/shop/search/product?keyword=%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%96%E0%B8%B7%E0%B8%AD&sort=best_selling"
    
    html = fetch_html(url)
    if not html:
        return phones
    
    # Extract product data from TikTok HTML
    patterns = [
        r'"name":"([^"]+)".*?"price":"([^"]+)".*?"cover":"(https://[^"]+\.jpg[^"]*)"',
        r'"productTitle":"([^"]+)".*?"price":"([^"]+)".*?"coverImage":"(https://[^"]+\.jpg[^"]*)"',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, html, re.DOTALL)
        for match in matches[:10]:
            if isinstance(match, tuple) and len(match) >= 3:
                name, price, image = match[0], match[1], match[2]
                image = image.replace('\\/', '/')
                phones.append({
                    "name": name,
                    "price": price,
                    "image": image,
                    "source": "tiktok",
                    "url": f"https://www.tiktok.com/shop/search/product?keyword={name}"
                })
    
    return phones[:10]


class PhoneItem(BaseModel):
    name: str
    price: str
    image: str
    source: str
    url: str


class TrendingPhonesResponse(BaseModel):
    lazada: List[PhoneItem]
    tiktok: List[PhoneItem]
    updated_at: str


@router.get("/trending/phones", response_model=TrendingPhonesResponse)
async def get_trending_phones():
    """
    Get top 10 best-selling phones from Lazada and TikTok Shop.
    Scrapes real-time data from both platforms.
    """
    from datetime import datetime
    
    lazada_phones = scrape_lazada_phones()
    tiktok_phones = scrape_tiktok_phones()
    
    return TrendingPhonesResponse(
        lazada=[PhoneItem(**p) for p in lazada_phones],
        tiktok=[PhoneItem(**p) for p in tiktok_phones],
        updated_at=datetime.utcnow().isoformat()
    )


@router.get("/trending/phones/status")
async def trending_phones_status():
    """Check if scraping is working"""
    from datetime import datetime
    return {
        "status": "ok",
        "lazada_check": bool(scrape_lazada_phones()),
        "tiktok_check": bool(scrape_tiktok_phones()),
        "timestamp": datetime.utcnow().isoformat()
    }