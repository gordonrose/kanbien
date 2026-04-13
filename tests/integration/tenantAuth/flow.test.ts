import { describe, expect, it } from "vitest";
import { invokeJson } from "../../harness/http";
import { createRootAuthIntegrationHarness } from "../../harness/rootAuth/integrationHarness";
import type { EffectiveTenantPasswordPolicy, TenantAuthPolicyResolver } from "../../../src/features/tenantConfiguration";
import {
  createTenantAdminRecord,
  issueTenantAdminVerificationToken,
  mountTenantAuthFeature,
} from "../../helpers/tenantAuthHarness";

describe("tenantAuth feature flow", () => {
  const lenientPolicy: EffectiveTenantPasswordPolicy = {
    minLength: 12,
    maxLength: null,
    minUppercase: 1,
    maxUppercase: null,
    minLowercase: 1,
    maxLowercase: null,
    minNumbers: 1,
    maxNumbers: null,
    minSymbols: 1,
    maxSymbols: null,
  };
  const strictPolicy: EffectiveTenantPasswordPolicy = {
    minLength: 16,
    maxLength: null,
    minUppercase: 2,
    maxUppercase: null,
    minLowercase: 1,
    maxLowercase: null,
    minNumbers: 2,
    maxNumbers: null,
    minSymbols: 1,
    maxSymbols: null,
  };
  let activePolicy = lenientPolicy;

  const policyResolver: TenantAuthPolicyResolver = {
    async readEffectiveTenantAuthPolicy(tenantId) {
      return {
        tenantId,
        policySource: "tenant_override",
        hasTenantOverride: true,
        passwordPolicy: { ...activePolicy },
        hardFloors: {
          minLength: 6,
          minUppercase: 1,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        },
        updatedAt: "2026-04-09T12:00:00.000Z",
      };
    },
    async resolveAggregatePasswordPolicy() {
      return { ...activePolicy };
    },
    assertPasswordMeetsPolicy(password, policy) {
      if (password.length < policy.minLength) {
        const error = new Error("too_short");
        error.name = "TenantAuthPolicyPasswordViolation";
        throw error;
      }
      if ((password.match(/[A-Z]/g) ?? []).length < policy.minUppercase) {
        const error = new Error("missing_uppercase");
        error.name = "TenantAuthPolicyPasswordViolation";
        throw error;
      }
      if ((password.match(/[0-9]/g) ?? []).length < policy.minNumbers) {
        const error = new Error("missing_number");
        error.name = "TenantAuthPolicyPasswordViolation";
        throw error;
      }
    },
  };

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

  it("TC-TENANT-AUTH-POLICY-INT-003 and TC-TENANT-AUTH-POLICY-INT-004 create a remediation-gated session and clear it after password remediation", async () => {
    try {
      activePolicy = lenientPolicy;
      const harness = createRootAuthIntegrationHarness();
      const mounted = mountTenantAuthFeature(harness.app, harness, {
        policyResolver,
      });
      mounted.tenantAdminsRepository.records.set(
        "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        createTenantAdminRecord({
          tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
          tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          email: "policy@example.com",
          normalizedEmail: "policy@example.com",
          emailVerificationStatus: "pending",
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
          newPassword: "@Password1!LongEnough",
          repeatPassword: "@Password1!LongEnough",
        },
      });

      activePolicy = strictPolicy;

      const login = await invokeJson<{
      sessionId: string;
      remediationRequired: boolean;
      remediationReason: string | null;
      passwordPolicyRequirements: { minLength: number; minUppercase: number; minNumbers: number } | null;
      }>(harness.app, {
        method: "POST",
        path: "/v1/tenant-auth/login/password",
        body: {
          email: "policy@example.com",
          password: "@Password1!LongEnough",
        },
      });

      expect(login.status).toBe(200);
      expect(login.body.remediationRequired).toBe(true);
      expect(login.body.remediationReason).toBe("password_policy_upgrade_required");
      expect(login.body.passwordPolicyRequirements?.minLength).toBe(16);
      expect(login.body.passwordPolicyRequirements?.minUppercase).toBe(2);
      expect(login.body.passwordPolicyRequirements?.minNumbers).toBe(2);

      const remediation = await invokeJson<{
      status: string;
      remediationRequired: boolean;
      passwordPolicyRequirements: { minLength: number };
      }>(harness.app, {
        method: "GET",
        path: "/v1/tenant-auth/remediation",
        headers: { authorization: `Bearer ${login.body.sessionId}` },
      });
      expect(remediation.status).toBe(200);
      expect(remediation.body.status).toBe("REMEDIATION_REQUIRED");
      expect(remediation.body.remediationRequired).toBe(true);
      expect(remediation.body.passwordPolicyRequirements.minLength).toBe(16);

      const completed = await invokeJson<{
      remediationRequired: boolean;
      remediationReason: string | null;
      passwordPolicyRequirements: null;
      }>(harness.app, {
        method: "POST",
        path: "/v1/tenant-auth/remediation/password",
        headers: { authorization: `Bearer ${login.body.sessionId}` },
        body: {
          newPassword: "@Password12!LongEnoughA",
          repeatPassword: "@Password12!LongEnoughA",
        },
      });
      expect(completed.status).toBe(200);
      expect(completed.body.remediationRequired).toBe(false);
      expect(completed.body.remediationReason).toBeNull();
      expect(completed.body.passwordPolicyRequirements).toBeNull();
    } finally {
      activePolicy = lenientPolicy;
    }
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

  it("TC-TENANT-AUTH-POLICY-CONC-001 keeps remediation completion truthful when the same session submits concurrent password-remediation requests", async () => {
    const lenientPolicy = {
      minLength: 12,
      maxLength: null,
      minUppercase: 1,
      maxUppercase: null,
      minLowercase: 1,
      maxLowercase: null,
      minNumbers: 1,
      maxNumbers: null,
      minSymbols: 1,
      maxSymbols: null,
    };
    const strictPolicy = {
      minLength: 16,
      maxLength: null,
      minUppercase: 2,
      maxUppercase: null,
      minLowercase: 1,
      maxLowercase: null,
      minNumbers: 2,
      maxNumbers: null,
      minSymbols: 1,
      maxSymbols: null,
    };
    let activePolicy = lenientPolicy;

    const dynamicPolicyResolver: TenantAuthPolicyResolver = {
      async readEffectiveTenantAuthPolicy(tenantId) {
        return {
          tenantId,
          policySource: "tenant_override",
          hasTenantOverride: true,
          passwordPolicy: { ...activePolicy },
          hardFloors: {
            minLength: 6,
            minUppercase: 1,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          },
          updatedAt: "2026-04-10T12:00:00.000Z",
        };
      },
      async resolveAggregatePasswordPolicy() {
        return { ...activePolicy };
      },
      assertPasswordMeetsPolicy(password, policy) {
        if (
          password.length < policy.minLength ||
          (password.match(/[A-Z]/g) ?? []).length < policy.minUppercase ||
          (password.match(/[0-9]/g) ?? []).length < policy.minNumbers
        ) {
          const error = new Error("password_policy_violation");
          error.name = "TenantAuthPolicyPasswordViolation";
          throw error;
        }
      },
    };

    try {
      const harness = createRootAuthIntegrationHarness();
      const mounted = mountTenantAuthFeature(harness.app, harness, {
        policyResolver: dynamicPolicyResolver,
      });
      mounted.tenantAdminsRepository.records.set(
        "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        createTenantAdminRecord({
          tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
          tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          email: "conc-policy@example.com",
          normalizedEmail: "conc-policy@example.com",
          emailVerificationStatus: "pending",
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
          newPassword: "@Password1!LongEnough",
          repeatPassword: "@Password1!LongEnough",
        },
      });

      activePolicy = strictPolicy;

      const login = await invokeJson<{ sessionId: string; remediationRequired: boolean }>(
        harness.app,
        {
          method: "POST",
          path: "/v1/tenant-auth/login/password",
          body: {
            email: "conc-policy@example.com",
            password: "@Password1!LongEnough",
          },
        },
      );
      expect(login.body.remediationRequired).toBe(true);

      const results = await Promise.all([
        invokeJson<{ remediationRequired: boolean }>(harness.app, {
          method: "POST",
          path: "/v1/tenant-auth/remediation/password",
          headers: { authorization: `Bearer ${login.body.sessionId}` },
          body: {
            newPassword: "@Password12!LongEnoughA",
            repeatPassword: "@Password12!LongEnoughA",
          },
        }),
        invokeJson<{ code: string }>(harness.app, {
          method: "POST",
          path: "/v1/tenant-auth/remediation/password",
          headers: { authorization: `Bearer ${login.body.sessionId}` },
          body: {
            newPassword: "@Password12!LongEnoughA",
            repeatPassword: "@Password12!LongEnoughA",
          },
        }),
      ]);

      const statuses = results.map((result) => result.status).sort((left, right) => left - right);
      expect(
        JSON.stringify(statuses) === JSON.stringify([200, 200]) ||
          JSON.stringify(statuses) === JSON.stringify([200, 409]),
      ).toBe(true);
      expect(
        results.some(
          (result) => result.status === 200 && "remediationRequired" in result.body,
        ),
      ).toBe(true);
      expect(
        results.every(
          (result) =>
            result.status !== 409 ||
            ("code" in result.body &&
              result.body.code === "TENANT_AUTH_REMEDIATION_NOT_REQUIRED"),
        ),
      ).toBe(true);

      const finalSession = await invokeJson<{ remediationRequired: boolean }>(harness.app, {
        method: "GET",
        path: "/v1/tenant-auth/session",
        headers: { authorization: `Bearer ${login.body.sessionId}` },
      });
      expect(finalSession.status).toBe(200);
      expect(finalSession.body.remediationRequired).toBe(false);
    } finally {
      activePolicy = lenientPolicy;
    }
  });
});
