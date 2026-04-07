import { afterEach, describe, expect, it } from "vitest";
import { env } from "../../../src/config/env";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryTenantsRepository,
  loginViaPasswordAndSsh,
  mountTenantsFeature,
} from "../../helpers/tenantsHarness";

interface ErrorResponse {
  code: string;
  message?: string;
  details?: {
    field?: string;
    reason?: string;
  };
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

afterEach(() => {
  restorePlatformSecurityConfig();
});

describe("tenants security flows", () => {
  it("TC-TENANTS-SEC-001 rejects missing or invalid authenticated session on protected tenant routes", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());

    const missing = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenants",
    });
    expect(missing.status).toBe(401);
    expect(missing.body.code).toBe("UNAUTHORIZED");

    const invalid = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenants",
      headers: {
        authorization: "Bearer invalid-session",
      },
    });
    expect(invalid.status).toBe(401);
    expect(invalid.body.code).toBe("INVALID_SESSION");
  });

  it("TC-TENANTS-SEC-002 enforces per-route tenant capability gates", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const allowed = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(allowed.status).toBe(200);

    harness.setRootUserCapabilities(identity.rootUserId, ["tenant.read"]);

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("FORBIDDEN");
  });

  it("TC-TENANTS-SEC-003 rejects malformed and unexpected create fields without mutating storage", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const invalidCategory = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        bizId: "tenant-invalid",
        name: "Tenant Invalid",
        category: "wrong",
      },
    });
    expect(invalidCategory.status).toBe(400);
    expect(invalidCategory.body.code).toBe("INVALID_REQUEST");

    const unexpectedField = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        bizId: "tenant-invalid",
        name: "Tenant Invalid",
        category: "customer",
        createdByRootAdminUserId: identity.rootUserId,
      },
    });
    expect(unexpectedField.status).toBe(400);
    expect(unexpectedField.body).toMatchObject({
      code: "INVALID_REQUEST",
      details: {
        field: "createdByRootAdminUserId",
        reason: "unexpected_field",
      },
    });
  });

  it("enforces shared authenticated-general throttling on tenant routes", async () => {
    mutablePlatformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts = 1;
    const harness = createRootAuthIntegrationHarness();
    mountTenantsFeature(harness.app, harness, createInMemoryTenantsRepository());
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const first = await invokeJson<{ items: unknown[] }>(harness.app, {
      method: "GET",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    const throttled = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenants",
      headers: { authorization: `Bearer ${session.sessionId}` },
    });

    expect(first.status).toBe(200);
    expect(throttled.status).toBe(429);
    expect(throttled.body).toEqual({
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait and try again.",
    });
  });
});
