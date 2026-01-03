"""Initialize game statuses in database"""
from apps.games.models import GameStatus

games = [
    {'game_type': 'crash', 'name': 'Crash', 'icon': '🐦'},
    {'game_type': 'limbo', 'name': 'Limbo', 'icon': '📊'},
    {'game_type': 'slots', 'name': 'Slots', 'icon': '🎰'},
    {'game_type': 'cards', 'name': 'Find Joker', 'icon': '🃏'},
    {'game_type': 'mining', 'name': 'Mines', 'icon': '⛏️'},
]

for game in games:
    obj, created = GameStatus.objects.get_or_create(
        game_type=game['game_type'],
        defaults={
            'name': game['name'],
            'icon': game['icon'],
            'is_enabled': True,
            'maintenance_message': f"{game['name']} is under maintenance. Please try again later."
        }
    )
    if created:
        print(f"✅ Created: {game['name']}")
    else:
        print(f"ℹ️  Already exists: {game['name']}")

print("\n✅ Game statuses initialized!")
