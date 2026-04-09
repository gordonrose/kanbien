import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import {
  createTenantAdminRecord,
  issueTenantAdminVerificationToken,
  mountTenantAuthFeature,
} from "../../helpers/tenantAuthHarness";

describe("tenantAuth feature flow", () => {
  it("TC-TENANT-AUTH-INT-001, TC-TENANT-AUTH-INT-002, TC-TENANT-AUTH-INT-003, and TC-TENANT-AUTH-INT-005 bootstrap, set password, log in, auto-select the only tenant, read session, and log out", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness, {
      tenantAdminsRepository: undefined,
    });
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "tenant-admin@example.com",
        normalizedEmail: "tenant-admin@example.com",
        emailVerificationStatus: "pending",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      {
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      },
    );

    const bootstrap = await invokeJson<{
      status: string;
      authPrincipalId: string;
      bootstrapToken: string;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/principals/bootstrap",
      body: { verificationToken },
    });
    expect(bootstrap.status).toBe(200);
    expect(bootstrap.body.status).toBe("PRINCIPAL_BOOTSTRAPPED");

    const setup = await invokeJson<{ status: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/password/setup",
      body: {
        bootstrapToken: bootstrap.body.bootstrapToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      },
    });
    expect(setup.status).toBe(200);
    expect(setup.body.status).toBe("PASSWORD_SET");

    const login = await invokeJson<{
      status: string;
      sessionId: string;
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
      availableTenantContexts: unknown[];
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "tenant-admin@example.com",
        password: "@Password1!",
      },
    });
    expect(login.status).toBe(200);
    expect(login.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(login.body.selectionRequired).toBe(false);
    expect(login.body.activeTenantContext?.tenantId).toBe(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    );
    expect(login.body.availableTenantContexts).toHaveLength(1);

    const session = await invokeJson<{ status: string }>(harness.app, {
      method: "GET",
      path: "/v1/tenant-auth/session",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
    });
    expect(session.status).toBe(200);
    expect(session.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");

    const logout = await invokeJson<{ status: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/logout",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: {},
    });
    expect(logout.status).toBe(200);
    expect(logout.body.status).toBe("LOGGED_OUT");
  });

  it("TC-TENANT-AUTH-INT-004 and TC-TENANT-AUTH-EDGE-001 require tenant selection when one principal has multiple tenant contexts", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "multi@example.com",
        normalizedEmail: "multi@example.com",
        emailVerificationStatus: "pending",
      }),
    );
    mounted.tenantAdminsRepository.records.set(
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        email: "multi@example.com",
        normalizedEmail: "multi@example.com",
        emailVerificationStatus: "verified",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      { tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" },
    );
    const bootstrap = await invokeJson<{ bootstrapToken: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/principals/bootstrap",
      body: { verificationToken },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/password/setup",
      body: {
        bootstrapToken: bootstrap.body.bootstrapToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      },
    });

    const login = await invokeJson<{
      status: string;
      sessionId: string;
      selectionRequired: boolean;
      activeTenantContext: null;
      availableTenantContexts: Array<{ tenantId: string }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "multi@example.com",
        password: "@Password1!",
      },
    });
    expect(login.status).toBe(200);
    expect(login.body.status).toBe("AUTHENTICATED_SELECTION_REQUIRED");
    expect(login.body.selectionRequired).toBe(true);
    expect(login.body.activeTenantContext).toBeNull();
    expect(login.body.availableTenantContexts).toHaveLength(2);

    const selected = await invokeJson<{
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });
    expect(selected.status).toBe(200);
    expect(selected.body.selectionRequired).toBe(false);
    expect(selected.body.activeTenantContext?.tenantId).toBe(
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    );
  });

  it("TC-TENANT-AUTH-EDGE-003 re-resolves session state when the previously active tenant context is no longer accessible", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "edge@example.com",
        normalizedEmail: "edge@example.com",
        emailVerificationStatus: "pending",
      }),
    );
    mounted.tenantAdminsRepository.records.set(
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        email: "edge@example.com",
        normalizedEmail: "edge@example.com",
        emailVerificationStatus: "verified",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      { tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" },
    );
    const bootstrap = await invokeJson<{ bootstrapToken: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/principals/bootstrap",
      body: { verificationToken },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/password/setup",
      body: {
        bootstrapToken: bootstrap.body.bootstrapToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      },
    });

    const login = await invokeJson<{ sessionId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "edge@example.com",
        password: "@Password1!",
      },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });

    const selectedGrant = [...mounted.tenantAuthRepository.accessGrants.values()].find(
      (record) =>
        record.tenantId === "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" &&
        record.subjectId === "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    );
    if (!selectedGrant) {
      throw new Error("Expected selected tenant access grant to exist in the harness");
    }
    mounted.tenantAuthRepository.accessGrants.set(selectedGrant.tenantAccessGrantId, {
      ...selectedGrant,
      revokedAt: new Date("2026-04-09T12:00:00.000Z"),
    });

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
    expect(session.body.activeTenantContext?.tenantId).toBe(
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
    );
    expect(session.body.availableTenantContexts).toHaveLength(1);
  });

  it("TC-TENANT-AUTH-UNIT-006 keeps tenant selection idempotent when the already-active tenant is selected again", async () => {
    const harness = createRootAuthIntegrationHarness();
    const mounted = mountTenantAuthFeature(harness.app, harness);
    mounted.tenantAdminsRepository.records.set(
      "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "idempotent@example.com",
        normalizedEmail: "idempotent@example.com",
        emailVerificationStatus: "pending",
      }),
    );
    mounted.tenantAdminsRepository.records.set(
      "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        email: "idempotent@example.com",
        normalizedEmail: "idempotent@example.com",
        emailVerificationStatus: "verified",
      }),
    );

    const verificationToken = await issueTenantAdminVerificationToken(
      mounted.tenantAdminsRepository,
      { tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc" },
    );
    const bootstrap = await invokeJson<{ bootstrapToken: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/principals/bootstrap",
      body: { verificationToken },
    });
    await invokeJson(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/password/setup",
      body: {
        bootstrapToken: bootstrap.body.bootstrapToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      },
    });

    const login = await invokeJson<{ sessionId: string }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/login/password",
      body: {
        email: "idempotent@example.com",
        password: "@Password1!",
      },
    });

    const firstSelection = await invokeJson<{
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
      availableTenantContexts: Array<{ tenantId: string; isActive: boolean }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });
    expect(firstSelection.status).toBe(200);
    expect(firstSelection.body.activeTenantContext?.tenantId).toBe(
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    );

    const repeatedSelection = await invokeJson<{
      status: string;
      selectionRequired: boolean;
      activeTenantContext: { tenantId: string } | null;
      availableTenantContexts: Array<{ tenantId: string; isActive: boolean }>;
    }>(harness.app, {
      method: "POST",
      path: "/v1/tenant-auth/tenant-selection",
      headers: { authorization: `Bearer ${login.body.sessionId}` },
      body: { tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb" },
    });

    expect(repeatedSelection.status).toBe(200);
    expect(repeatedSelection.body.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(repeatedSelection.body.selectionRequired).toBe(false);
    expect(repeatedSelection.body.activeTenantContext?.tenantId).toBe(
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    );
    expect(
      repeatedSelection.body.availableTenantContexts.find(
        (item) => item.tenantId === "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      )?.isActive,
    ).toBe(true);
  });
});
