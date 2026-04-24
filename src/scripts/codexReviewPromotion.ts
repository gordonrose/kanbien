import { execFileSync } from "node:child_process";
import { buildInventoryReport, integrationHomePath, repoRoot, TaskRecord } from "./lib/codexTaskRegistry";

type ReviewStatus =
  | "READY_FOR_REVIEW"
  | "NO_LOCAL_PROMOTION"
  | "TASK_NOT_FOUND"
  | "TASK_BLOCK";

type Options = {
  json: boolean;
  taskId: string | null;
};

type ReviewReport = {
  changedFiles: string[];
  commits: string[];
  diffStat: string[];
  integrationHome: string;
  localHead: string | null;
  recommendations: string[];
  sourceTask: TaskRecord | null;
  status: ReviewStatus;
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

function changedFiles(integrationHome: string): string[] {
  const output = runGit(["diff", "--name-only", "origin/main..main"], integrationHome);
  return output ? output.split("\n").filter(Boolean) : [];
}

function diffStat(integrationHome: string): string[] {
  const output = runGit(["diff", "--stat", "origin/main..main"], integrationHome);
  return output ? output.split("\n").filter(Boolean) : [];
}

function commitList(integrationHome: string): string[] {
  const output = runGit(["log", "--oneline", "origin/main..main"], integrationHome);
  return output ? output.split("\n").filter(Boolean) : [];
}

function buildReport(options: Options): ReviewReport {
  const integrationHome = integrationHomePath(repoRoot());
  const task = resolveTask(options.taskId);

  if (!task) {
    return {
      changedFiles: [],
      commits: [],
      diffStat: [],
      integrationHome,
      localHead: shortHead(integrationHome),
      recommendations: ["Provide `--task <task-id>` from `npm run codex:tasks`."],
      sourceTask: null,
      status: "TASK_NOT_FOUND",
    };
  }

  if (task.kind === "integration_home") {
    return {
      changedFiles: [],
      commits: [],
      diffStat: [],
      integrationHome,
      localHead: shortHead(integrationHome),
      recommendations: ["Review local promotion for a task line, not for the integration home itself."],
      sourceTask: task,
      status: "TASK_BLOCK",
    };
  }

  const localMain = shortHead(integrationHome);
  const originMain = tryRunGit(["rev-parse", "--verify", "--short", "origin/main"], integrationHome);
  const aheadOfOrigin = localMain !== null && originMain !== null && localMain !== originMain;

  if (!aheadOfOrigin || !branchIsMergedIntoMain(integrationHome, task.branch)) {
    return {
      changedFiles: [],
      commits: [],
      diffStat: [],
      integrationHome,
      localHead: localMain,
      recommendations: [
        "This task is not currently represented by a local-only promotion on main.",
        "Run `npm run codex:promote-task -- --task <task-id> --apply` first, then review the local promotion.",
      ],
      sourceTask: task,
      status: "NO_LOCAL_PROMOTION",
    };
  }

  return {
    changedFiles: changedFiles(integrationHome),
    commits: commitList(integrationHome),
    diffStat: diffStat(integrationHome),
    integrationHome,
    localHead: localMain,
    recommendations: [
      "Review the changed files and commit list on local main before pushing.",
      "If the scope looks right, push with `npm run codex:push-reviewed -- --task <task-id> --apply`.",
    ],
    sourceTask: task,
    status: "READY_FOR_REVIEW",
  };
}

function printReport(report: ReviewReport): void {
  console.log("Codex Review Promotion");
  console.log(`- status: ${report.status}`);
  console.log(`- integration home: ${report.integrationHome}`);
  console.log(`- local head: ${report.localHead ?? "(missing)"}`);
  if (report.sourceTask) {
    console.log(`- task: ${report.sourceTask.taskId}`);
    console.log(`- branch: ${report.sourceTask.branch}`);
  }
  if (report.commits.length > 0) {
    console.log("- promoted commits:");
    for (const commit of report.commits) {
      console.log(`  - ${commit}`);
    }
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
  console.log("- recommendations:");
  for (const recommendation of report.recommendations) {
    console.log(`  - ${recommendation}`);
  }
}

const options = parseArgs(process.argv.slice(2));
const report = buildReport(options);

if (options.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printReport(report);
}

if (report.status !== "READY_FOR_REVIEW") {
  process.exitCode = 1;
}
