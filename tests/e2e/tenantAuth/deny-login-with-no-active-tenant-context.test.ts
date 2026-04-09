import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  ErrorResponse,
  TENANT_ALPHA_ID,
  createMutableVisibleTenantsReader,
  createSeededPrincipalHarness,
} from "./helpers";

describe("tenantAuth e2e no-active-tenant denial", () => {
  it("JY-TENANT-AUTH-005 denies login when valid credentials no longer resolve to any active tenant context", async () => {
    const visibility = createMutableVisibleTenantsReader([]);
    const { harness } = createSeededPrincipalHarness({
      email: "journey-no-access@example.com",
      tenantIds: [TENANT_ALPHA_ID],
      visibleTenantsReader: visibility.reader,
    });

    const login = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-no-access@example.com",
        password: "@Password1!",
      },
    });

    expect(login.status).toBe(403);
    expect(login.body.code).toBe("TENANT_AUTH_NO_TENANT_ACCESS");
  });
});
