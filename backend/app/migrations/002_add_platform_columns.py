"""
Database Migration 002 - Add platform columns to products table
"""
import ssl
import urllib.request
import json

SUPABASE_URL = "https://dtdkjtqwnwqvozkayeps.supabase.co"
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
    """
    Add platform columns to products table.
    These columns help track which platform the product came from originally.
    """
    print("🔄 Starting Migration 002 - Add platform columns to products...")
    
    existing_cols = get_existing_columns("products")
    print(f"📦 Products table existing columns: {sorted(existing_cols)}")
    
    new_cols = ["platform", "platform_product_id", "affiliate_url", "sold_count", "discount", "score"]
    missing = [c for c in new_cols if c not in existing_cols]
    
    if missing:
        print(f"❌ Columns missing: {missing}")
        print("⚠️  Cannot ALTER TABLE via Supabase REST API.")
        print("   Please run this SQL in Supabase SQL Editor:")
        print("   ALTER TABLE products ADD COLUMN IF NOT EXISTS platform TEXT;")
        print("   ALTER TABLE products ADD COLUMN IF NOT EXISTS platform_product_id TEXT;")
        print("   ALTER TABLE products ADD COLUMN IF NOT EXISTS affiliate_url TEXT;")
        print("   ALTER TABLE products ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0;")
        print("   ALTER TABLE products ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0;")
        print("   ALTER TABLE products ADD COLUMN IF NOT EXISTS score NUMERIC DEFAULT 0;")
    else:
        print("✅ All required columns exist!")
    
    # Show prices table columns
    price_cols = get_existing_columns("prices")
    print(f"📦 Prices table columns: {sorted(price_cols)}")
    
    return len(missing) == 0


if __name__ == "__main__":
    migrate()