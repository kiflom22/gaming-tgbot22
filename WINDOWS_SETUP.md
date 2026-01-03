# Windows Setup Guide

## ⚠️ MongoDB Not Installed

Your server is trying to connect to MongoDB but it's not running. You have 2 options:

## Option 1: Use MongoDB Atlas (Cloud - Easiest) ✅

### 1. Create Free MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create a free cluster (M0 - Free tier)
4. Wait 3-5 minutes for cluster to be created

### 2. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name at the end:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/telegram-gaming?retryWrites=true&w=majority
   ```

### 3. Update Backend .env

Open `backend/.env` and replace:
```env
MONGODB_URI=mongodb://localhost:27017/telegram-gaming
```

With your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/telegram-gaming?retryWrites=true&w=majority
```

### 4. Start Backend

```powershell
cd backend
npm start
```

✅ Done! Your backend will connect to cloud MongoDB.

---

## Option 2: Install MongoDB Locally

### 1. Download MongoDB

1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - Version: 7.0.x (latest)
   - Platform: Windows
   - Package: MSI
3. Download and run installer

### 2. Install MongoDB

1. Run the MSI installer
2. Choose "Complete" installation
3. Check "Install MongoDB as a Service"
4. Check "Install MongoDB Compass" (GUI tool)
5. Click Install

### 3. Verify Installation

Open PowerShell and run:
```powershell
mongod --version
```

You should see MongoDB version info.

### 4. Start MongoDB Service

```powershell
# Start MongoDB service
net start MongoDB

# Or if that doesn't work:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

### 5. Start Backend

```powershell
cd backend
npm start
```

---

## 🚀 Quick Test (Without MongoDB)

If you want to test the backend without MongoDB, I can create a simple in-memory version for testing.

Would you like me to create a test version that doesn't need MongoDB?

---

## ✅ Verify Backend is Running

Once MongoDB is connected, you should see:

```
✅ MongoDB connected successfully
✅ Game statuses initialized
🚀 Server running on port 8000
📱 Frontend URL: http://localhost:3000
🔐 JWT Secret: ✓ Set
🤖 Bot Token: ✓ Set

📚 API Endpoints:
   POST   /api/user/auth/
   GET    /api/user/verify/
   ...
```

Then test:
```powershell
# Test health endpoint
curl http://localhost:8000/health
```

Should return:
```json
{"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

---

## 🆘 Troubleshooting

### "MongoDB connection error"

**Solution 1: Use MongoDB Atlas (recommended)**
- Follow Option 1 above
- No installation needed
- Free forever

**Solution 2: Check MongoDB service**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start it if stopped
net start MongoDB
```

### "nodemon not found"

Already fixed! Use `npm start` instead of `npm run dev`.

### "Port 8000 already in use"

```powershell
# Find what's using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

---

## 📝 Current Status

✅ Backend code created
✅ Dependencies installed
✅ .env file created
⏳ Need MongoDB connection

**Next step:** Choose Option 1 (MongoDB Atlas) or Option 2 (Local MongoDB)

I recommend **Option 1 (MongoDB Atlas)** - it's easier and free!
