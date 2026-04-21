import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createTenantAdminRecord,
  issueTenantAdminVerificationToken,
  mountTenantAuthFeature,
} from "../../helpers/tenantAuthHarness";

describe("tenantAuth end-to-end multi-tenant journeys", () => {
  it("JY-TENANT-AUTH-003 covers TC-TENANT-AUTH-INT-004 by requiring explicit tenant selection for a multi-tenant principal", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "journey-multi@example.com",
        normalizedEmail: "journey-multi@example.com",
        emailVerificationStatus: "pending",
      }),
    );
    mounted.tenantAdminsRepository.records.set(
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        email: "journey-multi@example.com",
        normalizedEmail: "journey-multi@example.com",
        emailVerificationStatus: "verified",
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

    const login = await invokeJson<{
      status: string;
      sessionId: string;
      selectionRequired: boolean;
      activeTenantContext: null;
      availableTenantContexts: Array<{ tenantId: string }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-multi@example.com",
        password: "@Password1!",
      },
    });
    expect(login.status).toBe(200);
    expect(login.body.status).toBe("AUTHENTICATED_SELECTION_REQUIRED");
    expect(login.body.selectionRequired).toBe(true);
    expect(login.body.activeTenantContext).toBeNull();
    expect(login.body.availableTenantContexts.map((item) => item.tenantId)).toEqual([
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    ]);

    const selected = await invokeJson<{
      status: string;
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });
    expect(selected.status).toBe(200);
    expect(selected.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(selected.body.selectionRequired).toBe(false);
    expect(selected.body.activeTenantContext?.tenantId).toBe(
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    );
  });

  it("JY-TENANT-AUTH-004 covers TC-TENANT-AUTH-SEC-002 by denying selection of an inaccessible tenant while keeping the session valid", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "journey-denied@example.com",
        normalizedEmail: "journey-denied@example.com",
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
    const login = await invokeJson<{
      sessionId: string;
      status: string;
      activeTenantContext: { tenantId: string } | null;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-denied@example.com",
        password: "@Password1!",
      },
    });
    expect(login.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");

    const deniedSelection = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });
    expect(deniedSelection.status).toBe(403);
    expect(deniedSelection.body.code).toBe("TENANT_AUTH_TENANT_NOT_ACCESSIBLE");

    const session = await invokeJson<{
      status: string;
      activeTenantContext: { tenantId: string } | null;
    }>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/session",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
    });
    expect(session.status).toBe(200);
    expect(session.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(session.body.activeTenantContext?.tenantId).toBe(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    );
  });
});
