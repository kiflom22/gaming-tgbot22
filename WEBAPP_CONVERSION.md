# Web App Conversion - No Telegram Bot

## What Changed

Converted from Telegram Bot integration to standalone web application with email/password authentication.

## Changes Made

### Backend

1. **Updated User Model** (`backend/models/User.js`)
   - Removed: `telegram_id` field
   - Added: `username`, `email`, `password` fields
   - Username and email are now unique and required
   - Password is hashed with bcrypt

2. **Updated Auth Routes** (`backend/routes/auth.js`)
   - Removed: Telegram initData validation
   - Added: `POST /api/user/register/` - Register with email/password
   - Added: `POST /api/user/login/` - Login with email/username and password
   - Password hashing with bcryptjs
   - Starting bonus: 1000 points on registration

3. **Updated Withdrawal Model** (`backend/models/Withdrawal.js`)
   - Removed: `telegram_id` field
   - Uses only `user_id` reference

4. **Updated Admin Routes** (`backend/routes/admin.js`)
   - Returns email instead of telegram_id
   - Excludes password from responses

5. **Updated Admin Script** (`backend/scripts/makeAdmin.js`)
   - Now accepts email or username instead of telegram_id
   - Usage: `node makeAdmin.js user@example.com`

6. **Installed bcryptjs**
   - For secure password hashing

### Frontend

1. **New Auth Page** (`frontend/src/pages/Auth.jsx`)
   - Login/Register toggle
   - Email/password authentication
   - Form validation
   - 1000 points registration bonus message
   - Clean, modern UI with light theme

2. **Updated App.jsx**
   - Proper authentication flow
   - Checks localStorage for existing session
   - Logout functionality
   - Protected routes
   - Shows Auth page if not logged in

3. **Updated Admin Dashboard**
   - Shows email instead of telegram_id
   - Mock data updated with emails

## How to Use

### 1. Start Backend
```bash
cd backend
npm start
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Register a New Account
1. Open http://localhost:3001
2. Click "Register" tab
3. Fill in:
   - Username (min 3 characters)
   - Email
   - First Name
   - Last Name (optional)
   - Password (min 6 characters)
   - Confirm Password
4. Click "Create Account"
5. You'll get 1000 points bonus!

### 4. Login
1. Enter your email or username
2. Enter your password
3. Click "Login"

### 5. Make User Admin
```bash
cd backend
node scripts/makeAdmin.js user@example.com
# or
node scripts/makeAdmin.js username
```

## Features

✅ **Email/Password Authentication**
- Secure password hashing with bcrypt
- Login with email or username
- Session persistence with JWT tokens

✅ **Registration Bonus**
- New users get 1000 points automatically

✅ **User Management**
- Unique usernames and emails
- Account suspension support
- Admin privileges

✅ **Security**
- Passwords are hashed (never stored in plain text)
- JWT token authentication
- Protected API endpoints
- Suspended users cannot login

## API Endpoints

### Authentication
- `POST /api/user/register/` - Register new user
- `POST /api/user/login/` - Login user
- `GET /api/user/verify/` - Verify JWT token

### User
- `GET /api/user/balance/` - Get balance
- `GET /api/user/stats/` - Get statistics
- `POST /api/user/withdrawal/` - Request withdrawal
- `GET /api/user/withdrawals/` - Get withdrawal history

### Admin
- `GET /api/admin/users/` - Get all users
- `POST /api/admin/users/:id/add-points/` - Add points
- `POST /api/admin/users/:id/suspend/` - Suspend/activate user
- `GET /api/admin/withdrawals/` - Get all withdrawals
- `POST /api/admin/withdrawals/:id/approve/` - Approve withdrawal
- `POST /api/admin/withdrawals/:id/reject/` - Reject withdrawal
- `POST /api/admin/withdrawals/:id/paid/` - Mark as paid

### Games
- `GET /games/api/status/` - Get game statuses
- `POST /games/api/play/` - Play a game
- `GET /games/api/history/` - Get game history

## Database Schema

### User
```javascript
{
  username: String (unique, required, min 3 chars)
  email: String (unique, required)
  password: String (hashed, required, min 6 chars)
  first_name: String (required)
  last_name: String (optional)
  balance: Number (default: 1000)
  is_admin: Boolean (default: false)
  is_suspended: Boolean (default: false)
  total_wagered: Number
  total_won: Number
  total_lost: Number
  games_played: Number
  created_at: Date
  last_login: Date
}
```

### Withdrawal
```javascript
{
  user_id: ObjectId (ref: User)
  points: Number (min: 500)
  amount: Number
  payment_method: String (bank/mobile/crypto/other)
  payment_details: String
  status: String (pending/approved/paid/rejected)
  processed_at: Date
  processed_by: ObjectId (ref: User)
  paid_at: Date
  rejection_reason: String
  created_at: Date
  updated_at: Date
}
```

## Testing

### Create Test Account
1. Register with:
   - Username: testuser
   - Email: test@example.com
   - Password: test123
   - First Name: Test
   - Last Name: User

2. Make admin:
```bash
node scripts/makeAdmin.js test@example.com
```

3. Login and test all features!

## Migration from Telegram Bot

If you have existing Telegram bot data:

1. **Backup your database** first!

2. **Create migration script** to:
   - Add email field to existing users
   - Generate temporary passwords
   - Send password reset emails

3. **Or start fresh**:
   - Drop the users collection
   - Let users register new accounts

## Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire (configure in JWT_SECRET)
- Admin endpoints require authentication + admin flag
- Suspended users cannot login
- Email validation on registration
- Password minimum length: 6 characters
- Username minimum length: 3 characters

## Next Steps

1. ✅ Test registration and login
2. ✅ Test all games
3. ✅ Test withdrawal flow
4. ✅ Test admin panel
5. 🔲 Add password reset functionality
6. 🔲 Add email verification
7. 🔲 Add profile editing
8. 🔲 Deploy to production

## Removed Features

- ❌ Telegram Bot integration
- ❌ Telegram WebApp API
- ❌ Telegram initData validation
- ❌ telegram_id field

## New Features

- ✅ Email/Password authentication
- ✅ Registration with bonus points
- ✅ Login with email or username
- ✅ Logout functionality
- ✅ Session persistence
- ✅ Password hashing
- ✅ Standalone web app (no Telegram required)

## Environment Variables

Make sure your `.env` has:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=8000
FRONTEND_URL=http://localhost:3001
NODE_ENV=development
```

You can remove:
- `BOT_TOKEN` (no longer needed)

## Support

The app is now a standalone web application that works in any browser without Telegram!
