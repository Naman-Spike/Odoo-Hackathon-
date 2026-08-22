@echo off
title Dayflow HRMS Launcher
echo ========================================================
echo          DAYFLOW HRMS - 1-Click Application Launcher
echo ========================================================
echo.

echo Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)

echo Initializing Dayflow HRMS (Auto-installing dependencies if first run)...
node "%~dp0start.js"

pause
