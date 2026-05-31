"""
Scraper API routes.
POST /api/scrape - scrape prices for a product query
POST /api/scrape/url - scrape a specific product URL
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
import asyncio

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.services.scraper import scrape_all, scrape_product_url

router = APIRouter()


class ScrapeRequest(BaseModel):
    query: str
    platforms: Optional[list[str]] = None  # filter: shopee, lazada, tiktok


class ScrapeResult(BaseModel):
    platform: str
    price: int
    url: str
    original_price: Optional[int] = None
    discount_percent: Optional[int] = None


@router.post("/scrape")
async def scrape_product(req: ScrapeRequest):
    """Scrape prices for a product query from all platforms."""
    try:
        results = await scrape_all(req.query)
        
        processed = []
        for r in results:
            processed.append(ScrapeResult(
                platform=r.get("platform", ""),
                price=r.get("price", 0),
                url=r.get("url", ""),
            ))
        
        if not processed:
            raise HTTPException(status_code=404, detail="ไม่พบราคาจากเว็บไซต์ใดๆ")
        
        return {"query": req.query, "results": processed}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping error: {str(e)}")


@router.post("/scrape/url")
async def scrape_url(url: str = Query(...), platform: str = Query(...)):
    """Scrape a specific product URL."""
    if platform not in ["shopee", "lazada"]:
        raise HTTPException(status_code=400, detail="Platform must be shopee or lazada")
    
    result = await scrape_product_url(url, platform)
    
    if not result:
        raise HTTPException(status_code=404, detail="ไม่พบราคาสินค้า")
    
    return result
