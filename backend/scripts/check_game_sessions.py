#!/usr/bin/env python
"""
Check game sessions to see who played
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.games.models import GameSession
from apps.users.models import User

def check_sessions():
    """Check all game sessions"""
    print("="*60)
    print("GAME SESSIONS")
    print("="*60)
    
    sessions = GameSession.objects.all().order_by('-created_at')
    
    if not sessions:
        print("\nNo game sessions found.")
    else:
        for session in sessions:
            print(f"\nGame: {session.game_type}")
            print(f"  Player: {session.user.username}")
            print(f"  Bet: {session.bet_amount}")
            print(f"  Result: {session.result}")
            print(f"  Points Change: {session.points_change}")
            print(f"  Multiplier: {session.multiplier}")
            print(f"  Time: {session.created_at}")
    
    print("\n" + "="*60)
    print("SUMMARY BY USER")
    print("="*60)
    
    users = User.objects.all()
    for user in users:
        user_sessions = GameSession.objects.filter(user=user)
        if user_sessions.exists():
            total_bet = sum(s.bet_amount for s in user_sessions)
            total_change = sum(s.points_change for s in user_sessions)
            wins = user_sessions.filter(result='win').count()
            losses = user_sessions.filter(result='loss').count()
            
            print(f"\n{user.username}:")
            print(f"  Total Games: {user_sessions.count()}")
            print(f"  Wins: {wins}, Losses: {losses}")
            print(f"  Total Bet: {total_bet}")
            print(f"  Total Points Change: {total_change}")
            print(f"  Current Balance: {user.balance}")
    
    print("\n" + "="*60)

if __name__ == '__main__':
    check_sessions()
