# SmartPrice Enterprise Build 008 - Assistant graphique Windows
# Exécuter en administrateur.
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

$form = New-Object System.Windows.Forms.Form
$form.Text = 'Installation SmartPrice Enterprise'
$form.Size = New-Object System.Drawing.Size(720,520)
$form.StartPosition = 'CenterScreen'
$form.BackColor = [System.Drawing.Color]::White
$form.Font = New-Object System.Drawing.Font('Segoe UI',10)

$title = New-Object System.Windows.Forms.Label
$title.Text = 'SmartPrice Enterprise — Installation'
$title.Font = New-Object System.Drawing.Font('Segoe UI Semibold',20)
$title.ForeColor = [System.Drawing.Color]::FromArgb(16,82,156)
$title.Location = New-Object System.Drawing.Point(28,24)
$title.AutoSize = $true
$form.Controls.Add($title)

$info = New-Object System.Windows.Forms.Label
$info.Text = "Cet assistant installe SmartPrice Local, crée le démarrage automatique, la règle pare-feu et le raccourci Administration."
$info.Location = New-Object System.Drawing.Point(32,78)
$info.Size = New-Object System.Drawing.Size(640,50)
$form.Controls.Add($info)

$log = New-Object System.Windows.Forms.TextBox
$log.Multiline = $true
$log.ScrollBars = 'Vertical'
$log.ReadOnly = $true
$log.Location = New-Object System.Drawing.Point(32,135)
$log.Size = New-Object System.Drawing.Size(640,260)
$log.BackColor = [System.Drawing.Color]::FromArgb(245,249,255)
$form.Controls.Add($log)

$progress = New-Object System.Windows.Forms.ProgressBar
$progress.Location = New-Object System.Drawing.Point(32,410)
$progress.Size = New-Object System.Drawing.Size(640,22)
$form.Controls.Add($progress)

$install = New-Object System.Windows.Forms.Button
$install.Text = 'Installer SmartPrice'
$install.Location = New-Object System.Drawing.Point(465,445)
$install.Size = New-Object System.Drawing.Size(207,38)
$install.BackColor = [System.Drawing.Color]::FromArgb(21,101,192)
$install.ForeColor = [System.Drawing.Color]::White
$install.FlatStyle = 'Flat'
$form.Controls.Add($install)

$close = New-Object System.Windows.Forms.Button
$close.Text = 'Fermer'
$close.Location = New-Object System.Drawing.Point(350,445)
$close.Size = New-Object System.Drawing.Size(105,38)
$close.Add_Click({$form.Close()})
$form.Controls.Add($close)

function Add-Log([string]$message){$log.AppendText("$message`r`n");$log.SelectionStart=$log.Text.Length;$log.ScrollToCaret();[System.Windows.Forms.Application]::DoEvents()}

$install.Add_Click({
  $install.Enabled = $false
  try {
    $root = Split-Path -Parent $PSScriptRoot
    $target = Join-Path $env:ProgramData 'Caissekom\SmartPrice'
    Add-Log '1/7 Vérification de Node.js...'
    $progress.Value = 8
    $node = Get-Command node -ErrorAction Stop
    $major = [int]((& node -v).TrimStart('v').Split('.')[0])
    if($major -lt 20){throw 'Node.js 20 ou supérieur est obligatoire.'}

    Add-Log '2/7 Préparation du dossier d’installation...'
    $progress.Value = 20
    New-Item -ItemType Directory -Force -Path $target | Out-Null
    robocopy $root $target /MIR /XD node_modules data backups .git | Out-Null

    Add-Log '3/7 Installation des dépendances...'
    $progress.Value = 35
    Push-Location $target
    & npm install --no-audit --no-fund | Out-Null
    if($LASTEXITCODE -ne 0){throw 'npm install a échoué.'}

    Add-Log '4/7 Compilation de l’application...'
    $progress.Value = 55
    & npm run build | Out-Null
    if($LASTEXITCODE -ne 0){throw 'La compilation a échoué.'}

    Add-Log '5/7 Configuration du pare-feu...'
    $progress.Value = 70
    netsh advfirewall firewall delete rule name='SmartPrice Local 8080' | Out-Null
    netsh advfirewall firewall add rule name='SmartPrice Local 8080' dir=in action=allow protocol=TCP localport=8080 | Out-Null

    Add-Log '6/7 Démarrage automatique Windows...'
    $progress.Value = 82
    $nodeExe = (Get-Command node).Source
    $server = Join-Path $target 'local-server\server.mjs'
    schtasks /Delete /TN 'Caissekom SmartPrice Local' /F 2>$null | Out-Null
    schtasks /Create /TN 'Caissekom SmartPrice Local' /SC ONSTART /RU SYSTEM /RL HIGHEST /TR ('"'+$nodeExe+'" "'+$server+'"') /F | Out-Null
    schtasks /Run /TN 'Caissekom SmartPrice Local' | Out-Null

    Add-Log '7/7 Création du raccourci Administration...'
    $progress.Value = 94
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut((Join-Path ([Environment]::GetFolderPath('Desktop')) 'SmartPrice Administration.lnk'))
    $shortcut.TargetPath = 'http://localhost:8080/setup'
    $shortcut.Save()
    Pop-Location
    $progress.Value = 100
    Add-Log 'Installation terminée avec succès.'
    Start-Process 'http://localhost:8080/setup'
    [System.Windows.Forms.MessageBox]::Show('SmartPrice est installé. L’assistant de mise en service va s’ouvrir.','SmartPrice',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Information) | Out-Null
  } catch {
    Add-Log ('ERREUR : '+$_.Exception.Message)
    [System.Windows.Forms.MessageBox]::Show($_.Exception.Message,'Installation impossible',[System.Windows.Forms.MessageBoxButtons]::OK,[System.Windows.Forms.MessageBoxIcon]::Error) | Out-Null
  } finally {$install.Enabled = $true}
})

[void]$form.ShowDialog()
