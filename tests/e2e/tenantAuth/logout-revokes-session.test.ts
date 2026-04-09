import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  ErrorResponse,
  TENANT_ALPHA_ID,
  bootstrapSetPasswordAndLogin,
} from "./helpers";

describe("tenantAuth e2e logout revocation", () => {
  it("JY-TENANT-AUTH-007 revokes the session and denies follow-up protected calls", async () => {
    const { harness, login } = await bootstrapSetPasswordAndLogin({
      email: "journey-logout@example.com",
    });

    const logout = await invokeJson<{ status: string; sessionRevoked: boolean }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/logout",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: {},
    });

    expect(logout.status).toBe(200);
    expect(logout.body.status).toBe("LOGGED_OUT");
    expect(logout.body.sessionRevoked).toBe(true);

    const session = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/session",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
    });

    expect(session.status).toBe(401);
    expect(session.body.code).toBe("INVALID_SESSION");

    const selection = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: TENANT_ALPHA_ID },
    });

    expect(selection.status).toBe(401);
    expect(selection.body.code).toBe("INVALID_SESSION");
  });
});
