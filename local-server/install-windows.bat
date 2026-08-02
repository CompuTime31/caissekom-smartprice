@echo off
setlocal
cd /d "%~dp0.."
echo ========================================
echo SmartPrice Enterprise - Installation locale
echo ========================================
where node >nul 2>nul || (echo Node.js 20+ est requis.& pause & exit /b 1)
call npm install || (echo Echec de l'installation des dependances.& pause & exit /b 1)
call npm run build || (echo Echec de compilation.& pause & exit /b 1)
if not exist data mkdir data
start "SmartPrice Local" cmd /k "npm run local"
timeout /t 3 >nul
start http://localhost:8080/admin
echo Installation locale terminee.
pause
