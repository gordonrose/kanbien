import { afterEach, describe, expect, it, vi } from "vitest";
import { createTenantAuthService } from "../../../src/features/tenantAuth/domain/service";
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
import { createTenantAdminsAuthBootstrapReader } from "../../../src/features/tenantAdmins";
import { createInMemoryTenantConfigurationRepository } from "../../helpers/tenantConfigurationHarness";
import { createTenantConfigurationService } from "../../../src/features/tenantConfiguration/domain/service";

afterEach(() => {
  vi.useRealTimers();
});

describe("tenantAuth service", () => {
  it("TC-TENANT-AUTH-UNIT-001 provisions a shared principal and tenant access grant from a verified onboarding subject", async () => {
    const tenantAdminsRepository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        email: "multi@example.com",
        normalizedEmail: "multi@example.com",
        emailVerificationStatus: "verified",
        emailVerifiedAt: new Date("2026-04-09T00:01:00.000Z"),
      }),
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        email: "multi@example.com",
        normalizedEmail: "multi@example.com",
        emailVerificationStatus: "verified",
      }),
    ]);
    const tenantAuthRepository = createInMemoryTenantAuthRepository();
    const service = createTenantAuthService(
      tenantAuthRepository,
      createTenantAdminsAuthBootstrapReader(tenantAdminsRepository),
      createVisibleTenantsReader([
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ]),
    );

    const result = await service.onboardingProvisioner.provisionTenantAuthForVerifiedSubject({
      source: {
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "multi@example.com",
        normalizedEmail: "multi@example.com",
        firstName: "Alex",
        lastName: "Admin",
      },
    });

    expect(result.status).toBe("PRINCIPAL_BOOTSTRAPPED");
    expect(result.loginEmail).toBe("multi@example.com");
    expect(result.passwordSetupRequired).toBe(true);
    expect(result.bootstrapToken).toEqual(expect.any(String));
    expect(tenantAuthRepository.principals.size).toBe(1);
    expect(tenantAuthRepository.accessGrants.size).toBe(2);
  });

  it("TC-TENANT-AUTH-UNIT-002 sets the initial password from a single-use bootstrap token", async () => {
    const tenantAuthRepository = createInMemoryTenantAuthRepository({
      principals: [
        createTenantAuthPrincipalRecord({
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          loginEmail: "tenant-admin@example.com",
          normalizedLoginEmail: "tenant-admin@example.com",
          passwordState: "setup_required",
        }),
      ],
    });
    const token = await tenantAuthRepository.createPasswordSetupToken({
      tenantPasswordSetupTokenId: "abababab-abab-4aba-8aba-abababababab",
      authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      sourceTenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      tokenId: "placeholder",
      secretHash: "placeholder",
      expiresAt: new Date("2099-01-01T00:00:00.000Z"),
    });
    tenantAuthRepository.passwordSetupTokens.clear();
    const tenantAdminsRepository = createInMemoryTenantAdminsRepository();
    const service = createTenantAuthService(
      tenantAuthRepository,
      createTenantAdminsAuthBootstrapReader(tenantAdminsRepository),
      createVisibleTenantsReader(),
    );
    const setupMaterial = await import("../../../src/lib/tokens").then(({ createOneTimeTokenMaterial }) =>
      createOneTimeTokenMaterial({ purpose: "password_setup", ttlSeconds: 3600 }),
    );
    await tenantAuthRepository.createPasswordSetupToken({
      tenantPasswordSetupTokenId: token.tenant_password_setup_token_id,
      authPrincipalId: token.auth_principal_id,
      sourceTenantAdminId: token.source_tenant_admin_id,
      tokenId: setupMaterial.tokenId,
      secretHash: setupMaterial.secretHash,
      expiresAt: setupMaterial.expiresAt,
    });

    const result = await service.setInitialPassword({
      bootstrapToken: setupMaterial.rawToken,
      newPassword: "@Password1!",
      repeatPassword: "@Password1!",
    });

    expect(result.status).toBe("PASSWORD_SET");
    expect(tenantAuthRepository.passwordHashes.get("dddddddd-dddd-4ddd-8ddd-dddddddddddd")).toBe(
      "@Password1!",
    );
    expect(
      tenantAuthRepository.principals.get("dddddddd-dddd-4ddd-8ddd-dddddddddddd")?.passwordState,
    ).toBe("active");
  });

  it("TC-TENANT-AUTH-UNIT-002 rejects reused password-setup proof after the first successful password write", async () => {
    const tenantAuthRepository = createInMemoryTenantAuthRepository({
      principals: [
        createTenantAuthPrincipalRecord({
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          loginEmail: "tenant-admin@example.com",
          normalizedLoginEmail: "tenant-admin@example.com",
          passwordState: "setup_required",
        }),
      ],
    });
    const tenantAdminsRepository = createInMemoryTenantAdminsRepository();
    const service = createTenantAuthService(
      tenantAuthRepository,
      createTenantAdminsAuthBootstrapReader(tenantAdminsRepository),
      createVisibleTenantsReader(),
    );
    const setupMaterial = await import("../../../src/lib/tokens").then(({ createOneTimeTokenMaterial }) =>
      createOneTimeTokenMaterial({ purpose: "password_setup", ttlSeconds: 3600 }),
    );

    await tenantAuthRepository.createPasswordSetupToken({
      tenantPasswordSetupTokenId: "abababab-abab-4aba-8aba-abababababab",
      authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      sourceTenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      tokenId: setupMaterial.tokenId,
      secretHash: setupMaterial.secretHash,
      expiresAt: setupMaterial.expiresAt,
    });

    await service.setInitialPassword({
      bootstrapToken: setupMaterial.rawToken,
      newPassword: "@Password1!",
      repeatPassword: "@Password1!",
    });

    await expect(
      service.setInitialPassword({
        bootstrapToken: setupMaterial.rawToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      }),
    ).rejects.toMatchObject({
      code: "TENANT_AUTH_PASSWORD_SETUP_INVALID",
    });
  });

  it("TC-TENANT-AUTH-UNIT-003 returns onboarding required when no principal exists but verified tenant-admin evidence does", async () => {
    const tenantAdminsRepository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord({
        email: "verified@example.com",
        normalizedEmail: "verified@example.com",
        emailVerificationStatus: "verified",
      }),
    ]);
    const service = createTenantAuthService(
      createInMemoryTenantAuthRepository(),
      createTenantAdminsAuthBootstrapReader(tenantAdminsRepository),
      createVisibleTenantsReader(),
    );

    const result = await service.loginTenantPrincipalWithPassword({
      email: "verified@example.com",
      password: "WrongPassword1!",
    });

    expect(result).toEqual({
      status: "ONBOARDING_REQUIRED",
      loginEmail: "verified@example.com",
    });
  });

  it("TC-TENANT-AUTH-UNIT-004 reads the current session with truthful active and available tenant context state", async () => {
    const tenantAdminsRepository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "tenant-admin@example.com",
        normalizedEmail: "tenant-admin@example.com",
        emailVerificationStatus: "verified",
      }),
    ]);
    const tenantAuthRepository = createInMemoryTenantAuthRepository({
      principals: [
        createTenantAuthPrincipalRecord({
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          loginEmail: "tenant-admin@example.com",
          normalizedLoginEmail: "tenant-admin@example.com",
          passwordState: "active",
        }),
      ],
      accessGrants: [
        createTenantAccessGrantRecord({
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          subjectId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        }),
      ],
      sessions: [
        createTenantSessionRecord({
          sessionId: "12121212-1212-4212-8212-121212121212",
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          activeTenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          selectionRequired: false,
        }),
      ],
      passwordSetPrincipals: ["dddddddd-dddd-4ddd-8ddd-dddddddddddd"],
    });
    const service = createTenantAuthService(
      tenantAuthRepository,
      createTenantAdminsAuthBootstrapReader(tenantAdminsRepository),
      createVisibleTenantsReader(["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"]),
    );

    const result = await service.readCurrentTenantSession({
      sessionId: "12121212-1212-4212-8212-121212121212",
      authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });

    expect(result.status).toBe("AUTHENTICATED_SINGLE_TENANT");
    expect(result.selectionRequired).toBe(false);
    expect(result.activeTenantContext?.tenantId).toBe("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    expect(result.availableTenantContexts).toEqual([
      expect.objectContaining({
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        subjectType: "tenant_admin",
        subjectId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        isActive: true,
      }),
    ]);
  });

  it("TC-TENANT-AUTH-UNIT-005 and TC-TENANT-AUTH-EDGE-002 list deterministic frontend-ready tenant contexts using generic subject fields", async () => {
    const tenantAdminsRepository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        firstName: "Bravo",
        lastName: "Admin",
        email: "multi@example.com",
        normalizedEmail: "multi@example.com",
        emailVerificationStatus: "verified",
      }),
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        firstName: "Alpha",
        lastName: "Admin",
        email: "multi@example.com",
        normalizedEmail: "multi@example.com",
        emailVerificationStatus: "verified",
      }),
    ]);
    const tenantAuthRepository = createInMemoryTenantAuthRepository({
      principals: [
        createTenantAuthPrincipalRecord({
          authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
          loginEmail: "multi@example.com",
          normalizedLoginEmail: "multi@example.com",
          passwordState: "active",
        }),
      ],
      accessGrants: [
        createTenantAccessGrantRecord({
          tenantAccessGrantId: "99999999-9999-4999-8999-999999999999",
          authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
          tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          subjectId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        }),
        createTenantAccessGrantRecord({
          tenantAccessGrantId: "abababab-abab-4aba-8aba-abababababab",
          authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
          tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          subjectId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        }),
      ],
      sessions: [
        createTenantSessionRecord({
          sessionId: "34343434-3434-4434-8434-343434343434",
          authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
          activeTenantId: null,
          selectionRequired: true,
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
    );

    const result = await service.listAvailableTenantContexts({
      sessionId: "34343434-3434-4434-8434-343434343434",
      authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    });

    expect(result.items.map((item) => item.tenantId)).toEqual([
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    ]);
    expect(result.items).toEqual([
      expect.objectContaining({
        subjectType: "tenant_admin",
        subjectId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        subjectDisplayName: "Alpha Admin",
        subjectEmail: "multi@example.com",
      }),
      expect.objectContaining({
        subjectType: "tenant_admin",
        subjectId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        subjectDisplayName: "Bravo Admin",
        subjectEmail: "multi@example.com",
      }),
    ]);
  });

  it("TC-TENANT-AUTH-UNIT-006 updates the active tenant selection on a valid session", async () => {
    const tenantAdminsRepository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "tenant-admin@example.com",
        normalizedEmail: "tenant-admin@example.com",
        emailVerificationStatus: "verified",
      }),
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        email: "tenant-admin@example.com",
        normalizedEmail: "tenant-admin@example.com",
        emailVerificationStatus: "verified",
      }),
    ]);
    const tenantAuthRepository = createInMemoryTenantAuthRepository({
      principals: [
        createTenantAuthPrincipalRecord({
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          loginEmail: "tenant-admin@example.com",
          normalizedLoginEmail: "tenant-admin@example.com",
          passwordState: "active",
        }),
      ],
      accessGrants: [
        createTenantAccessGrantRecord({
          tenantAccessGrantId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          subjectId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        }),
        createTenantAccessGrantRecord({
          tenantAccessGrantId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          subjectId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        }),
      ],
      sessions: [
        createTenantSessionRecord({
          sessionId: "12121212-1212-4212-8212-121212121212",
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          activeTenantId: null,
          selectionRequired: true,
        }),
      ],
      passwordSetPrincipals: ["dddddddd-dddd-4ddd-8ddd-dddddddddddd"],
    });
    const service = createTenantAuthService(
      tenantAuthRepository,
      createTenantAdminsAuthBootstrapReader(tenantAdminsRepository),
      createVisibleTenantsReader([
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ]),
    );

    const result = await service.selectActiveTenantContext({
      sessionId: "12121212-1212-4212-8212-121212121212",
      authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    });

    expect(result.selectionRequired).toBe(false);
    expect(result.activeTenantContext?.tenantId).toBe("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
  });

  it("TC-TENANT-AUTH-UNIT-006 behaves idempotently when the requested tenant is already active", async () => {
    const tenantAdminsRepository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "tenant-admin@example.com",
        normalizedEmail: "tenant-admin@example.com",
        emailVerificationStatus: "verified",
      }),
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        email: "tenant-admin@example.com",
        normalizedEmail: "tenant-admin@example.com",
        emailVerificationStatus: "verified",
      }),
    ]);
    const tenantAuthRepository = createInMemoryTenantAuthRepository({
      principals: [
        createTenantAuthPrincipalRecord({
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          loginEmail: "tenant-admin@example.com",
          normalizedLoginEmail: "tenant-admin@example.com",
          passwordState: "active",
        }),
      ],
      accessGrants: [
        createTenantAccessGrantRecord({
          tenantAccessGrantId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          subjectId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        }),
        createTenantAccessGrantRecord({
          tenantAccessGrantId: "ffffffff-ffff-4fff-8fff-ffffffffffff",
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          subjectId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        }),
      ],
      sessions: [
        createTenantSessionRecord({
          sessionId: "12121212-1212-4212-8212-121212121212",
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          activeTenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          selectionRequired: false,
        }),
      ],
      passwordSetPrincipals: ["dddddddd-dddd-4ddd-8ddd-dddddddddddd"],
    });
    const service = createTenantAuthService(
      tenantAuthRepository,
      createTenantAdminsAuthBootstrapReader(tenantAdminsRepository),
      createVisibleTenantsReader([
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ]),
    );

    const before = tenantAuthRepository.sessions.get("12121212-1212-4212-8212-121212121212");
    const result = await service.selectActiveTenantContext({
      sessionId: "12121212-1212-4212-8212-121212121212",
      authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    });
    const after = tenantAuthRepository.sessions.get("12121212-1212-4212-8212-121212121212");

    expect(result.selectionRequired).toBe(false);
    expect(result.activeTenantContext?.tenantId).toBe("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
    expect(before?.activeTenantId).toBe("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
    expect(after?.activeTenantId).toBe("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
    expect(after?.selectionRequired).toBe(false);
  });

  it("TC-TENANT-AUTH-UNIT-007 revokes the current tenant session without mutating principal ownership", async () => {
    const tenantAuthRepository = createInMemoryTenantAuthRepository({
      principals: [
        createTenantAuthPrincipalRecord({
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          loginEmail: "tenant-admin@example.com",
          normalizedLoginEmail: "tenant-admin@example.com",
          passwordState: "active",
        }),
      ],
      sessions: [
        createTenantSessionRecord({
          sessionId: "56565656-5656-4565-8565-565656565656",
          authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
          activeTenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          selectionRequired: false,
        }),
      ],
      passwordSetPrincipals: ["dddddddd-dddd-4ddd-8ddd-dddddddddddd"],
    });
    const service = createTenantAuthService(
      tenantAuthRepository,
      createTenantAdminsAuthBootstrapReader(createInMemoryTenantAdminsRepository()),
      createVisibleTenantsReader(),
    );

    const result = await service.logoutTenantSession({
      sessionId: "56565656-5656-4565-8565-565656565656",
      authPrincipalId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });

    expect(result).toEqual({
      status: "LOGGED_OUT",
      sessionRevoked: true,
    });
    expect(
      tenantAuthRepository.sessions.get("56565656-5656-4565-8565-565656565656")?.revokedAt,
    ).toBeInstanceOf(Date);
    expect(
      tenantAuthRepository.principals.get("dddddddd-dddd-4ddd-8ddd-dddddddddddd")?.passwordState,
    ).toBe("active");
  });

  it("TC-TENANT-AUTH-UNIT-008 uses the strictest effective tenant session TTL when creating a shared-principal session", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-13T12:00:00.000Z"));

    const tenantAdminsRepository = createInMemoryTenantAdminsRepository([
      createTenantAdminRecord({
        tenantAdminId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        email: "multi@example.com",
        normalizedEmail: "multi@example.com",
        emailVerificationStatus: "verified",
      }),
      createTenantAdminRecord({
        tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        email: "multi@example.com",
        normalizedEmail: "multi@example.com",
        emailVerificationStatus: "verified",
      }),
    ]);
    const tenantAuthRepository = createInMemoryTenantAuthRepository({
      principals: [
        createTenantAuthPrincipalRecord({
          authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
          loginEmail: "multi@example.com",
          normalizedLoginEmail: "multi@example.com",
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
        createTenantAccessGrantRecord({
          tenantAccessGrantId: "22222222-2222-4222-8222-222222222222",
          authPrincipalId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
          tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          subjectId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        }),
      ],
      passwordSetPrincipals: ["eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee"],
    });
    tenantAuthRepository.passwordHashes.set("eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", "@Password1!");

    const tenantConfigurationService = createTenantConfigurationService(
      createInMemoryTenantConfigurationRepository([
        {
          tenantId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
          minLength: null,
          maxLength: null,
          minUppercase: null,
          maxUppercase: null,
          minLowercase: null,
          maxLowercase: null,
          minNumbers: null,
          maxNumbers: null,
          minSymbols: null,
          maxSymbols: null,
          sessionTtlSeconds: 1800,
          createdAt: new Date("2026-04-10T10:00:00.000Z"),
          updatedAt: new Date("2026-04-10T10:00:00.000Z"),
        },
        {
          tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
          minLength: null,
          maxLength: null,
          minUppercase: null,
          maxUppercase: null,
          minLowercase: null,
          maxLowercase: null,
          minNumbers: null,
          maxNumbers: null,
          minSymbols: null,
          maxSymbols: null,
          sessionTtlSeconds: 3600,
          createdAt: new Date("2026-04-10T10:00:00.000Z"),
          updatedAt: new Date("2026-04-10T10:00:00.000Z"),
        },
      ]),
      createVisibleTenantsReader([
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ]),
    );

    const service = createTenantAuthService(
      tenantAuthRepository,
      createTenantAdminsAuthBootstrapReader(tenantAdminsRepository),
      createVisibleTenantsReader([
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ]),
      tenantConfigurationService.policyResolver,
    );

    const result = await service.loginTenantPrincipalWithPassword({
      email: "multi@example.com",
      password: "@Password1!",
    });

    expect(result.status).toBe("AUTHENTICATED_SELECTION_REQUIRED");
    if (result.status === "ONBOARDING_REQUIRED") {
      throw new Error("Expected authenticated tenant session for multi-tenant login");
    }

    expect(result.selectionRequired).toBe(true);
    expect(result.expiresAt).toBe("2026-04-13T12:30:00.000Z");
  });
});
