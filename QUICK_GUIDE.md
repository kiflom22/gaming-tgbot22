# 🎮 Quick Guide - Gaming System

## ✅ Your System is Ready!

Everything is already working as you requested:
- **1 Birr = 1 Point** ✅
- **Admin adds points** ✅
- **User plays with points** ✅
- **Win = Points increase** ✅
- **Lose = Points decrease** ✅

## 🚀 Quick Test (5 Minutes)

### Step 1: Login as Admin
```
URL: http://localhost:3001
Username: admin
Password: admin123
```

### Step 2: Create Test User
1. Logout (if logged in)
2. Click "Register"
3. Create user: `testuser` / `0912345678` / `password123`
4. You'll get 1000 bonus points

### Step 3: Add Points as Admin
1. Logout from testuser
2. Login as `admin` / `admin123`
3. Go to "Admin Panel"
4. Click "Users" tab
5. Find "testuser"
6. Click "Add Points"
7. Enter: 500
8. Click "Confirm Add"
9. ✅ User now has 1500 points (1000 bonus + 500 added)

### Step 4: Play Games as User
1. Logout from admin
2. Login as `testuser` / `password123`
3. Go to Lobby
4. Click any game (e.g., Plinko)
5. Bet 10 points
6. Play!
7. Watch balance change:
   - **Win:** Balance increases ✅
   - **Lose:** Balance decreases ❌

### Step 5: Test Withdrawal
1. As testuser, go to "Withdraw"
2. Enter 500 points
3. Enter payment details
4. Click "Request Withdrawal"
5. Balance decreases by 500

6. Logout, login as admin
7. Go to Admin Panel → Withdrawals
8. See pending withdrawal
9. Click "Approve"
10. Click "Mark as Paid"
11. ✅ Done!

## 💰 Payment Flow

### User Pays 500 Birr
```
User → Bank/Mobile Money → Admin
         (500 Birr)
```

### Admin Adds Points
```
Admin Panel → Users → Find User → Add Points → 500
```

### User Gets Points
```
User Balance: +500 points (= 500 Birr)
```

### User Plays
```
Bet 10 points → Win/Lose → Balance updates
```

## 🎯 Real Example

**Scenario:** User pays 1000 Birr

1. **User sends money:**
   - Bank transfer: 1000 Birr
   - Admin receives it

2. **Admin adds points:**
   - Admin Panel → Users → testuser
   - Add Points: 1000
   - User balance: 1000 points

3. **User plays Plinko:**
   - Bet: 50 points
   - Result: WIN (3x multiplier)
   - Win: 150 points
   - New balance: 1000 - 50 + 150 = 1100 points ✅

4. **User plays Slots:**
   - Bet: 30 points
   - Result: LOSE
   - Lose: 30 points
   - New balance: 1100 - 30 = 1070 points ❌

5. **User withdraws:**
   - Request: 500 points
   - Balance: 1070 - 500 = 570 points
   - Admin approves
   - Admin sends 500 Birr to user
   - Complete! ✅

## 📊 Point System

| Birr | Points |
|------|--------|
| 1    | 1      |
| 10   | 10     |
| 50   | 50     |
| 100  | 100    |
| 500  | 500    |
| 1000 | 1000   |
| 5000 | 5000   |

## 🎮 Games Available

1. **🎯 Plinko** - Drop ball, win multipliers
2. **🎰 Slots** - Spin reels, match symbols
3. **🎡 Wheel** - Spin wheel, land on prize
4. **🃏 Find Joker** - Track the card
5. **⛏️ Mines** - Reveal gems, avoid mines

## 🛡️ Admin Features

### Add Points
- Quick amounts: 50, 100, 200, 500, 1000, 2000, 5000
- Custom amount option
- Instant update

### Manage Users
- View all users
- See balances
- Suspend/activate
- Track activity

### Handle Withdrawals
- Approve requests
- Reject (auto refund)
- Mark as paid
- Track status

### Control Games
- Enable/disable
- Edit messages
- Maintenance mode

## ✅ Everything Works!

Your system is **100% functional**:
- ✅ Payment system (1 Birr = 1 Point)
- ✅ Admin adds points
- ✅ Users play games
- ✅ Points increase on win
- ✅ Points decrease on loss
- ✅ Withdrawal system
- ✅ Admin controls

**Just login and start using it! 🎉**

---

**Admin Login:**
```
http://localhost:3001
admin / admin123
```

**Test User:**
```
testuser / password123
```

**Happy Gaming! 🎮**
