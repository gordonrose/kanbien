import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { createPostgresTenantsRepository } from "../../../src/features/tenants/persistence/postgresRepository";
import { createPostgresTenantConfigurationRepository } from "../../../src/features/tenantConfiguration/persistence/postgresRepository";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("tenantConfiguration postgres repository", () => {
  let pool: Pool;
  const actorRootUserId = "11111111-1111-1111-1111-111111111111";
  const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

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
      "tenantConfiguration",
    ]);

    const rootUsersRepository = createPostgresRootUsersRepository(pool);
    const tenantsRepository = createPostgresTenantsRepository(pool);

    await rootUsersRepository.create({
      rootUserId: actorRootUserId,
      email: "tenant-config-operator@example.test",
      firstName: "Tenant",
      lastName: "Operator",
    });
    await tenantsRepository.create({
      tenantId,
      bizId: "tenant-config-alpha",
      name: "Tenant Config Alpha",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: actorRootUserId,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-TENANT-AUTH-POLICY-INT-001 persists one durable tenant auth policy row per tenant and returns updated bounds", async () => {
    const repository = createPostgresTenantConfigurationRepository(pool);

    const upserted = await repository.upsertTenantAuthPolicy({
      tenantId,
      minLength: 14,
      maxLength: 64,
      minUppercase: 2,
      maxUppercase: null,
      minLowercase: 1,
      maxLowercase: null,
      minNumbers: 2,
      maxNumbers: null,
      minSymbols: 1,
      maxSymbols: null,
      sessionTtlSeconds: 7200,
    });

    expect(upserted.minLength).toBe(14);
    expect(upserted.maxLength).toBe(64);
    expect(upserted.minUppercase).toBe(2);
    expect(upserted.minNumbers).toBe(2);
    expect(upserted.sessionTtlSeconds).toBe(7200);

    const reread = await repository.findTenantAuthPolicyByTenantId(tenantId);
    expect(reread).toMatchObject({
      tenantId,
      minLength: 14,
      maxLength: 64,
      minUppercase: 2,
      minNumbers: 2,
      sessionTtlSeconds: 7200,
    });

    const updated = await repository.upsertTenantAuthPolicy({
      tenantId,
      minLength: 16,
      maxLength: 64,
      minUppercase: 2,
      maxUppercase: null,
      minLowercase: 1,
      maxLowercase: null,
      minNumbers: 3,
      maxNumbers: null,
      minSymbols: 1,
      maxSymbols: null,
      sessionTtlSeconds: 5400,
    });

    expect(updated.minLength).toBe(16);
    expect(updated.minNumbers).toBe(3);
    expect(updated.sessionTtlSeconds).toBe(5400);
    expect(updated.createdAt.toISOString()).toBe(upserted.createdAt.toISOString());
  });

  it("TC-TENANT-AUTH-POLICY-INT-002 seeds tenant auth-policy capabilities and grants them to RootUserAdmin", async () => {
    const capabilityRows = await pool.query<{
      capability_key: string;
      root_user_admin_default_mandatory: boolean;
      root_user_admin_default_protected: boolean;
    }>(
      `
        SELECT
          capability_key,
          root_user_admin_default_mandatory,
          root_user_admin_default_protected
        FROM root_authz_capabilities
        WHERE capability_key IN ('tenant-auth-policy.read', 'tenant-auth-policy.update')
        ORDER BY capability_key ASC
      `,
    );

    expect(capabilityRows.rows).toEqual([
      {
        capability_key: "tenant-auth-policy.read",
        root_user_admin_default_mandatory: true,
        root_user_admin_default_protected: true,
      },
      {
        capability_key: "tenant-auth-policy.update",
        root_user_admin_default_mandatory: true,
        root_user_admin_default_protected: true,
      },
    ]);

    const grantRows = await pool.query<{ capability_key: string; is_mandatory: boolean; is_protected: boolean }>(
      `
        SELECT
          rg.capability_key,
          rg.is_mandatory,
          rg.is_protected
        FROM system_root_role_capability_grants rg
        JOIN system_root_roles role
          ON role.system_root_role_id = rg.system_root_role_id
        WHERE role.role_key = 'RootUserAdmin'
          AND rg.capability_key IN ('tenant-auth-policy.read', 'tenant-auth-policy.update')
          AND rg.revoked_at IS NULL
        ORDER BY rg.capability_key ASC
      `,
    );

    expect(grantRows.rows).toEqual([
      {
        capability_key: "tenant-auth-policy.read",
        is_mandatory: true,
        is_protected: true,
      },
      {
        capability_key: "tenant-auth-policy.update",
        is_mandatory: true,
        is_protected: true,
      },
    ]);
  });
});
