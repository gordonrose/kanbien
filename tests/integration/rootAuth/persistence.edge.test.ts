import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";

interface IdRow {
  auth_principal_id: string;
}

interface CountRow {
  count: string;
}

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("rootAuth postgres-backed edge cases", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    await resetPostgresTestDatabaseForRoutineIsolation(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ROOT-AUTH-EDGE-008 reruns bootstrap safely without duplicating artifacts and repairs partial existing state", async () => {
    const rootUsersRepository = createPostgresRootUsersRepository(pool);

    await applyPostgresTestMigrations(pool, ["rootUsers"]);
    const rootUser = await rootUsersRepository.create({
      rootUserId: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      email: "bootstrap-edge@example.test",
      firstName: "Bootstrap",
      lastName: "Edge",
    });

    await applyPostgresTestMigrations(pool, ["platformSecurity", "rootAuth"]);

    const principalResult = await pool.query<IdRow>(
      `
        SELECT auth_principal_id
        FROM auth_principals
        WHERE login_email_normalized = $1
      `,
      [rootUser.email],
    );
    expect(principalResult.rowCount).toBe(1);
    const authPrincipalId = principalResult.rows[0].auth_principal_id;

    await pool.query(
      `DELETE FROM auth_audit_events WHERE root_user_id = $1 AND event_type = 'bootstrap_migration_applied'`,
      [rootUser.rootUserId],
    );
    await pool.query(
      `DELETE FROM auth_ssh_public_keys WHERE auth_principal_id = $1 AND label = 'bootstrap'`,
      [authPrincipalId],
    );
    await pool.query(
      `DELETE FROM auth_principal_root_user_links WHERE auth_principal_id = $1`,
      [authPrincipalId],
    );

    await applyPostgresTestMigrations(pool, ["rootAuth"]);

    const [principalCount, linkCount, keyCount, eventCount] = await Promise.all([
      pool.query<CountRow>(
        `SELECT COUNT(*)::text AS count FROM auth_principals WHERE login_email_normalized = $1`,
        [rootUser.email],
      ),
      pool.query<CountRow>(
        `SELECT COUNT(*)::text AS count FROM auth_principal_root_user_links WHERE root_user_id = $1`,
        [rootUser.rootUserId],
      ),
      pool.query<CountRow>(
        `SELECT COUNT(*)::text AS count FROM auth_ssh_public_keys WHERE auth_principal_id = $1 AND label = 'bootstrap'`,
        [authPrincipalId],
      ),
      pool.query<CountRow>(
        `SELECT COUNT(*)::text AS count FROM auth_audit_events WHERE root_user_id = $1 AND event_type = 'bootstrap_migration_applied'`,
        [rootUser.rootUserId],
      ),
    ]);

    expect(Number(principalCount.rows[0].count)).toBe(1);
    expect(Number(linkCount.rows[0].count)).toBe(1);
    expect(Number(keyCount.rows[0].count)).toBe(1);
    expect(Number(eventCount.rows[0].count)).toBe(1);
  });
});
