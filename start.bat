@echo off
setlocal
title Portfolio - Dev Server
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is not installed or not on PATH.
  echo Install Node.js 20.19+ from https://nodejs.org/ and run this file again.
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Reinstall Node.js from https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies for the first run...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting the portfolio. Your browser will open automatically.
echo Press Ctrl+C to stop the server.
echo.
call npm run dev -- --open
if errorlevel 1 (
  echo.
  echo The server stopped with an error.
  pause
)
endlocal
