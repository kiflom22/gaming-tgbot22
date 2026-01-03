# 🚀 Free Deployment Guide - Complete Step-by-Step

## 🎯 Recommended Setup: Render + Vercel

**Total Cost:** $0/month (100% FREE)

---

## 📋 What You'll Deploy:

1. **Backend (Django)** → Render.com (FREE)
2. **Frontend (React)** → Vercel.com (FREE)
3. **Database (PostgreSQL)** → Render.com (FREE)

---

## 🔧 STEP 1: Prepare Your Code

### A. Update Backend Requirements

Already done! Your `backend/requirements.txt` now includes:
```
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
PyJWT==2.8.0
python-dotenv==1.0.0
cryptography==41.0.7
gunicorn==21.2.0
psycopg2-binary==2.9.9
whitenoise==6.6.0
```

### B. Files Created for Deployment

✅ `backend/build.sh` - Build script for Render  
✅ `backend/render.yaml` - Render configuration  
✅ `backend/railway.json` - Railway configuration (alternative)  
✅ `backend/runtime.txt` - Python version  
✅ Updated `backend/config/settings.py` - Production settings  

---

## 🚀 STEP 2: Deploy Backend to Render

### 1. Create Render Account
- Go to: https://render.com
- Click "Get Started for Free"
- Sign up with GitHub (recommended)
- ✅ No credit card required!

### 2. Push Code to GitHub
```bash
# Initialize git (if not already)
cd your-project-folder
git init
git add .
git commit -m "Ready for deployment"

# Create GitHub repo and push
# Go to github.com → New Repository → Create
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Render

**Option A: Using Blueprint (Easiest)**
1. Go to Render Dashboard
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Click "Apply"
6. Wait 5-10 minutes for deployment

**Option B: Manual Setup**
1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** gaming-bot-backend
   - **Root Directory:** backend
   - **Environment:** Python 3
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn config.wsgi:application`
5. Click "Create Web Service"

### 4. Add Environment Variables

In Render dashboard, go to your service → Environment:

```
DEBUG=False
DJANGO_SECRET_KEY=your-secret-key-here-make-it-long-and-random
JWT_SECRET=another-secret-key-for-jwt-tokens
TELEGRAM_BOT_TOKEN=your-telegram-bot-token (optional)
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

**Generate secret keys:**
```python
# Run this in Python to generate random keys
import secrets
print(secrets.token_urlsafe(50))
```

### 5. Create PostgreSQL Database

1. In Render dashboard, click "New" → "PostgreSQL"
2. Name: `gaming-bot-db`
3. Click "Create Database"
4. Copy the "Internal Database URL"
5. Go back to your web service → Environment
6. Add: `DATABASE_URL=<paste-internal-database-url>`

### 6. Deploy!

- Render will automatically deploy
- Wait 5-10 minutes
- Your backend will be live at: `https://gaming-bot-backend.onrender.com`

---

## 🎨 STEP 3: Deploy Frontend to Vercel

### 1. Create Vercel Account
- Go to: https://vercel.com
- Click "Sign Up"
- Sign up with GitHub
- ✅ No credit card required!

### 2. Update Frontend Environment

Create `frontend/.env.production`:
```env
VITE_API_URL=https://gaming-bot-backend.onrender.com
```

Commit and push:
```bash
git add frontend/.env.production
git commit -m "Add production env"
git push
```

### 3. Deploy on Vercel

1. Go to Vercel Dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://gaming-bot-backend.onrender.com`
6. Click "Deploy"
7. Wait 2-3 minutes

Your frontend will be live at: `https://your-project.vercel.app`

---

## 🔗 STEP 4: Connect Frontend & Backend

### 1. Update Backend CORS

Go to Render → Your Backend Service → Environment:

Update `CORS_ALLOWED_ORIGINS`:
```
CORS_ALLOWED_ORIGINS=https://your-project.vercel.app
```

Click "Save Changes" (will redeploy automatically)

### 2. Test Connection

1. Open your Vercel URL: `https://your-project.vercel.app`
2. Try to login
3. Check if API calls work

---

## 🎮 STEP 5: Initialize Database

### 1. Run Migrations (Already done automatically)

Render runs migrations during build via `build.sh`

### 2. Initialize Game Statuses

**Option A: Using Render Shell**
1. Go to Render Dashboard → Your Service
2. Click "Shell" tab
3. Run:
```bash
python manage.py shell
```

Then paste:
```python
from apps.games.models import GameStatus

games = [
    {'game_type': 'crash', 'name': 'Crash', 'icon': '🚀'},
    {'game_type': 'limbo', 'name': 'Limbo', 'icon': '📊'},
    {'game_type': 'slots', 'name': 'Slots', 'icon': '🎰'},
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
            'maintenance_message': f"{game['name']} is under maintenance."
        }
    )

print("✅ Games initialized!")
exit()
```

**Option B: Create Management Command**

Already have `backend/scripts/init_games.py`, just run:
```bash
python manage.py shell < scripts/init_games.py
```

### 3. Create Admin User

In Render Shell:
```bash
python scripts/make_admin.py YOUR_TELEGRAM_ID
```

---

## ✅ STEP 6: Test Everything

### 1. Test Backend
- Visit: `https://gaming-bot-backend.onrender.com/games/api/status/`
- Should see JSON response

### 2. Test Frontend
- Visit: `https://your-project.vercel.app`
- Try to login
- Test games
- Test admin panel

### 3. Test Admin Features
- Login as admin
- Go to Admin Panel
- Test all features:
  - Add points
  - Suspend users
  - Approve withdrawals
  - Control games

---

## 🎉 You're Live!

Your gaming bot is now deployed for FREE!

**URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://gaming-bot-backend.onrender.com`
- Database: PostgreSQL on Render

---

## ⚠️ Important Notes

### Render Free Tier Limitations:
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ Takes ~30 seconds to wake up
- ✅ Free PostgreSQL database (90 days, then need to upgrade)

### Solutions for Sleep Issue:
1. **Use a ping service** (free):
   - UptimeRobot.com
   - Cron-job.org
   - Ping your backend every 10 minutes

2. **Upgrade to paid** ($7/month):
   - No sleep
   - Better performance
   - More resources

### Vercel Free Tier:
- ✅ Unlimited bandwidth
- ✅ No sleep
- ✅ Fast CDN
- ✅ Automatic HTTPS
- ✅ 100% free forever

---

## 🔧 Troubleshooting

### Backend won't start:
1. Check Render logs
2. Verify environment variables
3. Check `DATABASE_URL` is set
4. Run migrations manually

### Frontend can't connect:
1. Check `VITE_API_URL` in Vercel
2. Check CORS settings in backend
3. Check backend is running

### Database errors:
1. Check `DATABASE_URL` is correct
2. Run migrations in Render shell
3. Check PostgreSQL is running

---

## 📊 Alternative Free Options

### If Render doesn't work:

**1. Railway** (Good alternative)
- $5 free credit/month
- No sleep
- Requires credit card
- Deploy: https://railway.app

**2. PythonAnywhere** (Easiest)
- 100% free
- No credit card
- Slower performance
- Deploy: https://www.pythonanywhere.com

**3. Fly.io** (Advanced)
- Free tier
- Good performance
- Complex setup
- Deploy: https://fly.io

---

## 🎯 Summary

**What you deployed:**
- ✅ Django backend on Render (FREE)
- ✅ PostgreSQL database on Render (FREE)
- ✅ React frontend on Vercel (FREE)
- ✅ Total cost: $0/month

**What works:**
- ✅ All games
- ✅ User authentication
- ✅ Admin panel
- ✅ Withdrawals
- ✅ Game control
- ✅ Everything!

**Next steps:**
1. Share your Vercel URL with users
2. Monitor usage in dashboards
3. Set up UptimeRobot to prevent sleep
4. Enjoy your free gaming bot! 🎉

---

## 📞 Need Help?

**Render Support:**
- Docs: https://render.com/docs
- Community: https://community.render.com

**Vercel Support:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

**Your Project:**
- Check logs in Render/Vercel dashboards
- Test locally first
- Read error messages carefully

---

**🎉 Congratulations! Your gaming bot is now live and FREE!**
