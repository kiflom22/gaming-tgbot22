"""
URL configuration for gaming bot project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('apps.users.urls')),
    path('games/api/', include('apps.games.urls')),
    path('api/admin/', include('apps.admin_panel.urls')),
]
