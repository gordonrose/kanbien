import { afterEach, describe, expect, it } from "vitest";
import { env } from "../../../src/config/env";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryTenantAdminsRepository,
  loginViaPasswordAndSsh,
  mountTenantAdminsFeature,
} from "../../helpers/tenantAdminsHarness";

interface ErrorResponse {
  code: string;
  message?: string;
}

function snapshotPlatformSecurityConfig() {
  return {
    enabled: env.platformSecurity.enabled,
    authenticatedSensitive: { ...env.platformSecurity.rateLimitPolicies.authenticatedSensitive },
  };
}

const originalPlatformSecurityConfig = snapshotPlatformSecurityConfig();
const mutablePlatformSecurity = env.platformSecurity as {
  enabled: boolean;
  rateLimitPolicies: {
    authenticatedSensitive: { windowSeconds: number; maxAttempts: number };
  };
};

afterEach(() => {
  mutablePlatformSecurity.enabled = originalPlatformSecurityConfig.enabled;
  Object.assign(
    mutablePlatformSecurity.rateLimitPolicies.authenticatedSensitive,
    originalPlatformSecurityConfig.authenticatedSensitive,
  );
});

describe("tenantAdmins security flows", () => {
  it("TC-TENANT-ADMINS-SEC-001 rejects missing or invalid session across protected tenant-admin routes", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantAdminsFeature(harness.app, harness, {
      repository: createInMemoryTenantAdminsRepository(),
    });

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");
  });

  it("TC-TENANT-ADMINS-SEC-002 denies verification send without the mapped capability", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantAdminsFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<{ tenantAdminId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { email: "limited@example.com" },
    });
    expect(created.status).toBe(201);

    harness.setRootUserCapabilities(identity.rootUserId, ["tenant-admin.read", "tenant-admin.list"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}/verification/send`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-TENANT-ADMINS-SEC-004 rejects malformed public redemption safely", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantAdminsFeature(harness.app, harness);

    const invalid = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token: "bad-token" },
    });
    expect(invalid.status).toBe(400);
    expect(invalid.body.code).toBe("TENANT_ADMIN_VERIFICATION_TOKEN_INVALID");
  });

  it("TC-TENANT-ADMINS-SEC-003 denies cross-tenant exact reads when identifiers are valid", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAdminsFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<{ tenantAdminId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { email: "cross-tenant@example.com" },
    });
    expect(created.status).toBe(201);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: `/v1/tenants/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb/admins/${created.body.tenantAdminId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(denied.status).toBe(404);
    expect(denied.body.code).toBe("TENANT_ADMIN_NOT_FOUND");
    expect(mounted.repository.records.get(created.body.tenantAdminId)).toBeDefined();
  });

  it("enforces authenticated-sensitive throttling on verification send routes", async () => {
    mutablePlatformSecurity.rateLimitPolicies.authenticatedSensitive.maxAttempts = 1;
    const harness = createRootAuthIntegrationHarness();
    mountTenantAdminsFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<{ tenantAdminId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { email: "throttle@example.com" },
    });
    expect(created.status).toBe(201);

    const first = await invokeJson<{ tenantAdminId: string }>(harness.app, {
      method: "POST",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}/verification/send`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    const throttled = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}/verification/resend`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { resendReason: "retry" },
    });

    expect(first.status).toBe(200);
    expect(throttled.status).toBe(429);
    expect(throttled.body.code).toBe("RATE_LIMITED");
  });
});
