# Complete Setup Guide - MERN Gaming Bot

## 🎯 What You Have Now

✅ **Frontend** - React app with secure authentication
✅ **Backend** - Node.js + Express + MongoDB (MERN Stack)
✅ **Complete System** - Ready to deploy!

---

## 📦 Quick Start (5 Minutes)

### Step 1: Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Or use MongoDB Atlas (Cloud - Free):**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account
- Create cluster
- Get connection string

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
nano .env
```

**Edit `.env`:**
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/telegram-gaming
JWT_SECRET=change-this-to-random-secret-key-abc123xyz
BOT_TOKEN=your-telegram-bot-token-from-botfather
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Start backend:**
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Game statuses initialized
🚀 Server running on port 8000
```

### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Start frontend
npm run dev
```

Frontend will start on http://localhost:3000

### Step 4: Test It!

1. Open http://localhost:3000 in browser
2. You should see the Auth page
3. (For now, backend will show error because you need real Telegram initData)

---

## 🤖 Get Telegram Bot Token

### Create Bot with BotFather

1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Follow instructions:
   - Bot name: `My Gaming Bot`
   - Username: `my_gaming_bot` (must end with 'bot')
5. Copy the token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
6. Paste in backend `.env` as `BOT_TOKEN`

### Setup WebApp

1. Send `/setdomain` to BotFather
2. Select your bot
3. Send your frontend URL (e.g., `https://your-app.vercel.app`)

---

## 🚀 Deployment

### Deploy Backend (Railway - Free)

```bash
cd backend

# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Add MongoDB
# Go to Railway dashboard → Add MongoDB plugin

# Set environment variables in Railway dashboard:
# - JWT_SECRET
# - BOT_TOKEN
# - FRONTEND_URL (your Vercel URL)
```

Your backend will be at: `https://your-app.up.railway.app`

### Deploy Frontend (Vercel - Free)

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable:
# VITE_API_URL = your Railway backend URL
```

Your frontend will be at: `https://your-app.vercel.app`

### Update Telegram Bot

1. Go to BotFather
2. Send `/setmenubutton`
3. Select your bot
4. Send your Vercel URL
5. Test by opening bot in Telegram!

---

## 🧪 Testing Locally

### Option 1: Use Telegram Test Environment

1. Create test bot with BotFather
2. Open bot in Telegram
3. Bot will provide initData
4. Frontend will authenticate

### Option 2: Mock Authentication (Development Only)

Add this to `backend/routes/auth.js` for testing:

```javascript
// DEVELOPMENT ONLY - Remove in production!
router.post('/auth/test/', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Not available in production' });
  }
  
  const { telegram_id, username, first_name } = req.body;
  
  let user = await User.findOne({ telegram_id });
  if (!user) {
    user = new User({ telegram_id, username, first_name, balance: 1000 });
    await user.save();
  }
  
  const token = generateToken(user);
  res.json({ token, user: { telegram_id, username, first_name, balance: user.balance }, is_admin: false });
});
```

Then in frontend, temporarily modify `Auth.jsx`:

```javascript
// For testing only
const handleSignup = async () => {
  const testData = {
    telegram_id: 12345,
    username: 'testuser',
    first_name: 'Test'
  };
  
  const res = await fetch('http://localhost:8000/api/user/auth/test/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
  });
  
  const data = await res.json();
  if (data.token) {
    await onAuthSuccess(data.token);
  }
};
```

---

## 📊 Database Structure

Your MongoDB will have these collections:

### users
```javascript
{
  telegram_id: 123456789,
  username: "john_doe",
  first_name: "John",
  balance: 1000,
  is_admin: false,
  games_played: 50,
  total_wagered: 500,
  total_won: 600,
  total_lost: 400
}
```

### gamesessions
```javascript
{
  telegram_id: 123456789,
  game_type: "plinko",
  bet_amount: 10,
  result: "win",
  multiplier: 2.0,
  points_change: 10,
  created_at: "2024-01-01T12:00:00Z"
}
```

### withdrawals
```javascript
{
  telegram_id: 123456789,
  points: 500,
  amount: 500,
  payment_method: "bank",
  payment_details: "Account: 123456",
  status: "pending",
  created_at: "2024-01-01T12:00:00Z"
}
```

### gamestatuses
```javascript
{
  game_type: "plinko",
  is_enabled: true,
  maintenance_message: "Plinko is under maintenance"
}
```

---

## 🔧 Common Issues

### "MongoDB connection error"
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### "Cannot connect to backend"
- Check backend is running on port 8000
- Check VITE_API_URL in frontend .env
- Check CORS settings in backend

### "Invalid token"
- Clear localStorage in browser
- Sign up again
- Check JWT_SECRET is set in backend

### "Telegram validation failed"
- Check BOT_TOKEN is correct
- Ensure app is opened via Telegram
- Check initData is not expired

---

## 📁 Project Structure

```
project/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.jsx     # Signup page
│   │   │   ├── Lobby.jsx    # Game lobby
│   │   │   ├── Plinko.jsx   # Plinko game
│   │   │   └── ...
│   │   ├── api.js           # API calls
│   │   └── App.jsx          # Main app
│   └── package.json
│
└── backend/                  # Node.js backend
    ├── models/              # MongoDB models
    │   ├── User.js
    │   ├── GameSession.js
    │   ├── Withdrawal.js
    │   └── GameStatus.js
    ├── routes/              # API routes
    │   ├── auth.js
    │   ├── games.js
    │   └── withdrawals.js
    ├── middleware/          # Auth middleware
    ├── utils/               # JWT & Telegram utils
    ├── config/              # Database config
    ├── server.js            # Main server
    └── package.json
```

---

## ✅ Deployment Checklist

### Backend
- [ ] MongoDB database created (local or Atlas)
- [ ] Environment variables set
- [ ] JWT_SECRET is strong random string
- [ ] BOT_TOKEN from BotFather
- [ ] Deployed to Railway/Render/Heroku
- [ ] HTTPS enabled
- [ ] CORS configured for frontend URL

### Frontend
- [ ] VITE_API_URL points to backend
- [ ] Deployed to Vercel/Netlify
- [ ] HTTPS enabled
- [ ] Telegram WebApp URL configured

### Telegram Bot
- [ ] Bot created with BotFather
- [ ] WebApp URL set to frontend
- [ ] Menu button configured
- [ ] Bot tested in Telegram

---

## 🎉 You're Done!

Your complete MERN stack gaming bot is ready!

**Test the flow:**
1. Open bot in Telegram
2. Click "Play" or menu button
3. See signup page with your Telegram profile
4. Click "Sign Up & Start Playing"
5. Play games!

**Next steps:**
- Add more games
- Implement admin panel
- Add analytics
- Set up monitoring
- Add payment integration

---

## 📚 Documentation

- Frontend: `frontend/README_AUTH.md`
- Backend: `backend/README.md`
- Security: `frontend/SECURITY.md`
- Workflow: `frontend/WORKFLOW.md`

## 🆘 Need Help?

Check the documentation files or review the code comments. Everything is well-documented!

**Happy Gaming! 🎮**
