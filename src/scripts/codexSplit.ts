import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  buildInventoryReport,
  deriveBranchName,
  deriveWorktreePath,
  integrationHomePath,
  repoRoot,
  runGit,
  shortCommit,
  TaskRecord,
  tryRunGit,
} from "./lib/codexTaskRegistry";

type SplitStatus =
  | "READY_TO_SPLIT"
  | "SPLIT_CREATED"
  | "APPLY_FAILED"
  | "INPUT_BLOCK"
  | "SOURCE_TASK_NOT_FOUND"
  | "SOURCE_TASK_BLOCK"
  | "BASELINE_BLOCK"
  | "CHILD_TASK_EXISTS_BLOCK"
  | "WORKTREE_PATH_BLOCK";

type Options = {
  apply: boolean;
  fromTask: string | null;
  json: boolean;
  reason: string | null;
  scope: string | null;
  sharedSeams: string[];
  slug: string | null;
  writeSet: string[];
};

type SplitReport = {
  baseCommit: string | null;
  bootstrapPath: string | null;
  branch: string | null;
  parentTask: TaskRecord | null;
  reasons: string[];
  repoRoot: string;
  scope: string | null;
  splitReason: string | null;
  status: SplitStatus;
  worktreePath: string | null;
  writeSet: string[];
  sharedSeams: string[];
};

function parseSingleArg(argv: string[], flag: string): string | null {
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === flag) {
      return argv[index + 1] ?? null;
    }
    if (value.startsWith(`${flag}=`)) {
      return value.slice(flag.length + 1) || null;
    }
  }
  return null;
}

function parseListArgs(argv: string[], flag: string): string[] {
  const values: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === flag) {
      const raw = argv[index + 1];
      if (raw) {
        values.push(raw);
      }
      index += 1;
      continue;
    }
    if (value.startsWith(`${flag}=`)) {
      values.push(value.slice(flag.length + 1));
    }
  }

  return values
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseArgs(argv: string[]): Options {
  return {
    apply: argv.includes("--apply"),
    fromTask: parseSingleArg(argv, "--from"),
    json: argv.includes("--json"),
    reason: parseSingleArg(argv, "--reason"),
    scope: parseSingleArg(argv, "--scope"),
    sharedSeams: parseListArgs(argv, "--shared-seam"),
    slug: parseSingleArg(argv, "--slug"),
    writeSet: parseListArgs(argv, "--write-set"),
  };
}

function mainBaselineIsClean(integrationHome: string): boolean {
  const worktreeStatus = runGit(["status", "--short"], integrationHome);
  const localMain = shortCommit("HEAD", integrationHome);
  const originMain = shortCommit("origin/main", integrationHome);
  return worktreeStatus.length === 0 && localMain !== null && localMain === originMain;
}

function resolveParentTask(currentRepoRoot: string, fromTask: string | null): TaskRecord | null {
  if (!fromTask) {
    return null;
  }
  const report = buildInventoryReport(currentRepoRoot);
  return report.records.find((record) => record.taskId === fromTask || record.branch === fromTask) ?? null;
}

function branchExists(currentRepoRoot: string, branch: string): boolean {
  return tryRunGit(["show-ref", "--verify", "--quiet", `refs/heads/${branch}`], currentRepoRoot) !== null;
}

function deriveChildBootstrapPath(worktreePath: string, slug: string): string {
  return path.join(worktreePath, "docs/workspace/chat-bootstraps", `${new Date().toISOString().slice(0, 10)}-${slug}.md`);
}

function childBootstrapContent(options: Options, parentTask: TaskRecord, currentRepoRoot: string, branch: string, worktreePath: string): string {
  const baseCommit = shortCommit("main", currentRepoRoot) ?? "(missing)";
  const writeSetLines =
    options.writeSet.length > 0
      ? options.writeSet.map((entry) => `  - ${entry}`).join("\n")
      : "  - (capture intended child write set before continuing material work)";
  const sharedSeamLines =
    options.sharedSeams.length > 0
      ? options.sharedSeams.map((entry) => `  - ${entry}`).join("\n")
      : "  - (none recorded at split time)";

  return `# Chat Bootstrap

- Date: ${new Date().toISOString().slice(0, 10)}
- Chat Scope: ${options.scope ?? "(fill in child scope before material work continues)"}
- Chat Slug: ${options.slug ?? "(missing)"}
- Reason For Isolation: Explicit tangent split from ${parentTask.taskId} so the original workstream can stay manageable.

## Git Start Point

- Base Commit: \`${baseCommit}\`
- Source Branch At Bootstrap Time: \`main\`
- Bootstrap Command Or Method: \`npm run codex:split -- --from ${parentTask.taskId} --slug ${options.slug ?? "(missing)"} --apply\`

## Dedicated Isolation

- Dedicated Branch: \`${branch}\`
- Dedicated Worktree Path: \`${worktreePath}\`
- Parallel Chats Known At Bootstrap Time:
  - parent task \`${parentTask.branch}\`${parentTask.worktreePath ? ` at \`${parentTask.worktreePath}\`` : ""}

## Intended Scope

- Planned Write Set:
${writeSetLines}
- Expected Maintained Artifacts:
  - update this list once the child slice settles
- Known Shared Seams:
${sharedSeamLines}
- Explicit Non-Goals:
  - keep the parent task focused on its original stream once this tangent is isolated

## Coordination Notes

- Parent Task: \`${parentTask.taskId}\`
- Split Reason: ${options.reason ?? "(capture the tangent reason before promotion)"}
- Rebase Policy For This Chat: Rebase only if \`main\` changes before promotion; otherwise keep this child as a scoped descendant of the split baseline.
- Commit Approval Posture: Commit after implementation and verification, then review locally before push.
- Push Or PR Posture: Push \`main\` only after local-promotion review.
- Handoff Notes: This child task was created by \`codex:split\`; update the parent handoff separately if the relationship changes.

## Outcome

- Final Branch Used:
- Final Base Commit If Changed:
- Follow-Up Integration Notes:
`;
}

function buildSplitReport(options: Options): SplitReport {
  const currentRepoRoot = repoRoot();
  const integrationHome = integrationHomePath(currentRepoRoot);
  const parentTask = resolveParentTask(currentRepoRoot, options.fromTask);
  const branch = options.slug ? deriveBranchName(options.slug) : null;
  const worktreePath = options.slug ? deriveWorktreePath(options.slug) : null;
  const bootstrapPath = options.slug && worktreePath ? deriveChildBootstrapPath(worktreePath, options.slug) : null;
  const baseCommit = shortCommit("main", currentRepoRoot);

  if (!options.fromTask || !options.slug) {
    return {
      baseCommit,
      bootstrapPath,
      branch,
      parentTask,
      reasons: ["Provide both `--from <task-id>` and `--slug <child-slug>` so the split can resolve a parent task and a child branch name."],
      repoRoot: currentRepoRoot,
      scope: options.scope,
      splitReason: options.reason,
      status: "INPUT_BLOCK",
      worktreePath,
      writeSet: options.writeSet,
      sharedSeams: options.sharedSeams,
    };
  }

  if (!parentTask) {
    return {
      baseCommit,
      bootstrapPath,
      branch,
      parentTask: null,
      reasons: ["The requested parent task was not found in the current task inventory."],
      repoRoot: currentRepoRoot,
      scope: options.scope,
      splitReason: options.reason,
      status: "SOURCE_TASK_NOT_FOUND",
      worktreePath,
      writeSet: options.writeSet,
      sharedSeams: options.sharedSeams,
    };
  }

  if (parentTask.kind === "integration_home") {
    return {
      baseCommit,
      bootstrapPath,
      branch,
      parentTask,
      reasons: ["Do not split from the integration home. Pick an existing task line as the parent, not `main`."],
      repoRoot: currentRepoRoot,
      scope: options.scope,
      splitReason: options.reason,
      status: "SOURCE_TASK_BLOCK",
      worktreePath,
      writeSet: options.writeSet,
      sharedSeams: options.sharedSeams,
    };
  }

  if (!mainBaselineIsClean(integrationHome)) {
    return {
      baseCommit,
      bootstrapPath,
      branch,
      parentTask,
      reasons: ["The integration home must be clean and synced with `origin/main` before a child tangent task is created."],
      repoRoot: currentRepoRoot,
      scope: options.scope,
      splitReason: options.reason,
      status: "BASELINE_BLOCK",
      worktreePath,
      writeSet: options.writeSet,
      sharedSeams: options.sharedSeams,
    };
  }

  if (branch !== null && branchExists(currentRepoRoot, branch)) {
    return {
      baseCommit,
      bootstrapPath,
      branch,
      parentTask,
      reasons: [`Branch ${branch} already exists. Reuse or retire that task before creating another child with the same slug.`],
      repoRoot: currentRepoRoot,
      scope: options.scope,
      splitReason: options.reason,
      status: "CHILD_TASK_EXISTS_BLOCK",
      worktreePath,
      writeSet: options.writeSet,
      sharedSeams: options.sharedSeams,
    };
  }

  if (worktreePath !== null && existsSync(worktreePath)) {
    return {
      baseCommit,
      bootstrapPath,
      branch,
      parentTask,
      reasons: [`Worktree path ${worktreePath} already exists. Pick another slug or clean up the existing path first.`],
      repoRoot: currentRepoRoot,
      scope: options.scope,
      splitReason: options.reason,
      status: "WORKTREE_PATH_BLOCK",
      worktreePath,
      writeSet: options.writeSet,
      sharedSeams: options.sharedSeams,
    };
  }

  return {
    baseCommit,
    bootstrapPath,
    branch,
    parentTask,
    reasons: [
      `Parent task ${parentTask.taskId} resolved successfully.`,
      "The integration home is clean and synced to origin/main.",
      "A new child task can be created from current main without dragging the tangent through the parent worktree.",
    ],
    repoRoot: currentRepoRoot,
    scope: options.scope,
    splitReason: options.reason,
    status: "READY_TO_SPLIT",
    worktreePath,
    writeSet: options.writeSet,
    sharedSeams: options.sharedSeams,
  };
}

function applySplit(report: SplitReport, options: Options): SplitReport {
  if (report.status !== "READY_TO_SPLIT" || !report.branch || !report.worktreePath || !report.bootstrapPath || !report.parentTask) {
    return report;
  }

  try {
    execFileSync("git", ["-C", report.repoRoot, "worktree", "add", "-b", report.branch, report.worktreePath, "main"], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    mkdirSync(path.dirname(report.bootstrapPath), { recursive: true });
    writeFileSync(
      report.bootstrapPath,
      childBootstrapContent(options, report.parentTask, report.repoRoot, report.branch, report.worktreePath),
      "utf8",
    );

    return {
      ...report,
      reasons: [...report.reasons, `Created ${report.branch} at ${report.worktreePath} and wrote its bootstrap note.`],
      status: "SPLIT_CREATED",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown apply failure.";
    return {
      ...report,
      reasons: [...report.reasons, `Split apply failed: ${message}`],
      status: "APPLY_FAILED",
    };
  }
}

function printReport(report: SplitReport): void {
  console.log("Codex Split");
  console.log(`- status: ${report.status}`);
  console.log(`- repo: ${report.repoRoot}`);
  console.log(`- parent task: ${report.parentTask?.taskId ?? "(missing)"}`);
  console.log(`- child branch: ${report.branch ?? "(missing)"}`);
  console.log(`- child worktree: ${report.worktreePath ?? "(missing)"}`);
  console.log(`- child bootstrap: ${report.bootstrapPath ? path.relative(report.repoRoot, report.bootstrapPath) : "(missing)"}`);
  console.log(`- base commit: ${report.baseCommit ?? "(missing)"}`);
  if (report.scope) {
    console.log(`- scope: ${report.scope}`);
  }
  if (report.splitReason) {
    console.log(`- split reason: ${report.splitReason}`);
  }
  if (report.writeSet.length > 0) {
    console.log("- write set:");
    for (const entry of report.writeSet) {
      console.log(`  - ${entry}`);
    }
  }
  if (report.sharedSeams.length > 0) {
    console.log("- shared seams:");
    for (const entry of report.sharedSeams) {
      console.log(`  - ${entry}`);
    }
  }
  console.log("- reasons:");
  for (const reason of report.reasons) {
    console.log(`  - ${reason}`);
  }
}

const options = parseArgs(process.argv.slice(2));
const initialReport = buildSplitReport(options);
const finalReport = options.apply ? applySplit(initialReport, options) : initialReport;

if (options.json) {
  console.log(JSON.stringify(finalReport, null, 2));
} else {
  printReport(finalReport);
}

if (!["READY_TO_SPLIT", "SPLIT_CREATED"].includes(finalReport.status)) {
  process.exitCode = 1;
}
