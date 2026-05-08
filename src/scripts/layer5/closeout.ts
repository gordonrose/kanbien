import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { checkArtifactObligations } from "./artifactObligations";
import { runProofCommands, runValidationCommand } from "./commandRunner";
import { classifyCloseoutResult } from "./closeoutResult";
import { extractBulletValue, loadLayer5TaskContext, readTaskBreakdownContent } from "./parseTaskBreakdown";
import { runPluginChecks } from "./plugins";
import { renderRunRecord } from "./runRecord";
import { checkWriteSet } from "./writeSet";

type CloseoutOptions = {
  taskBreakdownPath: string;
  taskId: string;
  storyPath?: string;
  preEditRecordPath: string;
  writeRecord: boolean;
  runProofs: boolean;
  recordRoot: string;
  changedFilesFixturePath?: string;
};

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const context = loadLayer5TaskContext(options.taskBreakdownPath, options.taskId);
  const packet = readTaskBreakdownContent(context.taskBreakdownPath);
  const validationCommand = extractBulletValue(packet, "Validation command");
  const validationResult = runValidationCommand(validationCommand, options.storyPath, context.status);
  const pluginResults = runPluginChecks(context);
  const proofResults = runProofCommands(context.proofRows, options.runProofs, context.status);
  const changedFilesFixture = options.changedFilesFixturePath ? readChangedFilesFixture(options.changedFilesFixturePath) : undefined;
  const writeSetResult = checkWriteSet(context, "enforced", changedFilesFixture);
  const artifactObligationResult = checkArtifactObligations(context, writeSetResult.changedFiles);
  const preEditRecordExists = existsSync(path.resolve(options.preEditRecordPath));
  const closeoutResult = classifyCloseoutResult({
    preEditRecordExists,
    taskStatus: context.status,
    pluginResults,
    writeSetResult,
    artifactObligationResult,
    validationResult,
    proofResults,
  });
  const recordPath = makeCloseoutRecordPath(options.recordRoot, context.task.parentStoryId, options.taskId);
  const record = `# Layer 5 Closeout Record: ${context.task.taskId}

## Closeout Gate

| Field | Value |
| --- | --- |
| Pre-edit record | ${preEditRecordExists ? path.resolve(options.preEditRecordPath) : `missing: ${path.resolve(options.preEditRecordPath)}`} |
| Proof execution requested | ${options.runProofs ? "yes" : "no"} |
| Changed files source | ${options.changedFilesFixturePath ? `fixture: ${path.resolve(options.changedFilesFixturePath)}` : "git worktree"} |
| Write-set enforcement | ${writeSetResult.status} |
| Artifact obligations | ${artifactObligationResult.status} |
| Closeout result | ${closeoutResult.code} |
| Closeout reason | ${closeoutResult.reason} |

${renderRunRecord({
    context,
    validationResult,
    proofResults,
    pluginResults,
    writeSetResult,
    artifactObligationResult,
  })}
`;

  if (options.writeRecord) {
    mkdirSync(path.dirname(recordPath), { recursive: true });
    writeFileSync(recordPath, record);
  }

  console.log(`${context.status.toUpperCase()} CLOSEOUT: ${options.taskId}`);
  console.log(`Closeout result: ${closeoutResult.code} (${closeoutResult.reason})`);
  console.log(`Pre-edit record: ${preEditRecordExists ? "present" : "missing"}`);
  console.log(`Closeout record: ${options.writeRecord ? recordPath : `${recordPath} (preview; use --write-record)`}`);
  for (const result of pluginResults) {
    console.log(`- ${result.status}: ${result.plugin} (${result.notes.join("; ")})`);
  }
  console.log(`- ${writeSetResult.status}: write-set enforced (${writeSetResult.reason})`);
  console.log(`- ${artifactObligationResult.status}: artifact obligations (${artifactObligationResult.reason})`);
  for (const result of [validationResult, ...proofResults]) {
    console.log(`- ${result.status}: ${result.command} (${result.reason})`);
  }

  process.exitCode = closeoutResult.exitCode;
}

function parseArgs(args: string[]): CloseoutOptions {
  const options: CloseoutOptions = {
    taskBreakdownPath: "",
    taskId: "",
    preEditRecordPath: "",
    writeRecord: false,
    runProofs: false,
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
    } else if (arg === "--pre-edit-record" && next) {
      options.preEditRecordPath = next;
      index += 1;
    } else if (arg === "--record-root" && next) {
      options.recordRoot = next;
      index += 1;
    } else if (arg === "--changed-files-fixture" && next) {
      options.changedFilesFixturePath = next;
      index += 1;
    } else if (arg === "--write-record") {
      options.writeRecord = true;
    } else if (arg === "--run-proofs") {
      options.runProofs = true;
    } else if (arg === "--help" || arg === "-h") {
      printUsageAndExit(0);
    } else {
      console.error(`Unknown or incomplete argument: ${arg}`);
      printUsageAndExit(1);
    }
  }

  if (!options.taskBreakdownPath || !options.taskId || !options.preEditRecordPath) {
    printUsageAndExit(1);
  }

  return options;
}

function makeCloseoutRecordPath(root: string, storyId: string, taskId: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return path.resolve(root, date, `${storyId}-${taskId}-closeout.md`);
}

function readChangedFilesFixture(fixturePath: string): string[] {
  return readFileSync(path.resolve(fixturePath), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function printUsageAndExit(code: number): never {
  console.log(`Usage:
  npm run layer5:closeout -- --task-breakdown <task-breakdown.md-or-story-folder> --task <Task ID> --pre-edit-record <run-record.md> [--story <story.md>] [--write-record] [--run-proofs] [--changed-files-fixture <paths.txt>]
`);
  process.exit(code);
}

main();
