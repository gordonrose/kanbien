import http from "node:http";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const homeDirectory = process.env.HOME ?? process.env.USERPROFILE ?? "";
const privateKeyPath =
  process.env.ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH ?? join(homeDirectory, ".ssh", "id_ed25519");
const bindHost = process.env.ROOT_AUTH_SIGNER_HOST ?? "127.0.0.1";
const bindPort = Number(process.env.ROOT_AUTH_SIGNER_PORT ?? "8787");
const signingNamespace = "kanbien-platform";
const tempRootsToCleanup = [];

function registerTempRoot(tempRoot) {
  tempRootsToCleanup.push(tempRoot);
  return tempRoot;
}

function cleanupTempRoots() {
  for (const tempRoot of tempRootsToCleanup.splice(0)) {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

process.on("exit", cleanupTempRoots);
process.on("SIGINT", () => {
  cleanupTempRoots();
  process.exit(130);
});
process.on("SIGTERM", () => {
  cleanupTempRoots();
  process.exit(143);
});

function runSshKeygen(args, options = {}) {
  const result = spawnSync("ssh-keygen", args, {
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
    ...options,
  });

  if (result.error) {
    if (result.error.code === "ENOENT") {
      throw new Error("OpenSSH ssh-keygen is required before the signer helper can run.");
    }

    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = result.stderr ? String(result.stderr).trim() : "";
    const stdout = result.stdout ? String(result.stdout).trim() : "";
    throw new Error(stderr || stdout || "ssh-keygen failed.");
  }

  return {
    stdout: result.stdout ? String(result.stdout) : "",
    stderr: result.stderr ? String(result.stderr) : "",
  };
}

function loadPublicKeyOpenSsh(keyPath) {
  if (keyPath.endsWith(".pub")) {
    throw new Error("ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH must point to a private key file.");
  }

  return runSshKeygen(["-y", "-f", keyPath]).stdout.trim();
}

function preparePrivateKeyPath(keyPath) {
  if (!keyPath.startsWith("/mnt/")) {
    return keyPath;
  }

  const tempRoot = registerTempRoot(mkdtempSync(join(tmpdir(), "kanbien-postman-key-")));
  const stagedKeyPath = join(tempRoot, "signing-key");
  writeFileSync(stagedKeyPath, readFileSync(keyPath));
  chmodSync(stagedKeyPath, 0o600);
  return stagedKeyPath;
}

function toSshEd25519Fingerprint(publicKeyOpenSsh) {
  const parts = publicKeyOpenSsh.trim().split(/\s+/);

  if (parts.length < 2 || parts[0] !== "ssh-ed25519") {
    throw new Error("Only ssh-ed25519 keys are supported by this signer.");
  }

  const decoded = Buffer.from(parts[1], "base64");
  return `SHA256:${createHash("sha256").update(decoded).digest("base64").replace(/=+$/, "")}`;
}

function signChallengeText(challengeText, keyPath) {
  const tempRoot = mkdtempSync(join(tmpdir(), "kanbien-postman-signer-"));
  const challengePath = join(tempRoot, "challenge.txt");
  const signaturePath = `${challengePath}.sig`;

  try {
    writeFileSync(challengePath, challengeText, "utf8");
    runSshKeygen(["-Y", "sign", "-f", keyPath, "-n", signingNamespace, challengePath]);
    return readFileSync(signaturePath, "utf8").trim();
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

const effectivePrivateKeyPath = preparePrivateKeyPath(privateKeyPath);
const publicKeyOpenSsh = loadPublicKeyOpenSsh(effectivePrivateKeyPath);
const publicKeyFingerprint = toSshEd25519Fingerprint(publicKeyOpenSsh);

const server = http.createServer((req, res) => {
  const requestPath = req.url ? new URL(req.url, `http://${bindHost}:${bindPort}`).pathname : "";

  if (req.method !== "POST" || !["/sign", "/sign/"].includes(requestPath)) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ code: "NOT_FOUND", message: "Not found" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const parsed = JSON.parse(body);
      const challengeText = parsed.challengeText;

      if (typeof challengeText !== "string" || challengeText.trim().length === 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            code: "INVALID_REQUEST",
            message: "challengeText is required",
          }),
        );
        return;
      }

      const signature = signChallengeText(challengeText, effectivePrivateKeyPath);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          signature,
          publicKeyFingerprint,
        }),
      );
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          code: "SIGNING_FAILED",
          message: error instanceof Error ? error.message : "Unknown signing failure",
        }),
      );
    }
  });
});

server.listen(bindPort, bindHost, () => {
  console.log(`Root auth signer listening on http://${bindHost}:${bindPort}`);
  console.log(`Using private key: ${privateKeyPath}`);
  if (effectivePrivateKeyPath !== privateKeyPath) {
    console.log(`Staged private key for OpenSSH permission checks: ${effectivePrivateKeyPath}`);
  }
  console.log(`Fingerprint: ${publicKeyFingerprint}`);
  console.log("Using system ssh-keygen for signing.");
});
