"""
Trending router - TEST VERSION with hardcoded response.
"""
from fastapi import APIRouter, Query
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

TEST_MESSAGE = "TEST_TRENDING_V4_HARDCODED"


@router.get("/deals")
def get_deals(limit: int = Query(20, ge=1, le=100)):
    """Get trending deals sorted by discount + rating."""
    logger.warning(f"trending TEST called with limit={limit}")
    return [
        {
            "test": TEST_MESSAGE,
            "limit": limit,
            "message": "This is a hardcoded response - if you see this, the endpoint is working!"
        }
    ]