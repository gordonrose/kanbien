import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createTenantAdminRecord,
  issueTenantAdminVerificationToken,
  mountTenantAuthFeature,
} from "../../helpers/tenantAuthHarness";

describe("tenantAuth audit visibility", () => {
  it("TC-TENANT-AUTH-AUD-001 keeps successful bootstrap, password setup, login, tenant selection, and logout audit-visible", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "audit-multi@example.com",
        normalizedEmail: "audit-multi@example.com",
        emailVerificationStatus: "pending",
      }),
    );
    mounted.tenantAdminsRepository.records.set(
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        email: "audit-multi@example.com",
        normalizedEmail: "audit-multi@example.com",
        emailVerificationStatus: "verified",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      { tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" },
    );
    const bootstrap = await invokeJson<{ bootstrapToken: string; authPrincipalId: string }>(
      harness.app,
      {
        method: "POST",
        path: "/v1/tenant-auth/principals/bootstrap",
        body: { verificationToken },
      },
    );
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/password/setup",
      body: {
        bootstrapToken: bootstrap.body.bootstrapToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      },
    });
    const login = await invokeJson<{ sessionId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "audit-multi@example.com",
        password: "@Password1!",
      },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/logout",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: {},
    });

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "tenant_auth_principal_bootstrapped",
          eventOutcome: "success",
          authPrincipalId: bootstrap.body.authPrincipalId,
        }),
        expect.objectContaining({
          eventType: "tenant_auth_password_set",
          eventOutcome: "success",
        }),
        expect.objectContaining({
          eventType: "tenant_auth_login",
          eventOutcome: "success",
        }),
        expect.objectContaining({
          eventType: "tenant_auth_tenant_selected",
          eventOutcome: "success",
        }),
        expect.objectContaining({
          eventType: "tenant_auth_logout",
          eventOutcome: "success",
        }),
      ]),
    );
  });

  it("TC-TENANT-AUTH-AUD-002 keeps denied bootstrap and tenant selection attempts audit-visible", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);

    const invalidBootstrap = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/principals/bootstrap",
      body: { verificationToken: "bad-token" },
    });
    expect(invalidBootstrap.status).toBe(401);

    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "audit-denied@example.com",
        normalizedEmail: "audit-denied@example.com",
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
    const login = await invokeJson<{ sessionId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "audit-denied@example.com",
        password: "@Password1!",
      },
    });
    const deniedSelection = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });
    expect(deniedSelection.status).toBe(403);

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "tenant_auth_principal_bootstrapped",
          eventOutcome: "failure",
        }),
        expect.objectContaining({
          eventType: "tenant_auth_tenant_selected",
          eventOutcome: "failure",
        }),
      ]),
    );
  });
});
