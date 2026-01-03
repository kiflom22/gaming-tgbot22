@echo off
echo ========================================
echo   Starting Gaming Bot Servers
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python manage.py runserver 8000"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3001
echo.
echo Press any key to exit this window...
echo (The servers will keep running in their own windows)
pause >nul
