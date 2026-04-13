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

describe("tenantAuthPolicy E2E", () => {
  it("TC-TENANT-AUTH-POLICY-E2E-001 and JY-TENANT-AUTH-POLICY-001 root policy change forces remediation after a successful login and the session unblocks after password remediation", async () => {
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
        email: "journey-policy@example.com",
        normalizedEmail: "journey-policy@example.com",
        emailVerificationStatus: "pending",
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
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/auth-policy",
      headers: { authorization: `Bearer ${rootSession.sessionId}` },
      body: { minLength: 16, minUppercase: 2, minNumbers: 2 },
    });

    const login = await invokeJson<{
      sessionId: string;
      remediationRequired: boolean;
      remediationReason: string | null;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-policy@example.com",
        password: "@Password1!LongEnough",
      },
    });
    expect(login.status).toBe(200);
    expect(login.body.remediationRequired).toBe(true);
    expect(login.body.remediationReason).toBe("password_policy_upgrade_required");

    const remediation = await invokeJson<{
      status: string;
      remediationRequired: boolean;
      passwordPolicyRequirements: { minLength: number; minUppercase: number; minNumbers: number };
    }>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/remediation",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
    });
    expect(remediation.status).toBe(200);
    expect(remediation.body.status).toBe("REMEDIATION_REQUIRED");
    expect(remediation.body.passwordPolicyRequirements).toMatchObject({
      minLength: 16,
      minUppercase: 2,
      minNumbers: 2,
    });

    const completed = await invokeJson<{
      remediationRequired: boolean;
      remediationReason: string | null;
      activeTenantContext: { tenantId: string } | null;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/remediation/password",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: {
        newPassword: "@Password12!LongEnoughA",
        repeatPassword: "@Password12!LongEnoughA",
      },
    });
    expect(completed.status).toBe(200);
    expect(completed.body.remediationRequired).toBe(false);
    expect(completed.body.remediationReason).toBeNull();
    expect(completed.body.activeTenantContext?.tenantId).toBe(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    );
  });
});
