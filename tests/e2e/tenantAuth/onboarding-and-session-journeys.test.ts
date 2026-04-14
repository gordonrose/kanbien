import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createTenantAdminRecord,
  issueTenantAdminVerificationToken,
  mountTenantAuthFeature,
} from "../../helpers/tenantAuthHarness";

describe("tenantAuth end-to-end onboarding and session journeys", () => {
  it("JY-TENANT-AUTH-001 covers TC-TENANT-AUTH-INT-001, TC-TENANT-AUTH-INT-002, and TC-TENANT-AUTH-INT-003 through verification redemption, password setup, first login, and single-tenant session read", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "journey-single@example.com",
        normalizedEmail: "journey-single@example.com",
        emailVerificationStatus: "pending",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      {
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      },
    );

    const bootstrap = await invokeJson<{
      status: string;
      tenantAuthOnboarding: {
        authPrincipalId: string;
        bootstrapToken: string;
        passwordSetupRequired: boolean;
      };
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token: verificationToken },
    });
    expect(bootstrap.status).toBe(200);
    expect(bootstrap.body.status).toBe("VERIFIED");
    expect(bootstrap.body.tenantAuthOnboarding.passwordSetupRequired).toBe(true);

    const setup = await invokeJson<{ status: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/password/setup",
      body: {
        bootstrapToken: bootstrap.body.tenantAuthOnboarding.bootstrapToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      },
    });
    expect(setup.status).toBe(200);
    expect(setup.body.status).toBe("PASSWORD_SET");

    const login = await invokeJson<{
      status: string;
      sessionId: string;
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
      availableTenantContexts: Array<{ tenantId: string }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-single@example.com",
        password: "@Password1!",
      },
    });
    expect(login.status).toBe(200);
    expect(login.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(login.body.selectionRequired).toBe(false);
    expect(login.body.activeTenantContext?.tenantId).toBe(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    );
    expect(login.body.availableTenantContexts).toHaveLength(1);

    const session = await invokeJson<{
      status: string;
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
    }>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/session",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
    });
    expect(session.status).toBe(200);
    expect(session.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(session.body.selectionRequired).toBe(false);
    expect(session.body.activeTenantContext?.tenantId).toBe(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    );
  });

  it("JY-TENANT-AUTH-007 covers TC-TENANT-AUTH-INT-005 by revoking the current session and denying follow-up protected requests", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "journey-logout@example.com",
        normalizedEmail: "journey-logout@example.com",
        emailVerificationStatus: "pending",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      {
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      },
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
        email: "journey-logout@example.com",
        password: "@Password1!",
      },
    });

    const logout = await invokeJson<{ status: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/logout",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: {},
    });
    expect(logout.status).toBe(200);
    expect(logout.body.status).toBe("LOGGED_OUT");

    const sessionAfterLogout = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/session",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
    });
    expect(sessionAfterLogout.status).toBe(401);
    expect(sessionAfterLogout.body.code).toBe("INVALID_SESSION");

    const selectionAfterLogout = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" },
    });
    expect(selectionAfterLogout.status).toBe(401);
    expect(selectionAfterLogout.body.code).toBe("INVALID_SESSION");
  });
});
