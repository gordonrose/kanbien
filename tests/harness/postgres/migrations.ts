import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Pool } from "pg";

type MigrationGroup =
  | "rootUsers"
  | "platformSecurity"
  | "rootAuth"
  | "rootRoles"
  | "tenants"
  | "notificationDelivery"
  | "tenantAdmins"
  | "tenantAuth"
  | "tenantConfiguration";

interface TestMigrationFile {
  filename: string;
  filepath: string;
  group: MigrationGroup;
  sql: string;
  checksum: string;
}

const MIGRATIONS_TABLE = "schema_migrations";
const FEATURES_ROOT = path.resolve(process.cwd(), "src", "features");
const DEFAULT_BOOTSTRAP_PASSWORD = "@Nima2or1!";
const DEFAULT_BOOTSTRAP_SSH_PUBLIC_KEY =
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEZeNv6aKKHqLJQQoqsHUhYyFMFFbE8WWvgDSFH0WJiq gordon@<machine-name>";

const MIGRATION_ORDER: Array<{ group: MigrationGroup; relativePath: string }> = [
  {
    group: "rootUsers",
    relativePath: "rootUsers/persistence/migrations/001_create_root_users.sql",
  },
  {
    group: "rootUsers",
    relativePath: "rootUsers/persistence/migrations/002_align_root_users_normalized_columns.sql",
  },
  {
    group: "platformSecurity",
    relativePath: "platformSecurity/persistence/migrations/0001_create_platform_security_controls.sql",
  },
  {
    group: "rootAuth",
    relativePath: "rootAuth/persistence/migrations/0002_create_root_auth.sql",
  },
  {
    group: "rootAuth",
    relativePath: "rootAuth/persistence/migrations/0003_repair_root_auth_bootstrap.sql",
  },
  {
    group: "rootAuth",
    relativePath: "rootAuth/persistence/migrations/0004_backfill_root_auth_bootstrap_keys_and_events.sql",
  },
  {
    group: "rootRoles",
    relativePath: "rootRoles/persistence/migrations/0005_create_root_roles.sql",
  },
  {
    group: "tenants",
    relativePath: "tenants/persistence/migrations/0006_create_tenants.sql",
  },
  {
    group: "notificationDelivery",
    relativePath: "notificationDelivery/persistence/migrations/0007_create_notification_delivery.sql",
  },
  {
    group: "tenantAdmins",
    relativePath: "tenantAdmins/persistence/migrations/0008_create_tenant_admins.sql",
  },
  {
    group: "tenantAuth",
    relativePath: "tenantAuth/persistence/migrations/0009_create_tenant_auth.sql",
  },
  {
    group: "tenantConfiguration",
    relativePath: "tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql",
  },
  {
    group: "tenantConfiguration",
    relativePath: "tenantConfiguration/persistence/migrations/0012_add_session_ttl_to_tenant_auth_policy.sql",
  },
];

function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

function computeSshPublicKeyFingerprint(publicKeyOpenSsh: string): string {
  const parts = publicKeyOpenSsh.trim().split(/\s+/);
  const keyBody = parts[1];

  if (!keyBody) {
    throw new Error("TEST_ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY is not a valid OpenSSH public key");
  }

  return `SHA256:${createHash("sha256")
    .update(Buffer.from(keyBody, "base64"))
    .digest("base64")
    .replace(/=+$/g, "")}`;
}

function getBootstrapPassword(): string {
  return process.env.TEST_ROOT_AUTH_BOOTSTRAP_PASSWORD ?? DEFAULT_BOOTSTRAP_PASSWORD;
}

function getBootstrapSshPublicKey(): string {
  return process.env.TEST_ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY ?? DEFAULT_BOOTSTRAP_SSH_PUBLIC_KEY;
}

function renderMigrationSql(sql: string): string {
  const bootstrapSshPublicKey = getBootstrapSshPublicKey();

  return sql
    .replace(/{{ROOT_AUTH_BOOTSTRAP_PASSWORD}}/g, escapeSqlLiteral(getBootstrapPassword()))
    .replace(
      /{{ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY}}/g,
      escapeSqlLiteral(bootstrapSshPublicKey),
    )
    .replace(
      /{{ROOT_AUTH_BOOTSTRAP_SSH_FINGERPRINT}}/g,
      escapeSqlLiteral(computeSshPublicKeyFingerprint(bootstrapSshPublicKey)),
    );
}

async function ensureMigrationsTable(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      migration_name TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function readMigration(relativePath: string, group: MigrationGroup): Promise<TestMigrationFile> {
  const filepath = path.resolve(FEATURES_ROOT, relativePath);
  const sql = await fs.readFile(filepath, "utf8");

  return {
    group,
    filepath,
    filename: path.relative(process.cwd(), filepath),
    sql,
    checksum: createHash("sha256").update(sql).digest("hex"),
  };
}

async function loadOrderedMigrations(): Promise<TestMigrationFile[]> {
  return Promise.all(
    MIGRATION_ORDER.map((migration) => readMigration(migration.relativePath, migration.group)),
  );
}

async function applyMigration(pool: Pool, migration: TestMigrationFile): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(renderMigrationSql(migration.sql));
    await client.query(
      `
        INSERT INTO ${MIGRATIONS_TABLE} (migration_name, checksum, applied_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (migration_name)
        DO UPDATE SET checksum = EXCLUDED.checksum, applied_at = EXCLUDED.applied_at
      `,
      [migration.filename, migration.checksum],
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function applyPostgresTestMigrations(
  pool: Pool,
  groups: MigrationGroup[] = [
    "rootUsers",
    "platformSecurity",
    "rootAuth",
    "rootRoles",
    "tenants",
    "notificationDelivery",
    "tenantAdmins",
    "tenantAuth",
    "tenantConfiguration",
  ],
): Promise<void> {
  await ensureMigrationsTable(pool);

  const allowedGroups = new Set(groups);
  const migrations = (await loadOrderedMigrations()).filter((migration) =>
    allowedGroups.has(migration.group),
  );

  for (const migration of migrations) {
    await applyMigration(pool, migration);
  }
}

export function readPostgresTestBootstrapPassword(): string {
  return getBootstrapPassword();
}
