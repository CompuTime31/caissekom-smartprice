$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
while ($true) {
  try {
    Write-Output "[$(Get-Date -Format s)] Démarrage SmartPrice Local" | Add-Content "$root\data\service.log"
    node "$root\local-server\server.mjs" *>> "$root\data\service.log"
  } catch {
    Write-Output "[$(Get-Date -Format s)] Erreur: $($_.Exception.Message)" | Add-Content "$root\data\service.log"
  }
  Start-Sleep -Seconds 5
}
