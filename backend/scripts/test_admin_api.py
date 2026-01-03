#!/usr/bin/env python
"""
Test admin API endpoints
"""
import os
import sys
import django
import requests

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.users.jwt_utils import generate_token

API_BASE = 'http://localhost:8000'

def test_admin_api():
    """Test admin API endpoints"""
    print("="*60)
    print("TESTING ADMIN API ENDPOINTS")
    print("="*60)
    
    # Get admin user
    try:
        admin = User.objects.get(username='admin')
        print(f"\n✅ Admin user found: {admin.username}")
        print(f"   Is Admin: {admin.is_admin}")
        print(f"   Is Suspended: {admin.is_suspended}")
    except User.DoesNotExist:
        print("\n❌ Admin user not found!")
        print("   Run: python verify_admin.py")
        return
    
    if not admin.is_admin:
        print("\n❌ User is not admin!")
        print("   Run: python verify_admin.py")
        return
    
    # Generate token
    token = generate_token(admin)
    print(f"\n✅ Generated JWT token")
    print(f"   Token: {token[:50]}...")
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Test 1: Get all users
    print("\n" + "-"*60)
    print("TEST 1: Get All Users")
    print("-"*60)
    try:
        response = requests.get(f'{API_BASE}/api/admin/users/', headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS - Found {len(data.get('users', []))} users")
            for user in data.get('users', [])[:3]:
                print(f"   - {user.get('username')}: {user.get('balance')} points")
        else:
            print(f"❌ FAILED - {response.text}")
    except Exception as e:
        print(f"❌ ERROR - {e}")
    
    # Test 2: Get withdrawals
    print("\n" + "-"*60)
    print("TEST 2: Get All Withdrawals")
    print("-"*60)
    try:
        response = requests.get(f'{API_BASE}/api/admin/withdrawals/', headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS - Found {len(data.get('withdrawals', []))} withdrawals")
        else:
            print(f"❌ FAILED - {response.text}")
    except Exception as e:
        print(f"❌ ERROR - {e}")
    
    # Test 3: Get game sessions
    print("\n" + "-"*60)
    print("TEST 3: Get Game Sessions")
    print("-"*60)
    try:
        response = requests.get(f'{API_BASE}/api/admin/game-sessions/', headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS - Found {len(data.get('sessions', []))} sessions")
        else:
            print(f"❌ FAILED - {response.text}")
    except Exception as e:
        print(f"❌ ERROR - {e}")
    
    # Test 4: Get game statuses
    print("\n" + "-"*60)
    print("TEST 4: Get Game Statuses")
    print("-"*60)
    try:
        response = requests.get(f'{API_BASE}/api/admin/game-statuses/', headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ SUCCESS - Found {len(data.get('games', []))} games")
            for game in data.get('games', []):
                status = "✅ Enabled" if game.get('is_enabled') else "🔧 Disabled"
                print(f"   - {game.get('name')}: {status}")
        else:
            print(f"❌ FAILED - {response.text}")
    except Exception as e:
        print(f"❌ ERROR - {e}")
    
    print("\n" + "="*60)
    print("TESTING COMPLETE")
    print("="*60)
    print("\nIf all tests passed, the admin API is working correctly.")
    print("If tests failed, check:")
    print("  1. Backend server is running on port 8000")
    print("  2. Admin user has is_admin=True")
    print("  3. CORS settings allow localhost")
    print("\nTo use in frontend, login with:")
    print("  Username: admin")
    print("  Password: admin123")
    print("="*60)

if __name__ == '__main__':
    test_admin_api()
