from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routes import auth, products, categories, favorites, affiliate, trending, seed, products_rest, scrape, debug, standalone

settings = get_settings()

app = FastAPI(
    title="Deela API",
    description="AI Shopping Assistant for Thai Market",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(categories.router, prefix="/api/categories", tags=["Categories"])
app.include_router(favorites.router, prefix="/api/favorites", tags=["Favorites"])
app.include_router(affiliate.router, prefix="/api/affiliate", tags=["Affiliate"])
app.include_router(trending.router, prefix="/api/trending", tags=["Trending"])
app.include_router(seed.router, prefix="/api/seed", tags=["Seed"])
app.include_router(products_rest.router, prefix="/api/v2", tags=["ProductsV2"])
app.include_router(scrape.router, prefix="/api/scrape", tags=["Scrape"])
app.include_router(debug.router, prefix="/api", tags=["Debug"])
app.include_router(standalone.router, prefix="/api", tags=["Standalone"])


@app.get("/")
def root():
    return {"message": "Deela API is running", "version": "0.1.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/debug/db")
def debug_db():
    """Debug endpoint - test DB connection."""
    from app.config import get_settings
    settings = get_settings()
    try:
        from sqlalchemy import create_engine, text
        engine = create_engine(settings.database_url, pool_pre_ping=True)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as ok"))
            row = result.fetchone()
        return {"db_status": "ok", "database_url": settings.database_url[:50] + "..."}
    except Exception as e:
        return {"db_status": "error", "error": str(e), "database_url": settings.database_url[:50] + "..."}


@app.get("/debug/trending")
def debug_trending():
    """Debug endpoint - test trending with urllib."""
    import ssl
    import urllib.request
    import json
    import os
    
    SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dtdkjtqwnwqvozkayeps.supabase.co")
    ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjE2OTMsImV4cCI6MjA5NTUzNzY5M30.6tA5yXBxtG618IqCVo6N8lBml96ssUBFrRF7ft6t4ks"
    
    try:
        key = os.getenv("SUPABASE_SERVICE_KEY") or ANON_KEY
        headers = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
        ctx = ssl._create_unverified_context()
        params = "select=id,name,prices(price,discount_percent,rating,sold_count)&limit=5"
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/products?{params}",
            headers=headers,
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
            except Exception:
                continue
        
        scored.sort(key=lambda x: x[0], reverse=True)
        return {"status": "ok", "products": len(products), "scored": len(scored), "top3": scored[:3]}
    except Exception as e:
        import traceback
        return {"status": "error", "error": str(e), "trace": traceback.format_exc()[:500]}