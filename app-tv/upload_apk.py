#!/usr/bin/env python3
"""Upload APK to Google Drive folder using OAuth2"""

import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
from pathlib import Path

SCOPES = ['https://www.googleapis.com/auth/drive.file']
TOKEN_PATH = '/Users/adrenaline/.openclaw/workspace/app-tv/token.pickle'
CREDENTIALS_PATH = '/Users/adrenaline/.openclaw/workspace/app-tv/credentials.json'
FOLDER_ID = '16CexXEYq1Uk3U5JRgdYW8aM0DflH7T0K'
APK_PATH = '/Users/adrenaline/Downloads/FreeTV-debug.apk'

def get_service():
    creds = None
    if os.path.exists(TOKEN_PATH):
        with open(TOKEN_PATH, 'rb') as f:
            creds = pickle.load(f)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_PATH):
                print(f"ERROR: {CREDENTIALS_PATH} not found!")
                print("You need to download OAuth credentials from Google Cloud Console:")
                print("1. Go to https://console.cloud.google.com/")
                print("2. Create a project, enable Drive API")
                print("3. Create OAuth credentials (Desktop app)")
                print("4. Download as JSON and save to:", CREDENTIALS_PATH)
                return None
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        
        with open(TOKEN_PATH, 'wb') as f:
            pickle.dump(creds, f)
    
    return build('drive', 'v3', credentials=creds)

def upload_apk(service, filepath, folder_id):
    filename = os.path.basename(filepath)
    file_size = os.path.getsize(filepath)
    
    print(f"Uploading {filename} ({file_size:,} bytes)...")
    
    metadata = {
        'name': filename,
        'parents': [folder_id]
    }
    
    media = MediaFileUpload(filepath, resumable=True)
    
    try:
        request = service.files().create(
            body=metadata,
            media_body=media,
            fields='id, name, webViewLink'
        )
        response = None
        while response is None:
            status, response = request.next_chunk()
            if status:
                print(f"Uploaded {int(status.progress() * 100)}%")
        
        print(f"✅ Done! File ID: {response.get('id')}")
        print(f"URL: {response.get('webViewLink')}")
        return response
    except HttpError as e:
        print(f"Error: {e}")
        return None

if __name__ == '__main__':
    if not os.path.exists(APK_PATH):
        print(f"APK not found: {APK_PATH}")
        exit(1)
    
    service = get_service()
    if service:
        upload_apk(service, APK_PATH, FOLDER_ID)