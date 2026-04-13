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
    });

    expect(upserted.minLength).toBe(14);
    expect(upserted.maxLength).toBe(64);
    expect(upserted.minUppercase).toBe(2);
    expect(upserted.minNumbers).toBe(2);

    const reread = await repository.findTenantAuthPolicyByTenantId(tenantId);
    expect(reread).toMatchObject({
      tenantId,
      minLength: 14,
      maxLength: 64,
      minUppercase: 2,
      minNumbers: 2,
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
    });

    expect(updated.minLength).toBe(16);
    expect(updated.minNumbers).toBe(3);
    expect(updated.createdAt.toISOString()).toBe(upserted.createdAt.toISOString());
  });
});
