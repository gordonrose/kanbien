import { Pool } from "pg";

function hasValue(value: string | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!hasValue(value)) {
    return fallback;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`Invalid boolean environment value: ${value}`);
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (!hasValue(value)) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric environment value: ${value}`);
  }

  return parsed;
}

export interface PostgresTestDatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

export function hasPostgresTestDatabaseConfig(): boolean {
  return [
    process.env.TEST_DATABASE_HOST,
    process.env.TEST_DATABASE_NAME,
    process.env.TEST_DATABASE_USER,
    process.env.TEST_DATABASE_PASSWORD,
  ].every(hasValue);
}

export function readPostgresTestDatabaseConfig(): PostgresTestDatabaseConfig {
  if (!hasPostgresTestDatabaseConfig()) {
    throw new Error(
      "Missing test database configuration. Set TEST_DATABASE_HOST, TEST_DATABASE_NAME, TEST_DATABASE_USER, and TEST_DATABASE_PASSWORD.",
    );
  }

  return {
    host: process.env.TEST_DATABASE_HOST!,
    port: parseNumber(process.env.TEST_DATABASE_PORT, 5432),
    database: process.env.TEST_DATABASE_NAME!,
    user: process.env.TEST_DATABASE_USER!,
    password: process.env.TEST_DATABASE_PASSWORD!,
    ssl: parseBoolean(process.env.TEST_DATABASE_SSL, false),
  };
}

export function createPostgresTestDatabasePool(): Pool {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Postgres-backed tests may only run when NODE_ENV=test.");
  }

  const config = readPostgresTestDatabaseConfig();
  return new Pool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
  });
}

export async function resetPostgresTestDatabase(pool: Pool): Promise<void> {
  await pool.query(`
    DROP TABLE IF EXISTS auth_audit_events CASCADE;
    DROP TABLE IF EXISTS auth_sessions CASCADE;
    DROP TABLE IF EXISTS auth_login_challenges CASCADE;
    DROP TABLE IF EXISTS auth_ssh_public_keys CASCADE;
    DROP TABLE IF EXISTS auth_principal_root_user_links CASCADE;
    DROP TABLE IF EXISTS auth_principals CASCADE;
    DROP TABLE IF EXISTS root_users CASCADE;
    DROP TABLE IF EXISTS platform_security_lockdowns CASCADE;
    DROP TABLE IF EXISTS platform_security_counters CASCADE;
    DROP TABLE IF EXISTS schema_migrations CASCADE;
  `);
}
