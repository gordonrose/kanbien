import { execFileSync } from "node:child_process";
import { buildInventoryReport, repoRoot, runGit, TaskRecord, tryRunGit } from "./lib/codexTaskRegistry";

type RetireStatus =
  | "SAFE_TO_RETIRE"
  | "INSPECT_REQUIRED"
  | "UNIQUE_CONTENT_BLOCK"
  | "INTEGRATION_HOME_BLOCK"
  | "CURRENT_WORKTREE_BLOCK"
  | "TASK_NOT_FOUND";

type Options = {
  apply: boolean;
  json: boolean;
  taskId: string | null;
};

type RetireReport = {
  status: RetireStatus;
  task: TaskRecord | null;
  repoRoot: string;
  recommendations: string[];
  actions: string[];
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

function resolveTask(options: Options): TaskRecord | null {
  const report = buildInventoryReport(repoRoot());
  if (options.taskId) {
    return report.records.find((record) => record.taskId === options.taskId || record.branch === options.taskId) ?? null;
  }

  const currentBranch = runGit(["branch", "--show-current"]);
  return report.records.find((record) => record.branch === currentBranch) ?? null;
}

function classifyRetirement(task: TaskRecord | null): RetireReport {
  const currentRepoRoot = repoRoot();
  if (!task) {
    return {
      status: "TASK_NOT_FOUND",
      task: null,
      repoRoot: currentRepoRoot,
      recommendations: ["Select a known task id or branch from `npm run codex:tasks` before retiring."],
      actions: [],
    };
  }

  if (task.kind === "integration_home") {
    return {
      status: "INTEGRATION_HOME_BLOCK",
      task,
      repoRoot: currentRepoRoot,
      recommendations: ["Do not retire the integration home. `/home/gordon/kanbien` on `main` remains the local promotion target."],
      actions: [],
    };
  }

  if (task.worktreePath !== null && task.worktreePath === currentRepoRoot) {
    return {
      status: "CURRENT_WORKTREE_BLOCK",
      task,
      repoRoot: currentRepoRoot,
      recommendations: [
        "Do not retire the worktree you are currently using.",
        "Run this command from another worktree, typically `/home/gordon/kanbien`, before applying retirement.",
      ],
      actions: [],
    };
  }

  if (task.uniquePatchCommitCount !== null && task.uniquePatchCommitCount > 0) {
    return {
      status: "UNIQUE_CONTENT_BLOCK",
      task,
      repoRoot: currentRepoRoot,
      recommendations: [
        "This task still carries unique patch content.",
        "Promote, cherry-pick, or explicitly abandon that content before retirement.",
      ],
      actions: [],
    };
  }

  if (task.dirty) {
    return {
      status: "INSPECT_REQUIRED",
      task,
      repoRoot: currentRepoRoot,
      recommendations: [
        "This task has no unique committed patch content, but it still has local worktree changes.",
        "Inspect whether those changes should be integrated or discarded before retirement.",
      ],
      actions: [],
    };
  }

  return {
    status: "SAFE_TO_RETIRE",
    task,
    repoRoot: currentRepoRoot,
    recommendations: ["This task has no unique patch content and no local dirty state. It is safe to retire now."],
    actions: [],
  };
}

function removeWorktreeIfNeeded(task: TaskRecord): string[] {
  const actions: string[] = [];
  if (task.worktreePath) {
    execFileSync("git", ["-C", repoRoot(), "worktree", "remove", "--force", task.worktreePath], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    execFileSync("git", ["-C", repoRoot(), "worktree", "prune"], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    actions.push(`Removed worktree ${task.worktreePath}`);
  }
  return actions;
}

function deleteBranch(task: TaskRecord): string[] {
  const actions: string[] = [];
  const branchExists = tryRunGit(["show-ref", "--verify", "--quiet", `refs/heads/${task.branch}`], repoRoot()) !== null;
  if (branchExists) {
    execFileSync("git", ["-C", repoRoot(), "branch", "-D", task.branch], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    actions.push(`Deleted branch ${task.branch}`);
  }
  return actions;
}

function applyRetirement(report: RetireReport): RetireReport {
  if (report.status !== "SAFE_TO_RETIRE" || report.task === null) {
    return report;
  }

  const actions = [...removeWorktreeIfNeeded(report.task), ...deleteBranch(report.task)];
  return {
    ...report,
    actions,
  };
}

function printReport(report: RetireReport): void {
  console.log("Codex Retire");
  console.log(`- status: ${report.status}`);
  if (report.task) {
    console.log(`- task: ${report.task.taskId}`);
    console.log(`- branch: ${report.task.branch}`);
    console.log(`- worktree: ${report.task.worktreePath ?? "(none)"}`);
    console.log(`- unique patch commits: ${report.task.uniquePatchCommitCount ?? "n/a"}`);
    console.log(`- dirty: ${report.task.dirty ? "yes" : "no"}`);
  }
  console.log("- recommendations:");
  for (const recommendation of report.recommendations) {
    console.log(`  - ${recommendation}`);
  }
  if (report.actions.length > 0) {
    console.log("- actions:");
    for (const action of report.actions) {
      console.log(`  - ${action}`);
    }
  }
}

const options = parseArgs(process.argv.slice(2));
const initialReport = classifyRetirement(resolveTask(options));
const finalReport = options.apply ? applyRetirement(initialReport) : initialReport;

if (options.json) {
  console.log(JSON.stringify(finalReport, null, 2));
} else {
  printReport(finalReport);
}

if (finalReport.status !== "SAFE_TO_RETIRE" && finalReport.status !== "TASK_NOT_FOUND") {
  process.exitCode = 1;
}
