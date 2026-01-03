# 🎨 System Architecture Diagrams

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         TELEGRAM                                │
│                    (Authentication Provider)                    │
│  - Provides signed initData                                     │
│  - Hosts WebApp interface                                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Opens WebApp with initData
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (SPA)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages                                                    │  │
│  │  - Auth.jsx          (Login/Signup)                      │  │
│  │  - Lobby.jsx         (Game selection)                    │  │
│  │  - Game Pages        (5 games)                           │  │
│  │  - AdminDashboard    (Admin control)                     │  │
│  │  - Transactions      (Withdrawals)                       │  │
│  │  - Statistics        (User stats)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Layer (api.js)                                      │  │
│  │  - Token management                                      │  │
│  │  - All API calls                                         │  │
│  │  - Error handling                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS + JWT Bearer Token
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                  DJANGO REST API BACKEND                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                        │  │
│  │  - CORS (django-cors-headers)                           │  │
│  │  - JWT Authentication (JWTAuthenticationMiddleware)     │  │
│  │  - Admin Authorization (@require_admin)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Application Layer (Django Apps)                        │  │
│  │                                                          │  │
│  │  apps/users/                                            │  │
│  │  - User authentication                                  │  │
│  │  - Balance management                                   │  │
│  │  - Withdrawal requests                                  │  │
│  │                                                          │  │
│  │  apps/games/                                            │  │
│  │  - Game logic                                           │  │
│  │  - Game sessions                                        │  │
│  │  - Game status control                                  │  │
│  │                                                          │  │
│  │  apps/admin_panel/                                      │  │
│  │  - User management                                      │  │
│  │  - Withdrawal approval                                  │  │
│  │  - Game control                                         │  │
│  │  - Statistics                                           │  │
│  │                                                          │  │
│  │  apps/withdrawals/                                      │  │
│  │  - Withdrawal processing                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Django ORM
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                DATABASE (SQLite/PostgreSQL)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tables                                                  │  │
│  │  - users          (User accounts & balances)            │  │
│  │  - withdrawals    (Withdrawal requests)                 │  │
│  │  - gamesessions   (Game history)                        │  │
│  │  - gamestatuses   (Game availability)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication Flow

```
┌──────────┐
│  User    │
│  Opens   │
│  Bot     │
└────┬─────┘
     │
     │ 1. Opens WebApp
     ↓
┌──────────────────────┐
│  Telegram            │
│  Generates initData  │
│  Signs with HMAC     │
└────┬─────────────────┘
     │
     │ 2. Provides signed initData
     ↓
┌──────────────────────┐
│  React Frontend      │
│  Receives initData   │
└────┬─────────────────┘
     │
     │ 3. POST /api/user/auth/
     │    Header: X-Telegram-Init-Data
     ↓
┌──────────────────────────────────────┐
│  Django Backend                      │
│  1. Extract initData from header     │
│  2. Parse query string               │
│  3. Extract hash                     │
│  4. Calculate HMAC-SHA256            │
│  5. Compare hashes                   │
│  6. If valid:                        │
│     - Get/Create user                │
│     - Generate JWT token             │
│     - Return token + user data       │
└────┬─────────────────────────────────┘
     │
     │ 4. Returns: { token, user, is_admin }
     ↓
┌──────────────────────┐
│  React Frontend      │
│  1. Store token      │
│  2. Store user data  │
│  3. Redirect to lobby│
└──────────────────────┘
```

---

## 3. Game Play Flow

```
┌──────────┐
│  User    │
│  Plays   │
│  Game    │
└────┬─────┘
     │
     │ 1. Select game & bet amount
     ↓
┌──────────────────────┐
│  Game Component      │
│  1. Validate bet     │
│  2. Calculate result │
│  3. Show animation   │
└────┬─────────────────┘
     │
     │ 2. POST /games/api/play/
     │    { game_type, bet_amount, game_data }
     │    Header: Authorization: Bearer <JWT>
     ↓
┌──────────────────────────────────────┐
│  Django Backend                      │
│  1. Validate JWT token               │
│  2. Check user balance >= bet        │
│  3. Check game is enabled            │
│  4. Check user not suspended         │
│  5. Process game result:             │
│     - Calculate points_change        │
│     - Update user.balance            │
│     - Update statistics              │
│     - Create GameSession record      │
│  6. Return new balance               │
└────┬─────────────────────────────────┘
     │
     │ 3. Returns: { result, multiplier, 
     │              points_change, new_balance }
     ↓
┌──────────────────────┐
│  Game Component      │
│  1. Show result      │
│  2. Update balance   │
│  3. Enable play btn  │
└──────────────────────┘
```

---

## 4. Admin Add Points Flow

```
┌──────────┐
│  Admin   │
│  Receives│
│  Payment │
└────┬─────┘
     │
     │ 1. Verify payment received
     ↓
┌──────────────────────┐
│  Admin Dashboard     │
│  Users Tab           │
│  1. Find user        │
│  2. Click Add Points │
│  3. Select amount    │
│  4. Confirm          │
└────┬─────────────────┘
     │
     │ 2. POST /api/admin/users/<id>/add-points/
     │    { points: 1000, note: "Bank transfer" }
     │    Header: Authorization: Bearer <JWT>
     ↓
┌──────────────────────────────────────┐
│  Django Backend                      │
│  1. Validate JWT token               │
│  2. Check is_admin = true            │
│  3. Validate points > 0              │
│  4. Get user by ID                   │
│  5. user.balance += points           │
│  6. user.save()                      │
│  7. Log action                       │
│  8. Return new balance               │
└────┬─────────────────────────────────┘
     │
     │ 3. Returns: { success, new_balance }
     ↓
┌──────────────────────┐
│  Admin Dashboard     │
│  1. Show success     │
│  2. Update UI        │
│  3. Refresh list     │
└──────────────────────┘
```

---

## 5. Withdrawal Approval Flow

```
┌──────────┐
│  User    │
│  Requests│
│ Withdraw │
└────┬─────┘
     │
     │ 1. POST /api/user/withdrawal/
     │    { points: 500, payment_method, payment_details }
     ↓
┌──────────────────────────────────────┐
│  Django Backend                      │
│  1. Validate points >= 500           │
│  2. Check balance >= points          │
│  3. Deduct points immediately        │
│  4. Create Withdrawal (status=pending)│
│  5. Return success                   │
└────┬─────────────────────────────────┘
     │
     │ 2. Withdrawal created (PENDING)
     ↓
┌──────────┐
│  Admin   │
│  Reviews │
└────┬─────┘
     │
     │ 3. POST /api/admin/withdrawals/<id>/approve/
     ↓
┌──────────────────────────────────────┐
│  Django Backend                      │
│  1. Update status = 'approved'       │
│  2. Return success                   │
└────┬─────────────────────────────────┘
     │
     │ 4. Status: APPROVED
     ↓
┌──────────┐
│  Admin   │
│  Processes│
│  Payment │
└────┬─────┘
     │
     │ 5. POST /api/admin/withdrawals/<id>/paid/
     ↓
┌──────────────────────────────────────┐
│  Django Backend                      │
│  1. Update status = 'paid'           │
│  2. Return success                   │
└────┬─────────────────────────────────┘
     │
     │ 6. Status: PAID (Complete!)
     ↓
┌──────────┐
│  User    │
│  Receives│
│  Money   │
└──────────┘
```

---

## 6. Database Schema

```
┌─────────────────────────────────────────┐
│  users                                  │
├─────────────────────────────────────────┤
│  id (PK)                                │
│  telegram_id (UNIQUE, INDEXED)          │
│  username                               │
│  first_name                             │
│  last_name                              │
│  password                               │
│  balance (DECIMAL)                      │
│  is_admin (BOOLEAN)                     │
│  is_suspended (BOOLEAN)                 │
│  games_played (INTEGER)                 │
│  total_wagered (DECIMAL)                │
│  total_won (DECIMAL)                    │
│  total_lost (DECIMAL)                   │
│  created_at (DATETIME)                  │
│  last_login (DATETIME)                  │
└────────┬────────────────────────────────┘
         │
         │ 1:N
         ↓
┌─────────────────────────────────────────┐
│  withdrawals                            │
├─────────────────────────────────────────┤
│  id (PK)                                │
│  user_id (FK → users)                   │
│  points (DECIMAL)                       │
│  amount (DECIMAL)                       │
│  payment_method (VARCHAR)               │
│  payment_details (TEXT)                 │
│  status (VARCHAR)                       │
│    - pending                            │
│    - approved                           │
│    - paid                               │
│    - rejected                           │
│  rejection_reason (TEXT)                │
│  created_at (DATETIME)                  │
│  updated_at (DATETIME)                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  gamesessions                           │
├─────────────────────────────────────────┤
│  id (PK)                                │
│  user_id (FK → users)                   │
│  game_type (VARCHAR)                    │
│    - crash, limbo, slots, cards, mining │
│  bet_amount (DECIMAL)                   │
│  result (VARCHAR)                       │
│    - win, loss                          │
│  multiplier (DECIMAL)                   │
│  points_change (DECIMAL)                │
│  game_data (JSON)                       │
│  created_at (DATETIME, INDEXED)         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  gamestatuses                           │
├─────────────────────────────────────────┤
│  id (PK)                                │
│  game_type (VARCHAR, UNIQUE)            │
│  name (VARCHAR)                         │
│  icon (VARCHAR)                         │
│  is_enabled (BOOLEAN)                   │
│  maintenance_message (TEXT)             │
│  updated_at (DATETIME)                  │
└─────────────────────────────────────────┘
```

---

## 7. Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Telegram Signature Validation                │
│  - Validates initData with HMAC-SHA256                  │
│  - Uses bot token as secret                             │
│  - Prevents data tampering                              │
│  - Cannot be forged                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 2: JWT Token Authentication                      │
│  - Token signed with JWT_SECRET                         │
│  - 7-day expiration                                     │
│  - Included in all API requests                         │
│  - Validated by middleware                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Admin Authorization                           │
│  - Checks is_admin flag                                 │
│  - Returns 403 for non-admin                            │
│  - Checks suspension status                             │
│  - Decorator-based (@require_admin)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Server-Side Validation                        │
│  - Balance checks                                       │
│  - Game logic validation                                │
│  - Bet amount validation                                │
│  - Withdrawal validation                                │
│  - Client cannot manipulate                             │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Admin Dashboard Structure

```
┌─────────────────────────────────────────────────────────┐
│  Admin Dashboard                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Tab Navigation                                 │   │
│  │  [Users] [Deposits] [Withdrawals] [Games]      │   │
│  │  [Control] [Statistics]                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Users Tab                                      │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │  Search & Filter                          │ │   │
│  │  │  - Search by username/ID                  │ │   │
│  │  │  - Filter by status (active/suspended)    │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │  User List                                │ │   │
│  │  │  ┌─────────────────────────────────────┐ │ │   │
│  │  │  │  @username                          │ │ │   │
│  │  │  │  Balance: 1000 pts                  │ │ │   │
│  │  │  │  [Add Points] [Suspend]             │ │ │   │
│  │  │  └─────────────────────────────────────┘ │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Withdrawals Tab                                │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │  Withdrawal Request                       │ │   │
│  │  │  @username - 500 pts                      │ │   │
│  │  │  Method: Bank Transfer                    │ │   │
│  │  │  Details: Account 123...                  │ │   │
│  │  │  Status: PENDING                          │ │   │
│  │  │  [Approve] [Reject]                       │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Game Control Tab                               │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │  🎰 Slots                                 │ │   │
│  │  │  Status: ENABLED                          │ │   │
│  │  │  [Disable]                                │ │   │
│  │  │  Maintenance Message:                     │ │   │
│  │  │  [Edit message...]                        │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Statistics Tab                                 │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │  💰 Total Points Added: 10,000            │ │   │
│  │  │  💸 Total Paid Withdrawals: 5,000         │ │   │
│  │  │  📊 Net Balance: 5,000                    │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

**For detailed analysis, see:** `DEEP_ANALYSIS_REPORT.md`  
**For quick summary, see:** `ANALYSIS_SUMMARY.md`
