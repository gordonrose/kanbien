import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";
import { mountTenantConfigurationFeature } from "../../helpers/tenantConfigurationHarness";
import {
  createTenantAdminRecord,
  issueTenantAdminVerificationToken,
  mountTenantAuthFeature,
} from "../../helpers/tenantAuthHarness";

describe("tenantConfiguration audit visibility", () => {
  it("TC-TENANT-AUTH-POLICY-AUD-001 keeps successful root policy updates and remediation completion audit-visible", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mountedConfig = mountTenantConfigurationFeature(harness.app, harness);
    const mountedAuth = mountTenantAuthFeature(harness.app, harness, {
      policyResolver: mountedConfig.policyResolver,
    });

    const identity = harness.seedAuthIdentity();
    const rootSession = await loginViaPasswordAndSsh(harness, identity);

    mountedAuth.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "audit-policy@example.com",
        normalizedEmail: "audit-policy@example.com",
        emailVerificationStatus: "pending",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mountedAuth.tenantAdminsRepository,
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
        newPassword: "@Password1!LongEnough",
        repeatPassword: "@Password1!LongEnough",
      },
    });

    const updated = await invokeJson<{ passwordPolicy: { minLength: number } }>(harness.app, {
      method: "PATCH",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/auth-policy",
      headers: { authorization: `Bearer ${rootSession.sessionId}` },
      body: { minLength: 16, minUppercase: 2, minNumbers: 2 },
    });
    expect(updated.status).toBe(200);

    const login = await invokeJson<{ sessionId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "audit-policy@example.com",
        password: "@Password1!LongEnough",
      },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/remediation/password",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: {
        newPassword: "@Password12!LongEnoughA",
        repeatPassword: "@Password12!LongEnoughA",
      },
    });

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "tenant_auth_policy_updated",
          eventOutcome: "success",
          rootUserId: identity.rootUserId,
        }),
        expect.objectContaining({
          eventType: "tenant_auth_password_remediation_completed",
          eventOutcome: "success",
        }),
      ]),
    );
  });

  it("TC-TENANT-AUTH-POLICY-AUD-001 keeps denied privileged policy updates audit-visible through the root capability-denied surface", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantConfigurationFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    harness.setRootUserCapabilities(identity.rootUserId, []);
    const session = await loginViaPasswordAndSsh(harness, identity);

    const response = await invokeJson<{ code: string }>(harness.app, {
      method: "PATCH",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/auth-policy",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { minLength: 14 },
    });
    expect(response.status).toBe(403);

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "root_capability_denied",
          eventOutcome: "failure",
          rootUserId: identity.rootUserId,
        }),
      ]),
    );
  });
});
