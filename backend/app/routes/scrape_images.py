"""
Scrape real product images from Lazada search pages.
Updates products.image_url with real Lazada CDN images.
"""
import ssl
import urllib.request
import urllib.parse
import re
import json
import time
from datetime import datetime, timezone

SUPABASE_URL = "https://dtdkjtqwnwqvozkayeps.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk2MTY5MywiZXhwIjoyMDk1NTM3NjkzfQ.j2lPuJPiPvhUKd3LzQpD9G38--2Xr2qxsESqA8eH0sM"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}


def get_products_from_db():
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


def extract_lazada_images(keyword: str, limit: int = 10):
    """
    Scrape product images from Lazada search page.
    Returns list of (name, image_url) tuples.
    """
    ctx = ssl._create_unverified_context()
    
    # Lazada Thailand search URL
    search_url = f"https://www.lazada.co.th/catalog/?q={urllib.parse.quote(keyword)}&page=1"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
    }
    
    results = []
    
    try:
        req = urllib.request.Request(search_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
        
        # Try to find product data in page's JavaScript
        # Lazada embeds product data in __NEXT_DATA__ or a script tag
        
        # Method 1: Extract from script tag with product data
        patterns = [
            # Pattern for image URLs in srcset or data attributes
            r'"image":"(https?:\\/\\/[^"]+?\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)"',
            r'src="(https?:\\/\\/[^"]*?lazada[^"]*?\.(?:jpg|jpeg|png|webp)(?:\?[^"]*)?)"',
            # Pattern for lazada image CDN
            r'(https?:\\/\\/[^"]*?lzd-img[^"]*?\.jpg[^"]*)',
            r'(https?:\\/\\/[^"]*?lazada[^"]*?\/[^"]*?\.jpg[^"]*)',
        ]
        
        found_images = set()
        for pattern in patterns:
            matches = re.findall(pattern, html, re.IGNORECASE)
            for m in matches:
                # Clean up escaped slashes
                img_url = m.replace('\\/', '/')
                if 'unsplash' not in img_url and 'placeholder' not in img_url.lower():
                    found_images.add(img_url)
        
        print(f"  Found {len(found_images)} potential Lazada images for '{keyword}'")
        
        # For now, return the first few valid images
        # In production, we'd match these to products by keyword
        for img in list(found_images)[:limit]:
            results.append((keyword, img))
            
    except Exception as e:
        print(f"  Error scraping Lazada for '{keyword}': {e}")
    
    return results


def scrape_lazada_for_keyword(keyword: str, limit: int = 5):
    """
    More aggressive scraping using Lazada's internal API.
    """
    ctx = ssl._create_unverified_context()
    
    # Try the Lazada search API that the frontend uses
    api_url = f"https://www.lazada.co.th/i18n/echo/?service=search&q={urllib.parse.quote(keyword)}&pageSize={limit}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json",
        "Referer": "https://www.lazada.co.th/",
    }
    
    try:
        req = urllib.request.Request(api_url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            data = json.loads(resp.read())
            if isinstance(data, dict) and 'items' in data:
                items = data.get('items', [])
                results = []
                for item in items:
                    name = item.get('name', item.get('title', ''))
                    # Try different image field names
                    image_url = (
                        item.get('image') or 
                        item.get('imageUrl') or 
                        item.get('thumbnail') or
                        item.get('coverImage') or
                        item.get('productImage') or
                        ''
                    )
                    if image_url and 'unsplash' not in image_url:
                        results.append((name, image_url))
                return results
    except Exception as e:
        print(f"  API approach failed for '{keyword}': {e}")
    
    # Fallback: Try direct search page scraping
    return extract_lazada_images(keyword, limit)


def main():
    print("🚀 Lazada Image Scraper for Deela")
    print("=" * 50)
    
    # Get products from database
    print("\n📦 Fetching products from database...")
    products = get_products_from_db()
    print(f"   Found {len(products)} products")
    
    # Group products by keyword (first word of name)
    keywords = set()
    for p in products:
        name_lower = p['name'].lower()
        for kw in ['iphone', 'samsung', 'airpods', 'xiaomi', 'dyson', 'ipad', 'macbook', 'anker', 'logitech', 'keyboard', 'mouse', 'tablet']:
            if kw in name_lower:
                keywords.add(kw)
                break
        else:
            # Use first word as keyword
            first_word = name_lower.split()[0] if ' ' in name_lower else name_lower
            keywords.add(first_word)
    
    print(f"\n🔍 Keywords to scrape: {sorted(keywords)}")
    
    # Scrape images for each keyword
    all_images = {}
    for kw in sorted(keywords):
        print(f"\n📸 Scraping images for '{kw}'...")
        images = scrape_lazada_for_keyword(kw, limit=5)
        print(f"   Found {len(images)} images")
        for name, img_url in images:
            all_images[kw] = img_url
            break  # Take first image for now
        time.sleep(0.5)  # Be nice to Lazada
    
    print(f"\n📊 Total images collected: {len(all_images)}")
    
    # Update products with real images
    print("\n🔄 Updating products with real images...")
    updated = 0
    for product in products:
        name_lower = product['name'].lower()
        matched_kw = None
        
        # Find matching keyword
        for kw in ['iphone', 'samsung', 'airpods', 'xiaomi', 'dyson', 'ipad', 'macbook', 'anker', 'logitech', 'keyboard', 'mouse', 'tablet']:
            if kw in name_lower:
                matched_kw = kw
                break
        
        if matched_kw and matched_kw in all_images:
            new_image = all_images[matched_kw]
            if new_image != product['image_url']:
                success = update_product_image(product['id'], new_image)
                if success:
                    updated += 1
                    print(f"   ✅ Updated {product['name'][:40]}...")
                    print(f"      Old: {product['image_url'][:60]}")
                    print(f"      New: {new_image[:60]}")
    
    print(f"\n✅ Successfully updated {updated} products with real Lazada images!")


if __name__ == "__main__":
    main()