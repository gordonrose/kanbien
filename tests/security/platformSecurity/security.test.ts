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
    authAbuse: { ...env.platformSecurity.authAbuse },
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
  authAbuse: {
    failureWindowSeconds: number;
    ipLockdownThreshold: number;
    accountLockdownThreshold: number;
    ipAccountLockdownThreshold: number;
    lockdownDurationSeconds: number;
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
  Object.assign(mutablePlatformSecurity.authAbuse, originalPlatformSecurityConfig.authAbuse);
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

describe("platformSecurity security flows", () => {
  it("TC-PLATFORM-SEC-SEC-001 returns safe 429 JSON shapes without leaking internal rule details", async () => {
    mutablePlatformSecurity.rateLimitPolicies.publicRead.maxAttempts = 1;
    mutablePlatformSecurity.rateLimitPolicies.publicAuth.maxAttempts = 1;
    const healthHarness = createRootAuthIntegrationHarness();

    await invokeJson<{ ok: true }>(healthHarness.app, {
      method: "GET",
      path: "/v1/health",
    });
    const healthLimited = await invokeJson<ErrorResponse>(healthHarness.app, {
      method: "GET",
      path: "/v1/health",
    });

    expect(healthLimited.status).toBe(429);
    expect(healthLimited.body).toEqual({
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait and try again.",
    });
    expect(JSON.stringify(healthLimited.body)).not.toContain("threshold");
    expect(JSON.stringify(healthLimited.body)).not.toContain("signal");

    const throttledHarness = createRootAuthIntegrationHarness();
    await invokeJson<ErrorResponse>(throttledHarness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: "bad-email",
        password: "",
      },
    });
    const throttled = await invokeJson<ErrorResponse>(throttledHarness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: "bad-email",
        password: "",
      },
    });

    expect(throttled.status).toBe(429);
    expect(throttled.body).toEqual({
      code: "AUTH_THROTTLED",
      message: "Too many authentication attempts. Please wait and try again.",
    });
    expect(JSON.stringify(throttled.body)).not.toContain("threshold");
    expect(JSON.stringify(throttled.body)).not.toContain("lockdownDurationSeconds");
  });

  it("TC-PLATFORM-SEC-SEC-002 keys authenticated throttling by IP plus authenticated user", async () => {
    mutablePlatformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts = 1;
    const harness = createRootAuthIntegrationHarness();
    const firstIdentity = harness.seedAuthIdentity();
    const secondIdentity = harness.seedAuthIdentity({
      rootUser: {
        rootUserId: "22222222-2222-2222-2222-222222222222",
        email: "second-root@example.test",
      },
      loginEmail: "second-root@example.test",
      password: "StrongPass2!",
    });

    const firstSession = await loginViaPasswordAndSsh(harness, firstIdentity);
    const secondSession = await loginViaPasswordAndSsh(harness, secondIdentity);

    const firstUserAllowed = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${firstSession.sessionId}`,
      },
    });
    const firstUserThrottled = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${firstSession.sessionId}`,
      },
    });
    const secondUserAllowed = await invokeJson<RootUserListResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
      headers: {
        authorization: `Bearer ${secondSession.sessionId}`,
      },
    });

    expect(firstUserAllowed.status).toBe(200);
    expect(firstUserThrottled.status).toBe(429);
    expect(firstUserThrottled.body.code).toBe("RATE_LIMITED");
    expect(secondUserAllowed.status).toBe(200);
  });

  it("TC-PLATFORM-SEC-SEC-003 applies lockdowns for repeated abusive auth patterns", async () => {
    const passwordHarness = createRootAuthIntegrationHarness();
    const passwordIdentity = passwordHarness.seedAuthIdentity();
    let lockedPasswordResponse: ErrorResponse | null = null;

    for (let index = 0; index < 9; index += 1) {
      const response = await invokeJson<ErrorResponse>(passwordHarness.app, {
        method: "POST",
        path: "/v1/root-auth/login/password",
        body: {
          email: passwordIdentity.loginEmail,
          password: "WrongPass1!",
        },
      });
      if (response.status === 429) {
        lockedPasswordResponse = response.body;
        break;
      }
    }

    expect(lockedPasswordResponse?.code).toBe("AUTH_LOCKED_DOWN");
    expect(passwordHarness.getActiveLockdowns().some((lockdown) => lockdown.signal === "login_password")).toBe(true);

    const sshHarness = createRootAuthIntegrationHarness();
    const sshIdentity = sshHarness.seedAuthIdentity();
    const passwordStage = await invokeJson<PasswordStageResponse>(sshHarness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: sshIdentity.loginEmail,
        password: sshIdentity.password,
      },
    });
    expect(passwordStage.status).toBe(200);

    let lockedSshResponse: ErrorResponse | null = null;
    for (let index = 0; index < 9; index += 1) {
      const response = await invokeJson<ErrorResponse>(sshHarness.app, {
        method: "POST",
        path: "/v1/root-auth/login/ssh",
        body: {
          challengeId: passwordStage.body.challengeId,
          publicKeyFingerprint: sshIdentity.sshKey.fingerprint,
          signature: "not-a-valid-signature",
        },
      });
      if (response.status === 429) {
        lockedSshResponse = response.body;
        break;
      }
      expect(response.status).toBe(401);
      expect(response.body.code).toBe("INVALID_SSH_SIGNATURE");
    }

    expect(lockedSshResponse?.code).toBe("AUTH_LOCKED_DOWN");
    expect(sshHarness.getActiveLockdowns().some((lockdown) => lockdown.signal === "login_ssh")).toBe(true);
  });

  it("TC-PLATFORM-SEC-SEC-004 clears account-scoped auth-failure state while preserving broader IP history", async () => {
    mutablePlatformSecurity.authAbuse.accountLockdownThreshold = 2;
    mutablePlatformSecurity.authAbuse.ipAccountLockdownThreshold = 2;
    mutablePlatformSecurity.authAbuse.ipLockdownThreshold = 3;
    const harness = createRootAuthIntegrationHarness();
    const firstIdentity = harness.seedAuthIdentity();
    const secondIdentity = harness.seedAuthIdentity({
      rootUser: {
        rootUserId: "33333333-3333-3333-3333-333333333333",
        email: "ip-history@example.test",
      },
      loginEmail: "ip-history@example.test",
      password: "StrongPass3!",
    });

    const initialFailure = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: firstIdentity.loginEmail,
        password: "WrongPass1!",
      },
    });
    expect(initialFailure.status).toBe(401);

    await loginViaPasswordAndSsh(harness, firstIdentity);

    const secondIdentityFirstFailure = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: secondIdentity.loginEmail,
        password: "WrongPass1!",
      },
    });
    expect(secondIdentityFirstFailure.status).toBe(401);

    const firstIdentityPostSuccessFailure = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: firstIdentity.loginEmail,
        password: "WrongPass1!",
      },
    });
    expect(firstIdentityPostSuccessFailure.status).toBe(401);

    const ipHistoryLockdown = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: secondIdentity.loginEmail,
        password: "WrongPass1!",
      },
    });

    expect(ipHistoryLockdown.status).toBe(429);
    expect(ipHistoryLockdown.body.code).toBe("AUTH_LOCKED_DOWN");
  });

  it("TC-PLATFORM-SEC-SEC-006 uses the kill switch to disable throttling and lockdown without disabling auth", async () => {
    mutablePlatformSecurity.enabled = false;
    mutablePlatformSecurity.rateLimitPolicies.publicAuth.maxAttempts = 1;
    mutablePlatformSecurity.authAbuse.accountLockdownThreshold = 1;
    const harness = createRootAuthIntegrationHarness({ platformSecurityEnabled: false });
    const identity = harness.seedAuthIdentity();

    const wrongPasswordOne = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: identity.loginEmail,
        password: "WrongPass1!",
      },
    });
    const wrongPasswordTwo = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: identity.loginEmail,
        password: "WrongPass1!",
      },
    });
    const missingBearer = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-users",
    });

    expect(wrongPasswordOne.status).toBe(401);
    expect(wrongPasswordTwo.status).toBe(401);
    expect(wrongPasswordTwo.body.code).toBe("INVALID_CREDENTIALS");
    expect(missingBearer.status).toBe(401);
    expect(missingBearer.body.code).toBe("UNAUTHORIZED");
  });
});
