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

describe("tenantAuthPolicy multi-tenant E2E", () => {
  it("TC-TENANT-AUTH-POLICY-E2E-002 and JY-TENANT-AUTH-POLICY-002 allow tenant selection before remediation guidance is read", async () => {
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
        email: "journey-multi@example.com",
        normalizedEmail: "journey-multi@example.com",
        emailVerificationStatus: "pending",
      }),
    );
    mountedAuth.tenantAdminsRepository.records.set(
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
      mountedAuth.tenantAdminsRepository,
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
        newPassword: "@Password1!LongEnough",
        repeatPassword: "@Password1!LongEnough",
      },
    });

    await invokeJson(harness.app, {
      method: "PATCH",
      path: "/v1/tenants/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb/auth-policy",
      headers: { authorization: `Bearer ${rootSession.sessionId}` },
      body: { minLength: 16, minUppercase: 2, minNumbers: 2 },
    });

    const login = await invokeJson<{
      sessionId: string;
      selectionRequired: boolean;
      remediationRequired: boolean;
      activeTenantContext: null;
      passwordPolicyRequirements: null;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-multi@example.com",
        password: "@Password1!LongEnough",
      },
    });
    expect(login.status).toBe(200);
    expect(login.body.selectionRequired).toBe(true);
    expect(login.body.remediationRequired).toBe(true);
    expect(login.body.activeTenantContext).toBeNull();
    expect(login.body.passwordPolicyRequirements).toBeNull();

    const selected = await invokeJson<{
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
      remediationRequired: boolean;
      remediationReason: string | null;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });
    expect(selected.status).toBe(200);
    expect(selected.body.selectionRequired).toBe(false);
    expect(selected.body.activeTenantContext?.tenantId).toBe(
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    );
    expect(selected.body.remediationRequired).toBe(true);
    expect(selected.body.remediationReason).toBe("password_policy_upgrade_required");

    const remediation = await invokeJson<{
      status: string;
      activeTenantContext: { tenantId: string } | null;
      passwordPolicyRequirements: { minLength: number; minUppercase: number; minNumbers: number };
    }>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/remediation",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
    });
    expect(remediation.status).toBe(200);
    expect(remediation.body.status).toBe("REMEDIATION_REQUIRED");
    expect(remediation.body.activeTenantContext?.tenantId).toBe(
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    );
    expect(remediation.body.passwordPolicyRequirements).toMatchObject({
      minLength: 16,
      minUppercase: 2,
      minNumbers: 2,
    });
  });
});
