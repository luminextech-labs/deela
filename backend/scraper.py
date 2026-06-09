#!/usr/bin/env python3
"""
Deela Image Scraper - Full Implementation
Scrapes product images from Lazada, Shopee, TikTok and updates Supabase.
Can run standalone or be deployed to Railway.
"""
import os
import ssl
import urllib.request
import json
import time
import re
import asyncio
from typing import Optional, List, Tuple
from urllib.parse import quote

# === CONFIG ===
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dylbygcuwigngtkiekylg.supabase.co")
SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk2MTY5MywiZXhwIjoyMDk1NTM3NjkzfQ.j2lPuJPiPvhUKd3LzQpD9G38--2Xr2qxsESqA8eH0sM")

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}


def supabase_get(endpoint: str) -> List[dict]:
    """Make GET request to Supabase REST API"""
    ctx = ssl._create_unverified_context()
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read())


def supabase_patch(endpoint: str, data: dict) -> dict:
    """Make PATCH request to Supabase REST API"""
    ctx = ssl._create_unverified_context()
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    req = urllib.request.Request(url, headers=HEADERS, method="PATCH")
    req.data = json.dumps(data).encode()
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read())


def get_products_without_images() -> List[dict]:
    """Get products where image_url is null or placeholder"""
    products = supabase_get("products?select=id,name,slug,image_url&limit=100")
    return [p for p in products if not p.get('image_url') or 'placeholder' in str(p.get('image_url', ''))]


def get_all_products() -> List[dict]:
    """Get all products"""
    return supabase_get("products?select=id,name,slug,image_url&limit=100")


def update_product_image(product_id: str, image_url: str) -> bool:
    """Update product image_url in Supabase"""
    try:
        supabase_patch(f"products?id=eq.{product_id}", {"image_url": image_url})
        return True
    except Exception as e:
        print(f"    Update failed: {e}")
        return False


def extract_image_from_html(html: str, patterns: List[str]) -> Optional[str]:
    """Extract image URL from HTML using regex patterns"""
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
    """Search Lazada for product image"""
    try:
        import urllib.request
        query = quote(product_name)
        url = f"https://www.lazada.co.th/catalog/?q={query}&sort=priceasc"
        
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        })
        
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        
        patterns = [
            r'"image":"(https://[^"]+\.jpg[^"]*)"',
            r'"thumbnail":"(https://[^"]+\.jpg[^"]*)"',
            r'src="(https://[^"]*lazada[^"]*\.jpg[^"]*)"',
            r'data-image="(https://[^"]+\.jpg[^"]*)"',
            r'"coverImage":"(https://[^"]+\.jpg[^"]*)"',
        ]
        
        return extract_image_from_html(html, patterns)
    except Exception as e:
        print(f"    Lazada error: {e}")
        return None


def search_shopee(product_name: str) -> Optional[str]:
    """Search Shopee for product image"""
    try:
        import urllib.request
        query = quote(product_name)
        url = f"https://shopee.co.th/search?keyword={query}"
        
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        })
        
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        
        patterns = [
            r'"image":"(https://[^"]+\.jpg[^"]*)"',
            r'"thumb_url":"(https://[^"]+\.jpg[^"]*)"',
            r'data-sqe-img="(https://[^"]+\.jpg[^"]*)"',
            r'src="(https://[^"]*shopee[^"]*\.jpg[^"]*)"',
            r'"cover_url":"(https://[^"]+\.jpg[^"]*)"',
        ]
        
        return extract_image_from_html(html, patterns)
    except Exception as e:
        print(f"    Shopee error: {e}")
        return None


def search_tiktok(product_name: str) -> Optional[str]:
    """Search TikTok Shop for product image"""
    try:
        import urllib.request
        query = quote(product_name)
        url = f"https://www.tiktok.com/search/shopping?q={query}"
        
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        })
        
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        
        patterns = [
            r'"cover":"(https://[^"]+\.jpg[^"]*)"',
            r'"imageUrl":"(https://[^"]+\.jpg[^"]*)"',
            r'src="(https://[^"]*tiktok[^"]*\.jpg[^"]*)"',
            r'"thumbnail":"(https://[^"]+\.jpg[^"]*)"',
        ]
        
        return extract_image_from_html(html, patterns)
    except Exception as e:
        print(f"    TikTok error: {e}")
        return None


def search_google_shopping(product_name: str) -> Optional[str]:
    """Search Google Shopping for product image (fallback)"""
    try:
        import urllib.request
        query = quote(f"{product_name} site:shopee.co.th OR site:lazada.co.th")
        url = f"https://www.google.com/search?q={query}&tbm=shop"
        
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        })
        
        ctx = ssl._create_unverified_context()
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        
        patterns = [
            r'data-src="(https://[^"]+\.jpg[^"]*)"',
            r'src="(https://[^"]*gstatic[^"]*\.jpg[^"]*)"',
            r'"img_uri":"(https://[^"]+\.jpg[^"]*)"',
            r'"image":"(https://[^"]+\.jpg[^"]*)"',
        ]
        
        return extract_image_from_html(html, patterns)
    except Exception as e:
        print(f"    Google error: {e}")
        return None


def scrape_image_for_product(product_name: str) -> Optional[str]:
    """Try all sources to find an image for a product"""
    sources = [
        ("Lazada", search_lazada),
        ("Shopee", search_shopee),
        ("TikTok", search_tiktok),
        ("Google", search_google_shopping),
    ]
    
    for source_name, search_func in sources:
        print(f"      Trying {source_name}...", end=" ", flush=True)
        img = search_func(product_name)
        if img:
            print(f"✅")
            return img
        else:
            print("❌")
    
    return None


def run_scraper():
    """Main scraper function"""
    print("🔍 Deela Image Scraper")
    print("=" * 60)
    
    # Get all products
    print("\n📦 Fetching products from Supabase...")
    try:
        all_products = get_all_products()
        products_need_images = get_products_without_images()
        print(f"   Total products: {len(all_products)}")
        print(f"   Need images: {len(products_need_images)}")
    except Exception as e:
        print(f"   ❌ Failed to fetch products: {e}")
        return
    
    if not products_need_images:
        print("\n✅ All products already have images!")
        return
    
    print(f"\n🖼️  Starting image scrape for {len(products_need_images)} products...")
    print("-" * 60)
    
    updated = 0
    failed = 0
    skipped = 0
    
    for i, product in enumerate(products_need_images):
        product_id = product['id']
        name = product['name']
        
        print(f"\n[{i+1}/{len(products_need_images)}] 🔎 {name[:50]}")
        
        image_url = scrape_image_for_product(name)
        
        if image_url:
            if update_product_image(product_id, image_url):
                print(f"   ✅ Updated: {image_url[:80]}...")
                updated += 1
            else:
                failed += 1
        else:
            print(f"   ❌ No image found")
            failed += 1
        
        time.sleep(1.5)  # Rate limit to be polite
    
    print("\n" + "=" * 60)
    print(f"✅ Done!")
    print(f"   Updated: {updated}")
    print(f"   Failed: {failed}")
    print(f"   Skipped (already have images): {skipped}")


# === FASTAPI ROUTE (for Railway deployment) ===
def create_scraper_router():
    from fastapi import APIRouter, HTTPException
    from pydantic import BaseModel
    from typing import Optional
    
    router = APIRouter()
    
    class ScrapeImagesRequest(BaseModel):
        product_ids: Optional[List[str]] = None  # None = all products without images
        force_rescrape: bool = False
    
    class ScrapeResult(BaseModel):
        product_id: str
        product_name: str
        image_url: Optional[str]
        success: bool
        source: Optional[str] = None
    
    @router.post("/scrape/images")
    async def scrape_images(req: ScrapeImagesRequest = None):
        """Scrape product images from e-commerce platforms"""
        results = []
        
        if req and req.product_ids:
            products = [p for p in supabase_get(f"products?id=eq.{pid}&select=id,name,slug,image_url" if len(req.product_ids) == 1 else f"products?id=in.({' '.join(req.product_ids)})&select=id,name,slug,image_url")]
        elif req and req.force_rescrape:
            products = get_all_products()
        else:
            products = get_products_without_images()
        
        for product in products:
            name = product['name']
            image_url = scrape_image_for_product(name)
            
            if image_url:
                update_product_image(product['id'], image_url)
            
            results.append(ScrapeResult(
                product_id=str(product['id']),
                product_name=name,
                image_url=image_url,
                success=bool(image_url),
                source="lazada/shopee/tiktok"
            ))
        
        return {"results": results, "total": len(results), "updated": sum(1 for r in results if r.success)}
    
    @router.get("/scrape/status")
    async def scrape_status():
        """Get current scraping status"""
        all_products = get_all_products()
        with_images = sum(1 for p in all_products if p.get('image_url') and 'placeholder' not in str(p.get('image_url', '')))
        without_images = len(all_products) - with_images
        
        return {
            "total_products": len(all_products),
            "with_images": with_images,
            "without_images": without_images,
            "completion_percent": round((with_images / len(all_products) * 100) if all_products else 0, 1)
        }
    
    return router


if __name__ == "__main__":
    run_scraper()