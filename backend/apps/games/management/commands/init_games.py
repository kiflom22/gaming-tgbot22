from django.core.management.base import BaseCommand
from apps.games.models import GameStatus


class Command(BaseCommand):
    help = 'Initialize game statuses'

    def handle(self, *args, **options):
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
                self.stdout.write(self.style.SUCCESS(f'✅ Created: {game["name"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'ℹ️  Already exists: {game["name"]}'))

        self.stdout.write(self.style.SUCCESS('\n✅ Game statuses initialized!'))
