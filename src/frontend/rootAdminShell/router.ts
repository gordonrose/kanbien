import express, { Router, type Request, type Response } from "express";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { env } from "../../config/env";

function resolveFrontendRoot(): string {
  const candidates =
    env.nodeEnv === "production"
      ? [
          resolve(process.cwd(), "dist/frontend/rootAdminShell"),
          resolve(process.cwd(), "src/frontend/rootAdminShell"),
        ]
      : [
          resolve(process.cwd(), "src/frontend/rootAdminShell"),
          resolve(process.cwd(), "dist/frontend/rootAdminShell"),
        ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[1];
}

function resolveHelperRoot(): string {
  const candidates = [
    resolve(process.cwd(), "dist/rootAdminHelper"),
    resolve(process.cwd(), "src/rootAdminHelper"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[1];
}

function renderPowerShellLauncher(request: Request): string {
  const helperDownloadPath = `${request.baseUrl}/helper/download/root-auth-signer-helper.mjs`;
  const appOrigin = env.rootAdmin.publicOrigin ?? `${request.protocol}://${request.get("host")}`;
  const helperDownloadUrl = `${appOrigin}${helperDownloadPath}`;
  const helperPort = env.rootAdmin.signerHelperPort;
  const helperRoot = resolveHelperRoot();
  const helperSource = readFileSync(join(helperRoot, "root-auth-signer-helper.mjs"));
  const helperHash = createHash("sha256").update(helperSource).digest("hex");
  const helperFileName = `root-auth-signer-helper-${helperHash.slice(0, 12)}.mjs`;

  return `$ErrorActionPreference = "Stop"
$helperPath = Join-Path $HOME "Downloads\\${helperFileName}"
$expectedHelperSha256 = "${helperHash}"
$env:ROOT_ADMIN_ALLOWED_ORIGIN = "${appOrigin}"
$env:ROOT_AUTH_SIGNER_PORT = "${helperPort}"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js is not installed or not on PATH." -ForegroundColor Red
  Read-Host "Press Enter to close"
  exit 1
}

function Get-FileSha256Hex([string] $path) {
  if (-not (Test-Path $path)) {
    return $null
  }

  return (Get-FileHash -Algorithm SHA256 -Path $path).Hash.ToLowerInvariant()
}

$currentHelperSha256 = Get-FileSha256Hex $helperPath

if ($currentHelperSha256 -ne $expectedHelperSha256) {
  Invoke-WebRequest -Uri "${helperDownloadUrl}" -OutFile $helperPath
  $downloadedHelperSha256 = Get-FileSha256Hex $helperPath

  if ($downloadedHelperSha256 -ne $expectedHelperSha256) {
    Write-Host "The downloaded helper did not match the expected integrity hash." -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
  }
}

try {
  & node $helperPath
} catch {
  Write-Host ""
  Write-Host "The root auth helper failed to start." -ForegroundColor Red
  Write-Host $_.Exception.Message -ForegroundColor Yellow
  Read-Host "Press Enter to close"
  exit 1
}
`;
}

export function createRootAdminShellRouter(): Router {
  const router = Router();
  const frontendRoot = resolveFrontendRoot();
  const helperRoot = resolveHelperRoot();

  router.get("/helper/download/root-auth-signer-helper.mjs", (_request, response) => {
    response.download(join(helperRoot, "root-auth-signer-helper.mjs"));
  });

  router.get("/helper/download/start-root-auth-signer-helper.ps1", (request, response) => {
    response.type("text/plain");
    response.setHeader(
      "Content-Disposition",
      'attachment; filename="start-root-auth-signer-helper.ps1"',
    );
    response.send(renderPowerShellLauncher(request));
  });

  router.use(
    "/assets",
    express.static(join(frontendRoot, "assets"), {
      fallthrough: false,
    }),
  );

  router.get(/.*/, (_request, response) => {
    response.sendFile(join(frontendRoot, "index.html"));
  });

  return router;
}
