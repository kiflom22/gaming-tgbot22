#!/usr/bin/env python
"""
Check actual user balances in database
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

def check_balances():
    """Check all user balances"""
    print("="*60)
    print("CURRENT USER BALANCES IN DATABASE")
    print("="*60)
    
    users = User.objects.all()
    
    for user in users:
        print(f"\nUsername: {user.username}")
        print(f"  Telegram ID: {user.telegram_id}")
        print(f"  Balance: {user.balance} points")
        print(f"  Games Played: {user.games_played}")
        print(f"  Total Wagered: {user.total_wagered}")
        print(f"  Total Won: {user.total_won}")
        print(f"  Total Lost: {user.total_lost}")
        print(f"  Is Admin: {user.is_admin}")
        print(f"  Is Suspended: {user.is_suspended}")
    
    print("\n" + "="*60)

if __name__ == '__main__':
    check_balances()
