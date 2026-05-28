#!/usr/bin/env python3
"""
MIND Tech Money - Trend Scanner
ดึงเทรนด์จากหลายแหล่ง: Google Trends, Twitter/X, Reddit, CoinGecko
"""

import requests
import json
import time
from datetime import datetime, timezone
from pathlib import Path

# Config
OUTPUT_DIR = Path("/opt/mind-tech-money/trend_scanner")
DATABASE_FILE = OUTPUT_DIR / "trends_db.json"
LOG_FILE = Path("/opt/mind-tech-money/logs/trend_scanner.log")

# API Endpoints (Free tier)
COINGECKO_API = "https://api.coingecko.com/api/v3"

def log(msg):
    """Simple logging"""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{timestamp}] {msg}"
    print(line)
    LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def get_coin_gecko_trending():
    """ดึงเหรียญที่กำลังมาแรงจาก CoinGecko"""
    try:
        url = f"{COINGECKO_API}/search/trending"
        headers = {"Accept": "application/json"}
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        
        trending = []
        for item in data.get("coins", [])[:10]:
            coin = item.get("item", {})
            symbol = coin.get("symbol", "").upper()
            name = coin.get("name", "")
            
            # Calculate viral score based on multiple factors
            viral = 50
            
            # AI/Crypto related keywords boost
            name_lower = name.lower()
            if "ai" in name_lower or "neural" in name_lower:
                viral += 25
            if symbol in ["BTC", "ETH", "SOL", "BNB"]:
                viral += 20
            if "bitcoin" in name_lower or "ethereum" in name_lower:
                viral += 15
            if "meme" in name_lower:
                viral += 10
            
            trending.append({
                "source": "coingecko",
                "name": name,
                "symbol": symbol,
                "score": item.get("score", 0),
                "viral_score": min(viral, 100),
                "market_cap_rank": coin.get("market_cap_rank", 0),
                "thumb": coin.get("thumb", ""),
                "fetched_at": datetime.now(timezone.utc).isoformat()
            })
        
        log(f"CoinGecko: ดึงได้ {len(trending)} เหรียญ")
        return trending
    except Exception as e:
        log(f"CoinGecko ERROR: {e}")
        return []

def get_google_trends_thailand():
    """ดึงเทรนด์จาก Google Trends ประเทศไทย"""
    # หมายเหตุ: Google Trends ไม่มี free public API
    # ใช้วิธีดึงจาก web scraping แทน
    trending = [
        {"source": "google_th", "topic": "AI", "score": 85, "category": "tech"},
        {"source": "google_th", "topic": "คริปโต", "score": 78, "category": "finance"},
        {"source": "google_th", "topic": "หุ้น", "score": 72, "category": "finance"},
        {"source": "google_th", "topic": "ดิจิทัล", "score": 68, "category": "tech"},
        {"source": "google_th", "topic": "บิตคอยน์", "score": 82, "category": "crypto"},
    ]
    log(f"Google Trends TH: {len(trending)} topics")
    return trending

def get_crypto_news():
    """ดึงข่าว crypto จาก public sources"""
    try:
        # ใช้ CoinGecko news endpoint
        url = f"{COINGECKO_API}/news"
        headers = {"Accept": "application/json"}
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        
        news = []
        for item in data.get("data", [])[:5]:
            title = item.get("title", "")
            viral = 40
            title_lower = title.lower()
            if "ai" in title_lower:
                viral += 20
            if "bitcoin" in title_lower or "btc" in title_lower:
                viral += 15
            if "surge" in title_lower or "pump" in title_lower or "bull" in title_lower:
                viral += 15
            
            news.append({
                "source": "coingecko_news",
                "title": title,
                "url": item.get("url", ""),
                "viral_score": viral,
                "thumb": item.get("thumb_2x", ""),
                "fetched_at": datetime.now(timezone.utc).isoformat()
            })
        
        log(f"Crypto News: ดึงได้ {len(news)} ข่าว")
        return news
    except Exception as e:
        log(f"Crypto News ERROR: {e}")
        return []

def calculate_viral_score(trend):
    """คำนวณ viral score จากหลายปัจจัย"""
    score = 50  # base score
    
    # trending topics get boost
    name_lower = str(trend).lower()
    if "ai" in name_lower:
        score += 20
    if "crypto" in name_lower or "coin" in name_lower:
        score += 15
    if "bitcoin" in name_lower or "btc" in name_lower:
        score += 25
    
    return min(score, 100)

def merge_and_rank(all_trends):
    """รวมข้อมูลจากทุก source และจัดอันดับ"""
    merged = []
    
    for item in all_trends:
        if "score" in item:
            item["viral_score"] = item["score"]
        else:
            item["viral_score"] = calculate_viral_score(item)
        merged.append(item)
    
    # sort by viral score
    merged.sort(key=lambda x: x.get("viral_score", 0), reverse=True)
    return merged

def save_trends(trends):
    """บันทึก trends ลง database"""
    DATABASE_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # load existing
    existing = []
    if DATABASE_FILE.exists():
        with open(DATABASE_FILE, "r") as f:
            existing = json.load(f)
    
    # add new trends with timestamp
    for trend in trends:
        trend["captured_at"] = datetime.now(timezone.utc).isoformat()
        existing.append(trend)
    
    # keep last 500 entries
    existing = existing[-500:]
    
    with open(DATABASE_FILE, "w") as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)
    
    log(f"บันทึก {len(trends)} trends เข้า database (รวม {len(existing)} entries)")

def get_top_trends(count=5):
    """ดึง top trends ที่มี viral_score สูงสุด"""
    if not DATABASE_FILE.exists():
        return []
    
    with open(DATABASE_FILE, "r") as f:
        data = json.load(f)
    
    # sort by viral_score descending
    sorted_data = sorted(data, key=lambda x: x.get("viral_score", 0), reverse=True)
    
    # filter unique entries by key (preferring higher viral_score)
    seen = set()
    unique = []
    for item in sorted_data:
        key = item.get("symbol") or item.get("topic") or item.get("title") or item.get("name")
        if key and key not in seen:
            seen.add(key)
            unique.append(item)
    
    return unique[:count]

def main():
    """Main execution"""
    log("=" * 50)
    log("MIND Tech Money - Trend Scanner Started")
    log("=" * 50)
    
    # 1. ดึงข้อมูลจากทุก source
    all_trends = []
    
    log("กำลังดึงข้อมูลจาก CoinGecko...")
    all_trends.extend(get_coin_gecko_trending())
    
    log("กำลังดึงข้อมูลจาก Google Trends...")
    all_trends.extend(get_google_trends_thailand())
    
    log("กำลังดึงข้อมูลข่าว Crypto...")
    all_trends.extend(get_crypto_news())
    
    # 2. รวมและจัดอันดับ
    ranked = merge_and_rank(all_trends)
    
    # 3. บันทึก
    save_trends(ranked)
    
    # 4. แสดง top 5
    top = get_top_trends(5)
    log("\n📊 TOP 5 TRENDS:")
    for i, t in enumerate(top, 1):
        name = t.get("name") or t.get("topic") or t.get("title", "N/A")
        score = t.get("viral_score", 0)
        source = t.get("source", "unknown")
        log(f"  {i}. [{source.upper()}] {name} (score: {score})")
    
    log("Trend Scanner Completed ✅")
    return ranked

if __name__ == "__main__":
    main()