import { unlinkSync } from "node:fs";
import { createManifestPath, readManifestByRunId } from "../lib/testingData/manifest";
import {
  parseCleanupArgs,
  runCleanup,
} from "../lib/testingData/cleanupRuntime";
import { cleanupPrimaryKeyColumnByEntity } from "../lib/testingData/types";

async function executeCleanup(plan: Array<{ entity: keyof typeof cleanupPrimaryKeyColumnByEntity; ids: string[] }>) {
  const { dbPool } = await import("../lib/db");
  const client = await dbPool.connect();

  try {
    await client.query("BEGIN");
    const summaries: Array<{
      entity: keyof typeof cleanupPrimaryKeyColumnByEntity;
      requestedCount: number;
      deletedCount: number;
      skippedCount: number;
    }> = [];

    for (const step of plan) {
      if (step.ids.length === 0) {
        continue;
      }

      const primaryKeyColumn = cleanupPrimaryKeyColumnByEntity[step.entity];
      const query = `DELETE FROM ${step.entity} WHERE ${primaryKeyColumn}::text = ANY($1::text[]) RETURNING ${primaryKeyColumn}::text AS deleted_id`;
      const result = await client.query<{ deleted_id: string }>(query, [step.ids]);

      summaries.push({
        entity: step.entity,
        requestedCount: step.ids.length,
        deletedCount: result.rowCount ?? 0,
        skippedCount: step.ids.length - (result.rowCount ?? 0),
      });
    }

    await client.query("COMMIT");
    return summaries;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  const options = parseCleanupArgs(process.argv.slice(2));
  await runCleanup(options, {
    nodeEnv: process.env.NODE_ENV,
    readManifestByRunId,
    executePlan: executeCleanup,
    unlinkManifest: unlinkSync,
    log: console.log,
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
