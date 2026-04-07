$ErrorActionPreference = "Stop"

$desktop = [Environment]::GetFolderPath("Desktop")
$launcherSource = "\\wsl.localhost\Ubuntu\home\gordon\kanbien\docs\postman\start-postman-root-auth-signer.cmd"
$launcherTarget = Join-Path $desktop "Start-Postman-Root-Auth-Signer.cmd"
$shortcutTarget = Join-Path $desktop "Postman Root Auth Signer.lnk"

Copy-Item -Force $launcherSource $launcherTarget

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutTarget)
$shortcut.TargetPath = $launcherTarget
$shortcut.WorkingDirectory = $desktop
$shortcut.Save()

Write-Host "Created launcher: $launcherTarget"
Write-Host "Created shortcut: $shortcutTarget"
