from rest_framework import serializers
from .models import GameSession, GameStatus
from apps.users.serializers import UserSerializer


class GameSessionSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source='id', read_only=True)
    user_id = UserSerializer(source='user', read_only=True)
    telegram_id = serializers.IntegerField(source='user.telegram_id', read_only=True)
    
    class Meta:
        model = GameSession
        fields = ['id', '_id', 'user', 'user_id', 'telegram_id', 'game_type', 'bet_amount', 
                  'result', 'multiplier', 'points_change', 'game_data', 'created_at']
        read_only_fields = ['id', '_id', 'telegram_id', 'created_at']


class GameStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameStatus
        fields = ['id', 'game_type', 'name', 'icon', 'is_enabled', 
                  'maintenance_message', 'updated_at']
        read_only_fields = ['id', 'updated_at']
