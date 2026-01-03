# Complete Workflow Guide

## 🎯 How It Works - Step by Step

### 1️⃣ User Opens the App (First Time)

```
User clicks bot link in Telegram
         ↓
Telegram opens WebApp
         ↓
Frontend loads (App.jsx)
         ↓
Checks localStorage for token
         ↓
No token found
         ↓
Shows Auth.jsx (Signup Page)
```

**What User Sees:**
- Welcome screen with their Telegram profile
- "Sign Up & Start Playing" button
- Game features list

---

### 2️⃣ User Signs Up

```
User clicks "Sign Up" button
         ↓
Frontend gets window.Telegram.WebApp.initData
         ↓
Sends to: POST /api/user/auth/
Header: X-Telegram-Init-Data: query_id=xxx&user={"id":123...}&hash=abc123
         ↓
Backend receives request
```

**Backend Process:**
```python
1. Extract initData from header
2. Parse the data (query_id, user, auth_date, hash)
3. Verify hash signature using bot token
   - Create secret key: HMAC-SHA256("WebAppData", bot_token)
   - Calculate hash of data
   - Compare with provided hash
4. If valid:
   - Extract user info (id, username, first_name)
   - Get or create User in database
   - Generate JWT token with user.telegram_id
   - Return: {token, user, is_admin}
5. If invalid:
   - Return: {error: "Invalid signature"}
```

**Frontend Receives:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "telegram_id": 123456789,
    "username": "john_doe",
    "first_name": "John",
    "balance": 0
  },
  "is_admin": false
}
```

**Frontend Does:**
```javascript
1. Save token to localStorage
2. Save user data to state
3. Show success toast
4. Redirect to Lobby
```

---

### 3️⃣ User Plays a Game (e.g., Plinko)

```
User clicks "Plinko" in Lobby
         ↓
Navigates to /plinko
         ↓
User sets bet amount: 10 points
         ↓
User clicks "Drop Ball"
         ↓
Frontend calculates game result
         ↓
Sends to: POST /games/api/play/
Headers: {
  Authorization: "Bearer eyJhbGc...",
  Content-Type: "application/json"
}
Body: {
  game_type: "plinko",
  bet_amount: 10,
  game_data: {
    final_slot: 6,
    multiplier: 2.0,
    won: true
  }
}
```

**Backend Process:**
```python
1. Extract token from Authorization header
2. Verify JWT token
   - Decode using SECRET_KEY
   - Check expiration
   - Extract telegram_id from payload
3. Get User from database using telegram_id
4. Validate bet:
   - Check user.balance >= bet_amount
   - Check game is enabled
5. Process game:
   - Deduct bet_amount from balance
   - Calculate win/loss
   - Update balance
   - Save GameSession record
6. Return result
```

**Backend Returns:**
```json
{
  "result": "win",
  "multiplier": 2.0,
  "points_change": 10,
  "new_balance": 110
}
```

**Frontend Updates:**
```javascript
1. Show animation (ball dropping)
2. Display result (Win! +10 pts)
3. Update balance in header (110 pts)
```

---

### 4️⃣ User Returns Later (Token Still Valid)

```
User opens app again
         ↓
Frontend loads (App.jsx)
         ↓
Checks localStorage for token
         ↓
Token found: "eyJhbGc..."
         ↓
Sends to: GET /api/user/verify/
Header: Authorization: "Bearer eyJhbGc..."
         ↓
Backend verifies token
         ↓
Returns user data
         ↓
Frontend shows Lobby directly (no signup needed)
```

---

### 5️⃣ User Requests Withdrawal

```
User navigates to /transactions
         ↓
Enters withdrawal amount: 500 points
         ↓
Selects payment method: Bank Transfer
         ↓
Enters payment details
         ↓
Clicks "Request Withdrawal"
         ↓
Sends to: POST /api/user/withdrawal/
Headers: {
  Authorization: "Bearer eyJhbGc..."
}
Body: {
  points: 500,
  payment_method: "bank",
  payment_details: "Account: 123456789"
}
```

**Backend Process:**
```python
1. Verify token → Get user
2. Check user.balance >= 500
3. Check minimum withdrawal (500 points)
4. Create Withdrawal record:
   - user = user
   - points = 500
   - status = "pending"
5. Deduct points from user.balance
6. Save to database
7. Notify admin (optional)
8. Return success
```

**Frontend Updates:**
```javascript
1. Show success toast
2. Update balance (balance - 500)
3. Reset form
```

---

### 6️⃣ Admin Manages Users

```
Admin opens /admin
         ↓
Frontend checks isAdmin flag
         ↓
If not admin: Show "Access Denied"
         ↓
If admin: Load admin dashboard
         ↓
Admin clicks "Add Points" for user
         ↓
Selects amount: 1000 points
         ↓
Sends to: POST /api/admin/add-points/
Headers: {
  Authorization: "Bearer eyJhbGc..."
}
Body: {
  user_id: 123456789,
  points: 1000
}
```

**Backend Process:**
```python
1. Verify token → Get admin user
2. Check user.is_admin == True
3. Get target user by user_id
4. Add points to target user.balance
5. Create Deposit record
6. Return success
```

---

## 🔐 Security at Each Step

### Step 1: Initial Auth
- ✅ Uses Telegram's cryptographic signature
- ✅ Cannot be forged or manipulated
- ✅ Backend validates with bot token

### Step 2: Token Storage
- ✅ JWT token stored in localStorage
- ✅ Token contains only telegram_id (no sensitive data)
- ✅ Token has expiration time

### Step 3: API Requests
- ✅ Token in Authorization header
- ✅ Backend extracts user from token
- ✅ No user_id in request body
- ✅ User cannot impersonate others

### Step 4: Game Play
- ✅ User identity from token (server-side)
- ✅ Balance checked server-side
- ✅ Game result validated server-side
- ✅ Client cannot cheat

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Telegram  │
│   WebApp    │
└──────┬──────┘
       │ initData (signed)
       ↓
┌─────────────┐
│  Frontend   │
│  (React)    │
└──────┬──────┘
       │ POST /api/user/auth/
       │ Header: X-Telegram-Init-Data
       ↓
┌─────────────┐
│   Backend   │
│  (Django)   │
└──────┬──────┘
       │ 1. Validate signature
       │ 2. Get/Create user
       │ 3. Generate JWT
       ↓
┌─────────────┐
│  Database   │
│ (PostgreSQL)│
└─────────────┘
       ↑
       │ User data
       ↓
┌─────────────┐
│   Backend   │
│  Returns:   │
│  {token}    │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Frontend   │
│  Stores:    │
│  localStorage│
└──────┬──────┘
       │
       │ All future requests
       ↓
┌─────────────┐
│   Backend   │
│  Header:    │
│  Bearer token│
└──────┬──────┘
       │ 1. Verify token
       │ 2. Extract user
       │ 3. Process request
       ↓
┌─────────────┐
│  Database   │
│  Update data│
└─────────────┘
```

---

## 🔄 Token Lifecycle

### Token Creation
```javascript
// Backend (Python)
import jwt
from datetime import datetime, timedelta

payload = {
    'telegram_id': user.telegram_id,
    'exp': datetime.utcnow() + timedelta(days=7),
    'iat': datetime.utcnow()
}
token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
```

### Token Verification
```javascript
// Backend (Python)
try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    telegram_id = payload['telegram_id']
    user = User.objects.get(telegram_id=telegram_id)
    # User authenticated
except jwt.ExpiredSignatureError:
    # Token expired
except jwt.InvalidTokenError:
    # Invalid token
```

### Token Usage
```javascript
// Frontend (JavaScript)
const token = localStorage.getItem('auth_token')

fetch('/games/api/play/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    game_type: 'plinko',
    bet_amount: 10
  })
})
```

---

## ⚠️ Error Handling

### Token Expired
```
User plays game
    ↓
Token expired
    ↓
Backend returns: 401 Unauthorized
    ↓
Frontend catches error
    ↓
Clear localStorage
    ↓
Redirect to Auth page
    ↓
User signs up again
```

### Invalid Token
```
User tampers with token
    ↓
Backend cannot verify signature
    ↓
Returns: 401 Unauthorized
    ↓
Frontend clears auth
    ↓
Shows Auth page
```

### Network Error
```
User plays game
    ↓
Network request fails
    ↓
Frontend shows error toast
    ↓
User can retry
```

---

## 🎮 Complete Game Flow Example

### Plinko Game - Full Cycle

1. **User Action**: Click "Drop Ball" with 10 point bet
2. **Frontend**: 
   - Animate ball dropping
   - Calculate path and landing slot
   - Determine multiplier (e.g., 2x)
3. **API Call**:
   ```javascript
   POST /games/api/play/
   Authorization: Bearer eyJhbGc...
   {
     game_type: "plinko",
     bet_amount: 10,
     game_data: {
       final_slot: 6,
       multiplier: 2.0,
       won: true
     }
   }
   ```
4. **Backend**:
   - Verify token → Get user (telegram_id: 123456789)
   - Check balance: 100 >= 10 ✅
   - Deduct bet: 100 - 10 = 90
   - Calculate win: 10 × 2.0 = 20
   - Add win: 90 + 20 = 110
   - Save GameSession:
     ```python
     GameSession.objects.create(
       user=user,
       game_type='plinko',
       bet_amount=10,
       result='win',
       multiplier=2.0,
       points_change=10,
       game_data={'final_slot': 6}
     )
     ```
   - Update user.balance = 110
5. **Backend Response**:
   ```json
   {
     "result": "win",
     "multiplier": 2.0,
     "points_change": 10,
     "new_balance": 110
   }
   ```
6. **Frontend**:
   - Show win animation
   - Display: "2x - +10 pts"
   - Update header balance: 110 pts
   - Enable "Drop Ball" button again

---

## 🚀 Deployment Checklist

### Frontend
- [ ] Build: `npm run build`
- [ ] Set VITE_API_URL to production backend
- [ ] Deploy to Vercel/Netlify
- [ ] Configure Telegram WebApp URL

### Backend
- [ ] Implement initData validation
- [ ] Implement JWT token generation
- [ ] Add authentication middleware
- [ ] Update all endpoints to use token
- [ ] Set SECRET_KEY and BOT_TOKEN
- [ ] Deploy to Railway/Heroku
- [ ] Enable HTTPS
- [ ] Configure CORS

### Telegram Bot
- [ ] Set WebApp URL to frontend URL
- [ ] Test bot in Telegram
- [ ] Verify initData is provided

---

## 📝 Summary

**The workflow ensures:**
1. ✅ Users must authenticate via Telegram
2. ✅ All requests are authenticated with tokens
3. ✅ User identity is verified server-side
4. ✅ No way to impersonate other users
5. ✅ Balance and game logic controlled by backend
6. ✅ Secure, scalable, and maintainable

**Key Points:**
- Frontend never sends telegram_id in requests
- Backend extracts user from validated token
- Token cannot be forged or manipulated
- All sensitive operations happen server-side
