# ✅ Deployment Checklist - Render + Vercel

## 🎯 Quick Start (Do This Now!)

### 1️⃣ Push Code to GitHub (1 minute)

```bash
git add .
git commit -m "Fix Render and Vercel connection"
git push origin main
```

### 2️⃣ Update Render Environment (2 minutes)

Go to: https://dashboard.render.com → Your Service → Environment

Add these variables:
```
DJANGO_SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
DEBUG=False
ALLOWED_HOSTS=gaming-tgbot22-1.onrender.com,shamvirtual.vercel.app,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://shamvirtual.vercel.app
```

Click "Save Changes" - Render will auto-redeploy.

### 3️⃣ Update Vercel Environment (1 minute)

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

Make sure you have:
```
VITE_API_URL=https://gaming-tgbot22-1.onrender.com
```

Then go to Deployments → Click "..." → "Redeploy"

### 4️⃣ Wait for Deployments (5-10 minutes)

- **Render**: Watch logs at dashboard
- **Vercel**: Watch deployments page

### 5️⃣ Test Connection (1 minute)

Open: https://gaming-tgbot22-1.onrender.com/api/user/health/

Should see:
```json
{"status": "healthy", "service": "Django Backend", ...}
```

Then test frontend: https://shamvirtual.vercel.app

---

## 📊 Status Tracking

| Step | Status | Notes |
|------|--------|-------|
| Code pushed to GitHub | ⏳ | Run: `git push origin main` |
| Render env variables set | ⏳ | Add 5 variables |
| Render deployed | ⏳ | Wait 5-10 min |
| Vercel env variables set | ⏳ | Add 1 variable |
| Vercel redeployed | ⏳ | Manual redeploy |
| Health check works | ⏳ | Test URL |
| Frontend connects | ⏳ | Test login |

---

## 🚨 Common Issues & Quick Fixes

### Issue: "This site can't be reached"
**Fix:** Wait longer - Render takes 5-10 minutes for first deploy

### Issue: CORS error in browser
**Fix:** 
1. Check Render env has `CORS_ALLOWED_ORIGINS=https://shamvirtual.vercel.app`
2. Redeploy Render
3. Clear browser cache

### Issue: 404 on health check
**Fix:**
1. Make sure code is pushed to GitHub
2. Check Render logs for errors
3. Manually redeploy on Render

### Issue: Vercel shows old backend
**Fix:**
1. Update `VITE_API_URL` in Vercel
2. Redeploy Vercel (important!)
3. Clear browser cache (Ctrl+Shift+Delete)

---

## 🎉 Success Criteria

You'll know it's working when:

✅ Health check returns JSON (not 404)
✅ No CORS errors in browser console
✅ Can register/login on frontend
✅ Games load and work
✅ Admin panel accessible

---

## 📞 Next Steps After Success

1. Test all features thoroughly
2. Set up monitoring (optional)
3. Add custom domain (optional)
4. Set up database backups (recommended)

---

## 🔗 Important URLs

- **Backend**: https://gaming-tgbot22-1.onrender.com
- **Frontend**: https://shamvirtual.vercel.app
- **Health Check**: https://gaming-tgbot22-1.onrender.com/api/user/health/
- **Admin Panel**: https://shamvirtual.vercel.app/admin
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Time to Complete:** ~15-20 minutes (including deployment wait time)
**Difficulty:** Easy - just follow the steps!
