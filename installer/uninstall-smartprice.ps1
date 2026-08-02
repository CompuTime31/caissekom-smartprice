$ErrorActionPreference = "SilentlyContinue"
Stop-ScheduledTask -TaskName "Caissekom SmartPrice Local"
Unregister-ScheduledTask -TaskName "Caissekom SmartPrice Local" -Confirm:$false
Remove-NetFirewallRule -DisplayName "SmartPrice Local 8080"
Remove-Item ([Environment]::GetFolderPath('CommonDesktopDirectory') + '\SmartPrice Administration.url') -Force
Write-Host "Service et raccourci SmartPrice supprimés. Les données restent conservées dans le dossier d'installation." -ForegroundColor Yellow
