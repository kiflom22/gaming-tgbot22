#!/usr/bin/env python
"""
Create an admin account
"""

import os
import sys
import django
import hashlib

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

# Admin account details
username = 'admin'
phone = '0911111111'

# Create fake telegram_id
telegram_id = int(hashlib.md5(username.encode()).hexdigest()[:15], 16) % (10 ** 10)

# Check if admin already exists
if User.objects.filter(username=username).exists():
    user = User.objects.get(username=username)
    user.is_admin = True
    user.balance = 10000  # Give admin some points
    if not user.password:  # Set default password if not set
        user.password = 'admin123'
    user.save()
    print(f"✅ Admin account updated!")
else:
    # Create admin user
    user = User.objects.create(
        telegram_id=telegram_id,
        username=username,
        first_name='Admin',
        last_name='User',
        password='admin123',  # Default password
        balance=10000,  # Start with 10000 points
        is_admin=True
    )
    print(f"✅ Admin account created!")

print(f"""
========================================
   ADMIN ACCOUNT CREATED
========================================

Username: {user.username}
Password: (any password works for now)
Balance:  {user.balance} points
Admin:    {user.is_admin}

Login at: http://localhost:3001

Use these credentials:
- Username: admin
- Password: admin123 (default - change it immediately!)

========================================
""")
