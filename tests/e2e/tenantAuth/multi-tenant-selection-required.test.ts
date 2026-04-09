import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  TENANT_ALPHA_ID,
  TENANT_BETA_ID,
  bootstrapSetPasswordAndLogin,
} from "./helpers";

describe("tenantAuth e2e multi-tenant selection", () => {
  it("JY-TENANT-AUTH-003 logs in with selection required, lists truthful contexts, and persists the chosen tenant", async () => {
    const { harness, login } = await bootstrapSetPasswordAndLogin({
      email: "journey-multi@example.com",
      secondaryTenant: {
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: TENANT_BETA_ID,
      },
    });

    expect(login.status).toBe(200);
    expect(login.body.status).toBe("AUTHENTICATED_SELECTION_REQUIRED");
    expect(login.body.selectionRequired).toBe(true);
    expect(login.body.activeTenantContext).toBeNull();
    expect(login.body.availableTenantContexts.map((item) => item.tenantId)).toEqual([
      TENANT_ALPHA_ID,
      TENANT_BETA_ID,
    ]);

    const tenantContexts = await invokeJson<{
      items: Array<{ tenantId: string; isActive: boolean }>;
    }>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/tenant-contexts",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
    });

    expect(tenantContexts.status).toBe(200);
    expect(tenantContexts.body.items).toHaveLength(2);
    expect(tenantContexts.body.items.every((item) => item.isActive === false)).toBe(true);

    const selected = await invokeJson<{
      status: string;
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: TENANT_BETA_ID },
    });

    expect(selected.status).toBe(200);
    expect(selected.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(selected.body.selectionRequired).toBe(false);
    expect(selected.body.activeTenantContext?.tenantId).toBe(TENANT_BETA_ID);
  });
});
