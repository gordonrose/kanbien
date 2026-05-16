import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createOrganizationCoreService } from "../../../src/features/organizationCore/domain/service";
import { createPostgresOrganizationCoreRepository } from "../../../src/features/organizationCore/persistence/postgresRepository";
import { createOrganizationLegalDetailsService } from "../../../src/features/organizationLegalDetails/domain/service";
import { createPostgresOrganizationLegalDetailsRepository } from "../../../src/features/organizationLegalDetails/persistence/postgresRepository";
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

describeIfPostgres("organizationLegalDetails postgres persistence", () => {
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
      "organizationLegalDetails",
    ]);

    await createPostgresRootUsersRepository(pool).create({
      rootUserId,
      email: "legal-profile-operator@example.test",
      firstName: "Legal",
      lastName: "Operator",
    });
    await createPostgresTenantsRepository(pool).create({
      tenantId,
      bizId: "tenant-legal",
      name: "Tenant Legal",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: rootUserId,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ORG-S005-INT-001 enforces one active legal profile, lifecycle visibility, nullable fields, and audit rows", async () => {
    const organizationCoreService = createOrganizationCoreService(createPostgresOrganizationCoreRepository(pool));
    const service = createOrganizationLegalDetailsService(
      createPostgresOrganizationLegalDetailsRepository(pool),
      organizationCoreService,
    );
    const organization = await organizationCoreService.createOrganization({
      tenantId,
      name: "Legal Parent",
      ...actor,
    });

    const profile = await service.createLegalProfile({
      tenantId,
      organizationId: organization.organizationId,
      legalName: " Legal Parent Ltd ",
      registrationIdentifier: "REG-001",
      taxVatNumber: "VAT-001",
      registeredAddress: "1 Registered Street",
      ...actor,
    });
    expect(profile.taxVatNumber).toBe("VAT-001");

    await expect(
      service.createLegalProfile({
        tenantId,
        organizationId: organization.organizationId,
        legalName: "Second Legal Parent Ltd",
        ...actor,
      }),
    ).rejects.toThrow(/active legal profile/);

    const updated = await service.updateLegalProfile({
      tenantId,
      organizationId: organization.organizationId,
      legalProfileId: profile.legalProfileId,
      taxVatNumber: null,
      registeredAddress: null,
      ...actor,
    });
    expect(updated.taxVatNumber).toBeNull();
    expect(updated.registeredAddress).toBeNull();

    await service.archiveLegalProfile({
      tenantId,
      organizationId: organization.organizationId,
      legalProfileId: profile.legalProfileId,
      ...actor,
    });
    const visible = await service.listLegalProfiles({
      tenantId,
      organizationId: organization.organizationId,
      page: 1,
      pageSize: 25,
      orderBy: "updatedAt",
      orderDirection: "desc",
      includeArchived: false,
    });
    expect(visible.items).toHaveLength(0);

    const retained = await service.listLegalProfilesForExport({
      tenantId,
      organizationId: organization.organizationId,
      includeArchived: true,
    });
    expect(retained.map((item) => item.legalProfileId)).toEqual([profile.legalProfileId]);

    const audit = await pool.query<{ event_type: string }>(
      `
        SELECT event_type
        FROM organization_legal_profile_audit_event
        WHERE tenant_id = $1
        ORDER BY occurred_at ASC
      `,
      [tenantId],
    );
    expect(audit.rows.map((row) => row.event_type)).toEqual([
      "organization_legal_profile_created",
      "organization_legal_profile_updated",
      "organization_legal_profile_archived",
    ]);
  });
});
