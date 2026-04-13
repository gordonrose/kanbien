import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { loginViaPasswordAndSsh } from "../../helpers/tenantsHarness";
import { mountTenantConfigurationFeature } from "../../helpers/tenantConfigurationHarness";
import { mountTenantAuthFeature } from "../../helpers/tenantAuthHarness";

describe("tenantConfiguration security", () => {
  it("TC-TENANT-AUTH-POLICY-SEC-001 denies root policy update when the authenticated root actor lacks the required capability and keeps the denial audit-visible", async () => {
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
    expect(response.body.code).toBe("FORBIDDEN");
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

  it("TC-TENANT-AUTH-POLICY-SEC-001 denies unauthenticated current-tenant policy reads and invalid remediation-session access", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mountedConfig = mountTenantConfigurationFeature(harness.app, harness);
    mountTenantAuthFeature(harness.app, harness, {
      policyResolver: mountedConfig.policyResolver,
    });

    const tenantRead = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/tenant/auth-policy",
    });
    expect(tenantRead.status).toBe(401);
    expect(tenantRead.body.code).toBe("UNAUTHORIZED");

    const remediation = await invokeJson<{ code: string }>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/remediation",
      headers: { authorization: "Bearer not-a-real-session" },
    });
    expect(remediation.status).toBe(401);
    expect(remediation.body.code).toBe("INVALID_SESSION");
  });
});
