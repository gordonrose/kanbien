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

interface RootUserResponse {
  rootUserId: string;
  email: string;
}

interface RootUserListResponse {
  items: RootUserResponse[];
  page: number;
  pageSize: number;
}

interface StatusResponse {
  status: string;
}

interface ErrorResponse {
  code: string;
  message?: string;
}

async function loginViaPasswordAndSsh(
  harness: RootAuthIntegrationHarness,
  identity: SeededAuthIdentity,
): Promise<SessionResponse> {
  const passwordResponse = await invokeJson<PasswordStageResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/password",
    body: {
      email: identity.loginEmail,
      password: identity.password,
    },
  });

  expect(passwordResponse.status).toBe(200);
  expect(passwordResponse.body.status).toBe("SSH_CHALLENGE_REQUIRED");

  const sshResponse = await invokeJson<SessionResponse>(harness.app, {
    method: "POST",
    path: "/v1/root-auth/login/ssh",
    body: {
      challengeId: passwordResponse.body.challengeId,
      publicKeyFingerprint: identity.sshKey.fingerprint,
      signature: identity.sshKey.signChallengeText(passwordResponse.body.challengeText),
    },
  });

  expect(sshResponse.status).toBe(200);
  expect(sshResponse.body.status).toBe("AUTHENTICATED");

  return sshResponse.body;
}

describe("rootAuth integration flows", () => {
  it("TC-ROOT-AUTH-INT-001 completes login and unlocks protected root-user routes", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    expect(typeof session.sessionId).toBe("string");

    const rootUserResponse = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });

    expect(rootUserResponse.status).toBe(200);
    expect(rootUserResponse.body.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rootUserId: identity.rootUserId,
          email: identity.loginEmail,
        }),
      ]),
    );
  });

  it("TC-ROOT-AUTH-INT-002 blocks inactive, deleted, and anonymized root users before challenge issuance", async () => {
    for (const rootUserOverride of [
      { rootUserId: "22222222-2222-2222-2222-222222222222", email: "inactive@example.test", status: "inactive" as const },
      { rootUserId: "33333333-3333-3333-3333-333333333333", email: "deleted@example.test", deletedAt: new Date("2026-03-26T00:00:00.000Z") },
      { rootUserId: "44444444-4444-4444-4444-444444444444", email: "anon@example.test", anonymized: true },
    ]) {
      const harness = createRootAuthIntegrationHarness();
      const identity = harness.seedAuthIdentity({ rootUser: rootUserOverride });

      const response = await invokeJson<{ code: string }>(harness.app, { method: "POST", path: "/v1/root-auth/login/password", body: {
        email: identity.loginEmail,
        password: identity.password,
      } });

      expect(response.status).toBe(403);
      expect(response.body.code).toBe("ROOT_USER_SIGN_IN_BLOCKED");
    }
  });

  it("TC-ROOT-AUTH-EDGE-004 fails safely when a principal exists but the linked root user can no longer be resolved", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    harness.deleteSeededRootUser(identity.rootUserId);

    const response = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: identity.loginEmail,
        password: identity.password,
      },
    });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("INVALID_CREDENTIALS");
  });

  it("TC-ROOT-AUTH-INT-003 rejects revoked sessions across rootAuth and rootUsers", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    const sessionId = session.sessionId;

    const revokeResponse = await invokeJson<{ status: "SESSION_REVOKED" }>(harness.app, {
      method: "POST",
      path: `/v1/root-auth/sessions/${sessionId}/revoke`,
      body: {},
      headers: {
        authorization: `Bearer ${sessionId}`,
      },
    });

    expect(revokeResponse.status).toBe(200);
    expect(revokeResponse.body.status).toBe("SESSION_REVOKED");

    const authRouteResponse = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/sessions",
      headers: {
        authorization: `Bearer ${sessionId}`,
      },
    });
    expect(authRouteResponse.status).toBe(401);
    expect(authRouteResponse.body.code).toBe("INVALID_SESSION");

    const rootUsersResponse = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${sessionId}`,
      },
    });
    expect(rootUsersResponse.status).toBe(401);
    expect(rootUsersResponse.body.code).toBe("INVALID_SESSION");
  });

  it("TC-ROOT-AUTH-INT-004 changes a password and revokes other sessions while leaving the current session usable", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const firstSession = await loginViaPasswordAndSsh(harness, identity);
    const secondSession = await loginViaPasswordAndSsh(harness, identity);

    const changeResponse = await invokeJson<StatusResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/password/change",
      body: {
        currentPassword: identity.password,
        newPassword: "ChangedPass1!",
      },
      headers: {
        authorization: `Bearer ${firstSession.sessionId}`,
      },
    });

    expect(changeResponse.status).toBe(200);
    expect(changeResponse.body.status).toBe("PASSWORD_CHANGED");

    const currentSessionResponse = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/sessions",
      headers: {
        authorization: `Bearer ${firstSession.sessionId}`,
      },
    });
    expect(currentSessionResponse.status).toBe(200);

    const otherSessionResponse = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/sessions",
      headers: {
        authorization: `Bearer ${secondSession.sessionId}`,
      },
    });
    expect(otherSessionResponse.status).toBe(401);
    expect(otherSessionResponse.body.code).toBe("INVALID_SESSION");
  });

  it("TC-ROOT-AUTH-INT-005 prevents login with a revoked SSH key", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const activeSession = await loginViaPasswordAndSsh(harness, identity);
    const extraKey = createEd25519KeyMaterial();

    const addKeyResponse = await invokeJson<{
      keyId: string;
      fingerprint: string;
      status: string;
    }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/ssh-keys",
      body: {
        label: "Temporary Login Key",
        publicKey: extraKey.publicKeyOpenSsh,
      },
      headers: {
        authorization: `Bearer ${activeSession.sessionId}`,
      },
    });

    expect(addKeyResponse.status).toBe(201);

    const revokeKeyResponse = await invokeJson<StatusResponse>(harness.app, {
      method: "DELETE",
      path: `/v1/root-auth/ssh-keys/${addKeyResponse.body.keyId}`,
      headers: {
        authorization: `Bearer ${activeSession.sessionId}`,
      },
    });
    expect(revokeKeyResponse.status).toBe(200);
    expect(revokeKeyResponse.body.status).toBe("SSH_KEY_REVOKED");

    const passwordStage = await invokeJson<PasswordStageResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: identity.loginEmail,
        password: identity.password,
      },
    });
    expect(passwordStage.status).toBe(200);

    const sshStage = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/ssh",
      body: {
        challengeId: passwordStage.body.challengeId,
        publicKeyFingerprint: addKeyResponse.body.fingerprint,
        signature: extraKey.signChallengeText(passwordStage.body.challengeText),
      },
    });

    expect(sshStage.status).toBe(401);
    expect(sshStage.body.code).toBe("INVALID_CREDENTIALS");
  });

  it("TC-ROOT-AUTH-INT-006 bootstraps auth artifacts for an existing root user and supports idempotent reruns", async () => {
    const harness = createRootAuthIntegrationHarness();
    const rootUser = harness.seedRootUser({
      rootUserId: "55555555-5555-5555-5555-555555555555",
      email: "bootstrap@example.test",
    });

    const bootstrapped = harness.bootstrapAuthForRootUser({
      rootUserId: rootUser.rootUserId,
      loginEmail: rootUser.email,
      password: "BootstrapPass1!",
    });
    const rerun = harness.bootstrapAuthForRootUser({
      rootUserId: rootUser.rootUserId,
      authPrincipalId: bootstrapped.authPrincipalId,
      loginEmail: rootUser.email,
      password: "BootstrapPass1!",
    });

    expect(rerun.authPrincipalId).toBe(bootstrapped.authPrincipalId);
    expect(harness.getSshKeyIdsForAuthPrincipal(bootstrapped.authPrincipalId)).toHaveLength(1);

    const session = await loginViaPasswordAndSsh(harness, bootstrapped);
    expect(session.rootUserId).toBe(rootUser.rootUserId);
  });

  it("TC-ROOT-AUTH-INT-007 applies shared public-auth throttling and lockdown with audit visibility", async () => {
    const lockdownHarness = createRootAuthIntegrationHarness();
    const identity = lockdownHarness.seedAuthIdentity();
    let lockedResponse: ErrorResponse | null = null;
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
        lockedResponse = response.body;
        break;
      }

      expect(response.status).toBe(401);
      expect(response.body.code).toBe("INVALID_CREDENTIALS");
    }

    expect(lockedResponse?.code).toBe("AUTH_LOCKED_DOWN");
    expect(lockdownHarness.getSecurityAuditEvents().some((event) => event.eventType === "login_password_lockdown_started")).toBe(true);

    const throttledHarness = createRootAuthIntegrationHarness();

    let throttled: ErrorResponse | null = null;
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
        throttled = response.body;
        break;
      }

      expect(response.status).toBe(400);
      expect(response.body.code).toBe("INVALID_REQUEST");
    }

    expect(throttled?.code).toBe("AUTH_THROTTLED");
    expect(throttledHarness.getSecurityAuditEvents().some((event) => event.eventType === "auth_rate_limited")).toBe(true);
  });
});
