# ⚡ Quick Deploy Reference Card

## 🎯 Your Deployment URLs (Fill These In):

```
GitHub Repo:    https://github.com/___________/gaming-bot
PythonAnywhere: https://___________. pythonanywhere.com
Vercel:         https://___________. vercel.app
```

---

## 📋 Quick Commands Reference

### Git Commands:
```bash
# Initialize and push
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/gaming-bot.git
git branch -M main
git push -u origin main

# Update later
git add .
git commit -m "Update"
git push
```

### PythonAnywhere Commands:
```bash
# Clone and setup
git clone https://github.com/YOUR_USERNAME/gaming-bot.git
cd gaming-bot/backend
mkvirtualenv --python=/usr/bin/python3.10 myenv
pip install django djangorestframework django-cors-headers PyJWT python-dotenv cryptography mysqlclient

# Migrations
python manage.py migrate
python manage.py collectstatic --noinput

# Make admin
python scripts/make_admin.py YOUR_TELEGRAM_ID

# Update code
cd gaming-bot/backend
git pull
workon myenv
python manage.py migrate
python manage.py collectstatic --noinput
```

---

## 🔧 Configuration Checklist

### PythonAnywhere Settings:
- [ ] MySQL database created
- [ ] MySQL password saved
- [ ] Web app created (Manual, Python 3.10)
- [ ] WSGI file configured
- [ ] Virtualenv path set: `/home/YOUR_USERNAME/.virtualenvs/myenv`
- [ ] Static files: `/static/` → `/home/YOUR_USERNAME/gaming-bot/backend/staticfiles`
- [ ] settings.py updated with database credentials
- [ ] ALLOWED_HOSTS updated
- [ ] CORS_ALLOWED_ORIGINS updated
- [ ] Web app reloaded

### Vercel Settings:
- [ ] GitHub connected
- [ ] Root directory: `frontend`
- [ ] Framework: Vite
- [ ] Environment variable: `VITE_API_URL` set
- [ ] Deployed successfully

---

## 🔑 Important Values to Replace:

### In Code:
- `YOUR_USERNAME` → Your PythonAnywhere username
- `YOUR_TELEGRAM_ID` → Your Telegram user ID
- `your-mysql-password` → Your MySQL password
- `your-project.vercel.app` → Your actual Vercel URL

### Files to Update:
1. `frontend/.env.production` - Add PythonAnywhere URL
2. `backend/config/settings.py` - Add Vercel URL to CORS
3. `backend/wsgi_pythonanywhere.py` - Replace YOUR_USERNAME

---

## 🧪 Testing Checklist:

### Backend Tests:
- [ ] `https://YOUR_USERNAME.pythonanywhere.com/games/api/status/` returns JSON
- [ ] No errors in PythonAnywhere error log
- [ ] Database connected successfully

### Frontend Tests:
- [ ] `https://your-project.vercel.app` loads
- [ ] Can login
- [ ] Games work
- [ ] Balance updates

### Admin Tests:
- [ ] Can access admin panel
- [ ] Can add points
- [ ] Can suspend users
- [ ] Can approve withdrawals
- [ ] Can control games

---

## 🆘 Quick Troubleshooting:

### Backend not working:
```bash
# Check error log in PythonAnywhere (Web tab)
# Run migrations again
cd gaming-bot/backend
workon myenv
python manage.py migrate
# Reload web app
```

### Frontend can't connect:
1. Check `VITE_API_URL` in Vercel environment variables
2. Check CORS in `backend/config/settings.py`
3. Redeploy frontend

### Database error:
1. Check MySQL password is correct
2. Check database name: `YOUR_USERNAME$gaming_bot`
3. Run migrations again

---

## 📞 Support Links:

- **PythonAnywhere Help:** https://help.pythonanywhere.com
- **Vercel Docs:** https://vercel.com/docs
- **Your Guides:** Check `DEPLOY_NOW.md` for detailed steps

---

## ⏱️ Deployment Time:

- **Git Setup:** 5 minutes
- **Backend Deploy:** 15 minutes
- **Frontend Deploy:** 10 minutes
- **Testing:** 5 minutes
- **Total:** ~35 minutes

---

## 💰 Cost:

- **PythonAnywhere:** $0/month (FREE forever)
- **Vercel:** $0/month (FREE forever)
- **GitHub:** $0/month (FREE forever)
- **Total:** $0/month ✅

---

## 🎉 After Deployment:

Your gaming bot will be:
- ✅ Live 24/7
- ✅ Accessible worldwide
- ✅ Fully functional
- ✅ Completely FREE

**Share your Vercel URL with users and enjoy!** 🚀
