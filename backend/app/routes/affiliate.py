"""
Affiliate API routes - Generate tracking links for Shopee, Lazada, TikTok Shop.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from app.database import get_db
from app.models.models import Price, Product
from app.models.schemas import AffiliateRedirectResponse, AffiliateLinkResponse
from app.services.affiliate import generate_affiliate_link

router = APIRouter()


@router.get("/redirect/{price_id}", response_model=AffiliateRedirectResponse)
async def affiliate_redirect(
    price_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Redirect to affiliate link and track the click.
    
    In production, this would log the click and redirect.
    """
    price = db.query(Price).filter(Price.id == price_id).first()
    if not price:
        raise HTTPException(status_code=404, detail="Price not found")
    
    if not price.affiliate_url:
        raise HTTPException(status_code=404, detail="No affiliate URL available")
    
    return AffiliateRedirectResponse(
        redirect_url=price.affiliate_url,
        platform=price.platform
    )


@router.get("/link/{price_id}")
def get_affiliate_link(
    price_id: UUID,
    sub_id: Optional[str] = Query(None, description="Custom SubID for tracking"),
    db: Session = Depends(get_db)
):
    """Get the affiliate link for a specific price entry."""
    price = db.query(Price).filter(Price.id == price_id).first()
    if not price:
        raise HTTPException(status_code=404, detail="Price not found")
    
    product_url = price.product_url or price.affiliate_url or ""
    
    # Generate affiliate link based on platform
    affiliate_url = generate_affiliate_link(price.platform, product_url, sub_id)
    
    return {
        "price_id": str(price_id),
        "platform": price.platform,
        "original_url": product_url,
        "affiliate_url": affiliate_url,
    }


@router.get("/product/{product_id}")
def get_product_affiliate_links(
    product_id: UUID,
    sub_id: Optional[str] = Query(None, description="Custom SubID for tracking"),
    db: Session = Depends(get_db)
):
    """Get affiliate links for all prices of a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    prices = db.query(Price).filter(Price.product_id == product_id).all()
    
    links = []
    for price in prices:
        product_url = price.product_url or price.affiliate_url or ""
        affiliate_url = generate_affiliate_link(price.platform, product_url, sub_id)
        
        links.append({
            "price_id": str(price.id),
            "platform": price.platform,
            "price": float(price.price),
            "original_url": product_url,
            "affiliate_url": affiliate_url,
        })
    
    return {
        "product_id": str(product_id),
        "product_name": product.name,
        "links": links
    }


@router.get("/generate")
def generate_affiliate_links(
    platform: str = Query(..., description="Platform: shopee, lazada, or tiktok"),
    url: str = Query(..., description="Product URL"),
    sub_id: Optional[str] = Query(None, description="Custom SubID for tracking")
):
    """Generate affiliate link for a given platform and URL."""
    affiliate_url = generate_affiliate_link(platform, url, sub_id)
    
    return {
        "platform": platform,
        "original_url": url,
        "affiliate_url": affiliate_url,
        "sub_id": sub_id or "deela"
    }