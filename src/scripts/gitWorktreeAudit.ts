import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type WorktreeRisk = "clean" | "dirty" | "dirty-stale-base" | "preserved-stale-wip" | "topic-mismatch";

export type PreservedWorktreeRecord = {
  filePath: string;
  worktreePath: string;
  branch: string;
  allowedToBlockUnrelatedWork: boolean;
};

export type WorktreeAuditEntry = {
  path: string;
  branch: string | null;
  head: string;
  subject: string;
  clean: boolean;
  changes: string[];
  descendsFromBase: boolean | null;
  topicOverlap: boolean | null;
  preservedWorktreeRecord: PreservedWorktreeRecord | null;
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
  preservedWorktreesDir: string;
  warnTopicMismatch: boolean;
};

function parseArgs(argv: string[]): Options {
  let baseRef = "origin/main";
  let json = false;
  let preservedWorktreesDir = "docs/workspace/preserved-worktrees";
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
    if (value === "--preserved-worktrees-dir") {
      preservedWorktreesDir = argv[index + 1] ?? preservedWorktreesDir;
      index += 1;
      continue;
    }
    if (value.startsWith("--preserved-worktrees-dir=")) {
      preservedWorktreesDir = value.slice("--preserved-worktrees-dir=".length);
      continue;
    }
    if (value === "--no-topic-warning") {
      warnTopicMismatch = false;
    }
  }

  return { baseRef, json, preservedWorktreesDir, warnTopicMismatch };
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

function readMarkdownField(content: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(new RegExp(`^-\\s*${escaped}:\\s*(.+?)\\s*$`, "im"));
  return match?.[1]?.trim() ?? null;
}

export function parsePreservedWorktreeRecordMarkdown(
  content: string,
  filePath: string,
): PreservedWorktreeRecord | null {
  const worktreePath = readMarkdownField(content, "Worktree Path");
  const branch = readMarkdownField(content, "Branch");
  const allowedToBlockValue = readMarkdownField(content, "Allowed To Block Unrelated Work");
  if (worktreePath === null || branch === null || allowedToBlockValue === null) {
    return null;
  }
  return {
    filePath,
    worktreePath,
    branch,
    allowedToBlockUnrelatedWork: allowedToBlockValue.toLowerCase() !== "no",
  };
}

export function readPreservedWorktreeRecords(directory: string): PreservedWorktreeRecord[] {
  if (!existsSync(directory)) {
    return [];
  }
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => {
      const filePath = join(directory, entry.name);
      return parsePreservedWorktreeRecordMarkdown(readFileSync(filePath, "utf8"), filePath);
    })
    .filter((record): record is PreservedWorktreeRecord => record !== null);
}

export function findPreservedWorktreeRecord(
  records: PreservedWorktreeRecord[],
  worktree: { path: string; branch: string | null },
): PreservedWorktreeRecord | null {
  return (
    records.find(
      (record) =>
        record.worktreePath === worktree.path &&
        record.branch === worktree.branch &&
        record.allowedToBlockUnrelatedWork === false,
    ) ?? null
  );
}

export function classifyWorktreeRisks(input: {
  clean: boolean;
  descendsFromBase: boolean | null;
  topicOverlap: boolean | null;
  preservedWorktreeRecord: PreservedWorktreeRecord | null;
}): WorktreeRisk[] {
  const risks: WorktreeRisk[] = [];
  if (input.clean) {
    risks.push("clean");
    return risks;
  }
  risks.push("dirty");
  if (input.descendsFromBase === false) {
    if (input.preservedWorktreeRecord !== null) {
      risks.push("preserved-stale-wip");
    } else {
      risks.push("dirty-stale-base");
    }
  }
  if (
    input.descendsFromBase === false &&
    input.topicOverlap === false &&
    input.preservedWorktreeRecord === null
  ) {
    risks.push("topic-mismatch");
  }
  return risks;
}

export function buildReport(options: Options): WorktreeAuditReport {
  const baseCommit = tryRunGit(["rev-parse", "--verify", options.baseRef]);
  const preservedRecords = readPreservedWorktreeRecords(options.preservedWorktreesDir);
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
    const preservedWorktreeRecord = findPreservedWorktreeRecord(preservedRecords, worktree);
    const risks = classifyWorktreeRisks({
      clean,
      descendsFromBase,
      topicOverlap,
      preservedWorktreeRecord,
    });
    return {
      path: worktree.path,
      branch: worktree.branch,
      head: worktree.head.slice(0, 7),
      subject,
      clean,
      changes,
      descendsFromBase,
      topicOverlap,
      preservedWorktreeRecord,
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
  for (const entry of entries.filter((item) => item.risks.includes("preserved-stale-wip"))) {
    recommendations.push(
      `Preserved ${entry.path}: dirty stale-base WIP is allowed not to block unrelated work by ${entry.preservedWorktreeRecord?.filePath}. Rebase, promote, or recover it before continuing that task.`,
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
  console.log(
    `- preserved stale-base WIP worktrees: ${
      report.entries.filter((entry) => entry.risks.includes("preserved-stale-wip")).length
    }`,
  );
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
