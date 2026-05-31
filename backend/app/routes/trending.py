"""
Trending router - simplest possible test version.
"""
from fastapi import APIRouter, Query
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/deals")
def get_trending_deals(limit: int = Query(20, ge=1, le=100)):
    """Get trending deals sorted by discount + rating."""
    # HARDCODE TEST - return data immediately without any external calls
    test_data = [
        {
            "id": "test-id-1",
            "name": "Test Product 1",
            "slug": "test-product-1",
            "description": "Test description",
            "image_url": "https://example.com/img.jpg",
            "category_id": "cat-1",
            "created_at": "2026-05-28T12:00:00Z",
            "lowest_price": 1000,
            "highest_rating": 4.5,
            "prices": [
                {"price": 1000, "discount_percent": 20, "rating": 4.5, "sold_count": 100},
                {"price": 1200, "discount_percent": 15, "rating": 4.3, "sold_count": 50},
            ],
        },
        {
            "id": "test-id-2",
            "name": "Test Product 2",
            "slug": "test-product-2",
            "description": "Test description 2",
            "image_url": "https://example.com/img2.jpg",
            "category_id": "cat-2",
            "created_at": "2026-05-28T12:00:00Z",
            "lowest_price": 2000,
            "highest_rating": 4.8,
            "prices": [
                {"price": 2000, "discount_percent": 30, "rating": 4.8, "sold_count": 200},
            ],
        },
    ]
    logger.warning(f"trending/deals: returning HARDCODE {len(test_data)} items")
    return test_data[:limit]