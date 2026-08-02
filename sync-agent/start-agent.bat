@echo off
cd /d "%~dp0.."
if not exist import mkdir import
node sync-agent\agent.mjs
pause
