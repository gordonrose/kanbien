$ErrorActionPreference = "Stop"

$repoPath = "\\wsl.localhost\Ubuntu\home\gordon\kanbien"
$windowsKeyPath = "/mnt/c/Users/gordo/.ssh/id_ed25519"
$wslCommand = "cd /home/gordon/kanbien && ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH=$windowsKeyPath node docs/postman/rootAuthSigner.mjs"

Write-Host "Starting Postman root auth signer from $repoPath" -ForegroundColor Cyan
Write-Host "Helper URL: http://127.0.0.1:8787/sign" -ForegroundColor Green
Write-Host "Using SSH key: $windowsKeyPath" -ForegroundColor Green
Write-Host ""

try {
  & wsl.exe -d Ubuntu bash -lc $wslCommand
} catch {
  Write-Host ""
  Write-Host "The Postman root auth signer failed to start." -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Yellow
  Read-Host "Press Enter to close"
  exit 1
}
