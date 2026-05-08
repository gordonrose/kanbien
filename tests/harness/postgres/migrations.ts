import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Pool } from "pg";

type MigrationGroup =
  | "rootUsers"
  | "platformSecurity"
  | "rootAuth"
  | "rootRoles"
  | "capabilityContractCatalog"
  | "tenants"
  | "webAppHierarchyBuilder"
  | "webAppPageSettings"
  | "webAppSurfaceDiscovery"
  | "entityBuilder"
  | "notificationDelivery"
  | "jobProcessing"
  | "tenantAdmins"
  | "tenantAuth"
  | "tenantConfiguration"
  | "assets"
  | "harnessChat";

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
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIE+fWomSs6CBXFwaDSUYCy2FHG5UtnFJF7RE/O1hoozG fixture-root-auth.test";

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
    group: "capabilityContractCatalog",
    relativePath:
      "capabilityContractCatalog/persistence/migrations/0035_create_capability_contract_catalog.sql",
  },
  {
    group: "tenants",
    relativePath: "tenants/persistence/migrations/0006_create_tenants.sql",
  },
  {
    group: "webAppHierarchyBuilder",
    relativePath:
      "webAppHierarchyBuilder/persistence/migrations/0013_create_web_app_hierarchy.sql",
  },
  {
    group: "webAppHierarchyBuilder",
    relativePath:
      "webAppHierarchyBuilder/persistence/migrations/0018_add_web_app_hierarchy_sync_discovery_capability.sql",
  },
  {
    group: "webAppPageSettings",
    relativePath:
      "webAppPageSettings/persistence/migrations/0027_create_web_app_page_settings.sql",
  },
  {
    group: "webAppPageSettings",
    relativePath:
      "webAppPageSettings/persistence/migrations/0028_seed_web_app_page_settings_capabilities.sql",
  },
  {
    group: "webAppPageSettings",
    relativePath:
      "webAppPageSettings/persistence/migrations/0029_add_parent_page_to_web_app_page_settings.sql",
  },
  {
    group: "entityBuilder",
    relativePath: "entityBuilder/persistence/migrations/0014_create_entity_builder_foundation.sql",
  },
  {
    group: "entityBuilder",
    relativePath: "entityBuilder/persistence/migrations/0015_seed_entity_builder_root_capabilities.sql",
  },
  {
    group: "webAppSurfaceDiscovery",
    relativePath:
      "webAppSurfaceDiscovery/persistence/migrations/0016_create_web_app_surface_discovery.sql",
  },
  {
    group: "webAppSurfaceDiscovery",
    relativePath:
      "webAppSurfaceDiscovery/persistence/migrations/0017_seed_web_app_surface_discovery_root_capabilities.sql",
  },
  {
    group: "webAppSurfaceDiscovery",
    relativePath:
      "webAppSurfaceDiscovery/persistence/migrations/0019_create_web_app_surface_discovery_structure.sql",
  },
  {
    group: "webAppSurfaceDiscovery",
    relativePath:
      "webAppSurfaceDiscovery/persistence/migrations/0020_seed_web_app_surface_discovery_structure_root_capabilities.sql",
  },
  {
    group: "webAppSurfaceDiscovery",
    relativePath:
      "webAppSurfaceDiscovery/persistence/migrations/0021_relax_group_linked_surface_constraint.sql",
  },
  {
    group: "webAppHierarchyBuilder",
    relativePath:
      "webAppHierarchyBuilder/persistence/migrations/0021_create_web_app_hierarchy_reconcile_extension.sql",
  },
  {
    group: "webAppHierarchyBuilder",
    relativePath:
      "webAppHierarchyBuilder/persistence/migrations/0022_seed_web_app_hierarchy_reconcile_capabilities.sql",
  },
  {
    group: "webAppHierarchyBuilder",
    relativePath:
      "webAppHierarchyBuilder/persistence/migrations/0023_add_design_system_topology_materialization_v1.sql",
  },
  {
    group: "webAppHierarchyBuilder",
    relativePath:
      "webAppHierarchyBuilder/persistence/migrations/0024_seed_design_system_topology_materialization_capabilities.sql",
  },
  {
    group: "webAppHierarchyBuilder",
    relativePath:
      "webAppHierarchyBuilder/persistence/migrations/0025_add_module_landing_page.sql",
  },
  {
    group: "webAppHierarchyBuilder",
    relativePath:
      "webAppHierarchyBuilder/persistence/migrations/0026_seed_module_landing_page_capability.sql",
  },
  {
    group: "notificationDelivery",
    relativePath: "notificationDelivery/persistence/migrations/0007_create_notification_delivery.sql",
  },
  {
    group: "jobProcessing",
    relativePath: "jobProcessing/persistence/migrations/0040_create_job_processing.sql",
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
    relativePath: "tenantConfiguration/persistence/migrations/0011_seed_tenant_auth_policy_root_capabilities.sql",
  },
  {
    group: "tenantConfiguration",
    relativePath: "tenantConfiguration/persistence/migrations/0012_add_session_ttl_to_tenant_auth_policy.sql",
  },
  {
    group: "assets",
    relativePath: "assets/persistence/migrations/0040_create_assets.sql",
  },
  {
    group: "rootUsers",
    relativePath:
      "rootUsers/persistence/migrations/0045_add_root_user_profile_picture_asset.sql",
  },
  {
    group: "tenantAdmins",
    relativePath:
      "tenantAdmins/persistence/migrations/0046_add_tenant_admin_profile_picture_asset.sql",
  },
  {
    group: "harnessChat",
    relativePath: "harnessChat/persistence/migrations/0047_create_harness_chat_conversations.sql",
  },
  {
    group: "harnessChat",
    relativePath: "harnessChat/persistence/migrations/0048_create_harness_chat_packet_revisions.sql",
  },
  {
    group: "harnessChat",
    relativePath: "harnessChat/persistence/migrations/0049_seed_harness_chat_root_capabilities.sql",
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
    "webAppHierarchyBuilder",
    "webAppPageSettings",
    "webAppSurfaceDiscovery",
    "entityBuilder",
    "notificationDelivery",
    "jobProcessing",
    "tenantAdmins",
    "tenantAuth",
    "tenantConfiguration",
    "harnessChat",
  ],
): Promise<void> {
  await ensureMigrationsTable(pool);

  const allowedGroups = new Set(groups);
  if (allowedGroups.has("webAppHierarchyBuilder") || allowedGroups.has("webAppPageSettings")) {
    allowedGroups.add("webAppSurfaceDiscovery");
  }
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
