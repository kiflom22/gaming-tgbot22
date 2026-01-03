from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from decimal import Decimal
import json
import random
from .models import GameSession, GameStatus
from .serializers import GameSessionSerializer, GameStatusSerializer
from apps.users.middleware import require_auth


@require_http_methods(["GET"])
def get_game_status(request):
    """Get status of all games"""
    statuses = GameStatus.objects.all()
    result = {}
    for status in statuses:
        result[status.game_type] = {
            'is_enabled': status.is_enabled,
            'maintenance_message': status.maintenance_message
        }
    return JsonResponse(result)


@csrf_exempt
@require_auth
@require_http_methods(["POST"])
def play_game(request):
    """Play a game"""
    try:
        data = json.loads(request.body)
        game_type = data.get('game_type')
        bet_amount = Decimal(str(data.get('bet_amount', 0)))
        game_data = data.get('game_data', {})
        
        # Validate
        if bet_amount <= 0:
            return JsonResponse({'error': 'Invalid bet amount'}, status=400)
        
        if request.user.balance < bet_amount:
            return JsonResponse({'error': 'Insufficient balance'}, status=400)
        
        if request.user.is_suspended:
            return JsonResponse({'error': 'Account suspended'}, status=403)
        
        # Check if game is enabled
        try:
            game_status = GameStatus.objects.get(game_type=game_type)
            if not game_status.is_enabled:
                return JsonResponse({
                    'error': 'Game is currently disabled',
                    'maintenance_message': game_status.maintenance_message
                }, status=503)
        except GameStatus.DoesNotExist:
            pass
        
        # Special handling for mining game
        if game_type == 'mining':
            hit_mine = game_data.get('hit_mine', False)
            multiplier = Decimal(str(game_data.get('multiplier', 0)))
            
            if hit_mine:
                # Player hit a mine - they lose
                points_change = -bet_amount
                result = 'loss'
                multiplier = Decimal('0')
            else:
                # Player cashed out successfully - they win
                points_change = bet_amount * (multiplier - Decimal('1'))
                result = 'win'
        # Special handling for cards game
        elif game_type == 'cards':
            won = game_data.get('won', False)
            multiplier = Decimal(str(game_data.get('multiplier', 1.5)))
            
            if won:
                # Player found the joker - they win
                points_change = bet_amount * (multiplier - Decimal('1'))
                result = 'win'
            else:
                # Player picked wrong card - they lose
                points_change = -bet_amount
                result = 'loss'
                multiplier = Decimal('0')
        # Special handling for crash game
        elif game_type == 'crash':
            cashed_out = game_data.get('cashed_out', False)
            multiplier = Decimal(str(game_data.get('multiplier', 0)))
            
            if cashed_out:
                # Player cashed out successfully - they win
                points_change = bet_amount * (multiplier - Decimal('1'))
                result = 'win'
            else:
                # Player crashed - they lose
                points_change = -bet_amount
                result = 'loss'
                multiplier = Decimal(str(game_data.get('crash_point', 0)))  # Use crash_point as multiplier for display
        # Special handling for limbo game
        elif game_type == 'limbo':
            won = game_data.get('won', False)
            cashed_out = game_data.get('cashed_out', won)  # Support both formats
            multiplier = Decimal(str(game_data.get('multiplier', 0)))
            
            if cashed_out or won:
                # Player won - they reached their target
                points_change = bet_amount * (multiplier - Decimal('1'))
                result = 'win'
            else:
                # Player crashed before target - they lose
                points_change = -bet_amount
                result = 'loss'
                multiplier = Decimal(str(game_data.get('crash_point', 0)))  # Use crash_point as multiplier for display
        elif game_type == 'slots':
            # Slots game: 35% win chance, 65% lose chance
            rand = random.random()
            
            if rand < 0.02:  # 2% chance for jackpot (10x)
                multiplier = Decimal('10.0')
                points_change = bet_amount * multiplier
                result = 'win'
            elif rand < 0.12:  # 10% chance for 3x
                multiplier = Decimal('3.0')
                points_change = bet_amount * multiplier
                result = 'win'
            elif rand < 0.35:  # 23% chance for 1.5x
                multiplier = Decimal('1.5')
                points_change = bet_amount * multiplier
                result = 'win'
            else:  # 65% chance to lose
                multiplier = Decimal('0')
                points_change = -bet_amount
                result = 'loss'
        else:
            # Other games: Randomize win chance (10% chance to win)
            won = random.random() < 0.10
            multiplier = Decimal(str(game_data.get('multiplier', 2.0)))

            if won:
                points_change = bet_amount * multiplier
                result = 'win'
            else:
                points_change = -bet_amount
                result = 'loss'

        # Update user balance and stats
        request.user.balance += points_change
        request.user.games_played += 1
        request.user.total_wagered += bet_amount
        
        if result == 'win':
            request.user.total_won += points_change
        else:
            request.user.total_lost += abs(points_change)
        
        request.user.save()
        
        # Create game session
        session = GameSession.objects.create(
            user=request.user,
            game_type=game_type,
            bet_amount=bet_amount,
            result=result,
            multiplier=multiplier,
            points_change=points_change,
            game_data=game_data
        )
        
        return JsonResponse({
            'result': result,
            'multiplier': float(multiplier),
            'points_change': float(points_change),
            'new_balance': float(request.user.balance),
            'session_id': session.id
        })
        
    except Exception as e:
        print(f"Play game error: {e}")
        return JsonResponse({'error': 'Failed to play game'}, status=500)


@require_auth
@require_http_methods(["GET"])
def get_game_history(request):
    """Get user's game history"""
    sessions = GameSession.objects.filter(user=request.user)[:50]
    serializer = GameSessionSerializer(sessions, many=True)
    return JsonResponse(serializer.data, safe=False)


@csrf_exempt
@require_auth
@require_http_methods(["DELETE"])
def clear_game_history(request):
    """Clear all game history (admin only)"""
    if not request.user.is_admin:
        return JsonResponse({'error': 'Admin access required'}, status=403)
    
    try:
        count = GameSession.objects.all().count()
        GameSession.objects.all().delete()
        return JsonResponse({
            'success': True,
            'message': f'Deleted {count} game history records'
        })
    except Exception as e:
        print(f"Clear history error: {e}")
        return JsonResponse({'error': 'Failed to clear history'}, status=500)
