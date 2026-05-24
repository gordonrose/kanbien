import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresEntityRepository } from "../../../src/features/entity/persistence/postgresRepository";
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

describeIfPostgres("entity postgres repository", () => {
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
      "entity",
    ]);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ENTITY-PERSIST-001 stores normalized names, enforces current-name uniqueness, and archives without hard delete", async () => {
    const repository = createPostgresEntityRepository(pool);

    const created = await repository.create({
      entityId: "11111111-1111-4111-8111-111111111111",
      name: "  Organization  ",
      description: "Organization instruction seed.",
      status: "active",
    });
    expect(created.normalizedName).toBe("organization");

    await expect(
      repository.create({
        entityId: "22222222-2222-4222-8222-222222222222",
        name: "organization",
        description: "Duplicate current entity.",
        status: "draft",
      }),
    ).rejects.toThrow();

    const archived = await repository.archive(created.entityId);
    expect(archived.status).toBe("archived");
    expect(archived.archivedAt).not.toBeNull();
    expect(await repository.findVisibleById(created.entityId)).toBeNull();
    expect(await repository.findAnyById(created.entityId)).toMatchObject({
      entityId: created.entityId,
      status: "archived",
    });

    await expect(
      repository.create({
        entityId: "33333333-3333-4333-8333-333333333333",
        name: "Organization",
        description: "Replacement current entity.",
        status: "draft",
      }),
    ).resolves.toMatchObject({ normalizedName: "organization" });
  });
});
