"""
Simple test endpoint added directly to main.py.
"""
import logging
logger = logging.getLogger(__name__)

@app.get("/api/simple-test")
def simple_test():
    """Direct test endpoint."""
    logger.warning("simple_test called!")
    return {"test": "simple", "message": "Direct endpoint works!"}