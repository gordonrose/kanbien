import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createOrganizationCoreService } from "../../../src/features/organizationCore/domain/service";
import { createPostgresOrganizationCoreRepository } from "../../../src/features/organizationCore/persistence/postgresRepository";
import { createOrganizationLocationsService } from "../../../src/features/organizationLocations/domain/service";
import { createPostgresOrganizationLocationsRepository } from "../../../src/features/organizationLocations/persistence/postgresRepository";
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

describeIfPostgres("organizationLocations postgres persistence", () => {
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
      "organizationLocations",
    ]);

    await createPostgresRootUsersRepository(pool).create({
      rootUserId,
      email: "location-operator@example.test",
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

  it("TC-ORG-S006-INT-001 persists many locations, coordinates, descriptive flags, lifecycle visibility, and audit rows", async () => {
    const organizationCoreService = createOrganizationCoreService(createPostgresOrganizationCoreRepository(pool));
    const service = createOrganizationLocationsService(
      createPostgresOrganizationLocationsRepository(pool),
      organizationCoreService,
    );
    const organization = await organizationCoreService.createOrganization({
      tenantId,
      name: "Location Parent",
      ...actor,
    });

    const headOffice = await service.createLocation({
      tenantId,
      organizationId: organization.organizationId,
      locationName: "Main Office",
      addressSummary: "1 Main Street",
      latitude: 51.5,
      longitude: -0.12,
      isHeadOffice: true,
      isRegisteredOffice: true,
      ...actor,
    });
    const secondHeadOffice = await service.createLocation({
      tenantId,
      organizationId: organization.organizationId,
      locationName: "North Office",
      isHeadOffice: true,
      isRegisteredOffice: false,
      ...actor,
    });
    expect(headOffice.latitude).toBe(51.5);
    expect(headOffice.isHeadOffice).toBe(true);
    expect(secondHeadOffice.isHeadOffice).toBe(true);

    await expect(
      service.createLocation({
        tenantId,
        organizationId: organization.organizationId,
        locationName: "Bad Coordinates",
        latitude: 91,
        longitude: 0,
        isHeadOffice: false,
        isRegisteredOffice: false,
        ...actor,
      }),
    ).rejects.toThrow(/Latitude/);

    const updated = await service.updateLocation({
      tenantId,
      organizationId: organization.organizationId,
      locationId: headOffice.locationId,
      latitude: null,
      longitude: null,
      ...actor,
    });
    expect(updated.latitude).toBeNull();
    expect(updated.longitude).toBeNull();

    await service.archiveLocation({
      tenantId,
      organizationId: organization.organizationId,
      locationId: headOffice.locationId,
      ...actor,
    });
    const visible = await service.listLocations({
      tenantId,
      organizationId: organization.organizationId,
      page: 1,
      pageSize: 25,
      orderBy: "updatedAt",
      orderDirection: "desc",
      includeArchived: false,
    });
    expect(visible.items.map((item) => item.locationId)).toEqual([secondHeadOffice.locationId]);

    const retained = await service.listLocationsForExport({
      tenantId,
      organizationId: organization.organizationId,
      includeArchived: true,
    });
    expect(retained.map((item) => item.locationId).sort()).toEqual([
      headOffice.locationId,
      secondHeadOffice.locationId,
    ].sort());

    const audit = await pool.query<{ event_type: string }>(
      `
        SELECT event_type
        FROM organization_location_audit_event
        WHERE tenant_id = $1
        ORDER BY occurred_at ASC
      `,
      [tenantId],
    );
    expect(audit.rows.map((row) => row.event_type)).toEqual([
      "organization_location_created",
      "organization_location_created",
      "organization_location_updated",
      "organization_location_archived",
    ]);
  });
});
