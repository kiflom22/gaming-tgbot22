# Admin Panel Guide

## Overview
The admin panel provides complete control over the game lobby, allowing administrators to:
- **Add points** to users based on external payments received
- **Suspend/activate** user accounts
- **Approve/reject** withdrawal requests
- **Control game availability** (enable/disable games for maintenance)
- **View game history** and user statistics

## Accessing the Admin Panel

### 1. Make a User Admin
To grant admin access to a user, run this command in the backend directory:

```bash
cd backend
node scripts/makeAdmin.js <telegram_id>
```

Example:
```bash
node scripts/makeAdmin.js 12345
```

### 2. Access the Panel
Once a user is an admin, they will see the "🛡️ Admin Panel" option in the lobby under the Account section.

## Admin Panel Features

### 👥 Users Tab
Manage all registered users and add points based on external payments:

**Features:**
- View all users with their balance, telegram ID, and games played
- Add points to users when external payments are received
- Suspend/Activate user accounts
- See suspended status clearly marked

**Adding Points (External Payment Flow):**

This is the primary way users get points - when they send you money via bank transfer, mobile money, etc.

1. Customer sends payment via bank/mobile money/cash
2. Admin verifies payment received
3. Click "💰 Add Points" on the user's account
4. Choose a quick amount (50, 100, 200, 500, 1000, 2000, 5000) or select "Custom"
5. For custom amounts, enter the exact amount received (1 Birr = 1 point)
6. Click "✅ Confirm Add"
7. Points are immediately added to the user's balance
8. User can now play games with the added points

**Quick Amount Buttons:**
- 50, 100, 200, 500, 1000, 2000, 5000 points
- Custom option for any amount
- Visual confirmation shows the amount being added

**Suspending Users:**
1. Click "🚫 Suspend" to suspend an active user
2. Click "✅ Activate" to reactivate a suspended user
3. Suspended users cannot:
   - Play any games
   - Request withdrawals
   - Access game features
4. Suspended status is clearly marked with a red badge

### 💸 Withdrawals Tab
Process withdrawal requests from users:

**Withdrawal Statuses:**
- **PENDING** (Yellow) - New withdrawal request awaiting approval
- **APPROVED** (Blue) - Approved, waiting for external payment
- **PAID** (Green) - Payment completed
- **REJECTED** (Red) - Request rejected, points refunded

**Processing Withdrawals:**

1. **Approve a Withdrawal:**
   - Review the withdrawal details (points, payment method, payment details)
   - Click "✅ Approve" if valid
   - Process the external payment (bank transfer, mobile money, etc.)
   - Once payment is sent, click "💵 Mark as Paid"

2. **Reject a Withdrawal:**
   - Click "❌ Reject" if the request is invalid
   - Points are automatically refunded to the user's balance

**Important Notes:**
- Minimum withdrawal is 500 points
- 1 point = 1 Birr
- Points are deducted when user requests withdrawal
- Points are refunded if withdrawal is rejected

### 🎮 Game History Tab
View all game sessions across all users:

**Information Displayed:**
- Username and game type
- Bet amount and result (win/loss)
- Points change (+ for wins, - for losses)
- Game icon for easy identification

### 🎛️ Game Control Tab
Enable/disable games for maintenance and control game availability:

**Features:**
- Toggle individual games on/off
- Edit maintenance messages shown to users
- Visual indicators for enabled/disabled games
- Control which games are available in the lobby

**Available Games:**
- 🎯 Plinko - Drop the ball game
- 🎰 Slots - Slot machine
- 🎡 Wheel - Spin the wheel
- 🃏 Find Joker - Card tracking game
- ⛏️ Mines - Mine sweeper style game

**Disabling a Game:**
1. Click "🔧 Disable" on any game
2. The game will show as disabled with a maintenance message
3. Users cannot access or play disabled games
4. Game appears grayed out in the lobby

**Editing Maintenance Messages:**
1. Click on the maintenance message box
2. Edit the message (e.g., "Game under maintenance. Back soon!")
3. Click "💾 Save"
4. Users will see this message when trying to access the disabled game

**Use Cases:**
- Bug fixes and updates
- Balancing game mechanics
- Scheduled maintenance
- Temporary game removal

## API Endpoints

All admin endpoints require authentication and admin privileges.

### Users
- `GET /api/admin/users/` - Get all users
- `POST /api/admin/users/:userId/add-points/` - Add points to user
- `POST /api/admin/users/:userId/suspend/` - Suspend/activate user

### Withdrawals
- `GET /api/admin/withdrawals/` - Get all withdrawals
- `POST /api/admin/withdrawals/:withdrawalId/approve/` - Approve withdrawal
- `POST /api/admin/withdrawals/:withdrawalId/reject/` - Reject and refund
- `POST /api/admin/withdrawals/:withdrawalId/paid/` - Mark as paid

### Game Control
- `GET /api/admin/game-statuses/` - Get all game statuses
- `POST /api/admin/game-statuses/:gameType/toggle/` - Enable/disable game
- `POST /api/admin/game-statuses/:gameType/message/` - Update maintenance message

### Game Sessions
- `GET /api/admin/game-sessions/` - Get game history (last 100 sessions)

## Security Notes

1. **Admin Access:** Only users with `is_admin: true` in the database can access admin features
2. **Authentication:** All admin endpoints require a valid JWT token
3. **Authorization:** Non-admin users receive a 403 Forbidden error
4. **Audit Trail:** All admin actions are logged in the server console

## Workflow Examples

### External Payment Received
1. Customer sends payment via bank/mobile money
2. Admin goes to Users tab
3. Finds the user by username or telegram ID
4. Clicks "💰 Add Points"
5. Enters the amount (e.g., 1000 for 1000 Birr)
6. Clicks "✅ Confirm Add"
7. User can now play games with the added points

### Processing Withdrawal
1. User requests withdrawal from the app
2. Admin sees pending withdrawal in Withdrawals tab
3. Admin reviews payment details
4. Admin clicks "✅ Approve"
5. Admin processes external payment (bank transfer, etc.)
6. Admin clicks "💵 Mark as Paid"
7. Withdrawal is complete

### Game Maintenance
1. Admin needs to fix a bug in Plinko game
2. Admin goes to Game Control tab
3. Clicks "🔧 Disable" on Plinko
4. Edits maintenance message: "Plinko is being updated with new features. Back soon!"
5. Users see maintenance message when trying to play
6. After fix, admin clicks "✅ Enable"
7. Game is available again

## Troubleshooting

**Can't access admin panel:**
- Verify user has `is_admin: true` in database
- Check JWT token is valid
- Ensure backend is running

**Points not updating:**
- Check backend logs for errors
- Verify MongoDB connection
- Ensure user ID is correct

**Withdrawals not loading:**
- Check backend is running on port 8000
- Verify MongoDB connection
- Check browser console for errors

## Support

For issues or questions, check:
1. Backend logs: `npm start` output
2. Frontend console: Browser DevTools
3. MongoDB Atlas: Database connection status
