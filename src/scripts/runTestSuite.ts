import { spawnSync } from "node:child_process";
import { config as loadEnv } from "dotenv";
import { hasPostgresTestDatabaseConfig } from "../../tests/harness/postgres/testDatabase";

loadEnv({ path: ".env", override: false, quiet: true });
loadEnv({ path: ".env.test", override: false, quiet: true });
loadEnv({ path: ".env.test.local", override: true, quiet: true });

function runCommand(command: string, args: string[], extraEnv?: Record<string, string>): void {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      ...extraEnv,
    },
  });

  if (result.error) {
    throw result.error;
  }

  if ((result.status ?? 0) !== 0) {
    process.exit(result.status ?? 1);
  }
}

runCommand("npx", ["vitest", "run", "--exclude", "tests/**/*persistence*.test.ts"]);

if (hasPostgresTestDatabaseConfig()) {
  runCommand("npx", [
    "vitest",
    "run",
    "--fileParallelism",
    "false",
    "tests/security/rootAuth/persistence.security.test.ts",
    "tests/security/platformSecurity/persistence.security.test.ts",
    "tests/audit/rootAuth/persistence.audit.test.ts",
    "tests/audit/platformSecurity/persistence.audit.test.ts",
    "tests/integration/rootAuth/persistence.edge.test.ts",
    "tests/integration/rootUsers/persistence.test.ts",
    "tests/integration/tenants/persistence.test.ts",
    "tests/integration/notificationDelivery/persistence.test.ts",
    "tests/integration/tenantAuth/persistence.test.ts",
    "tests/integration/tenantConfiguration/persistence.test.ts",
    "tests/integration/entityBuilder/persistence.test.ts",
    "tests/integration/webAppHierarchyBuilder/persistence.test.ts",
    "tests/integration/webAppSurfaceDiscovery/persistence.test.ts",
  ], {
    RUN_POSTGRES_TESTS: "true",
  });
} else {
  console.log(
    "Skipping Postgres-backed persistence tests because TEST_DATABASE_* is not fully configured.",
  );
}
