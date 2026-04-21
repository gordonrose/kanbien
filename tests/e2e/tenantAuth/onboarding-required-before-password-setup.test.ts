import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  createInMemoryTenantAuthRepository,
  issueTenantAdminVerificationToken,
  mountTenantAuthFeature,
} from "../../helpers/tenantAuthHarness";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import { createInMemoryTenantAdminsRepository } from "../../helpers/tenantAdminsHarness";
import { seedVerifiedTenantAdmin } from "./helpers";

describe("tenantAuth e2e onboarding required before password setup", () => {
  it("JY-TENANT-AUTH-006 returns onboarding required and creates no session when login is attempted before initial password setup", async () => {
    const harness = createRootAuthIntegrationHarness();
    const tenantAdminsRepository = createInMemoryTenantAdminsRepository();
    const tenantAuthRepository = createInMemoryTenantAuthRepository();
    const mounted = mountTenantAuthFeature(harness.app, harness, {
      tenantAdminsRepository,
      tenantAuthRepository,
    });

    seedVerifiedTenantAdmin(mounted.tenantAdminsRepository, {
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      email: "journey-onboarding-required@example.com",
      emailVerificationStatus: "pending",
    });

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      {
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      },
    );

    const bootstrap = await invokeJson<{
      status: string;
      tenantAuthOnboarding: {
        bootstrapToken: string;
      };
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-admin-verification/redeem",
      body: { token: verificationToken },
    });
    expect(bootstrap.status).toBe(200);

    const login = await invokeJson<{ status: string; loginEmail: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-onboarding-required@example.com",
        password: "@Password1!",
      },
    });

    expect(login.status).toBe(200);
    expect(login.body.status).toBe("ONBOARDING_REQUIRED");
    expect(login.body.loginEmail).toBe("journey-onboarding-required@example.com");
    expect(mounted.tenantAuthRepository.sessions.size).toBe(0);
  });
});
