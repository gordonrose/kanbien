import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createOrganizationCoreService } from "../../../src/features/organizationCore/domain/service";
import { createPostgresOrganizationCoreRepository } from "../../../src/features/organizationCore/persistence/postgresRepository";
import { createOrganizationLocationsService } from "../../../src/features/organizationLocations/domain/service";
import { createPostgresOrganizationLocationsRepository } from "../../../src/features/organizationLocations/persistence/postgresRepository";
import { createOrganizationOpeningHoursService } from "../../../src/features/organizationOpeningHours/domain/service";
import { createPostgresOrganizationOpeningHoursRepository } from "../../../src/features/organizationOpeningHours/persistence/postgresRepository";
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

describeIfPostgres("organizationOpeningHours postgres persistence", () => {
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
      "organizationOpeningHours",
    ]);

    await createPostgresRootUsersRepository(pool).create({
      rootUserId,
      email: "opening-hours-operator@example.test",
      firstName: "Opening",
      lastName: "Operator",
    });
    await createPostgresTenantsRepository(pool).create({
      tenantId,
      bizId: "tenant-opening-hours",
      name: "Tenant Opening Hours",
      category: "customer",
      status: "live",
      createdByRootAdminUserId: rootUserId,
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ORG-S007-INT-001 persists weekly slots, exceptions, effective hours, and audit rows", async () => {
    const organizationCoreService = createOrganizationCoreService(createPostgresOrganizationCoreRepository(pool));
    const organizationLocationsService = createOrganizationLocationsService(
      createPostgresOrganizationLocationsRepository(pool),
      organizationCoreService,
    );
    const service = createOrganizationOpeningHoursService(
      createPostgresOrganizationOpeningHoursRepository(pool),
      organizationLocationsService,
    );
    const organization = await organizationCoreService.createOrganization({
      tenantId,
      name: "Opening Hours Parent",
      ...actor,
    });
    const location = await organizationLocationsService.createLocation({
      tenantId,
      organizationId: organization.organizationId,
      locationName: "Main Office",
      isHeadOffice: true,
      isRegisteredOffice: false,
      ...actor,
    });

    await service.createWeeklySlot({
      tenantId,
      organizationId: organization.organizationId,
      locationId: location.locationId,
      weekday: 1,
      slotOrder: 1,
      opensAtLocalTime: "09:00",
      closesAtLocalTime: "12:00",
      ...actor,
    });
    await service.createWeeklySlot({
      tenantId,
      organizationId: organization.organizationId,
      locationId: location.locationId,
      weekday: 1,
      slotOrder: 2,
      opensAtLocalTime: "13:00",
      closesAtLocalTime: "17:00",
      ...actor,
    });

    const weekly = await service.listWeeklySlots({
      tenantId,
      organizationId: organization.organizationId,
      locationId: location.locationId,
      page: 1,
      pageSize: 25,
      orderBy: "weekday",
      orderDirection: "asc",
    });
    expect(weekly.items.map((slot) => slot.opensAtLocalTime)).toEqual(["09:00", "13:00"]);

    await service.createException({
      tenantId,
      organizationId: organization.organizationId,
      locationId: location.locationId,
      exceptionType: "replacement_day_schedule",
      startsOnLocalDate: "2026-05-18",
      replacementSlots: [{ slotOrder: 1, opensAtLocalTime: "10:00", closesAtLocalTime: "14:00" }],
      reason: "Special Monday",
      ...actor,
    });
    await expect(
      service.getEffectiveOpeningHours({
        tenantId,
        organizationId: organization.organizationId,
        locationId: location.locationId,
        localDate: "2026-05-18",
      }),
    ).resolves.toMatchObject({
      appliedExceptionType: "replacement_day_schedule",
      slots: [{ slotOrder: 1, opensAtLocalTime: "10:00", closesAtLocalTime: "14:00" }],
    });

    const exceptionRows = await pool.query<{ reason: string; replacement_slots: unknown }>(
      `
        SELECT reason, replacement_slots
        FROM organization_opening_hours_exception
        WHERE tenant_id = $1
      `,
      [tenantId],
    );
    expect(exceptionRows.rows).toHaveLength(1);
    expect(exceptionRows.rows[0]?.reason).toBe("Special Monday");

    const audit = await pool.query<{ event_type: string }>(
      `
        SELECT event_type
        FROM organization_opening_hours_audit_event
        WHERE tenant_id = $1
        ORDER BY occurred_at ASC
      `,
      [tenantId],
    );
    expect(audit.rows.map((row) => row.event_type)).toEqual([
      "organization_weekly_hours_slot_created",
      "organization_weekly_hours_slot_created",
      "organization_opening_hours_exception_created",
    ]);
  });
});
