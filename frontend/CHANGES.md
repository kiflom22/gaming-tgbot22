# Security Update - Authentication & Authorization

## What Changed

### 🔒 Security Fix: Mandatory User Authentication

**Problem**: Users could manipulate `telegram_id` in API requests to impersonate others, steal money, and access other accounts.

**Solution**: Implemented secure token-based authentication with mandatory signup before accessing games.

## New User Flow

1. **User opens app** → Shows authentication page
2. **User clicks "Sign Up"** → Sends Telegram's signed initData to backend
3. **Backend validates** → Verifies cryptographic signature
4. **Token issued** → JWT token stored in localStorage
5. **User authenticated** → Can now access games
6. **All API calls** → Include token in Authorization header

## Key Changes

### 1. New Authentication Page (`src/pages/Auth.jsx`)
- Beautiful welcome screen with user info
- Shows Telegram user details
- One-click signup button
- Feature highlights
- Requires Telegram WebApp context

### 2. Secure API Layer (`src/api.js`)
```javascript
// Token management
- setAuthToken(token)
- getAuthToken()
- clearAuth()

// Secure authentication
- authenticateUser(initData) // Uses Telegram's signed data
- verifyToken() // Validates existing token

// All API calls now use token
- playGame(gameType, betAmount, gameData)
- getUserBalance()
- getUserStats()
- requestWithdrawal(points, method, details)
```

### 3. Updated App Flow (`src/App.jsx`)
- Checks for existing token on load
- Verifies token with backend
- Shows Auth page if not authenticated
- Shows games only after authentication
- Improved header with username display

### 4. All Game Pages Updated
**Removed**: `telegramId` prop (insecure)
**Now**: Uses token from API layer automatically

- `Plinko.jsx`
- `Mining.jsx`
- `Slots.jsx`
- `Wheel.jsx`
- `Cards.jsx`
- `Transactions.jsx`
- `Statistics.jsx`
- `AdminDashboard.jsx`

## API Request Changes

### Before (INSECURE ❌)
```javascript
// User could change telegram_id to anyone!
fetch('/games/api/play/', {
  body: JSON.stringify({
    telegram_id: 12345,  // ← Easily manipulated
    game_type: 'plinko',
    bet_amount: 10
  })
})
```

### After (SECURE ✅)
```javascript
// Token identifies user cryptographically
fetch('/games/api/play/', {
  headers: {
    'Authorization': 'Bearer eyJhbGc...'  // ← Cannot be forged
  },
  body: JSON.stringify({
    game_type: 'plinko',
    bet_amount: 10
  })
})
```

## Backend Requirements

The backend MUST be updated to:

1. **Validate Telegram initData signature** in `/api/user/auth/`
2. **Issue JWT tokens** after successful validation
3. **Verify tokens** in all protected endpoints
4. **Extract user from token** instead of trusting request body
5. **Remove telegram_id from request bodies**

See `SECURITY.md` for complete backend implementation guide.

## Benefits

✅ **Security**: Users cannot impersonate others
✅ **Authentication**: Mandatory signup before playing
✅ **Authorization**: Token-based access control
✅ **Session Management**: Persistent login across refreshes
✅ **User Experience**: Smooth onboarding flow
✅ **Scalability**: Standard JWT pattern

## Migration Notes

### For Users
- Existing users will need to sign up again (one-time)
- Token persists in localStorage
- No need to login repeatedly

### For Developers
- Update backend to validate initData
- Implement JWT token generation
- Add authentication middleware
- Update all endpoints to use token-based auth

## Testing

### Development
The app requires Telegram WebApp context. For testing:
1. Use Telegram's test environment
2. Or create a test bot and open via Telegram
3. Backend can provide test tokens for development

### Production
- App must be opened through Telegram
- `window.Telegram.WebApp.initData` will be available
- Backend validates signatures with bot token

## Files Added
- `src/pages/Auth.jsx` - Authentication page
- `SECURITY.md` - Security implementation guide
- `CHANGES.md` - This file

## Files Modified
- `src/api.js` - Token-based API calls
- `src/App.jsx` - Authentication flow
- `src/pages/Plinko.jsx` - Removed telegram_id
- `src/pages/Mining.jsx` - Removed telegram_id
- `src/pages/Slots.jsx` - Removed telegram_id
- `src/pages/Wheel.jsx` - Removed telegram_id
- `src/pages/Cards.jsx` - Removed telegram_id
- `src/pages/Transactions.jsx` - Removed telegram_id
- `src/pages/Statistics.jsx` - Removed telegram_id
- `src/pages/AdminDashboard.jsx` - Removed telegram_id

## Next Steps

1. **Update Backend** - Implement token-based authentication (see SECURITY.md)
2. **Test Flow** - Verify signup and game playing works
3. **Deploy** - Deploy both frontend and backend together
4. **Monitor** - Watch for authentication errors

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify backend is updated
3. Clear localStorage and try again
4. Ensure app is opened via Telegram
