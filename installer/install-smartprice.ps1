param([string]$InstallDir = "$env:ProgramFiles\Caissekom\SmartPrice")
$ErrorActionPreference = "Stop"
Write-Host "SmartPrice Enterprise Build 007 - Installation locale" -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw "Node.js 20 ou supérieur est requis." }
$nodeVersion = [version]((node -v).TrimStart('v'))
if ($nodeVersion.Major -lt 20) { throw "Node.js 20 ou supérieur est requis. Version détectée: $nodeVersion" }
$source = Split-Path -Parent $PSScriptRoot
New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
Write-Host "Copie des fichiers vers $InstallDir..."
robocopy $source $InstallDir /E /XD node_modules .git data installer /XF *.zip | Out-Null
Set-Location $InstallDir
if (-not (Test-Path "$InstallDir\node_modules")) { npm install }
npm run build
New-Item -ItemType Directory -Force -Path "$InstallDir\data" | Out-Null
$runner = Join-Path $InstallDir "installer\run-local.ps1"
$taskName = "Caissekom SmartPrice Local"
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$runner`"" -WorkingDirectory $InstallDir
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -RestartCount 10 -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero)
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -RunLevel Highest -Force | Out-Null
try { New-NetFirewallRule -DisplayName "SmartPrice Local 8080" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow -Profile Private -ErrorAction Stop | Out-Null } catch { Write-Warning "Règle pare-feu non créée: $($_.Exception.Message)" }
$desktop = [Environment]::GetFolderPath('CommonDesktopDirectory')
$shortcutPath = Join-Path $desktop 'SmartPrice Administration.url'
"[InternetShortcut]`nURL=http://localhost:8080/admin`n" | Set-Content -Encoding ASCII $shortcutPath
Start-ScheduledTask -TaskName $taskName
Start-Sleep -Seconds 4
Start-Process "http://localhost:8080/setup"
Write-Host "Installation terminée." -ForegroundColor Green
