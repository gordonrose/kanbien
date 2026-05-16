import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { createPostgresTenantsRepository } from "../../../src/features/tenants/persistence/postgresRepository";
import { createOrganizationCoreService } from "../../../src/features/organizationCore/domain/service";
import { createPostgresOrganizationCoreRepository } from "../../../src/features/organizationCore/persistence/postgresRepository";
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

describeIfPostgres("organizationCore postgres persistence", () => {
  let pool: Pool;
  const rootUserId = "11111111-1111-4111-8111-111111111111";
  const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const actor = { actorType: "root-user" as const, actorId: rootUserId };

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
      "organizationCore",
    ]);

    await createPostgresRootUsersRepository(pool).create({
      rootUserId,
      email: "organization-operator@example.test",
      firstName: "Organization",
      lastName: "Operator",
    });
    await createPostgresTenantsRepository(pool).create({
      tenantId,
      bizId: "tenant-org",
      name: "Tenant Org",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: rootUserId,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ORG-S004-INT-001 persists normalized uniqueness, hierarchy movement, archive visibility, and audit rows", async () => {
    const service = createOrganizationCoreService(createPostgresOrganizationCoreRepository(pool));

    const root = await service.createOrganization({
      tenantId,
      name: "  Head Office  ",
      ...actor,
    });
    expect(root.name).toBe("Head Office");

    await expect(
      service.createOrganization({
        tenantId,
        name: "head office",
        ...actor,
      }),
    ).rejects.toThrow(/active organization/);

    const child = await service.createOrganization({
      tenantId,
      name: "Child Office",
      parentOrganizationId: root.organizationId,
      ...actor,
    });
    expect(child.parentOrganizationId).toBe(root.organizationId);

    const moved = await service.moveOrganization({
      tenantId,
      organizationId: child.organizationId,
      parentOrganizationId: null,
      ...actor,
    });
    expect(moved.parentOrganizationId).toBeNull();

    await service.archiveOrganization({
      tenantId,
      organizationId: root.organizationId,
      childHandling: "archiveBranch",
      ...actor,
    });

    const visible = await service.listOrganizations({
      tenantId,
      page: 1,
      pageSize: 25,
      orderBy: "name",
      orderDirection: "asc",
      filters: {},
    });
    expect(visible.items.map((item) => item.organizationId)).toEqual([child.organizationId]);

    const audit = await pool.query<{ event_type: string }>(
      `
        SELECT event_type
        FROM organization_audit_event
        WHERE tenant_id = $1
        ORDER BY occurred_at ASC
      `,
      [tenantId],
    );
    expect(audit.rows.map((row) => row.event_type)).toEqual([
      "organization_created",
      "organization_created",
      "organization_moved",
      "organization_archived",
    ]);
  });
});
