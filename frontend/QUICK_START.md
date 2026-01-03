# Quick Start Guide - How It Works

## 🎯 Simple Overview

### Before (INSECURE ❌)
```
User → Frontend → Backend
        "I am user 123456"
                  ↓
        Backend trusts this
        (Anyone can claim to be anyone!)
```

### After (SECURE ✅)
```
User → Telegram → Frontend → Backend
       (Signs data)  "Here's signed proof"
                              ↓
                     Backend verifies signature
                     Issues token
                              ↓
User → Frontend → Backend
       "Here's my token"
                  ↓
       Backend verifies token
       Knows who you are
```

---

## 📱 User Journey

### First Time User

```
┌─────────────────────────────────────────────────────────┐
│ 1. User clicks bot link in Telegram                    │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Telegram opens your WebApp                          │
│    - Provides initData (cryptographically signed)       │
│    - Contains: user ID, username, timestamp, signature  │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Frontend shows Auth Page                            │
│    ┌─────────────────────────────────────────────┐     │
│    │  🎮 Gaming Bot                              │     │
│    │                                              │     │
│    │  👤 John Doe (@john_doe)                    │     │
│    │                                              │     │
│    │  Welcome! Click below to create your        │     │
│    │  account and start playing games.           │     │
│    │                                              │     │
│    │  [🚀 Sign Up & Start Playing]               │     │
│    └─────────────────────────────────────────────┘     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. User clicks "Sign Up"                               │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Frontend sends initData to Backend                  │
│    POST /api/user/auth/                                │
│    Header: X-Telegram-Init-Data: query_id=xxx&user=... │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Backend validates signature                         │
│    ✓ Signature valid                                   │
│    ✓ User is real Telegram user                        │
│    ✓ Data not tampered with                            │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Backend creates/gets user in database               │
│    User {                                              │
│      telegram_id: 123456789                            │
│      username: "john_doe"                              │
│      first_name: "John"                                │
│      balance: 0                                        │
│    }                                                   │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 8. Backend generates JWT token                         │
│    Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."   │
│    Contains: telegram_id, expiration                   │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 9. Backend returns token to Frontend                   │
│    {                                                   │
│      token: "eyJhbGc...",                              │
│      user: { telegram_id, username, balance },         │
│      is_admin: false                                   │
│    }                                                   │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 10. Frontend saves token to localStorage               │
│     localStorage.setItem('auth_token', token)          │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 11. Frontend shows Lobby                               │
│     ┌─────────────────────────────────────────────┐    │
│     │  🎮 Gaming Bot    💰 0.00 pts              │    │
│     │  @john_doe                                  │    │
│     ├─────────────────────────────────────────────┤    │
│     │  Choose a Game                              │    │
│     │                                              │    │
│     │  🎯 Plinko                                  │    │
│     │  🎰 Slots                                   │    │
│     │  🎡 Wheel                                   │    │
│     │  🃏 Find Joker                              │    │
│     │  ⛏️ Mines                                   │    │
│     └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

### Playing a Game

```
┌─────────────────────────────────────────────────────────┐
│ 1. User clicks "Plinko"                                │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. User sets bet: 10 points                            │
│    User clicks "Drop Ball"                             │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Frontend animates ball dropping                     │
│    Calculates: lands on slot 6 (2x multiplier)         │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Frontend sends to Backend                           │
│    POST /games/api/play/                               │
│    Authorization: Bearer eyJhbGc...                     │
│    {                                                   │
│      game_type: "plinko",                              │
│      bet_amount: 10,                                   │
│      game_data: { final_slot: 6, multiplier: 2.0 }    │
│    }                                                   │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Backend extracts token from header                  │
│    Decodes token → telegram_id: 123456789              │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Backend gets user from database                     │
│    User.objects.get(telegram_id=123456789)             │
│    Current balance: 100 points                         │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 7. Backend validates bet                               │
│    ✓ Balance (100) >= Bet (10)                         │
│    ✓ Game is enabled                                   │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 8. Backend processes game                              │
│    - Deduct bet: 100 - 10 = 90                         │
│    - Calculate win: 10 × 2.0 = 20                      │
│    - Add win: 90 + 20 = 110                            │
│    - Save game record to database                      │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 9. Backend returns result                              │
│    {                                                   │
│      result: "win",                                    │
│      multiplier: 2.0,                                  │
│      points_change: 10,                                │
│      new_balance: 110                                  │
│    }                                                   │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 10. Frontend shows result                              │
│     ┌─────────────────────────────────────────────┐    │
│     │         2x                                  │    │
│     │      +10.00 pts                             │    │
│     └─────────────────────────────────────────────┘    │
│                                                        │
│     Header updates: 💰 110.00 pts                      │
└─────────────────────────────────────────────────────────┘
```

---

### Returning User

```
┌─────────────────────────────────────────────────────────┐
│ 1. User opens app again (next day)                     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 2. Frontend checks localStorage                        │
│    Token found: "eyJhbGc..."                           │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 3. Frontend verifies token with Backend                │
│    GET /api/user/verify/                               │
│    Authorization: Bearer eyJhbGc...                     │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Backend verifies token                              │
│    ✓ Token valid                                       │
│    ✓ Not expired                                       │
│    ✓ User exists                                       │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Backend returns user data                           │
│    {                                                   │
│      user: { telegram_id, username, balance: 110 },    │
│      is_admin: false                                   │
│    }                                                   │
└────────────────────┬────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────┐
│ 6. Frontend shows Lobby directly                       │
│    (No signup needed!)                                 │
│    Balance: 110 pts                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Why This Is Secure

### ❌ Old Way (Insecure)
```javascript
// Frontend sends user ID
fetch('/games/api/play/', {
  body: JSON.stringify({
    telegram_id: 123456789,  // ← I can change this to anyone!
    bet_amount: 10
  })
})

// Backend trusts it
user = User.objects.get(telegram_id=request.data['telegram_id'])
# ← Using someone else's account!
```

**Problem**: Anyone can open browser DevTools and change `telegram_id` to steal from other users!

### ✅ New Way (Secure)
```javascript
// Frontend sends token
fetch('/games/api/play/', {
  headers: {
    'Authorization': 'Bearer eyJhbGc...'  // ← Cannot be forged!
  },
  body: JSON.stringify({
    bet_amount: 10  // ← No user ID!
  })
})

// Backend verifies token
payload = jwt.decode(token, SECRET_KEY)
user = User.objects.get(telegram_id=payload['telegram_id'])
# ← Using the REAL authenticated user!
```

**Why It's Secure**:
1. Token is cryptographically signed by backend
2. Cannot be forged or modified
3. Contains user identity inside (encrypted)
4. Backend extracts real user from token
5. User cannot claim to be someone else

---

## 🎯 Key Concepts

### 1. Telegram initData
- Provided by Telegram when app opens
- Contains user info + cryptographic signature
- Signature proves data came from Telegram
- Backend validates signature with bot token

### 2. JWT Token
- JSON Web Token (industry standard)
- Contains user identity (telegram_id)
- Signed by backend with SECRET_KEY
- Cannot be forged or modified
- Has expiration time (e.g., 7 days)

### 3. Token Flow
```
Signup → Backend issues token → Frontend stores token
         ↓
All requests → Frontend sends token → Backend verifies token
                                      ↓
                              Backend knows who you are
```

---

## 📋 What You Need to Do

### Frontend (Already Done ✅)
- Auth page created
- Token management implemented
- All API calls updated
- No telegram_id in requests

### Backend (You Need to Implement)
1. **Install JWT library**
   ```bash
   pip install pyjwt
   ```

2. **Create auth endpoint**
   ```python
   # POST /api/user/auth/
   def authenticate_user(request):
       initData = request.headers.get('X-Telegram-Init-Data')
       user_data = validate_telegram_init_data(initData, BOT_TOKEN)
       user = get_or_create_user(user_data)
       token = generate_jwt_token(user)
       return {'token': token, 'user': {...}}
   ```

3. **Create verify endpoint**
   ```python
   # GET /api/user/verify/
   def verify_token(request):
       token = request.headers.get('Authorization').replace('Bearer ', '')
       payload = jwt.decode(token, SECRET_KEY)
       user = User.objects.get(telegram_id=payload['telegram_id'])
       return {'user': {...}}
   ```

4. **Update game endpoints**
   ```python
   # POST /games/api/play/
   @require_authentication  # Middleware extracts user from token
   def play_game(request):
       user = request.user  # ← From token, not request body!
       # Process game...
   ```

---

## 🚀 Testing

### 1. Test Signup
- Open app in Telegram
- Click "Sign Up"
- Check: Token saved in localStorage
- Check: Redirected to Lobby

### 2. Test Game
- Play Plinko
- Check: Balance updates
- Check: Token sent in request header
- Check: Backend uses correct user

### 3. Test Return
- Close app
- Open again
- Check: No signup needed
- Check: Balance persists

---

## ❓ FAQ

**Q: What if token expires?**
A: User will be redirected to Auth page to sign up again.

**Q: Can users play without Telegram?**
A: No, app requires Telegram WebApp context for security.

**Q: What if someone steals the token?**
A: Token expires after 7 days. Use HTTPS to prevent interception.

**Q: Can I test without Telegram?**
A: Backend can provide test tokens for development (don't deploy to production).

**Q: What about admin users?**
A: Token includes is_admin flag. Backend checks this for admin endpoints.

---

## 📚 Next Steps

1. Read `SECURITY.md` for backend implementation details
2. Read `WORKFLOW.md` for complete technical flow
3. Implement backend authentication
4. Test the complete flow
5. Deploy to production

**The frontend is ready! Now update your backend to match this secure flow.**
