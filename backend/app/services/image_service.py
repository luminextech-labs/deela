"""
Product Image Service
Maps products to relevant images using free sources.
For MVP: uses seed-based URLs for consistency.
Upgrade path: integrate with Lazada/TikTok affiliate APIs.
"""

import hashlib
import urllib.request
import ssl
import json
from typing import Optional, Dict


# Free image CDN URLs that work reliably
IMAGE_CATEGORIES = {
    "iphone": "https://picsum.photos/seed/iphone15/400/400",
    "samsung": "https://picsum.photos/seed/samsung24/400/400",
    "airpods": "https://picsum.photos/seed/airpods/400/400",
    "ipad": "https://picsum.photos/seed/ipad/400/400",
    "macbook": "https://picsum.photos/seed/macbook/400/400",
    "xiaomi": "https://picsum.photos/seed/xiaomi/400/400",
    "dyson": "https://picsum.photos/seed/dyson/400/400",
    "anker": "https://picsum.photos/seed/anker/400/400",
    "logitech": "https://picsum.photos/seed/logitech/400/400",
    "sony": "https://picsum.photos/seed/sonywh/400/400",
    "keyboard": "https://picsum.photos/seed/keyboard/400/400",
    "mouse": "https://picsum.photos/seed/mouse/400/400",
    "tablet": "https://picsum.photos/seed/tablet/400/400",
    "watch": "https://picsum.photos/seed/applewatch/400/400",
    "earphone": "https://picsum.photos/seed/earphone/400/400",
    "speaker": "https://picsum.photos/seed/speaker/400/400",
    "camera": "https://picsum.photos/seed/camera/400/400",
    "laptop": "https://picsum.photos/seed/laptop/400/400",
    "tv": "https://picsum.photos/seed/tv/400/400",
    "headphone": "https://picsum.photos/seed/headphone/400/400",
    "default": "https://picsum.photos/seed/tech/400/400",
}

# Specific product to image mappings for high-priority products
SPECIFIC_PRODUCT_IMAGES = {
    "iphone 15": "https://picsum.photos/seed/iphone15pro/400/400",
    "iphone 16": "https://picsum.photos/seed/iphone16pro/400/400",
    "samsung galaxy s24": "https://picsum.photos/seed/samsung24ultra/400/400",
    "airpods pro": "https://picsum.photos/seed/airpodspro2/400/400",
    "airpods": "https://picsum.photos/seed/airpods2/400/400",
    "ipad pro": "https://picsum.photos/seed/ipadpro2024/400/400",
    "macbook air": "https://picsum.photos/seed/macbookairm3/400/400",
    "macbook pro": "https://picsum.photos/seed/macbookprom4/400/400",
    "dyson airwrap": "https://picsum.photos/seed/dysonairwrap/400/400",
    "sony wh-1000xm5": "https://picsum.photos/seed/sonywh1000xm5/400/400",
    "logitech g304": "https://picsum.photos/seed/logitechg304/400/400",
    "anker soundcore": "https://picsum.photos/seed/ankersoundcore/400/400",
    "xiaomi redmi note 13": "https://picsum.photos/seed/xiaomiredminote13/400/400",
    "apple watch": "https://picsum.photos/seed/applewatchultra/400/400",
}


def get_product_image_url(product_name: str) -> str:
    """
    Get the best image URL for a product based on its name.
    Uses a mapping system to provide relevant category images.
    
    Args:
        product_name: Name of the product
        
    Returns:
        Image URL (picsum.photos with seed)
    """
    name_lower = product_name.lower()
    
    # Check specific product mappings first (highest priority)
    for product_key, image_url in SPECIFIC_PRODUCT_IMAGES.items():
        if product_key in name_lower:
            return image_url
    
    # Check category keywords
    for keyword, image_url in IMAGE_CATEGORIES.items():
        if keyword in name_lower:
            return image_url
    
    # Default fallback
    return IMAGE_CATEGORIES["default"]


def get_image_for_product_category(category: str) -> str:
    """Get image URL based on category name."""
    category_lower = category.lower()
    for keyword, image_url in IMAGE_CATEGORIES.items():
        if keyword in category_lower:
            return image_url
    return IMAGE_CATEGORIES["default"]


def generate_affiliate_image_url(product_name: str, platform: str = "lazada") -> str:
    """
    Generate affiliate-aware image URL.
    For future: integrate with platform-specific image APIs.
    For now: returns categorized placeholder.
    """
    return get_product_image_url(product_name)


# Test function
def test_image_mapping():
    """Test the image mapping system."""
    test_products = [
        "iPhone 15 (128GB)",
        "Samsung Galaxy S24 Ultra",
        "Apple AirPods Pro 2",
        "Xiaomi Redmi Note 13 Pro",
        "iPad Pro 2024",
        "MacBook Air M3",
        "Dyson Airwrap",
        "Anker Soundcore P20i",
        "Logitech G304 Wireless Mouse",
        "Sony WH-1000XM5",
    ]
    
    print("🖼️  Product Image Mapping Test")
    print("=" * 50)
    
    for product in test_products:
        image_url = get_product_image_url(product)
        print(f"\n{product}")
        print(f"  → {image_url}")


if __name__ == "__main__":
    test_image_mapping()