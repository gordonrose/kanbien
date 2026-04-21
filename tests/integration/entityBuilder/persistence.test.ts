import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresEntityBuilderRepository } from "../../../src/features/entityBuilder/persistence/postgresRepository";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";
import { createEntityAttributeInput } from "../../helpers/entityBuilderHarness";

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("entityBuilder postgres repository", () => {
  let pool: Pool;

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
      "entityBuilder",
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ENTITY-BUILDER-EDGE-001 creates replacement versions and keeps current-version resolution historically honest", async () => {
    const repository = createPostgresEntityBuilderRepository(pool);

    const v1 = await repository.createLineageWithVersion({
      entityDefinitionId: "11111111-1111-4111-8111-111111111111",
      entityDefinitionVersionId: "22222222-2222-4222-8222-222222222222",
      entityKey: "customer_profile",
      entityName: "Customer Profile",
      description: "Customer profile durable truth.",
      status: "draft",
      supersedesVersionId: null,
      attributes: [createEntityAttributeInput()],
    });
    const activeV1 = await repository.replaceVersionStatusAndCurrent(
      v1.entityDefinitionVersionId,
      "active",
    );

    const v2 = await repository.createVersionForExistingLineage({
      entityDefinitionId: activeV1.entityDefinitionId,
      entityDefinitionVersionId: "33333333-3333-4333-8333-333333333333",
      entityKey: "customer_profile",
      entityName: "Customer Profile",
      description: "Customer profile durable truth v2.",
      status: "draft",
      supersedesVersionId: activeV1.entityDefinitionVersionId,
      attributes: [
        createEntityAttributeInput({
          attributeKey: "billing_email",
          label: "Billing Email",
          description: "Billing email address.",
        }),
      ],
    });
    const activeV2 = await repository.replaceVersionStatusAndCurrent(
      v2.entityDefinitionVersionId,
      "active",
    );

    const current = await repository.findCurrentVersionByEntityKey("customer_profile");
    const historical = await repository.findVersionById(activeV1.entityDefinitionVersionId);

    expect(current?.entityDefinitionVersionId).toBe(activeV2.entityDefinitionVersionId);
    expect(current?.versionNumber).toBe(2);
    expect(current?.attributes[0]?.attributeKey).toBe("billing_email");

    expect(historical?.entityDefinitionVersionId).toBe(activeV1.entityDefinitionVersionId);
    expect(historical?.status).toBe("superseded");
    expect(historical?.attributes[0]?.attributeKey).toBe("support_email");
  });
});
