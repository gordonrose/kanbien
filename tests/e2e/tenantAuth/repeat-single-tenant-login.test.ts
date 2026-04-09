import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { TENANT_ALPHA_ID, createSeededPrincipalHarness } from "./helpers";

describe("tenantAuth e2e repeat single-tenant login", () => {
  it("JY-TENANT-AUTH-002 logs an existing single-tenant principal directly into the active tenant without onboarding", async () => {
    const { harness } = createSeededPrincipalHarness({
      email: "journey-repeat@example.com",
      tenantIds: [TENANT_ALPHA_ID],
    });

    const login = await invokeJson<{
      status: string;
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
      availableTenantContexts: Array<{ tenantId: string }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-repeat@example.com",
        password: "@Password1!",
      },
    });

    expect(login.status).toBe(200);
    expect(login.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(login.body.selectionRequired).toBe(false);
    expect(login.body.activeTenantContext?.tenantId).toBe(TENANT_ALPHA_ID);
    expect(login.body.availableTenantContexts).toHaveLength(1);
  });
});
