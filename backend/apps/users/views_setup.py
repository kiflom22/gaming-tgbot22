"""
Setup views for initial admin creation
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import User


@csrf_exempt
@require_http_methods(["POST"])
def setup_admin(request):
    """
    Create or update admin user
    This endpoint should be removed after initial setup
    """
    try:
        # Check if admin already exists
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'telegram_id': 999999999,
                'password': 'admin123',
                'first_name': 'Admin',
                'last_name': 'User',
                'is_admin': True,
                'balance': 1000000
            }
        )
        
        if not created:
            # Update existing admin
            admin.is_admin = True
            admin.password = 'admin123'
            admin.balance = 1000000
            admin.save()
            message = 'Admin user updated successfully'
        else:
            message = 'Admin user created successfully'
        
        return JsonResponse({
            'success': True,
            'message': message,
            'username': admin.username,
            'is_admin': admin.is_admin,
            'balance': float(admin.balance)
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
