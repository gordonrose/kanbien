import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseEd25519PublicKey, verifyRootLoginSignature } from "../../../src/features/rootAuth/domain/ssh";
import { createEd25519KeyMaterial } from "../../harness/rootAuth/serviceHarness";

function runSshKeygen(args: string[], options: { input?: string } = {}): string {
  const result = spawnSync("ssh-keygen", args, {
    input: options.input ? Buffer.from(options.input, "utf8") : undefined,
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
  });

  if (result.error || result.status !== 0) {
    throw new Error(result.error?.message ?? String(result.stderr || result.stdout || "ssh-keygen failed"));
  }

  return String(result.stdout ?? "");
}

describe("root auth SSH verification", () => {
  it("accepts legacy raw ed25519 signatures", () => {
    const challengeText = "challengeId=chal_123|authPrincipalId=ap_123|purpose=root-login|nonce=n|expiresAt=2099-01-01T00:00:00.000Z|aud=kanbien-platform";
    const key = createEd25519KeyMaterial();
    const parsed = parseEd25519PublicKey(key.publicKeyOpenSsh);

    expect(() => verifyRootLoginSignature(challengeText, key.signChallengeText(challengeText), parsed)).not.toThrow();
  });

  it("accepts OpenSSH-native armored signatures for registered ed25519 keys", () => {
    const challengeText = "challengeId=chal_123|authPrincipalId=ap_123|purpose=root-login|nonce=n|expiresAt=2099-01-01T00:00:00.000Z|aud=kanbien-platform";
    const tempRoot = mkdtempSync(join(tmpdir(), "kanbien-root-auth-test-"));

    try {
      const privateKeyPath = join(tempRoot, "id_ed25519");
      const challengePath = join(tempRoot, "challenge.txt");
      const signaturePath = `${challengePath}.sig`;
      writeFileSync(challengePath, challengeText, "utf8");

      runSshKeygen(["-q", "-t", "ed25519", "-N", "", "-f", privateKeyPath]);
      const publicKeyOpenSsh = runSshKeygen(["-y", "-f", privateKeyPath]).trim();
      runSshKeygen(["-Y", "sign", "-f", privateKeyPath, "-n", "kanbien-platform", challengePath]);

      const parsed = parseEd25519PublicKey(publicKeyOpenSsh);
      const armoredSignature = readFileSync(signaturePath, "utf8");

      expect(() => verifyRootLoginSignature(challengeText, armoredSignature, parsed)).not.toThrow();
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
