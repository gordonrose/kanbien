import { config as loadEnv } from "dotenv";
import { Client } from "pg";

loadEnv({ path: ".env", override: false, quiet: true });
loadEnv({ path: ".env.test", override: false, quiet: true });
loadEnv({ path: ".env.test.local", override: true, quiet: true });

function requireValue(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  throw new Error(`Environment variable must be 'true' or 'false', received: ${value}`);
}

function readNumber(value: string | undefined, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable must be numeric, received: ${value}`);
  }

  return parsed;
}

function escapeIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, "\"\"")}"`;
}

function readTestDatabaseConfig() {
  const host = requireValue("TEST_DATABASE_HOST", process.env.TEST_DATABASE_HOST);
  const port = readNumber(process.env.TEST_DATABASE_PORT, 5432);
  const database = requireValue("TEST_DATABASE_NAME", process.env.TEST_DATABASE_NAME);
  const user = requireValue("TEST_DATABASE_USER", process.env.TEST_DATABASE_USER);
  const password = requireValue("TEST_DATABASE_PASSWORD", process.env.TEST_DATABASE_PASSWORD);
  const ssl = readBoolean(process.env.TEST_DATABASE_SSL, false);

  return {
    host,
    port,
    database,
    user,
    password,
    ssl,
  };
}

function readAdminDatabaseConfig(testConfig: ReturnType<typeof readTestDatabaseConfig>) {
  return {
    host: process.env.TEST_DATABASE_ADMIN_HOST ?? testConfig.host,
    port: readNumber(process.env.TEST_DATABASE_ADMIN_PORT, testConfig.port),
    database: process.env.TEST_DATABASE_ADMIN_DB ?? "postgres",
    user: process.env.TEST_DATABASE_ADMIN_USER ?? testConfig.user,
    password: process.env.TEST_DATABASE_ADMIN_PASSWORD ?? testConfig.password,
    ssl: readBoolean(process.env.TEST_DATABASE_ADMIN_SSL, testConfig.ssl),
  };
}

async function ensureTestDatabase(): Promise<void> {
  const testConfig = readTestDatabaseConfig();
  const adminConfig = readAdminDatabaseConfig(testConfig);

  const adminClient = new Client({
    host: adminConfig.host,
    port: adminConfig.port,
    database: adminConfig.database,
    user: adminConfig.user,
    password: adminConfig.password,
    ssl: adminConfig.ssl ? { rejectUnauthorized: false } : false,
  });

  await adminClient.connect();

  try {
    const existing = await adminClient.query<{ datname: string }>(
      "SELECT datname FROM pg_database WHERE datname = $1",
      [testConfig.database],
    );

    if (existing.rowCount && existing.rowCount > 0) {
      console.log(`Test database already exists: ${testConfig.database}`);
      return;
    }

    await adminClient.query(`CREATE DATABASE ${escapeIdentifier(testConfig.database)}`);
    console.log(`Created test database: ${testConfig.database}`);
  } finally {
    await adminClient.end();
  }
}

ensureTestDatabase().catch((error: unknown) => {
  console.error("Failed to ensure test database", error);
  process.exit(1);
});
