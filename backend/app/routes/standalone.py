"""
Standalone test - unique path with no chance of collision.
"""
from fastapi import APIRouter
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/uniquepath123/deals")
def get_deals():
    """Unique test path."""
    now = datetime.now().isoformat()
    logger.warning(f"UNIQUE_PATH deals called at {now}")
    return {
        "version": "UNIQUE_V8",
        "deployed_at": now,
        "message": "If you see this, UNIQUE_PATH works!"
    }