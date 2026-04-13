@echo off
setlocal

:: Check for Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH.
    echo Download it from https://nodejs.org
    pause
    exit /b 1
)

if not exist "%~dp0dist" (
    echo ERROR: dist folder not found. Run the build first.
    pause
    exit /b 1
)

:: Pick package manager
set PM=npx
where pnpm >nul 2>&1
if not errorlevel 1 set PM=pnpm

echo Starting server from dist...
start "Next.js Server" cmd /k "cd /d "%~dp0dist" && %PM% start"
echo Waiting for server to start...
timeout /t 5 /nobreak >nul
start http://localhost:3000

endlocal
