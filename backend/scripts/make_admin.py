#!/usr/bin/env python
"""
Script to make a user admin
Usage: python manage.py shell < scripts/make_admin.py
Or: python scripts/make_admin.py <telegram_id>
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User


def make_admin(telegram_id):
    """Make a user admin by telegram_id"""
    try:
        telegram_id = int(telegram_id)
        user = User.objects.get(telegram_id=telegram_id)
        user.is_admin = True
        user.save()
        print(f"✅ Success! User @{user.username} (ID: {telegram_id}) is now an admin.")
        return True
    except User.DoesNotExist:
        print(f"❌ Error: User with telegram_id {telegram_id} not found.")
        print("Make sure the user has logged in at least once.")
        return False
    except ValueError:
        print(f"❌ Error: Invalid telegram_id. Must be a number.")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python scripts/make_admin.py <telegram_id>")
        print("Example: python scripts/make_admin.py 12345")
        sys.exit(1)
    
    telegram_id = sys.argv[1]
    success = make_admin(telegram_id)
    sys.exit(0 if success else 1)
