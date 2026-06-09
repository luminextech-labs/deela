"""
Lazada Product Image Scraper
Uses Playwright (headless Chrome) to scrape real product images from Lazada.
Run this as a cron job or manual trigger to update product images.
"""
import os
import sys
import json
import ssl
import re
import time
import random
from datetime import datetime, timezone
from typing import Optional, List, Dict

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from playwright.sync_api import sync_playwright


SUPABASE_URL = "https://dtdkjtqwnwqvozkayeps.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk2MTY5MywiZXhwIjoyMDk1NTM3NjkzfQ.j2lPuJPiPvhUKd3LzQpD9G38--2Xr2qxsESqA8eH0sM"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

# Keywords to scrape images for
KEYWORDS = [
    "iphone 15 pro max",
    "samsung galaxy s24 ultra", 
    "apple airpods pro 2",
    "xiaomi redmi note 13 pro",
    "ipad pro 2024",
    "macbook air m3",
    "dyson airwrap",
    "anker soundcore",
    "logitech g304",
    "sony wh-1000xm5",
]


def get_products_from_db() -> List[Dict]:
    """Get all products from database"""
    ctx = ssl._create_unverified_context()
    url = f"{SUPABASE_URL}/rest/v1/products?select=id,name,slug,image_url"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f"Error fetching products: {e}")
        return []


def update_product_image(product_id: str, image_url: str) -> bool:
    """Update product image_url in database"""
    ctx = ssl._create_unverified_context()
    url = f"{SUPABASE_URL}/rest/v1/products?id=eq.{product_id}"
    data = json.dumps({"image_url": image_url}).encode()
    req = urllib.request.Request(url, data=data, headers={**HEADERS, "Prefer": "return=minimal"}, method="PATCH")
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return resp.status == 204
    except Exception as e:
        print(f"Error updating product {product_id}: {e}")
        return False


def scrape_lazada_images(keyword: str, headless: bool = True) -> List[Dict[str, str]]:
    """
    Use Playwright to scrape product images from Lazada search results.
    Returns list of dicts with 'name' and 'image_url' keys.
    """
    results = []
    search_url = f"https://www.lazada.co.th/catalog/?q={keyword.replace(' ', '+')}&page=1"
    
    print(f"  Scraping Lazada for: {keyword}")
    print(f"  URL: {search_url}")
    
    with sync_playwright() as p:
        # Launch Chromium (headless by default on servers)
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport={'width': 1920, 'height': 1080},
        )
        page = context.new_page()
        
        try:
            # Navigate to Lazada search page
            page.goto(search_url, wait_until='networkidle', timeout=30000)
            
            # Wait for products to load (JavaScript rendering)
            page.wait_for_selector('.card', timeout=10000)
            
            # Scroll to load more products
            for _ in range(2):
                page.evaluate('window.scrollBy(0, 500)')
                time.sleep(0.5)
            
            # Extract product data from search results
            # Lazada uses different class names - try multiple patterns
            
            # Pattern 1: Generic product cards
            product_cards = page.query_selector_all('[data-qa-lazada="item"]')
            if not product_cards:
                product_cards = page.query_selector_all('.card')
            
            if not product_cards:
                # Try to find any image-containing elements
                product_cards = page.query_selector_all('[class*="product"]')
            
            print(f"  Found {len(product_cards)} product cards")
            
            for card in product_cards[:10]:  # Limit to 10 products per keyword
                try:
                    # Try to extract image URL
                    img = card.query_selector('img')
                    if img:
                        image_url = img.get_attribute('src') or img.get_attribute('data-src')
                        if image_url and 'lazada' in image_url.lower():
                            # Extract product name
                            name_elem = card.query_selector('[class*="title"], [class*="name"], .card-title')
                            name = name_elem.inner_text() if name_elem else keyword
                            
                            results.append({
                                'name': name.strip(),
                                'image_url': image_url
                            })
                            print(f"    Product: {name[:40]}...")
                            print(f"    Image: {image_url[:80]}...")
                except Exception as e:
                    continue
            
        except Exception as e:
            print(f"  Error scraping {keyword}: {e}")
        
        finally:
            browser.close()
    
    return results


def match_and_update_products(products: List[Dict], scraped_data: Dict[str, str]):
    """
    Match scraped images to products in database based on keyword in name.
    Update products with real Lazada images.
    """
    updated_count = 0
    
    for product in products:
        name_lower = product['name'].lower()
        matched_image = None
        
        # Find matching scraped image based on keyword
        for keyword, image_url in scraped_data.items():
            if keyword.lower() in name_lower:
                matched_image = image_url
                break
        
        if matched_image and matched_image != product.get('image_url'):
            # Check it's not a placeholder
            if 'unsplash' not in matched_image.lower() and 'placeholder' not in matched_image.lower():
                success = update_product_image(product['id'], matched_image)
                if success:
                    updated_count += 1
                    print(f"  ✅ Updated: {product['name'][:50]}")
                    print(f"     Image: {matched_image[:80]}")
    
    return updated_count


def main():
    print("=" * 60)
    print("🚀 Lazada Product Image Scraper")
    print("=" * 60)
    print(f"Started at: {datetime.now(timezone.utc).isoformat()}")
    
    # Get products from database
    print("\n📦 Fetching products from database...")
    products = get_products_from_db()
    print(f"   Found {len(products)} products in database")
    
    # Scrape images for each keyword
    scraped_images = {}
    for keyword in KEYWORDS:
        print(f"\n📸 Scraping: {keyword}")
        try:
            images = scrape_lazada_images(keyword)
            if images:
                # Use first image for this keyword
                scraped_images[keyword] = images[0]['image_url']
                print(f"   ✅ Got image: {images[0]['image_url'][:80]}")
            else:
                print(f"   ⚠️ No images found")
        except Exception as e:
            print(f"   ❌ Error: {e}")
        
        # Be nice - add random delay between requests
        time.sleep(random.uniform(1, 3))
    
    print(f"\n📊 Scraped {len(scraped_images)} images")
    
    # Update products with real images
    print("\n🔄 Updating products with real images...")
    updated = match_and_update_products(products, scraped_images)
    
    print(f"\n✅ Successfully updated {updated} products with real Lazada images!")
    print(f"Finished at: {datetime.now(timezone.utc).isoformat()}")


if __name__ == "__main__":
    import urllib.request
    main()