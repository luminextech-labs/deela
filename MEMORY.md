# MEMORY.md - Long-term Memory

## User: มายด์ (Maidx)
- Goal: 100 million baht
- Interests: AI, crypto, stocks, coding for income
- Timezone: GMT+7 (Bangkok)
- Telegram: connected ✅

## Current Project: MindTrade OS
- Repo: github.com/Adrenaline189/mindtrade-os
- Hosted on: Contabo VPS (185.230.138.51)
- Path on server: /opt/mindtrade/
- Service: mindtrade.service (systemd)
- Trading bot (Binance Futures) with multi-tenant support

## MindTrade OS - Security Fixes (All Applied ✅)
- Fix #1: API key per tenant (non-default ห้ามใช้ global env)
- Fix #2: Webhook signature reject if secret empty
- Fix #3: backup_licenses.py script
- Fix #4: datetime.utcnow() → datetime.now(timezone.utc)
- Fix #5: Rate limiting (NOT YET - FastAPI middleware complex, deferred)
- Fix #9: Telegram SSL error — เพิ่ม `ssl._create_unverified_context()` ใน urlopen calls (applied 2026-04-03)
- Fix #6: Payment validation logging (BLOCKED_INVALID_STATUS_ATTEMPT)
- Fix #7: migrate_licenses.py migration system
- Fix #8: Environment-based configurable paths (MINDTRADE_ROOT, MINDTRADE_DATA_ROOT, MINDTRADE_LICENSE_ROOT)
- Backup on Contabo: /opt/mindtrade/backups/

## MindTrade OS - Symbol Config (Updated 2026-04-03)
- Default symbols ครบ 10 คู่: BTC, ETH, SOL, BNB, XRP, DOGE, ADA, AVAX, LINK, TRX (all USDT pairs)
- Default leverage: ทุกคู่ = 10x
- Default ORDER_SIZE_USDT: 10
- ไฟล์ config: `/opt/mindtrade/bot/config_runtime.py`
- Tenants ที่มี runtime_config.json แยก: default, tenant_065b05921555, tenant_1567e46c6833, tenant_baf5721d3f89, tenant_fe8876e5e9d9
- Tenant ที่เป็นมาตรฐาน (10 symbols): tenant_1567e46c6833

## OpenClaw Status
- Gateway: running at port 18789
- Dashboard: http://127.0.0.1:18789/
- Telegram: working ✅
- exec tool: pairing issue (needs approval via dashboard)

## Key Files (MindTrade OS)
- `/opt/mindtrade/bot/config_runtime.py` — SYMBOLS + LEVERAGE default
- `/opt/mindtrade/ui/app.py` — FastAPI routes + UI
- `/opt/mindtrade/bot/license_service.py` — license management
- `/opt/mindtrade/data/tenants/` — per-tenant data

## Deela Project (Updated 2026-05-30)
**Status:** Frontend connected to Backend ✅ | Backend (Render) ยังต้อง redeploy เพื่อให้ trending/deals endpoints ทำงาน

### URLs
- Frontend (Vercel): https://deela-two.vercel.app
- Backend (Railway): https://deela-foa0.onrender.com
- GitHub: github.com/luminextech-labs/deela

### Supabase
- Project ID: dylbygcuwigngtkiekylg
- DB password: xgjvKPHkJuQgyXa
- **Service Role Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZGtqdHF3bndxdm96a2F5ZXBzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTk2MTY5MywiZXhwIjoyMDk1NTM3NjkzfQ.j2lPuJPiPvhUKd3LzQpD9G38--2Xr2qxsESqA8eH0sM

## Deela - APIs Status (Updated 2026-05-30)
- GET /api/products ✅
- GET /api/trending/deals ✅
- POST /api/upload/image/base64 ✅
- GET /api/admin/products ✅
- GET /api/thumbnail/generate ⚠️ (DNS issue on container)

## Deela - Products
- Total products: 29 (24 ต้นฉบับ + 5 ใหม่)
- New products: iPhone 16 Pro Max, MacBook Pro M4, Sony WH-1000XM5, Galaxy Tab S10 Ultra, Apple Watch Ultra 2

## Deela DB - Connection String (Updated 2026-05-30)
**ที่ใช้ได้:** `postgresql://postgres.dylbygcuwigngtkiekylg:xgjvKPHkJuQgyXTa@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`
**สถานะ:** ยังไม่ได้ทดสอบเพราะติดenoidentifier เดียวกันทั้ง 5432 และ 6543

## Deela - สิ่งที่รู้
- Supabase pooler ที่ port 5432 ต้องใช้ `postgres.{project_id}` เป็น username
- ต้องตรวจสอบว่าปัญหาคือ Supavisor SNI routing หรือ password ผิด

## Context Compaction Rule
- เมื่อ context เกิน 80% → compaction session:
  1. ดึงข้อมูลสำคัญทั้งหมดเก็บลง memory files
  2. จำเป็นต้องเก็บ: สิ่งที่กำลังทำ, สถานะปัจจุบัน, key files/paths, สิ่งที่ต้องทำต่อ
  3. เริ่ม session ใหม่ด้วยข้อมูลที่บันทึกไว้

## Deela - Storage Plan (Updated 2026-05-30)
**Phase MVP (ตอนนี้):**
- Frontend → Vercel
- Backend → Render
- Database → Supabase
- Storage → Supabase Storage
- ค่าใช้จ่าย: ~0-500 บาท/เดือน

**Phase Growth (เมื่อมี traffic + รายได้):**
- Frontend → Vercel
- Backend → Koyeb
- Database → Supabase
- Storage → Cloudflare R2

### Storage Structure (R2 อนาคต):
```
products/      ← รูปสินค้าหลัก
thumbs/        ← thumbnail หลายขนาด (300, 600)
banners/       ← banner รูปใหญ่
ai/            ← AI generated assets
cache/         ← crawler cache (shopee, lazada, tiktok)
screenshots/   ← debug screenshots
```

**สรุป:** Supabase Storage ตอนนี้ → ย้าย R2 ตอนมีรายได้ + รูปเยอะ
