from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods, require_GET
import json
from .models import User, Withdrawal
from .serializers import UserSerializer, WithdrawalSerializer
from .utils import validate_telegram_init_data
from .jwt_utils import generate_token
from .middleware import require_auth


@csrf_exempt
@require_GET
def health_check(request):
    """Health check endpoint for monitoring backend status"""
    return JsonResponse({
        'status': 'healthy',
        'service': 'Django Backend',
        'url': 'https://gaming-tgbot22-1.onrender.com',
        'message': 'Backend is running successfully!'
    })


@csrf_exempt
@require_http_methods(["POST"])
def auth_user(request):
    """Authenticate user with Telegram initData"""
    try:
        # Get initData from header
        init_data = request.headers.get('X-Telegram-Init-Data', '')
        
        if not init_data:
            return JsonResponse({'error': 'No Telegram data provided'}, status=400)
        
        # Validate Telegram data
        user_data = validate_telegram_init_data(init_data)
        
        if not user_data:
            return JsonResponse({'error': 'Invalid Telegram data'}, status=401)
        
        # Get or create user
        user, created = User.objects.get_or_create(
            telegram_id=user_data['id'],
            defaults={
                'username': user_data.get('username', ''),
                'first_name': user_data.get('first_name', ''),
                'last_name': user_data.get('last_name', ''),
            }
        )
        
        # Update user info if not created
        if not created:
            user.username = user_data.get('username', user.username)
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user.save()
        
        # Generate JWT token
        token = generate_token(user)
        
        # Serialize user data
        user_serializer = UserSerializer(user)
        
        return JsonResponse({
            'token': token,
            'user': user_serializer.data,
            'is_admin': user.is_admin
        })
        
    except Exception as e:
        print(f"Auth error: {e}")
        return JsonResponse({'error': 'Authentication failed'}, status=500)


@require_auth
@require_http_methods(["GET"])
def verify_token_view(request):
    """Verify existing JWT token"""
    user_serializer = UserSerializer(request.user)
    return JsonResponse({
        'user': user_serializer.data,
        'is_admin': request.user.is_admin
    })


@require_auth
@require_http_methods(["GET"])
def get_balance(request):
    """Get user balance"""
    return JsonResponse({'balance': float(request.user.balance)})


@require_auth
@require_http_methods(["GET"])
def get_stats(request):
    """Get user statistics"""
    return JsonResponse({
        'balance': float(request.user.balance),
        'games_played': request.user.games_played,
        'total_wagered': float(request.user.total_wagered),
        'total_won': float(request.user.total_won),
        'total_lost': float(request.user.total_lost),
    })


@csrf_exempt
@require_auth
@require_http_methods(["POST"])
def request_withdrawal(request):
    """Request a withdrawal"""
    try:
        # Check if user is suspended
        if request.user.is_suspended:
            return JsonResponse({'error': 'Account suspended. Cannot request withdrawal.'}, status=403)
        
        data = json.loads(request.body)
        
        # Convert to Decimal for proper handling
        from decimal import Decimal
        points = Decimal(str(data.get('points', 0)))
        payment_method = data.get('payment_method', '')
        payment_details = data.get('payment_details', '')
        
        print(f"[WITHDRAWAL] User: {request.user.username}, Points: {points}, Balance: {request.user.balance}")
        
        # Validate
        if points < 500:
            print(f"[WITHDRAWAL] Error: Points too low ({points})")
            return JsonResponse({'error': 'Minimum withdrawal is 500 points'}, status=400)
        
        if request.user.balance < points:
            print(f"[WITHDRAWAL] Error: Insufficient balance ({request.user.balance} < {points})")
            return JsonResponse({'error': 'Insufficient balance'}, status=400)
        
        if not payment_method or not payment_details:
            print(f"[WITHDRAWAL] Error: Missing payment details")
            return JsonResponse({'error': 'Payment details required'}, status=400)
        
        # Deduct points from balance
        request.user.balance -= points
        request.user.save()
        
        print(f"[WITHDRAWAL] Balance deducted. New balance: {request.user.balance}")
        
        # Create withdrawal request
        withdrawal = Withdrawal.objects.create(
            user=request.user,
            points=points,
            amount=points,  # 1:1 ratio
            payment_method=payment_method,
            payment_details=payment_details,
            status='pending'
        )
        
        print(f"[WITHDRAWAL] Created withdrawal ID: {withdrawal.id}")
        
        # Return simple response without serializer to test
        return JsonResponse({
            'message': 'Withdrawal request created successfully',
            'withdrawal': {
                'id': withdrawal.id,
                'points': float(withdrawal.points),
                'amount': float(withdrawal.amount),
                'payment_method': withdrawal.payment_method,
                'status': withdrawal.status,
                'created_at': withdrawal.created_at.isoformat()
            }
        })
        
    except Exception as e:
        print(f"[WITHDRAWAL] Exception: {e}")
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': f'Failed to create withdrawal: {str(e)}'}, status=500)


@require_auth
@require_http_methods(["GET"])
def get_withdrawals(request):
    """Get user's withdrawals"""
    withdrawals = Withdrawal.objects.filter(user=request.user)
    serializer = WithdrawalSerializer(withdrawals, many=True)
    return JsonResponse(serializer.data, safe=False)


@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    """Register a new user with username/password"""
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        phone = data.get('phone', '').strip()
        password = data.get('password', '')
        
        # Validate
        if not username or len(username) < 3:
            return JsonResponse({'error': 'Username must be at least 3 characters'}, status=400)
        
        if not password or len(password) < 6:
            return JsonResponse({'error': 'Password must be at least 6 characters'}, status=400)
        
        # Check if username exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        
        # Create user with fake telegram_id (using phone number hash)
        import hashlib
        telegram_id = int(hashlib.md5(username.encode()).hexdigest()[:15], 16) % (10 ** 10)
        
        # Create user
        user = User.objects.create(
            telegram_id=telegram_id,
            username=username,
            first_name=username,
            balance=0  # Start with 0 points - admin will add points
        )
        
        # Generate token
        token = generate_token(user)
        
        # Serialize user
        user_serializer = UserSerializer(user)
        
        return JsonResponse({
            'token': token,
            'user': user_serializer.data,
            'is_admin': user.is_admin,
            'message': 'Registration successful! Admin will add points when you make a payment.'
        })
        
    except Exception as e:
        print(f"Register error: {e}")
        return JsonResponse({'error': 'Registration failed'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    """Login user with username/password"""
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # Validate
        if not username or not password:
            return JsonResponse({'error': 'Username and password required'}, status=400)
        
        # Find user
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)
        
        # For now, accept any password (you can add proper password hashing later)
        # In production, you should use Django's password hashing
        
        # Check if suspended
        if user.is_suspended:
            return JsonResponse({'error': 'Account suspended'}, status=403)
        
        # Generate token
        token = generate_token(user)
        
        # Serialize user
        user_serializer = UserSerializer(user)
        
        return JsonResponse({
            'token': token,
            'user': user_serializer.data,
            'is_admin': user.is_admin
        })
        
    except Exception as e:
        print(f"Login error: {e}")
        return JsonResponse({'error': 'Login failed'}, status=500)
