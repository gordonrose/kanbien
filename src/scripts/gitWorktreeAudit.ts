import { execFileSync } from "node:child_process";

export type WorktreeRisk = "clean" | "dirty" | "dirty-stale-base" | "topic-mismatch";

export type WorktreeAuditEntry = {
  path: string;
  branch: string | null;
  head: string;
  subject: string;
  clean: boolean;
  changes: string[];
  descendsFromBase: boolean | null;
  topicOverlap: boolean | null;
  risks: WorktreeRisk[];
};

export type WorktreeAuditReport = {
  baseRef: string;
  baseCommit: string | null;
  entries: WorktreeAuditEntry[];
  blockingEntries: WorktreeAuditEntry[];
  recommendations: string[];
};

type Options = {
  baseRef: string;
  json: boolean;
  warnTopicMismatch: boolean;
};

function parseArgs(argv: string[]): Options {
  let baseRef = "origin/main";
  let json = false;
  let warnTopicMismatch = true;

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--base") {
      baseRef = argv[index + 1] ?? baseRef;
      index += 1;
      continue;
    }
    if (value.startsWith("--base=")) {
      baseRef = value.slice("--base=".length);
      continue;
    }
    if (value === "--json") {
      json = true;
      continue;
    }
    if (value === "--no-topic-warning") {
      warnTopicMismatch = false;
    }
  }

  return { baseRef, json, warnTopicMismatch };
}

function runGit(args: string[], cwd = process.cwd()): string {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function tryRunGit(args: string[], cwd = process.cwd()): string | null {
  try {
    return runGit(args, cwd);
  } catch {
    return null;
  }
}

function exitsAsAncestor(ancestor: string, descendant: string, cwd: string): boolean | null {
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", ancestor, descendant], {
      cwd,
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

export function parseWorktreeListPorcelain(output: string): Array<{ path: string; branch: string | null; head: string }> {
  const entries: Array<{ path: string; branch: string | null; head: string }> = [];
  let current: { path: string; branch: string | null; head: string } | null = null;

  for (const line of output.split(/\r?\n/)) {
    if (line.startsWith("worktree ")) {
      if (current !== null) {
        entries.push(current);
      }
      current = { path: line.slice("worktree ".length), branch: null, head: "" };
    } else if (current !== null && line.startsWith("HEAD ")) {
      current.head = line.slice("HEAD ".length);
    } else if (current !== null && line.startsWith("branch ")) {
      const ref = line.slice("branch ".length);
      current.branch = ref.startsWith("refs/heads/")
        ? ref.slice("refs/heads/".length)
        : ref;
    }
  }
  if (current !== null) {
    entries.push(current);
  }
  return entries;
}

function topicTokens(value: string): Set<string> {
  const stopWords = new Set([
    "add",
    "adds",
    "and",
    "branch",
    "codex",
    "docs",
    "fix",
    "for",
    "foundation",
    "implement",
    "main",
    "merge",
    "plan",
    "promote",
    "the",
    "v1",
    "with",
  ]);
  const tokens = value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 4 && !stopWords.has(token));
  return new Set(tokens);
}

export function hasTopicOverlap(branch: string | null, subject: string): boolean | null {
  if (branch === null || branch === "main") {
    return null;
  }
  const branchTokens = topicTokens(branch);
  const subjectTokens = topicTokens(subject);
  if (branchTokens.size === 0 || subjectTokens.size === 0) {
    return null;
  }
  return [...branchTokens].some((token) => subjectTokens.has(token));
}

export function buildReport(options: Options): WorktreeAuditReport {
  const baseCommit = tryRunGit(["rev-parse", "--verify", options.baseRef]);
  const parsed = parseWorktreeListPorcelain(runGit(["worktree", "list", "--porcelain"]));
  const entries = parsed.map((worktree) => {
    const statusOutput = runGit(["status", "--short"], worktree.path);
    const changes = statusOutput
      ? statusOutput
          .split("\n")
          .map((line) => line.trimEnd())
          .filter(Boolean)
      : [];
    const subject = runGit(["log", "-1", "--format=%s"], worktree.path);
    const clean = changes.length === 0;
    const descendsFromBase =
      baseCommit !== null ? exitsAsAncestor(options.baseRef, "HEAD", worktree.path) : null;
    const topicOverlap = options.warnTopicMismatch
      ? hasTopicOverlap(worktree.branch, subject)
      : null;
    const risks: WorktreeRisk[] = [];
    if (clean) {
      risks.push("clean");
    } else {
      risks.push("dirty");
    }
    if (!clean && descendsFromBase === false) {
      risks.push("dirty-stale-base");
    }
    if (!clean && descendsFromBase === false && topicOverlap === false) {
      risks.push("topic-mismatch");
    }
    return {
      path: worktree.path,
      branch: worktree.branch,
      head: worktree.head.slice(0, 7),
      subject,
      clean,
      changes,
      descendsFromBase,
      topicOverlap,
      risks,
    };
  });
  const blockingEntries = entries.filter((entry) => entry.risks.includes("dirty-stale-base"));
  const recommendations: string[] = [];
  for (const entry of blockingEntries) {
    recommendations.push(
      `Resolve ${entry.path}: dirty worktree on ${entry.branch ?? "detached HEAD"} does not descend from ${options.baseRef}. Rebase, promote, or move the changes before starting more material work.`,
    );
  }
  for (const entry of entries.filter((item) => item.risks.includes("topic-mismatch"))) {
    recommendations.push(
      `Inspect ${entry.path}: dirty branch ${entry.branch ?? "detached HEAD"} has top commit "${entry.subject}", which does not appear to match the branch topic.`,
    );
  }
  if (recommendations.length === 0) {
    recommendations.push("No dirty stale-base worktrees found.");
  }
  return { baseRef: options.baseRef, baseCommit, entries, blockingEntries, recommendations };
}

function printReport(report: WorktreeAuditReport): void {
  console.log("Git Worktree Audit");
  console.log(`- base: ${report.baseRef} (${report.baseCommit?.slice(0, 7) ?? "missing"})`);
  console.log(`- worktrees: ${report.entries.length}`);
  console.log(`- blocking dirty stale-base worktrees: ${report.blockingEntries.length}`);
  for (const entry of report.entries) {
    console.log(
      `- ${entry.path}: ${entry.branch ?? "(detached)"} ${entry.head} ${entry.clean ? "clean" : "dirty"} base=${
        entry.descendsFromBase === null ? "unknown" : entry.descendsFromBase ? "yes" : "no"
      } risks=${entry.risks.join(",")}`,
    );
    if (!entry.clean) {
      console.log(`  subject: ${entry.subject}`);
      for (const change of entry.changes.slice(0, 12)) {
        console.log(`  ${change}`);
      }
      if (entry.changes.length > 12) {
        console.log(`  ... ${entry.changes.length - 12} more changes`);
      }
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
  if (report.blockingEntries.length > 0) {
    process.exitCode = 1;
  }
}
