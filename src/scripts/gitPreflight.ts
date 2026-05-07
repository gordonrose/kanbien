import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type PreflightStatus =
  | "SAFE"
  | "DIRTY_BLOCK"
  | "STALE_MAIN_BLOCK"
  | "MAIN_BRANCH_BLOCK"
  | "BOOTSTRAP_MISSING_BLOCK"
  | "BOOTSTRAP_MISMATCH_BLOCK"
  | "BASE_MISMATCH_BLOCK";

type Options = {
  allowDirty: boolean;
  allowDisjointDirty: boolean;
  allowMain: boolean;
  allowStaleBase: boolean;
  allowStaleMain: boolean;
  baseRef: string;
  bootstrapPath: string | null;
  json: boolean;
  writeSetPaths: string[];
  requireBase: boolean;
};

type Report = {
  status: PreflightStatus;
  branch: string;
  headCommit: string;
  baseRef: string;
  baseCommit: string | null;
  headDescendsFromBase: boolean | null;
  localMainCommit: string | null;
  originMainCommit: string | null;
  localMainMatchesOriginMain: boolean;
  worktreeClean: boolean;
  worktreeChanges: string[];
  dirtyPaths: string[];
  plannedWriteSetPaths: string[];
  dirtyCollisions: string[];
  dirtyDisjointAllowed: boolean;
  bootstrapPath: string | null;
  bootstrapExists: boolean | null;
  bootstrap: BootstrapRecord | null;
  bootstrapMismatches: string[];
  upstream: string | null;
  recommendations: string[];
};

export type BootstrapRecord = {
  baseCommit: string | null;
  dedicatedBranch: string | null;
  dedicatedWorktreePath: string | null;
  plannedWriteSet: string | null;
};

function parseArgs(argv: string[]): Options {
  let allowDirty = false;
  let allowDisjointDirty = false;
  let allowMain = false;
  let allowStaleBase = false;
  let allowStaleMain = false;
  let baseRef = "origin/main";
  let bootstrapPath: string | null = null;
  let json = false;
  const writeSetPaths: string[] = [];
  let requireBase = false;

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--allow-dirty") {
      allowDirty = true;
      continue;
    }
    if (value === "--allow-disjoint-dirty") {
      allowDisjointDirty = true;
      continue;
    }
    if (value === "--allow-main") {
      allowMain = true;
      continue;
    }
    if (value === "--allow-stale-base") {
      allowStaleBase = true;
      continue;
    }
    if (value === "--allow-stale-main") {
      allowStaleMain = true;
      continue;
    }
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
    if (value === "--write-set" || value === "--planned-write-set") {
      writeSetPaths.push(...parseWriteSetPaths(argv[index + 1] ?? ""));
      index += 1;
      continue;
    }
    if (value.startsWith("--write-set=")) {
      writeSetPaths.push(...parseWriteSetPaths(value.slice("--write-set=".length)));
      continue;
    }
    if (value.startsWith("--planned-write-set=")) {
      writeSetPaths.push(...parseWriteSetPaths(value.slice("--planned-write-set=".length)));
      continue;
    }
    if (value === "--require-base") {
      requireBase = true;
      continue;
    }
    if (value === "--bootstrap") {
      bootstrapPath = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (value.startsWith("--bootstrap=")) {
      bootstrapPath = value.slice("--bootstrap=".length);
    }
  }

  return {
    allowDirty,
    allowDisjointDirty,
    allowMain,
    allowStaleBase,
    allowStaleMain,
    baseRef,
    bootstrapPath,
    json,
    writeSetPaths,
    requireBase,
  };
}

function runGit(args: string[]): string {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function tryRunGit(args: string[]): string | null {
  try {
    return runGit(args);
  } catch {
    return null;
  }
}

function exitsAsAncestor(ancestor: string, descendant: string): boolean | null {
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

function normalizeCommit(value: string | null): string | null {
  return value?.trim().toLowerCase() || null;
}

function normalizePathForCompare(value: string): string {
  return path.resolve(value).replace(/\/+$/, "");
}

function stripInlineComment(value: string): string {
  return value.replace(/\s+#.*$/, "").trim();
}

function normalizeRepoPath(value: string): string {
  return value.trim().replace(/^["'`]+|["'`,.;:]+$/g, "").replace(/\\/g, "/").replace(/^\.\/+/, "").replace(/\/+$/, "");
}

export function parseWriteSetPaths(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/[\s,]+/)
        .map(normalizeRepoPath)
        .filter((token) => token.length > 0)
        .filter((token) => !token.startsWith("-"))
        .filter((token) => token.includes("/") || /\.[A-Za-z0-9]+$/.test(token)),
    ),
  );
}

export function parseDirtyPaths(statusLine: string): string[] {
  const value = statusLine.slice(2).trim();
  if (!value) {
    return [];
  }
  return value
    .split(" -> ")
    .map(normalizeRepoPath)
    .filter(Boolean);
}

function pathsCollide(left: string, right: string): boolean {
  const normalizedLeft = normalizeRepoPath(left);
  const normalizedRight = normalizeRepoPath(right);
  return (
    normalizedLeft === normalizedRight ||
    normalizedLeft.startsWith(`${normalizedRight}/`) ||
    normalizedRight.startsWith(`${normalizedLeft}/`)
  );
}

export function findDirtyWriteSetCollisions(input: {
  dirtyPaths: string[];
  plannedWriteSetPaths: string[];
}): string[] {
  const collisions = new Set<string>();
  for (const dirtyPath of input.dirtyPaths) {
    for (const plannedPath of input.plannedWriteSetPaths) {
      if (pathsCollide(dirtyPath, plannedPath)) {
        collisions.add(dirtyPath);
      }
    }
  }
  return Array.from(collisions);
}

export function parseBootstrapRecord(content: string): BootstrapRecord {
  const record: BootstrapRecord = {
    baseCommit: null,
    dedicatedBranch: null,
    dedicatedWorktreePath: null,
    plannedWriteSet: null,
  };

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line.startsWith("- ")) {
      continue;
    }
    const match = /^- ([^:]+):\s*(.*)$/.exec(line);
    if (!match) {
      continue;
    }
    const key = match[1].trim().toLowerCase();
    const value = stripInlineComment(match[2]);
    if (!value || value.toLowerCase() === "n/a" || value.toLowerCase() === "none") {
      continue;
    }
    if (key === "base commit") {
      record.baseCommit = value;
    } else if (key === "dedicated branch") {
      record.dedicatedBranch = value;
    } else if (key === "dedicated worktree path") {
      record.dedicatedWorktreePath = value;
    } else if (key === "planned write set") {
      record.plannedWriteSet = value;
    }
  }

  return record;
}

export function validateBootstrapRecord(input: {
  bootstrap: BootstrapRecord;
  branch: string;
  cwd: string;
  headCommit: string;
}): string[] {
  const mismatches: string[] = [];
  if (!input.bootstrap.baseCommit) {
    mismatches.push("bootstrap is missing Base Commit");
  }
  if (!input.bootstrap.dedicatedBranch) {
    mismatches.push("bootstrap is missing Dedicated Branch");
  } else if (input.bootstrap.dedicatedBranch !== input.branch) {
    mismatches.push(
      `bootstrap branch ${input.bootstrap.dedicatedBranch} does not match current branch ${input.branch}`,
    );
  }
  if (!input.bootstrap.dedicatedWorktreePath) {
    mismatches.push("bootstrap is missing Dedicated Worktree Path");
  } else if (
    normalizePathForCompare(input.bootstrap.dedicatedWorktreePath) !==
    normalizePathForCompare(input.cwd)
  ) {
    mismatches.push(
      `bootstrap worktree ${input.bootstrap.dedicatedWorktreePath} does not match current worktree ${input.cwd}`,
    );
  }
  if (!input.bootstrap.plannedWriteSet) {
    mismatches.push("bootstrap is missing Planned Write Set");
  }
  const normalizedHeadCommit = normalizeCommit(input.headCommit);
  const normalizedBootstrapBase = normalizeCommit(input.bootstrap.baseCommit);
  if (
    normalizedHeadCommit !== null &&
    normalizedBootstrapBase !== null &&
    !normalizedHeadCommit.startsWith(normalizedBootstrapBase)
  ) {
    // The ancestry check in buildReport is authoritative; this message gives a
    // quick clue when a chat starts from an obviously different commit.
    mismatches.push(
      `current HEAD ${input.headCommit} is not the bootstrap base ${input.bootstrap.baseCommit}; verify the branch was created from that base`,
    );
  }
  return mismatches;
}

function buildReport(options: Options): Report {
  const branch = runGit(["branch", "--show-current"]) || "(detached)";
  const headCommit = runGit(["rev-parse", "HEAD"]);
  const baseCommit = tryRunGit(["rev-parse", "--verify", options.baseRef]);
  const localMainCommit = tryRunGit(["rev-parse", "--verify", "--short", "refs/heads/main"]);
  const originMainCommit = tryRunGit(["rev-parse", "--verify", "--short", "refs/remotes/origin/main"]);
  const statusOutput = runGit(["status", "--short"]);
  const worktreeChanges = statusOutput
    ? statusOutput
        .split("\n")
        .map((line) => line.trimEnd())
        .filter(Boolean)
    : [];
  const worktreeClean = worktreeChanges.length === 0;
  const bootstrapExists =
    options.bootstrapPath === null ? null : existsSync(options.bootstrapPath);
  const bootstrap =
    options.bootstrapPath !== null && bootstrapExists
      ? parseBootstrapRecord(readFileSync(options.bootstrapPath, "utf8"))
      : null;
  const bootstrapBaseCommit = bootstrap?.baseCommit ?? null;
  const bootstrapBaseDescends =
    bootstrapBaseCommit !== null ? exitsAsAncestor(bootstrapBaseCommit, "HEAD") : null;
  const headDescendsFromBase =
    baseCommit !== null ? exitsAsAncestor(options.baseRef, "HEAD") : null;
  const upstream = tryRunGit([
    "rev-parse",
    "--abbrev-ref",
    "--symbolic-full-name",
    "@{upstream}",
  ]);
  const localMainMatchesOriginMain =
    localMainCommit !== null &&
    originMainCommit !== null &&
    localMainCommit === originMainCommit;
  const bootstrapMismatches =
    bootstrap === null
      ? []
      : validateBootstrapRecord({
          bootstrap,
          branch,
          cwd: process.cwd(),
          headCommit,
        }).filter(
          (mismatch) =>
            bootstrapBaseDescends !== true ||
            !mismatch.includes("current HEAD"),
        );

  const plannedWriteSetPaths = Array.from(
    new Set([
      ...options.writeSetPaths,
      ...parseWriteSetPaths(bootstrap?.plannedWriteSet ?? ""),
    ]),
  );
  const dirtyPaths = worktreeChanges.flatMap(parseDirtyPaths);
  const dirtyCollisions = findDirtyWriteSetCollisions({
    dirtyPaths,
    plannedWriteSetPaths,
  });
  const dirtyDisjointAllowed =
    options.allowDisjointDirty &&
    !worktreeClean &&
    plannedWriteSetPaths.length > 0 &&
    dirtyCollisions.length === 0;

  let status: PreflightStatus = "SAFE";
  if (!options.allowDirty && !worktreeClean && !dirtyDisjointAllowed) {
    status = "DIRTY_BLOCK";
  } else if (!options.allowStaleMain && !localMainMatchesOriginMain) {
    status = "STALE_MAIN_BLOCK";
  } else if (!options.allowMain && branch === "main") {
    status = "MAIN_BRANCH_BLOCK";
  } else if (options.bootstrapPath !== null && !bootstrapExists) {
    status = "BOOTSTRAP_MISSING_BLOCK";
  } else if (bootstrapMismatches.length > 0) {
    status = "BOOTSTRAP_MISMATCH_BLOCK";
  } else if (
    !options.allowStaleBase &&
    (options.requireBase || !worktreeClean) &&
    headDescendsFromBase === false
  ) {
    status = "BASE_MISMATCH_BLOCK";
  }

  const recommendations: string[] = [];
  if (!worktreeClean) {
    if (dirtyDisjointAllowed) {
      recommendations.push(
        "Dirty changes are outside the planned write set; keep the current task within the declared paths and rerun preflight if the write set changes.",
      );
    } else if (plannedWriteSetPaths.length > 0 && dirtyCollisions.length > 0) {
      recommendations.push(
        `Dirty changes collide with the planned write set: ${dirtyCollisions.join(", ")}. Commit, stash, back up, or isolate that state before continuing.`,
      );
    } else {
      recommendations.push(
        "Commit, stash, back up, or isolate the current dirty state before starting unrelated material work.",
      );
    }
  }
  if (!localMainMatchesOriginMain) {
    recommendations.push(
      "Realign local main with origin/main before promotion or merge work so the baseline matches GitHub.",
    );
  }
  if (branch === "main") {
    recommendations.push(
      "Create a dedicated task branch before material work instead of editing directly on main.",
    );
  }
  if (options.bootstrapPath !== null && !bootstrapExists) {
    recommendations.push(
      `Create the chat bootstrap at ${options.bootstrapPath} before continuing material work.`,
    );
  }
  for (const mismatch of bootstrapMismatches) {
    recommendations.push(`Fix bootstrap mismatch: ${mismatch}.`);
  }
  if (
    (options.requireBase || !worktreeClean) &&
    headDescendsFromBase === false
  ) {
    recommendations.push(
      `Rebase or recreate this task branch from ${options.baseRef}; dirty work on a branch that does not descend from the current baseline is a high-risk mixed-worktree state.`,
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "Current repo state is safe for scoped work. Keep the task isolated and commit only the intended write set.",
    );
  }

  return {
    status,
    branch,
    headCommit: headCommit.slice(0, 7),
    baseRef: options.baseRef,
    baseCommit: baseCommit?.slice(0, 7) ?? null,
    headDescendsFromBase,
    localMainCommit,
    originMainCommit,
    localMainMatchesOriginMain,
    worktreeClean,
    worktreeChanges,
    dirtyPaths,
    plannedWriteSetPaths,
    dirtyCollisions,
    dirtyDisjointAllowed,
    bootstrapPath: options.bootstrapPath,
    bootstrapExists,
    bootstrap,
    bootstrapMismatches,
    upstream,
    recommendations,
  };
}

function printReport(report: Report): void {
  console.log("Git Preflight");
  console.log(`- status: ${report.status}`);
  console.log(`- branch: ${report.branch}`);
  console.log(`- head: ${report.headCommit}`);
  console.log(`- base: ${report.baseRef} (${report.baseCommit ?? "missing"})`);
  console.log(
    `- head descends from base: ${
      report.headDescendsFromBase === null
        ? "unknown"
        : report.headDescendsFromBase
          ? "yes"
          : "no"
    }`,
  );
  console.log(`- upstream: ${report.upstream ?? "(none)"}`);
  console.log(`- local main: ${report.localMainCommit ?? "(missing)"}`);
  console.log(`- origin/main: ${report.originMainCommit ?? "(missing)"}`);
  console.log(
    `- local main synced: ${report.localMainMatchesOriginMain ? "yes" : "no"}`,
  );
  console.log(`- worktree clean: ${report.worktreeClean ? "yes" : "no"}`);
  if (report.plannedWriteSetPaths.length > 0) {
    console.log(`- planned write set paths: ${report.plannedWriteSetPaths.join(", ")}`);
  }
  if (report.dirtyDisjointAllowed) {
    console.log("- dirty disjoint allowed: yes");
  }
  if (report.dirtyCollisions.length > 0) {
    console.log(`- dirty collisions: ${report.dirtyCollisions.join(", ")}`);
  }
  if (report.bootstrapPath !== null) {
    console.log(
      `- bootstrap: ${report.bootstrapExists ? "present" : "missing"} (${report.bootstrapPath})`,
    );
    if (report.bootstrap !== null) {
      console.log(`- bootstrap base commit: ${report.bootstrap.baseCommit ?? "(missing)"}`);
      console.log(`- bootstrap branch: ${report.bootstrap.dedicatedBranch ?? "(missing)"}`);
      console.log(`- bootstrap worktree: ${report.bootstrap.dedicatedWorktreePath ?? "(missing)"}`);
    }
  }
  if (report.bootstrapMismatches.length > 0) {
    console.log("- bootstrap mismatches:");
    for (const mismatch of report.bootstrapMismatches) {
      console.log(`  ${mismatch}`);
    }
  }
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

  if (report.status !== "SAFE") {
    process.exitCode = 1;
  }
}
