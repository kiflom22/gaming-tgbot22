# Security Implementation Guide

## Overview
This frontend now implements **secure token-based authentication** using Telegram's cryptographically signed `initData`. Users must sign up before accessing games, and all API requests are authenticated with JWT tokens.

## Authentication Flow

### 1. User Registration/Login
```
User opens app → Telegram provides initData → Frontend sends to backend → Backend validates signature → Issues JWT token → User authenticated
```

### 2. Secure initData
- `window.Telegram.WebApp.initData` contains cryptographically signed user data
- Backend MUST validate this signature using the bot token
- Cannot be forged or manipulated by users

### 3. Token Storage
- JWT token stored in `localStorage` as `auth_token`
- Token included in all API requests via `Authorization: Bearer <token>` header
- Token persists across page refreshes

## Key Security Features

### ✅ What's Fixed
1. **No more telegram_id in request body** - Users can't impersonate others
2. **Secure authentication** - Uses Telegram's cryptographic signatures
3. **Token-based API calls** - All requests authenticated with JWT
4. **Session persistence** - Token verification on app load
5. **Mandatory signup** - Users must authenticate before accessing games

### ❌ What Was Wrong Before
```javascript
// OLD (INSECURE) - Anyone could change telegram_id
fetch('/games/api/play/', {
  body: JSON.stringify({
    telegram_id: 999999,  // ← Easily manipulated!
    bet_amount: 10
  })
})
```

```javascript
// NEW (SECURE) - Token identifies user
fetch('/games/api/play/', {
  headers: {
    'Authorization': 'Bearer eyJhbGc...'  // ← Cryptographically secure
  },
  body: JSON.stringify({
    bet_amount: 10  // ← No user ID needed
  })
})
```

## Backend Requirements

### 1. Validate Telegram initData
```python
import hmac
import hashlib
from urllib.parse import parse_qsl

def validate_telegram_init_data(init_data: str, bot_token: str) -> dict:
    """
    Validates Telegram WebApp initData signature
    Returns user data if valid, raises exception if invalid
    """
    try:
        parsed_data = dict(parse_qsl(init_data))
        hash_value = parsed_data.pop('hash', None)
        
        if not hash_value:
            raise ValueError('No hash in initData')
        
        # Create data check string
        data_check_arr = [f"{k}={v}" for k, v in sorted(parsed_data.items())]
        data_check_string = '\n'.join(data_check_arr)
        
        # Calculate secret key
        secret_key = hmac.new(
            b"WebAppData",
            bot_token.encode(),
            hashlib.sha256
        ).digest()
        
        # Calculate hash
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Verify hash
        if calculated_hash != hash_value:
            raise ValueError('Invalid hash')
        
        # Parse user data
        import json
        user_data = json.loads(parsed_data.get('user', '{}'))
        
        return user_data
        
    except Exception as e:
        raise ValueError(f'Invalid initData: {str(e)}')
```

### 2. Authentication Endpoint
```python
# POST /api/user/auth/
# Header: X-Telegram-Init-Data: <initData>

def authenticate_user(request):
    init_data = request.headers.get('X-Telegram-Init-Data')
    
    # Validate signature
    user_data = validate_telegram_init_data(init_data, settings.BOT_TOKEN)
    
    # Get or create user
    user, created = User.objects.get_or_create(
        telegram_id=user_data['id'],
        defaults={
            'username': user_data.get('username'),
            'first_name': user_data.get('first_name'),
            'last_name': user_data.get('last_name'),
        }
    )
    
    # Generate JWT token
    token = generate_jwt_token(user)
    
    return {
        'token': token,
        'user': {
            'telegram_id': user.telegram_id,
            'username': user.username,
            'first_name': user.first_name,
            'balance': user.balance
        },
        'is_admin': user.is_admin
    }
```

### 3. Token Verification Endpoint
```python
# GET /api/user/verify/
# Header: Authorization: Bearer <token>

def verify_token(request):
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    try:
        # Decode and verify JWT
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user = User.objects.get(telegram_id=payload['telegram_id'])
        
        return {
            'user': {
                'telegram_id': user.telegram_id,
                'username': user.username,
                'first_name': user.first_name,
                'balance': user.balance
            },
            'is_admin': user.is_admin
        }
    except:
        return {'error': 'Invalid token'}
```

### 4. Protected Game Endpoint
```python
# POST /games/api/play/
# Header: Authorization: Bearer <token>

@require_authentication
def play_game(request):
    # User is extracted from token by middleware
    user = request.user
    
    data = json.loads(request.body)
    game_type = data['game_type']
    bet_amount = data['bet_amount']
    
    # Process game...
    # User is already authenticated, no need to trust client data
    
    return {
        'result': 'win',
        'new_balance': user.balance,
        'points_change': 15
    }
```

## API Changes Summary

### Before (Insecure)
- `POST /api/user/auth/` - Body: `{telegram_id, username, ...}`
- `POST /games/api/play/` - Body: `{telegram_id, game_type, bet_amount}`
- `GET /api/user/{telegram_id}/balance/`

### After (Secure)
- `POST /api/user/auth/` - Header: `X-Telegram-Init-Data: <signed_data>`
- `POST /games/api/play/` - Header: `Authorization: Bearer <token>`, Body: `{game_type, bet_amount}`
- `GET /api/user/balance/` - Header: `Authorization: Bearer <token>`

## Testing

### Development Mode
For local testing without Telegram:
1. Backend should provide a test endpoint that issues tokens without initData validation
2. Or use Telegram's test environment
3. Never deploy test endpoints to production

### Production
- App MUST be opened through Telegram WebApp
- `window.Telegram.WebApp.initData` will be available
- Backend MUST validate signatures

## Security Checklist

- [ ] Backend validates Telegram initData signatures
- [ ] JWT tokens have expiration times
- [ ] Tokens are stored securely (httpOnly cookies or localStorage)
- [ ] All game endpoints require authentication
- [ ] User identity extracted from token, not request body
- [ ] Rate limiting on authentication endpoints
- [ ] HTTPS enforced in production
- [ ] Bot token kept secret and never exposed to frontend

## Additional Recommendations

1. **Token Expiration**: Set JWT expiration (e.g., 7 days)
2. **Refresh Tokens**: Implement refresh token mechanism
3. **Rate Limiting**: Limit authentication attempts
4. **Audit Logging**: Log all authentication attempts
5. **CORS**: Configure proper CORS headers
6. **HTTPS Only**: Enforce HTTPS in production
7. **Token Revocation**: Implement token blacklist for logout

## Files Modified

### Frontend
- `src/api.js` - Token-based API calls
- `src/App.jsx` - Authentication flow
- `src/pages/Auth.jsx` - New signup/login page
- All game pages - Removed telegram_id prop

### Backend (Required Changes)
- Authentication endpoint with initData validation
- JWT token generation and verification
- Middleware to extract user from token
- All game endpoints to use authenticated user
