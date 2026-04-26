import { integrationHomePath, buildInventoryReport, repoRoot, TaskRecord } from "./lib/codexTaskRegistry";
import { buildReport as buildGitPromoteReport, Report as GitPromoteReport } from "./gitPromote";

type PromoteTaskStatus =
  | "READY_TO_PROMOTE"
  | "PROMOTED_LOCALLY"
  | "PROMOTED_RETIRE_BLOCKED"
  | "APPLY_FAILED"
  | "TASK_NOT_FOUND"
  | "TASK_BLOCK"
  | "PROMOTE_GUARDRAIL_BLOCK";

type Options = {
  apply: boolean;
  json: boolean;
  taskId: string | null;
};

type PromoteTaskReport = {
  changedFiles: string[];
  diffStat: string[];
  gitPromote: GitPromoteReport | null;
  integrationHome: string;
  localHead: string | null;
  recommendations: string[];
  retirementActions: string[];
  sourceTask: TaskRecord | null;
  status: PromoteTaskStatus;
};

export function parseArgs(argv: string[]): Options {
  let taskId: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--task") {
      taskId = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (value.startsWith("--task=")) {
      taskId = value.slice("--task=".length);
    }
  }

  return {
    apply: argv.includes("--apply"),
    json: argv.includes("--json"),
    taskId,
  };
}

function runGit(args: string[], cwd: string): string {
  return require("node:child_process").execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function tryRunGit(args: string[], cwd: string): string | null {
  try {
    return runGit(args, cwd);
  } catch {
    return null;
  }
}

function resolveTask(taskId: string | null): TaskRecord | null {
  if (!taskId) {
    return null;
  }
  const report = buildInventoryReport(repoRoot());
  return report.records.find((record) => record.taskId === taskId || record.branch === taskId) ?? null;
}

function runGitPromote(integrationHome: string, branch: string): GitPromoteReport {
  const currentCwd = process.cwd();
  try {
    process.chdir(integrationHome);
    return buildGitPromoteReport({
      baseRef: "origin/main",
      json: false,
      sourceRef: branch,
      targetBranch: "main",
    });
  } finally {
    process.chdir(currentCwd);
  }
}

function shortHead(cwd: string): string | null {
  try {
    return runGit(["rev-parse", "--verify", "--short", "HEAD"], cwd);
  } catch {
    return null;
  }
}

function diffNameOnly(integrationHome: string): string[] {
  const output = runGit(["diff", "--name-only", "origin/main..main"], integrationHome);
  return output ? output.split("\n").filter(Boolean) : [];
}

function diffStat(integrationHome: string): string[] {
  const output = runGit(["diff", "--stat", "origin/main..main"], integrationHome);
  return output ? output.split("\n").filter(Boolean) : [];
}

export function buildReport(options: Options): PromoteTaskReport {
  const integrationHome = integrationHomePath(repoRoot());
  const task = resolveTask(options.taskId);

  if (!task) {
    return {
      changedFiles: [],
      diffStat: [],
      gitPromote: null,
      integrationHome,
      localHead: shortHead(integrationHome),
      recommendations: ["Provide `--task <task-id>` from `npm run codex:tasks`."],
      retirementActions: [],
      sourceTask: null,
      status: "TASK_NOT_FOUND",
    };
  }

  if (task.kind === "integration_home") {
    return {
      changedFiles: [],
      diffStat: [],
      gitPromote: null,
      integrationHome,
      localHead: shortHead(integrationHome),
      recommendations: ["Do not promote the integration home as a task. Choose a non-main task line instead."],
      retirementActions: [],
      sourceTask: task,
      status: "TASK_BLOCK",
    };
  }

  if (task.dirty) {
    return {
      changedFiles: [],
      diffStat: [],
      gitPromote: null,
      integrationHome,
      localHead: shortHead(integrationHome),
      recommendations: [
        "The source task worktree has local changes.",
        "Commit, discard, or move those changes before promotion; automatic retirement would otherwise risk deleting WIP.",
      ],
      retirementActions: [],
      sourceTask: task,
      status: "TASK_BLOCK",
    };
  }

  const gitPromote = runGitPromote(integrationHome, task.branch);
  if (gitPromote.status !== "SAFE_FAST_FORWARD") {
    return {
      changedFiles: [],
      diffStat: [],
      gitPromote,
      integrationHome,
      localHead: shortHead(integrationHome),
      recommendations: gitPromote.recommendations,
      retirementActions: [],
      sourceTask: task,
      status: "PROMOTE_GUARDRAIL_BLOCK",
    };
  }

  return {
    changedFiles: [],
    diffStat: [],
    gitPromote,
    integrationHome,
    localHead: shortHead(integrationHome),
    recommendations: ["This task is ready to promote onto local main."],
    retirementActions: [],
    sourceTask: task,
    status: "READY_TO_PROMOTE",
  };
}

function refreshTask(integrationHome: string, branch: string): TaskRecord | null {
  const currentCwd = process.cwd();
  try {
    process.chdir(integrationHome);
    const report = buildInventoryReport(repoRoot());
    return report.records.find((record) => record.branch === branch) ?? null;
  } finally {
    process.chdir(currentCwd);
  }
}

function currentRepoRoot(): string {
  return runGit(["rev-parse", "--show-toplevel"], process.cwd());
}

function branchExists(integrationHome: string, branch: string): boolean {
  return tryRunGit(["show-ref", "--verify", "--quiet", `refs/heads/${branch}`], integrationHome) !== null;
}

export function retirePromotedTask(integrationHome: string, task: TaskRecord): string[] {
  const refreshedTask = refreshTask(integrationHome, task.branch);
  if (refreshedTask === null) {
    return [`Task ${task.branch} no longer appears in the task inventory.`];
  }
  if (refreshedTask.uniquePatchCommitCount !== 0) {
    throw new Error(
      `Refusing to retire ${task.branch}: it still has ${refreshedTask.uniquePatchCommitCount ?? "unknown"} unique patch commits.`,
    );
  }
  if (refreshedTask.dirty) {
    throw new Error(`Refusing to retire ${task.branch}: its source worktree has local changes.`);
  }
  if (refreshedTask.worktreePath !== null && refreshedTask.worktreePath === currentRepoRoot()) {
    throw new Error(`Refusing to retire ${task.branch}: it is the current worktree.`);
  }

  const actions: string[] = [];
  if (refreshedTask.worktreePath !== null) {
    runGit(["worktree", "remove", "--force", refreshedTask.worktreePath], integrationHome);
    runGit(["worktree", "prune"], integrationHome);
    actions.push(`Removed worktree ${refreshedTask.worktreePath}`);
  }
  if (branchExists(integrationHome, refreshedTask.branch)) {
    runGit(["branch", "-D", refreshedTask.branch], integrationHome);
    actions.push(`Deleted branch ${refreshedTask.branch}`);
  }
  if (actions.length === 0) {
    actions.push(`No branch or worktree remained for ${refreshedTask.branch}`);
  }
  return actions;
}

export function applyPromotion(report: PromoteTaskReport): PromoteTaskReport {
  if (report.status !== "READY_TO_PROMOTE" || report.sourceTask === null) {
    return report;
  }

  try {
    runGit(["merge", "--ff-only", report.sourceTask.branch], report.integrationHome);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown local promotion failure.";
    return {
      ...report,
      recommendations: [...report.recommendations, `Local promotion failed: ${message}`],
      status: "APPLY_FAILED",
    };
  }

  try {
    const retirementActions = retirePromotedTask(report.integrationHome, report.sourceTask);

    return {
      ...report,
      changedFiles: diffNameOnly(report.integrationHome),
      diffStat: diffStat(report.integrationHome),
      localHead: shortHead(report.integrationHome),
      recommendations: [
        "Task promoted locally to main.",
        "Promoted task branch/worktree retired automatically.",
        "Review the changed files on local main before pushing.",
      ],
      retirementActions,
      status: "PROMOTED_LOCALLY",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown task retirement failure.";
    return {
      ...report,
      changedFiles: diffNameOnly(report.integrationHome),
      diffStat: diffStat(report.integrationHome),
      localHead: shortHead(report.integrationHome),
      recommendations: [
        "Task promoted locally to main.",
        `Automatic task retirement failed: ${message}`,
        "Inspect and retire the source task manually before starting unrelated work.",
      ],
      status: "PROMOTED_RETIRE_BLOCKED",
    };
  }
}

function printReport(report: PromoteTaskReport): void {
  console.log("Codex Promote Task");
  console.log(`- status: ${report.status}`);
  console.log(`- integration home: ${report.integrationHome}`);
  console.log(`- local head: ${report.localHead ?? "(missing)"}`);
  if (report.sourceTask) {
    console.log(`- task: ${report.sourceTask.taskId}`);
    console.log(`- branch: ${report.sourceTask.branch}`);
    console.log(`- worktree: ${report.sourceTask.worktreePath ?? "(none)"}`);
  }
  if (report.gitPromote) {
    console.log(`- guardrail status: ${report.gitPromote.status}`);
    console.log(`- source commit: ${report.gitPromote.sourceCommit ?? "missing"}`);
    console.log(`- target commit: ${report.gitPromote.targetCommit ?? "missing"}`);
    console.log(`- base commit: ${report.gitPromote.baseCommit ?? "missing"}`);
  }
  if (report.changedFiles.length > 0) {
    console.log("- changed files:");
    for (const file of report.changedFiles) {
      console.log(`  - ${file}`);
    }
  }
  if (report.diffStat.length > 0) {
    console.log("- diff stat:");
    for (const line of report.diffStat) {
      console.log(`  ${line}`);
    }
  }
  if (report.retirementActions.length > 0) {
    console.log("- retirement actions:");
    for (const action of report.retirementActions) {
      console.log(`  - ${action}`);
    }
  }
  console.log("- recommendations:");
  for (const recommendation of report.recommendations) {
    console.log(`  - ${recommendation}`);
  }
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  const initialReport = buildReport(options);
  const finalReport = options.apply ? applyPromotion(initialReport) : initialReport;

  if (options.json) {
    console.log(JSON.stringify(finalReport, null, 2));
  } else {
    printReport(finalReport);
  }

  if (!["READY_TO_PROMOTE", "PROMOTED_LOCALLY"].includes(finalReport.status)) {
    process.exitCode = 1;
  }
}
