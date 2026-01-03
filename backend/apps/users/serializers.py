from rest_framework import serializers
from .models import User, Withdrawal


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source='id', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', '_id', 'telegram_id', 'username', 'first_name', 'last_name', 
                  'balance', 'is_admin', 'is_suspended', 'games_played', 
                  'total_wagered', 'total_won', 'total_lost', 'created_at', 'last_login']
        read_only_fields = ['id', '_id', 'created_at', 'last_login']


class WithdrawalSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source='id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    telegram_id = serializers.IntegerField(source='user.telegram_id', read_only=True)
    
    class Meta:
        model = Withdrawal
        fields = ['id', '_id', 'user', 'username', 'telegram_id', 'points', 'amount', 
                  'payment_method', 'payment_details', 'status', 'rejection_reason', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', '_id', 'username', 'telegram_id', 'created_at', 'updated_at']
