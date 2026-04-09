import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  ErrorResponse,
  TENANT_ALPHA_ID,
  TENANT_BETA_ID,
  bootstrapSetPasswordAndLogin,
  createMutableVisibleTenantsReader,
} from "./helpers";

describe("tenantAuth e2e deleted or inactive tenant-context denial", () => {
  it("JY-TENANT-AUTH-010 removes invisible tenants from session state, denies stale selection, and fails login once no active tenant remains", async () => {
    const visibility = createMutableVisibleTenantsReader([
      TENANT_ALPHA_ID,
      TENANT_BETA_ID,
    ]);
    const { harness, login } = await bootstrapSetPasswordAndLogin({
      email: "journey-tenant-lifecycle@example.com",
      secondaryTenant: {
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: TENANT_BETA_ID,
      },
      visibleTenantsReader: visibility.reader,
    });

    const selected = await invokeJson<{ status: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: TENANT_BETA_ID },
    });
    expect(selected.status).toBe(200);

    visibility.visibleTenantIds.delete(TENANT_BETA_ID);

    const session = await invokeJson<{
      status: string;
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
      availableTenantContexts: Array<{ tenantId: string }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/session",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
    });

    expect(session.status).toBe(200);
    expect(session.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(session.body.selectionRequired).toBe(false);
    expect(session.body.activeTenantContext?.tenantId).toBe(TENANT_ALPHA_ID);
    expect(session.body.availableTenantContexts.map((item) => item.tenantId)).toEqual([
      TENANT_ALPHA_ID,
    ]);

    const deniedSelection = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: TENANT_BETA_ID },
    });

    expect(deniedSelection.status).toBe(403);
    expect(deniedSelection.body.code).toBe("TENANT_AUTH_TENANT_NOT_ACCESSIBLE");

    visibility.visibleTenantIds.delete(TENANT_ALPHA_ID);

    const deniedLogin = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-tenant-lifecycle@example.com",
        password: "@Password1!",
      },
    });

    expect(deniedLogin.status).toBe(403);
    expect(deniedLogin.body.code).toBe("TENANT_AUTH_NO_TENANT_ACCESS");
  });
});
