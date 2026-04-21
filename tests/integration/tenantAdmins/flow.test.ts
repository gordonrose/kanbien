import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createInMemoryTenantAdminsRepository,
  loginViaPasswordAndSsh,
  mountTenantAdminsFeature,
} from "../../helpers/tenantAdminsHarness";

function extractTokenFromBody(bodyText: string): string {
  const match = bodyText.match(/token=([^\s]+)/);
  if (!match?.[1]) {
    throw new Error("Expected verification token in delivered body");
  }
  return decodeURIComponent(match[1]);
}

interface TenantAdminResponse {
  tenantAdminId: string;
  tenantId: string;
  email: string;
  emailVerificationStatus: "pending" | "verified";
  emailVerifiedAt: string | null;
  lastVerificationEmailRequestedAt: string | null;
  deletedAt: string | null;
}

interface TenantAdminOnboardingRestartResponse {
  status: "ONBOARDING_RESTARTED";
  tenantAdmin: TenantAdminResponse;
  tenantAuthOnboarding: {
    authPrincipalId: string;
    loginEmail: string;
    passwordSetupRequired: boolean;
    bootstrapToken: string | null;
    nextStep: "PASSWORD_SETUP_REQUIRED" | "LOGIN_REQUIRED";
  };
}

describe("tenantAdmins integration flows", () => {
  it("TC-TENANT-ADMINS-INT-001 TC-TENANT-ADMINS-INT-002 and TC-TENANT-ADMINS-EDGE-003 mount protected tenant-admin lifecycle routes under an authenticated root session", async () => {
    const harness = createRootAuthIntegrationHarness();
    mountTenantAdminsFeature(harness.app, harness, {
      repository: createInMemoryTenantAdminsRepository(),
    });
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        email: "Tenant.Admin@example.com",
        firstName: "Tenant",
        lastName: "Admin",
      },
    });
    expect(created.status).toBe(201);
    expect(created.body.email).toBe("tenant.admin@example.com");
    expect(created.body.lastVerificationEmailRequestedAt).not.toBeNull();

    const exact = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "GET",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
    });
    expect(exact.status).toBe(200);
    expect(exact.body.emailVerificationStatus).toBe("pending");

    const updated = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "PATCH",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        firstName: "Updated",
      },
    });
    expect(updated.status).toBe(200);
    expect(updated.body.lastVerificationEmailRequestedAt).not.toBeNull();

    const deleted = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}/delete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(deleted.status).toBe(200);
    expect(deleted.body.deletedAt).not.toBeNull();

    const reactivated = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}/reactivate`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(reactivated.status).toBe(200);
    expect(reactivated.body.deletedAt).toBeNull();
    expect(reactivated.body.emailVerificationStatus).toBe("pending");
  });

  it("TC-TENANT-ADMINS-INT-003 TC-TENANT-ADMINS-INT-004 TC-TENANT-ADMINS-INT-005 TC-TENANT-ADMINS-EDGE-005 and TC-TENANT-ADMINS-SEC-005 keep token and outbound-email history truthful across automatic send resend and redeem", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAdminsFeature(harness.app, harness);
    const repository = mounted.repository as ReturnType<typeof createInMemoryTenantAdminsRepository>;
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        email: "verify.me@example.com",
      },
    });
    expect(created.status).toBe(201);
    expect(created.body.lastVerificationEmailRequestedAt).not.toBeNull();

    const firstActiveToken = [...repository.verificationTokens.values()].find(
      (item) => item.invalidatedAt === null && item.usedAt === null,
    )!;
    const outbound = [...mounted.notificationRepository.records.values()][0]!;
    expect(outbound.contentVersions[0]?.bodyText).toContain("[VERIFICATION LINK]");

    const resent = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}/verification/resend`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {
        resendReason: "operator retry",
      },
    });
    expect(resent.status).toBe(200);
    expect(outbound.attemptCount).toBe(2);
    expect(
      [...repository.verificationTokens.values()].some(
        (item) => item.tokenId === firstActiveToken.tokenId && item.invalidatedAt !== null,
      ),
    ).toBe(true);

    const redeem = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: {
        token: `${firstActiveToken.tokenId}.not-the-right-secret`,
      },
    });
    expect(redeem.status).toBe(400);

    const deliveredToken = extractTokenFromBody(
      mounted.provider.sentInputs[mounted.provider.sentInputs.length - 1]!.bodyText,
    );
    const redeemOk = await invokeJson<{ tenantAdmin: TenantAdminResponse }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: {
        token: deliveredToken,
      },
    });
    expect(redeemOk.status).toBe(200);
    expect(redeemOk.body.tenantAdmin.emailVerificationStatus).toBe("verified");
  });

  it("TC-TENANT-ADMINS-EDGE-002 invalidates earlier verification eligibility after soft delete", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAdminsFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { email: "delete-later@example.com" },
    });
    expect(created.status).toBe(201);

    const deliveredToken = extractTokenFromBody(mounted.provider.sentInputs[0]!.bodyText);

    await invokeJson<TenantAdminResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}/delete`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    const redeem = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token: deliveredToken },
    });
    expect(redeem.status).toBe(400);
    expect(redeem.body.code).toBe("TENANT_ADMIN_VERIFICATION_TOKEN_INVALID");
  });

  it("TC-TENANT-ADMINS-EDGE-004 governs repeated send attempts safely inside the duplicate window", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAdminsFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { email: "dup-send@example.com" },
    });
    expect(created.status).toBe(201);
    expect(created.body.lastVerificationEmailRequestedAt).not.toBeNull();

    const second = await invokeJson<{ code: string }>(harness.app, {
      method: "POST",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}/verification/send`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });

    expect(second.status).toBe(200);
    expect(
      [...mounted.repository.verificationTokens.values()].filter(
        (item) => item.invalidatedAt === null && item.usedAt === null,
      ),
    ).toHaveLength(1);
  });

  it("restarts tenant-auth onboarding for an already verified tenant admin through the protected operator route", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAdminsFeature(harness.app, harness);
    const identity = harness.seedAuthIdentity();
    const session = await loginViaPasswordAndSsh(harness, identity);

    const created = await invokeJson<TenantAdminResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins",
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: { email: "restart@example.com" },
    });
    expect(created.status).toBe(201);

    const deliveredToken = extractTokenFromBody(mounted.provider.sentInputs[0]!.bodyText);
    const redeemed = await invokeJson<{ tenantAdmin: TenantAdminResponse }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token: deliveredToken },
    });
    expect(redeemed.status).toBe(200);

    const restarted = await invokeJson<TenantAdminOnboardingRestartResponse>(harness.app, {
      method: "POST",
      path: `/v1/tenants/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admins/${created.body.tenantAdminId}/onboarding/restart`,
      headers: { authorization: `Bearer ${session.sessionId}` },
      body: {},
    });
    expect(restarted.status).toBe(200);
    expect(restarted.body.status).toBe("ONBOARDING_RESTARTED");
    expect(restarted.body.tenantAdmin.emailVerificationStatus).toBe("verified");
    expect(restarted.body.tenantAuthOnboarding.passwordSetupRequired).toBe(true);
    expect(restarted.body.tenantAuthOnboarding.bootstrapToken).toEqual(expect.any(String));
  });
});
