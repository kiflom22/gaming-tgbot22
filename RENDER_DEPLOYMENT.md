# 🚀 Deploy to Render (Backend) + Vercel (Frontend)

## ✅ Why Render?
- 100% FREE (no credit card needed)
- Easier than PythonAnywhere
- Automatic deployments from GitHub
- Free PostgreSQL database included

---

## 📋 STEP 1: Push Updated Code to GitHub

```bash
git add .
git commit -m "Add Render deployment files"
git push
```

---

## 🎯 STEP 2: Deploy Backend to Render

### A. Create Render Account
1. Go to: https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (no credit card needed)

### B. Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `gaming-tgbot22`
3. Configure:
   - **Name:** `gaming-bot-backend` (or any name)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn config.wsgi:application`
   - **Instance Type:** `Free`

### C. Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these:

```
DJANGO_SECRET_KEY=your-super-secret-key-change-this-now
DEBUG=False
PYTHON_VERSION=3.10.12
JWT_SECRET=your-jwt-secret-change-this
```

### D. Create PostgreSQL Database
1. Click **"New +"** → **"PostgreSQL"**
2. **Name:** `gaming-bot-db`
3. **Instance Type:** `Free`
4. Click **"Create Database"**

### E. Connect Database to Web Service
1. Go back to your Web Service
2. **Environment** tab
3. Click **"Add Environment Variable"**
4. **Key:** `DATABASE_URL`
5. **Value:** Click **"Add from Database"** → Select your PostgreSQL database → Select **"Internal Database URL"**

### F. Deploy!
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. You'll get a URL like: `https://gaming-bot-backend.onrender.com`

---

## 🎨 STEP 3: Deploy Frontend to Vercel

### A. Update Frontend Config
Your backend URL will be: `https://YOUR-SERVICE-NAME.onrender.com`

Update `frontend/.env.production`:
```env
VITE_API_URL=https://YOUR-SERVICE-NAME.onrender.com
```

Commit and push:
```bash
git add frontend/.env.production
git commit -m "Update API URL for Render"
git push
```

### B. Deploy to Vercel
1. Go to: https://vercel.com
2. Sign up with **GitHub**
3. Click **"Add New"** → **"Project"**
4. Import `gaming-tgbot22`
5. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://YOUR-SERVICE-NAME.onrender.com`
7. Click **"Deploy"**

---

## 🔗 STEP 4: Update CORS

### A. Get Your Vercel URL
After Vercel deployment, you'll get: `https://your-project.vercel.app`

### B. Update Backend CORS
1. Go to Render dashboard
2. Click your Web Service
3. Go to **"Environment"** tab
4. Add new variable:
   - **Key:** `CORS_ALLOWED_ORIGINS`
   - **Value:** `https://your-project.vercel.app,http://localhost:5173`
5. Click **"Save Changes"**
6. Service will auto-redeploy

---

## 👤 STEP 5: Create Admin User

### A. Open Render Shell
1. Go to your Web Service in Render
2. Click **"Shell"** tab (top right)
3. Run:
```bash
python scripts/make_admin.py YOUR_TELEGRAM_ID
```

Replace `YOUR_TELEGRAM_ID` with your actual Telegram ID.

---

## ✅ STEP 6: Test Everything

### Test Backend:
```
https://YOUR-SERVICE-NAME.onrender.com/games/api/status/
```
Should see JSON data ✅

### Test Frontend:
```
https://your-project.vercel.app
```
Should load the app ✅

---

## 🎉 You're Live!

**Your URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://YOUR-SERVICE-NAME.onrender.com`

**Share with users:** Just share your Vercel URL!

---

## 📝 Important Notes:

1. **Free tier limitations:**
   - Render: Service sleeps after 15 min of inactivity (first request takes 30-60 seconds to wake up)
   - Database: 90 days free, then $7/month (or use free tier forever with activity)

2. **Keep it active:**
   - Use a service like UptimeRobot to ping your backend every 10 minutes

3. **Automatic deployments:**
   - Push to GitHub → Render and Vercel auto-deploy!

---

## 🔄 To Update Later:

Just push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Both Render and Vercel will automatically redeploy! 🚀

---

## 🆘 Troubleshooting:

### Backend not working:
1. Check Render logs (Logs tab)
2. Verify environment variables
3. Check DATABASE_URL is connected

### Frontend not connecting:
1. Check VITE_API_URL in Vercel
2. Check CORS_ALLOWED_ORIGINS in Render
3. Check browser console for errors

---

**Total Time:** ~20 minutes  
**Total Cost:** $0 forever (with limitations)  
**Difficulty:** Easy! 😊
