from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from uuid import UUID

from app.database import get_db
from app.models.models import Price
from app.models.schemas import AffiliateRedirectResponse
from app.routes.auth import get_current_user_optional

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
    db: Session = Depends(get_db)
):
    """Get the affiliate link without redirecting (for preview)."""
    price = db.query(Price).filter(Price.id == price_id).first()
    if not price:
        raise HTTPException(status_code=404, detail="Price not found")
    
    return {
        "affiliate_url": price.affiliate_url,
        "direct_url": price.product_url,
        "platform": price.platform
    }
