from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.models import Favorite, Product
from app.models.schemas import FavoriteCreate, FavoriteResponse
from app.routes.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=List[FavoriteResponse])
def get_favorites(
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's favorite products."""
    favorites = db.query(Favorite).filter(
        Favorite.user_id == UUID(current_user_id)
    ).all()
    return favorites


@router.post("/", response_model=FavoriteResponse)
def add_favorite(
    favorite: FavoriteCreate,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a product to favorites."""
    product = db.query(Product).filter(Product.id == favorite.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    existing = db.query(Favorite).filter(
        Favorite.product_id == favorite.product_id,
        Favorite.user_id == UUID(current_user_id)
    ).first()
    if existing:
        return existing
    
    new_favorite = Favorite(
        user_id=UUID(current_user_id),
        product_id=favorite.product_id
    )
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    
    return new_favorite


@router.delete("/{product_id}")
def remove_favorite(
    product_id: UUID,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a product from favorites."""
    favorite = db.query(Favorite).filter(
        Favorite.product_id == product_id,
        Favorite.user_id == UUID(current_user_id)
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Removed from favorites"}
