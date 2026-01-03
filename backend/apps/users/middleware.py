from django.http import JsonResponse
from .models import User
from .jwt_utils import verify_token


class JWTAuthenticationMiddleware:
    """Middleware to authenticate users via JWT token"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip authentication for certain paths
        skip_paths = ['/admin/', '/api/user/auth/', '/api/user/register/', '/api/user/login/']
        if any(request.path.startswith(path) for path in skip_paths):
            return self.get_response(request)
        
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
            
            # Verify token
            payload = verify_token(token)
            if payload:
                try:
                    user = User.objects.get(telegram_id=payload['telegram_id'])
                    request.user = user
                    request.is_authenticated = True
                except User.DoesNotExist:
                    request.user = None
                    request.is_authenticated = False
            else:
                request.user = None
                request.is_authenticated = False
        else:
            request.user = None
            request.is_authenticated = False
        
        return self.get_response(request)


def require_auth(view_func):
    """Decorator to require authentication"""
    def wrapper(request, *args, **kwargs):
        if not getattr(request, 'is_authenticated', False):
            return JsonResponse({'error': 'Authentication required'}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper


def require_admin(view_func):
    """Decorator to require admin privileges"""
    def wrapper(request, *args, **kwargs):
        if not getattr(request, 'is_authenticated', False):
            return JsonResponse({'error': 'Authentication required'}, status=401)
        if not request.user.is_admin:
            return JsonResponse({'error': 'Admin access required'}, status=403)
        if request.user.is_suspended:
            return JsonResponse({'error': 'Account suspended'}, status=403)
        return view_func(request, *args, **kwargs)
    return wrapper
