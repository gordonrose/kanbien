import { describe, expect, it } from "vitest";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { invokeJson, TestCookieJar } from "../../harness/http";
import { loginViaPasswordAndSsh } from "../../helpers/webAppHierarchyBuilderHarness";

describe("root admin shell audit visibility", () => {
  it("TC-ROOT-ADMIN-SHELL-AUD-001 records browser login through the existing password and SSH-stage audit events", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const cookies = new TestCookieJar();

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
    cookies.absorb(sshStage.headers);

    expect(harness.getAuthAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ eventType: "login_password_stage", eventOutcome: "success" }),
        expect.objectContaining({ eventType: "login_ssh_stage", eventOutcome: "success" }),
      ]),
    );
  });

  it("TC-ROOT-ADMIN-SHELL-AUD-002 records browser logout through the existing root auth logout audit event", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const cookies = new TestCookieJar();
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
    cookies.absorb(sshStage.headers);

    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/root-auth/browser/logout",
      headers: {
        host: "admin.example.test",
        origin: "http://admin.example.test",
        ...(cookies.headerValue() ? { cookie: cookies.headerValue() } : {}),
      },
    });

    expect(harness.getAuthAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ eventType: "session_revoked", eventOutcome: "success" }),
      ]),
    );
  });

  it("TC-ROOT-PATH-AUD-001 keeps denied protected API calls from migrated path entry audit-visible", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    harness.setRootUserCapabilities(identity.rootUserId, ["root-user.read.visible"]);

    const denied = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
        referer: "http://admin.example.test/root-admin/users",
      },
      body: {
        email: "path-denied.root@example.test",
        firstName: "Path",
        lastName: "Denied",
      },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "root_capability_denied",
          eventOutcome: "failure",
          rootUserId: identity.rootUserId,
          authPrincipalId: identity.authPrincipalId,
        }),
      ]),
    );
  });
});
