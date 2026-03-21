import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import { env } from "../config/env";

const FEATURES_ROOT = path.resolve(process.cwd(), "src", "features");
const MIGRATIONS_TABLE = "schema_migrations";

type MigrationFile = {
  filename: string;
  filepath: string;
  sql: string;
  checksum: string;
};

async function listFiles(directory: string): Promise<string[]> {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return listFiles(entryPath);
      }

      return [entryPath];
    }),
  );

  return files.flat();
}

async function findMigrationFiles(): Promise<MigrationFile[]> {
  const allFiles = await listFiles(FEATURES_ROOT);
  const migrationPaths = allFiles
    .filter((filepath) => filepath.includes(`${path.sep}migrations${path.sep}`) && filepath.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right));

  return Promise.all(
    migrationPaths.map(async (filepath) => {
      const sql = await fs.readFile(filepath, "utf8");

      return {
        filename: path.relative(process.cwd(), filepath),
        filepath,
        sql,
        checksum: createHash("sha256").update(sql).digest("hex"),
      };
    }),
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

async function loadAppliedMigrations(pool: Pool): Promise<Map<string, string>> {
  const result = await pool.query<{ migration_name: string; checksum: string }>(
    `SELECT migration_name, checksum FROM ${MIGRATIONS_TABLE}`,
  );

  return new Map(result.rows.map((row) => [row.migration_name, row.checksum]));
}

async function applyMigration(pool: Pool, migration: MigrationFile): Promise<"created" | "updated"> {
  const previous = await pool.query<{ checksum: string }>(
    `SELECT checksum FROM ${MIGRATIONS_TABLE} WHERE migration_name = $1`,
    [migration.filename],
  );
  const status = previous.rows[0] ? "updated" : "created";

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(migration.sql);
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

  return status;
}

async function migrate(): Promise<void> {
  const pool = new Pool({
    host: env.database.host,
    port: env.database.port,
    database: env.database.name,
    user: env.database.user,
    password: env.database.password,
    ssl: env.database.ssl ? { rejectUnauthorized: false } : false,
  });

  try {
    await ensureMigrationsTable(pool);

    const [migrationFiles, appliedMigrations] = await Promise.all([
      findMigrationFiles(),
      loadAppliedMigrations(pool),
    ]);

    if (migrationFiles.length === 0) {
      console.log("No migration files found.");
      return;
    }

    let appliedCount = 0;

    for (const migration of migrationFiles) {
      const previousChecksum = appliedMigrations.get(migration.filename);

      if (previousChecksum === migration.checksum) {
        console.log(`Skipping ${migration.filename} (unchanged)`);
        continue;
      }

      const status = await applyMigration(pool, migration);
      appliedCount += 1;
      console.log(`Applied ${migration.filename} (${status})`);
    }

    console.log(`Migration run complete. ${appliedCount} file(s) applied.`);
  } finally {
    await pool.end();
  }
}

migrate().catch((error: unknown) => {
  console.error("Migration failed", error);
  process.exit(1);
});
