@echo off
echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo Installing Frontend Dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo All dependencies installed successfully!
echo ========================================
echo.
pause
