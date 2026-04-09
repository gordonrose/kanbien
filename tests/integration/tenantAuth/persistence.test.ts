import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { createPostgresTenantAdminsRepository } from "../../../src/features/tenantAdmins/persistence/postgresRepository";
import { createTenantAuthService } from "../../../src/features/tenantAuth/domain/service";
import { createPostgresTenantAuthRepository } from "../../../src/features/tenantAuth/persistence/postgresRepository";
import { createTenantAdminsAuthBootstrapReader } from "../../../src/features/tenantAdmins";
import { createPostgresTenantsRepository } from "../../../src/features/tenants/persistence/postgresRepository";
import { createVisibleTenantsReader } from "../../../src/features/tenants";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";
import { createOneTimeTokenMaterial } from "../../../src/lib/tokens";
import type { TenantAuthSessionResult } from "../../../src/features/tenantAuth/contract/types";

interface PasswordCredentialRow {
  password_hash: string;
}

interface TimestampRow {
  used_at: Date | null;
  invalidated_at: Date | null;
}

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("tenantAuth postgres repository", () => {
  let pool: Pool;
  const actorRootUserId = "11111111-1111-1111-1111-111111111111";
  const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const tenantAdminId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
  const authPrincipalId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
    await applyPostgresTestMigrations(pool, [
      "rootUsers",
      "platformSecurity",
      "rootAuth",
      "rootRoles",
      "tenants",
      "notificationDelivery",
      "tenantAdmins",
      "tenantAuth",
    ]);

    const rootUsersRepository = createPostgresRootUsersRepository(pool);
    const tenantsRepository = createPostgresTenantsRepository(pool);
    const tenantAdminsRepository = createPostgresTenantAdminsRepository(pool);

    await rootUsersRepository.create({
      rootUserId: actorRootUserId,
      email: "tenant-auth-operator@example.test",
      firstName: "Tenant",
      lastName: "Operator",
    });
    await tenantsRepository.create({
      tenantId,
      bizId: "tenant-auth-alpha",
      name: "Tenant Auth Alpha",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: actorRootUserId,
    });
    await tenantAdminsRepository.create({
      tenantAdminId,
      tenantId,
      email: "tenant-admin@example.test",
      firstName: "Taylor",
      lastName: "Admin",
      createdByRootAdminUserId: actorRootUserId,
    });
    await tenantAdminsRepository.markVerified(tenantAdminId);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-TENANT-AUTH-UNIT-001, TC-TENANT-AUTH-UNIT-002, and TC-TENANT-AUTH-UNIT-003 persist normalized principal identity, hashed password verification, and durable access-grant state", async () => {
    const repository = createPostgresTenantAuthRepository(pool);

    await repository.createPrincipal({
      authPrincipalId,
      loginEmail: "Tenant-Admin@Example.Test",
      normalizedLoginEmail: "tenant-admin@example.test",
    });
    await repository.createAccessGrant({
      tenantAccessGrantId: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      authPrincipalId,
      tenantId,
      subjectType: "tenant_admin",
      subjectId: tenantAdminId,
    });
    await repository.setPassword(authPrincipalId, "@Password1!", new Date("2026-04-09T12:00:00.000Z"));

    const principal = await repository.findPrincipalByNormalizedEmail("tenant-admin@example.test");
    const grants = await repository.listActiveAccessGrants(authPrincipalId);
    const acceptedPassword = await repository.verifyPassword(authPrincipalId, "@Password1!");
    const rejectedPassword = await repository.verifyPassword(authPrincipalId, "@WrongPass1!");
    const storedCredential = await pool.query<PasswordCredentialRow>(
      `
        SELECT password_hash
        FROM tenant_password_credential
        WHERE auth_principal_id = $1
      `,
      [authPrincipalId],
    );

    expect(principal).toMatchObject({
      auth_principal_id: authPrincipalId,
      normalized_login_email: "tenant-admin@example.test",
      password_state: "active",
    });
    expect(grants).toHaveLength(1);
    expect(grants[0]).toMatchObject({
      auth_principal_id: authPrincipalId,
      tenant_id: tenantId,
      subject_type: "tenant_admin",
      subject_id: tenantAdminId,
      revoked_at: null,
    });
    expect(acceptedPassword).toBe(true);
    expect(rejectedPassword).toBe(false);
    expect(storedCredential.rows[0].password_hash).not.toBe("@Password1!");
    expect(storedCredential.rows[0].password_hash.includes("@Password1!")).toBe(false);
  });

  it("TC-TENANT-AUTH-UNIT-002, TC-TENANT-AUTH-UNIT-004, and TC-TENANT-AUTH-UNIT-007 persist setup-token lifecycle and deny active-session lookup once the principal is disabled", async () => {
    const repository = createPostgresTenantAuthRepository(pool);

    await repository.createPrincipal({
      authPrincipalId,
      loginEmail: "tenant-admin@example.test",
      normalizedLoginEmail: "tenant-admin@example.test",
    });
    await repository.createPasswordSetupToken({
      tenantPasswordSetupTokenId: "11111111-2222-4333-8444-555555555555",
      authPrincipalId,
      sourceTenantAdminId: tenantAdminId,
      tokenId: "66666666-7777-4888-8999-000000000000",
      secretHash: "hashed-secret",
      expiresAt: new Date("2026-04-09T12:30:00.000Z"),
    });

    await repository.invalidateActivePasswordSetupTokens(authPrincipalId);
    const invalidated = await pool.query<TimestampRow>(
      `
        SELECT used_at, invalidated_at
        FROM tenant_password_setup_token
        WHERE auth_principal_id = $1
      `,
      [authPrincipalId],
    );
    expect(invalidated.rows[0].used_at).toBeNull();
    expect(invalidated.rows[0].invalidated_at).not.toBeNull();

    await repository.createPasswordSetupToken({
      tenantPasswordSetupTokenId: "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee",
      authPrincipalId,
      sourceTenantAdminId: tenantAdminId,
      tokenId: "ffffffff-1111-4222-8333-444444444444",
      secretHash: "hashed-secret-2",
      expiresAt: new Date("2026-04-09T13:30:00.000Z"),
    });
    await repository.markPasswordSetupTokenUsed("ffffffff-1111-4222-8333-444444444444");

    const used = await pool.query<TimestampRow>(
      `
        SELECT used_at, invalidated_at
        FROM tenant_password_setup_token
        WHERE token_id = $1
      `,
      ["ffffffff-1111-4222-8333-444444444444"],
    );
    expect(used.rows[0].used_at).not.toBeNull();
    expect(used.rows[0].invalidated_at).toBeNull();

    await repository.createSession({
      sessionId: "99999999-aaaa-4bbb-8ccc-dddddddddddd",
      authPrincipalId,
      activeTenantId: null,
      selectionRequired: true,
      authenticatedAt: new Date("2026-04-09T14:00:00.000Z"),
      expiresAt: new Date("2099-04-09T15:00:00.000Z"),
    });

    const activeBeforeDisable = await repository.findActiveSessionById(
      "99999999-aaaa-4bbb-8ccc-dddddddddddd",
    );
    expect(activeBeforeDisable?.session_id).toBe("99999999-aaaa-4bbb-8ccc-dddddddddddd");

    await pool.query(
      `
        UPDATE tenant_auth_principal
        SET disabled_at = NOW(), updated_at = NOW()
        WHERE auth_principal_id = $1
      `,
      [authPrincipalId],
    );

    const activeAfterDisable = await repository.findActiveSessionById(
      "99999999-aaaa-4bbb-8ccc-dddddddddddd",
    );
    expect(activeAfterDisable).toBeNull();

    const revoked = await repository.revokeSession(
      "99999999-aaaa-4bbb-8ccc-dddddddddddd",
      authPrincipalId,
    );
    expect(revoked).toBe(true);
  });

  it("TC-TENANT-AUTH-UNIT-002 allows exactly one concurrent password-setup completion for the same raw setup proof", async () => {
    const repository = createPostgresTenantAuthRepository(pool);

    await repository.createPrincipal({
      authPrincipalId,
      loginEmail: "tenant-admin@example.test",
      normalizedLoginEmail: "tenant-admin@example.test",
    });

    const setupMaterial = createOneTimeTokenMaterial({
      purpose: "password_setup",
      ttlSeconds: 60 * 60,
    });

    await repository.createPasswordSetupToken({
      tenantPasswordSetupTokenId: "12121212-3434-4567-8123-565656565656",
      authPrincipalId,
      sourceTenantAdminId: tenantAdminId,
      tokenId: setupMaterial.tokenId,
      secretHash: setupMaterial.secretHash,
      expiresAt: setupMaterial.expiresAt,
    });

    const service = createTenantAuthService(
      repository,
      createTenantAdminsAuthBootstrapReader(createPostgresTenantAdminsRepository(pool)),
      createVisibleTenantsReader(pool),
    );

    const results = await Promise.allSettled([
      service.setInitialPassword({
        bootstrapToken: setupMaterial.rawToken,
        newPassword: "@Password1!",
        repeatPassword: "@Password1!",
      }),
      service.setInitialPassword({
        bootstrapToken: setupMaterial.rawToken,
        newPassword: "@Password2!",
        repeatPassword: "@Password2!",
      }),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);

    const rejected = results.find((result) => result.status === "rejected");
    expect(rejected).toMatchObject({
      reason: {
        code: expect.stringMatching(
          /TENANT_AUTH_PASSWORD_(SETUP_INVALID|ALREADY_SET)/,
        ),
      },
    });

    const acceptedPassword1 = await repository.verifyPassword(authPrincipalId, "@Password1!");
    const acceptedPassword2 = await repository.verifyPassword(authPrincipalId, "@Password2!");
    const tokenRecord = await repository.findPasswordSetupTokenByTokenId(setupMaterial.tokenId);
    const principal = await repository.findPrincipalById(authPrincipalId);

    expect(Number(acceptedPassword1) + Number(acceptedPassword2)).toBe(1);
    expect(tokenRecord?.used_at).not.toBeNull();
    expect(principal?.password_state).toBe("active");
  });

  it("TC-TENANT-AUTH-UNIT-001 allows exactly one concurrent bootstrap consumption for the same raw verification proof", async () => {
    const tenantAdminsRepository = createPostgresTenantAdminsRepository(pool);
    const tenantAuthRepository = createPostgresTenantAuthRepository(pool);
    const bootstrapMaterial = createOneTimeTokenMaterial({
      purpose: "email_verification",
      ttlSeconds: 60 * 60,
    });

    await tenantAdminsRepository.createVerificationToken({
      tenantAdminVerificationTokenId: "98989898-1212-4343-8787-565656565656",
      tenantAdminId,
      tokenId: bootstrapMaterial.tokenId,
      secretHash: bootstrapMaterial.secretHash,
      expiresAt: bootstrapMaterial.expiresAt,
      requestedByActorType: "root_user",
      requestedByActorId: actorRootUserId,
    });

    const service = createTenantAuthService(
      tenantAuthRepository,
      createTenantAdminsAuthBootstrapReader(tenantAdminsRepository),
      createVisibleTenantsReader(pool),
    );

    const results = await Promise.allSettled([
      service.bootstrapPrincipalFromVerification({
        verificationToken: bootstrapMaterial.rawToken,
      }),
      service.bootstrapPrincipalFromVerification({
        verificationToken: bootstrapMaterial.rawToken,
      }),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
    expect(results.find((result) => result.status === "rejected")).toMatchObject({
      reason: {
        code: "TENANT_AUTH_BOOTSTRAP_INVALID",
      },
    });

    const principalCount = await pool.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM tenant_auth_principal
        WHERE normalized_login_email = $1
      `,
      ["tenant-admin@example.test"],
    );
    const grantCount = await pool.query<{ count: string }>(
      `
        SELECT COUNT(*)::text AS count
        FROM tenant_access_grant
        WHERE tenant_id = $1
          AND subject_id = $2
      `,
      [tenantId, tenantAdminId],
    );

    expect(Number(principalCount.rows[0].count)).toBe(1);
    expect(Number(grantCount.rows[0].count)).toBe(1);
  });

  it("TC-TENANT-AUTH-UNIT-006 and TC-TENANT-AUTH-UNIT-007 keep the durable session safe when logout races tenant selection", async () => {
    const repository = createPostgresTenantAuthRepository(pool);
    const tenantsRepository = createPostgresTenantsRepository(pool);
    const tenantAdminsRepository = createPostgresTenantAdminsRepository(pool);

    await tenantsRepository.create({
      tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      bizId: "tenant-auth-beta",
      name: "Tenant Auth Beta",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: actorRootUserId,
    });
    await tenantAdminsRepository.create({
      tenantAdminId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      email: "tenant-admin@example.test",
      firstName: "Taylor",
      lastName: "Admin",
      createdByRootAdminUserId: actorRootUserId,
    });
    await tenantAdminsRepository.markVerified("dddddddd-dddd-4ddd-8ddd-dddddddddddd");

    await repository.createPrincipal({
      authPrincipalId,
      loginEmail: "tenant-admin@example.test",
      normalizedLoginEmail: "tenant-admin@example.test",
    });
    await repository.setPassword(authPrincipalId, "@Password1!", new Date("2026-04-09T16:00:00.000Z"));
    await repository.createAccessGrant({
      tenantAccessGrantId: "56565656-aaaa-4444-8888-111111111111",
      authPrincipalId,
      tenantId,
      subjectType: "tenant_admin",
      subjectId: tenantAdminId,
    });
    await repository.createAccessGrant({
      tenantAccessGrantId: "78787878-bbbb-4444-8888-222222222222",
      authPrincipalId,
      tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      subjectType: "tenant_admin",
      subjectId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    });
    await repository.createSession({
      sessionId: "34343434-5656-4789-8123-121212121212",
      authPrincipalId,
      activeTenantId: null,
      selectionRequired: true,
      authenticatedAt: new Date("2026-04-09T16:10:00.000Z"),
      expiresAt: new Date("2099-04-09T17:10:00.000Z"),
    });

    const service = createTenantAuthService(
      repository,
      createTenantAdminsAuthBootstrapReader(createPostgresTenantAdminsRepository(pool)),
      createVisibleTenantsReader(pool),
    );

    const results = await Promise.allSettled([
      service.selectActiveTenantContext({
        sessionId: "34343434-5656-4789-8123-121212121212",
        authPrincipalId,
        tenantId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      }),
      service.logoutTenantSession({
        sessionId: "34343434-5656-4789-8123-121212121212",
        authPrincipalId,
      }),
    ]);

    expect(results.find((result) => result.status === "fulfilled" && "sessionRevoked" in result.value)).toBeTruthy();

    const selectionResult = results.find(
      (result): result is PromiseFulfilledResult<TenantAuthSessionResult> =>
        result.status === "fulfilled" && "selectionRequired" in result.value,
    );
    if (selectionResult) {
      expect(selectionResult.value.activeTenantContext?.tenantId).toBe(
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      );
    }

    const activeSession = await repository.findActiveSessionById(
      "34343434-5656-4789-8123-121212121212",
    );
    const storedSession = await pool.query<{ revoked_at: Date | null }>(
      `
        SELECT revoked_at
        FROM tenant_session
        WHERE session_id = $1
      `,
      ["34343434-5656-4789-8123-121212121212"],
    );

    expect(activeSession).toBeNull();
    expect(storedSession.rows[0].revoked_at).not.toBeNull();
  });
});
