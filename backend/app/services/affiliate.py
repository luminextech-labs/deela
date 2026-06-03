"""
Affiliate service - Generate affiliate links for Shopee, Lazada, TikTok Shop.
"""
import hashlib
import hmac
import time
import urllib.parse
from typing import Optional
import base64
import json

LAZADA_APP_KEY = "105827"
LAZADA_APP_SECRET = "r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF"
LAZADA_USER_TOKEN = "1b50f4e90bf44f7b8bf3a1c67d3cd4cf"

TIKTOK_APP_KEY = "6k6fni5mt91k1"
TIKTOK_APP_SECRET = "e9a07b4299f91f23347df80a86f26a5148d54bf5"


def generate_lazada_affiliate_link(product_url: str, sub_id: Optional[str] = None) -> str:
    """
    Generate Lazada affiliate/deeplink using HasOffers-style format.
    
    Format: https://s.lazada.co.th/s/{shortcode}?url={encoded_product_url}&subid={sub_id}
    """
    base = "https://s.lazada.co.th/s/"
    encoded_subid = urllib.parse.quote(sub_id or "deela", safe='')
    encoded_url = urllib.parse.quote(product_url, safe='')
    return f"{base}?url={encoded_url}&subid={encoded_subid}"


def generate_shopee_affiliate_link(product_url: str, sub_id: Optional[str] = None) -> str:
    """Generate Shopee affiliate link with SubID tracking."""
    sub_id = sub_id or "deela"
    separator = "&" if "?" in product_url else "?"
    return f"{product_url}{separator}subid={urllib.parse.quote(sub_id, safe='')}"


def generate_tiktok_affiliate_link(product_url: str, sub_id: Optional[str] = None) -> str:
    """
    Generate TikTok Shop affiliate link with tracking.
    
    Uses TikTok's partner link format with aff_id parameter.
    """
    sub_id = sub_id or "deela"
    separator = "&" if "?" in product_url else "?"
    return f"{product_url}{separator}aff_id={urllib.parse.quote(sub_id, safe='')}"


def get_tiktok_auth_url(redirect_uri: str = "") -> str:
    """
    Get TikTok OAuth authorization URL for affiliate API access.
    """
    app_key = TIKTOK_APP_KEY
    auth_url = f"https://affiliate.tiktok.com/oauth/authorize?app_key={app_key}&redirect_uri={urllib.parse.quote(redirect_uri)}&response_type=code"
    return auth_url


def generate_tiktok_signature(params: dict) -> str:
    """
    Generate TikTok API signature for authenticated requests.
    """
    # Sort parameters by key
    sorted_params = sorted(params.items())
    # Create query string
    query_string = "&".join([f"{k}={v}" for k, v in sorted_params])
    # Create signature string with app secret
    sign_string = query_string + TIKTOK_APP_SECRET
    # SHA256 hash
    signature = hashlib.sha256(sign_string.encode()).hexdigest()
    return signature


def get_tiktok_access_token(auth_code: str) -> Optional[dict]:
    """
    Exchange authorization code for access token from TikTok Affiliate API.
    
    API endpoint: https://affiliate.tiktok.com/api/v2/auth/token_code
    """
    import requests
    
    url = "https://affiliate.tiktok.com/api/v2/auth/token_code"
    payload = {
        "app_key": TIKTOK_APP_KEY,
        "app_secret": TIKTOK_APP_SECRET,
        "auth_code": auth_code,
        "grant_type": "authorized_code"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            return response.json()
        return None
    except Exception:
        return None


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
        return product_url