from django.urls import path
from . import views

urlpatterns = [
    # User management
    path('users/', views.get_all_users, name='admin_users'),
    path('users/<int:user_id>/add-points/', views.add_points_to_user, name='admin_add_points'),
    path('users/<int:user_id>/suspend/', views.suspend_user, name='admin_suspend_user'),
    path('users/<int:user_id>/delete/', views.delete_user, name='admin_delete_user'),
    
    # Withdrawal management
    path('withdrawals/', views.get_all_withdrawals, name='admin_withdrawals'),
    path('withdrawals/<int:withdrawal_id>/approve/', views.approve_withdrawal, name='admin_approve_withdrawal'),
    path('withdrawals/<int:withdrawal_id>/reject/', views.reject_withdrawal, name='admin_reject_withdrawal'),
    path('withdrawals/<int:withdrawal_id>/paid/', views.mark_withdrawal_paid, name='admin_mark_paid'),
    
    # Game control
    path('game-statuses/', views.get_game_statuses, name='admin_game_statuses'),
    path('game-statuses/<str:game_type>/toggle/', views.toggle_game, name='admin_toggle_game'),
    path('game-statuses/<str:game_type>/message/', views.update_game_message, name='admin_update_message'),
    
    # Game sessions
    path('game-sessions/', views.get_game_sessions, name='admin_game_sessions'),
    
    # Admin settings
    path('change-password/', views.change_admin_password, name='admin_change_password'),
]
