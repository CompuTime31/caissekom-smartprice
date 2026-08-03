@echo off
setlocal
cd /d "%~dp0"
echo ============================================
echo SmartPrice Enterprise Build 009
echo Preparation production sur le port 8080
echo ============================================
call npm install
if errorlevel 1 goto :error
call npm run build
if errorlevel 1 goto :error
if not exist dist\index.html goto :error
echo.
echo Preparation terminee.
echo Lancez DEMARRER-SMARTPRICE-PRODUCTION.bat
pause
exit /b 0
:error
echo Echec de la preparation.
pause
exit /b 1
