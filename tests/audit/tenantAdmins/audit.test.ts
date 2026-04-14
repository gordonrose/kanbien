import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { loginViaPasswordAndSsh, mountTenantAdminsFeature } from "../../helpers/tenantAdminsHarness";

describe("tenantAdmins audit visibility", () => {
  it("TC-TENANT-ADMINS-AUD-001 keeps successful operator lifecycle and verification actions audit-visible", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantAdminsFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<{ tenantAdminId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        email: "audit@example.com",
      },
    });
    expect(created.status).toBe(201);

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "tenant_admin_created",
          eventOutcome: "success",
          rootUserId: identity.rootUserId,
        }),
        expect.objectContaining({
          eventType: "tenant_admin_verification_sent",
          eventOutcome: "success",
          rootUserId: identity.rootUserId,
        }),
      ]),
    );
  });

  it("TC-TENANT-ADMINS-AUD-002 keeps denied privileged actions audit-visible through shared capability middleware", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantAdminsFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    harness.setRootUserCapabilities(identity.rootUserId, ["tenant-admin.read"]);

    const denied = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        email: "denied@example.com",
      },
    });
    expect(denied.status).toBe(403);

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

  it("TC-TENANT-ADMINS-AUD-003 keeps public verification redemption outcomes audit-visible", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAdminsFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<{ tenantAdminId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        email: "audit-redeem@example.com",
      },
    });
    expect(created.status).toBe(201);

    const invalid = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token: "bad-token" },
    });
    expect(invalid.status).toBe(400);

    const match = mounted.provider.sentInputs[0]!.bodyText.match(/token=([^\s]+)/);
    const token = decodeURIComponent(match![1]);
    const redeemed = await invokeJson<{ emailVerificationStatus: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token },
    });
    expect(redeemed.status).toBe(200);

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "tenant_admin_verification_redeemed",
          eventOutcome: "failure",
        }),
        expect.objectContaining({
          eventType: "tenant_admin_verification_redeemed",
          eventOutcome: "success",
        }),
      ]),
    );
  });

  it("keeps successful onboarding restart audit-visible for root operators", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAdminsFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<{ tenantAdminId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        email: "audit-restart@example.com",
      },
    });
    expect(created.status).toBe(201);

    const match = mounted.provider.sentInputs[0]!.bodyText.match(/token=([^\s]+)/);
    const token = decodeURIComponent(match![1]);
    const redeemed = await invokeJson<{ status: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token },
    });
    expect(redeemed.status).toBe(200);

    const restarted = await invokeJson<{ status: string }>(harness.app, {
      method: "POST",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}/onboarding/restart`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(restarted.status).toBe(200);

    expect(harness.getSecurityAuditEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          eventType: "tenant_admin_onboarding_restarted",
          eventOutcome: "success",
          rootUserId: identity.rootUserId,
        }),
      ]),
    );
  });
});
