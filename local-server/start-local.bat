@echo off
cd /d "%~dp0.."
start "SmartPrice Local" cmd /k "npm run local"
timeout /t 2 >nul
start http://localhost:8080/admin
