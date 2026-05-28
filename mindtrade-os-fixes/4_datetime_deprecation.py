"""
FIX 4: Replace all datetime.utcnow() with datetime.now(timezone.utc)

FILES AFFECTED:
- bot/engine.py (several places)
- bot/license_service.py
- bot/tenant_store.py
- bot/tenant_context.py
- bot/state.py
- bot/storage.py

STEP 1: Add import at the top of each file:
from datetime import datetime, timedelta, timezone

STEP 2: Replace ALL occurrences of:
  datetime.utcnow() → datetime.now(timezone.utc)
  datetime.utcnow() → datetime.now(timezone.utc)

STEP 3: Also replace naive datetime comparisons in license_service.py:
  Replace: if _utcnow() > datetime.fromisoformat(exp_raw):
  With:    if datetime.now(timezone.utc) > datetime.fromisoformat(exp_raw).replace(tzinfo=timezone.utc):

IMPORTANT: The license_service.py has a helper _utcnow() function that returns naive datetime.
Change that function to return timezone-aware datetime:

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

And update any datetime.fromisoformat() calls to add .replace(tzinfo=timezone.utc)
when comparing with _utcnow().

QUICK SEARCH/REPLACE pattern (in each file):
  Find:    datetime.utcnow()
  Replace: datetime.now(timezone.utc)
"""
