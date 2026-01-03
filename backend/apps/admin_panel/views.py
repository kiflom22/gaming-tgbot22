from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from decimal import Decimal
import json
from apps.users.models import User, Withdrawal
from apps.users.serializers import UserSerializer, WithdrawalSerializer
from apps.games.models import GameSession, GameStatus
from apps.games.serializers import GameSessionSerializer, GameStatusSerializer
from apps.users.middleware import require_admin


@require_admin
@require_http_methods(["GET"])
def get_all_users(request):
    """Get all users (admin only)"""
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return JsonResponse({'users': serializer.data})


@csrf_exempt
@require_admin
@require_http_methods(["POST"])
def add_points_to_user(request, user_id):
    """Add points to a user (admin only)"""
    try:
        data = json.loads(request.body)
        points = Decimal(str(data.get('points', 0)))
        note = data.get('note', 'Admin added points')
        
        if points <= 0:
            return JsonResponse({'error': 'Invalid points amount'}, status=400)
        
        # Get user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        
        # Add points
        user.balance += points
        user.save()
        
        # Log action
        print(f"Admin {request.user.username} added {points} points to {user.username}. Note: {note}")
        
        return JsonResponse({
            'success': True,
            'new_balance': float(user.balance),
            'message': f'Added {points} points successfully'
        })
        
    except Exception as e:
        print(f"Add points error: {e}")
        return JsonResponse({'error': 'Failed to add points'}, status=500)


@csrf_exempt
@require_admin
@require_http_methods(["POST"])
def suspend_user(request, user_id):
    """Suspend or activate a user (admin only)"""
    try:
        data = json.loads(request.body)
        suspend = data.get('suspend', True)
        
        # Get user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        
        # Update suspension status
        user.is_suspended = suspend
        user.save()
        
        # Log action
        action = 'suspended' if suspend else 'activated'
        print(f"Admin {request.user.username} {action} user {user.username}")
        
        return JsonResponse({
            'success': True,
            'is_suspended': user.is_suspended,
            'message': f'User {action} successfully'
        })
        
    except Exception as e:
        print(f"Suspend user error: {e}")
        return JsonResponse({'error': 'Failed to update user status'}, status=500)


@require_admin
@require_http_methods(["GET"])
def get_all_withdrawals(request):
    """Get all withdrawal requests (admin only)"""
    withdrawals = Withdrawal.objects.all().select_related('user')
    serializer = WithdrawalSerializer(withdrawals, many=True)
    return JsonResponse({'withdrawals': serializer.data})


@csrf_exempt
@require_admin
@require_http_methods(["POST"])
def approve_withdrawal(request, withdrawal_id):
    """Approve a withdrawal request (admin only)"""
    try:
        # Get withdrawal
        try:
            withdrawal = Withdrawal.objects.get(id=withdrawal_id)
        except Withdrawal.DoesNotExist:
            return JsonResponse({'error': 'Withdrawal not found'}, status=404)
        
        if withdrawal.status != 'pending':
            return JsonResponse({'error': 'Withdrawal already processed'}, status=400)
        
        # Update status
        withdrawal.status = 'approved'
        withdrawal.save()
        
        # Log action
        print(f"Admin {request.user.username} approved withdrawal {withdrawal_id} for {withdrawal.user.username}")
        
        return JsonResponse({
            'success': True,
            'message': 'Withdrawal approved. Process external payment and mark as paid.'
        })
        
    except Exception as e:
        print(f"Approve withdrawal error: {e}")
        return JsonResponse({'error': 'Failed to approve withdrawal'}, status=500)


@csrf_exempt
@require_admin
@require_http_methods(["POST"])
def reject_withdrawal(request, withdrawal_id):
    """Reject a withdrawal request and refund points (admin only)"""
    try:
        data = json.loads(request.body)
        reason = data.get('reason', 'Rejected by admin')
        
        # Get withdrawal
        try:
            withdrawal = Withdrawal.objects.get(id=withdrawal_id)
        except Withdrawal.DoesNotExist:
            return JsonResponse({'error': 'Withdrawal not found'}, status=404)
        
        if withdrawal.status != 'pending':
            return JsonResponse({'error': 'Withdrawal already processed'}, status=400)
        
        # Refund points to user
        withdrawal.user.balance += withdrawal.points
        withdrawal.user.save()
        
        # Update withdrawal status
        withdrawal.status = 'rejected'
        withdrawal.rejection_reason = reason
        withdrawal.save()
        
        # Log action
        print(f"Admin {request.user.username} rejected withdrawal {withdrawal_id} for {withdrawal.user.username}. Reason: {reason}")
        
        return JsonResponse({
            'success': True,
            'message': 'Withdrawal rejected and points refunded'
        })
        
    except Exception as e:
        print(f"Reject withdrawal error: {e}")
        return JsonResponse({'error': 'Failed to reject withdrawal'}, status=500)


@csrf_exempt
@require_admin
@require_http_methods(["POST"])
def mark_withdrawal_paid(request, withdrawal_id):
    """Mark withdrawal as paid (admin only)"""
    try:
        # Get withdrawal
        try:
            withdrawal = Withdrawal.objects.get(id=withdrawal_id)
        except Withdrawal.DoesNotExist:
            return JsonResponse({'error': 'Withdrawal not found'}, status=404)
        
        if withdrawal.status != 'approved':
            return JsonResponse({'error': 'Withdrawal must be approved first'}, status=400)
        
        # Update status
        withdrawal.status = 'paid'
        withdrawal.save()
        
        # Log action
        print(f"Admin {request.user.username} marked withdrawal {withdrawal_id} as paid for {withdrawal.user.username}")
        
        return JsonResponse({
            'success': True,
            'message': 'Withdrawal marked as paid'
        })
        
    except Exception as e:
        print(f"Mark paid error: {e}")
        return JsonResponse({'error': 'Failed to mark as paid'}, status=500)


@require_admin
@require_http_methods(["GET"])
def get_game_sessions(request):
    """Get all game sessions (admin only)"""
    sessions = GameSession.objects.all().select_related('user')[:100]
    serializer = GameSessionSerializer(sessions, many=True)
    return JsonResponse({'sessions': serializer.data})


@require_admin
@require_http_methods(["GET"])
def get_game_statuses(request):
    """Get all game statuses (admin only)"""
    statuses = GameStatus.objects.all()
    serializer = GameStatusSerializer(statuses, many=True)
    return JsonResponse({'games': serializer.data})


@csrf_exempt
@require_admin
@require_http_methods(["POST"])
def toggle_game(request, game_type):
    """Enable or disable a game (admin only)"""
    try:
        # Get or create game status
        game_status, created = GameStatus.objects.get_or_create(
            game_type=game_type,
            defaults={
                'name': game_type.capitalize(),
                'icon': '🎮',
                'is_enabled': True
            }
        )
        
        # Toggle status
        game_status.is_enabled = not game_status.is_enabled
        game_status.save()
        
        # Log action
        action = 'enabled' if game_status.is_enabled else 'disabled'
        print(f"Admin {request.user.username} {action} game {game_type}")
        
        return JsonResponse({
            'success': True,
            'is_enabled': game_status.is_enabled,
            'message': f'Game {action} successfully'
        })
        
    except Exception as e:
        print(f"Toggle game error: {e}")
        return JsonResponse({'error': 'Failed to toggle game'}, status=500)


@csrf_exempt
@require_admin
@require_http_methods(["POST"])
def update_game_message(request, game_type):
    """Update game maintenance message (admin only)"""
    try:
        data = json.loads(request.body)
        message = data.get('message', '')
        
        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)
        
        # Get or create game status
        game_status, created = GameStatus.objects.get_or_create(
            game_type=game_type,
            defaults={
                'name': game_type.capitalize(),
                'icon': '🎮',
                'is_enabled': True
            }
        )
        
        # Update message
        game_status.maintenance_message = message
        game_status.save()
        
        # Log action
        print(f"Admin {request.user.username} updated maintenance message for {game_type}")
        
        return JsonResponse({
            'success': True,
            'message': 'Maintenance message updated'
        })
        
    except Exception as e:
        print(f"Update message error: {e}")
        return JsonResponse({'error': 'Failed to update message'}, status=500)


@csrf_exempt
@require_admin
@require_http_methods(["DELETE", "POST"])
def delete_user(request, user_id):
    """Delete a user (admin only)"""
    try:
        # Get user
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        
        # Prevent deleting admin users
        if user.is_admin:
            return JsonResponse({'error': 'Cannot delete admin users'}, status=400)
        
        username = user.username
        
        # Delete user (cascades to related records)
        user.delete()
        
        # Log action
        print(f"Admin {request.user.username} deleted user {username}")
        
        return JsonResponse({
            'success': True,
            'message': f'User {username} deleted successfully'
        })
        
    except Exception as e:
        print(f"Delete user error: {e}")
        return JsonResponse({'error': 'Failed to delete user'}, status=500)


@csrf_exempt
@require_admin
@require_http_methods(["POST"])
def change_admin_password(request):
    """Change admin password (admin only)"""
    try:
        data = json.loads(request.body)
        old_password = data.get('old_password', '')
        new_password = data.get('new_password', '')
        
        if not old_password or not new_password:
            return JsonResponse({'error': 'Both old and new passwords are required'}, status=400)
        
        if len(new_password) < 6:
            return JsonResponse({'error': 'New password must be at least 6 characters'}, status=400)
        
        # Verify old password
        if request.user.password != old_password:
            return JsonResponse({'error': 'Old password is incorrect'}, status=400)
        
        # Update password
        request.user.password = new_password
        request.user.save()
        
        # Log action
        print(f"Admin {request.user.username} changed their password")
        
        return JsonResponse({
            'success': True,
            'message': 'Password changed successfully'
        })
        
    except Exception as e:
        print(f"Change password error: {e}")
        return JsonResponse({'error': 'Failed to change password'}, status=500)
