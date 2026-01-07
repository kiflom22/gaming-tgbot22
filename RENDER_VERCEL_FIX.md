# 🚀 Render + Vercel Connection Fix Guide

## ✅ What I've Fixed in Your Code

### 1. Django Settings (backend/config/settings.py)
- ✅ Added `gaming-tgbot22-1.onrender.com` to ALLOWED_HOSTS
- ✅ Added `shamvirtual.vercel.app` to ALLOWED_HOSTS
- ✅ Updated CORS_ALLOWED_ORIGINS to include your Vercel frontend
- ✅ Added CSRF_TRUSTED_ORIGINS for both domains
- ✅ Health check endpoint added at `/api/user/health/`

### 2. Frontend Environment (frontend/.env.production)
- ✅ Already set to: `https://gaming-tgbot22-1.onrender.com`

### 3. Requirements (backend/requirements.txt)
- ✅ All dependencies are up to date

---

## 🔧 Steps to Complete Deployment

### Step 1: Update Render Environment Variables

Go to your Render Dashboard → `gaming-tgbot22-1` service → Environment

Add/Update these variables:

```
ALLOWED_HOSTS=gaming-tgbot22-1.onrender.com,shamvirtual.vercel.app,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://shamvirtual.vercel.app
DEBUG=False
DJANGO_SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
```

### Step 2: Verify Render Build Settings

Make sure your Render service has:

**Build Command:**
```bash
pip install -r backend/requirements.txt
python backend/manage.py collectstatic --noinput
python backend/manage.py migrate
```

**Start Command:**
```bash
cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

### Step 3: Update Vercel Environment Variables

Go to Vercel Dashboard → `shamvirtual` project → Settings → Environment Variables

Make sure you have:

```
VITE_API_URL=https://gaming-tgbot22-1.onrender.com
```

**Important:** After updating, click "Redeploy" in Vercel Deployments tab.

### Step 4: Push Changes to GitHub

```bash
git add .
git commit -m "Fix Render and Vercel connection settings"
git push origin main
```

This will trigger automatic deployments on both Render and Vercel.

### Step 5: Wait for Deployments

1. **Render**: Check logs at https://dashboard.render.com
   - Wait for "Build successful" message
   - Wait for "Starting service" message

2. **Vercel**: Check deployments at https://vercel.com/dashboard
   - Wait for "Ready" status

---

## 🧪 Testing the Connection

### Test 1: Backend Health Check

Open your browser and visit:
```
https://gaming-tgbot22-1.onrender.com/api/user/health/
```

You should see:
```json
{
  "status": "healthy",
  "service": "Django Backend",
  "url": "https://gaming-tgbot22-1.onrender.com",
  "message": "Backend is running successfully!"
}
```

### Test 2: Frontend to Backend Connection

1. Go to: https://shamvirtual.vercel.app
2. Open browser console (F12)
3. Run this test:

```javascript
fetch('https://gaming-tgbot22-1.onrender.com/api/user/health/')
  .then(res => {
    console.log('✅ Status:', res.status);
    return res.json();
  })
  .then(data => console.log('✅ Backend says:', data))
  .catch(err => console.error('❌ Error:', err));
```

Expected output:
```
✅ Status: 200
✅ Backend says: {status: "healthy", service: "Django Backend", ...}
```

### Test 3: Try Login/Register

1. Go to your frontend: https://shamvirtual.vercel.app
2. Try to register or login
3. Check browser console for any errors

---

## 🐛 Troubleshooting

### Issue: CORS Error in Browser Console

**Error:** `Access to fetch at 'https://gaming-tgbot22-1.onrender.com' from origin 'https://shamvirtual.vercel.app' has been blocked by CORS policy`

**Solution:**
1. Check Render environment variables include `CORS_ALLOWED_ORIGINS=https://shamvirtual.vercel.app`
2. Redeploy Render service
3. Clear browser cache and try again

### Issue: 404 Not Found

**Error:** `GET https://gaming-tgbot22-1.onrender.com/api/user/health/ 404`

**Solution:**
1. Make sure you pushed the latest code to GitHub
2. Check Render logs for migration errors
3. Manually trigger a redeploy on Render

### Issue: 500 Internal Server Error

**Solution:**
1. Check Render logs: Dashboard → Your Service → Logs
2. Look for Python errors or missing environment variables
3. Common issues:
   - Missing `DJANGO_SECRET_KEY`
   - Missing `DATABASE_URL` (if using PostgreSQL)
   - Migration errors

### Issue: Vercel Shows Old Backend URL

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Update `VITE_API_URL` to `https://gaming-tgbot22-1.onrender.com`
3. Go to Deployments tab
4. Click "..." menu → "Redeploy"
5. Clear browser cache (Ctrl+Shift+Delete)

---

## 📋 Quick Checklist

Before testing, make sure:

- [ ] Code pushed to GitHub
- [ ] Render environment variables updated
- [ ] Render service redeployed successfully
- [ ] Vercel environment variables updated
- [ ] Vercel redeployed successfully
- [ ] Browser cache cleared
- [ ] Health check endpoint returns 200 OK
- [ ] No CORS errors in browser console

---

## 🎯 Next Steps After Connection Works

1. Test all features:
   - User registration
   - User login
   - Game playing
   - Withdrawals
   - Admin panel

2. Monitor Render logs for any errors

3. Set up custom domain (optional):
   - Render: Add custom domain in settings
   - Vercel: Add custom domain in settings
   - Update ALLOWED_HOSTS and CORS settings

---

## 📞 Need Help?

If you're still having issues:

1. Check Render logs: `Dashboard → Service → Logs`
2. Check Vercel logs: `Dashboard → Deployments → Click deployment → View Function Logs`
3. Check browser console (F12) for frontend errors
4. Share the error messages for specific help

---

**Your Backend URL:** https://gaming-tgbot22-1.onrender.com
**Your Frontend URL:** https://shamvirtual.vercel.app
**Health Check:** https://gaming-tgbot22-1.onrender.com/api/user/health/
