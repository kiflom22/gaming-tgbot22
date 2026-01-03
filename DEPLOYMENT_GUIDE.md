# 🚀 Deployment Guide

## Pre-Deployment Checklist

### ✅ What's Working
- All games (Crash, Limbo, Mining, Cards, Slots)
- Admin dashboard with full controls
- User authentication via Telegram
- Withdrawal system
- Game history and statistics
- Real-time balance updates

### ⚠️ Important Configuration Changes Needed

## 1. Backend Configuration

### Update `.env` file:
```env
# PRODUCTION SETTINGS
DEBUG=False
DJANGO_SECRET_KEY=your-super-secret-key-change-this-now
JWT_SECRET=your-jwt-secret-key-change-this-too
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Your production domain
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Your frontend URL
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Database (for production, consider PostgreSQL)
DATABASE_URL=sqlite:///db.sqlite3
```

### Update `backend/config/settings.py`:

**Line 18-19** - Change DEBUG to False:
```python
DEBUG = os.getenv('DEBUG', 'False') == 'True'
```

**Line 107-115** - Update CORS for production:
```python
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',')
```

**Add after line 115**:
```python
# Security settings for production
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
```

## 2. Frontend Configuration

### Create `.env` file in `frontend/`:
```env
# Production API URL
VITE_API_URL=https://your-backend-domain.com

# Or if backend is on same domain
VITE_API_URL=https://yourdomain.com/api
```

### Build frontend:
```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized production files.

## 3. Deployment Options

### Option A: Deploy to VPS (Recommended)

**Backend (Django):**
1. Install Python 3.9+, pip, virtualenv
2. Clone your repository
3. Create virtual environment: `python -m venv venv`
4. Activate: `source venv/bin/activate` (Linux) or `venv\Scripts\activate` (Windows)
5. Install dependencies: `pip install -r requirements.txt`
6. Set environment variables in `.env`
7. Run migrations: `python manage.py migrate`
8. Create admin: `python manage.py init_admin`
9. Initialize games: `python manage.py init_games`
10. Collect static files: `python manage.py collectstatic`
11. Run with Gunicorn: `gunicorn config.wsgi:application --bind 0.0.0.0:8000`

**Frontend (React):**
1. Build: `npm run build`
2. Serve with Nginx or Apache
3. Configure reverse proxy to backend

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /games/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option B: Deploy to Heroku

**Backend:**
1. Create `Procfile`:
```
web: gunicorn config.wsgi:application
```

2. Create `runtime.txt`:
```
python-3.11.0
```

3. Add `gunicorn` to `requirements.txt`
4. Deploy: `git push heroku main`

**Frontend:**
- Deploy to Vercel, Netlify, or Cloudflare Pages
- Set `VITE_API_URL` environment variable to your Heroku backend URL

### Option C: Deploy to Railway/Render

Both platforms support Django and React apps with automatic deployments from GitHub.

## 4. Telegram Bot Setup

### Create your bot:
1. Message @BotFather on Telegram
2. Send `/newbot`
3. Follow instructions to get your bot token
4. Set bot token in backend `.env` file

### Configure Web App:
1. Send `/mybots` to @BotFather
2. Select your bot
3. Choose "Bot Settings" → "Menu Button"
4. Set Web App URL to your frontend URL

### Set Bot Commands:
```
/start - Start the game
/balance - Check your balance
/withdraw - Request withdrawal
/admin - Admin panel (for admins only)
```

## 5. Database Considerations

### For Production:
- **SQLite** works for small-scale (< 100 concurrent users)
- **PostgreSQL** recommended for production (better performance, concurrent writes)

### Migrate to PostgreSQL:
1. Install: `pip install psycopg2-binary`
2. Update `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

## 6. Security Checklist

- [ ] Change `DJANGO_SECRET_KEY` to random string
- [ ] Change `JWT_SECRET` to random string
- [ ] Set `DEBUG=False` in production
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Configure proper `CORS_ALLOWED_ORIGINS`
- [ ] Use HTTPS (SSL certificate)
- [ ] Enable security headers
- [ ] Backup database regularly
- [ ] Monitor error logs
- [ ] Set up rate limiting (optional)

## 7. Testing Before Going Live

1. Test all games with real Telegram bot
2. Test admin panel functions
3. Test withdrawal flow
4. Test on mobile devices
5. Check all API endpoints
6. Verify balance calculations
7. Test with multiple users

## 8. Post-Deployment

### Monitor:
- Server logs for errors
- Database size
- User activity
- Game fairness (check win/loss ratios)

### Backup:
```bash
# Backup database
python manage.py dumpdata > backup.json

# Or for SQLite
cp db.sqlite3 backup_$(date +%Y%m%d).sqlite3
```

### Update:
```bash
# Pull latest changes
git pull

# Update dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Restart server
systemctl restart your-app-name
```

## 9. Common Issues

### CORS Errors:
- Check `CORS_ALLOWED_ORIGINS` in settings
- Ensure frontend URL matches exactly (no trailing slash)

### Authentication Fails:
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check JWT_SECRET is set
- Ensure Telegram Web App URL is correct

### Games Not Working:
- Run `python manage.py init_games`
- Check game statuses in admin panel
- Verify API endpoints are accessible

## 10. Scaling Tips

- Use Redis for caching
- Use Celery for background tasks
- Use CDN for static files
- Use load balancer for multiple servers
- Monitor with tools like Sentry, New Relic

---

## Quick Deploy Commands

### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py init_admin
python manage.py init_games
python manage.py collectstatic --noinput
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Frontend:
```bash
cd frontend
npm install
npm run build
# Serve dist/ folder with Nginx/Apache
```

---

**Your app is ready to deploy! Just configure the environment variables and choose your hosting platform.**
