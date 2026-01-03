# 🔧 Fix Admin Dashboard - Complete Guide

## The Problem

You're seeing **401 Unauthorized** errors because:
1. You're not logged in, OR
2. Your login token is invalid/expired, OR
3. You're not marked as admin in the database

## ✅ Complete Fix - Step by Step

### Step 1: Clear Browser Data

1. Press **F12** to open Developer Tools
2. Go to **Application** tab (or Storage in Firefox)
3. Click **Local Storage** → **http://localhost:3000**
4. Click **Clear All** button
5. Close Developer Tools
6. **Refresh page** (Ctrl+R)

### Step 2: Login Fresh

1. You should see the Login page
2. Enter:
   - Username: `admin`
   - Password: `admin123`
3. Click **Login**

### Step 3: Verify Login

After login, press **F12** again and check:
1. Go to **Application** → **Local Storage**
2. You should see:
   - `auth_token`: (a long string)
   - `user_data`: (JSON with your user info)
   - `is_admin`: `"true"`

If `is_admin` is NOT `"true"`, continue to Step 4.

### Step 4: Make Sure You're Admin (If Needed)

Open a new terminal:

```bash
cd backend
python manage.py shell
```

Then paste this:

```python
from apps.users.models import User

# Find admin user
try:
    admin = User.objects.get(username='admin')
    admin.is_admin = True
    admin.save()
    print(f"✅ {admin.username} is now admin!")
    print(f"   ID: {admin.id}")
    print(f"   Is Admin: {admin.is_admin}")
except User.DoesNotExist:
    print("❌ Admin user not found!")
    print("Creating admin user...")
    import hashlib
    telegram_id = int(hashlib.md5('admin'.encode()).hexdigest()[:15], 16) % (10 ** 10)
    admin = User.objects.create(
        telegram_id=telegram_id,
        username='admin',
        first_name='Admin',
        balance=10000,
        is_admin=True
    )
    print(f"✅ Admin created!")
    print(f"   Username: {admin.username}")
    print(f"   Password: any password works")

exit()
```

### Step 5: Login Again

1. Go back to browser
2. **Logout** (if logged in)
3. **Login** again: `admin` / `admin123`
4. Go to **Admin Panel**
5. Should work now! ✅

## 🎯 Quick Test

After logging in, open browser console (F12) and run:

```javascript
console.log('Token:', localStorage.getItem('auth_token'))
console.log('Is Admin:', localStorage.getItem('is_admin'))
```

Should show:
- Token: (a long string)
- Is Admin: "true"

## 🐛 Still Not Working?

### Check 1: Backend Running?

```bash
curl http://localhost:8000/games/api/status/
```

Should return JSON data.

### Check 2: Can You Login?

Try logging in and check browser console for errors.

### Check 3: Token Being Sent?

In browser console (F12 → Network tab):
1. Click on any API request
2. Check **Headers** section
3. Look for `Authorization: Bearer <token>`

If no Authorization header, the token isn't being sent.

### Check 4: Database Has Admin?

```bash
cd backend
python manage.py shell
```

```python
from apps.users.models import User
print(User.objects.filter(is_admin=True).count())
exit()
```

Should show at least 1.

## 🔄 Nuclear Option - Fresh Start

If nothing works, do a complete reset:

### 1. Clear Everything

```bash
# Stop both servers (Ctrl+C in terminals)

# Clear browser
# Press Ctrl+Shift+Delete
# Clear all data

# Delete database
cd backend
del db.sqlite3
```

### 2. Recreate Database

```bash
python manage.py migrate
python manage.py init_games
python scripts/create_admin_account.py
```

### 3. Start Servers

```bash
# Terminal 1
cd backend
python manage.py runserver 8000

# Terminal 2
cd frontend
npm run dev
```

### 4. Login Fresh

1. Go to http://localhost:3000
2. Login: `admin` / `admin123`
3. Go to Admin Panel
4. Should work! ✅

## ✅ Expected Result

After successful login and going to Admin Panel, you should see:

**Users Tab:**
- List of all users
- Your admin account
- Add Points button
- Suspend button

**Withdrawals Tab:**
- List of withdrawal requests (may be empty)

**Game History Tab:**
- List of game sessions (may be empty)

**Game Control Tab:**
- All 5 games listed
- Enable/Disable buttons
- Maintenance messages

## 📝 Summary

The issue is **authentication**. You need to:
1. ✅ Clear browser storage
2. ✅ Login as admin
3. ✅ Verify is_admin=true in database
4. ✅ Check token is being sent

**Most common fix:** Just clear browser storage and login again!

---

**Try clearing browser storage and logging in fresh! 🎉**
