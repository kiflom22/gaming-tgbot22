#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Initialize games
python manage.py shell << EOF
from apps.games.models import GameStatus
games = [
    {'game_type': 'crash', 'name': 'Crash', 'icon': '🚀'},
    {'game_type': 'limbo', 'name': 'Limbo', 'icon': '📊'},
    {'game_type': 'slots', 'name': 'Slots', 'icon': '🎰'},
    {'game_type': 'cards', 'name': 'Find Joker', 'icon': '🃏'},
    {'game_type': 'mining', 'name': 'Mines', 'icon': '⛏️'},
]
for game in games:
    GameStatus.objects.get_or_create(game_type=game['game_type'], defaults={'name': game['name'], 'icon': game['icon'], 'is_enabled': True})
EOF
