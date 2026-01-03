"""
WSGI configuration for PythonAnywhere deployment.

INSTRUCTIONS:
1. Replace YOUR_USERNAME with your PythonAnywhere username
2. Copy this entire file content
3. Paste it into your WSGI configuration file in PythonAnywhere
   (Web tab -> WSGI configuration file)
"""

import os
import sys

# ============================================
# REPLACE YOUR_USERNAME WITH YOUR ACTUAL USERNAME
# ============================================
path = '/home/YOUR_USERNAME/gaming-bot/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# Set Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
