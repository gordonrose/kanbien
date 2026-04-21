$ErrorActionPreference = "Stop"

$desktop = [Environment]::GetFolderPath("Desktop")
$launcherSource = "\\wsl.localhost\Ubuntu\home\gordon\kanbien\src\rootAdminHelper\start-root-admin-browser-signer.cmd"
$launcherTarget = Join-Path $desktop "Start-Root-Admin-Browser-Signer.cmd"
$shortcutTarget = Join-Path $desktop "Root Admin Browser Signer.lnk"

Copy-Item -Force $launcherSource $launcherTarget

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutTarget)
$shortcut.TargetPath = $launcherTarget
$shortcut.WorkingDirectory = $desktop
$shortcut.Save()

Write-Host "Created launcher: $launcherTarget"
Write-Host "Created shortcut: $shortcutTarget"
