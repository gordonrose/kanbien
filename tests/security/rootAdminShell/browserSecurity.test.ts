import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  getRootAdminSessionClearCookieOptions,
  getRootAdminSessionCookieOptions,
} from "../../../src/lib/auth/rootAdminCookie";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { invokeJson } from "../../harness/http";

describe("root admin shell browser security", () => {
  it("TC-ROOT-ADMIN-SHELL-SEC-001 uses strict browser cookie settings and would mark the cookie secure in production", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const passwordStage = await invokeJson<{ challengeId: string; challengeText: string }>(
      harness.app,
      {
        method: "POST",
        path: "/v1/root-auth/login/password",
        headers: { host: "admin.example.test" },
        body: { email: identity.loginEmail, password: identity.password },
      },
    );
    const sshStage = await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/root-auth/browser/login/ssh",
      headers: { host: "admin.example.test" },
      body: {
        challengeId: passwordStage.body.challengeId,
        signature: identity.sshKey.signChallengeText(passwordStage.body.challengeText),
        publicKeyFingerprint: identity.sshKey.fingerprint,
      },
    });

    expect(String(sshStage.headers["set-cookie"])).toContain("HttpOnly");
    expect(String(sshStage.headers["set-cookie"])).toContain("SameSite=Strict");
    expect(getRootAdminSessionCookieOptions("production").secure).toBe(true);
    expect(getRootAdminSessionClearCookieOptions("production").secure).toBe(true);
  });

  it("TC-ROOT-ADMIN-SHELL-SEC-002 rejects browser logout from missing or untrusted origins", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const passwordStage = await invokeJson<{ challengeId: string; challengeText: string }>(
      harness.app,
      {
        method: "POST",
        path: "/v1/root-auth/login/password",
        headers: { host: "admin.example.test" },
        body: { email: identity.loginEmail, password: identity.password },
      },
    );
    const sshStage = await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/root-auth/browser/login/ssh",
      headers: { host: "admin.example.test" },
      body: {
        challengeId: passwordStage.body.challengeId,
        signature: identity.sshKey.signChallengeText(passwordStage.body.challengeText),
        publicKeyFingerprint: identity.sshKey.fingerprint,
      },
    });
    const cookieHeader = Array.isArray(sshStage.headers["set-cookie"])
      ? sshStage.headers["set-cookie"]
          .map((entry) => entry.split(";")[0])
          .join("; ")
      : String(sshStage.headers["set-cookie"] ?? "").split(";")[0];

    const missingOrigin = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/browser/logout",
      headers: {
        host: "admin.example.test",
        cookie: cookieHeader,
      },
    });
    const untrustedOrigin = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/browser/logout",
      headers: {
        host: "admin.example.test",
        cookie: cookieHeader,
        origin: "http://evil.example.test",
      },
    });

    expect(missingOrigin.status).toBe(403);
    expect(missingOrigin.body.code).toBe("BROWSER_ORIGIN_REQUIRED");
    expect(untrustedOrigin.status).toBe(403);
    expect(untrustedOrigin.body.code).toBe("UNTRUSTED_BROWSER_ORIGIN");
  });

  it("TC-ROOT-ADMIN-SHELL-SEC-003 sets a least-privilege CSP that only allows self and the fixed localhost helper target", async () => {
    const appSource = readFileSync(resolve(process.cwd(), "src/app.ts"), "utf8");

    expect(appSource).toContain("defaultSrc: [\"'self'\"]");
    expect(appSource).toContain("scriptSrc: [\"'self'\"]");
    expect(appSource).toContain("http://127.0.0.1:${env.rootAdmin.signerHelperPort}");
  });

  it("TC-ROOT-ADMIN-SHELL-SEC-004 does not depend on browser-managed raw bearer token storage", () => {
    const appSource = readFileSync(
      resolve(process.cwd(), "src/frontend/rootAdminShell/assets/app.mjs"),
      "utf8",
    );

    expect(appSource).not.toContain("localStorage");
    expect(appSource).not.toContain("sessionStorage");
    expect(appSource).not.toContain("Authorization");
  });

  it("TC-ROOT-PATH-SEC-001 keeps migrated path entry behind protected backend session enforcement", async () => {
    const harness = createRootAuthIntegrationHarness();

    const unauthenticated = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        referer: "http://admin.example.test/root-admin/users",
      },
    });
    const invalidSession = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: "Bearer expired-or-unknown-session",
        referer: "http://admin.example.test/root-admin/users",
      },
    });

    expect(unauthenticated.status).toBe(401);
    expect(unauthenticated.body.code).toBe("UNAUTHORIZED");
    expect(invalidSession.status).toBe(401);
    expect(invalidSession.body.code).toBe("INVALID_SESSION");
  });

  it("TC-ROOT-PATH-SEC-002 treats legacy aliases as navigation compatibility, not backend authority", async () => {
    const harness = createRootAuthIntegrationHarness();

    const legacyAliasReferer = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        referer: "http://admin.example.test/root-admin#users",
      },
    });
    const unsupportedAliasReferer = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        referer: "http://admin.example.test/root-admin#unsupported-alias",
      },
    });

    expect(legacyAliasReferer.status).toBe(401);
    expect(legacyAliasReferer.body.code).toBe("UNAUTHORIZED");
    expect(unsupportedAliasReferer.status).toBe(401);
    expect(unsupportedAliasReferer.body.code).toBe("UNAUTHORIZED");
  });
});
