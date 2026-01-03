#!/bin/bash

echo "🚀 Setting up Django Backend..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate || . venv/Scripts/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration!"
else
    echo "✅ .env file already exists"
fi

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Initialize game statuses
echo "🎮 Initializing game statuses..."
python manage.py shell << EOF
from apps.games.models import GameStatus

games = [
    {'game_type': 'plinko', 'name': 'Plinko', 'icon': '🎯'},
    {'game_type': 'slots', 'name': 'Slots', 'icon': '🎰'},
    {'game_type': 'wheel', 'name': 'Wheel', 'icon': '🎡'},
    {'game_type': 'cards', 'name': 'Find Joker', 'icon': '🃏'},
    {'game_type': 'mining', 'name': 'Mines', 'icon': '⛏️'},
]

for game in games:
    GameStatus.objects.get_or_create(
        game_type=game['game_type'],
        defaults={
            'name': game['name'],
            'icon': game['icon'],
            'is_enabled': True,
            'maintenance_message': f"{game['name']} is under maintenance. Please try again later."
        }
    )

print("✅ Game statuses initialized!")
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file with your Telegram bot token and secrets"
echo "2. Run: python manage.py runserver 8000"
echo "3. Make a user admin: python scripts/make_admin.py <telegram_id>"
echo ""
echo "🎉 Happy coding!"
