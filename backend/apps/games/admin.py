from django.contrib import admin
from .models import GameSession, GameStatus


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'game_type', 'bet_amount', 'result', 'multiplier', 'points_change', 'created_at']
    list_filter = ['game_type', 'result', 'created_at']
    search_fields = ['user__username', 'user__telegram_id']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Session Info', {
            'fields': ('user', 'game_type', 'result')
        }),
        ('Game Details', {
            'fields': ('bet_amount', 'multiplier', 'points_change', 'game_data')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )


@admin.register(GameStatus)
class GameStatusAdmin(admin.ModelAdmin):
    list_display = ['game_type', 'name', 'icon', 'is_enabled', 'updated_at']
    list_filter = ['is_enabled', 'game_type']
    search_fields = ['name', 'game_type']
    readonly_fields = ['updated_at']
    
    fieldsets = (
        ('Game Info', {
            'fields': ('game_type', 'name', 'icon')
        }),
        ('Status', {
            'fields': ('is_enabled', 'maintenance_message')
        }),
        ('Timestamp', {
            'fields': ('updated_at',)
        }),
    )
