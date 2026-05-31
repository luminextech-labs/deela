"""
Seed script for Deela database.
Run as: python -m app.seed
"""
import uuid
from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import get_settings
from app.models.models import Category, Product, Price

settings = get_settings()
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

CATEGORIES = [
    {"name": "สมาร์ทโฟน", "slug": "smartphones"},
    {"name": "แล็ปท็อป", "slug": "laptops"},
    {"name": "หูฟัง", "slug": "headphones"},
    {"name": "แท็บเล็ต", "slug": "tablets"},
    {"name": "สมาร์ทวอทช์", "slug": "smartwatches"},
    {"name": "เครื่องใช้ในบ้าน", "slug": "home-appliances"},
    {"name": "เกมส์และอุปกรณ์เล่นเกม", "slug": "gaming"},
    {"name": "กล้อง", "slug": "cameras"},
    {"name": "เสื้อผ้า", "slug": "fashion"},
    {"name": "เครื่องสำอาง", "slug": "beauty"},
]

PRODUCTS = [
    {"name": "iPhone 15 (128GB)", "category_slug": "smartphones", "prices": [
        {"platform": "shopee", "price": 27900, "original_price": 31900, "discount_percent": 12, "rating": 4.8, "sold_count": 1250, "affiliate_url": "https://shopee.co.th/iphone15"},
        {"platform": "lazada", "price": 28500, "original_price": 31900, "discount_percent": 10, "rating": 4.7, "sold_count": 890, "affiliate_url": "https://lazada.co.th/iphone15"},
        {"platform": "tiktok", "price": 27200, "original_price": 31900, "discount_percent": 14, "rating": 4.9, "sold_count": 450, "affiliate_url": "https://tiktok.com/iphone15"},
    ]},
    {"name": "Samsung Galaxy S24 Ultra", "category_slug": "smartphones", "prices": [
        {"platform": "shopee", "price": 42900, "original_price": 49900, "discount_percent": 14, "rating": 4.7, "sold_count": 780, "affiliate_url": "https://shopee.co.th/s24ultra"},
        {"platform": "lazada", "price": 43900, "original_price": 49900, "discount_percent": 12, "rating": 4.6, "sold_count": 520, "affiliate_url": "https://lazada.co.th/s24ultra"},
    ]},
    {"name": "Xiaomi Redmi Note 13 Pro", "category_slug": "smartphones", "prices": [
        {"platform": "shopee", "price": 7990, "original_price": 9990, "discount_percent": 20, "rating": 4.5, "sold_count": 2300, "affiliate_url": "https://shopee.co.th/redmi13pro"},
        {"platform": "lazada", "price": 7490, "original_price": 9990, "discount_percent": 25, "rating": 4.4, "sold_count": 1100, "affiliate_url": "https://lazada.co.th/redmi13pro"},
        {"platform": "tiktok", "price": 7290, "original_price": 9990, "discount_percent": 27, "rating": 4.6, "sold_count": 890, "affiliate_url": "https://tiktok.com/redmi13pro"},
    ]},
    {"name": "Anker Soundcore P20i", "category_slug": "headphones", "prices": [
        {"platform": "shopee", "price": 690, "original_price": 1290, "discount_percent": 47, "rating": 4.3, "sold_count": 5800, "affiliate_url": "https://shopee.co.th/p20i"},
        {"platform": "lazada", "price": 750, "original_price": 1290, "discount_percent": 42, "rating": 4.2, "sold_count": 3200, "affiliate_url": "https://lazada.co.th/p20i"},
    ]},
    {"name": "Apple AirPods Pro 2", "category_slug": "headphones", "prices": [
        {"platform": "shopee", "price": 6990, "original_price": 7990, "discount_percent": 12, "rating": 4.8, "sold_count": 2100, "affiliate_url": "https://shopee.co.th/airpodspro2"},
        {"platform": "lazada", "price": 7190, "original_price": 7990, "discount_percent": 10, "rating": 4.7, "sold_count": 1450, "affiliate_url": "https://lazada.co.th/airpodspro2"},
        {"platform": "tiktok", "price": 6790, "original_price": 7990, "discount_percent": 15, "rating": 4.8, "sold_count": 780, "affiliate_url": "https://tiktok.com/airpodspro2"},
    ]},
    {"name": "Samsung Galaxy Buds FE", "category_slug": "headphones", "prices": [
        {"platform": "shopee", "price": 2990, "original_price": 3990, "discount_percent": 25, "rating": 4.4, "sold_count": 1890, "affiliate_url": "https://shopee.co.th/budsfe"},
        {"platform": "lazada", "price": 3190, "original_price": 3990, "discount_percent": 20, "rating": 4.3, "sold_count": 920, "affiliate_url": "https://lazada.co.th/budsfe"},
    ]},
    {"name": "MacBook Air M3 13\"", "category_slug": "laptops", "prices": [
        {"platform": "shopee", "price": 38900, "original_price": 42900, "discount_percent": 9, "rating": 4.9, "sold_count": 620, "affiliate_url": "https://shopee.co.th/mba_m3"},
        {"platform": "lazada", "price": 39500, "original_price": 42900, "discount_percent": 8, "rating": 4.8, "sold_count": 410, "affiliate_url": "https://lazada.co.th/mba_m3"},
    ]},
    {"name": "ASUS ROG Strix G16", "category_slug": "laptops", "prices": [
        {"platform": "shopee", "price": 52900, "original_price": 64900, "discount_percent": 18, "rating": 4.6, "sold_count": 380, "affiliate_url": "https://shopee.co.th/rog_strix"},
        {"platform": "lazada", "price": 54900, "original_price": 64900, "discount_percent": 15, "rating": 4.5, "sold_count": 290, "affiliate_url": "https://lazada.co.th/rog_strix"},
    ]},
    {"name": "Dyson V12 Detect Slim", "category_slug": "home-appliances", "prices": [
        {"platform": "shopee", "price": 18900, "original_price": 22900, "discount_percent": 17, "rating": 4.7, "sold_count": 540, "affiliate_url": "https://shopee.co.th/dyson_v12"},
        {"platform": "lazada", "price": 19500, "original_price": 22900, "discount_percent": 15, "rating": 4.6, "sold_count": 320, "affiliate_url": "https://lazada.co.th/dyson_v12"},
    ]},
    {"name": "iRobot Roomba i3+", "category_slug": "home-appliances", "prices": [
        {"platform": "shopee", "price": 12900, "original_price": 17900, "discount_percent": 28, "rating": 4.4, "sold_count": 890, "affiliate_url": "https://shopee.co.th/roomba_i3"},
        {"platform": "lazada", "price": 13500, "original_price": 17900, "discount_percent": 25, "rating": 4.3, "sold_count": 450, "affiliate_url": "https://lazada.co.th/roomba_i3"},
        {"platform": "tiktok", "price": 12200, "original_price": 17900, "discount_percent": 32, "rating": 4.5, "sold_count": 280, "affiliate_url": "https://tiktok.com/roomba_i3"},
    ]},
    {"name": "Logitech G304", "category_slug": "gaming", "prices": [
        {"platform": "shopee", "price": 890, "original_price": 1390, "discount_percent": 36, "rating": 4.6, "sold_count": 4200, "affiliate_url": "https://shopee.co.th/g304"},
        {"platform": "lazada", "price": 950, "original_price": 1390, "discount_percent": 32, "rating": 4.5, "sold_count": 2800, "affiliate_url": "https://lazada.co.th/g304"},
    ]},
    {"name": "Sony PS5 Slim", "category_slug": "gaming", "prices": [
        {"platform": "shopee", "price": 18990, "original_price": 21990, "discount_percent": 14, "rating": 4.9, "sold_count": 1500, "affiliate_url": "https://shopee.co.th/ps5"},
        {"platform": "lazada", "price": 19200, "original_price": 21990, "discount_percent": 13, "rating": 4.8, "sold_count": 980, "affiliate_url": "https://lazada.co.th/ps5"},
    ]},
    {"name": "iPad Pro M4 11\"", "category_slug": "tablets", "prices": [
        {"platform": "shopee", "price": 34900, "original_price": 38900, "discount_percent": 10, "rating": 4.8, "sold_count": 720, "affiliate_url": "https://shopee.co.th/ipad_pro_m4"},
        {"platform": "lazada", "price": 35500, "original_price": 38900, "discount_percent": 9, "rating": 4.7, "sold_count": 480, "affiliate_url": "https://lazada.co.th/ipad_pro_m4"},
    ]},
    {"name": "Samsung Galaxy Tab S9 FE", "category_slug": "tablets", "prices": [
        {"platform": "shopee", "price": 12900, "original_price": 15900, "discount_percent": 19, "rating": 4.4, "sold_count": 620, "affiliate_url": "https://shopee.co.th/tab_s9fe"},
        {"platform": "lazada", "price": 13500, "original_price": 15900, "discount_percent": 15, "rating": 4.3, "sold_count": 380, "affiliate_url": "https://lazada.co.th/tab_s9fe"},
    ]},
    {"name": "Apple Watch Series 9", "category_slug": "smartwatches", "prices": [
        {"platform": "shopee", "price": 12900, "original_price": 14900, "discount_percent": 13, "rating": 4.8, "sold_count": 1350, "affiliate_url": "https://shopee.co.th/watch_s9"},
        {"platform": "lazada", "price": 13200, "original_price": 14900, "discount_percent": 11, "rating": 4.7, "sold_count": 850, "affiliate_url": "https://lazada.co.th/watch_s9"},
        {"platform": "tiktok", "price": 12500, "original_price": 14900, "discount_percent": 16, "rating": 4.8, "sold_count": 420, "affiliate_url": "https://tiktok.com/watch_s9"},
    ]},
    {"name": "Samsung Galaxy Watch 6", "category_slug": "smartwatches", "prices": [
        {"platform": "shopee", "price": 7990, "original_price": 9990, "discount_percent": 20, "rating": 4.5, "sold_count": 980, "affiliate_url": "https://shopee.co.th/gw6"},
        {"platform": "lazada", "price": 8500, "original_price": 9990, "discount_percent": 15, "rating": 4.4, "sold_count": 620, "affiliate_url": "https://lazada.co.th/gw6"},
    ]},
    {"name": "Sony A7C II", "category_slug": "cameras", "prices": [
        {"platform": "shopee", "price": 95900, "original_price": 109900, "discount_percent": 13, "rating": 4.9, "sold_count": 180, "affiliate_url": "https://shopee.co.th/a7c2"},
        {"platform": "lazada", "price": 97500, "original_price": 109900, "discount_percent": 12, "rating": 4.8, "sold_count": 120, "affiliate_url": "https://lazada.co.th/a7c2"},
    ]},
    {"name": "Nike Air Max 90", "category_slug": "fashion", "prices": [
        {"platform": "shopee", "price": 4590, "original_price": 5500, "discount_percent": 17, "rating": 4.6, "sold_count": 2100, "affiliate_url": "https://shopee.co.th/airmax90"},
        {"platform": "lazada", "price": 4750, "original_price": 5500, "discount_percent": 14, "rating": 4.5, "sold_count": 1450, "affiliate_url": "https://lazada.co.th/airmax90"},
    ]},
    {"name": "SK-II Facial Treatment Essence", "category_slug": "beauty", "prices": [
        {"platform": "shopee", "price": 3450, "original_price": 4200, "discount_percent": 18, "rating": 4.8, "sold_count": 3200, "affiliate_url": "https://shopee.co.th/sk2"},
        {"platform": "lazada", "price": 3600, "original_price": 4200, "discount_percent": 14, "rating": 4.7, "sold_count": 2100, "affiliate_url": "https://lazada.co.th/sk2"},
        {"platform": "tiktok", "price": 3290, "original_price": 4200, "discount_percent": 22, "rating": 4.8, "sold_count": 890, "affiliate_url": "https://tiktok.com/sk2"},
    ]},
]


def make_slug(name: str) -> str:
    import re
    slug = name.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')


def seed():
    db = SessionLocal()
    print("Starting seed...")

    for cat_data in CATEGORIES:
        existing = db.query(Category).filter(Category.slug == cat_data["slug"]).first()
        if existing:
            print(f"  existing: {cat_data['name']}")
        else:
            cat = Category(id=uuid.uuid4(), name=cat_data["name"], slug=cat_data["slug"])
            db.add(cat)
            db.flush()
            print(f"  + created: {cat_data['name']}")

    for prod_data in PRODUCTS:
        slug = make_slug(prod_data["name"])
        existing = db.query(Product).filter(Product.slug == slug).first()
        if existing:
            print(f"  existing: {prod_data['name']}")
            continue

        cat = db.query(Category).filter(Category.slug == prod_data["category_slug"]).first()
        if not cat:
            print(f"  ! missing cat: {prod_data['name']}")
            continue

        product = Product(
            id=uuid.uuid4(),
            name=prod_data["name"],
            slug=slug,
            description=f"{prod_data['name']} - สินค้าคุณภาพดี ราคาถูกที่สุด",
            image_url=f"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
            category_id=cat.id,
            created_at=datetime.utcnow()
        )
        db.add(product)
        db.flush()

        for price_data in prod_data["prices"]:
            price = Price(
                id=uuid.uuid4(),
                product_id=product.id,
                platform=price_data["platform"],
                price=price_data["price"],
                original_price=price_data.get("original_price"),
                discount_percent=price_data.get("discount_percent", 0),
                rating=price_data.get("rating"),
                sold_count=price_data.get("sold_count", 0),
                affiliate_url=price_data.get("affiliate_url"),
                product_url=price_data.get("affiliate_url"),
                created_at=datetime.utcnow()
            )
            db.add(price)
        print(f"  + created: {prod_data['name']} ({len(prod_data['prices'])} prices)")

    db.commit()

    total_products = db.query(Product).count()
    total_prices = db.query(Price).count()
    total_categories = db.query(Category).count()
    print(f"Done: {total_products} products, {total_prices} prices, {total_categories} categories")


if __name__ == "__main__":
    seed()
