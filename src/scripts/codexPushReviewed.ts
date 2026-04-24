import { execFileSync } from "node:child_process";
import { buildInventoryReport, integrationHomePath, repoRoot, TaskRecord } from "./lib/codexTaskRegistry";

type PushStatus =
  | "READY_TO_PUSH"
  | "PUSHED"
  | "APPLY_FAILED"
  | "TASK_NOT_FOUND"
  | "TASK_BLOCK"
  | "REVIEW_BLOCK";

type Options = {
  apply: boolean;
  json: boolean;
  taskId: string | null;
};

type PushReport = {
  integrationHome: string;
  localHead: string | null;
  recommendations: string[];
  sourceTask: TaskRecord | null;
  status: PushStatus;
};

function parseArgs(argv: string[]): Options {
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
  return execFileSync("git", args, {
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

function shortHead(cwd: string): string | null {
  return tryRunGit(["rev-parse", "--verify", "--short", "HEAD"], cwd);
}

function branchIsMergedIntoMain(integrationHome: string, branch: string): boolean {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", branch, "main"], {
      cwd: integrationHome,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

function buildReport(options: Options): PushReport {
  const integrationHome = integrationHomePath(repoRoot());
  const task = resolveTask(options.taskId);

  if (!task) {
    return {
      integrationHome,
      localHead: shortHead(integrationHome),
      recommendations: ["Provide `--task <task-id>` from `npm run codex:tasks`."],
      sourceTask: null,
      status: "TASK_NOT_FOUND",
    };
  }

  if (task.kind === "integration_home") {
    return {
      integrationHome,
      localHead: shortHead(integrationHome),
      recommendations: ["Push a reviewed task promotion, not the integration home itself as a task."],
      sourceTask: task,
      status: "TASK_BLOCK",
    };
  }

  const localHead = shortHead(integrationHome);
  const originMain = tryRunGit(["rev-parse", "--verify", "--short", "origin/main"], integrationHome);
  const aheadOfOrigin = localHead !== null && originMain !== null && localHead !== originMain;

  if (!aheadOfOrigin || !branchIsMergedIntoMain(integrationHome, task.branch)) {
    return {
      integrationHome,
      localHead,
      recommendations: [
        "This task does not currently appear as a local-only reviewed promotion on main.",
        "Run `npm run codex:review-promotion -- --task <task-id>` after local promotion before pushing.",
      ],
      sourceTask: task,
      status: "REVIEW_BLOCK",
    };
  }

  return {
    integrationHome,
    localHead,
    recommendations: ["This reviewed promotion is ready to push to origin/main."],
    sourceTask: task,
    status: "READY_TO_PUSH",
  };
}

function applyPush(report: PushReport): PushReport {
  if (report.status !== "READY_TO_PUSH") {
    return report;
  }

  try {
    runGit(["push", "origin", "main"], report.integrationHome);
    return {
      ...report,
      localHead: shortHead(report.integrationHome),
      recommendations: ["Pushed reviewed local main to origin/main."],
      status: "PUSHED",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown push failure.";
    return {
      ...report,
      recommendations: [...report.recommendations, `Push failed: ${message}`],
      status: "APPLY_FAILED",
    };
  }
}

function printReport(report: PushReport): void {
  console.log("Codex Push Reviewed");
  console.log(`- status: ${report.status}`);
  console.log(`- integration home: ${report.integrationHome}`);
  console.log(`- local head: ${report.localHead ?? "(missing)"}`);
  if (report.sourceTask) {
    console.log(`- task: ${report.sourceTask.taskId}`);
    console.log(`- branch: ${report.sourceTask.branch}`);
  }
  console.log("- recommendations:");
  for (const recommendation of report.recommendations) {
    console.log(`  - ${recommendation}`);
  }
}

const options = parseArgs(process.argv.slice(2));
const initialReport = buildReport(options);
const finalReport = options.apply ? applyPush(initialReport) : initialReport;

if (options.json) {
  console.log(JSON.stringify(finalReport, null, 2));
} else {
  printReport(finalReport);
}

if (!["READY_TO_PUSH", "PUSHED"].includes(finalReport.status)) {
  process.exitCode = 1;
}
