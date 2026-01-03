from django.urls import path
from . import views

urlpatterns = [
    path('status/', views.get_game_status, name='game_status'),
    path('play/', views.play_game, name='play_game'),
    path('history/', views.get_game_history, name='game_history'),
    path('history/clear/', views.clear_game_history, name='clear_game_history'),
]
