"""
Product Image Service - Enhanced Version
Maps products to relevant images using seed-based URLs.
"""

# Exact product mappings (highest priority)
EXACT_PRODUCT_IMAGES = {
    # Apple
    "iphone 15": "https://picsum.photos/seed/iphone15/400/400",
    "iphone 16": "https://picsum.photos/seed/iphone16pro/400/400",
    "iphone 14": "https://picsum.photos/seed/iphone14/400/400",
    "airpods pro": "https://picsum.photos/seed/airpodspro2/400/400",
    "airpods": "https://picsum.photos/seed/airpods2/400/400",
    "ipad pro": "https://picsum.photos/seed/ipadpro/400/400",
    "ipad air": "https://picsum.photos/seed/ipadair/400/400",
    "ipad": "https://picsum.photos/seed/ipad/400/400",
    "macbook air": "https://picsum.photos/seed/macbookair/400/400",
    "macbook pro": "https://picsum.photos/seed/macbookpro/400/400",
    "macbook": "https://picsum.photos/seed/macbook/400/400",
    "apple watch": "https://picsum.photos/seed/applewatch/400/400",
    "imac": "https://picsum.photos/seed/imac/400/400",
    "magic keyboard": "https://picsum.photos/seed/magickeyboard/400/400",
    
    # Samsung
    "samsung galaxy s24": "https://picsum.photos/seed/samsungs24/400/400",
    "samsung galaxy s23": "https://picsum.photos/seed/samsungs23/400/400",
    "samsung galaxy z": "https://picsum.photos/seed/samsungfold/400/400",
    "samsung galaxy tab": "https://picsum.photos/seed/samsungtab/400/400",
    "samsung galaxy watch": "https://picsum.photos/seed/samsungwatch/400/400",
    "samsung galaxy": "https://picsum.photos/seed/samsungphone/400/400",
    "samsung": "https://picsum.photos/seed/samsung/400/400",
    
    # Sony
    "ps5": "https://picsum.photos/seed/ps5console/400/400",
    "playstation 5": "https://picsum.photos/seed/ps5console/400/400",
    "sony wh-1000xm": "https://picsum.photos/seed/sonyheadphones/400/400",
    "sony": "https://picsum.photos/seed/sony/400/400",
    
    # Xiaomi
    "xiaomi redmi note": "https://picsum.photos/seed/xiaomiredmi/400/400",
    "xiaomi": "https://picsum.photos/seed/xiaomi/400/400",
    "redmi": "https://picsum.photos/seed/redmi/400/400",
    "poco": "https://picsum.photos/seed/poco/400/400",
    
    # Apple Beauty/Skincare
    "sk-ii": "https://picsum.photos/seed/skii/400/400",
    "skin care": "https://picsum.photos/seed/skincare/400/400",
    "serum": "https://picsum.photos/seed/serum/400/400",
    "moisturizer": "https://picsum.photos/seed/moisturizer/400/400",
    "beauty": "https://picsum.photos/seed/beauty/400/400",
    "cosmetics": "https://picsum.photos/seed/cosmetics/400/400",
    
    # Dyson
    "dyson airwrap": "https://picsum.photos/seed/dysonairwrap/400/400",
    "dyson": "https://picsum.photos/seed/dyson/400/400",
    
    # Logitech
    "logitech g304": "https://picsum.photos/seed/logitechg304/400/400",
    "logitech g": "https://picsum.photos/seed/logitechg/400/400",
    "logitech": "https://picsum.photos/seed/logitech/400/400",
    
    # Anker
    "anker soundcore": "https://picsum.photos/seed/ankersoundcore/400/400",
    "anker": "https://picsum.photos/seed/anker/400/400",
    
    # Gaming
    "gaming laptop": "https://picsum.photos/seed/gaminglaptop/400/400",
    "gaming": "https://picsum.photos/seed/gaming/400/400",
    "laptop": "https://picsum.photos/seed/laptop/400/400",
    
    # Tablet
    "tablet": "https://picsum.photos/seed/tablet/400/400",
    "แท็บเล็ต": "https://picsum.photos/seed/tablet/400/400",
    
    # Audio
    "headphone": "https://picsum.photos/seed/headphone/400/400",
    "earphone": "https://picsum.photos/seed/earphone/400/400",
    "speaker": "https://picsum.photos/seed/speaker/400/400",
    "soundbar": "https://picsum.photos/seed/soundbar/400/400",
    
    # Camera
    "camera": "https://picsum.photos/seed/camera/400/400",
    "sony a": "https://picsum.photos/seed/sonycamera/400/400",
    
    # Nintendo
    "nintendo": "https://picsum.photos/seed/nintendo/400/400",
    "switch": "https://picsum.photos/seed/nintendoswitch/400/400",
    
    # Default
    "default": "https://picsum.photos/seed/techproduct/400/400",
}

# Category fallback order
CATEGORY_FALLBACK = [
    "iphone", "samsung", "ipad", "macbook", "airpods",
    "sony", "dyson", "anker", "logitech", "xiaomi",
    "headphone", "speaker", "camera", "gaming", "laptop", "tablet",
    "beauty", "skincare", "default"
]


def get_product_image_url(product_name: str) -> str:
    """
    Get the best image URL for a product based on its name.
    
    Priority:
    1. Exact product match
    2. Brand keyword match
    3. Category keyword match
    4. Default fallback
    """
    name_lower = product_name.lower()
    
    # 1. Check exact product matches
    for key, image_url in EXACT_PRODUCT_IMAGES.items():
        if key in name_lower:
            return image_url
    
    # 2. Check brand keywords
    brand_keywords = ["apple", "samsung", "sony", "xiaomi", "dyson", "logitech", "anker", "nintendo"]
    for brand in brand_keywords:
        if brand in name_lower:
            return EXACT_PRODUCT_IMAGES.get(brand, EXACT_PRODUCT_IMAGES["default"])
    
    # 3. Check category keywords
    for category in CATEGORY_FALLBACK:
        if category in name_lower:
            return EXACT_PRODUCT_IMAGES.get(category, EXACT_PRODUCT_IMAGES["default"])
    
    # 4. Thai/English product type keywords
    thai_keywords = {
        "แล็ปท็อป": "laptop",
        "โน้ตบุ๊ก": "laptop",
        "สมาร์ทโฟน": "smartphone",
        "มือถือ": "smartphone",
        "หูฟัง": "headphone",
        "คีย์บอร์ด": "keyboard",
        "เมาส์": "mouse",
        "กล้อง": "camera",
    }
    for thai, eng in thai_keywords.items():
        if thai in name_lower:
            return EXACT_PRODUCT_IMAGES.get(eng, EXACT_PRODUCT_IMAGES["default"])
    
    # 4. Default fallback
    return EXACT_PRODUCT_IMAGES["default"]


def test_mappings():
    """Test the image mapping system."""
    test_products = [
        # Apple products
        "iPhone 15 (128GB)",
        "Apple AirPods Pro 2",
        "iPad Pro 2024",
        "MacBook Air M3 13\"",
        "Apple Watch Ultra 2",
        
        # Samsung products
        "Samsung Galaxy S24 Ultra",
        "Samsung Galaxy Tab S10 Ultra",
        "Samsung Galaxy Watch 6",
        
        # Sony
        "Sony PS5 Slim",
        "Sony WH-1000XM5",
        
        # Xiaomi
        "Xiaomi Redmi Note 13 Pro",
        
        # Beauty
        "SK-II Facial Treatment Essence",
        
        # Gaming
        "แล็ปท็อปสำหรับเกม",
        "Nintendo Switch OLED",
        
        # Audio
        "Anker Soundcore P20i",
        "Logitech G304 Wireless Mouse",
    ]
    
    print("🖼️  Product Image Mapping Test (Enhanced)")
    print("=" * 60)
    
    for product in test_products:
        image_url = get_product_image_url(product)
        short_url = image_url.replace("https://picsum.photos/seed/", "").replace("/400/400", "")
        print(f"\n{product[:45]}")
        print(f"  → {short_url}")


if __name__ == "__main__":
    test_mappings()