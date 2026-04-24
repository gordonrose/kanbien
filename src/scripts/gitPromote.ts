import { execFileSync } from "node:child_process";

export type PromoteStatus =
  | "SAFE_FAST_FORWARD"
  | "CHERRY_PICK_REQUIRED"
  | "DIRTY_BLOCK"
  | "TARGET_STALE_BLOCK"
  | "SOURCE_MISSING_BLOCK";

export type Options = {
  baseRef: string;
  json: boolean;
  sourceRef: string;
  targetBranch: string;
};

export type Report = {
  status: PromoteStatus;
  sourceRef: string;
  sourceCommit: string | null;
  targetBranch: string;
  targetCommit: string | null;
  baseRef: string;
  baseCommit: string | null;
  targetMatchesBase: boolean;
  sourceDescendsFromBase: boolean | null;
  worktreeClean: boolean;
  worktreeChanges: string[];
  recommendations: string[];
};

export function parseArgs(argv: string[]): Options {
  let baseRef = "origin/main";
  let json = false;
  let sourceRef: string | null = null;
  let targetBranch = "main";

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--json") {
      json = true;
      continue;
    }
    if (value === "--source") {
      sourceRef = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (value.startsWith("--source=")) {
      sourceRef = value.slice("--source=".length);
      continue;
    }
    if (value === "--target") {
      targetBranch = argv[index + 1] ?? targetBranch;
      index += 1;
      continue;
    }
    if (value.startsWith("--target=")) {
      targetBranch = value.slice("--target=".length);
      continue;
    }
    if (value === "--base") {
      baseRef = argv[index + 1] ?? baseRef;
      index += 1;
      continue;
    }
    if (value.startsWith("--base=")) {
      baseRef = value.slice("--base=".length);
    }
  }

  return {
    baseRef,
    json,
    sourceRef: sourceRef ?? currentBranch(),
    targetBranch,
  };
}

export function runGit(args: string[]): string {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

export function tryRunGit(args: string[]): string | null {
  try {
    return runGit(args);
  } catch {
    return null;
  }
}

export function currentBranch(): string {
  return runGit(["branch", "--show-current"]) || "HEAD";
}

export function exitsAsAncestor(ancestor: string, descendant: string): boolean | null {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", ancestor, descendant], {
      stdio: "ignore",
    });
    return true;
  } catch (error) {
    const exitCode =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : null;
    if (exitCode === 1) {
      return false;
    }
    return null;
  }
}

export function buildReport(options: Options): Report {
  const sourceCommit = tryRunGit(["rev-parse", "--verify", "--short", options.sourceRef]);
  const targetCommit = tryRunGit([
    "rev-parse",
    "--verify",
    "--short",
    `refs/heads/${options.targetBranch}`,
  ]);
  const baseCommit = tryRunGit(["rev-parse", "--verify", "--short", options.baseRef]);
  const statusOutput = runGit(["status", "--short"]);
  const worktreeChanges = statusOutput
    ? statusOutput
        .split("\n")
        .map((line) => line.trimEnd())
        .filter(Boolean)
    : [];
  const worktreeClean = worktreeChanges.length === 0;
  const targetMatchesBase =
    targetCommit !== null && baseCommit !== null && targetCommit === baseCommit;
  const sourceDescendsFromBase =
    sourceCommit !== null && baseCommit !== null
      ? exitsAsAncestor(options.baseRef, options.sourceRef)
      : null;

  let status: PromoteStatus = "SAFE_FAST_FORWARD";
  if (!worktreeClean) {
    status = "DIRTY_BLOCK";
  } else if (sourceCommit === null) {
    status = "SOURCE_MISSING_BLOCK";
  } else if (!targetMatchesBase) {
    status = "TARGET_STALE_BLOCK";
  } else if (sourceDescendsFromBase === false) {
    status = "CHERRY_PICK_REQUIRED";
  }

  const recommendations: string[] = [];
  if (!worktreeClean) {
    recommendations.push(
      "Start promotion from a clean worktree. Commit, stash, or isolate unrelated local changes first.",
    );
  }
  if (sourceCommit === null) {
    recommendations.push(`Source ref ${options.sourceRef} does not resolve. Check the branch or commit name.`);
  }
  if (!targetMatchesBase) {
    recommendations.push(
      `Realign ${options.targetBranch} to ${options.baseRef} before promoting so local and GitHub baselines match.`,
    );
  }
  if (sourceDescendsFromBase === false) {
    recommendations.push(
      `${options.sourceRef} is not based on ${options.baseRef}. Promote it by cherry-picking the scoped commit(s) onto a clean branch from ${options.baseRef}.`,
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      `${options.sourceRef} is safe to promote by fast-forwarding ${options.targetBranch}.`,
    );
  }

  return {
    status,
    sourceRef: options.sourceRef,
    sourceCommit,
    targetBranch: options.targetBranch,
    targetCommit,
    baseRef: options.baseRef,
    baseCommit,
    targetMatchesBase,
    sourceDescendsFromBase,
    worktreeClean,
    worktreeChanges,
    recommendations,
  };
}

export function printReport(report: Report): void {
  console.log("Git Promote");
  console.log(`- status: ${report.status}`);
  console.log(`- source: ${report.sourceRef} (${report.sourceCommit ?? "missing"})`);
  console.log(`- target: ${report.targetBranch} (${report.targetCommit ?? "missing"})`);
  console.log(`- base: ${report.baseRef} (${report.baseCommit ?? "missing"})`);
  console.log(`- target matches base: ${report.targetMatchesBase ? "yes" : "no"}`);
  console.log(
    `- source descends from base: ${
      report.sourceDescendsFromBase === null
        ? "unknown"
        : report.sourceDescendsFromBase
          ? "yes"
          : "no"
    }`,
  );
  console.log(`- worktree clean: ${report.worktreeClean ? "yes" : "no"}`);
  if (report.worktreeChanges.length > 0) {
    console.log("- worktree changes:");
    for (const change of report.worktreeChanges) {
      console.log(`  ${change}`);
    }
  }
  console.log("- recommendations:");
  for (const recommendation of report.recommendations) {
    console.log(`  - ${recommendation}`);
  }
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  const report = buildReport(options);

  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }

  if (report.status !== "SAFE_FAST_FORWARD") {
    process.exitCode = 1;
  }
}
