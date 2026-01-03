import jwt
from datetime import datetime, timedelta
from django.conf import settings


def generate_token(user):
    """Generate JWT token for user"""
    payload = {
        'telegram_id': user.telegram_id,
        'is_admin': user.is_admin,
        'exp': datetime.utcnow() + timedelta(days=settings.JWT_EXPIRATION_DAYS),
        'iat': datetime.utcnow()
    }
    
    token = jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return token


def verify_token(token):
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
