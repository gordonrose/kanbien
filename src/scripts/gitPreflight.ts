import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

type PreflightStatus =
  | "SAFE"
  | "DIRTY_BLOCK"
  | "STALE_MAIN_BLOCK"
  | "MAIN_BRANCH_BLOCK"
  | "BOOTSTRAP_MISSING_BLOCK";

type Options = {
  allowDirty: boolean;
  allowMain: boolean;
  allowStaleMain: boolean;
  bootstrapPath: string | null;
  json: boolean;
};

type Report = {
  status: PreflightStatus;
  branch: string;
  headCommit: string;
  localMainCommit: string | null;
  originMainCommit: string | null;
  localMainMatchesOriginMain: boolean;
  worktreeClean: boolean;
  worktreeChanges: string[];
  bootstrapPath: string | null;
  bootstrapExists: boolean | null;
  upstream: string | null;
  recommendations: string[];
};

function parseArgs(argv: string[]): Options {
  let allowDirty = false;
  let allowMain = false;
  let allowStaleMain = false;
  let bootstrapPath: string | null = null;
  let json = false;

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--allow-dirty") {
      allowDirty = true;
      continue;
    }
    if (value === "--allow-main") {
      allowMain = true;
      continue;
    }
    if (value === "--allow-stale-main") {
      allowStaleMain = true;
      continue;
    }
    if (value === "--json") {
      json = true;
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
    allowMain,
    allowStaleMain,
    bootstrapPath,
    json,
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

function buildReport(options: Options): Report {
  const branch = runGit(["branch", "--show-current"]) || "(detached)";
  const headCommit = runGit(["rev-parse", "--short", "HEAD"]);
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

  let status: PreflightStatus = "SAFE";
  if (!options.allowDirty && !worktreeClean) {
    status = "DIRTY_BLOCK";
  } else if (!options.allowStaleMain && !localMainMatchesOriginMain) {
    status = "STALE_MAIN_BLOCK";
  } else if (!options.allowMain && branch === "main") {
    status = "MAIN_BRANCH_BLOCK";
  } else if (options.bootstrapPath !== null && !bootstrapExists) {
    status = "BOOTSTRAP_MISSING_BLOCK";
  }

  const recommendations: string[] = [];
  if (!worktreeClean) {
    recommendations.push(
      "Commit, stash, back up, or isolate the current dirty state before starting unrelated material work.",
    );
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
  if (recommendations.length === 0) {
    recommendations.push(
      "Current repo state is safe for scoped work. Keep the task isolated and commit only the intended write set.",
    );
  }

  return {
    status,
    branch,
    headCommit,
    localMainCommit,
    originMainCommit,
    localMainMatchesOriginMain,
    worktreeClean,
    worktreeChanges,
    bootstrapPath: options.bootstrapPath,
    bootstrapExists,
    upstream,
    recommendations,
  };
}

function printReport(report: Report): void {
  console.log("Git Preflight");
  console.log(`- status: ${report.status}`);
  console.log(`- branch: ${report.branch}`);
  console.log(`- head: ${report.headCommit}`);
  console.log(`- upstream: ${report.upstream ?? "(none)"}`);
  console.log(`- local main: ${report.localMainCommit ?? "(missing)"}`);
  console.log(`- origin/main: ${report.originMainCommit ?? "(missing)"}`);
  console.log(
    `- local main synced: ${report.localMainMatchesOriginMain ? "yes" : "no"}`,
  );
  console.log(`- worktree clean: ${report.worktreeClean ? "yes" : "no"}`);
  if (report.bootstrapPath !== null) {
    console.log(
      `- bootstrap: ${report.bootstrapExists ? "present" : "missing"} (${report.bootstrapPath})`,
    );
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
