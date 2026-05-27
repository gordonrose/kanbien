import { execFileSync } from "node:child_process";
import { buildReport as buildGitPromoteReport, Report as GitPromoteReport } from "./gitPromote";

export type SafePromotePushStatus =
  | "READY_TO_APPLY"
  | "SAFE_PUSHED"
  | "DIRTY_BLOCK"
  | "FETCH_FAILED"
  | "SOURCE_MISSING_BLOCK"
  | "SOURCE_IS_TARGET_BLOCK"
  | "SOURCE_NOT_CURRENT_BLOCK"
  | "LOCAL_MAIN_UNIQUE_BLOCK"
  | "NO_UNIQUE_WORK_BLOCK"
  | "REBASE_CONFLICT_BLOCK"
  | "TARGET_UPDATE_BLOCK"
  | "PROMOTE_GUARDRAIL_BLOCK"
  | "MERGE_BLOCK"
  | "REMOTE_MOVED_BLOCK"
  | "PUSH_FAILED";

export type Options = {
  apply: boolean;
  json: boolean;
  remote: string;
  sourceRef: string | null;
  targetBranch: string;
};

export type SafePromotePushReport = {
  status: SafePromotePushStatus;
  sourceRef: string;
  sourceCommit: string | null;
  targetBranch: string;
  targetCommit: string | null;
  remoteRef: string;
  remoteCommit: string | null;
  currentBranch: string;
  worktreeClean: boolean;
  worktreeChanges: string[];
  localMainUniqueCommits: number | null;
  remoteMainUniqueCommits: number | null;
  sourceUniqueCommits: number | null;
  gitPromote: GitPromoteReport | null;
  recommendations: string[];
};

type GitFailure = {
  message: string;
  stderr: string;
};

type GitResult =
  | { ok: true; output: string }
  | { ok: false; failure: GitFailure };

export function parseArgs(argv: string[]): Options {
  let remote = "origin";
  let sourceRef: string | null = null;
  let targetBranch = "main";

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
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
    if (value === "--remote") {
      remote = argv[index + 1] ?? remote;
      index += 1;
      continue;
    }
    if (value.startsWith("--remote=")) {
      remote = value.slice("--remote=".length);
    }
  }

  return {
    apply: argv.includes("--apply"),
    json: argv.includes("--json"),
    remote,
    sourceRef,
    targetBranch,
  };
}

function runGit(args: string[]): string {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function tryRunGit(args: string[]): GitResult {
  try {
    return { ok: true, output: runGit(args) };
  } catch (error) {
    const stderr =
      typeof error === "object" &&
      error !== null &&
      "stderr" in error &&
      Buffer.isBuffer(error.stderr)
        ? error.stderr.toString("utf8").trim()
        : "";
    const message = error instanceof Error ? error.message : "Unknown git failure.";
    return { ok: false, failure: { message, stderr } };
  }
}

function currentBranch(): string {
  return runGit(["branch", "--show-current"]) || "HEAD";
}

function shortRef(ref: string): string | null {
  const result = tryRunGit(["rev-parse", "--verify", "--short", ref]);
  return result.ok ? result.output : null;
}

function worktreeChanges(): string[] {
  const output = runGit(["status", "--short"]);
  return output ? output.split("\n").filter(Boolean) : [];
}

function parseAheadBehind(leftRef: string, rightRef: string): [number, number] | null {
  const result = tryRunGit(["rev-list", "--left-right", "--count", `${leftRef}...${rightRef}`]);
  if (!result.ok) {
    return null;
  }
  const [left, right] = result.output.split(/\s+/).map((value) => Number.parseInt(value, 10));
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return null;
  }
  return [left, right];
}

function isAncestor(ancestor: string, descendant: string): boolean {
  return tryRunGit(["merge-base", "--is-ancestor", ancestor, descendant]).ok;
}

function emptyReport(options: Options, status: SafePromotePushStatus, recommendations: string[]): SafePromotePushReport {
  const branch = currentBranch();
  const sourceRef = options.sourceRef ?? branch;
  const remoteRef = `${options.remote}/${options.targetBranch}`;
  const changes = worktreeChanges();
  const mainCounts = parseAheadBehind(remoteRef, options.targetBranch);
  const sourceCounts = parseAheadBehind(remoteRef, sourceRef);

  return {
    status,
    sourceRef,
    sourceCommit: shortRef(sourceRef),
    targetBranch: options.targetBranch,
    targetCommit: shortRef(options.targetBranch),
    remoteRef,
    remoteCommit: shortRef(remoteRef),
    currentBranch: branch,
    worktreeClean: changes.length === 0,
    worktreeChanges: changes,
    localMainUniqueCommits: mainCounts ? mainCounts[1] : null,
    remoteMainUniqueCommits: mainCounts ? mainCounts[0] : null,
    sourceUniqueCommits: sourceCounts ? sourceCounts[1] : null,
    gitPromote: null,
    recommendations,
  };
}

export function buildReport(options: Options): SafePromotePushReport {
  const branch = currentBranch();
  const sourceRef = options.sourceRef ?? branch;
  const remoteRef = `${options.remote}/${options.targetBranch}`;
  const fetchResult = tryRunGit(["fetch", options.remote]);

  if (!fetchResult.ok) {
    return emptyReport(options, "FETCH_FAILED", [
      `Fetch failed for ${options.remote}: ${fetchResult.failure.stderr || fetchResult.failure.message}`,
      "No local branch refs were moved.",
    ]);
  }

  const changes = worktreeChanges();
  const worktreeClean = changes.length === 0;
  const sourceCommit = shortRef(sourceRef);
  const targetCommit = shortRef(options.targetBranch);
  const remoteCommit = shortRef(remoteRef);
  const mainCounts = parseAheadBehind(remoteRef, options.targetBranch);
  const sourceCounts = parseAheadBehind(remoteRef, sourceRef);
  const localMainUniqueCommits = mainCounts ? mainCounts[1] : null;
  const remoteMainUniqueCommits = mainCounts ? mainCounts[0] : null;
  const sourceUniqueCommits = sourceCounts ? sourceCounts[1] : null;

  const common = {
    sourceRef,
    sourceCommit,
    targetBranch: options.targetBranch,
    targetCommit,
    remoteRef,
    remoteCommit,
    currentBranch: branch,
    worktreeClean,
    worktreeChanges: changes,
    localMainUniqueCommits,
    remoteMainUniqueCommits,
    sourceUniqueCommits,
    gitPromote: null,
  };

  if (!worktreeClean) {
    return {
      ...common,
      status: "DIRTY_BLOCK",
      recommendations: [
        "Clean, commit, stash, or isolate local changes before safe promote/push.",
        "The automation will not rebase, switch branches, merge, or push from a dirty worktree.",
      ],
    };
  }
  if (sourceCommit === null) {
    return {
      ...common,
      status: "SOURCE_MISSING_BLOCK",
      recommendations: [`Source ref ${sourceRef} does not resolve.`],
    };
  }
  if (sourceRef === options.targetBranch) {
    return {
      ...common,
      status: "SOURCE_IS_TARGET_BLOCK",
      recommendations: ["Run this from a dedicated task branch, not main."],
    };
  }
  if (branch !== sourceRef) {
    return {
      ...common,
      status: "SOURCE_NOT_CURRENT_BLOCK",
      recommendations: [
        `Current branch is ${branch}, but source is ${sourceRef}.`,
        "Switch to the task branch before applying so rebase conflicts cannot surprise another worktree.",
      ],
    };
  }
  if ((localMainUniqueCommits ?? 0) > 0) {
    return {
      ...common,
      status: "LOCAL_MAIN_UNIQUE_BLOCK",
      recommendations: [
        `${options.targetBranch} has local commits that are not on ${remoteRef}.`,
        "The automation refuses to overwrite or bypass local main-only work.",
      ],
    };
  }
  if ((sourceUniqueCommits ?? 0) === 0) {
    return {
      ...common,
      status: "NO_UNIQUE_WORK_BLOCK",
      recommendations: [`${sourceRef} has no commits to promote beyond ${remoteRef}.`],
    };
  }

  return {
    ...common,
    status: "READY_TO_APPLY",
    recommendations: [
      `Ready to rebase ${sourceRef} onto ${remoteRef}, fast-forward ${options.targetBranch}, and push with no force.`,
    ],
  };
}

function runGitPromote(sourceRef: string, targetBranch: string, remoteRef: string): GitPromoteReport {
  return buildGitPromoteReport({
    baseRef: remoteRef,
    json: false,
    sourceRef,
    targetBranch,
  });
}

export function applySafePromotePush(initialReport: SafePromotePushReport, options: Options): SafePromotePushReport {
  if (initialReport.status !== "READY_TO_APPLY") {
    return initialReport;
  }

  const rebaseResult = tryRunGit(["rebase", initialReport.remoteRef]);
  if (!rebaseResult.ok) {
    return {
      ...buildReport(options),
      status: "REBASE_CONFLICT_BLOCK",
      recommendations: [
        `Rebase stopped while applying ${initialReport.sourceRef} onto ${initialReport.remoteRef}.`,
        rebaseResult.failure.stderr || rebaseResult.failure.message,
        "Resolve or abort the rebase manually; the automation will not resolve conflicts.",
      ],
    };
  }

  const switchTargetResult = tryRunGit(["switch", options.targetBranch]);
  if (!switchTargetResult.ok) {
    return {
      ...buildReport(options),
      status: "TARGET_UPDATE_BLOCK",
      recommendations: [
        `Could not switch to ${options.targetBranch}.`,
        switchTargetResult.failure.stderr || switchTargetResult.failure.message,
      ],
    };
  }

  const updateTargetResult = tryRunGit(["merge", "--ff-only", initialReport.remoteRef]);
  if (!updateTargetResult.ok) {
    return {
      ...buildReport({ ...options, sourceRef: options.targetBranch }),
      status: "TARGET_UPDATE_BLOCK",
      recommendations: [
        `Could not fast-forward ${options.targetBranch} to ${initialReport.remoteRef}.`,
        updateTargetResult.failure.stderr || updateTargetResult.failure.message,
        "No destructive reset was attempted.",
      ],
    };
  }

  const gitPromote = runGitPromote(initialReport.sourceRef, options.targetBranch, initialReport.remoteRef);
  if (gitPromote.status !== "SAFE_FAST_FORWARD") {
    return {
      ...buildReport({ ...options, sourceRef: options.targetBranch }),
      gitPromote,
      status: "PROMOTE_GUARDRAIL_BLOCK",
      recommendations: gitPromote.recommendations,
    };
  }

  const mergeResult = tryRunGit(["merge", "--ff-only", initialReport.sourceRef]);
  if (!mergeResult.ok) {
    return {
      ...buildReport({ ...options, sourceRef: options.targetBranch }),
      gitPromote,
      status: "MERGE_BLOCK",
      recommendations: [
        `Could not fast-forward ${options.targetBranch} to ${initialReport.sourceRef}.`,
        mergeResult.failure.stderr || mergeResult.failure.message,
      ],
    };
  }

  const pushResult = tryRunGit(["push", options.remote, options.targetBranch]);
  if (!pushResult.ok) {
    const fetchAfterFailure = tryRunGit(["fetch", options.remote]);
    const remoteMoved =
      fetchAfterFailure.ok && !isAncestor(`${options.remote}/${options.targetBranch}`, options.targetBranch);
    return {
      ...buildReport({ ...options, sourceRef: options.targetBranch }),
      gitPromote,
      status: remoteMoved ? "REMOTE_MOVED_BLOCK" : "PUSH_FAILED",
      recommendations: [
        remoteMoved
          ? `${options.remote}/${options.targetBranch} moved during push. Rebase the task again before retrying.`
          : `Push failed: ${pushResult.failure.stderr || pushResult.failure.message}`,
        "No force push was attempted.",
      ],
    };
  }

  return {
    ...buildReport({ ...options, sourceRef: options.targetBranch }),
    gitPromote,
    status: "SAFE_PUSHED",
    recommendations: [`Pushed ${options.targetBranch} to ${options.remote}/${options.targetBranch} with a normal non-force push.`],
  };
}

export function printReport(report: SafePromotePushReport): void {
  console.log("Git Safe Promote Push");
  console.log(`- status: ${report.status}`);
  console.log(`- current branch: ${report.currentBranch}`);
  console.log(`- source: ${report.sourceRef} (${report.sourceCommit ?? "missing"})`);
  console.log(`- target: ${report.targetBranch} (${report.targetCommit ?? "missing"})`);
  console.log(`- remote: ${report.remoteRef} (${report.remoteCommit ?? "missing"})`);
  console.log(`- worktree clean: ${report.worktreeClean ? "yes" : "no"}`);
  console.log(`- local ${report.targetBranch} unique commits: ${report.localMainUniqueCommits ?? "unknown"}`);
  console.log(`- remote ${report.targetBranch} unique commits: ${report.remoteMainUniqueCommits ?? "unknown"}`);
  console.log(`- source unique commits: ${report.sourceUniqueCommits ?? "unknown"}`);
  if (report.worktreeChanges.length > 0) {
    console.log("- worktree changes:");
    for (const change of report.worktreeChanges) {
      console.log(`  ${change}`);
    }
  }
  if (report.gitPromote) {
    console.log(`- promote guardrail: ${report.gitPromote.status}`);
  }
  console.log("- recommendations:");
  for (const recommendation of report.recommendations) {
    console.log(`  - ${recommendation}`);
  }
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  const initialReport = buildReport(options);
  const finalReport = options.apply ? applySafePromotePush(initialReport, options) : initialReport;

  if (options.json) {
    console.log(JSON.stringify(finalReport, null, 2));
  } else {
    printReport(finalReport);
  }

  if (!["READY_TO_APPLY", "SAFE_PUSHED"].includes(finalReport.status)) {
    process.exitCode = 1;
  }
}
