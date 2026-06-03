"""
Affiliate service - Generate affiliate links for Shopee, Lazada, TikTok Shop.
"""
import hashlib
import hmac
import time
import urllib.parse
from typing import Optional

LAZADA_APP_KEY = "105827"
LAZADA_APP_SECRET = "r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF"
LAZADA_USER_TOKEN = "1b50f4e90bf44f7b8bf3a1c67d3cd4cf"


def generate_lazada_affiliate_link(product_url: str, sub_id: Optional[str] = None) -> str:
    """
    Generate Lazada affiliate/deeplink using HasOffers-style format.
    
    Lazada affiliate links use a redirect through their tracking domain.
    Format: https://{tracking_domain}/{deeplink}?url={encoded_product_url}&subid={sub_id}
    
    For Thailand (lazada.co.th), the typical format is:
    https://s.lazada.co.th/s/XXXXX - short link format
    or custom subid tracking.
    """
    # Lazada Thailand affiliate short link domain
    base = "https://s.lazada.co.th/s/"
    
    # Generate a hash for the subid
    if sub_id:
        encoded_subid = urllib.parse.quote(sub_id, safe='')
    else:
        encoded_subid = "deela"
    
    # Encode the product URL
    encoded_url = urllib.parse.quote(product_url, safe='')
    
    # HasOffers-style subid tracking (common for Lazada affiliate)
    # The actual click tracking happens server-side when they use HasOffers
    return f"{base}?url={encoded_url}&subid={encoded_subid}"


def generate_shopee_affiliate_link(product_url: str, sub_id: Optional[str] = None) -> str:
    """
    Generate Shopee affiliate link with SubID tracking.
    
    Shopee Thailand uses: https://shopee.co.th/affiliate/...
    Or regular links with subid parameter appended.
    """
    if sub_id is None:
        sub_id = "deela"
    
    # Shopee uses 'subid' parameter for affiliate tracking
    separator = "&" if "?" in product_url else "?"
    return f"{product_url}{separator}subid={urllib.parse.quote(sub_id, safe='')}"


def generate_tiktok_affiliate_link(product_url: str, sub_id: Optional[str] = None) -> str:
    """
    Generate TikTok Shop affiliate link with tracking.
    
    TikTok Shop uses: https://tiktok.com/@shop/product/{id}
    Affiliate tracking via custom parameters or TikTok's partner program.
    """
    if sub_id is None:
        sub_id = "deela"
    
    # TikTok uses 'sub_id' or 'aff_id' parameter
    separator = "&" if "?" in product_url else "?"
    return f"{product_url}{separator}aff_id={urllib.parse.quote(sub_id, safe='')}"


def generate_affiliate_link(platform: str, product_url: str, sub_id: Optional[str] = None) -> str:
    """Generate affiliate link based on platform."""
    platform = platform.lower()
    
    if "lazada" in platform:
        return generate_lazada_affiliate_link(product_url, sub_id)
    elif "shopee" in platform:
        return generate_shopee_affiliate_link(product_url, sub_id)
    elif "tiktok" in platform:
        return generate_tiktok_affiliate_link(product_url, sub_id)
    else:
        # Return original URL if platform not recognized
        return product_url