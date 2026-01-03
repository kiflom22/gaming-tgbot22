from django.db import models
from apps.users.models import User


class GameSession(models.Model):
    RESULT_CHOICES = [
        ('win', 'Win'),
        ('loss', 'Loss'),
    ]
    
    GAME_TYPE_CHOICES = [
        ('crash', 'Crash'),
        ('limbo', 'Limbo'),
        ('slots', 'Slots'),
        ('cards', 'Cards'),
        ('mining', 'Mining'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_sessions')
    game_type = models.CharField(max_length=20, choices=GAME_TYPE_CHOICES)
    bet_amount = models.DecimalField(max_digits=10, decimal_places=2)
    result = models.CharField(max_length=10, choices=RESULT_CHOICES)
    multiplier = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    points_change = models.DecimalField(max_digits=10, decimal_places=2)
    game_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'game_sessions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.game_type} - {self.result}"


class GameStatus(models.Model):
    GAME_TYPE_CHOICES = [
        ('crash', 'Crash'),
        ('limbo', 'Limbo'),
        ('slots', 'Slots'),
        ('cards', 'Cards'),
        ('mining', 'Mining'),
    ]
    
    game_type = models.CharField(max_length=20, choices=GAME_TYPE_CHOICES, unique=True)
    name = models.CharField(max_length=50)
    icon = models.CharField(max_length=10)
    is_enabled = models.BooleanField(default=True)
    maintenance_message = models.TextField(default='Game is under maintenance. Please try again later.')
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'game_statuses'
        verbose_name_plural = 'Game statuses'
    
    def __str__(self):
        return f"{self.name} - {'Enabled' if self.is_enabled else 'Disabled'}"
