"""
Product Image Service - Text-Based Placeholder Version
Uses Japanese placeholder service that works reliably.
"""

import urllib.parse


def get_product_image_url(product_name: str) -> str:
    """
    Generate a placeholder image URL with product name as text overlay.
    Uses placeholder.jp service.
    
    Args:
        product_name: Name of the product
        
    Returns:
        Image URL with text overlay
    """
    # Clean and shorten product name for display
    name = product_name.strip()
    if len(name) > 20:
        name = name[:18] + "..."
    
    # URL encode the text
    encoded_text = urllib.parse.quote(name)
    
    # Get background color based on product category
    bg_color = get_category_color(product_name)
    
    # Use placeholder.jp - format: https://placehold.jp/{width}x{height}.png?text={text}&bg={bg}&color={color}
    return f"https://placehold.jp/400x400.png?text={encoded_text}&bg={bg_color}&color=ffffff&font=size:24"


def get_category_color(product_name: str) -> str:
    """Get background color based on product category."""
    name_lower = product_name.lower()
    
    # Electronics - Blue shades
    if any(k in name_lower for k in ["iphone", "samsung", "xiaomi", "phone", "มือถือ", "สมาร์ทโฟน"]):
        return "1a1a2e"  # Dark blue
    if any(k in name_lower for k in ["ipad", "tablet", "แท็บเล็ต"]):
        return "16213e"  # Navy
    if any(k in name_lower for k in ["macbook", "laptop", "แล็ปท็อป", "คอมพิวเตอร์"]):
        return "0f3460"  # Deep blue
    if any(k in name_lower for k in ["airpods", "headphone", "หูฟัง", "earphone"]):
        return "533483"  # Purple
    if any(k in name_lower for k in ["apple watch", "watch", "นาฬิกา"]):
        return "e94560"  # Red
    if any(k in name_lower for k in ["sony", "ps5", "playstation", "nintendo", "switch", "gaming", "เกม"]):
        return "1b1b2f"  # Almost black
    if any(k in name_lower for k in ["logitech", "mouse", "เมาส์", "keyboard", "คีย์บอร์ด"]):
        return "4a4e69"  # Gray
    if any(k in name_lower for k in ["speaker", "soundbar"]):
        return "264653"  # Teal
    if any(k in name_lower for k in ["camera", "กล้อง"]):
        return "2d4059"  # Slate
    
    # Beauty - Warm colors
    if any(k in name_lower for k in ["sk-ii", "beauty", "serum", "skincare", "moisturizer", "เครื่องสำอาง"]):
        return "ff6b6b"  # Coral
    if any(k in name_lower for k in ["dyson"]):
        return "c9b1ff"  # Light purple
    
    # Anker - Cyan
    if any(k in name_lower for k in ["anker", "soundcore"]):
        return "00b4d8"  # Cyan
    
    # Default tech color
    return "14213d"


def test_image_service():
    """Test the image service."""
    test_products = [
        "iPhone 15 (128GB)",
        "Samsung Galaxy S24 Ultra",
        "Apple AirPods Pro 2",
        "iPad Pro 2024",
        "MacBook Air M3 13\"",
        "Sony PS5 Slim",
        "Sony WH-1000XM5",
        "Logitech G304 Wireless Mouse",
        "Anker Soundcore P20i",
        "Dyson Airwrap",
        "Nintendo Switch OLED",
        "SK-II Facial Treatment Essence",
        "Samsung Galaxy Tab S10 Ultra",
        "แล็ปท็อปสำหรับเกม",
    ]
    
    print("🖼️  Product Image Service (placeholder.jp)")
    print("=" * 60)
    
    for product in test_products:
        image_url = get_product_image_url(product)
        # Extract color from URL for display
        color = image_url.split("bg=")[1].split("&")[0] if "bg=" in image_url else "?"
        print(f"\n{product[:40]}")
        print(f"  #{color} → {image_url}")


if __name__ == "__main__":
    test_image_service()