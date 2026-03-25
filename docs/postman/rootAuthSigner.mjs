import http from "node:http";
import { readFileSync } from "node:fs";
import { createHash, createPrivateKey, createPublicKey, sign } from "node:crypto";

const privateKeyPath =
  process.env.ROOT_AUTH_SIGNER_PRIVATE_KEY_PATH ?? "/mnt/c/Users/gordo/.ssh/id_ed25519";
const bindHost = process.env.ROOT_AUTH_SIGNER_HOST ?? "127.0.0.1";
const bindPort = Number(process.env.ROOT_AUTH_SIGNER_PORT ?? "8787");

const privateKey = createPrivateKey(readFileSync(privateKeyPath));
const publicKey = createPublicKey(privateKey);

function toSshEd25519Fingerprint(key) {
  const jwk = key.export({ format: "jwk" });
  const keyBytes = Buffer.from(jwk.x, "base64url");

  const sshString = (buf) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(buf.length, 0);
    return Buffer.concat([len, buf]);
  };

  const blob = Buffer.concat([
    sshString(Buffer.from("ssh-ed25519", "utf8")),
    sshString(keyBytes),
  ]);

  return `SHA256:${createHash("sha256").update(blob).digest("base64").replace(/=+$/, "")}`;
}

const publicKeyFingerprint = toSshEd25519Fingerprint(publicKey);

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/sign") {
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

      if (typeof challengeText !== "string" || challengeText.length === 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            code: "INVALID_REQUEST",
            message: "challengeText is required",
          }),
        );
        return;
      }

      const signature = sign(null, Buffer.from(challengeText, "utf8"), privateKey).toString(
        "base64",
      );

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
  console.log(`Fingerprint: ${publicKeyFingerprint}`);
});
