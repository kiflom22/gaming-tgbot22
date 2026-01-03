from django.urls import path
from . import views

urlpatterns = [
    path('auth/', views.auth_user, name='auth'),
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('verify/', views.verify_token_view, name='verify'),
    path('balance/', views.get_balance, name='balance'),
    path('stats/', views.get_stats, name='stats'),
    path('withdrawal/', views.request_withdrawal, name='withdrawal'),
    path('withdrawals/', views.get_withdrawals, name='withdrawals'),
]
