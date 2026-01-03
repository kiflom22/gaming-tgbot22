# Admin Panel - Quick Setup

## What Was Created

### Backend (Node.js + Express + MongoDB)
1. **Admin Routes** (`backend/routes/admin.js`)
   - User management endpoints
   - Withdrawal processing endpoints
   - Game control endpoints
   - Game session history endpoints

2. **Updated Models**
   - `User.js` - Added `is_suspended` field
   - `Withdrawal.js` - Added admin processing fields (processed_at, processed_by, paid_at, rejection_reason)

3. **Admin Script** (`backend/scripts/makeAdmin.js`)
   - Command-line tool to grant admin access to users

### Frontend (React)
1. **Admin Dashboard** (`frontend/src/pages/AdminDashboard.jsx`)
   - 5 tabs: Users, Deposits, Withdrawals, Game History, Game Control
   - Full CRUD operations for user management
   - Withdrawal approval workflow
   - Game enable/disable controls
   - Light theme styling

2. **API Functions** (`frontend/src/api.js`)
   - 10 new admin API functions
   - Full integration with backend endpoints

3. **App Integration**
   - Admin route added to App.jsx
   - Admin panel link in Lobby (visible only to admins)
   - isAdmin prop passed through components

## Quick Start

### 1. Start Backend
```bash
cd backend
npm start
```
Backend runs on http://localhost:8000

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

### 3. Make Test User Admin
```bash
cd backend
node scripts/makeAdmin.js 12345
```

### 4. Access Admin Panel
1. Open http://localhost:3000
2. Click "Start Testing" (logs in as test user)
3. In the lobby, scroll down to "Account" section
4. Click "🛡️ Admin Panel"

## Admin Panel Features

### 👥 Users Tab
- View all users
- Add points (for external payments)
- Suspend/Activate users

### 💸 Withdrawals Tab
- View all withdrawal requests
- Approve withdrawals
- Reject withdrawals (auto-refunds points)
- Mark approved withdrawals as paid

### 🎮 Game History Tab
- View last 100 game sessions
- See wins/losses across all users

### 🎛️ Game Control Tab
- Enable/disable games
- Edit maintenance messages

## Testing Workflow

### Test Adding Points
1. Go to Users tab
2. Click "💰 Add Points" on test user
3. Select 500 points
4. Click "✅ Confirm Add"
5. Check that balance updates

### Test Withdrawal Processing
1. As regular user, go to Transactions
2. Request withdrawal (500 points minimum)
3. As admin, go to Withdrawals tab
4. Click "✅ Approve" on the withdrawal
5. Click "💵 Mark as Paid"

### Test Game Control
1. Go to Game Control tab
2. Click "🔧 Disable" on any game
3. Try to play that game as regular user
4. Should see maintenance message
5. Re-enable the game

## Important Notes

- **Test Mode:** Currently using test user (telegram_id: 12345) with admin access
- **Production:** In production, use real Telegram authentication and grant admin access selectively
- **Security:** Admin endpoints check `is_admin` flag and require JWT authentication
- **Database:** All data persists in MongoDB Atlas

## File Structure
```
backend/
├── routes/
│   ├── admin.js          (NEW - Admin endpoints)
│   ├── auth.js
│   ├── games.js
│   └── withdrawals.js
├── models/
│   ├── User.js           (UPDATED - Added is_suspended)
│   └── Withdrawal.js     (UPDATED - Added admin fields)
├── scripts/
│   └── makeAdmin.js      (NEW - Admin grant script)
└── server.js             (UPDATED - Added admin routes)

frontend/
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.jsx  (UPDATED - Connected to API)
│   │   └── Lobby.jsx           (UPDATED - Added admin link)
│   ├── api.js                  (UPDATED - Added admin functions)
│   └── App.jsx                 (UPDATED - Added admin route)
└── ...

ADMIN_GUIDE.md            (NEW - Complete admin documentation)
ADMIN_SETUP.md            (NEW - This file)
```

## Next Steps

1. **Test all admin features** to ensure everything works
2. **Create more test users** to test user management
3. **Test withdrawal workflow** end-to-end
4. **Configure production** Telegram authentication
5. **Deploy** to production environment

## Troubleshooting

**Admin panel not showing:**
- Check `isAdmin` is true in App.jsx (line 13)
- Verify user has `is_admin: true` in database

**API errors:**
- Check backend is running on port 8000
- Check MongoDB connection in backend logs
- Check browser console for errors

**Can't add points:**
- Verify admin authentication
- Check backend logs for errors
- Ensure user ID is correct

## Support

See `ADMIN_GUIDE.md` for detailed documentation on all admin features and workflows.
