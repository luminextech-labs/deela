#!/usr/bin/env python3
"""
MIND Tech Money - Media Generator
สร้างรูป thumbnail อัตโนมัติจาก script
"""

import json
import subprocess
import os
from datetime import datetime, timezone
from pathlib import Path

PROJECT_DIR = Path("/opt/mind-tech-money")
CONTENT_DIR = PROJECT_DIR / "content"
THUMBNAILS_DIR = PROJECT_DIR / "content" / "thumbnails"
THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)

# Thumbnail prompts per topic
THUMBNAIL_PROMPTS = {
    "AI": {
        "prompt": "futuristic AI neural network brain with glowing blue circuits, dark space background, digital data streams, modern tech style for YouTube Shorts thumbnail",
        "style": "tech"
    },
    "บิตคอยน์": {
        "prompt": "bitcoin gold coin futuristic design, glowing gold and orange, digital background with blockchain pattern, YouTube Shorts thumbnail style",
        "style": "crypto"
    },
    "คริปโต": {
        "prompt": "cryptocurrency abstract design, multiple coins floating, purple and blue neon lights, dark background, blockchain pattern, YouTube Shorts viral thumbnail",
        "style": "crypto"
    },
    "หุ้น": {
        "prompt": "stock market trading screen with charts, green and red candles, digital futuristic style, dark background, trading concept YouTube Shorts thumbnail",
        "style": "finance"
    },
    "ดิจิทัล": {
        "prompt": "digital technology abstract, holographic data visualization, blue cyan glow, dark background, futuristic IT style YouTube Shorts thumbnail",
        "style": "tech"
    }
}

def get_latest_scripts():
    """ดึง script ล่าสุดที่ยังไม่มี thumbnail"""
    scripts = list(CONTENT_DIR.glob("script_*.json"))
    results = []
    
    for script_path in scripts:
        with open(script_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        topic = data.get("topic", "general")
        thumbnail_file = THUMBNAILS_DIR / f"thumb_{script_path.stem}.png"
        
        results.append({
            "script": data,
            "topic": topic,
            "script_path": script_path,
            "thumbnail_path": thumbnail_file,
            "needs_thumbnail": not thumbnail_file.exists()
        })
    
    return results

def generate_thumbnail_prompt(topic):
    """สร้าง prompt สำหรับ thumbnail"""
    # Exact match first
    if topic in THUMBNAIL_PROMPTS:
        return THUMBNAIL_PROMPTS[topic]["prompt"]
    
    # Keyword match
    topic_lower = topic.lower()
    for key, val in THUMBNAIL_PROMPTS.items():
        if key.lower() in topic_lower:
            return val["prompt"]
    
    # Default
    return f"futuristic technology abstract design, {topic} concept, dark background, modern YouTube Shorts thumbnail style, viral aesthetic"

def main():
    print("=" * 50)
    print("MIND Tech Money - Media Generator")
    print("=" * 50)
    
    scripts = get_latest_scripts()
    
    if not scripts:
        print("ไม่พบ script - รัน content_brain.py ก่อน")
        return
    
    print(f"พบ {len(scripts)} scripts:")
    for s in scripts:
        status = "✅ มี thumbnail แล้ว" if not s["needs_thumbnail"] else "⏳ ต้องสร้าง thumbnail"
        print(f"  - {s['topic']}: {status}")
    
    print()
    print("📝 THUMBNAIL PROMPTS ที่จะใช้:")
    for s in scripts:
        if s["needs_thumbnail"]:
            prompt = generate_thumbnail_prompt(s["topic"])
            print(f"  [{s['topic']}]: {prompt[:80]}...")
    
    print()
    print("💡 หมายเหตุ: ในเวอร์ชันเต็ม จะใช้ OpenAI/DALL-E API สร้าง thumbnail อัตโนมัติ")
    print("   ในเวอร์ชัน current สามารถใช้ prompt ด้านบนไปสร้างเองได้เลย")
    
    # Save prompts for reference
    prompts_output = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "thumbnails": []
    }
    
    for s in scripts:
        if s["needs_thumbnail"]:
            prompts_output["thumbnails"].append({
                "topic": s["topic"],
                "prompt": generate_thumbnail_prompt(s["topic"]),
                "output_file": str(s["thumbnail_path"])
            })
    
    prompts_file = CONTENT_DIR / "pending_thumbnails.json"
    with open(prompts_file, "w", encoding="utf-8") as f:
        json.dump(prompts_output, f, indent=2, ensure_ascii=False)
    
    print()
    print("=" * 50)
    print(f"✅ Media Generator scan เสร็จ")
    print(f"📁 Prompts saved: {prompts_file}")
    print("=" * 50)

if __name__ == "__main__":
    main()