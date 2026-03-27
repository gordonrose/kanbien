import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  createRootAuthIntegrationHarness,
  type RootAuthIntegrationHarness,
  type SeededAuthIdentity,
} from "../../harness/rootAuth/integrationHarness";
import { createEd25519KeyMaterial } from "../../harness/rootAuth/serviceHarness";

interface PasswordStageResponse {
  status: "SSH_CHALLENGE_REQUIRED";
  challengeId: string;
  challengeText: string;
}

interface SessionResponse {
  status: "AUTHENTICATED";
  sessionId: string;
  rootUserId: string;
}

interface ErrorResponse {
  code: string;
}

interface StatusResponse {
  status: string;
}

function findAuthEvents(
  harness: RootAuthIntegrationHarness,
  eventType: string,
) {
  return harness.getAuthAuditEvents().filter((event) => event.eventType === eventType);
}

function findSecurityEvents(
  harness: RootAuthIntegrationHarness,
  eventType: string,
) {
  return harness.getSecurityAuditEvents().filter((event) => event.eventType === eventType);
}

async function startPasswordStage(
  harness: RootAuthIntegrationHarness,
  identity: SeededAuthIdentity,
  overrides?: { email?: string; password?: string },
) {
  return invokeJson<PasswordStageResponse | ErrorResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/password",
    body: {
      email: overrides?.email ?? identity.loginEmail,
      password: overrides?.password ?? identity.password,
    },
  });
}

async function completeSshStage(
  harness: RootAuthIntegrationHarness,
  body: {
    challengeId: string;
    publicKeyFingerprint: string;
    signature: string;
  },
) {
  return invokeJson<SessionResponse | ErrorResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/ssh",
    body,
  });
}

async function loginViaPasswordAndSsh(
  harness: RootAuthIntegrationHarness,
  identity: SeededAuthIdentity,
) {
  const passwordStage = await startPasswordStage(harness, identity);
  expect(passwordStage.status).toBe(200);

  const challenge = passwordStage.body as PasswordStageResponse;
  const sshStage = await completeSshStage(harness, {
    challengeId: challenge.challengeId,
    publicKeyFingerprint: identity.sshKey.fingerprint,
    signature: identity.sshKey.signChallengeText(challenge.challengeText),
  });

  expect(sshStage.status).toBe(200);
  return sshStage.body as SessionResponse;
}

describe("rootAuth audit visibility", () => {
  it("TC-ROOT-AUTH-AUD-001 writes a structured audit event for auth principal creation", async () => {
    const harness = createRootAuthIntegrationHarness();
    const actor = harness.seedAuthIdentity();
    const actorSession = await loginViaPasswordAndSsh(harness, actor);
    const targetRootUser = harness.seedRootUser({
      rootUserId: "12121212-1212-4212-8212-121212121212",
      email: "new-root@example.test",
      firstName: "New",
      lastName: "Root",
    });

    const createPrincipal = await invokeJson<{
      authPrincipalId: string;
      rootUserId: string;
      loginEmail: string;
    }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/principals",
      body: {
        rootUserId: targetRootUser.rootUserId,
        loginEmail: targetRootUser.email,
        password: "NewRootPass1!",
      },
      headers: {
        authorization: `Bearer ${actorSession.sessionId}`,
      },
    });

    expect(createPrincipal.status).toBe(201);

    const events = findAuthEvents(harness, "auth_principal_created");
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      authPrincipalId: createPrincipal.body.authPrincipalId,
      rootUserId: targetRootUser.rootUserId,
      eventType: "auth_principal_created",
      eventOutcome: "success",
      ipAddress: "127.0.0.1",
    });
  });

  it("TC-ROOT-AUTH-AUD-002 writes audit events for password-stage success and failure", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();

    const failedPassword = await startPasswordStage(harness, identity, {
      password: "WrongPass1!",
    });
    expect(failedPassword.status).toBe(401);

    const successfulPassword = await startPasswordStage(harness, identity);
    expect(successfulPassword.status).toBe(200);

    const events = findAuthEvents(harness, "login_password_stage");
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authPrincipalId: identity.authPrincipalId,
          rootUserId: identity.rootUserId,
          eventType: "login_password_stage",
          eventOutcome: "failure",
        }),
        expect.objectContaining({
          authPrincipalId: identity.authPrincipalId,
          rootUserId: identity.rootUserId,
          eventType: "login_password_stage",
          eventOutcome: "success",
        }),
      ]),
    );
  });

  it("TC-ROOT-AUTH-AUD-003 writes audit events for SSH-stage success and failure", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();

    const failedPasswordStage = await startPasswordStage(harness, identity);
    expect(failedPasswordStage.status).toBe(200);
    const failedChallenge = failedPasswordStage.body as PasswordStageResponse;

    const failedSsh = await completeSshStage(harness, {
      challengeId: failedChallenge.challengeId,
      publicKeyFingerprint: identity.sshKey.fingerprint,
      signature: "not-a-valid-signature",
    });
    expect(failedSsh.status).toBe(401);

    const successfulPasswordStage = await startPasswordStage(harness, identity);
    expect(successfulPasswordStage.status).toBe(200);
    const successChallenge = successfulPasswordStage.body as PasswordStageResponse;

    const successfulSsh = await completeSshStage(harness, {
      challengeId: successChallenge.challengeId,
      publicKeyFingerprint: identity.sshKey.fingerprint,
      signature: identity.sshKey.signChallengeText(successChallenge.challengeText),
    });
    expect(successfulSsh.status).toBe(200);

    const events = findAuthEvents(harness, "login_ssh_stage");
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authPrincipalId: identity.authPrincipalId,
          rootUserId: identity.rootUserId,
          eventType: "login_ssh_stage",
          eventOutcome: "failure",
        }),
        expect.objectContaining({
          authPrincipalId: identity.authPrincipalId,
          rootUserId: identity.rootUserId,
          eventType: "login_ssh_stage",
          eventOutcome: "success",
        }),
      ]),
    );
  });

  it("TC-ROOT-AUTH-AUD-004 writes audit events for password change success and rejection", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const rejectedChange = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/password/change",
      body: {
        currentPassword: "WrongPass1!",
        newPassword: "ChangedPass1!",
      },
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(rejectedChange.status).toBe(401);

    const successfulChange = await invokeJson<StatusResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/password/change",
      body: {
        currentPassword: identity.password,
        newPassword: "ChangedPass1!",
      },
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(successfulChange.status).toBe(200);

    expect(findAuthEvents(harness, "password_change_rejected")).toEqual([
      expect.objectContaining({
        authPrincipalId: identity.authPrincipalId,
        rootUserId: identity.rootUserId,
        eventType: "password_change_rejected",
        eventOutcome: "failure",
      }),
    ]);
    expect(findAuthEvents(harness, "password_changed")).toEqual([
      expect.objectContaining({
        authPrincipalId: identity.authPrincipalId,
        rootUserId: identity.rootUserId,
        eventType: "password_changed",
        eventOutcome: "success",
      }),
    ]);
  });

  it("TC-ROOT-AUTH-AUD-005 writes audit events for SSH key add and revoke", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    const key = createEd25519KeyMaterial();

    const addKey = await invokeJson<{ keyId: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/ssh-keys",
      body: {
        label: "Audit Key",
        publicKey: key.publicKeyOpenSsh,
      },
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(addKey.status).toBe(201);

    const revokeKey = await invokeJson<StatusResponse>(harness.app, {
      method: "DELETE",
      path: `/v1/root-auth/ssh-keys/${addKey.body.keyId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(revokeKey.status).toBe(200);

    expect(findAuthEvents(harness, "ssh_key_added")).toEqual([
      expect.objectContaining({
        authPrincipalId: identity.authPrincipalId,
        rootUserId: identity.rootUserId,
        eventType: "ssh_key_added",
        eventOutcome: "success",
      }),
    ]);
    expect(findAuthEvents(harness, "ssh_key_revoked")).toEqual([
      expect.objectContaining({
        authPrincipalId: identity.authPrincipalId,
        rootUserId: identity.rootUserId,
        eventType: "ssh_key_revoked",
        eventOutcome: "success",
      }),
    ]);
  });

  it("TC-ROOT-AUTH-AUD-006 writes audit events for logout and explicit session revoke", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const firstSession = await loginViaPasswordAndSsh(harness, identity);
    const secondSession = await loginViaPasswordAndSsh(harness, identity);

    const revokeOther = await invokeJson<StatusResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-auth/sessions/${secondSession.sessionId}/revoke`,
      body: {},
      headers: {
        authorization: `Bearer ${firstSession.sessionId}`,
      },
    });
    expect(revokeOther.status).toBe(200);

    const logout = await invokeJson<StatusResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/logout",
      body: {},
      headers: {
        authorization: `Bearer ${firstSession.sessionId}`,
      },
    });
    expect(logout.status).toBe(200);

    const events = findAuthEvents(harness, "session_revoked");
    expect(events).toHaveLength(2);
    for (const event of events) {
      expect(event).toMatchObject({
        authPrincipalId: identity.authPrincipalId,
        rootUserId: identity.rootUserId,
        eventType: "session_revoked",
        eventOutcome: "success",
      });
    }
  });

  it("TC-ROOT-AUTH-AUD-007 writes visible security events for throttling and lockdown", async () => {
    const lockdownHarness = createRootAuthIntegrationHarness();
    const identity = lockdownHarness.seedAuthIdentity();

    for (let index = 0; index < 9; index += 1) {
      const response = await invokeJson<ErrorResponse>(lockdownHarness.app, {
        method: "POST",
        path: "/v1/root-auth/login/password",
        body: {
          email: identity.loginEmail,
          password: "WrongPass1!",
        },
      });

      if (response.status === 429) {
        break;
      }
    }

    const throttledHarness = createRootAuthIntegrationHarness();
    for (let index = 0; index < 16; index += 1) {
      const response = await invokeJson<ErrorResponse>(throttledHarness.app, {
        method: "POST",
        path: "/v1/root-auth/login/password",
        body: {
          email: "not-an-email",
          password: "",
        },
      });

      if (response.status === 429) {
        break;
      }
    }

    expect(findSecurityEvents(lockdownHarness, "login_password_lockdown_started")).toEqual([
      expect.objectContaining({
        eventType: "login_password_lockdown_started",
        eventOutcome: "failure",
      }),
    ]);
    expect(findSecurityEvents(throttledHarness, "auth_rate_limited")).toEqual([
      expect.objectContaining({
        eventType: "auth_rate_limited",
        eventOutcome: "failure",
      }),
    ]);
  });
});
