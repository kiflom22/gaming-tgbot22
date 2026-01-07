# 🔐 Environment Variables Reference

## Render Backend Environment Variables

Copy these to your Render Dashboard → Service → Environment:

```bash
# Required
DJANGO_SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_SECRET=your-jwt-secret-key-change-this-too
DEBUG=False

# Hosts and CORS
ALLOWED_HOSTS=gaming-tgbot22-1.onrender.com,shamvirtual.vercel.app,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://shamvirtual.vercel.app

# Database (Render provides this automatically if you add PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database

# Optional - Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-if-needed
```

---

## Vercel Frontend Environment Variables

Copy these to your Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Production
VITE_API_URL=https://gaming-tgbot22-1.onrender.com
```

**Important:** After adding/updating Vercel environment variables, you MUST redeploy!

---

## How to Generate Secret Keys

### Django Secret Key
Run this in Python:
```python
import secrets
print(secrets.token_urlsafe(50))
```

Or use this online: https://djecrety.ir/

### JWT Secret
Run this in Python:
```python
import secrets
print(secrets.token_hex(32))
```

---

## Quick Copy-Paste for Render

```
DJANGO_SECRET_KEY=CHANGE_THIS_TO_A_RANDOM_STRING_50_CHARS
JWT_SECRET=CHANGE_THIS_TO_A_RANDOM_STRING_32_CHARS
DEBUG=False
ALLOWED_HOSTS=gaming-tgbot22-1.onrender.com,shamvirtual.vercel.app,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://shamvirtual.vercel.app
```

---

## Quick Copy-Paste for Vercel

```
VITE_API_URL=https://gaming-tgbot22-1.onrender.com
```
