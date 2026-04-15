$ErrorActionPreference = "Stop"

$repoPath = "\\wsl.localhost\Ubuntu\home\gordon\kanbien"
$windowsKeyPath = "/mnt/c/Users/gordo/.ssh/id_ed25519"
$allowedOrigin = "http://localhost:3000"
$helperPort = "8787"
$helperScriptPath = "/home/gordon/kanbien/src/rootAdminHelper/root-auth-signer-helper.mjs"
$stagedKeyPath = "/tmp/kanbien-root-admin-signer-id_ed25519"
$wslCommand = "set -euo pipefail && install -m 600 '$windowsKeyPath' '$stagedKeyPath' && cd /home/gordon/kanbien && ROOT_ADMIN_ALLOWED_ORIGIN='$allowedOrigin' ROOT_AUTH_SIGNER_PORT='$helperPort' ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH='$stagedKeyPath' node $helperScriptPath"

Write-Host "Starting root-admin browser signer from $repoPath" -ForegroundColor Cyan
Write-Host "Allowed origin: $allowedOrigin" -ForegroundColor Green
Write-Host "Helper URL: http://127.0.0.1:$helperPort/v1/root-auth/sign-login-challenge" -ForegroundColor Green
Write-Host "Using SSH key: $windowsKeyPath" -ForegroundColor Green
Write-Host "Staged WSL key: $stagedKeyPath" -ForegroundColor Green
Write-Host ""

try {
  & wsl.exe -d Ubuntu bash -lc $wslCommand
} catch {
  Write-Host ""
  Write-Host "The root-admin browser signer failed to start." -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Yellow
  Read-Host "Press Enter to close"
  exit 1
}
