# 🎮 Gaming Bot Admin - Quick Reference Card

## 🚀 Quick Start

### Start Servers
```bash
# Backend (Terminal 1)
cd backend
py manage.py runserver

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### Make User Admin
```bash
cd backend
python scripts/make_admin.py <telegram_id>
```

---

## 👥 USER MANAGEMENT

### Add Points (External Payment)
```
Users Tab → Find User → Add Points → Select Amount → Confirm
```
**Quick Amounts:** 50, 100, 200, 500, 1000, 2000, 5000

### Suspend User
```
Users Tab → Find User → Suspend
```

### Activate User
```
Users Tab → Find User → Activate
```

---

## 💸 WITHDRAWAL MANAGEMENT

### Approve Withdrawal
```
Withdrawals Tab → Find Pending → Approve → Pay Externally → Mark as Paid
```

### Reject Withdrawal
```
Withdrawals Tab → Find Pending → Reject
```
*Points automatically refunded*

---

## 🎮 GAME HISTORY SEARCH (NEW!)

### Search by Username
```
Game History Tab → Type username in search box
```

### Search by Telegram ID
```
Game History Tab → Type telegram ID in search box
```

### Filter by Game Type
```
Game History Tab → Select game from dropdown
Options: Plinko, Slots, Wheel, Cards, Mining
```

### Filter by Result
```
Game History Tab → Select result from dropdown
Options: Wins Only, Losses Only
```

### Combine Filters
```
Search: "john" + Game: "Plinko" + Result: "Wins Only"
= John's winning Plinko games
```

### Date Display
- **Just now** - Less than 1 minute
- **5m ago** - Minutes ago
- **2h ago** - Hours ago
- **3d ago** - Days ago
- **Jan 15** - Older dates
- **Hover** - See full date/time

---

## 🎛️ GAME CONTROL

### Disable Game
```
Game Control Tab → Find Game → Disable
```

### Enable Game
```
Game Control Tab → Find Game → Enable
```

### Edit Maintenance Message
```
Game Control Tab → Click on message → Edit → Save
```

---

## 📊 COMMON TASKS

### Process External Payment
```
1. User sends 1000 Birr via bank/mobile money
2. Verify payment received
3. Admin Dashboard → Users Tab
4. Find user → Add Points
5. Enter 1000 → Confirm
6. ✅ User receives 1000 points
```

### Handle Withdrawal Request
```
1. User requests 500 points withdrawal
2. Points deducted automatically
3. Admin Dashboard → Withdrawals Tab
4. Review request → Approve
5. Send 500 Birr externally
6. Mark as Paid
7. ✅ Complete!
```

### Check User Activity
```
1. Admin Dashboard → Game History Tab
2. Search username
3. See all their games
4. Filter by game type if needed
5. ✅ View complete history
```

### Disable Game for Maintenance
```
1. Admin Dashboard → Game Control Tab
2. Find game → Disable
3. Edit maintenance message
4. ✅ Users see maintenance notice
```

---

## 🔍 SEARCH EXAMPLES

### Find Specific User's Games
```
Search: "alice"
Result: All of Alice's game sessions
```

### Check Plinko Activity
```
Game Type: Plinko
Result: All Plinko games from all users
```

### Find Recent Wins
```
Result: Wins Only
Result: All winning sessions
```

### Investigate User's Losses
```
Search: "bob"
Result: Losses Only
Result: All of Bob's losing sessions
```

### Check Today's Activity
```
Look for: "Just now", "5m ago", "2h ago"
Result: Recent activity
```

---

## 🎯 KEYBOARD SHORTCUTS

### Navigation
- **Tab** - Switch between tabs
- **Enter** - Confirm action
- **Esc** - Cancel action

### Search
- **Type** - Start searching immediately
- **Clear** - Remove search text to see all

---

## 📱 ACCESS POINTS

### Admin Dashboard
```
Login → Lobby → Admin Panel
```

### Direct URL
```
http://localhost:5173/admin
```

---

## 🔐 SECURITY

### Admin Access
- Only users with `is_admin=True` can access
- JWT token required
- Session-based authentication

### User Suspension
- Suspended users cannot:
  - Play games
  - Request withdrawals
  - Access features

### Point Security
- All balance changes on server
- Client cannot manipulate
- Server validates everything

---

## 💡 TIPS

### Quick Add Points
- Use quick amount buttons for speed
- Common amounts: 100, 500, 1000
- Custom for exact amounts

### Withdrawal Workflow
1. Approve first
2. Process payment externally
3. Mark as paid last

### Search Tips
- Type first few letters
- Results appear instantly
- Combine with filters for precision

### Game Control
- Disable before maintenance
- Update message to inform users
- Enable when ready

---

## 🆘 TROUBLESHOOTING

### Can't Access Admin Panel
```bash
python scripts/make_admin.py <telegram_id>
```

### Backend Not Running
```bash
cd backend
py manage.py runserver
```

### Frontend Not Running
```bash
cd frontend
npm run dev
```

### Database Issues
```bash
cd backend
python manage.py migrate
```

### Search Not Working
- Refresh page
- Check backend is running
- Clear browser cache

---

## 📊 STATUS INDICATORS

### User Status
- 🟢 **Active** - Can play games
- 🔴 **Suspended** - Blocked from actions

### Withdrawal Status
- 🟡 **Pending** - Awaiting approval
- 🔵 **Approved** - Ready for payment
- 🟢 **Paid** - Complete
- 🔴 **Rejected** - Declined (refunded)

### Game Status
- ✅ **Enabled** - Available to play
- 🔧 **Disabled** - Under maintenance

### Game Results
- ✅ **WIN** - User won
- ❌ **LOSS** - User lost

---

## 🎉 QUICK WINS

### Most Common Actions
1. **Add Points** - 80% of admin tasks
2. **Approve Withdrawals** - 15% of admin tasks
3. **Search History** - 5% of admin tasks

### Time Savers
- Use quick amount buttons
- Auto-refresh shows updates
- Search instead of scrolling
- Filter to find specific data

### Best Practices
- Verify payments before adding points
- Process withdrawals within 24 hours
- Check game history for issues
- Monitor user activity regularly

---

## 📞 SUPPORT

### Documentation
- `START_HERE.md` - Setup guide
- `ADMIN_GUIDE.md` - Full admin guide
- `GAME_HISTORY_SEARCH_ADDED.md` - Search features
- `ADMIN_FEATURES_COMPLETE.md` - All features

### API Endpoints
- `http://localhost:8000/api/admin/` - Admin API
- `http://localhost:8000/api/user/` - User API
- `http://localhost:8000/games/api/` - Game API

---

## ✅ CHECKLIST

### Daily Tasks
- [ ] Check pending withdrawals
- [ ] Review new users
- [ ] Monitor game activity
- [ ] Process payments

### Weekly Tasks
- [ ] Review user statistics
- [ ] Check game performance
- [ ] Analyze win/loss ratios
- [ ] Update maintenance schedules

### Monthly Tasks
- [ ] Generate reports
- [ ] Review security
- [ ] Update documentation
- [ ] Plan improvements

---

**🎮 Keep this card handy for quick reference!**

**Last Updated:** January 2, 2025
