import hashlib
import hmac
import json
from urllib.parse import parse_qs
from django.conf import settings


def validate_telegram_init_data(init_data):
    """
    Validate Telegram WebApp initData using HMAC-SHA256
    Returns user data if valid, None otherwise
    """
    try:
        # Parse the init data
        parsed_data = parse_qs(init_data)
        
        # Extract hash
        received_hash = parsed_data.get('hash', [None])[0]
        if not received_hash:
            return None
        
        # Remove hash from data
        data_check_string_parts = []
        for key in sorted(parsed_data.keys()):
            if key != 'hash':
                value = parsed_data[key][0]
                data_check_string_parts.append(f"{key}={value}")
        
        data_check_string = '\n'.join(data_check_string_parts)
        
        # Create secret key
        bot_token = settings.TELEGRAM_BOT_TOKEN
        secret_key = hmac.new(
            b"WebAppData",
            bot_token.encode(),
            hashlib.sha256
        ).digest()
        
        # Calculate hash
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()
        
        # Compare hashes
        if calculated_hash != received_hash:
            return None
        
        # Extract user data
        user_json = parsed_data.get('user', [None])[0]
        if not user_json:
            return None
        
        user_data = json.loads(user_json)
        return user_data
        
    except Exception as e:
        print(f"Telegram validation error: {e}")
        return None
