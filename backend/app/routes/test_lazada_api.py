"""
Test Lazada Affiliate API from Render
"""
import hashlib
import time
import urllib.request
import urllib.parse
import ssl
import json

LAZADA_LITEAPP_KEY = "105827"
LAZADA_SECRET = "r8ZMKhPxu1JZUCwTUBVMJiJnZKjhWeQF"
LAZADA_USER_TOKEN = "1b50f4e90bf44f7b8bf3a1c67d3cd4cf"

def sign_lazada(params):
    sorted_params = sorted(params.items())
    sign_str = LAZADA_SECRET
    for k, v in sorted_params:
        sign_str += str(k) + str(v)
    return hashlib.sha256(sign_str.encode('utf-8')).hexdigest().upper()


def test_lazada_api():
    """Test Lazada API endpoints."""
    timestamp = str(int(time.time() * 1000))
    
    results = []
    
    # Test different actions
    actions_to_test = [
        "item_search",
        "product.search", 
        "items.get",
        "seller.items.list",
        "platform.products.search",
        "/item/search",
        "/product/search",
    ]
    
    for action in actions_to_test:
        params = {
            "app_key": LAZADA_LITEAPP_KEY,
            "sign_method": "sha256",
            "timestamp": timestamp,
            "v": "1.0",
            "format": "json",
            "action": action,
            "keyword": "iphone",
            "limit": 1,
        }
        params["sign"] = sign_lazada(params)
        
        query_str = "&".join([f"{urllib.parse.quote(str(k))}={urllib.parse.quote(str(v))}" for k, v in params.items()])
        url = f"https://api.lazada.co.th/rest?{query_str}"
        
        ctx = ssl._create_unverified_context()
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {LAZADA_USER_TOKEN}"})
        
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                data = json.loads(resp.read())
                code = data.get("code", "unknown")
                results.append({
                    "action": action,
                    "status": "success" if code != "InvalidApiPath" else "invalid_path",
                    "response": str(data)[:200]
                })
        except Exception as e:
            results.append({
                "action": action,
                "status": "error",
                "response": str(e)[:100]
            })
    
    return results


if __name__ == "__main__":
    print("Testing Lazada API from Render...")
    results = test_lazada_api()
    for r in results:
        print(f"\n{r['action']}: {r['status']}")
        print(f"  {r['response'][:150]}")