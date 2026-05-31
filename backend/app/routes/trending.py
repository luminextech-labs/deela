"""
Trending router - TEST VERSION with UNIQUE identifier.
"""
from fastapi import APIRouter, Query
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

UNIQUE_TEST_ID = "V7_UNIQUE_$(date +%s)"


@router.get("/deals")
def get_deals(limit: int = Query(20, ge=1, le=100)):
    """Get trending deals sorted by discount + rating."""
    import datetime
    now = datetime.datetime.now().isoformat()
    logger.warning(f"trending V7 called at {now}")
    return {
        "version": "V7_UNIQUE_TEST",
        "deployed_at": now,
        "limit": limit,
        "message": "UNIQUE_TEST_V7 - if you see this message, the endpoint is working!"
    }