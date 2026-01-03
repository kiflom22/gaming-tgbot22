"""
Quick test script to check withdrawal endpoint
Run this while the server is running to test the withdrawal endpoint
"""

import requests
import json

# Configuration
API_BASE = "http://localhost:8000"

# Test data
test_data = {
    "points": 500,
    "payment_method": "Mobile Money",
    "payment_details": "09213747"
}

print("=" * 60)
print("WITHDRAWAL ENDPOINT TEST")
print("=" * 60)

# You need to replace this with a real JWT token from your browser
# 1. Open browser console (F12)
# 2. Type: localStorage.getItem('auth_token')
# 3. Copy the token and paste it below
TOKEN = "YOUR_TOKEN_HERE"

if TOKEN == "YOUR_TOKEN_HERE":
    print("\n❌ ERROR: Please set your JWT token in this script")
    print("\nHow to get your token:")
    print("1. Open your app in browser")
    print("2. Press F12 to open console")
    print("3. Type: localStorage.getItem('auth_token')")
    print("4. Copy the token and paste it in this script")
    exit()

# Test the endpoint
print(f"\n📡 Testing: POST {API_BASE}/api/user/withdrawal/")
print(f"📦 Data: {json.dumps(test_data, indent=2)}")

try:
    response = requests.post(
        f"{API_BASE}/api/user/withdrawal/",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN}"
        },
        json=test_data
    )
    
    print(f"\n📊 Status Code: {response.status_code}")
    print(f"📄 Response:")
    print(json.dumps(response.json(), indent=2))
    
    if response.status_code == 200:
        print("\n✅ SUCCESS! Withdrawal created")
    else:
        print(f"\n❌ ERROR: {response.status_code}")
        
except requests.exceptions.ConnectionError:
    print("\n❌ ERROR: Cannot connect to backend")
    print("Make sure Django server is running: python manage.py runserver")
except Exception as e:
    print(f"\n❌ ERROR: {e}")

print("\n" + "=" * 60)
