import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { createRootAuthService } from "../../../src/features/rootAuth/domain/service";
import { createPostgresRootAuthRepository } from "../../../src/features/rootAuth/persistence/postgresRepository";
import { createPostgresRootUsersRepository } from "../../../src/features/rootUsers/persistence/postgresRepository";
import { createRootUsersAuthStateReader } from "../../../src/features/rootUsers/authState";
import { createPostgresPlatformSecurityRepository } from "../../../src/lib/security/postgresRepository";
import {
  applyPostgresTestMigrations,
  readPostgresTestBootstrapPassword,
} from "../../harness/postgres/migrations";
import {
  createPostgresTestDatabasePool,
  hasPostgresTestDatabaseConfig,
  resetPostgresTestDatabaseForRoutineIsolation,
} from "../../harness/postgres/testDatabase";

interface AuthPrincipalStorageRow {
  auth_principal_id: string;
  login_email_normalized: string;
  password_hash: string;
}

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

describeIfPostgres("rootAuth postgres-backed secret handling", () => {
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

  it("TC-ROOT-AUTH-SEC-007 stores hashed passwords and keeps bootstrap secrets out of audit rows", async () => {
    const rootUsersRepository = createPostgresRootUsersRepository(pool);

    await applyPostgresTestMigrations(pool, ["rootUsers"]);
    const bootstrappedRootUser = await rootUsersRepository.create({
      rootUserId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      email: "bootstrap-root@example.test",
      firstName: "Bootstrap",
      lastName: "Root",
    });

    await applyPostgresTestMigrations(pool, ["platformSecurity", "rootAuth"]);

    const bootstrapPassword = readPostgresTestBootstrapPassword();
    const bootstrapPrincipal = await pool.query<AuthPrincipalStorageRow>(
      `
        SELECT auth_principal_id, login_email_normalized, password_hash
        FROM auth_principals
        WHERE login_email_normalized = $1
      `,
      [bootstrappedRootUser.email],
    );

    expect(bootstrapPrincipal.rowCount).toBe(1);
    expect(bootstrapPrincipal.rows[0].password_hash).not.toBe(bootstrapPassword);
    expect(bootstrapPrincipal.rows[0].login_email_normalized).toBe(bootstrappedRootUser.email);

    const bootstrapPasswordAccepted = await pool.query<{ accepted: boolean }>(
      `
        SELECT (password_hash = crypt($2, password_hash)) AS accepted
        FROM auth_principals
        WHERE auth_principal_id = $1
      `,
      [bootstrapPrincipal.rows[0].auth_principal_id, bootstrapPassword],
    );
    expect(bootstrapPasswordAccepted.rows[0]?.accepted).toBe(true);

    const bootstrapAudit = await pool.query<AuthAuditEventRow>(
      `
        SELECT *
        FROM auth_audit_events
        WHERE root_user_id = $1
          AND event_type = 'bootstrap_migration_applied'
      `,
      [bootstrappedRootUser.rootUserId],
    );

    expect(bootstrapAudit.rowCount).toBe(1);
    expect(JSON.stringify(bootstrapAudit.rows[0])).not.toContain(bootstrapPassword);

    const authRepository = createPostgresRootAuthRepository(pool);
    const platformSecurityRepository = createPostgresPlatformSecurityRepository(pool);
    const rootUsersAuthStateReader = createRootUsersAuthStateReader(pool);
    const service = createRootAuthService(
      authRepository,
      rootUsersAuthStateReader,
      platformSecurityRepository,
    );

    const serviceRootUser = await rootUsersRepository.create({
      rootUserId: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      email: "service-root@example.test",
      firstName: "Service",
      lastName: "Root",
    });
    const plaintextPassword = "PlaintextPass1!";

    const principal = await service.createRootUserAuthPrincipal({
      rootUserId: serviceRootUser.rootUserId,
      loginEmail: serviceRootUser.email,
      password: plaintextPassword,
      ipAddress: "127.0.0.1",
      userAgent: "vitest-postgres",
    });

    const persistedPrincipal = await pool.query<AuthPrincipalStorageRow>(
      `
        SELECT auth_principal_id, login_email_normalized, password_hash
        FROM auth_principals
        WHERE auth_principal_id = $1
      `,
      [principal.authPrincipalId],
    );

    expect(persistedPrincipal.rowCount).toBe(1);
    expect(persistedPrincipal.rows[0].password_hash).not.toBe(plaintextPassword);
    expect(persistedPrincipal.rows[0].login_email_normalized).toBe(serviceRootUser.email);
    expect(await authRepository.verifyPassword(principal.authPrincipalId, plaintextPassword)).toBe(true);

    const serviceAudit = await pool.query<AuthAuditEventRow>(
      `
        SELECT *
        FROM auth_audit_events
        WHERE auth_principal_id = $1
          AND event_type = 'auth_principal_created'
      `,
      [principal.authPrincipalId],
    );

    expect(serviceAudit.rowCount).toBe(1);
    expect(JSON.stringify(serviceAudit.rows[0])).not.toContain(plaintextPassword);
  });
});
