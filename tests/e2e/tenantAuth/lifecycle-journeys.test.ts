import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createTenantAdminRecord,
  issueTenantAdminVerificationToken,
  mountTenantAuthFeature,
} from "../../helpers/tenantAuthHarness";
import { createVisibleTenantsReader } from "../../helpers/tenantAdminsHarness";

describe("tenantAuth end-to-end lifecycle journeys", () => {
  it("JY-TENANT-AUTH-005 rejects login truthfully when the principal has no active tenant access grants", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "journey-no-access@example.com",
        normalizedEmail: "journey-no-access@example.com",
        emailVerificationStatus: "pending",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      { tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" },
    );
    const bootstrap = await invokeJson<{ bootstrapToken: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/principals/bootstrap",
      body: { verificationToken },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/password/setup",
      body: {
        bootstrapToken: bootstrap.body.bootstrapToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      },
    });

    for (const [grantId, grant] of mounted.tenantAuthRepository.accessGrants.entries()) {
      mounted.tenantAuthRepository.accessGrants.set(grantId, {
        ...grant,
        revokedAt: new Date("2026-04-09T12:00:00.000Z"),
      });
    }

    const login = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-no-access@example.com",
        password: "@Password1!",
      },
    });
    expect(login.status).toBe(403);
    expect(login.body.code).toBe("TENANT_AUTH_NO_TENANT_ACCESS");
  });

  it("JY-TENANT-AUTH-009 denies login for a deleted or disabled principal", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "journey-disabled@example.com",
        normalizedEmail: "journey-disabled@example.com",
        emailVerificationStatus: "pending",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      { tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" },
    );
    const bootstrap = await invokeJson<{ bootstrapToken: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/principals/bootstrap",
      body: { verificationToken },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/password/setup",
      body: {
        bootstrapToken: bootstrap.body.bootstrapToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      },
    });

    const principal = [...mounted.tenantAuthRepository.principals.values()].find(
      (item) => item.normalizedLoginEmail === "journey-disabled@example.com",
    );
    if (!principal) {
      throw new Error("Expected disabled-principal test principal to exist");
    }
    mounted.tenantAuthRepository.principals.set(principal.authPrincipalId, {
      ...principal,
      disabledAt: new Date("2026-04-09T12:05:00.000Z"),
    });

    const login = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-disabled@example.com",
        password: "@Password1!",
      },
    });
    expect(login.status).toBe(401);
    expect(login.body.code).toBe("TENANT_AUTH_INVALID_CREDENTIALS");
  });

  it("JY-TENANT-AUTH-010 prevents a deleted or inactive tenant from remaining enterable or selectable", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness, {
      visibleTenantsReader: createVisibleTenantsReader([
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      ]),
    });
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "journey-tenant-lifecycle@example.com",
        normalizedEmail: "journey-tenant-lifecycle@example.com",
        emailVerificationStatus: "pending",
      }),
    );
    mounted.tenantAdminsRepository.records.set(
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        email: "journey-tenant-lifecycle@example.com",
        normalizedEmail: "journey-tenant-lifecycle@example.com",
        emailVerificationStatus: "verified",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      { tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" },
    );
    const bootstrap = await invokeJson<{ bootstrapToken: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/principals/bootstrap",
      body: { verificationToken },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/password/setup",
      body: {
        bootstrapToken: bootstrap.body.bootstrapToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      },
    });

    const login = await invokeJson<{
      status: string;
      selectionRequired: boolean;
      availableTenantContexts: Array<{ tenantId: string }>;
      activeTenantContext: { tenantId: string } | null;
      sessionId: string;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-tenant-lifecycle@example.com",
        password: "@Password1!",
      },
    });
    expect(login.status).toBe(200);
    expect(login.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(login.body.selectionRequired).toBe(false);
    expect(login.body.availableTenantContexts).toHaveLength(1);
    expect(login.body.availableTenantContexts[0]?.tenantId).toBe(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    );
    expect(login.body.activeTenantContext?.tenantId).toBe(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    );

    const deniedSelection = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });
    expect(deniedSelection.status).toBe(403);
    expect(deniedSelection.body.code).toBe("TENANT_AUTH_TENANT_NOT_ACCESSIBLE");
  });
});
