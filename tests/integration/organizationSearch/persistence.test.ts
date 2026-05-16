import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { createPostgresTenantsRepository } from "../../../src/features/tenants/persistence/postgresRepository";
import { createOrganizationCoreService } from "../../../src/features/organizationCore/domain/service";
import { createPostgresOrganizationCoreRepository } from "../../../src/features/organizationCore/persistence/postgresRepository";
import { createPostgresOrganizationSearchRepository } from "../../../src/features/organizationSearch/persistence/postgresRepository";
import { createOrganizationSearchService } from "../../../src/features/organizationSearch/domain/service";
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

describeIfPostgres("organizationSearch postgres persistence", () => {
  let pool: Pool;
  const rootUserId = "11111111-1111-4111-8111-111111111111";
  const tenantId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const otherTenantId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
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
      "assets",
      "organizationCore",
      "organizationLegalDetails",
      "organizationLocations",
      "organizationOpeningHours",
      "organizationBusinessUnits",
      "organizationBusinessUnitMemberships",
      "organizationReferenceCatalogues",
      "organizationSearch",
      "organizationBrandingReferences",
    ]);

    await createPostgresRootUsersRepository(pool).create({
      rootUserId,
      email: "organization-search@example.test",
      firstName: "Organization",
      lastName: "Search",
    });
    const tenants = createPostgresTenantsRepository(pool);
    await tenants.create({
      tenantId,
      bizId: "tenant-search-a",
      name: "Tenant Search A",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: rootUserId,
    });
    await tenants.create({
      tenantId: otherTenantId,
      bizId: "tenant-search-b",
      name: "Tenant Search B",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: rootUserId,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ORG-S013-INT-001 returns grouped, tenant-filtered, deterministic search results", async () => {
    const organizationService = createOrganizationCoreService(createPostgresOrganizationCoreRepository(pool));
    const alpha = await organizationService.createOrganization({
      tenantId,
      name: "Alpha Search Holdings",
      ...actor,
    });
    await organizationService.createOrganization({
      tenantId: otherTenantId,
      name: "Alpha Search Other Tenant",
      ...actor,
    });

    await pool.query(
      `
        INSERT INTO organization_legal_profile (
          organization_legal_profile_id,
          tenant_id,
          organization_id,
          legal_name,
          registration_identifier,
          tax_vat_number,
          registered_address,
          lifecycle_status
        )
        VALUES (gen_random_uuid(), $1, $2, 'Alpha Search Legal Ltd', 'REG-ALPHA', NULL, NULL, 'active')
      `,
      [tenantId, alpha.organizationId],
    );
    await pool.query(
      `
        INSERT INTO organization_location (
          organization_location_id,
          tenant_id,
          organization_id,
          location_name,
          address_summary,
          lifecycle_status
        )
        VALUES (gen_random_uuid(), $1, $2, 'Alpha Search Head Office', 'Search Street', 'active')
      `,
      [tenantId, alpha.organizationId],
    );

    const search = createOrganizationSearchService(createPostgresOrganizationSearchRepository(pool));
    const result = await search.search({
      tenantId,
      actorType: "root-user",
      actorId: rootUserId,
      q: "alpha search",
      lifecycleStatus: "active",
      page: 1,
      pageSize: 10,
      orderBy: "name",
      orderDirection: "asc",
    });

    expect(result.tenantId).toBe(tenantId);
    expect(result.groups.find((group) => group.resultType === "organizations")?.items).toHaveLength(1);
    expect(result.groups.find((group) => group.resultType === "legalProfiles")?.items).toHaveLength(1);
    expect(result.groups.find((group) => group.resultType === "locations")?.items).toHaveLength(1);
    expect(
      result.groups
        .flatMap((group) => group.items)
        .every((item) => item.tenantId === tenantId),
    ).toBe(true);
  });

  it("TC-ORG-S013-INT-002 supports exact result-type and organization filters with stable paging", async () => {
    const organizationService = createOrganizationCoreService(createPostgresOrganizationCoreRepository(pool));
    const alpha = await organizationService.createOrganization({
      tenantId,
      name: "Alpha Unit Parent",
      ...actor,
    });
    const beta = await organizationService.createOrganization({
      tenantId,
      name: "Beta Unit Parent",
      ...actor,
    });
    await pool.query(
      `
        INSERT INTO organization_business_unit (
          organization_business_unit_id,
          tenant_id,
          organization_id,
          name,
          normalized_name,
          lifecycle_status
        )
        VALUES
          (gen_random_uuid(), $1, $2, 'Alpha Unit A', 'alpha unit a', 'active'),
          (gen_random_uuid(), $1, $2, 'Alpha Unit B', 'alpha unit b', 'active'),
          (gen_random_uuid(), $1, $3, 'Beta Unit', 'beta unit', 'active')
      `,
      [tenantId, alpha.organizationId, beta.organizationId],
    );

    const search = createOrganizationSearchService(createPostgresOrganizationSearchRepository(pool));
    const result = await search.search({
      tenantId,
      actorType: "root-user",
      actorId: rootUserId,
      resultType: "businessUnits",
      organizationId: alpha.organizationId,
      lifecycleStatus: "active",
      page: 1,
      pageSize: 1,
      orderBy: "name",
      orderDirection: "asc",
    });

    expect(result.groups).toHaveLength(1);
    expect(result.groups[0]).toMatchObject({
      resultType: "businessUnits",
      page: 1,
      pageSize: 1,
      totalMatchingRecords: 2,
    });
    expect(result.groups[0].items).toHaveLength(1);
    expect(result.groups[0].items[0].title).toBe("Alpha Unit A");
  });
});
