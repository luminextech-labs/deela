"""
FIX 1: bot/engine.py - Remove dangerous API key fallback for non-default tenants

REPLACE the create_exchange_client function (around line 44-62) with this:

def create_exchange_client(tenant_id: str | None = None):
    api_key = ""
    api_secret = ""

    tid = (tenant_id or default_tenant_id()).strip()
    default_tid = default_tenant_id().strip()
    email = get_primary_email_for_tenant(tid)

    if email:
        api_key, api_secret = get_user_api(email, tenant_id=tid)

    # Security fix: Only fall back to global env vars for the DEFAULT tenant.
    # All other tenants MUST have their own API keys configured.
    if not api_key or not api_secret:
        if tid == default_tid:
            # Default tenant can still use global env vars for dev convenience
            api_key = os.getenv("BINANCE_API_KEY", "")
            api_secret = os.getenv("BINANCE_API_SECRET", "")
        else:
            raise ValueError(
                f"Tenant '{tid}' has no API keys configured. "
                f"Please configure API keys for this tenant before trading."
            )

    return ccxt.binance(
        {
            "apiKey": api_key,
            "secret": api_secret,
            "enableRateLimit": True,
            "options": {"defaultType": "future"},
        }
    )
"""
