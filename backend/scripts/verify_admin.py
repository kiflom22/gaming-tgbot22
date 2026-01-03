#!/usr/bin/env python
"""
Verify and fix admin user status
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

def verify_admin():
    """Verify admin user exists and has correct permissions"""
    try:
        # Find admin user
        admin = User.objects.get(username='admin')
        
        print(f"✅ Admin user found:")
        print(f"   Username: {admin.username}")
        print(f"   Telegram ID: {admin.telegram_id}")
        print(f"   Balance: {admin.balance}")
        print(f"   Is Admin: {admin.is_admin}")
        print(f"   Is Suspended: {admin.is_suspended}")
        
        # Fix admin status if needed
        if not admin.is_admin:
            print("\n⚠️  Admin user does not have admin privileges!")
            print("   Fixing...")
            admin.is_admin = True
            admin.save()
            print("✅ Admin privileges granted!")
        else:
            print("\n✅ Admin user has correct privileges")
        
        # Ensure not suspended
        if admin.is_suspended:
            print("\n⚠️  Admin user is suspended!")
            print("   Unsuspending...")
            admin.is_suspended = False
            admin.save()
            print("✅ Admin user unsuspended!")
        
        print("\n" + "="*50)
        print("ADMIN LOGIN CREDENTIALS:")
        print("="*50)
        print(f"Username: admin")
        print(f"Password: admin123 (or any password)")
        print("="*50)
        
        return True
        
    except User.DoesNotExist:
        print("❌ Admin user not found!")
        print("   Creating admin user...")
        
        # Create admin user
        admin = User.objects.create(
            telegram_id=999999999,
            username='admin',
            first_name='Admin',
            balance=10000,
            is_admin=True,
            is_suspended=False
        )
        
        print("✅ Admin user created!")
        print("\n" + "="*50)
        print("ADMIN LOGIN CREDENTIALS:")
        print("="*50)
        print(f"Username: admin")
        print(f"Password: admin123 (or any password)")
        print("="*50)
        
        return True

if __name__ == '__main__':
    verify_admin()
