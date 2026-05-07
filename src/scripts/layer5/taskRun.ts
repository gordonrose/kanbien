import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { CliOptions } from "./contract";
import { checkArtifactObligations } from "./artifactObligations";
import { runProofCommands, runValidationCommand } from "./commandRunner";
import { extractBulletValue, loadLayer5TaskContext, readTaskBreakdownContent } from "./parseTaskBreakdown";
import { runPluginChecks } from "./plugins";
import { makeRecordPath, renderRunRecord } from "./runRecord";
import { checkWriteSet } from "./writeSet";

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const context = loadLayer5TaskContext(options.taskBreakdownPath, options.taskId);
  const packet = readTaskBreakdownContent(context.taskBreakdownPath);
  const validationCommand = extractBulletValue(packet, "Validation command");
  const validationResult = runValidationCommand(validationCommand, options.storyPath, context.status);
  const proofResults = runProofCommands(context.proofRows, options.runProofs, context.status);
  const pluginResults = runPluginChecks(context);
  const writeSetResult = checkWriteSet(context, options.enforceWriteSet ? "enforced" : "report");
  const artifactObligationResult = checkArtifactObligations(context, writeSetResult.changedFiles);

  const recordPath = makeRecordPath(options.recordRoot, context.task.parentStoryId, options.taskId);
  const record = renderRunRecord({
    context,
    validationResult,
    proofResults,
    pluginResults,
    writeSetResult,
    artifactObligationResult,
  });

  if (options.writeRecord) {
    mkdirSync(path.dirname(recordPath), { recursive: true });
    writeFileSync(recordPath, record);
  }

  console.log(`${context.status.toUpperCase()}: ${options.taskId}`);
  console.log(`Task type: ${context.task.taskType}`);
  console.log(`Delivery status: ${context.task.handoffStatus}`);
  console.log(`Run record: ${options.writeRecord ? recordPath : `${recordPath} (preview; use --write-record)`}`);
  for (const result of pluginResults) {
    console.log(`- ${result.status}: ${result.plugin} (${result.notes.join("; ")})`);
  }
  console.log(`- ${writeSetResult.status}: write-set ${writeSetResult.mode} (${writeSetResult.reason})`);
  console.log(`- ${artifactObligationResult.status}: artifact obligations (${artifactObligationResult.reason})`);
  for (const result of [validationResult, ...proofResults]) {
    console.log(`- ${result.status}: ${result.command} (${result.reason})`);
  }

  if (context.status !== "ready") {
    process.exitCode = 2;
  } else if (pluginResults.some((result) => result.status === "blocked")) {
    process.exitCode = 2;
  } else if ([validationResult, ...proofResults].some((result) => result.status === "fail")) {
    process.exitCode = 1;
  } else if (options.enforceWriteSet && writeSetResult.status === "blocked") {
    process.exitCode = 2;
  }
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    taskBreakdownPath: "",
    taskId: "",
    writeRecord: false,
    runProofs: false,
    enforceWriteSet: false,
    recordRoot: "docs/workspace/layer5-task-runs",
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--task-breakdown" && next) {
      options.taskBreakdownPath = next;
      index += 1;
    } else if (arg === "--task" && next) {
      options.taskId = next;
      index += 1;
    } else if (arg === "--story" && next) {
      options.storyPath = next;
      index += 1;
    } else if (arg === "--record-root" && next) {
      options.recordRoot = next;
      index += 1;
    } else if (arg === "--write-record") {
      options.writeRecord = true;
    } else if (arg === "--run-proofs") {
      options.runProofs = true;
    } else if (arg === "--enforce-write-set") {
      options.enforceWriteSet = true;
    } else if (arg === "--help" || arg === "-h") {
      printUsageAndExit(0);
    } else {
      console.error(`Unknown or incomplete argument: ${arg}`);
      printUsageAndExit(1);
    }
  }

  if (!options.taskBreakdownPath || !options.taskId) {
    printUsageAndExit(1);
  }

  return options;
}

function printUsageAndExit(code: number): never {
  console.log(`Usage:
  npm run layer5:task -- --task-breakdown <task-breakdown.md-or-story-folder> --task <Task ID> [--story <story.md>] [--write-record] [--run-proofs] [--enforce-write-set]

Examples:
  npm run layer5:task -- --task-breakdown docs/workspace/.../stories/S-004-product-discovery-harness-adapter --task T-S004-01 --write-record
  npm run layer5:task -- --task-breakdown docs/workspace/.../task-breakdown.md --task T-S004-01 --run-proofs
`);
  process.exit(code);
}

main();
