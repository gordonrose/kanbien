import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { OrganizationReferenceReplacementInvalidError } from "../../../src/features/organizationReferenceCatalogues/contract/errors";
import { createOrganizationReferenceCataloguesService } from "../../../src/features/organizationReferenceCatalogues/domain/service";
import { createPostgresOrganizationReferenceCataloguesRepository } from "../../../src/features/organizationReferenceCatalogues/persistence/postgresRepository";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
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

describeIfPostgres("organizationReferenceCatalogues postgres persistence", () => {
  let pool: Pool;
  const rootUserId = "11111111-1111-4111-8111-111111111111";
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
      "organizationReferenceCatalogues",
    ]);

    await createPostgresRootUsersRepository(pool).create({
      rootUserId,
      email: "reference-value-operator@example.test",
      firstName: "Reference",
      lastName: "Operator",
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ORG-FOUNDATION-UNIT-012 TC-ORG-FOUNDATION-INT-008 preserves reference value lifecycle, replacement, tenant-use filtering, and audit evidence", async () => {
    const service = createOrganizationReferenceCataloguesService(
      createPostgresOrganizationReferenceCataloguesRepository(pool),
    );

    const charity = await service.createReferenceValue({
      referenceType: " Organization Type ",
      referenceValueKey: " Charity ",
      label: "Charity",
      ...actor,
    });
    const nonprofit = await service.createReferenceValue({
      referenceType: "organization type",
      referenceValueKey: "non-profit",
      label: "Non-profit",
      ...actor,
    });

    expect(charity.referenceType).toBe("organization type");
    expect(charity.referenceValueKey).toBe("charity");

    const renamed = await service.updateReferenceValueLabel({
      referenceValueId: charity.referenceValueId,
      label: "Registered Charity",
      ...actor,
    });
    expect(renamed.label).toBe("Registered Charity");

    const deprecated = await service.deprecateReferenceValue({
      referenceValueId: charity.referenceValueId,
      ...actor,
    });
    expect(deprecated.lifecycleStatus).toBe("deprecated");
    expect(deprecated.deprecatedAt).not.toBeNull();

    const activeOnly = await service.listReferenceValues({
      referenceType: "organization type",
      includeRetained: false,
      page: 1,
      pageSize: 25,
      orderBy: "label",
      orderDirection: "asc",
    });
    expect(activeOnly.items.map((item) => item.referenceValueId)).toEqual([nonprofit.referenceValueId]);

    const replaced = await service.replaceReferenceValue({
      referenceValueId: charity.referenceValueId,
      replacementReferenceValueId: nonprofit.referenceValueId,
      ...actor,
    });
    expect(replaced.lifecycleStatus).toBe("replaced");
    expect(replaced.replacementReferenceValueId).toBe(nonprofit.referenceValueId);

    await expect(
      service.replaceReferenceValue({
        referenceValueId: nonprofit.referenceValueId,
        replacementReferenceValueId: nonprofit.referenceValueId,
        ...actor,
      }),
    ).rejects.toBeInstanceOf(OrganizationReferenceReplacementInvalidError);

    const retained = await service.listReferenceValues({
      referenceType: "organization type",
      includeRetained: true,
      page: 1,
      pageSize: 25,
      orderBy: "label",
      orderDirection: "asc",
    });
    expect(retained.items.map((item) => item.lifecycleStatus).sort()).toEqual(["active", "replaced"]);

    const audit = await pool.query<{ event_type: string }>(
      `SELECT event_type FROM organization_reference_value_audit_event ORDER BY occurred_at ASC`,
    );
    expect(audit.rows.map((row) => row.event_type)).toEqual([
      "organization_reference_value_created",
      "organization_reference_value_created",
      "organization_reference_value_label_updated",
      "organization_reference_value_deprecated",
      "organization_reference_value_replaced",
    ]);
  });
});
