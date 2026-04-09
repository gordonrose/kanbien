import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import {
  ErrorResponse,
  TENANT_ALPHA_ID,
  createSeededPrincipalHarness,
} from "./helpers";

describe("tenantAuth e2e disabled or deleted principal denial", () => {
  it("JY-TENANT-AUTH-009 denies login and stale protected-session reuse after the principal is disabled", async () => {
    const { harness, mounted } = createSeededPrincipalHarness({
      email: "journey-disabled@example.com",
    });

    const initialLogin = await invokeJson<{ sessionId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-disabled@example.com",
        password: "@Password1!",
      },
    });
    expect(initialLogin.status).toBe(200);

    const principal = mounted.tenantAuthRepository.principals.get(
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    );
    if (!principal) {
      throw new Error("Expected seeded tenant-auth principal to exist");
    }
    mounted.tenantAuthRepository.principals.set(principal.authPrincipalId, {
      ...principal,
      disabledAt: new Date("2026-04-09T13:00:00.000Z"),
    });

    const deniedLogin = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-disabled@example.com",
        password: "@Password1!",
      },
    });

    expect(deniedLogin.status).toBe(401);
    expect(deniedLogin.body.code).toBe("TENANT_AUTH_INVALID_CREDENTIALS");

    const deniedSession = await invokeJson<ErrorResponse>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/session",
      headers: { authorization: `Bearer ${initialLogin.body.sessionId}` },
    });

    expect(deniedSession.status).toBe(401);
    expect(deniedSession.body.code).toBe("TENANT_AUTH_INVALID_CREDENTIALS");
  });

  it("JY-TENANT-AUTH-009 denies stale protected-session reuse after the principal record disappears", async () => {
    const { harness, mounted } = createSeededPrincipalHarness({
      email: "journey-deleted@example.com",
      tenantIds: [TENANT_ALPHA_ID],
    });

    const login = await invokeJson<{ sessionId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "journey-deleted@example.com",
        password: "@Password1!",
      },
    });
    expect(login.status).toBe(200);

    mounted.tenantAuthRepository.principals.delete(
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    );

    const deniedSelection = await invokeJson<ErrorResponse>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: TENANT_ALPHA_ID },
    });

    expect(deniedSelection.status).toBe(401);
    expect(deniedSelection.body.code).toBe("TENANT_AUTH_INVALID_CREDENTIALS");
  });
});
