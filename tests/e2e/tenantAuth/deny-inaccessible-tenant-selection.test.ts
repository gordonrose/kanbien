import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  ErrorResponse,
  TENANT_BETA_ID,
  bootstrapSetPasswordAndLogin,
} from "./helpers";

describe("tenantAuth e2e inaccessible tenant selection denial", () => {
  it("JY-TENANT-AUTH-004 denies selection outside the principal's contexts and keeps the session truthful", async () => {
    const { harness, login } = await bootstrapSetPasswordAndLogin({
      email: "journey-deny-selection@example.com",
      secondaryTenant: {
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: TENANT_BETA_ID,
      },
    });

    const denied = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "99999999-9999-4999-8999-999999999999" },
    });

    expect(denied.status).toBe(403);
    expect(denied.body.code).toBe("TENANT_AUTH_TENANT_NOT_ACCESSIBLE");

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
    expect(session.body.status).toBe("AUTHENTICATED_SELECTION_REQUIRED");
    expect(session.body.selectionRequired).toBe(true);
    expect(session.body.activeTenantContext).toBeNull();
  });
});
