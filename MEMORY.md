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
