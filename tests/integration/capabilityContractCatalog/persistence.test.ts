import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createCapabilityContractCatalogService } from "../../../src/features/capabilityContractCatalog/domain/service";
import { createPostgresCapabilityContractCatalogRepository } from "../../../src/features/capabilityContractCatalog/persistence/postgresRepository";
import { ExportBlockedError } from "../../../src/features/capabilityContractCatalog/contract/errors";
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

describeIfPostgres("capabilityContractCatalog postgres persistence", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    process.env.CAPABILITY_CATALOG_ARTIFACT_PATH =
      "/tmp/capability-contract-catalog-persistence.generated.json";
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
    await applyPostgresTestMigrations(pool, [
      "rootUsers",
      "platformSecurity",
      "rootAuth",
      "rootRoles",
      "capabilityContractCatalog",
    ]);
  });

  afterAll(async () => {
    delete process.env.CAPABILITY_CATALOG_ARTIFACT_PATH;
    await pool.end();
  });

  it("TC-CAP-CATALOG-INT-003 and TC-CAP-CATALOG-EDGE-007 materialize idempotently into durable rows without changing stable capability ids", async () => {
    const service = createCapabilityContractCatalogService(
      createPostgresCapabilityContractCatalogRepository(pool),
    );

    const first = await service.materializeCapabilityCatalog({});
    const second = await service.materializeCapabilityCatalog({});

    expect(first.insertedCount).toBe(4);
    expect(first.updatedCount).toBe(0);
    expect(second.insertedCount).toBe(0);
    expect(second.updatedCount).toBe(4);

    const records = await pool.query<{
      capability_id: string;
      normalized_hash: string;
    }>("SELECT capability_id, normalized_hash FROM capability_catalog_records ORDER BY capability_id ASC");

    expect(records.rowCount).toBe(4);
    expect(records.rows.map((row) => row.capability_id)).toEqual([
      "notificationDelivery.getOutboundEmail",
      "notificationDelivery.listOutboundEmails",
      "notificationDelivery.resendEmail",
      "notificationDelivery.sendEmail",
    ]);
    expect(new Set(records.rows.map((row) => row.normalized_hash)).size).toBe(4);
  });

  it("TC-CAP-CATALOG-EDGE-005 and TC-CAP-CATALOG-EDGE-006 keep stable persisted contract identity and block strict export on drift", async () => {
    const repository = createPostgresCapabilityContractCatalogRepository(pool);
    const service = createCapabilityContractCatalogService(repository);

    await service.materializeCapabilityCatalog({});
    const before = await repository.findRecordByCapabilityId("notificationDelivery.resendEmail");

    await pool.query(
      "UPDATE capability_catalog_records SET normalized_hash = $2, updated_at = NOW() WHERE capability_id = $1",
      ["notificationDelivery.resendEmail", "drifted-hash"],
    );

    const drift = await service.auditCapabilityCatalogDrift({});
    const resendStatus = drift.find((item) => item.capabilityId === "notificationDelivery.resendEmail");
    const after = await repository.findRecordByCapabilityId("notificationDelivery.resendEmail");

    expect(before?.capabilityId).toBe("notificationDelivery.resendEmail");
    expect(after?.capabilityId).toBe("notificationDelivery.resendEmail");
    expect(resendStatus).toMatchObject({
      capabilityId: "notificationDelivery.resendEmail",
      freshnessStatus: "drifted",
      rematerializationRequired: true,
    });
    await expect(
      service.exportCapabilityCatalogSnapshot({ formatVersion: "v1" }),
    ).rejects.toBeInstanceOf(ExportBlockedError);
  });
});
