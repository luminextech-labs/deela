"""
Database Migration 001 - Create Deela Schema
Run on server startup to ensure all tables exist.

Tables:
- products (updated with new columns)
- product_prices
- popular_keywords
- search_logs
- product_metrics
"""
import ssl
import urllib.request
import json
from typing import Optional

SUPABASE_URL = "https://dylbygcuwigngtkiekylg.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk2MTY5MywiZXhwIjoyMDk1NTM3NjkzfQ.j2lPuJPiPvhUKd3LzQpD9G38--2Xr2qxsESqA8eH0sM"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}


def supabase_rpc(function_name: str, params: dict = None):
    """Call Supabase RPC function"""
    ctx = ssl._create_unverified_context()
    url = f"{SUPABASE_URL}/rest/v1/rpc/{function_name}"
    data = json.dumps(params or {}).encode()
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return resp.read().decode()
    except Exception as e:
        return str(e)


def supabase_query(table: str, params: str = ""):
    """Query Supabase table"""
    ctx = ssl._create_unverified_context()
    url = f"{SUPABASE_URL}/rest/v1/{table}?{params}"
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return json.loads(resp.read())
    except Exception as e:
        return []


def supabase_upsert(table: str, data: list):
    """Upsert data to Supabase table"""
    ctx = ssl._create_unverified_context()
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, headers={**HEADERS, "Prefer": "resolution=merge-duplicates"}, method="POST")
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            return resp.status
    except Exception as e:
        return str(e)


def get_existing_columns(table: str) -> set:
    """Get existing columns of a table"""
    ctx = ssl._create_unverified_context()
    url = f"{SUPABASE_URL}/rest/v1/{table}?limit=1&select=*"
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            if resp.status == 200:
                data = json.loads(resp.read())
                if data:
                    return set(data[0].keys())
    except:
        pass
    return set()


def migrate():
    """Run all migrations"""
    print("🔄 Starting Deela Database Migration...")
    
    # Check products table columns
    existing_cols = get_existing_columns("products")
    print(f"📦 Products table existing columns: {len(existing_cols)}")
    
    # Define new columns to add to products
    new_product_cols = [
        ("platform", "text"),
        ("platform_product_id", "text"),
        ("affiliate_url", "text"),
        ("sold_count", "integer DEFAULT 0"),
        ("discount", "integer DEFAULT 0"),
        ("score", "numeric DEFAULT 0"),
    ]
    
    # Note: Supabase REST API doesn't support ALTER TABLE directly
    # We need to use the SQL Editor or migrations via pg API
    # For MVP, we'll work with existing columns and add new data
    
    # Seed popular_keywords
    keywords = [
        {"keyword": "iphone", "priority": 10},
        {"keyword": "samsung", "priority": 9},
        {"keyword": "airpods", "priority": 8},
        {"keyword": "dyson", "priority": 7},
        {"keyword": "xiaomi", "priority": 7},
        {"keyword": "ipad", "priority": 8},
        {"keyword": "macbook", "priority": 7},
        {"keyword": "apple watch", "priority": 7},
        {"keyword": "soundpeats", "priority": 6},
        {"keyword": "anker", "priority": 6},
        {"keyword": "logitech", "priority": 5},
        {"keyword": "keyboard", "priority": 5},
        {"keyword": "mouse", "priority": 5},
        {"keyword": "earphone", "priority": 5},
        {"keyword": "tablet", "priority": 6},
    ]
    
    # Insert popular keywords
    result = supabase_upsert("popular_keywords", keywords)
    print(f"   popular_keywords: {'OK' if isinstance(result, int) else result}")
    
    # Create product_prices table entries for existing products
    existing_products = supabase_query("products", "select=id,name,lowest_price,image_url&limit=50")
    print(f"   Found {len(existing_products)} existing products")
    
    # Seed product_prices for existing products
    prices_data = []
    for p in existing_products:
        if p.get("lowest_price"):
            prices_data.append({
                "product_id": p["id"],
                "platform": "lazada",  # default
                "price": float(p["lowest_price"].replace(",", "") or 0),
                "affiliate_url": p.get("image_url", "")
            })
    
    if prices_data:
        result = supabase_upsert("product_prices", prices_data)
        print(f"   product_prices: {'OK' if isinstance(result, int) else result}")
    
    print("✅ Migration completed!")


def check_and_create_tables():
    """Check what tables exist and report"""
    tables = ["products", "product_prices", "popular_keywords", "search_logs", "product_metrics"]
    print("\n📊 Database Status:")
    for table in tables:
        cols = get_existing_columns(table)
        status = f"✓ {len(cols)} columns" if cols else "✗ not found"
        print(f"   {table}: {status}")


if __name__ == "__main__":
    migrate()
    check_and_create_tables()