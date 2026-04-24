import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type InventoryState = "integration_home" | "active" | "inspect" | "retire_now";
type InventoryKind = "integration_home" | "attached_worktree" | "unattached_branch";

type Options = {
  json: boolean;
  write: boolean;
};

type TaskRecord = {
  taskId: string;
  kind: InventoryKind;
  branch: string;
  worktreePath: string | null;
  headCommit: string | null;
  upstream: string | null;
  aheadOfMain: number | null;
  behindMain: number | null;
  uniquePatchCommitCount: number | null;
  dirty: boolean;
  dirtyEntries: string[];
  bootstrapPaths: string[];
  state: InventoryState;
  recommendation: string;
};

type InventoryReport = {
  generatedAt: string;
  repoRoot: string;
  targetMain: string;
  records: TaskRecord[];
};

type WorktreeEntry = {
  branch: string;
  headCommit: string;
  path: string;
};

const GENERATED_JSON_PATH = "docs/workspace/task-registry/current-tasks.generated.json";

function parseArgs(argv: string[]): Options {
  return {
    json: argv.includes("--json"),
    write: argv.includes("--write"),
  };
}

function runGit(args: string[], cwd?: string): string {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function tryRunGit(args: string[], cwd?: string): string | null {
  try {
    return runGit(args, cwd);
  } catch {
    return null;
  }
}

function repoRoot(): string {
  return runGit(["rev-parse", "--show-toplevel"]);
}

function shortCommit(ref: string, cwd?: string): string | null {
  return tryRunGit(["rev-parse", "--verify", "--short", ref], cwd);
}

function parseWorktreeList(repoPath: string): WorktreeEntry[] {
  const porcelain = runGit(["worktree", "list", "--porcelain"], repoPath);
  const entries: WorktreeEntry[] = [];
  let current: Partial<WorktreeEntry> = {};

  for (const line of porcelain.split("\n")) {
    if (line.startsWith("worktree ")) {
      if (current.path && current.branch && current.headCommit) {
        entries.push(current as WorktreeEntry);
      }
      current = { path: line.slice("worktree ".length) };
      continue;
    }
    if (line.startsWith("HEAD ")) {
      current.headCommit = line.slice("HEAD ".length).slice(0, 7);
      continue;
    }
    if (line.startsWith("branch ")) {
      current.branch = line.slice("branch ".length).replace("refs/heads/", "");
    }
  }

  if (current.path && current.branch && current.headCommit) {
    entries.push(current as WorktreeEntry);
  }

  return entries;
}

function parseStatusEntries(worktreePath: string): string[] {
  const output = runGit(["status", "--short"], worktreePath);
  if (!output) {
    return [];
  }
  return output
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean);
}

function normalizeDirtyEntries(entries: string[]): string[] {
  return entries.filter((entry) => {
    const normalized = entry.replace(/^[ MARCUD?!]+/, "").trim();
    return normalized !== "node_modules" && normalized !== "test-results/";
  });
}

function aheadBehind(repoPath: string, branch: string): { ahead: number | null; behind: number | null } {
  const output = tryRunGit(["rev-list", "--left-right", "--count", `main...${branch}`], repoPath);
  if (!output) {
    return { ahead: null, behind: null };
  }
  const [behindRaw, aheadRaw] = output.split(/\s+/);
  const behind = Number.parseInt(behindRaw ?? "", 10);
  const ahead = Number.parseInt(aheadRaw ?? "", 10);
  return {
    ahead: Number.isFinite(ahead) ? ahead : null,
    behind: Number.isFinite(behind) ? behind : null,
  };
}

function uniquePatchCommitCount(repoPath: string, branch: string): number | null {
  const output = tryRunGit(["cherry", "main", branch], repoPath);
  if (output === null) {
    return null;
  }
  if (!output) {
    return 0;
  }
  return output
    .split("\n")
    .filter(Boolean)
    .filter((line) => line.startsWith("+ "))
    .length;
}

function bootstrapIndex(repoPath: string): Map<string, string[]> {
  const bootstrapDir = path.join(repoPath, "docs/workspace/chat-bootstraps");
  const index = new Map<string, string[]>();
  if (!existsSync(bootstrapDir)) {
    return index;
  }

  for (const fileName of readdirSync(bootstrapDir)) {
    if (!fileName.endsWith(".md")) {
      continue;
    }
    const fullPath = path.join(bootstrapDir, fileName);
    const content = readFileSync(fullPath, "utf8");
    const branches = new Set<string>();
    const dedicatedBranchMatch = content.match(/(?:^|\n)- Dedicated Branch:\s*`?([A-Za-z0-9._/-]+)`?/);
    const finalBranchMatch = content.match(/(?:^|\n)- Final Branch Used:\s*`?([A-Za-z0-9._/-]+)`?/);

    if (dedicatedBranchMatch?.[1]) {
      branches.add(dedicatedBranchMatch[1]);
    }
    if (finalBranchMatch?.[1]) {
      branches.add(finalBranchMatch[1]);
    }

    for (const branch of branches) {
      const existing = index.get(branch) ?? [];
      existing.push(path.relative(repoPath, fullPath));
      index.set(branch, existing);
    }
  }

  return index;
}

function classifyRecord(record: Omit<TaskRecord, "state" | "recommendation">): Pick<TaskRecord, "state" | "recommendation"> {
  if (record.kind === "integration_home") {
    return {
      state: "integration_home",
      recommendation: "Keep /home/gordon/kanbien clean and synced; use it as the local integration home.",
    };
  }

  if (!record.dirty && record.uniquePatchCommitCount === 0) {
    return {
      state: "retire_now",
      recommendation: "No unique patch content remains and the worktree is clean; retire this branch/worktree.",
    };
  }

  if (record.uniquePatchCommitCount === 0) {
    return {
      state: "inspect",
      recommendation: "This task has no unique patch content, but it still has local changes; inspect and either integrate the keepers or discard and retire it.",
    };
  }

  return {
    state: "active",
    recommendation:
      record.behindMain !== null && record.behindMain > 0
        ? "This task still carries unique patch content but is behind main; review whether it should be integrated by cherry-pick or intentionally parked."
        : "This task still carries unique patch content; continue or prepare a scoped promotion.",
  };
}

function taskIdForBranch(branch: string): string {
  if (branch === "main") {
    return "main";
  }
  if (branch.startsWith("codex/")) {
    return branch.slice("codex/".length);
  }
  return branch;
}

function buildRecord(
  repoPath: string,
  branch: string,
  worktreePath: string | null,
  bootstrapPaths: string[],
  kind: InventoryKind,
): TaskRecord {
  const dirtyEntries = worktreePath ? parseStatusEntries(worktreePath) : [];
  const normalizedDirtyEntries = normalizeDirtyEntries(dirtyEntries);
  const dirty = normalizedDirtyEntries.length > 0;
  const headCommit =
    worktreePath !== null ? shortCommit("HEAD", worktreePath) : shortCommit(branch, repoPath);
  const upstream =
    worktreePath !== null
      ? tryRunGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], worktreePath)
      : null;
  const { ahead, behind } = kind === "integration_home" ? { ahead: 0, behind: 0 } : aheadBehind(repoPath, branch);
  const uniquePatchCount = kind === "integration_home" ? 0 : uniquePatchCommitCount(repoPath, branch);

  const base: Omit<TaskRecord, "state" | "recommendation"> = {
    taskId: taskIdForBranch(branch),
    kind,
    branch,
    worktreePath,
    headCommit,
    upstream,
    aheadOfMain: ahead,
    behindMain: behind,
    uniquePatchCommitCount: uniquePatchCount,
    dirty,
    dirtyEntries: normalizedDirtyEntries,
    bootstrapPaths,
  };

  return {
    ...base,
    ...classifyRecord(base),
  };
}

function buildReport(repoPath: string): InventoryReport {
  const worktrees = parseWorktreeList(repoPath);
  const attachedBranches = new Set(worktrees.map((entry) => entry.branch));
  const bootstrapPathsByBranch = bootstrapIndex(repoPath);
  const records: TaskRecord[] = [];

  for (const worktree of worktrees) {
    records.push(
      buildRecord(
        repoPath,
        worktree.branch,
        worktree.path,
        bootstrapPathsByBranch.get(worktree.branch) ?? [],
        worktree.branch === "main" ? "integration_home" : "attached_worktree",
      ),
    );
  }

  const codexBranches = runGit(["for-each-ref", "--format=%(refname:short)", "refs/heads"], repoPath)
    .split("\n")
    .map((branch) => branch.trim())
    .filter(Boolean)
    .filter((branch) => branch.startsWith("codex/"))
    .filter((branch) => !attachedBranches.has(branch));

  for (const branch of codexBranches) {
    records.push(
      buildRecord(repoPath, branch, null, bootstrapPathsByBranch.get(branch) ?? [], "unattached_branch"),
    );
  }

  records.sort((left, right) => left.taskId.localeCompare(right.taskId));

  return {
    generatedAt: new Date().toISOString(),
    repoRoot: repoPath,
    targetMain: shortCommit("main", repoPath) ?? "(missing)",
    records,
  };
}

function printDashboard(report: InventoryReport): void {
  console.log("Codex Tasks");
  console.log(`- repo: ${report.repoRoot}`);
  console.log(`- main: ${report.targetMain}`);
  console.log(`- generated: ${report.generatedAt}`);
  console.log("");

  for (const record of report.records) {
    const aheadBehind =
      record.aheadOfMain === null || record.behindMain === null
        ? "n/a"
        : `${record.behindMain} behind / ${record.aheadOfMain} ahead`;
    console.log(`${record.taskId}`);
    console.log(`- branch: ${record.branch}`);
    console.log(`- kind: ${record.kind}`);
    console.log(`- state: ${record.state}`);
    console.log(`- worktree: ${record.worktreePath ?? "(none)"}`);
    console.log(`- head: ${record.headCommit ?? "(missing)"}`);
    console.log(`- main delta: ${aheadBehind}`);
    console.log(`- unique patch commits: ${record.uniquePatchCommitCount ?? "n/a"}`);
    console.log(`- dirty: ${record.dirty ? "yes" : "no"}`);
    if (record.bootstrapPaths.length > 0) {
      console.log(`- bootstrap: ${record.bootstrapPaths.join(", ")}`);
    }
    if (record.dirtyEntries.length > 0) {
      console.log("- dirty entries:");
      for (const entry of record.dirtyEntries) {
        console.log(`  ${entry}`);
      }
    }
    console.log(`- recommendation: ${record.recommendation}`);
    console.log("");
  }
}

function writeReport(report: InventoryReport): void {
  const outputPath = path.join(report.repoRoot, GENERATED_JSON_PATH);
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}

const options = parseArgs(process.argv.slice(2));
const report = buildReport(repoRoot());

if (options.write) {
  writeReport(report);
}

if (options.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printDashboard(report);
}
