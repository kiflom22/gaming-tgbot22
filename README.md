# 🎮 Telegram Gaming Bot - Complete MERN Stack

A secure, full-featured gaming bot for Telegram with real money withdrawals. Built with **MERN Stack** (MongoDB, Express, React, Node.js).

## ✨ Features

- 🎯 **5 Exciting Games**: Plinko, Slots, Wheel of Fortune, Find the Joker, Mines
- 🔐 **Secure Authentication**: Telegram initData validation + JWT tokens
- 💰 **Real Money**: Points system with withdrawal capabilities (1 Point = 1 Birr)
- 📊 **Statistics**: Track wins, losses, and game history
- 👑 **Admin Panel**: Manage users, deposits, and withdrawals
- 🎨 **Beautiful UI**: Modern design with smooth animations
- 📱 **Mobile First**: Optimized for Telegram WebApp
- 🚀 **Production Ready**: Secure, scalable, and deployable

## 🏗️ Architecture

```
Telegram WebApp
      ↓
React Frontend (Vite + TailwindCSS)
      ↓
Node.js Backend (Express + JWT)
      ↓
MongoDB Database (Mongoose)
```

## 📁 Project Structure

```
project/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── pages/        # Game pages
│   │   ├── components/   # Reusable components
│   │   ├── hooks/        # Custom hooks
│   │   ├── api.js        # API client
│   │   └── App.jsx       # Main app
│   └── package.json
│
├── backend/              # Node.js backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utilities
│   ├── config/          # Configuration
│   ├── server.js        # Main server
│   └── package.json
│
├── SETUP_GUIDE.md       # Complete setup instructions
├── ARCHITECTURE.md      # System architecture
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Telegram Bot Token

### 1. Clone & Install

```bash
# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

Required environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/telegram-gaming
JWT_SECRET=your-secret-key
BOT_TOKEN=your-telegram-bot-token
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### 3. Start Services

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start backend
cd backend
npm run dev

# Terminal 3: Start frontend
cd frontend
npm run dev
```

### 4. Create Telegram Bot

1. Open Telegram, search for `@BotFather`
2. Send `/newbot` and follow instructions
3. Copy bot token to backend `.env`
4. Send `/setmenubutton` to configure WebApp URL

## 🎮 Games

### 🎯 Plinko
Drop a ball through pegs, land on multipliers up to 10x!

### 🎰 Slots
Spin the reels for jackpots up to 10x!

### 🎡 Wheel of Fortune
Spin the wheel, land on prizes up to 50x!

### 🃏 Find the Joker
Track the Joker through the shuffle, win 2.5x!

### ⛏️ Mines
Reveal gems, avoid mines, cash out anytime!

## 🔐 Security

- ✅ Telegram initData signature validation
- ✅ JWT token authentication
- ✅ Server-side balance validation
- ✅ Server-side game logic
- ✅ Protected API endpoints
- ✅ Input validation
- ✅ CORS protection

**Users CANNOT:**
- ❌ Manipulate their balance
- ❌ Impersonate other users
- ❌ Cheat in games
- ❌ Forge authentication

## 📊 API Endpoints

### Authentication
- `POST /api/user/auth/` - Authenticate with Telegram
- `GET /api/user/verify/` - Verify JWT token
- `GET /api/user/balance/` - Get user balance
- `GET /api/user/stats/` - Get user statistics

### Games
- `GET /games/api/status/` - Get game statuses
- `POST /games/api/play/` - Play a game
- `GET /games/api/history/` - Get game history

### Withdrawals
- `POST /api/user/withdrawal/` - Request withdrawal
- `GET /api/user/withdrawals/` - Get withdrawal history

## 🗄️ Database Schema

### User
```javascript
{
  telegram_id: Number,
  username: String,
  first_name: String,
  balance: Number,
  is_admin: Boolean,
  games_played: Number,
  total_wagered: Number,
  total_won: Number,
  total_lost: Number
}
```

### GameSession
```javascript
{
  telegram_id: Number,
  game_type: String,
  bet_amount: Number,
  result: String,
  multiplier: Number,
  points_change: Number,
  game_data: Object,
  created_at: Date
}
```

### Withdrawal
```javascript
{
  telegram_id: Number,
  points: Number,
  amount: Number,
  payment_method: String,
  payment_details: String,
  status: String,
  created_at: Date
}
```

## 🚀 Deployment

### Backend (Railway)

```bash
cd backend
railway login
railway init
railway up
```

Add MongoDB plugin in Railway dashboard.

### Frontend (Vercel)

```bash
cd frontend
vercel
```

Set `VITE_API_URL` to your Railway backend URL.

### Configure Telegram Bot

1. Go to BotFather
2. Send `/setmenubutton`
3. Set your Vercel URL
4. Test in Telegram!

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture details
- **[frontend/SECURITY.md](frontend/SECURITY.md)** - Security implementation
- **[frontend/WORKFLOW.md](frontend/WORKFLOW.md)** - Request flow details
- **[backend/README.md](backend/README.md)** - Backend documentation

## 🧪 Testing

### Local Testing

```bash
# Start all services
npm run dev  # in both frontend and backend

# Open http://localhost:3000
```

### Production Testing

1. Deploy backend and frontend
2. Configure Telegram bot with production URLs
3. Open bot in Telegram
4. Test signup and games

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Framer Motion
- React Router

### Backend
- Node.js
- Express
- Mongoose
- JWT
- Crypto

### Database
- MongoDB

### Deployment
- Vercel (Frontend)
- Railway (Backend)
- MongoDB Atlas (Database)

## 📈 Features Roadmap

- [ ] Leaderboard
- [ ] Daily bonuses
- [ ] Referral system
- [ ] More games
- [ ] Live chat
- [ ] Push notifications
- [ ] Payment gateway integration
- [ ] Multi-language support

## 🤝 Contributing

This is a complete, production-ready project. Feel free to:
- Add more games
- Improve UI/UX
- Add features
- Fix bugs
- Optimize performance

## 📝 License

MIT License - feel free to use for your own projects!

## 🆘 Support

Check the documentation files:
- Setup issues? → `SETUP_GUIDE.md`
- Architecture questions? → `ARCHITECTURE.md`
- Security concerns? → `frontend/SECURITY.md`
- API questions? → `backend/README.md`

## ✅ What You Get

✅ Complete MERN stack application
✅ Secure authentication system
✅ 5 fully functional games
✅ Admin panel
✅ Withdrawal system
✅ Beautiful UI with animations
✅ Production-ready code
✅ Comprehensive documentation
✅ Easy deployment
✅ Scalable architecture

## 🎉 Ready to Launch!

Your complete gaming bot is ready. Follow the setup guide and you'll be live in minutes!

**Happy Gaming! 🎮**

---

Made with ❤️ using MERN Stack
