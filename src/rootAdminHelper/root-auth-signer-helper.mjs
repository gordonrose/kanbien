import http from "node:http";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const configuredPrivateKeyPath = process.env.ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH;
const homeDirectory = process.env.HOME ?? process.env.USERPROFILE ?? "";
const defaultSshDirectory = join(homeDirectory, ".ssh");
const bindHost = process.env.ROOT_AUTH_SIGNER_HOST ?? "127.0.0.1";
const bindPort = Number(process.env.ROOT_AUTH_SIGNER_PORT ?? "8787");
const allowedOrigin = process.env.ROOT_ADMIN_ALLOWED_ORIGIN;
const signingNamespace = "kanbien-platform";

if (!allowedOrigin) {
  throw new Error("ROOT_ADMIN_ALLOWED_ORIGIN must be set for the root auth signer helper.");
}

function runSshKeygen(args, options = {}) {
  const result = spawnSync("ssh-keygen", args, {
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
    ...options,
  });

  if (result.error) {
    if (result.error.code === "ENOENT") {
      throw new Error(
        "OpenSSH ssh-keygen is required on this workstation before the helper can sign login challenges.",
      );
    }

    throw result.error;
  }

  if (result.status !== 0) {
    const stderr = result.stderr ? String(result.stderr).trim() : "";
    const stdout = result.stdout ? String(result.stdout).trim() : "";
    const detail = stderr || stdout;
    throw new Error(detail || "OpenSSH signing failed.");
  }

  return {
    stdout: result.stdout ? String(result.stdout) : "",
    stderr: result.stderr ? String(result.stderr) : "",
  };
}

function parseEd25519FingerprintFromPublicKey(publicKeyOpenSsh) {
  const parts = publicKeyOpenSsh.trim().split(/\s+/);

  if (parts.length < 2 || parts[0] !== "ssh-ed25519") {
    throw new Error(
      "The helper currently supports ssh-ed25519 keys only. Point it at the private key for a registered ssh-ed25519 identity.",
    );
  }

  const decoded = Buffer.from(parts[1], "base64");
  return `SHA256:${createHash("sha256").update(decoded).digest("base64").replace(/=+$/, "")}`;
}

function loadPublicKeyFromPrivateKeyPath(keyPath) {
  if (keyPath.endsWith(".pub")) {
    throw new Error(
      "ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH must point to a private key file, not a .pub public key file.",
    );
  }

  try {
    return runSshKeygen(["-y", "-f", keyPath]).stdout.trim();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown key loading failure.";
    throw new Error(
      `The helper could not read a usable SSH private key at ${keyPath}. ${message}`,
    );
  }
}

function discoverPrivateKeyCandidates() {
  if (configuredPrivateKeyPath) {
    return [configuredPrivateKeyPath];
  }

  if (!defaultSshDirectory || !existsSync(defaultSshDirectory)) {
    return [];
  }

  const priorityNames = ["id_ed25519"];
  const entries = readdirSync(defaultSshDirectory)
    .map((entry) => join(defaultSshDirectory, entry))
    .filter((candidate) => {
      const fileName = candidate.split(/[/\\]/).pop() ?? "";

      if (
        fileName.endsWith(".pub") ||
        fileName.endsWith(".ps1") ||
        fileName.endsWith(".cmd") ||
        fileName.endsWith(".ppk") ||
        fileName === "known_hosts" ||
        fileName === "config" ||
        fileName === "authorized_keys"
      ) {
        return false;
      }

      try {
        return statSync(candidate).isFile();
      } catch {
        return false;
      }
    });

  return entries.sort((left, right) => {
    const leftName = left.split(/[/\\]/).pop() ?? "";
    const rightName = right.split(/[/\\]/).pop() ?? "";
    const leftPriority = priorityNames.includes(leftName) ? 0 : 1;
    const rightPriority = priorityNames.includes(rightName) ? 0 : 1;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return leftName.localeCompare(rightName);
  });
}

function loadAvailableSigningKeys() {
  const keys = [];

  for (const candidatePath of discoverPrivateKeyCandidates()) {
    try {
      const publicKeyOpenSsh = loadPublicKeyFromPrivateKeyPath(candidatePath);
      const fingerprint = parseEd25519FingerprintFromPublicKey(publicKeyOpenSsh);
      keys.push({
        privateKeyPath: candidatePath,
        publicKeyOpenSsh,
        fingerprint,
      });
    } catch {
      continue;
    }
  }

  if (keys.length === 0) {
    const scope = configuredPrivateKeyPath
      ? `at ${configuredPrivateKeyPath}`
      : `under ${defaultSshDirectory || "~/.ssh"}`;
    throw new Error(
      `The helper could not find a usable ssh-ed25519 private key ${scope}. Register a matching local key or set ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH explicitly.`,
    );
  }

  return keys;
}

function signChallengeWithOpenSsh(challengeText, privateKeyPath) {
  const tempRoot = mkdtempSync(join(tmpdir(), "kanbien-root-auth-helper-"));
  const challengePath = join(tempRoot, "challenge.txt");
  const signaturePath = `${challengePath}.sig`;

  try {
    writeFileSync(challengePath, challengeText, "utf8");

    runSshKeygen(["-Y", "sign", "-f", privateKeyPath, "-n", signingNamespace, challengePath]);

    return readFileSync(signaturePath, "utf8").trim();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown signing failure.";
    throw new Error(
      `The helper could not sign the login challenge with the configured SSH key. ${message}`,
    );
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function parseChallengeText(challengeText) {
  const parts = challengeText.split("|");
  const fields = Object.fromEntries(
    parts.map((part) => {
      const separatorIndex = part.indexOf("=");

      if (separatorIndex <= 0) {
        return [part, ""];
      }

      return [part.slice(0, separatorIndex), part.slice(separatorIndex + 1)];
    }),
  );

  const expiresAt = fields.expiresAt ? new Date(fields.expiresAt) : null;

  if (
    typeof fields.challengeId !== "string" ||
    !fields.challengeId.startsWith("chal_") ||
    fields.purpose !== "root-login" ||
    fields.aud !== "kanbien-platform" ||
    !(expiresAt instanceof Date) ||
    Number.isNaN(expiresAt.getTime()) ||
    expiresAt.getTime() <= Date.now()
  ) {
    throw new Error("The helper only signs active root-login challenges for kanbien-platform.");
  }
}

const availableSigningKeys = loadAvailableSigningKeys();

function sendJson(res, statusCode, payload, origin) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    ...(origin === allowedOrigin ? { "Access-Control-Allow-Origin": origin } : {}),
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;

    if (origin === allowedOrigin) {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Max-Age": "600",
      });
      res.end();
      return;
    }

    sendJson(res, 403, {
      code: "UNTRUSTED_ORIGIN",
      message: "The signing helper only accepts requests from the configured admin origin.",
    }, origin);
    return;
  }

  if (req.method !== "POST" || req.url !== "/v1/root-auth/sign-login-challenge") {
    sendJson(res, 404, { code: "NOT_FOUND", message: "Not found" }, req.headers.origin);
    return;
  }

  if (req.headers.origin !== allowedOrigin) {
    sendJson(res, 403, {
      code: "UNTRUSTED_ORIGIN",
      message: "The signing helper only accepts requests from the configured admin origin.",
    }, req.headers.origin);
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
      const requestedFingerprint = parsed.publicKeyFingerprint;

      if (typeof challengeText !== "string" || challengeText.trim().length === 0) {
        sendJson(res, 400, {
          code: "INVALID_REQUEST",
          message: "challengeText is required.",
        }, req.headers.origin);
        return;
      }

      const signingKey = availableSigningKeys.find(
        (candidate) => candidate.fingerprint === requestedFingerprint?.trim(),
      );

      if (
        typeof requestedFingerprint !== "string" ||
        !signingKey
      ) {
        sendJson(res, 409, {
          code: "UNREGISTERED_SIGNING_KEY",
          message: "The requested public key fingerprint is not available from this helper's local SSH keys.",
        }, req.headers.origin);
        return;
      }

      parseChallengeText(challengeText);

      const signature = signChallengeWithOpenSsh(challengeText, signingKey.privateKeyPath);

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": allowedOrigin,
        "Cache-Control": "no-store",
      });
      res.end(
        JSON.stringify({
          signature,
          publicKeyFingerprint: signingKey.fingerprint,
        }),
      );
    } catch (error) {
      sendJson(res, 500, {
        code: "SIGNING_FAILED",
        message: error instanceof Error ? error.message : "Unknown signing failure",
      }, req.headers.origin);
    }
  });
});

server.listen(bindPort, bindHost, () => {
  console.log(`Root auth signer listening on http://${bindHost}:${bindPort}`);
  console.log(`Configured admin origin: ${allowedOrigin}`);
  console.log(`Using system ssh-keygen for signing`);
  console.log(`Available fingerprints: ${availableSigningKeys.map((item) => item.fingerprint).join(", ")}`);
});
