from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routes import auth, products, categories, favorites, affiliate, trending, seed, products_rest, scrape, debug

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