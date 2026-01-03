# ✅ Deployment Checklist - PythonAnywhere + Vercel

## 🎯 Quick Setup (30 minutes)

---

## 📋 PART 1: PythonAnywhere (Backend)

### Account Setup
- [ ] Go to https://www.pythonanywhere.com
- [ ] Create free account (no credit card)
- [ ] Verify email

### Upload Code
- [ ] Open Bash console
- [ ] Clone your GitHub repo: `git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git`
- [ ] Navigate to backend: `cd YOUR_REPO/backend`

### Setup Environment
- [ ] Create virtualenv: `mkvirtualenv --python=/usr/bin/python3.10 myenv`
- [ ] Install packages: `pip install django djangorestframework django-cors-headers PyJWT python-dotenv cryptography mysqlclient`

### Setup Database
- [ ] Go to "Databases" tab
- [ ] Set MySQL password
- [ ] Click "Initialize MySQL"
- [ ] Note database name: `YOUR_USERNAME$gaming_bot`

### Configure Django
- [ ] Edit `config/settings.py`
- [ ] Update DATABASES with MySQL credentials
- [ ] Update ALLOWED_HOSTS: `['YOUR_USERNAME.pythonanywhere.com']`
- [ ] Set DEBUG = False
- [ ] Save file

### Create Web App
- [ ] Go to "Web" tab
- [ ] Click "Add a new web app"
- [ ] Choose "Manual configuration"
- [ ] Choose "Python 3.10"

### Configure WSGI
- [ ] Click WSGI configuration file
- [ ] Replace content with WSGI code (see guide)
- [ ] Update YOUR_USERNAME and YOUR_REPO
- [ ] Save

### Set Virtualenv
- [ ] In "Web" tab, "Virtualenv" section
- [ ] Enter: `/home/YOUR_USERNAME/.virtualenvs/myenv`

### Setup Static Files
- [ ] In "Web" tab, "Static files" section
- [ ] URL: `/static/`
- [ ] Directory: `/home/YOUR_USERNAME/YOUR_REPO/backend/staticfiles`

### Run Migrations
- [ ] Open Bash console
- [ ] `cd YOUR_REPO/backend`
- [ ] `workon myenv`
- [ ] `python manage.py migrate`
- [ ] `python manage.py collectstatic --noinput`

### Initialize Games
- [ ] `python manage.py shell`
- [ ] Paste game initialization code (see guide)
- [ ] Type `exit()`

### Reload Web App
- [ ] Go to "Web" tab
- [ ] Click green "Reload" button
- [ ] Wait 30 seconds

### Test Backend
- [ ] Visit: `https://YOUR_USERNAME.pythonanywhere.com/games/api/status/`
- [ ] Should see JSON response

---

## 🎨 PART 2: Vercel (Frontend)

### Account Setup
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub (no credit card)

### Prepare Code
- [ ] Create `frontend/.env.production`
- [ ] Add: `VITE_API_URL=https://YOUR_USERNAME.pythonanywhere.com`
- [ ] Commit and push to GitHub

### Deploy
- [ ] In Vercel, click "Add New" → "Project"
- [ ] Import your GitHub repository
- [ ] Root Directory: `frontend`
- [ ] Framework: Vite
- [ ] Click "Deploy"
- [ ] Wait 2-3 minutes

### Get URL
- [ ] Note your Vercel URL: `https://your-project.vercel.app`

### Update Backend CORS
- [ ] Go back to PythonAnywhere
- [ ] Edit `config/settings.py`
- [ ] Update CORS_ALLOWED_ORIGINS with your Vercel URL
- [ ] Save
- [ ] Reload web app

### Test Frontend
- [ ] Visit your Vercel URL
- [ ] Should load the app

---

## 👤 PART 3: Create Admin

### Make Admin User
- [ ] In PythonAnywhere Bash console
- [ ] `cd YOUR_REPO/backend`
- [ ] `workon myenv`
- [ ] `python scripts/make_admin.py YOUR_TELEGRAM_ID`

### Test Admin Access
- [ ] Login to your app
- [ ] Go to Admin Panel
- [ ] Should see admin features

---

## ✅ PART 4: Final Testing

### Test Backend
- [ ] API responds: `https://YOUR_USERNAME.pythonanywhere.com/games/api/status/`
- [ ] No errors in PythonAnywhere error log

### Test Frontend
- [ ] App loads: `https://your-project.vercel.app`
- [ ] Can login
- [ ] Games work
- [ ] Balance updates

### Test Admin Features
- [ ] Can access admin panel
- [ ] Can add points
- [ ] Can suspend users
- [ ] Can approve withdrawals
- [ ] Can control games

---

## 🎉 You're Done!

### Your Live URLs:
```
Frontend: https://your-project.vercel.app
Backend:  https://YOUR_USERNAME.pythonanywhere.com
```

### Share with Users:
Just share your Vercel URL!

---

## 📝 Important Info to Save

### PythonAnywhere:
- Username: `YOUR_USERNAME`
- MySQL Password: `___________`
- Database: `YOUR_USERNAME$gaming_bot`
- Web App: `https://YOUR_USERNAME.pythonanywhere.com`

### Vercel:
- Project: `your-project`
- URL: `https://your-project.vercel.app`

### GitHub:
- Repository: `https://github.com/YOUR_USERNAME/YOUR_REPO`

---

## 🔄 To Update Later:

### Update Backend:
```bash
cd YOUR_REPO/backend
git pull
workon myenv
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```
Then reload web app in PythonAnywhere.

### Update Frontend:
Just push to GitHub - Vercel auto-deploys!

---

## 💡 Quick Tips:

1. **Save your MySQL password** - you'll need it
2. **Bookmark your URLs** - easy access
3. **Check error logs** if something breaks
4. **Test everything** before sharing
5. **Keep your GitHub repo updated**

---

## 🆘 If Something Goes Wrong:

### Backend not working:
1. Check PythonAnywhere error log (Web tab)
2. Check database credentials
3. Run migrations again
4. Reload web app

### Frontend not connecting:
1. Check VITE_API_URL in Vercel
2. Check CORS in backend settings.py
3. Redeploy frontend

### Can't login:
1. Check backend is running
2. Check CORS settings
3. Check browser console for errors

---

**Total Time:** ~30 minutes  
**Total Cost:** $0 forever  
**Credit Card:** Not required  

**🎉 Enjoy your free gaming bot!**
