# Django Backend - Gaming Bot API

Complete Django REST API backend for the Telegram gaming bot with admin control system.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DJANGO_SECRET_KEY=your-secret-key-here
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
JWT_SECRET=your-jwt-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 3. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Initialize Game Statuses

```bash
python manage.py shell
```

Then in the shell:
```python
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
exit()
```

### 6. Run Server

```bash
python manage.py runserver 8000
```

Server will be available at: `http://localhost:8000`

## 🛡️ Make User Admin

After a user logs in at least once, make them admin:

```bash
python scripts/make_admin.py <telegram_id>
```

Example:
```bash
python scripts/make_admin.py 12345
```

## 📡 API Endpoints

### Authentication
- `POST /api/user/auth/` - Authenticate with Telegram initData
- `GET /api/user/verify/` - Verify JWT token
- `GET /api/user/balance/` - Get user balance
- `GET /api/user/stats/` - Get user statistics

### Withdrawals
- `POST /api/user/withdrawal/` - Request withdrawal
- `GET /api/user/withdrawals/` - Get user's withdrawals

### Games
- `GET /games/api/status/` - Get game statuses
- `POST /games/api/play/` - Play a game
- `GET /games/api/history/` - Get game history

### Admin - User Management
- `GET /api/admin/users/` - Get all users
- `POST /api/admin/users/<id>/add-points/` - Add points to user
- `POST /api/admin/users/<id>/suspend/` - Suspend/activate user

### Admin - Withdrawal Management
- `GET /api/admin/withdrawals/` - Get all withdrawals
- `POST /api/admin/withdrawals/<id>/approve/` - Approve withdrawal
- `POST /api/admin/withdrawals/<id>/reject/` - Reject withdrawal
- `POST /api/admin/withdrawals/<id>/paid/` - Mark as paid

### Admin - Game Control
- `GET /api/admin/game-statuses/` - Get all game statuses
- `POST /api/admin/game-statuses/<type>/toggle/` - Enable/disable game
- `POST /api/admin/game-statuses/<type>/message/` - Update maintenance message

### Admin - Game Sessions
- `GET /api/admin/game-sessions/` - Get all game sessions

## 🗂️ Project Structure

```
backend/
├── config/                 # Django configuration
│   ├── settings.py        # Settings
│   ├── urls.py            # Main URL routing
│   └── wsgi.py            # WSGI config
├── apps/
│   ├── users/             # User management
│   │   ├── models.py      # User & Withdrawal models
│   │   ├── views.py       # Auth & user endpoints
│   │   ├── serializers.py # DRF serializers
│   │   ├── utils.py       # Telegram validation
│   │   ├── jwt_utils.py   # JWT token handling
│   │   └── middleware.py  # Auth middleware
│   ├── games/             # Game management
│   │   ├── models.py      # GameSession & GameStatus models
│   │   ├── views.py       # Game endpoints
│   │   └── serializers.py # DRF serializers
│   ├── admin_panel/       # Admin functionality
│   │   ├── views.py       # Admin endpoints
│   │   └── urls.py        # Admin URL routing
│   └── withdrawals/       # Withdrawal app
├── scripts/
│   └── make_admin.py      # Make user admin script
├── manage.py              # Django management
├── requirements.txt       # Python dependencies
└── .env.example           # Environment variables template
```

## 🔐 Security Features

### Telegram Authentication
- Validates Telegram initData using HMAC-SHA256
- Verifies signature with bot token
- Prevents data tampering

### JWT Authentication
- Secure token-based authentication
- 7-day token expiration
- Signed with secret key

### Admin Authorization
- Admin-only endpoints protected
- Checks `is_admin` flag
- Returns 403 for non-admin users

### Account Suspension
- Suspended users blocked from:
  - Playing games
  - Requesting withdrawals
  - Accessing features

## 🎮 Game Flow

1. User authenticates with Telegram
2. Frontend calculates game result
3. Frontend sends result to backend
4. Backend validates:
   - User balance
   - Game enabled status
   - Account not suspended
5. Backend updates:
   - User balance
   - Game statistics
   - Creates game session
6. Returns new balance

## 💸 Withdrawal Flow

1. User requests withdrawal (min 500 points)
2. Points deducted immediately
3. Withdrawal status: `pending`
4. Admin reviews and approves
5. Admin processes external payment
6. Admin marks as `paid`
7. Complete!

**Rejection:** Points automatically refunded

## 🛠️ Admin Features

### Add Points (External Payment)
```bash
POST /api/admin/users/<id>/add-points/
{
  "points": 1000,
  "note": "Bank transfer received"
}
```

### Suspend User
```bash
POST /api/admin/users/<id>/suspend/
{
  "suspend": true
}
```

### Approve Withdrawal
```bash
POST /api/admin/withdrawals/<id>/approve/
```

### Disable Game
```bash
POST /api/admin/game-statuses/plinko/toggle/
```

## 📊 Database Models

### User
- telegram_id (unique)
- username, first_name, last_name
- balance
- is_admin, is_suspended
- games_played, total_wagered, total_won, total_lost
- created_at, last_login

### Withdrawal
- user (FK)
- points, amount
- payment_method, payment_details
- status (pending/approved/paid/rejected)
- rejection_reason
- created_at, updated_at

### GameSession
- user (FK)
- game_type, bet_amount
- result, multiplier, points_change
- game_data (JSON)
- created_at

### GameStatus
- game_type (unique)
- name, icon
- is_enabled
- maintenance_message
- updated_at

## 🧪 Testing

### Test Authentication
```bash
curl -X POST http://localhost:8000/api/user/auth/ \
  -H "X-Telegram-Init-Data: your_init_data_here"
```

### Test Admin Endpoint
```bash
curl -X GET http://localhost:8000/api/admin/users/ \
  -H "Authorization: Bearer your_jwt_token_here"
```

## 🚀 Deployment

### Production Settings

1. Set `DEBUG=False` in `.env`
2. Update `ALLOWED_HOSTS`
3. Update `CORS_ALLOWED_ORIGINS`
4. Use PostgreSQL instead of SQLite
5. Set strong `DJANGO_SECRET_KEY` and `JWT_SECRET`
6. Use environment variables for sensitive data

### Database Migration (PostgreSQL)

Update `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

### Collect Static Files
```bash
python manage.py collectstatic
```

### Run with Gunicorn
```bash
pip install gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DJANGO_SECRET_KEY | Django secret key | `your-secret-key` |
| TELEGRAM_BOT_TOKEN | Telegram bot token | `123456:ABC-DEF...` |
| JWT_SECRET | JWT signing key | `your-jwt-secret` |
| DEBUG | Debug mode | `True` or `False` |
| ALLOWED_HOSTS | Allowed hosts | `localhost,example.com` |
| CORS_ALLOWED_ORIGINS | CORS origins | `http://localhost:5173` |

## 🐛 Troubleshooting

**Can't connect to backend:**
- Check server is running on port 8000
- Verify CORS settings
- Check firewall rules

**Authentication fails:**
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check initData is being sent
- Review server logs

**Admin access denied:**
- Run `make_admin.py` script
- Verify user has `is_admin=True`
- Check JWT token is valid

**Database errors:**
- Run migrations: `python manage.py migrate`
- Check database connection
- Verify models are correct

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 🎉 Success!

Your Django backend is now ready with:
- ✅ Complete authentication system
- ✅ Game management
- ✅ Withdrawal system
- ✅ Full admin control panel
- ✅ Security features
- ✅ Production-ready code

Start the server and connect your frontend!
