from django.contrib import admin
from .models import User, Withdrawal


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['telegram_id', 'username', 'balance', 'is_admin', 'is_suspended', 'games_played', 'created_at']
    list_filter = ['is_admin', 'is_suspended', 'created_at']
    search_fields = ['telegram_id', 'username', 'first_name', 'last_name']
    readonly_fields = ['created_at', 'last_login']
    
    fieldsets = (
        ('User Info', {
            'fields': ('telegram_id', 'username', 'first_name', 'last_name')
        }),
        ('Balance & Stats', {
            'fields': ('balance', 'games_played', 'total_wagered', 'total_won', 'total_lost')
        }),
        ('Permissions', {
            'fields': ('is_admin', 'is_suspended')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'last_login')
        }),
    )


@admin.register(Withdrawal)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ['user', 'points', 'payment_method', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['user__username', 'user__telegram_id', 'payment_details']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Withdrawal Info', {
            'fields': ('user', 'points', 'amount', 'status')
        }),
        ('Payment Details', {
            'fields': ('payment_method', 'payment_details')
        }),
        ('Additional Info', {
            'fields': ('rejection_reason', 'created_at', 'updated_at')
        }),
    )
