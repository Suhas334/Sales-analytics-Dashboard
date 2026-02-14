@echo off
echo Make sure you've run `0_setup_database.bat` and installed dependencies first.
if not exist backend (echo backend folder missing & pause & exit /b 1)
if not exist frontend (echo frontend folder missing & pause & exit /b 1)

echo Starting backend in a new PowerShell window...
start "Backend" powershell -NoExit -Command "cd /d %~dp0backend; npm run dev"
timeout /t 2 /nobreak >nul

echo Starting frontend in a new PowerShell window...
start "Frontend" powershell -NoExit -Command "cd /d %~dp0frontend; npm run dev"

echo Launched both processes. Check the new windows for logs.
pause