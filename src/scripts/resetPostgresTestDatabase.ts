import { config as loadEnv } from "dotenv";
import {
  createPostgresTestDatabasePool,
  resetPostgresTestDatabase,
} from "../../tests/harness/postgres/testDatabase";

loadEnv({ path: ".env", override: false, quiet: true });
loadEnv({ path: ".env.test", override: false, quiet: true });
loadEnv({ path: ".env.test.local", override: true, quiet: true });

process.env.NODE_ENV = "test";

async function run(): Promise<void> {
  const pool = createPostgresTestDatabasePool();

  try {
    await resetPostgresTestDatabase(pool);
    console.log("Reset Postgres test database tables.");
  } finally {
    await pool.end();
  }
}

run().catch((error: unknown) => {
  console.error("Failed to reset Postgres test database", error);
  process.exit(1);
});
