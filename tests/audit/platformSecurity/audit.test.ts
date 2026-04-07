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

interface ErrorResponse {
  code: string;
}

function snapshotPlatformSecurityConfig() {
  return {
    enabled: env.platformSecurity.enabled,
    publicAuth: { ...env.platformSecurity.rateLimitPolicies.publicAuth },
    authAbuse: { ...env.platformSecurity.authAbuse },
  };
}

const originalPlatformSecurityConfig = snapshotPlatformSecurityConfig();
const mutablePlatformSecurity = env.platformSecurity as {
  enabled: boolean;
  rateLimitPolicies: {
    publicAuth: { windowSeconds: number; maxAttempts: number };
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
  Object.assign(mutablePlatformSecurity.rateLimitPolicies.publicAuth, originalPlatformSecurityConfig.publicAuth);
  Object.assign(mutablePlatformSecurity.authAbuse, originalPlatformSecurityConfig.authAbuse);
}

function findSecurityEvents(
  harness: RootAuthIntegrationHarness,
  eventType: string,
) {
  return harness.getSecurityAuditEvents().filter((event) => event.eventType === eventType);
}

afterEach(() => {
  restorePlatformSecurityConfig();
});

describe("platformSecurity audit visibility", () => {
  it("TC-PLATFORM-SEC-AUD-001 writes raw audit-visible events for public-auth threshold breaches", async () => {
    mutablePlatformSecurity.rateLimitPolicies.publicAuth.maxAttempts = 1;
    const harness = createRootAuthIntegrationHarness();

    await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: "bad-email",
        password: "",
      },
    });
    const throttled = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: "bad-email",
        password: "",
      },
    });

    expect(throttled.status).toBe(429);
    expect(findSecurityEvents(harness, "auth_rate_limited")).toEqual([
      expect.objectContaining({
        eventType: "auth_rate_limited",
        eventOutcome: "failure",
        ipAddress: "127.0.0.1",
        userAgent: undefined,
      }),
    ]);
  });

  it("TC-PLATFORM-SEC-AUD-002 writes raw lockdown-start events for repeated password-stage abuse", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();

    for (let index = 0; index < 9; index += 1) {
      const response = await invokeJson<ErrorResponse>(harness.app, {
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

    expect(findSecurityEvents(harness, "login_password_lockdown_started")).toEqual([
      expect.objectContaining({
        authPrincipalId: identity.authPrincipalId,
        rootUserId: identity.rootUserId,
        eventType: "login_password_lockdown_started",
        eventOutcome: "failure",
        ipAddress: "127.0.0.1",
      }),
    ]);
  });

  it("TC-PLATFORM-SEC-AUD-003 writes raw lockdown-start events for repeated SSH-stage abuse", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const passwordStage = await invokeJson<PasswordStageResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: identity.loginEmail,
        password: identity.password,
      },
    });

    expect(passwordStage.status).toBe(200);

    for (let index = 0; index < 9; index += 1) {
      const response = await invokeJson<ErrorResponse>(harness.app, {
        method: "POST",
        path: "/v1/root-auth/login/ssh",
        body: {
          challengeId: passwordStage.body.challengeId,
          publicKeyFingerprint: identity.sshKey.fingerprint,
          signature: "not-a-valid-signature",
        },
      });

      if (response.status === 429) {
        break;
      }
    }

    expect(findSecurityEvents(harness, "login_ssh_lockdown_started")).toEqual([
      expect.objectContaining({
        authPrincipalId: identity.authPrincipalId,
        rootUserId: identity.rootUserId,
        eventType: "login_ssh_lockdown_started",
        eventOutcome: "failure",
        ipAddress: "127.0.0.1",
      }),
    ]);
  });

  it("TC-PLATFORM-SEC-AUD-004 includes required metadata on durable security events where applicable", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();

    for (let index = 0; index < 9; index += 1) {
      const response = await invokeJson<ErrorResponse>(harness.app, {
        method: "POST",
        path: "/v1/root-auth/login/password",
        body: {
          email: identity.loginEmail,
          password: "WrongPass1!",
        },
        headers: {
          "user-agent": "platform-security-audit-test",
        },
      });

      if (response.status === 429) {
        break;
      }
    }

    const [event] = findSecurityEvents(harness, "login_password_lockdown_started");
    expect(event).toBeDefined();
    expect(event).toMatchObject({
      authPrincipalId: identity.authPrincipalId,
      rootUserId: identity.rootUserId,
      eventType: "login_password_lockdown_started",
      eventOutcome: "failure",
      ipAddress: "127.0.0.1",
      userAgent: "platform-security-audit-test",
    });
    expect(event?.occurredAt).toBeInstanceOf(Date);
  });

  it("TC-PLATFORM-SEC-AUD-006 writes summarized suspicious-pattern events when password and SSH thresholds are crossed", async () => {
    mutablePlatformSecurity.authAbuse.ipLockdownThreshold = 2;
    mutablePlatformSecurity.authAbuse.accountLockdownThreshold = 2;
    mutablePlatformSecurity.authAbuse.ipAccountLockdownThreshold = 2;
    const passwordHarness = createRootAuthIntegrationHarness();
    const passwordIdentity = passwordHarness.seedAuthIdentity();

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
        break;
      }
    }

    expect(findSecurityEvents(passwordHarness, "password_failures_detected").length).toBeGreaterThan(0);
    expect(findSecurityEvents(passwordHarness, "ip_suspicious_auth_pattern_detected").length).toBeGreaterThan(0);
    expect(findSecurityEvents(passwordHarness, "account_suspicious_auth_pattern_detected").length).toBeGreaterThan(0);

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
        break;
      }
    }

    expect(findSecurityEvents(sshHarness, "ssh_failures_detected").length).toBeGreaterThan(0);
    expect(findSecurityEvents(sshHarness, "ip_suspicious_auth_pattern_detected").length).toBeGreaterThan(0);
    expect(findSecurityEvents(sshHarness, "account_suspicious_auth_pattern_detected").length).toBeGreaterThan(0);
  });

  it("TC-PLATFORM-SEC-AUD-007 records clear-on-success events for login abuse state where the current platform clears that state", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();

    const failedPassword = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: identity.loginEmail,
        password: "WrongPass1!",
      },
      headers: {
        "user-agent": "platform-security-clear-test",
      },
    });
    expect(failedPassword.status).toBe(401);

    const passwordStage = await invokeJson<PasswordStageResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/password",
      body: {
        email: identity.loginEmail,
        password: identity.password,
      },
      headers: {
        "user-agent": "platform-security-clear-test",
      },
    });
    expect(passwordStage.status).toBe(200);

    const sshStage = await invokeJson<{ sessionId: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-auth/login/ssh",
      body: {
        challengeId: passwordStage.body.challengeId,
        publicKeyFingerprint: identity.sshKey.fingerprint,
        signature: identity.sshKey.signChallengeText(passwordStage.body.challengeText),
      },
      headers: {
        "user-agent": "platform-security-clear-test",
      },
    });
    expect(sshStage.status).toBe(200);

    expect(findSecurityEvents(harness, "login_failure_state_cleared")).toEqual([
      expect.objectContaining({
        authPrincipalId: identity.authPrincipalId,
        rootUserId: identity.rootUserId,
        eventType: "login_failure_state_cleared",
        eventOutcome: "success",
        ipAddress: "127.0.0.1",
        userAgent: "platform-security-clear-test",
      }),
    ]);
  });
});
