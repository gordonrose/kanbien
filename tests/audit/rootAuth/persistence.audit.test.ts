import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { applyPostgresTestMigrations } from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabase,
} from "../../harness/postgres/testDatabase";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";

interface AuthAuditEventRow {
  event_id: string;
  auth_principal_id: string | null;
  root_user_id: string | null;
  event_type: string;
  event_outcome: string;
  ip_address: string | null;
  user_agent: string | null;
  occurred_at: Date;
}

const describeIfPostgres =
  process.env.RUN_POSTGRES_TESTS === "true" && hasPostgresTestDatabaseConfig()
    ? describe
    : describe.skip;

describeIfPostgres("rootAuth postgres-backed audit visibility", () => {
  let pool: Pool;

  beforeAll(async () => {
    pool = createPostgresTestDatabasePool();
  });

  beforeEach(async () => {
    await resetPostgresTestDatabase(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("TC-ROOT-AUTH-AUD-008 creates one durable bootstrap audit event even when rootAuth migrations rerun", async () => {
    const rootUsersRepository = createPostgresRootUsersRepository(pool);

    await applyPostgresTestMigrations(pool, ["rootUsers"]);
    const rootUser = await rootUsersRepository.create({
      rootUserId: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      email: "bootstrap-audit@example.test",
      firstName: "Bootstrap",
      lastName: "Audit",
    });

    await applyPostgresTestMigrations(pool, ["platformSecurity", "rootAuth"]);
    await applyPostgresTestMigrations(pool, ["rootAuth"]);

    const auditEvents = await pool.query<AuthAuditEventRow>(
      `
        SELECT *
        FROM auth_audit_events
        WHERE root_user_id = $1
          AND event_type = 'bootstrap_migration_applied'
        ORDER BY occurred_at ASC
      `,
      [rootUser.rootUserId],
    );

    expect(auditEvents.rowCount).toBe(1);
    expect(auditEvents.rows[0]).toMatchObject({
      root_user_id: rootUser.rootUserId,
      event_type: "bootstrap_migration_applied",
      event_outcome: "success",
      ip_address: null,
      user_agent: null,
    });
  });
});
