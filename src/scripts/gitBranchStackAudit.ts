import { execFileSync } from "node:child_process";

export type BranchStackRefKind = "local" | "remote";

export type BranchStackRisk =
  | "current"
  | "accounted-in-current"
  | "patch-accounted-in-current"
  | "base-only"
  | "unaccounted-local"
  | "unaccounted-remote";

export type BranchStackEntry = {
  name: string;
  kind: BranchStackRefKind;
  head: string;
  subject: string;
  aheadBase: number;
  aheadCurrent: number;
  unaccountedPatchCount: number;
  missingCurrent: number;
  risk: BranchStackRisk;
};

export type BranchStackAuditReport = {
  baseRef: string;
  baseCommit: string | null;
  currentRef: string;
  currentCommit: string;
  entries: BranchStackEntry[];
  unaccountedEntries: BranchStackEntry[];
  recommendations: string[];
};

type Options = {
  baseRef: string;
  currentRef: string;
  includeBaseOnly: boolean;
  includeRemote: boolean;
  json: boolean;
};

function parseArgs(argv: string[]): Options {
  let baseRef = "origin/main";
  let currentRef = "HEAD";
  let includeBaseOnly = false;
  let includeRemote = true;
  let json = false;

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
    if (value === "--current") {
      currentRef = argv[index + 1] ?? currentRef;
      index += 1;
      continue;
    }
    if (value.startsWith("--current=")) {
      currentRef = value.slice("--current=".length);
      continue;
    }
    if (value === "--include-base-only") {
      includeBaseOnly = true;
      continue;
    }
    if (value === "--local-only") {
      includeRemote = false;
      continue;
    }
    if (value === "--json") {
      json = true;
    }
  }

  return { baseRef, currentRef, includeBaseOnly, includeRemote, json };
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

function commitCount(range: string): number {
  const output = tryRunGit(["rev-list", "--count", range]);
  return Number.parseInt(output ?? "0", 10) || 0;
}

function unaccountedPatchCount(currentRef: string, refName: string): number {
  const output = tryRunGit(["cherry", currentRef, refName]);
  if (!output) {
    return 0;
  }
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("+"))
    .length;
}

function listRefs(includeRemote: boolean): Array<{ name: string; kind: BranchStackRefKind }> {
  const refRoots = includeRemote ? ["refs/heads", "refs/remotes/origin"] : ["refs/heads"];
  const output = runGit(["for-each-ref", "--format=%(refname:short)", ...refRoots]);
  return output
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean)
    .filter((name) => name !== "origin/HEAD")
    .map((name) => ({
      name,
      kind: name.startsWith("origin/") ? "remote" : "local",
    }));
}

export function classifyBranchStackEntry(input: {
  name: string;
  kind: BranchStackRefKind;
  currentBranch: string;
  aheadBase: number;
  aheadCurrent: number;
  unaccountedPatchCount: number;
}): BranchStackRisk {
  if (input.name === input.currentBranch || input.name === `origin/${input.currentBranch}`) {
    return "current";
  }
  if (input.aheadCurrent > 0) {
    if (input.unaccountedPatchCount === 0) {
      return "patch-accounted-in-current";
    }
    return input.kind === "remote" ? "unaccounted-remote" : "unaccounted-local";
  }
  if (input.aheadBase > 0) {
    return "accounted-in-current";
  }
  return "base-only";
}

export function buildReport(options: Options): BranchStackAuditReport {
  const baseCommit = tryRunGit(["rev-parse", "--verify", options.baseRef]);
  const currentCommit = runGit(["rev-parse", "--verify", options.currentRef]);
  const currentBranch = runGit(["branch", "--show-current"]) || options.currentRef;
  const refs = listRefs(options.includeRemote);
  const entries = refs
    .map((ref) => {
      const head = runGit(["rev-parse", "--verify", ref.name]);
      const subject = runGit(["log", "-1", "--format=%s", ref.name]);
      const aheadBase = commitCount(`${options.baseRef}..${ref.name}`);
      const aheadCurrent = commitCount(`${options.currentRef}..${ref.name}`);
      const patchesMissing = aheadCurrent > 0 ? unaccountedPatchCount(options.currentRef, ref.name) : 0;
      const missingCurrent = commitCount(`${ref.name}..${options.currentRef}`);
      const risk = classifyBranchStackEntry({
        name: ref.name,
        kind: ref.kind,
        currentBranch,
        aheadBase,
        aheadCurrent,
        unaccountedPatchCount: patchesMissing,
      });
      return {
        name: ref.name,
        kind: ref.kind,
        head: head.slice(0, 12),
        subject,
        aheadBase,
        aheadCurrent,
        unaccountedPatchCount: patchesMissing,
        missingCurrent,
        risk,
      };
    })
    .filter((entry) => options.includeBaseOnly || entry.risk !== "base-only")
    .sort((left, right) => {
      const riskCompare = left.risk.localeCompare(right.risk);
      return riskCompare === 0 ? left.name.localeCompare(right.name) : riskCompare;
    });

  const unaccountedEntries = entries.filter(
    (entry) => entry.risk === "unaccounted-local" || entry.risk === "unaccounted-remote",
  );
  const recommendations =
    unaccountedEntries.length === 0
      ? ["No branch-stack commits are hidden from the current branch."]
      : unaccountedEntries.map(
          (entry) =>
            `Account for ${entry.name}: ${entry.aheadCurrent} commit(s) are not reachable from ${options.currentRef}. Merge, cherry-pick, supersede, or record as intentionally parked.`,
        );

  return {
    baseRef: options.baseRef,
    baseCommit: baseCommit?.slice(0, 12) ?? null,
    currentRef: options.currentRef,
    currentCommit: currentCommit.slice(0, 12),
    entries,
    unaccountedEntries,
    recommendations,
  };
}

function printReport(report: BranchStackAuditReport): void {
  console.log("Git Branch Stack Audit");
  console.log(`- base: ${report.baseRef} (${report.baseCommit ?? "missing"})`);
  console.log(`- current: ${report.currentRef} (${report.currentCommit})`);
  console.log(`- refs checked: ${report.entries.length}`);
  console.log(`- unaccounted refs: ${report.unaccountedEntries.length}`);
  for (const entry of report.entries) {
    console.log(
      `- ${entry.name}: ${entry.head} ${entry.risk} ahead-base=${entry.aheadBase} ahead-current=${entry.aheadCurrent} missing-current=${entry.missingCurrent}`,
    );
    if (entry.aheadCurrent > 0) {
      console.log(`  unaccounted patches: ${entry.unaccountedPatchCount}`);
    }
    console.log(`  ${entry.subject}`);
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
  if (report.unaccountedEntries.length > 0) {
    process.exitCode = 1;
  }
}
