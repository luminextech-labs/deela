"""
Upload router - handles image uploads to Supabase Storage.
"""
import uuid
import base64
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
import httpx
import os

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://dtdkjtqwnwqvozkayeps.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

ALLOWED_BUCKETS = ["products", "thumbs", "banners", "ai", "cache", "screenshots"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]


def _storage_headers():
    key = os.getenv("SUPABASE_SERVICE_KEY") or SUPABASE_KEY
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "x-upsert": "true"
    }


@router.post("/image")
async def upload_image(
    bucket: str = Form(...),
    file: UploadFile = File(...),
):
    """
    Upload image to Supabase Storage.
    
    - bucket: Target bucket name (products, thumbs, banners, ai, cache, screenshots)
    - file: Image file (jpeg, png, webp, gif)
    """
    if bucket not in ALLOWED_BUCKETS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid bucket. Allowed: {ALLOWED_BUCKETS}"
        )
    
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {ALLOWED_TYPES}"
        )
    
    # Read file content
    content = await file.read()
    
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    path = f"{filename}"
    
    # Upload to Supabase Storage
    headers = _storage_headers()
    headers["Content-Type"] = file.content_type
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.request(
            "POST",
            f"{SUPABASE_URL}/storage/v1/object/{bucket}/{path}",
            headers=headers,
            content=content
        )
    
    if response.status_code not in (200, 201):
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {response.text}"
        )
    
    # Return public URL
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}"
    
    return JSONResponse({
        "success": True,
        "url": public_url,
        "path": path,
        "bucket": bucket,
        "filename": filename,
        "size": len(content),
        "content_type": file.content_type
    })


@router.post("/image/base64")
async def upload_image_base64(
    bucket: str = Form(...),
    data: str = Form(...),  # base64 encoded image
    filename: str = Form(default="image.jpg"),
):
    """
    Upload image via base64 encoded string.
    
    - bucket: Target bucket name
    - data: Base64 encoded image string (without data:image/...;base64, prefix)
    - filename: Original filename for extension
    """
    if bucket not in ALLOWED_BUCKETS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid bucket. Allowed: {ALLOWED_BUCKETS}"
        )
    
    try:
        # Decode base64
        image_data = base64.b64decode(data)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 data")
    
    if len(image_data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {MAX_FILE_SIZE // (1024*1024)}MB"
        )
    
    # Determine content type from filename
    ext = filename.split(".")[-1].lower() if "." in filename else "jpg"
    content_type_map = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "webp": "image/webp",
        "gif": "image/gif"
    }
    content_type = content_type_map.get(ext, "image/jpeg")
    
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}.{ext}"
    path = unique_filename
    
    # Upload to Supabase Storage
    headers = _storage_headers()
    headers["Content-Type"] = content_type
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.request(
            "POST",
            f"{SUPABASE_URL}/storage/v1/object/{bucket}/{path}",
            headers=headers,
            content=image_data
        )
    
    if response.status_code not in (200, 201):
        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {response.text}"
        )
    
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}"
    
    return JSONResponse({
        "success": True,
        "url": public_url,
        "path": path,
        "bucket": bucket,
        "filename": unique_filename,
        "size": len(image_data),
        "content_type": content_type
    })
