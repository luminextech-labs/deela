"""
Test endpoint - completely standalone path.
"""
from fastapi import APIRouter
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/test-standalone")
def test_standalone():
    """Test endpoint that should work immediately."""
    logger.warning("test_standalone called!")
    return {
        "test": "standalone",
        "message": "If you see this, the standalone path works!",
        "timestamp": "2026-05-31T00:00:00Z"
    }