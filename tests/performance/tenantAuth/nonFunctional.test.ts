import { performance } from "node:perf_hooks";
import { describe, expect, it } from "vitest";
import { createTenantAuthService } from "../../../src/features/tenantAuth/domain/service";
import type { TenantAuthPolicyResolver } from "../../../src/features/tenantConfiguration";
import { createTenantAdminsAuthBootstrapReader } from "../../../src/features/tenantAdmins";
import {
  createInMemoryTenantAuthRepository,
  createTenantAccessGrantRecord,
  createTenantAdminRecord,
  createTenantAuthPrincipalRecord,
  createTenantSessionRecord,
} from "../../helpers/tenantAuthHarness";
import {
  createInMemoryTenantAdminsRepository,
  createVisibleTenantsReader,
} from "../../helpers/tenantAdminsHarness";

function createTenantAuthPerformanceFixture(input?: {
  email?: string;
  multiTenant?: boolean;
  seedSession?: boolean;
  policyResolver?: TenantAuthPolicyResolver;
}) {
  const email = input?.email ?? "performance@example.com";
  const tenantAdminsRepository = createInMemoryTenantAdminsRepository([
    createTenantAdminRecord({
      tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      email,
      normalizedEmail: email,
      emailVerificationStatus: "verified",
    }),
    ...(input?.multiTenant
      ? [
          createTenantAdminRecord({
            tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
            tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
            email,
            normalizedEmail: email,
            emailVerificationStatus: "verified",
          }),
        ]
      : []),
  ]);
  const tenantAuthRepository = createInMemoryTenantAuthRepository({
    principals: [
      createTenantAuthPrincipalRecord({
        authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        loginEmail: email,
        normalizedLoginEmail: email,
        passwordState: "active",
      }),
    ],
    accessGrants: [
      createTenantAccessGrantRecord({
        tenantAccessGrantId: "11111111-1111-4111-8111-111111111111",
        authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        subjectId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      }),
      ...(input?.multiTenant
        ? [
            createTenantAccessGrantRecord({
              tenantAccessGrantId: "22222222-2222-4222-8222-222222222222",
              authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
              tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
              subjectId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
            }),
          ]
        : []),
    ],
    sessions:
      input?.seedSession === false
        ? []
        : [
            createTenantSessionRecord({
              sessionId: "abababab-abab-4aba-8aba-abababababab",
              authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
              activeTenantId: input?.multiTenant ? null : "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
              selectionRequired: input?.multiTenant ?? false,
            }),
          ],
    passwordSetPrincipals: ["eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee"],
  });

  const service = createTenantAuthService(
    tenantAuthRepository,
    createTenantAdminsAuthBootstrapReader(tenantAdminsRepository),
    createVisibleTenantsReader([
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    ]),
    input?.policyResolver,
  );

  return {
    service,
    tenantAuthRepository,
  };
}

describe("tenantAuth non-functional performance coverage", () => {
  it("handles a burst of concurrent session reads without losing truthful single-tenant state", async () => {
    const { service } = createTenantAuthPerformanceFixture();
    const start = performance.now();

    const results = await Promise.all(
      Array.from({ length: 40 }, () =>
        service.readCurrentTenantSession({
          sessionId: "abababab-abab-4aba-8aba-abababababab",
          authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        }),
      ),
    );

    const elapsedMs = performance.now() - start;

    expect(results).toHaveLength(40);
    expect(results.every((result) => result.status === "AUTHENTICATED_SINGLE_TENANT")).toBe(true);
    expect(
      results.every(
        (result) =>
          result.activeTenantContext?.tenantId === "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      ),
    ).toBe(true);
    expect(elapsedMs).toBeLessThan(500);
  });

  it("keeps average login and session-read latency inside a conservative in-memory budget", async () => {
    const { service } = createTenantAuthPerformanceFixture();
    const iterations = 30;
    let loginElapsedMs = 0;
    let sessionElapsedMs = 0;

    for (let index = 0; index < iterations; index += 1) {
      const loginStart = performance.now();
      const loginResult = await service.loginTenantPrincipalWithPassword({
        email: "performance@example.com",
        password: "@Password1!",
      });
      loginElapsedMs += performance.now() - loginStart;

      if (!("sessionId" in loginResult)) {
        throw new Error("Expected performance login fixture to return an authenticated session");
      }

      const sessionStart = performance.now();
      await service.readCurrentTenantSession({
        sessionId: loginResult.sessionId,
        authPrincipalId: loginResult.authPrincipalId,
      });
      sessionElapsedMs += performance.now() - sessionStart;
    }

    const averageLoginMs = loginElapsedMs / iterations;
    const averageSessionMs = sessionElapsedMs / iterations;

    expect(averageLoginMs).toBeLessThan(25);
    expect(averageSessionMs).toBeLessThan(15);
  });

  it("sustains repeated login and logout cycles without leaving active-session residue", async () => {
    const { service, tenantAuthRepository } = createTenantAuthPerformanceFixture({
      seedSession: false,
    });
    const iterations = 75;

    for (let index = 0; index < iterations; index += 1) {
      const loginResult = await service.loginTenantPrincipalWithPassword({
        email: "performance@example.com",
        password: "@Password1!",
      });

      if (!("sessionId" in loginResult)) {
        throw new Error("Expected soak login fixture to return an authenticated session");
      }

      const logoutResult = await service.logoutTenantSession({
        sessionId: loginResult.sessionId,
        authPrincipalId: loginResult.authPrincipalId,
      });

      expect(logoutResult.status).toBe("LOGGED_OUT");
    }

    const sessions = [...tenantAuthRepository.sessions.values()];
    expect(sessions).toHaveLength(iterations);
    expect(sessions.every((session) => session.revokedAt !== null)).toBe(true);
  });

  it("TC-TENANT-AUTH-POLICY-PERF-001 keeps policy-aware login and remediation-aware session reads inside a conservative local budget", async () => {
    const policyResolver: TenantAuthPolicyResolver = {
      async readEffectiveTenantAuthPolicy(tenantId) {
        return {
          tenantId,
          policySource: "tenant_override",
          hasTenantOverride: true,
          passwordPolicy: {
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
          },
          hardFloors: {
            minLength: 6,
            minUppercase: 1,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          },
          sessionPolicy: {
            sessionTtlSeconds: 28800,
          },
          hardLimits: {
            minSessionTtlSeconds: 300,
            maxSessionTtlSeconds: 2592000,
          },
          updatedAt: "2026-04-10T12:00:00.000Z",
        };
      },
      async resolveAggregatePasswordPolicy() {
        return {
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
      },
      async resolveAggregateSessionTtlSeconds() {
        return 28800;
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

    const { service } = createTenantAuthPerformanceFixture({
      seedSession: false,
      policyResolver,
    });
    const iterations = 20;
    let loginElapsedMs = 0;
    let sessionElapsedMs = 0;

    for (let index = 0; index < iterations; index += 1) {
      const loginStart = performance.now();
      const loginResult = await service.loginTenantPrincipalWithPassword({
        email: "performance@example.com",
        password: "@Password1!",
      });
      loginElapsedMs += performance.now() - loginStart;

      if (!("sessionId" in loginResult)) {
        throw new Error("Expected authenticated tenant session from policy-aware fixture");
      }

      const sessionStart = performance.now();
      await service.readCurrentTenantSession({
        sessionId: loginResult.sessionId,
        authPrincipalId: loginResult.authPrincipalId,
      });
      sessionElapsedMs += performance.now() - sessionStart;
    }

    expect(loginElapsedMs / iterations).toBeLessThan(30);
    expect(sessionElapsedMs / iterations).toBeLessThan(20);
  });
});
