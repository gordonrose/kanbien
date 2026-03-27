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

interface RootUserListResponse {
  items: Array<{ rootUserId: string; email: string }>;
  page: number;
  pageSize: number;
}

function snapshotPlatformSecurityConfig() {
  return {
    enabled: env.platformSecurity.enabled,
    publicRead: { ...env.platformSecurity.rateLimitPolicies.publicRead },
    publicAuth: { ...env.platformSecurity.rateLimitPolicies.publicAuth },
    authenticatedGeneral: { ...env.platformSecurity.rateLimitPolicies.authenticatedGeneral },
    authenticatedSensitive: { ...env.platformSecurity.rateLimitPolicies.authenticatedSensitive },
  };
}

const originalPlatformSecurityConfig = snapshotPlatformSecurityConfig();
const mutablePlatformSecurity = env.platformSecurity as {
  enabled: boolean;
  rateLimitPolicies: {
    publicRead: { windowSeconds: number; maxAttempts: number };
    publicAuth: { windowSeconds: number; maxAttempts: number };
    authenticatedGeneral: { windowSeconds: number; maxAttempts: number };
    authenticatedSensitive: { windowSeconds: number; maxAttempts: number };
  };
};

function restorePlatformSecurityConfig() {
  mutablePlatformSecurity.enabled = originalPlatformSecurityConfig.enabled;
  Object.assign(mutablePlatformSecurity.rateLimitPolicies.publicRead, originalPlatformSecurityConfig.publicRead);
  Object.assign(mutablePlatformSecurity.rateLimitPolicies.publicAuth, originalPlatformSecurityConfig.publicAuth);
  Object.assign(
    mutablePlatformSecurity.rateLimitPolicies.authenticatedGeneral,
    originalPlatformSecurityConfig.authenticatedGeneral,
  );
  Object.assign(
    mutablePlatformSecurity.rateLimitPolicies.authenticatedSensitive,
    originalPlatformSecurityConfig.authenticatedSensitive,
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

describe("platformSecurity integration flows", () => {
  it("TC-PLATFORM-SEC-INT-001 protects /v1/health with the shared public-read limiter", async () => {
    mutablePlatformSecurity.rateLimitPolicies.publicRead.maxAttempts = 2;
    const harness = createRootAuthIntegrationHarness();

    const first = await invokeJson<{ ok: true }>(harness.app, {
      method: "GET",
      path: "/v1/health",
    });
    const second = await invokeJson<{ ok: true }>(harness.app, {
      method: "GET",
      path: "/v1/health",
    });
    const third = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/health",
    });

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
    expect(third.body.code).toBe("RATE_LIMITED");
  });

  it("TC-PLATFORM-SEC-INT-002 keeps rootUsers auth-protected and applies authenticated-general throttling", async () => {
    mutablePlatformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts = 1;
    const harness = createRootAuthIntegrationHarness();

    const unauthenticated = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
    });

    expect(unauthenticated.status).toBe(401);
    expect(unauthenticated.body.code).toBe("UNAUTHORIZED");

    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    const first = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    const second = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
    expect(second.body.code).toBe("RATE_LIMITED");
  });

  it("TC-PLATFORM-SEC-INT-003 applies shared public-auth throttling and lockdown on rootAuth login routes", async () => {
    mutablePlatformSecurity.rateLimitPolicies.publicAuth.maxAttempts = 2;

    const throttledHarness = createRootAuthIntegrationHarness();
    const throttledAttempts: ErrorResponse[] = [];
    for (let index = 0; index < 3; index += 1) {
      const response = await invokeJson<ErrorResponse>(throttledHarness.app, {
        method: "POST",
        path: "/v1/root-auth/login/password",
        body: {
          email: "bad-email",
          password: "",
        },
      });
      throttledAttempts.push(response.body);
      if (response.status === 429) {
        expect(response.body.code).toBe("AUTH_THROTTLED");
        break;
      }
    }

    expect(throttledAttempts.some((body) => body.code === "AUTH_THROTTLED")).toBe(true);

    restorePlatformSecurityConfig();
    const lockdownHarness = createRootAuthIntegrationHarness();
    const identity = lockdownHarness.seedAuthIdentity();
    let locked: ErrorResponse | null = null;

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
        locked = response.body;
        break;
      }
    }

    expect(locked?.code).toBe("AUTH_LOCKED_DOWN");
    expect(lockdownHarness.getSecurityAuditEvents().some((event) => event.eventType === "auth_rate_limited")).toBe(
      false,
    );
    expect(
      lockdownHarness.getSecurityAuditEvents().some((event) => event.eventType === "login_password_lockdown_started"),
    ).toBe(true);
  });

  it("TC-PLATFORM-SEC-INT-004 applies authenticated-sensitive throttling to protected rootAuth routes", async () => {
    mutablePlatformSecurity.rateLimitPolicies.authenticatedSensitive.maxAttempts = 1;
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const first = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/sessions",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    const second = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-auth/sessions",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });

    expect(first.status).toBe(200);
    expect(second.status).toBe(429);
    expect(second.body.code).toBe("RATE_LIMITED");
  });

  it("TC-PLATFORM-SEC-INT-005 disables shared throttling with the kill switch while leaving auth checks intact", async () => {
    mutablePlatformSecurity.enabled = false;
    mutablePlatformSecurity.rateLimitPolicies.publicRead.maxAttempts = 1;
    mutablePlatformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts = 1;
    const harness = createRootAuthIntegrationHarness({ platformSecurityEnabled: false });

    const firstHealth = await invokeJson<{ ok: true }>(harness.app, {
      method: "GET",
      path: "/v1/health",
    });
    const secondHealth = await invokeJson<{ ok: true }>(harness.app, {
      method: "GET",
      path: "/v1/health",
    });
    const unauthenticatedRootUsers = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
    });

    expect(firstHealth.status).toBe(200);
    expect(secondHealth.status).toBe(200);
    expect(unauthenticatedRootUsers.status).toBe(401);
    expect(unauthenticatedRootUsers.body.code).toBe("UNAUTHORIZED");
  });

  it("TC-PLATFORM-SEC-INT-006 uses distinct route-class policies rather than one uniform limit", async () => {
    mutablePlatformSecurity.rateLimitPolicies.publicRead.maxAttempts = 3;
    mutablePlatformSecurity.rateLimitPolicies.publicAuth.maxAttempts = 1;
    const publicHarness = createRootAuthIntegrationHarness();

    const publicReadResponses = await Promise.all(
      Array.from({ length: 4 }, () =>
        invokeJson<{ ok: true } | ErrorResponse>(publicHarness.app, {
          method: "GET",
          path: "/v1/health",
        }),
      ),
    );
    const publicAuthResponses = await Promise.all(
      Array.from({ length: 2 }, () =>
        invokeJson<ErrorResponse>(publicHarness.app, {
          method: "POST",
          path: "/v1/root-auth/login/password",
          body: {
            email: "bad-email",
            password: "",
          },
        }),
      ),
    );

    restorePlatformSecurityConfig();
    mutablePlatformSecurity.rateLimitPolicies.authenticatedSensitive.maxAttempts = 2;
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);
    const authenticatedSensitiveResponses = await Promise.all(
      Array.from({ length: 3 }, () =>
        invokeJson<{ items: unknown[] } | ErrorResponse>(harness.app, {
          method: "GET",
          path: "/v1/root-auth/sessions",
          headers: {
            authorization: `Bearer ${session.sessionId}`,
          },
        }),
      ),
    );

    expect(publicReadResponses.map((response) => response.status)).toEqual([200, 200, 200, 429]);
    expect(publicAuthResponses.map((response) => response.status)).toEqual([400, 429]);
    expect((publicAuthResponses[1].body as ErrorResponse).code).toBe("AUTH_THROTTLED");
    expect(authenticatedSensitiveResponses.map((response) => response.status)).toEqual([200, 200, 429]);
    expect((authenticatedSensitiveResponses[2].body as ErrorResponse).code).toBe("RATE_LIMITED");
  });
});
