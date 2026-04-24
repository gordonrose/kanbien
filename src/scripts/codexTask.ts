import path from "node:path";
import {
  buildInventoryReport,
  deriveBranchName,
  deriveBootstrapPath,
  deriveWorktreePath,
  repoRoot,
  sharedSeamsOverlap,
  TaskRecord,
  writeSetOverlaps,
} from "./lib/codexTaskRegistry";

type Recommendation =
  | "REUSE_EXISTING_TASK"
  | "RESUME_EXISTING_TASK"
  | "INSPECT_OVERLAPPING_TASKS"
  | "RETIRE_STALE_FIRST"
  | "CREATE_NEW_TASK"
  | "INPUT_BLOCK";

type Options = {
  json: boolean;
  scope: string | null;
  sharedSeams: string[];
  slug: string | null;
  writeSet: string[];
};

type TaskDecisionReport = {
  bootstrapPathSuggestion: string | null;
  overlappingTasks: TaskRecord[];
  reasons: string[];
  recommendation: Recommendation;
  repoRoot: string;
  requestedBranch: string | null;
  requestedScope: string | null;
  requestedSlug: string | null;
  sharedSeams: string[];
  suggestedTask: TaskRecord | null;
  worktreePathSuggestion: string | null;
  writeSet: string[];
};

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

function parseArgs(argv: string[]): Options {
  return {
    json: argv.includes("--json"),
    scope: parseSingleArg(argv, "--scope"),
    sharedSeams: parseListArgs(argv, "--shared-seam"),
    slug: parseSingleArg(argv, "--slug"),
    writeSet: parseListArgs(argv, "--write-set"),
  };
}

function buildDecisionReport(options: Options): TaskDecisionReport {
  const currentRepoRoot = repoRoot();
  const report = buildInventoryReport(currentRepoRoot);
  const requestedBranch = options.slug ? deriveBranchName(options.slug) : null;

  if (!options.slug) {
    return {
      bootstrapPathSuggestion: null,
      overlappingTasks: [],
      reasons: ["Provide `--slug <task-slug>` so the tool can look for an existing task and suggest a safe branch name."],
      recommendation: "INPUT_BLOCK",
      repoRoot: currentRepoRoot,
      requestedBranch,
      requestedScope: options.scope,
      requestedSlug: options.slug,
      sharedSeams: options.sharedSeams,
      suggestedTask: null,
      worktreePathSuggestion: null,
      writeSet: options.writeSet,
    };
  }

  const nonMainTasks = report.records.filter((record) => record.kind !== "integration_home");
  const exactTask =
    nonMainTasks.find((record) => record.taskId === options.slug || record.branch === requestedBranch) ?? null;
  const overlappingTasks = nonMainTasks.filter((record) => {
    if (record.branch === requestedBranch) {
      return false;
    }

    const writeSetMatch =
      options.writeSet.length > 0 &&
      record.plannedWriteSet.length > 0 &&
      writeSetOverlaps(options.writeSet, record.plannedWriteSet);
    const sharedSeamMatch =
      options.sharedSeams.length > 0 &&
      record.knownSharedSeams.length > 0 &&
      sharedSeamsOverlap(options.sharedSeams, record.knownSharedSeams);

    return writeSetMatch || sharedSeamMatch;
  });
  const retireNowTasks = nonMainTasks.filter((record) => record.state === "retire_now");

  if (exactTask) {
    return {
      bootstrapPathSuggestion: exactTask.bootstrapPaths[0] ?? deriveBootstrapPath(currentRepoRoot, options.slug),
      overlappingTasks,
      reasons: [
        `A task with this slug already exists on branch ${exactTask.branch}.`,
        exactTask.worktreePath
          ? "Reuse that attached worktree instead of creating another branch for the same task."
          : "Resume that existing branch rather than creating a duplicate task line.",
      ],
      recommendation: exactTask.worktreePath ? "REUSE_EXISTING_TASK" : "RESUME_EXISTING_TASK",
      repoRoot: currentRepoRoot,
      requestedBranch,
      requestedScope: options.scope,
      requestedSlug: options.slug,
      sharedSeams: options.sharedSeams,
      suggestedTask: exactTask,
      worktreePathSuggestion: exactTask.worktreePath ?? deriveWorktreePath(options.slug),
      writeSet: options.writeSet,
    };
  }

  if (overlappingTasks.length === 1) {
    const task = overlappingTasks[0];
    return {
      bootstrapPathSuggestion: task.bootstrapPaths[0] ?? deriveBootstrapPath(currentRepoRoot, options.slug),
      overlappingTasks,
      reasons: [
        `The requested scope overlaps with existing task ${task.taskId}.`,
        task.worktreePath
          ? "Reuse that attached task unless you intentionally want to split a tangent in a later phase."
          : "Resume that existing branch instead of creating another overlapping task line.",
      ],
      recommendation: task.worktreePath ? "REUSE_EXISTING_TASK" : "RESUME_EXISTING_TASK",
      repoRoot: currentRepoRoot,
      requestedBranch,
      requestedScope: options.scope,
      requestedSlug: options.slug,
      sharedSeams: options.sharedSeams,
      suggestedTask: task,
      worktreePathSuggestion: task.worktreePath ?? deriveWorktreePath(task.taskId),
      writeSet: options.writeSet,
    };
  }

  if (overlappingTasks.length > 1) {
    return {
      bootstrapPathSuggestion: deriveBootstrapPath(currentRepoRoot, options.slug),
      overlappingTasks,
      reasons: [
        "Multiple existing tasks overlap the requested write set or shared seams.",
        "Inspect those tasks before creating a new worktree so the repo does not fork the same seam again.",
      ],
      recommendation: "INSPECT_OVERLAPPING_TASKS",
      repoRoot: currentRepoRoot,
      requestedBranch,
      requestedScope: options.scope,
      requestedSlug: options.slug,
      sharedSeams: options.sharedSeams,
      suggestedTask: null,
      worktreePathSuggestion: deriveWorktreePath(options.slug),
      writeSet: options.writeSet,
    };
  }

  if (retireNowTasks.length > 0) {
    return {
      bootstrapPathSuggestion: deriveBootstrapPath(currentRepoRoot, options.slug),
      overlappingTasks: [],
      reasons: [
        `There ${retireNowTasks.length === 1 ? "is" : "are"} ${retireNowTasks.length} already-retirable task line${retireNowTasks.length === 1 ? "" : "s"} in the repo.`,
        "Retire finished work first so new isolated branches do not pile up unnecessarily.",
      ],
      recommendation: "RETIRE_STALE_FIRST",
      repoRoot: currentRepoRoot,
      requestedBranch,
      requestedScope: options.scope,
      requestedSlug: options.slug,
      sharedSeams: options.sharedSeams,
      suggestedTask: retireNowTasks[0] ?? null,
      worktreePathSuggestion: deriveWorktreePath(options.slug),
      writeSet: options.writeSet,
    };
  }

  return {
    bootstrapPathSuggestion: deriveBootstrapPath(currentRepoRoot, options.slug),
    overlappingTasks: [],
    reasons: [
      "No existing task with this slug was found.",
      "No overlapping active seam was detected from the current bootstrap metadata.",
      "A new dedicated worktree would be a reasonable next step for this scope.",
    ],
    recommendation: "CREATE_NEW_TASK",
    repoRoot: currentRepoRoot,
    requestedBranch,
    requestedScope: options.scope,
    requestedSlug: options.slug,
    sharedSeams: options.sharedSeams,
    suggestedTask: null,
    worktreePathSuggestion: deriveWorktreePath(options.slug),
    writeSet: options.writeSet,
  };
}

function printReport(report: TaskDecisionReport): void {
  console.log("Codex Task");
  console.log(`- recommendation: ${report.recommendation}`);
  console.log(`- repo: ${report.repoRoot}`);
  console.log(`- requested slug: ${report.requestedSlug ?? "(missing)"}`);
  console.log(`- requested branch: ${report.requestedBranch ?? "(missing)"}`);
  if (report.requestedScope) {
    console.log(`- scope: ${report.requestedScope}`);
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
  if (report.suggestedTask) {
    console.log("- suggested task:");
    console.log(`  - task: ${report.suggestedTask.taskId}`);
    console.log(`  - branch: ${report.suggestedTask.branch}`);
    console.log(`  - worktree: ${report.suggestedTask.worktreePath ?? "(none)"}`);
    console.log(`  - state: ${report.suggestedTask.state}`);
  }
  if (report.overlappingTasks.length > 0) {
    console.log("- overlapping tasks:");
    for (const task of report.overlappingTasks) {
      console.log(`  - ${task.taskId} (${task.branch}, ${task.state})`);
    }
  }
  if (report.worktreePathSuggestion) {
    console.log(`- suggested worktree path: ${report.worktreePathSuggestion}`);
  }
  if (report.bootstrapPathSuggestion) {
    console.log(`- bootstrap path suggestion: ${path.relative(report.repoRoot, report.bootstrapPathSuggestion)}`);
  }
}

const options = parseArgs(process.argv.slice(2));
const report = buildDecisionReport(options);

if (options.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printReport(report);
}

if (report.recommendation === "INPUT_BLOCK" || report.recommendation === "INSPECT_OVERLAPPING_TASKS") {
  process.exitCode = 1;
}
