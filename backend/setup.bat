@echo off
echo 🚀 Setting up Django Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

echo ✅ Python found
echo.

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Copy environment file
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your configuration!
) else (
    echo ✅ .env file already exists
)

REM Run migrations
echo 🗄️  Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Initialize game statuses
echo 🎮 Initializing game statuses...
python manage.py shell < scripts\init_games.py

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Edit .env file with your Telegram bot token and secrets
echo 2. Run: python manage.py runserver 8000
echo 3. Make a user admin: python scripts\make_admin.py ^<telegram_id^>
echo.
echo 🎉 Happy coding!
pause
