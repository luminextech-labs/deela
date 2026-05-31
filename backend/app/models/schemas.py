from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal
from enum import Enum


class Platform(str, Enum):
    SHOPEE = "shopee"
    LAZADA = "lazada"
    TIKTOK = "tiktok"


# Auth
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Category
class CategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True


# Price
class PriceResponse(BaseModel):
    id: UUID
    product_id: UUID
    platform: Platform
    price: Decimal
    original_price: Optional[Decimal] = None
    discount_percent: int = 0
    rating: Optional[Decimal] = None
    sold_count: int = 0
    affiliate_url: Optional[str] = None
    product_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Product
class ProductResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category_id: Optional[UUID] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    prices: List[PriceResponse] = []

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category_id: Optional[UUID] = None
    created_at: datetime
    lowest_price: Optional[Decimal] = None
    highest_rating: Optional[Decimal] = None

    class Config:
        from_attributes = True


# Favorite
class FavoriteCreate(BaseModel):
    product_id: UUID


class FavoriteResponse(BaseModel):
    id: UUID
    user_id: UUID
    product_id: UUID
    created_at: datetime
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True


# Search
class SearchResponse(BaseModel):
    products: List[ProductListResponse]
    total: int
    query: str


# Affiliate
class AffiliateRedirectResponse(BaseModel):
    redirect_url: str
    platform: Platform
