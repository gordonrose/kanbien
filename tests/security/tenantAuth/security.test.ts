import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createTenantAdminRecord,
  issueTenantAdminVerificationToken,
  mountTenantAuthFeature,
} from "../../helpers/tenantAuthHarness";

interface ErrorResponse {
  code: string;
  message: string;
  details?: { field?: string; reason?: string };
}

describe("tenantAuth security", () => {
  it("TC-TENANT-AUTH-SEC-001 denies invalid verification redemption proof", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantAuthFeature(harness.app, harness);

    const response = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token: "bad-token" },
    });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("TENANT_ADMIN_VERIFICATION_TOKEN_INVALID");
  });

  it("TC-TENANT-AUTH-SEC-002 denies unauthenticated session reads", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantAuthFeature(harness.app, harness);

    const response = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/session",
    });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("UNAUTHORIZED");
  });

  it("TC-TENANT-AUTH-SEC-002 denies tenant selections outside the principal's allowed contexts", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "single@example.com",
        normalizedEmail: "single@example.com",
        emailVerificationStatus: "pending",
      }),
    );
    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      { tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" },
    );
    const bootstrap = await invokeJson<{
      tenantAuthOnboarding: { bootstrapToken: string };
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token: verificationToken },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/password/setup",
      body: {
        bootstrapToken: bootstrap.body.tenantAuthOnboarding.bootstrapToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      },
    });
    const login = await invokeJson<{ sessionId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "single@example.com",
        password: "@Password1!",
      },
    });

    const response = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });

    expect(response.status).toBe(403);
    expect(response.body.code).toBe("TENANT_AUTH_TENANT_NOT_ACCESSIBLE");
  });

  it("TC-TENANT-AUTH-SEC-003 keeps tenant auth separate from root-only auth mechanics and protected-route contracts", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantAuthFeature(harness.app, harness);

    const response = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "tenant@example.com",
        password: "@Password1!",
        publicKeyFingerprint: "SHA256:not-used-here",
      },
    });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("INVALID_REQUEST");
    expect(response.body.details?.field).toBe("publicKeyFingerprint");
  });
});
