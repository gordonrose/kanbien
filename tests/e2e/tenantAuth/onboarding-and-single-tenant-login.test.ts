import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  TENANT_ALPHA_ID,
  bootstrapSetPasswordAndLogin,
} from "./helpers";

describe("tenantAuth e2e onboarding and single-tenant login", () => {
  it("JY-TENANT-AUTH-001 completes bootstrap, password setup, first login, and single-tenant session read", async () => {
    const { harness, bootstrap, setup, login } = await bootstrapSetPasswordAndLogin({
      email: "journey-single@example.com",
    });

    expect(bootstrap.status).toBe(200);
    expect(bootstrap.body.status).toBe("PRINCIPAL_BOOTSTRAPPED");

    expect(setup.status).toBe(200);
    expect(setup.body.status).toBe("PASSWORD_SET");

    expect(login.status).toBe(200);
    expect(login.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(login.body.selectionRequired).toBe(false);
    expect(login.body.activeTenantContext?.tenantId).toBe(TENANT_ALPHA_ID);
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
    expect(session.body.activeTenantContext?.tenantId).toBe(TENANT_ALPHA_ID);
  });
});
