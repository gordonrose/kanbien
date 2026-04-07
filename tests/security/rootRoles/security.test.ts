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
  details?: unknown;
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

describe("rootRoles security flows", () => {
  it("TC-ROOT-ROLES-SEC-001 rejects missing or invalid authenticated session on protected rootRoles routes", async () => {
    const harness = createRootAuthIntegrationHarness();

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-roles",
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    const invalid = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-roles",
      headers: {
        authorization: "Bearer invalid-session",
      },
    });
    expect(invalid.status).toBe(401);
    expect(invalid.body.code).toBe("INVALID_SESSION");
  });

  it("TC-ROOT-ROLES-SEC-002 enforces current RootUserAdmin allow and deny expectations", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const allowed = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: "/v1/root-roles",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(allowed.status).toBe(200);

    harness.setRootUserCapabilities(identity.rootUserId, ["root-user.read.visible"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-roles",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-ROOT-ROLES-SEC-005 allows role editors to load capability data even when older read-only grants are absent", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    harness.setRootUserCapabilities(identity.rootUserId, [
      "root-role.create",
      "root-role.update",
      "root-role.capability-assignment.update",
    ]);

    const eligible = await invokeJson<{ items: Array<{ capabilityKey: string }> }>(harness.app, {
      method: "GET",
      path: "/v1/root-roles/00000000-0000-0000-0000-000000000001/eligible-authz-capabilities?page=1&pageSize=100",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(eligible.status).toBe(200);
    expect(eligible.body.items.some((item) => item.capabilityKey === "root-role.create")).toBe(true);

    const assigned = await invokeJson<{ items: Array<{ capabilityKey: string }> }>(harness.app, {
      method: "GET",
      path: "/v1/root-roles/00000000-0000-0000-0000-000000000001/capability-assignments?page=1&pageSize=100",
      headers: {
        authorization: `Bearer ${session.sessionId}`,
      },
    });
    expect(assigned.status).toBe(200);
    expect(assigned.body.items.some((item) => item.capabilityKey === "root-role.create")).toBe(true);
  });

  it("TC-ROOT-ROLES-SEC-003 rejects protected role erosion and inactive-role assignment", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const target = harness.seedRootUser({
      rootUserId: "66666666-6666-4666-8666-666666666666",
      email: "security-target@example.test",
      firstName: "Security",
      lastName: "Target",
    });
    const session = await loginViaPasswordAndSsh(harness, identity);

    const protectedDeactivate = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-roles/00000000-0000-0000-0000-000000000001/deactivate",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(protectedDeactivate.status).toBeGreaterThanOrEqual(400);
    expect(protectedDeactivate.status).toBeLessThan(500);
    expect(protectedDeactivate.body.code).not.toBeUndefined();

    const createdRole = await invokeJson<{ rootRoleId: string }>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        roleKey: "RootUserInactive",
        displayName: "Root User Inactive",
        description: "Inactive role",
      },
    });
    expect(createdRole.status).toBe(201);

    const deactivated = await invokeJson<{ rootRoleId: string }>(harness.app, {
      method: "POST",
      path: `/v1/root-roles/${createdRole.body.rootRoleId}/deactivate`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(deactivated.status).toBe(200);

    const inactiveAssignment = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: `/v1/root-users/${target.rootUserId}/root-role-assignments`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        rootRoleId: createdRole.body.rootRoleId,
      },
    });
    expect(inactiveAssignment.status).toBe(409);
    expect(inactiveAssignment.body.code).toBe("ROOT_ROLE_INACTIVE");
  });

  it("TC-ROOT-ROLES-SEC-004 enforces shared authenticated-general throttling on rootRoles routes", async () => {
    mutablePlatformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts = 1;
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const first = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    const throttled = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(first.status).toBe(200);
    expect(throttled.status).toBe(429);
    expect(throttled.body).toEqual({
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait and try again.",
    });
  });

  it("TC-ROOT-ROLES-EDGE-001 rejects malformed or unexpected editable create fields at the request boundary", async () => {
    const harness = createRootAuthIntegrationHarness();
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const emptyField = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        roleKey: "RootUserMalformed",
        displayName: "   ",
        description: "Valid description",
      },
    });
    expect(emptyField.status).toBe(400);
    expect(emptyField.body.code).toBe("INVALID_REQUEST");

    const unexpectedField = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/root-roles",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        roleKey: "RootUserMalformed",
        displayName: "Valid name",
        description: "Valid description",
        createdAt: "2026-03-30T00:00:00.000Z",
      },
    });
    expect(unexpectedField.status).toBe(400);
    expect(unexpectedField.body.code).toBe("INVALID_REQUEST");
  });
});
