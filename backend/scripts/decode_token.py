#!/usr/bin/env python
"""
Decode JWT token to see what's inside
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.users.jwt_utils import generate_token, verify_token
import jwt
from django.conf import settings

def decode_token():
    """Decode token and show contents"""
    # Get admin user
    admin = User.objects.get(username='admin')
    print(f"Admin user: {admin.username}")
    print(f"Telegram ID: {admin.telegram_id}")
    print(f"Is Admin: {admin.is_admin}")
    print()
    
    # Generate token
    token = generate_token(admin)
    print(f"Generated token: {token[:50]}...")
    print()
    
    # Decode token
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    print("Token payload:")
    for key, value in payload.items():
        print(f"  {key}: {value}")
    print()
    
    # Verify token
    verified = verify_token(token)
    print("Verified payload:")
    for key, value in verified.items():
        print(f"  {key}: {value}")

if __name__ == '__main__':
    decode_token()
