"""
Image Scraper API routes.
Scrapes product images from Lazada, Shopee, TikTok and updates Supabase.
POST /api/scrape/images - scrape images for products
GET /api/scrape/status - get scraping status
"""
import ssl
import urllib.request
import json
import time
import re
from typing import Optional, List
from urllib.parse import quote
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

SUPABASE_URL = "https://dtdkjqtqwnqvzokapyeps.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk2MTY5MywiZXhwIjoyMDk1NTM3NjkzfQ.j2lPuJPiPvhUKd3LzQpD9G38--2Xr2qxsESqA8eH0sM"
HEADERS = {"apikey": SERVICE_KEY, "Authorization": f"Bearer {SERVICE_KEY}", "Content-Type": "application/json"}


def supabase_get(endpoint: str) -> List[dict]:
    ctx = ssl._create_unverified_context()
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read())


def supabase_patch(endpoint: str, data: dict) -> dict:
    ctx = ssl._create_unverified_context()
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    req = urllib.request.Request(url, headers=HEADERS, method="PATCH")
    req.data = json.dumps(data).encode()
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read())


def extract_image_from_html(html: str, patterns: List[str]) -> Optional[str]:
    for pattern in patterns:
        matches = re.findall(pattern, html, re.IGNORECASE)
        if matches:
            for img in matches[:10]:
                if isinstance(img, tuple):
                    img = img[0]
                img = img.replace('\\/', '/')
                if any(ext in img.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                    if len(img) > 50 and 'data:' not in img:
                        return img
    return None


def search_lazada(product_name: str) -> Optional[str]:
    try:
        query = quote(product_name)
        url = f"https://www.lazada.co.th/catalog/?q={query}&sort=priceasc"
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        })
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        patterns = [r'"image":"(https://[^"]+\.jpg[^"]*)"', r'"thumbnail":"(https://[^"]+\.jpg[^"]*)"', r'src="(https://[^"]*lazada[^"]*\.jpg[^"]*)"']
        return extract_image_from_html(html, patterns)
    except Exception:
        return None


def search_shopee(product_name: str) -> Optional[str]:
    try:
        query = quote(product_name)
        url = f"https://shopee.co.th/search?keyword={query}"
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        })
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        patterns = [r'"image":"(https://[^"]+\.jpg[^"]*)"', r'"thumb_url":"(https://[^"]+\.jpg[^"]*)"', r'data-sqe-img="(https://[^"]+\.jpg[^"]*)"']
        return extract_image_from_html(html, patterns)
    except Exception:
        return None


def search_tiktok(product_name: str) -> Optional[str]:
    try:
        query = quote(product_name)
        url = f"https://www.tiktok.com/search/shopping?q={query}"
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        })
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        patterns = [r'"cover":"(https://[^"]+\.jpg[^"]*)"', r'"imageUrl":"(https://[^"]+\.jpg[^"]*)"']
        return extract_image_from_html(html, patterns)
    except Exception:
        return None


def scrape_image_for_product(product_name: str) -> Optional[str]:
    for search_func in [search_lazada, search_shopee, search_tiktok]:
        img = search_func(product_name)
        if img:
            return img
    return None


def update_product_image(product_id: str, image_url: str) -> bool:
    try:
        supabase_patch(f"products?id=eq.{product_id}", {"image_url": image_url})
        return True
    except Exception:
        return False


class ScrapeImagesRequest(BaseModel):
    product_ids: Optional[List[str]] = None
    force_rescrape: bool = False


class ScrapeResult(BaseModel):
    product_id: str
    product_name: str
    image_url: Optional[str]
    success: bool


@router.post("/scrape/images")
async def scrape_images(req: ScrapeImagesRequest = None):
    """Scrape product images from e-commerce platforms"""
    try:
        if req and req.product_ids:
            products = []
            for pid in req.product_ids:
                p = supabase_get(f"products?id=eq.{pid}&select=id,name,slug,image_url")
                if p:
                    products.extend(p)
        else:
            all_p = supabase_get("products?select=id,name,slug,image_url&limit=100")
            if req and req.force_rescrape:
                products = all_p
            else:
                products = [p for p in all_p if not p.get('image_url') or 'placeholder' in str(p.get('image_url', ''))]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")
    
    results = []
    for product in products:
        name = product['name']
        img = scrape_image_for_product(name)
        if img:
            update_product_image(str(product['id']), img)
        results.append(ScrapeResult(
            product_id=str(product['id']),
            product_name=name,
            image_url=img,
            success=bool(img)
        ))
        time.sleep(1.5)
    
    return {"results": results, "total": len(results), "updated": sum(1 for r in results if r.success)}


@router.get("/scrape/status")
async def scrape_status():
    """Get current scraping status"""
    try:
        all_products = supabase_get("products?select=id,name,image_url&limit=100")
        with_images = sum(1 for p in all_products if p.get('image_url') and 'placeholder' not in str(p.get('image_url', '')))
        return {
            "total_products": len(all_products),
            "with_images": with_images,
            "without_images": len(all_products) - with_images,
            "completion_percent": round((with_images / len(all_products) * 100) if all_products else 0, 1)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
