import { createManifestPath, DEFAULT_TEST_ARTIFACTS_DIR, readManifestByRunId } from "./manifest";
import { buildCleanupPlan, type CleanupPlanStep } from "./cleanupPlan";
import { isValidTestRunId } from "./runId";

export interface CleanupOptions {
  testRunId: string;
  dryRun: boolean;
  artifactsDir: string;
}

export interface CleanupRuntimeDependencies {
  nodeEnv: string | undefined;
  readManifestByRunId: typeof readManifestByRunId;
  executePlan: (plan: CleanupPlanStep[]) => Promise<CleanupExecutionSummary[]>;
  unlinkManifest: (path: string) => void;
  log: (message: string) => void;
}

export interface CleanupExecutionSummary {
  entity: CleanupPlanStep["entity"];
  requestedCount: number;
  deletedCount: number;
  skippedCount: number;
}

export function parseCleanupArgs(argv: string[]): CleanupOptions {
  let testRunId = "";
  let dryRun = false;
  let artifactsDir = DEFAULT_TEST_ARTIFACTS_DIR;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }

    if (arg === "--run-id") {
      testRunId = argv[index + 1] ?? "";
      index += 1;
      continue;
    }

    if (arg === "--artifacts-dir") {
      artifactsDir = argv[index + 1] ?? artifactsDir;
      index += 1;
    }
  }

  if (!testRunId || !isValidTestRunId(testRunId)) {
    throw new Error("A valid `--run-id <testRunId>` is required.");
  }

  return {
    testRunId,
    dryRun,
    artifactsDir,
  };
}

export function assertSafeCleanupEnvironment(nodeEnv: string | undefined): void {
  if (nodeEnv === "production") {
    throw new Error("Cleanup is not allowed when NODE_ENV=production.");
  }
}

export function formatCleanupPlan(
  testRunId: string,
  plan: CleanupPlanStep[],
  dryRun: boolean,
): string[] {
  const lines = [`${dryRun ? "Dry run" : "Cleanup"} for ${testRunId}`];

  for (const step of plan) {
    if (step.ids.length === 0) {
      continue;
    }

    lines.push(`- ${step.entity}: ${step.ids.length} record(s)`);
  }

  return lines;
}

export function formatCleanupExecutionSummary(summaries: CleanupExecutionSummary[]): string[] {
  const lines: string[] = [];

  for (const summary of summaries) {
    lines.push(
      `- ${summary.entity}: deleted ${summary.deletedCount}/${summary.requestedCount}, skipped ${summary.skippedCount}`,
    );
  }

  return lines;
}

export async function runCleanup(
  options: CleanupOptions,
  dependencies: CleanupRuntimeDependencies,
): Promise<CleanupPlanStep[]> {
  assertSafeCleanupEnvironment(dependencies.nodeEnv);
  const manifest = dependencies.readManifestByRunId(options.testRunId, options.artifactsDir);
  const plan = buildCleanupPlan(manifest.records);

  for (const line of formatCleanupPlan(options.testRunId, plan, options.dryRun)) {
    dependencies.log(line);
  }

  if (options.dryRun) {
    dependencies.log("\nNo records were deleted.");
    return plan;
  }

  const executionSummaries = await dependencies.executePlan(plan);
  for (const line of formatCleanupExecutionSummary(executionSummaries)) {
    dependencies.log(line);
  }
  dependencies.unlinkManifest(createManifestPath(options.testRunId, options.artifactsDir));
  dependencies.log("\nCleanup completed and manifest removed.");
  return plan;
}
