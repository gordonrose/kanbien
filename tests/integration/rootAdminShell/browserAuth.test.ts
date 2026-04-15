import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../../../src/app";
import { parseEd25519PublicKey } from "../../../src/features/rootAuth/domain/ssh";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { invokeJson, TestCookieJar } from "../../harness/http";

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

describe("root admin shell browser auth integration", () => {
  it("TC-ROOT-ADMIN-SHELL-INT-001, TC-ROOT-ADMIN-SHELL-INT-002, TC-ROOT-ADMIN-SHELL-INT-003, and TC-ROOT-ADMIN-SHELL-INT-004 complete browser login, bootstrap, and logout with a cookie-backed session", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const cookies = new TestCookieJar();
    const tempRoot = mkdtempSync(join(tmpdir(), "kanbien-root-admin-browser-"));

    let helperFingerprint = "";
    let helperArmoredSignature = "";

    try {
      const privateKeyPath = join(tempRoot, "id_ed25519");
      const challengePath = join(tempRoot, "challenge.txt");
      runSshKeygen(["-q", "-t", "ed25519", "-N", "", "-f", privateKeyPath]);
      const publicKeyOpenSsh = runSshKeygen(["-y", "-f", privateKeyPath]).trim();
      const parsedPublicKey = parseEd25519PublicKey(publicKeyOpenSsh);
      const keyRecord = await harness.authRepository.addSshPublicKey({
        keyId: "key_helper",
        authPrincipalId: identity.authPrincipalId,
        label: "helper",
        algorithm: "ssh-ed25519",
        publicKeyOpenSsh,
        fingerprint: parsedPublicKey.fingerprint,
      });
      helperFingerprint = keyRecord.fingerprint;

      const passwordStage = await invokeJson<{
      challengeId: string;
      challengeText: string;
      availableSshKeys: Array<{ fingerprint: string }>;
      }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      headers: {
        host: "admin.example.test",
      },
      body: {
        email: identity.loginEmail,
        password: identity.password,
      },
    });

      expect(passwordStage.status).toBe(200);
      expect(passwordStage.body.availableSshKeys).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fingerprint: identity.sshKey.fingerprint,
          }),
          expect.objectContaining({
            fingerprint: helperFingerprint,
          }),
        ]),
      );

      writeFileSync(challengePath, passwordStage.body.challengeText, "utf8");
      runSshKeygen(["-Y", "sign", "-f", privateKeyPath, "-n", "kanbien-platform", challengePath]);
      helperArmoredSignature = readFileSync(`${challengePath}.sig`, "utf8");

      const sshStage = await invokeJson<{
      rootUserId: string;
      authPrincipalId: string;
      email: string;
      }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/browser/login/ssh",
      headers: {
        host: "admin.example.test",
      },
      body: {
        challengeId: passwordStage.body.challengeId,
        signature: helperArmoredSignature,
        publicKeyFingerprint: helperFingerprint,
      },
      });
      cookies.absorb(sshStage.headers);

      expect(sshStage.status).toBe(200);
      expect(String(sshStage.headers["set-cookie"])).toContain("kanbien_root_admin_session=");
      expect(sshStage.body).toMatchObject({
        rootUserId: identity.rootUserId,
        authPrincipalId: identity.authPrincipalId,
        email: identity.loginEmail,
      });

      const bootstrap = await invokeJson<{
      rootUserId: string;
      authPrincipalId: string;
      email: string;
      }>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/browser/session",
      headers: {
        host: "admin.example.test",
        ...(cookies.headerValue() ? { cookie: cookies.headerValue() } : {}),
      },
      });
      cookies.absorb(bootstrap.headers);

      expect(bootstrap.status).toBe(200);
      expect(bootstrap.body).toMatchObject({
        rootUserId: identity.rootUserId,
        authPrincipalId: identity.authPrincipalId,
        email: identity.loginEmail,
      });

      const rootUsersWithCookie = await invokeJson<{ items: Array<{ rootUserId: string }> }>(harness.app, {
        method: "GET",
        path: "/v1/root-users",
        headers: {
          host: "admin.example.test",
          ...(cookies.headerValue() ? { cookie: cookies.headerValue() } : {}),
        },
      });
      expect(rootUsersWithCookie.status).toBe(200);
      expect(rootUsersWithCookie.body.items.map((item) => item.rootUserId)).toContain(identity.rootUserId);

      const rootRolesWithCookie = await invokeJson<{ items: Array<{ roleKey: string }> }>(harness.app, {
        method: "GET",
        path: "/v1/root-roles",
        headers: {
          host: "admin.example.test",
          ...(cookies.headerValue() ? { cookie: cookies.headerValue() } : {}),
        },
      });
      expect(rootRolesWithCookie.status).toBe(200);
      expect(rootRolesWithCookie.body.items.map((item) => item.roleKey)).toContain("RootUserAdmin");

      const logout = await invokeJson<{ status: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/browser/logout",
      headers: {
        host: "admin.example.test",
        origin: "http://admin.example.test",
        ...(cookies.headerValue() ? { cookie: cookies.headerValue() } : {}),
      },
      });

      expect(logout.status).toBe(200);
      expect(String(logout.headers["set-cookie"])).toContain("kanbien_root_admin_session=;");

      const postLogout = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/browser/session",
      headers: {
        host: "admin.example.test",
        ...(cookies.headerValue() ? { cookie: cookies.headerValue() } : {}),
      },
      });

      expect(postLogout.status).toBe(401);
      expect(postLogout.body.code).toBe("INVALID_SESSION");
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });

  it("TC-ROOT-ADMIN-SHELL-INT-005 serves the root-admin shell same-origin under /root-admin", async () => {
    const app = createApp() as any;
    const appStack = app._router?.stack ?? [];
    const mountedRootAdminRouter = appStack.find(
      (layer: any) =>
        layer.name === "router" && String(layer.regexp).includes("root-admin"),
    );

    expect(mountedRootAdminRouter).toBeDefined();
    const frontendMarkup = readFileSync("src/frontend/rootAdminShell/index.html", "utf8");
    expect(frontendMarkup).toContain("Root Admin Shell POC");
    expect(frontendMarkup).toContain("Overview");
    expect(frontendMarkup).toContain("Root Users");
    expect(frontendMarkup).toContain("System Root Roles");
    expect(frontendMarkup).toContain("Choose a language");
    expect(frontendMarkup).toContain("Sign Out");
  });

  it("TC-ROOT-ADMIN-SHELL-EDGE-001 and TC-ROOT-ADMIN-SHELL-EDGE-002 expose helper guidance and handle missing browser session cookies cleanly", async () => {
    const frontendMarkup = await import("node:fs").then(({ readFileSync }) =>
      readFileSync("src/frontend/rootAdminShell/index.html", "utf8"),
    );
    const missingSession = await invokeJson<{ code: string }>(
      createRootAuthIntegrationHarness().app,
      {
        method: "GET",
        path: "/v1/root-auth/browser/session",
        headers: {
          host: "admin.example.test",
        },
      },
    );

    expect(frontendMarkup).toContain("/root-admin/helper/download/start-root-auth-signer-helper.ps1");
    expect(frontendMarkup).toContain("/root-admin/helper/download/root-auth-signer-helper.mjs");
    expect(frontendMarkup).toContain("Launch Helper");
    expect(missingSession.status).toBe(401);
    expect(missingSession.body.code).toBe("UNAUTHORIZED");
  });
});
