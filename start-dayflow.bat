@echo off
title Dayflow HRMS Launcher
echo ========================================================
echo          DAYFLOW HRMS - Starting Application
echo ========================================================
echo.

echo [1/3] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo [2/3] Launching Backend Server on port 5000...
start "Dayflow Backend Server" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Launching Frontend Client on port 5173...
start "Dayflow Frontend Client" cmd /k "cd /d %~dp0client && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo  Dayflow HRMS is now running!
echo  Opening browser at: http://localhost:5173
echo ========================================================
start http://localhost:5173

pause
