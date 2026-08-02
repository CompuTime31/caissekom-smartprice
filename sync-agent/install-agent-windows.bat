@echo off
setlocal
cd /d "%~dp0.."
if not exist import mkdir import
if not exist data mkdir data
set STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
(
 echo @echo off
 echo cd /d "%CD%"
 echo node sync-agent\agent.mjs
) > "%STARTUP%\SmartPrice-Sync-Agent.bat"
echo SmartPrice Sync Agent sera lance automatiquement a l'ouverture de session Windows.
pause
