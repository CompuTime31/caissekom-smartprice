@echo off
setlocal
cd /d "%~dp0"
if not exist dist\index.html (
  echo L'interface n'est pas compilee.
  echo Lancez d'abord PREPARER-VERSION-PRODUCTION.bat
  pause
  exit /b 1
)
start "" http://localhost:8080
node local-server\server.mjs
