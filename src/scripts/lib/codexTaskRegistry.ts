import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type InventoryState = "integration_home" | "active" | "inspect" | "retire_now";
export type InventoryKind = "integration_home" | "attached_worktree" | "unattached_branch";

export type TaskRecord = {
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
  parentTaskId: string | null;
  plannedWriteSet: string[];
  knownSharedSeams: string[];
  state: InventoryState;
  recommendation: string;
};

export type InventoryReport = {
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

export const GENERATED_JSON_PATH = "docs/workspace/task-registry/current-tasks.generated.json";

type BootstrapMetadata = {
  bootstrapPaths: string[];
  parentTaskId: string | null;
  plannedWriteSet: string[];
  knownSharedSeams: string[];
};

export function runGit(args: string[], cwd?: string): string {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

export function tryRunGit(args: string[], cwd?: string): string | null {
  try {
    return runGit(args, cwd);
  } catch {
    return null;
  }
}

export function repoRoot(): string {
  return runGit(["rev-parse", "--show-toplevel"]);
}

export function shortCommit(ref: string, cwd?: string): string | null {
  return tryRunGit(["rev-parse", "--verify", "--short", ref], cwd);
}

export function integrationHomePath(repoPath: string): string {
  const worktrees = parseWorktreeList(repoPath);
  return worktrees.find((entry) => entry.branch === "main")?.path ?? repoPath;
}

export function normalizeForMatch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/\/\*\*$/u, "")
    .replace(/\/\*$/u, "")
    .replace(/\*$/u, "")
    .replace(/\/$/u, "");
}

export function writeSetOverlaps(left: string[], right: string[]): boolean {
  const normalizedLeft = left.map(normalizeForMatch);
  const normalizedRight = right.map(normalizeForMatch);

  return normalizedLeft.some((leftEntry) =>
    normalizedRight.some(
      (rightEntry) =>
        leftEntry === rightEntry ||
        leftEntry.startsWith(`${rightEntry}/`) ||
        rightEntry.startsWith(`${leftEntry}/`),
    ),
  );
}

export function sharedSeamsOverlap(left: string[], right: string[]): boolean {
  const normalizedRight = new Set(right.map(normalizeForMatch));
  return left.map(normalizeForMatch).some((entry) => normalizedRight.has(entry));
}

export function deriveBranchName(slug: string): string {
  return slug.startsWith("codex/") ? slug : `codex/${slug}`;
}

export function deriveBootstrapPath(repoPath: string, slug: string): string {
  return path.join(repoPath, "docs/workspace/chat-bootstraps", `${new Date().toISOString().slice(0, 10)}-${slug}.md`);
}

export function deriveWorktreePath(slug: string): string {
  return `/tmp/kanbien-${slug}`;
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

function parseBootstrapNestedList(content: string, label: string): string[] {
  const lines = content.split("\n");
  const labelPrefix = `- ${label}:`;
  const startIndex = lines.findIndex((line) => line.trim() === labelPrefix);
  if (startIndex === -1) {
    return [];
  }

  const values: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^## /.test(line)) {
      break;
    }
    if (/^- /.test(line)) {
      break;
    }
    const trimmed = line.trim();
    if (trimmed.startsWith("- ")) {
      const value = trimmed.slice(2).trim();
      if (value) {
        values.push(value);
      }
    }
  }

  return values;
}

function bootstrapIndex(repoPath: string): Map<string, BootstrapMetadata> {
  const bootstrapDir = path.join(repoPath, "docs/workspace/chat-bootstraps");
  const index = new Map<string, BootstrapMetadata>();
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
    const parentTaskMatch = content.match(/(?:^|\n)- Parent Task:\s*`?([A-Za-z0-9._/-]+)`?/);
    const plannedWriteSet = parseBootstrapNestedList(content, "Planned Write Set");
    const knownSharedSeams = parseBootstrapNestedList(content, "Known Shared Seams");
    const dedicatedBranchMatch = content.match(/(?:^|\n)- Dedicated Branch:\s*`?([A-Za-z0-9._/-]+)`?/);
    const finalBranchMatch = content.match(/(?:^|\n)- Final Branch Used:\s*`?([A-Za-z0-9._/-]+)`?/);

    if (dedicatedBranchMatch?.[1]) {
      branches.add(dedicatedBranchMatch[1]);
    }
    if (finalBranchMatch?.[1]) {
      branches.add(finalBranchMatch[1]);
    }

    for (const branch of branches) {
      const existing = index.get(branch) ?? {
        bootstrapPaths: [],
        parentTaskId: null,
        plannedWriteSet: [],
        knownSharedSeams: [],
      };
      existing.bootstrapPaths.push(path.relative(repoPath, fullPath));
      if (parentTaskMatch?.[1]) {
        existing.parentTaskId = parentTaskMatch[1];
      }
      for (const entry of plannedWriteSet) {
        if (!existing.plannedWriteSet.includes(entry)) {
          existing.plannedWriteSet.push(entry);
        }
      }
      for (const entry of knownSharedSeams) {
        if (!existing.knownSharedSeams.includes(entry)) {
          existing.knownSharedSeams.push(entry);
        }
      }
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
  bootstrapMetadata: BootstrapMetadata,
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
    bootstrapPaths: bootstrapMetadata.bootstrapPaths,
    parentTaskId: bootstrapMetadata.parentTaskId,
    plannedWriteSet: bootstrapMetadata.plannedWriteSet,
    knownSharedSeams: bootstrapMetadata.knownSharedSeams,
  };

  return {
    ...base,
    ...classifyRecord(base),
  };
}

export function buildInventoryReport(repoPath: string): InventoryReport {
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
        bootstrapPathsByBranch.get(worktree.branch) ?? {
          bootstrapPaths: [],
          parentTaskId: null,
          plannedWriteSet: [],
          knownSharedSeams: [],
        },
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
      buildRecord(
        repoPath,
        branch,
        null,
        bootstrapPathsByBranch.get(branch) ?? {
          bootstrapPaths: [],
          parentTaskId: null,
          plannedWriteSet: [],
          knownSharedSeams: [],
        },
        "unattached_branch",
      ),
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

export function writeInventoryReport(report: InventoryReport): void {
  const outputPath = path.join(report.repoRoot, GENERATED_JSON_PATH);
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}
