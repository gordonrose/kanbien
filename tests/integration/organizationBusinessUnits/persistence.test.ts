import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createOrganizationBusinessUnitMembershipsService } from "../../../src/features/organizationBusinessUnitMemberships/domain/service";
import { IndividualMembershipDeferredError } from "../../../src/features/organizationBusinessUnitMemberships/contract/errors";
import { createPostgresOrganizationBusinessUnitMembershipsRepository } from "../../../src/features/organizationBusinessUnitMemberships/persistence/postgresRepository";
import { createOrganizationBusinessUnitsService } from "../../../src/features/organizationBusinessUnits/domain/service";
import { createPostgresOrganizationBusinessUnitsRepository } from "../../../src/features/organizationBusinessUnits/persistence/postgresRepository";
import { createOrganizationCoreService } from "../../../src/features/organizationCore/domain/service";
import { createPostgresOrganizationCoreRepository } from "../../../src/features/organizationCore/persistence/postgresRepository";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { createPostgresTenantsRepository } from "../../../src/features/tenants/persistence/postgresRepository";
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

describeIfPostgres("organizationBusinessUnits postgres persistence", () => {
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
      "organizationBusinessUnits",
      "organizationBusinessUnitMemberships",
    ]);

    await createPostgresRootUsersRepository(pool).create({
      rootUserId,
      email: "business-unit-operator@example.test",
      firstName: "Business",
      lastName: "Operator",
    });
    await createPostgresTenantsRepository(pool).create({
      tenantId,
      bizId: "tenant-business-unit",
      name: "Tenant Business Unit",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: rootUserId,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ORG-S008-S009-INT-001 persists hierarchy, branch archive, business-unit memberships, and individual deferral", async () => {
    const organizationCoreService = createOrganizationCoreService(createPostgresOrganizationCoreRepository(pool));
    const businessUnitsService = createOrganizationBusinessUnitsService(
      createPostgresOrganizationBusinessUnitsRepository(pool),
      organizationCoreService,
    );
    const membershipsService = createOrganizationBusinessUnitMembershipsService(
      createPostgresOrganizationBusinessUnitMembershipsRepository(pool),
      businessUnitsService,
    );
    const organization = await organizationCoreService.createOrganization({
      tenantId,
      name: "Business Unit Parent",
      ...actor,
    });

    const root = await businessUnitsService.createBusinessUnit({
      tenantId,
      organizationId: organization.organizationId,
      name: "Operations",
      ...actor,
    });
    const child = await businessUnitsService.createBusinessUnit({
      tenantId,
      organizationId: organization.organizationId,
      parentBusinessUnitId: root.businessUnitId,
      name: "Field Team",
      ...actor,
    });
    const peer = await businessUnitsService.createBusinessUnit({
      tenantId,
      organizationId: organization.organizationId,
      name: "Support",
      ...actor,
    });

    await expect(
      businessUnitsService.moveBusinessUnit({
        tenantId,
        organizationId: organization.organizationId,
        businessUnitId: root.businessUnitId,
        parentBusinessUnitId: child.businessUnitId,
        ...actor,
      }),
    ).rejects.toMatchObject({ details: { reason: "cycle" } });

    const withChildren = await businessUnitsService.getBusinessUnit({
      tenantId,
      organizationId: organization.organizationId,
      businessUnitId: root.businessUnitId,
    });
    expect(withChildren.childBusinessUnitIds).toEqual([child.businessUnitId]);

    await businessUnitsService.archiveBusinessUnit({
      tenantId,
      organizationId: organization.organizationId,
      businessUnitId: root.businessUnitId,
      childHandling: "moveChildren",
      replacementParentBusinessUnitId: peer.businessUnitId,
      ...actor,
    });
    const movedChild = await businessUnitsService.getBusinessUnit({
      tenantId,
      organizationId: organization.organizationId,
      businessUnitId: child.businessUnitId,
    });
    expect(movedChild.parentBusinessUnitId).toBe(peer.businessUnitId);

    const membership = await membershipsService.createMembership({
      tenantId,
      organizationId: organization.organizationId,
      businessUnitId: peer.businessUnitId,
      memberType: "business_unit",
      memberBusinessUnitId: child.businessUnitId,
      membershipRole: "member",
      ...actor,
    });
    expect(membership.memberBusinessUnitId).toBe(child.businessUnitId);

    await expect(
      membershipsService.createMembership({
        tenantId,
        organizationId: organization.organizationId,
        businessUnitId: peer.businessUnitId,
        memberType: "individual",
        individualUserId: "99999999-9999-4999-8999-999999999999",
        membershipRole: "viewer",
        ...actor,
      }),
    ).rejects.toBeInstanceOf(IndividualMembershipDeferredError);

    const unitAudit = await pool.query<{ event_type: string }>(
      `SELECT event_type FROM organization_business_unit_audit_event WHERE tenant_id = $1 ORDER BY occurred_at ASC`,
      [tenantId],
    );
    expect(unitAudit.rows.map((row) => row.event_type)).toContain("organization_business_unit_archived");
    const membershipAudit = await pool.query<{ event_type: string }>(
      `SELECT event_type FROM organization_business_unit_membership_audit_event WHERE tenant_id = $1`,
      [tenantId],
    );
    expect(membershipAudit.rows.map((row) => row.event_type)).toEqual([
      "organization_business_unit_membership_created",
    ]);
  });
});
