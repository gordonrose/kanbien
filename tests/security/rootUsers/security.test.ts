import { afterEach, describe, expect, it } from "vitest";
import { env } from "../../../src/config/env";
import { invokeJson } from "../../harness/http";
import {
  createRootAuthIntegrationHarness,
  type RootAuthIntegrationHarness,
  type SeededAuthIdentity,
} from "../../harness/rootAuth/integrationHarness";

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
  message?: string;
}

function snapshotPlatformSecurityConfig() {
  return {
    enabled: env.platformSecurity.enabled,
    authenticatedGeneral: { ...env.platformSecurity.rateLimitPolicies.authenticatedGeneral },
  };
}

const originalPlatformSecurityConfig = snapshotPlatformSecurityConfig();
const mutablePlatformSecurity = env.platformSecurity as {
  enabled: boolean;
  rateLimitPolicies: {
    authenticatedGeneral: { windowSeconds: number; maxAttempts: number };
  };
};

function restorePlatformSecurityConfig() {
  mutablePlatformSecurity.enabled = originalPlatformSecurityConfig.enabled;
  Object.assign(
    mutablePlatformSecurity.rateLimitPolicies.authenticatedGeneral,
    originalPlatformSecurityConfig.authenticatedGeneral,
  );
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
  return sshResponse.body;
}

afterEach(() => {
  restorePlatformSecurityConfig();
});

describe("rootUsers security flows", () => {
  it("TC-ROOT-USERS-SEC-001 rejects missing or invalid authenticated session on protected routes", async () => {
    const harness = createRootAuthIntegrationHarness();
    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    const invalid = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: "Bearer invalid-session",
      },
    });
    expect(invalid.status).toBe(401);
    expect(invalid.body.code).toBe("INVALID_SESSION");
  });

  it("TC-ROOT-USERS-SEC-002 enforces shared authenticated-general throttling on rootUsers routes", async () => {
    mutablePlatformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts = 1;
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const first = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    const throttled = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });

    expect(first.status).toBe(200);
    expect(throttled.status).toBe(429);
    expect(throttled.body).toEqual({
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait and try again.",
    });
  });

  it("TC-ROOT-USERS-SEC-003 and TC-ROOT-USERS-EDGE-002 preserve lifecycle visibility and exact route-param validation rules", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<{ rootUserId: string } & Record<string, unknown>>(harness.app, {
      method: "POST",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
      body: {
        email: "visibility@example.test",
        firstName: "Visible",
      },
    });
    expect(created.status).toBe(201);

    const deleted = await invokeJson<Record<string, unknown>>(harness.app, {
      method: "DELETE",
      path: `/v1/root-users/${created.body.rootUserId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(deleted.status).toBe(200);

    const visibleLookup = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/root-users/${created.body.rootUserId}`,
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(visibleLookup.status).toBe(404);
    expect(visibleLookup.body.code).toBe("ROOT_USER_NOT_FOUND");

    const badParam = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users/not-a-uuid",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(badParam.status).toBe(400);
    expect(badParam.body.code).toBe("INVALID_REQUEST");
  });
});
