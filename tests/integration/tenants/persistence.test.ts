import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { createPostgresTenantsRepository } from "../../../src/features/tenants/persistence/postgresRepository";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

interface SearchColumnsRow {
  normalized_biz_id: string;
  normalized_name: string;
}

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("tenants postgres repository", () => {
  let pool: Pool;
  const actorRootUserId = "11111111-1111-1111-1111-111111111111";

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
    ]);
    const rootUsersRepository = createPostgresRootUsersRepository(pool);
    await rootUsersRepository.create({
      rootUserId: actorRootUserId,
      email: "tenant-operator@example.test",
      firstName: "Tenant",
      lastName: "Operator",
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-TENANTS-EDGE-002 stores normalized search columns and preserves visible versus deleted scopes with durable pre-delete state", async () => {
    const repository = createPostgresTenantsRepository(pool);

    const activeTenant = await repository.create({
      tenantId: "11111111-1111-4111-8111-111111111111",
      bizId: "  Tenant-Alpha  ",
      name: "  Tenant Alpha  ",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: actorRootUserId,
    });
    const deletedTenant = await repository.create({
      tenantId: "22222222-2222-4222-8222-222222222222",
      bizId: "tenant-deleted",
      name: "Tenant Deleted",
      category: "demo",
      status: "disabled",
      createdByRootAdminUserId: actorRootUserId,
    });
    await repository.softDelete(deletedTenant.tenantId);

    const storedColumns = await pool.query<SearchColumnsRow>(
      `
        SELECT normalized_biz_id, normalized_name
        FROM tenant
        WHERE tenant_id = $1
      `,
      [activeTenant.tenantId],
    );

    expect(storedColumns.rows[0]).toEqual({
      normalized_biz_id: "tenant-alpha",
      normalized_name: "tenant alpha",
    });

    const visible = await repository.findVisibleById(activeTenant.tenantId);
    const hiddenDeleted = await repository.findVisibleById(deletedTenant.tenantId);
    const deletedExact = await repository.findDeletedById(deletedTenant.tenantId);

    expect(visible?.tenantId).toBe(activeTenant.tenantId);
    expect(hiddenDeleted).toBeNull();
    expect(deletedExact?.tenantId).toBe(deletedTenant.tenantId);

    const visibleList = await repository.listVisible({
      page: 1,
      pageSize: 25,
      orderBy: "bizId",
      orderDirection: "asc",
      filters: {},
    });
    const deletedList = await repository.listDeleted({
      page: 1,
      pageSize: 25,
      orderBy: "bizId",
      orderDirection: "asc",
      filters: {},
    });

    expect(visibleList.items.map((item) => item.tenantId)).toEqual([activeTenant.tenantId]);
    expect(deletedList.items.map((item) => item.tenantId)).toEqual([deletedTenant.tenantId]);
  });

  it("TC-TENANTS-EDGE-001 preserves pre-delete status for deterministic reactivation and enforces active bizId uniqueness", async () => {
    const repository = createPostgresTenantsRepository(pool);

    const lifecycleTenant = await repository.create({
      tenantId: "33333333-3333-4333-8333-333333333333",
      bizId: "tenant-lifecycle",
      name: "Tenant Lifecycle",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: actorRootUserId,
    });

    const deleted = await repository.softDelete(lifecycleTenant.tenantId);
    expect(deleted.status).toBe("inactive");
    expect(deleted.preDeleteStatus).toBe("live");

    const reactivated = await repository.reactivate(lifecycleTenant.tenantId);
    expect(reactivated.status).toBe("live");
    expect(reactivated.preDeleteStatus).toBeNull();
    expect(reactivated.deletedAt).toBeNull();

    await repository.create({
      tenantId: "44444444-4444-4444-8444-444444444444",
      bizId: "tenant-collision",
      name: "Tenant Collision",
      category: "demo",
      status: "draft",
      createdByRootAdminUserId: actorRootUserId,
    });

    await expect(
      repository.create({
        tenantId: "55555555-5555-4555-8555-555555555555",
        bizId: "tenant-collision",
        name: "Tenant Collision Duplicate",
        category: "test",
        status: "draft",
        createdByRootAdminUserId: actorRootUserId,
      }),
    ).rejects.toThrow();
  });
});
