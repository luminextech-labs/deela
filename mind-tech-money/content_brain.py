#!/usr/bin/env python3
"""
MIND Tech Money - Content Brain
สร้าง script อัตโนมัติจาก trending topics
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

# Config
PROJECT_DIR = Path("/opt/mind-tech-money")
TRENDS_DB = PROJECT_DIR / "trend_scanner" / "trends_db.json"
OUTPUT_DIR = PROJECT_DIR / "content"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Prompt templates
SCRIPT_PROMPT = """เขียน script วิดีโอสั้น 45-60 วินาที สำหรับ YouTube Shorts/TikTok

หัวข้อ: {topic}
ประเภท: {category}
ผู้ชมเป้าหมาย: คนไทยที่สนใจ {niche}

รูปแบบ:
- Hook 3 วินาทีแรก (สุดท้าย)
- เนื้อหาหลัก 40-50 วินาที
- Disclaimer + CTA ท้ายคลิป

สไตล์: เร็ว, กระชับ, ให้ความรู้, มีตัวเลขน่าสนใจ

กำหนด structure:
1. HOOK: "คนส่วนใหญ่ไม่รู้ว่า..."
2. MAIN: ข้อมูลหลัก 3 ข้อ
3. CLOSE: สรุป + CTA

**ห้ามให้คำแนะนำการลงทุนโดยตรง ต้องมี disclaimer ทุกครั้ง**

Output เป็น JSON format:
{{
  "title": "ชื่อคลิป",
  "hook": "hook สำหรับ 3 วินาทีแรก",
  "script": "สคริปต์เต็ม",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "disclaimer": "ความคิดเห็นในวีดีโอนี้ไม่ใช่คำแนะนำทางการเงิน การลงทุนมีความเสี่ยง โปรดใช้วิจารณญาณ"
}}
"""

HASHTAG_TEMPLATES = {
    "crypto": ["#คริปโต", "#เหรียญ", "#บิตคอยน์", "#ETH", "#Solana", "#AI", "#เทรด", "#ลงทุน", "#MINDTechMoney"],
    "ai": ["#AI", "#ปัญญาประดิษฐ์", "#เทคโนโลยี", "#ChatGPT", "#มนุษย์ยนต์", "#MINDTechMoney", "#อนาคต"],
    "tech": ["#เทคโนโลยี", "#ดิจิทัล", "#ไอที", "#นวัตกรรม", "#MINDTechMoney", "#อนาคต"],
    "finance": ["#การเงิน", "#ลงทุน", "#เงิน", "#หุ้น", "#ประหยัด", "#MINDTechMoney", "#เศรษฐกิจ"],
}

CATEGORY_MAP = {
    "crypto": "คริปโตและเหรียญดิจิทัล",
    "coin": "คริปโตและเหรียญดิจิทัล",
    "ai": "AI และเทคโนโลยี",
    "บิตคอยน์": "คริปโตและเหรียญดิจิทัล",
    "คริปโต": "คริปโตและเหรียญดิจิทัล",
    "หุ้น": "การเงินและหุ้น",
    "ดิจิทัล": "เทคโนโลยีดิจิทัล",
    "tech": "เทคโนโลยี",
}

def get_top_trends():
    """ดึง top 3 trends ล่าสุด"""
    if not TRENDS_DB.exists():
        print("ยังไม่มี trends database - รัน trend_scanner.py ก่อน")
        return []
    
    with open(TRENDS_DB, "r") as f:
        data = json.load(f)
    
    # sort by viral score
    sorted_data = sorted(data, key=lambda x: x.get("viral_score", 0), reverse=True)
    
    # get top 3 unique
    seen = set()
    unique = []
    for item in sorted_data:
        key = item.get("symbol") or item.get("topic") or item.get("title") or item.get("name")
        if key and key not in seen:
            seen.add(key)
            unique.append(item)
        if len(unique) >= 3:
            break
    
    return unique

def determine_category(trend):
    """กำหนด category จาก trend"""
    name = str(trend.get("name", "") or trend.get("topic", "") or trend.get("title", "")).lower()
    
    for key, cat in CATEGORY_MAP.items():
        if key in name:
            return cat
    return "AI และเทคโนโลยี"

def get_hashtags(category):
    """ดึง hashtags ที่เหมาะกับ category"""
    for key in HASHTAG_TEMPLATES:
        if key in category.lower():
            return HASHTAG_TEMPLATES[key][:5]
    return HASHTAG_TEMPLATES["ai"][:5]

def main():
    print("=" * 50)
    print("MIND Tech Money - Content Brain")
    print("=" * 50)
    
    # Get top trends
    trends = get_top_trends()
    
    if not trends:
        print("ไม่พบ trends - กรุณารัน trend_scanner.py ก่อน")
        sys.exit(1)
    
    print(f"พบ {len(trends)} trends ล่าสุด:")
    for i, t in enumerate(trends, 1):
        name = t.get("name") or t.get("topic") or t.get("title", "?")
        print(f"  {i}. {name} (viral: {t.get('viral_score', 0)})")
    
    print()
    
    # Generate script for each trend
    for i, trend in enumerate(trends, 1):
        topic = trend.get("name") or trend.get("topic") or trend.get("title", "?")
        category = determine_category(trend)
        hashtags = get_hashtags(category)
        
        print(f"กำลังสร้าง script สำหรับ: {topic}")
        
        # Create prompt
        prompt = SCRIPT_PROMPT.format(
            topic=topic,
            category=category,
            niche="AI, Crypto, เทคโนโลยี และการเงิน"
        )
        
        # In production, this would call OpenAI/MiniMax API
        # For now, generate structure template
        script_data = {
            "topic": topic,
            "category": category,
            "viral_score": trend.get("viral_score", 0),
            "source": trend.get("source", "unknown"),
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "title": f"ทำไม {topic} ถึงน่าสนใจ?",
            "hook": f"คนส่วนใหญ่ไม่รู้ว่า {topic} กำลังจะเปลี่ยนโลกทั้งใบ!",
            "script": f"""สวัสดีครับ วันนี้มาคุยเรื่อง {topic} กัน

ข้อที่ 1: {topic} คืออะไร?
{topic} คือเทคโนโลยีที่กำลังมาแรงมากในตอนนี้ หลายคนเริ่มสนใจแล้ว

ข้อที่ 2: ทำไมถึงน่าสนใจ?
เพราะมันมีศักยภาพในการเปลี่ยนแปลงวงการ และมีคนเริ่มพูดถึงมากขึ้นเรื่อยๆ

ข้อที่ 3: สิ่งที่ควรรู้
สิ่งสำคัญคือ - ศึกษาข้อมูลให้ดีก่อนตัดสินใจ และอย่าลงทุนเงินที่เสียดาย

ถ้าชอบแบบนี้ กดติดตามไว้เลย!""",
            "hashtags": hashtags,
            "disclaimer": "ความคิดเห็นในวีดีโอนี้ไม่ใช่คำแนะนำทางการเงิน การลงทุนมีความเสี่ยง โปรดใช้วิจารณญาณ"
        }
        
        # Save script
        output_file = OUTPUT_DIR / f"script_{i}_{topic.replace(' ', '_')[:20]}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(script_data, f, indent=2, ensure_ascii=False)
        
        print(f"  ✅ บันทึก: {output_file.name}")
    
    print()
    print("=" * 50)
    print("Content Brain Completed!")
    print(f"สร้าง script ได้ {len(trends)} ชิ้น")
    print("=" * 50)

if __name__ == "__main__":
    main()