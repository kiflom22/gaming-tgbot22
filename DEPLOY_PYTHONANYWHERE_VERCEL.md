# 🚀 Deploy with PythonAnywhere + Vercel (100% FREE)

**No credit card required! Completely free forever!**

---

## 📋 What You'll Get:

- ✅ **Backend:** PythonAnywhere (FREE forever)
- ✅ **Frontend:** Vercel (FREE forever)
- ✅ **Database:** MySQL on PythonAnywhere (FREE)
- ✅ **Total Cost:** $0/month
- ✅ **No Credit Card:** Required

---

## 🎯 PART 1: Deploy Backend to PythonAnywhere

### Step 1: Create PythonAnywhere Account

1. Go to: https://www.pythonanywhere.com
2. Click "Start running Python online in less than a minute!"
3. Click "Create a Beginner account"
4. Fill in:
   - Username
   - Email
   - Password
5. Click "Register"
6. ✅ No credit card needed!

---

### Step 2: Upload Your Code

**Option A: Using Git (Recommended)**

1. In PythonAnywhere, click "Consoles" → "Bash"
2. Run these commands:

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/backend

# Create virtual environment
mkvirtualenv --python=/usr/bin/python3.10 myenv

# Install dependencies
pip install django djangorestframework django-cors-headers PyJWT python-dotenv cryptography mysqlclient
```

**Option B: Upload Files Manually**

1. Click "Files" tab
2. Click "Upload a file"
3. Upload all files from `backend/` folder
4. Or use "Open Bash console here" and upload via command line

---

### Step 3: Setup MySQL Database

1. Go to "Databases" tab
2. Under "MySQL", set a password
3. Click "Initialize MySQL"
4. Note your database details:
   - **Host:** `YOUR_USERNAME.mysql.pythonanywhere-services.com`
   - **Database name:** `YOUR_USERNAME$gaming_bot`
   - **Username:** `YOUR_USERNAME`
   - **Password:** (the one you just set)

5. Click "Start a console on: YOUR_USERNAME$gaming_bot"
6. Create tables (we'll do this later with Django)

---

### Step 4: Configure Django Settings

1. Go to "Files" tab
2. Navigate to: `YOUR_REPO/backend/config/settings.py`
3. Click to edit
4. Update the DATABASES section:

```python
# Around line 70, replace DATABASES with:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'YOUR_USERNAME$gaming_bot',
        'USER': 'YOUR_USERNAME',
        'PASSWORD': 'your-mysql-password',
        'HOST': 'YOUR_USERNAME.mysql.pythonanywhere-services.com',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
```

5. Update ALLOWED_HOSTS:
```python
ALLOWED_HOSTS = ['YOUR_USERNAME.pythonanywhere.com', 'localhost']
```

6. Update CORS_ALLOWED_ORIGINS:
```python
CORS_ALLOWED_ORIGINS = [
    'https://your-project.vercel.app',  # Add your Vercel URL later
    'http://localhost:5173',
]
```

7. Set DEBUG to False:
```python
DEBUG = False
```

8. Click "Save"

---

### Step 5: Setup Web App

1. Go to "Web" tab
2. Click "Add a new web app"
3. Click "Next"
4. Choose "Manual configuration"
5. Choose "Python 3.10"
6. Click "Next"

---

### Step 6: Configure WSGI File

1. In "Web" tab, find "Code" section
2. Click on WSGI configuration file link (e.g., `/var/www/YOUR_USERNAME_pythonanywhere_com_wsgi.py`)
3. Delete everything and replace with:

```python
import os
import sys

# Add your project directory to the sys.path
path = '/home/YOUR_USERNAME/YOUR_REPO/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# Set environment variable for Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

**Replace:**
- `YOUR_USERNAME` with your PythonAnywhere username
- `YOUR_REPO` with your repository name

4. Click "Save"

---

### Step 7: Configure Virtual Environment

1. In "Web" tab, find "Virtualenv" section
2. Enter path: `/home/YOUR_USERNAME/.virtualenvs/myenv`
3. Click the checkmark

---

### Step 8: Configure Static Files

1. In "Web" tab, find "Static files" section
2. Add:
   - **URL:** `/static/`
   - **Directory:** `/home/YOUR_USERNAME/YOUR_REPO/backend/staticfiles`

---

### Step 9: Run Migrations

1. Go to "Consoles" → "Bash"
2. Run:

```bash
cd YOUR_REPO/backend
workon myenv

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Initialize games
python manage.py shell
```

3. In the Python shell, paste:

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

---

### Step 10: Reload Web App

1. Go to "Web" tab
2. Click the big green "Reload" button
3. Wait 30 seconds
4. Visit: `https://YOUR_USERNAME.pythonanywhere.com`
5. You should see Django error page (that's OK, we need frontend)

---

### Step 11: Test Backend API

Visit: `https://YOUR_USERNAME.pythonanywhere.com/games/api/status/`

You should see JSON response with game statuses!

✅ **Backend is live!**

---

## 🎨 PART 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account

1. Go to: https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel
5. ✅ No credit card needed!

---

### Step 2: Prepare Frontend

1. Update `frontend/.env.production`:

```env
VITE_API_URL=https://YOUR_USERNAME.pythonanywhere.com
```

**Replace `YOUR_USERNAME` with your PythonAnywhere username**

2. Commit and push to GitHub:

```bash
cd your-project
git add frontend/.env.production
git commit -m "Add production API URL"
git push
```

---

### Step 3: Deploy to Vercel

1. In Vercel Dashboard, click "Add New" → "Project"
2. Click "Import" next to your GitHub repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click "Deploy"
5. Wait 2-3 minutes

✅ **Frontend is live!**

Your URL will be: `https://your-project.vercel.app`

---

### Step 4: Update Backend CORS

1. Go back to PythonAnywhere
2. Go to "Files" → `YOUR_REPO/backend/config/settings.py`
3. Update CORS_ALLOWED_ORIGINS:

```python
CORS_ALLOWED_ORIGINS = [
    'https://your-project.vercel.app',  # Your actual Vercel URL
    'http://localhost:5173',
]
```

4. Save
5. Go to "Web" tab → Click "Reload"

---

### Step 5: Create Admin User

1. In PythonAnywhere, go to "Consoles" → "Bash"
2. Run:

```bash
cd YOUR_REPO/backend
workon myenv
python scripts/make_admin.py YOUR_TELEGRAM_ID
```

Example:
```bash
python scripts/make_admin.py 123456789
```

---

## ✅ PART 3: Test Everything

### 1. Test Backend
Visit: `https://YOUR_USERNAME.pythonanywhere.com/games/api/status/`
- Should see JSON with game statuses

### 2. Test Frontend
Visit: `https://your-project.vercel.app`
- Should load the app
- Try to login
- Test games

### 3. Test Admin Panel
1. Login with your admin account
2. Go to Admin Panel
3. Test all features:
   - Add points
   - Suspend users
   - Approve withdrawals
   - Control games

---

## 🎉 You're Live!

**Your URLs:**
- 🎨 Frontend: `https://your-project.vercel.app`
- ⚙️ Backend: `https://YOUR_USERNAME.pythonanywhere.com`
- 🗄️ Database: MySQL on PythonAnywhere

**Total Cost:** $0/month forever!

---

## 📊 Free Tier Limits

### PythonAnywhere Free:
- ✅ 1 web app
- ✅ 512 MB disk space
- ✅ MySQL database
- ✅ HTTPS included
- ✅ No sleep time
- ⚠️ Slower performance
- ⚠️ Limited CPU time (100 seconds/day)

### Vercel Free:
- ✅ Unlimited projects
- ✅ Unlimited bandwidth
- ✅ Fast CDN
- ✅ Automatic HTTPS
- ✅ No limits!

---

## 🔧 Troubleshooting

### Backend Issues:

**Error: "Something went wrong"**
1. Check PythonAnywhere error log:
   - Web tab → Log files → Error log
2. Common issues:
   - Wrong database credentials
   - Missing dependencies
   - Wrong paths in WSGI file

**Fix:**
```bash
# In PythonAnywhere Bash console
cd YOUR_REPO/backend
workon myenv
pip install -r requirements.txt
python manage.py migrate
```

**Database connection error:**
1. Check MySQL password is correct
2. Check database name: `YOUR_USERNAME$gaming_bot`
3. Check host: `YOUR_USERNAME.mysql.pythonanywhere-services.com`

**Static files not loading:**
```bash
python manage.py collectstatic --noinput
```
Then reload web app.

---

### Frontend Issues:

**Can't connect to backend:**
1. Check `VITE_API_URL` in Vercel:
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://YOUR_USERNAME.pythonanywhere.com`
   - Redeploy

2. Check CORS in backend settings.py

**Build failed:**
1. Check Vercel build logs
2. Make sure `frontend/package.json` is correct
3. Try deploying again

---

## 🔄 Updating Your App

### Update Backend:
```bash
# In PythonAnywhere Bash console
cd YOUR_REPO/backend
git pull
workon myenv
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

Then go to Web tab → Reload

### Update Frontend:
Just push to GitHub:
```bash
git add .
git commit -m "Update"
git push
```

Vercel will auto-deploy!

---

## 💡 Tips

### 1. Keep Backend Awake
PythonAnywhere doesn't sleep, but has CPU limits.
- Don't make too many requests
- Optimize your code
- Use caching

### 2. Monitor Usage
- Check PythonAnywhere dashboard for CPU usage
- Check Vercel analytics for traffic

### 3. Upgrade Later
If you need more:
- **PythonAnywhere:** $5/month for more CPU
- **Vercel:** Always free for personal projects

---

## 📞 Support

**PythonAnywhere:**
- Help: https://help.pythonanywhere.com
- Forum: https://www.pythonanywhere.com/forums/

**Vercel:**
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

---

## 🎯 Quick Reference

### Your URLs:
```
Frontend: https://your-project.vercel.app
Backend:  https://YOUR_USERNAME.pythonanywhere.com
Admin:    https://your-project.vercel.app (login as admin)
```

### Important Files:
```
Backend WSGI:  /var/www/YOUR_USERNAME_pythonanywhere_com_wsgi.py
Backend Code:  /home/YOUR_USERNAME/YOUR_REPO/backend
Settings:      /home/YOUR_USERNAME/YOUR_REPO/backend/config/settings.py
Database:      YOUR_USERNAME$gaming_bot
```

### Commands:
```bash
# Activate virtualenv
workon myenv

# Run migrations
python manage.py migrate

# Collect static
python manage.py collectstatic --noinput

# Make admin
python scripts/make_admin.py TELEGRAM_ID

# Check logs
tail -f /var/log/YOUR_USERNAME.pythonanywhere.com.error.log
```

---

## ✅ Checklist

Before going live:

- [ ] Backend deployed to PythonAnywhere
- [ ] Database created and migrated
- [ ] Games initialized
- [ ] Admin user created
- [ ] Frontend deployed to Vercel
- [ ] CORS configured correctly
- [ ] Tested login
- [ ] Tested games
- [ ] Tested admin panel
- [ ] Tested withdrawals

---

## 🎉 Congratulations!

Your gaming bot is now **100% FREE** and **LIVE**!

**Share your Vercel URL with users and enjoy!** 🚀

No credit card, no charges, completely free forever!
