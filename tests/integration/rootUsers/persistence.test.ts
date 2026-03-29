import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

interface SearchColumnsRow {
  normalized_email: string;
  normalized_first_name: string | null;
  normalized_last_name: string | null;
}

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("rootUsers postgres repository", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
    await applyPostgresTestMigrations(pool, ["rootUsers"]);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("stores normalized search columns and respects visibility scopes", async () => {
    const repository = createPostgresRootUsersRepository(pool);

    const activeUser = await repository.create({
      rootUserId: "11111111-1111-4111-8111-111111111111",
      email: "  Ada.Admin@Example.com ",
      firstName: "  Ada ",
      lastName: "  Admin ",
    });
    const deletedUser = await repository.create({
      rootUserId: "22222222-2222-4222-8222-222222222222",
      email: "deleted@example.com",
      firstName: "Deleted",
      lastName: "User",
    });
    const anonymizedUser = await repository.create({
      rootUserId: "33333333-3333-4333-8333-333333333333",
      email: "remove@example.com",
      firstName: "Remove",
      lastName: "User",
    });

    await repository.softDelete(deletedUser.rootUserId);
    await repository.remove(
      anonymizedUser.rootUserId,
      "anon@example.test",
      "Anon",
      "User",
    );

    const storedColumns = await pool.query<SearchColumnsRow>(
      `
        SELECT normalized_email, normalized_first_name, normalized_last_name
        FROM root_users
        WHERE root_user_id = $1
      `,
      [activeUser.rootUserId],
    );

    expect(storedColumns.rows[0]).toEqual({
      normalized_email: "ada.admin@example.com",
      normalized_first_name: "ada",
      normalized_last_name: "admin",
    });

    const visibleByEmail = await repository.findVisibleByEmail("  ADA.ADMIN@example.COM ");
    const deletedVisible = await repository.findVisibleById(deletedUser.rootUserId);
    const anonymizedVisible = await repository.findVisibleById(anonymizedUser.rootUserId);

    expect(visibleByEmail?.rootUserId).toBe(activeUser.rootUserId);
    expect(deletedVisible).toBeNull();
    expect(anonymizedVisible).toBeNull();

    const allUsers = await repository.listAll({
      page: 1,
      pageSize: 25,
      orderBy: "email",
      orderDirection: "asc",
      filters: {},
    });
    const activeUsers = await repository.listActive({
      page: 1,
      pageSize: 25,
      orderBy: "email",
      orderDirection: "asc",
      filters: {},
    });
    const deletedUsers = await repository.listDeleted({
      page: 1,
      pageSize: 25,
      orderBy: "email",
      orderDirection: "asc",
      filters: {},
    });
    const deletedVisibleOnly = await repository.listDeleted({
      page: 1,
      pageSize: 25,
      orderBy: "email",
      orderDirection: "asc",
      filters: { excludeAnonymized: true },
    });

    expect(allUsers.items.map((item) => item.rootUserId)).toEqual([
      activeUser.rootUserId,
      deletedUser.rootUserId,
    ]);
    expect(allUsers.totalSearchableRecords).toBe(2);
    expect(allUsers.totalMatchingRecords).toBe(2);

    expect(activeUsers.items.map((item) => item.rootUserId)).toEqual([activeUser.rootUserId]);
    expect(activeUsers.totalSearchableRecords).toBe(1);
    expect(activeUsers.totalMatchingRecords).toBe(1);

    expect(deletedUsers.items.map((item) => item.rootUserId)).toEqual([
      anonymizedUser.rootUserId,
      deletedUser.rootUserId,
    ]);
    expect(deletedUsers.totalSearchableRecords).toBe(2);
    expect(deletedVisibleOnly.items.map((item) => item.rootUserId)).toEqual([
      deletedUser.rootUserId,
    ]);
  });

  it("returns auth-state and filtered list results consistently from postgres", async () => {
    const repository = createPostgresRootUsersRepository(pool);

    const activeUser = await repository.create({
      rootUserId: "44444444-4444-4444-8444-444444444444",
      email: "active@example.com",
      firstName: "Ada",
      lastName: "Active",
    });
    const inactiveDeletedUser = await repository.create({
      rootUserId: "55555555-5555-4555-8555-555555555555",
      email: "inactive.deleted@example.com",
      firstName: "Ina",
      lastName: "Deleted",
    });
    const anonymizedDeletedUser = await repository.create({
      rootUserId: "66666666-6666-4666-8666-666666666666",
      email: "anon.deleted@example.com",
      firstName: "Ano",
      lastName: "Deleted",
    });

    await repository.softDelete(inactiveDeletedUser.rootUserId);
    await repository.remove(
      anonymizedDeletedUser.rootUserId,
      "anonymized@example.test",
      "Anon",
      "Deleted",
    );

    const activeState = await repository.findAuthStateById(activeUser.rootUserId);
    const deletedState = await repository.findAuthStateById(inactiveDeletedUser.rootUserId);
    const anonymizedState = await repository.findAuthStateById(anonymizedDeletedUser.rootUserId);

    expect(activeState).toMatchObject({
      rootUserId: activeUser.rootUserId,
      status: "active",
      anonymized: false,
      deletedAt: null,
    });
    expect(deletedState).toMatchObject({
      rootUserId: inactiveDeletedUser.rootUserId,
      status: "inactive",
      anonymized: false,
    });
    expect(deletedState?.deletedAt).not.toBeNull();
    expect(anonymizedState).toMatchObject({
      rootUserId: anonymizedDeletedUser.rootUserId,
      status: "inactive",
      anonymized: true,
    });
    expect(anonymizedState?.deletedAt).not.toBeNull();

    const filteredDeleted = await repository.listDeleted({
      page: 1,
      pageSize: 25,
      orderBy: "updatedAt",
      orderDirection: "desc",
      filters: {
        emailPrefix: "inactive",
        firstNamePrefix: "ina",
        lastNamePrefix: "del",
        excludeAnonymized: true,
      },
    });

    expect(filteredDeleted.items.map((item) => item.rootUserId)).toEqual([
      inactiveDeletedUser.rootUserId,
    ]);
    expect(filteredDeleted.totalSearchableRecords).toBe(1);
    expect(filteredDeleted.totalMatchingRecords).toBe(1);
  });
});
