@echo off
echo Setting up Database...
cd backend
echo Running setup_database.js...
node setup_database.js
if %errorlevel% neq 0 (
    echo.
    echo FAILED to setup database!
    echo Please check if:
    echo 1. PostgreSQL is installed and running.
    echo 2. The password in backend/.env is correct (default is 'password').
    echo.
    pause
    exit /b %errorlevel%
)
echo.
echo Database setup complete!
pause
