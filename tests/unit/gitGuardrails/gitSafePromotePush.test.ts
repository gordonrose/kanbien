import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  applySafePromotePush,
  buildReport,
} from "../../../src/scripts/gitSafePromotePush";

const tempRoots: string[] = [];

function git(cwd: string, args: string[]): string {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function createRepo(): { remotePath: string; repoPath: string } {
  const root = mkdtempSync(path.join(tmpdir(), "kanbien-safe-promote-push-"));
  tempRoots.push(root);
  const remotePath = path.join(root, "origin.git");
  const repoPath = path.join(root, "repo");

  execFileSync("git", ["init", "--bare", remotePath], { stdio: "ignore" });
  execFileSync("git", ["init", "-b", "main", repoPath], { stdio: "ignore" });
  git(repoPath, ["config", "user.name", "Codex Test"]);
  git(repoPath, ["config", "user.email", "codex@example.test"]);
  git(repoPath, ["remote", "add", "origin", remotePath]);
  writeFileSync(path.join(repoPath, "README.md"), "base\n");
  git(repoPath, ["add", "README.md"]);
  git(repoPath, ["commit", "-m", "base"]);
  git(repoPath, ["push", "-u", "origin", "main"]);

  return { remotePath, repoPath };
}

function withCwd<T>(cwd: string, callback: () => T): T {
  const previous = process.cwd();
  process.chdir(cwd);
  try {
    return callback();
  } finally {
    process.chdir(previous);
  }
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { force: true, recursive: true });
  }
});

describe("git safe promote push", () => {
  it("rebases, fast-forwards main, and pushes without force when the task is safe", () => {
    const { remotePath, repoPath } = createRepo();
    git(repoPath, ["switch", "-c", "codex/safe-task"]);
    writeFileSync(path.join(repoPath, "task.txt"), "task\n");
    git(repoPath, ["add", "task.txt"]);
    git(repoPath, ["commit", "-m", "add task file"]);

    const finalReport = withCwd(repoPath, () => {
      const report = buildReport({
        apply: true,
        json: false,
        remote: "origin",
        sourceRef: "codex/safe-task",
        targetBranch: "main",
      });
      expect(report.status).toBe("READY_TO_APPLY");
      return applySafePromotePush(report, {
        apply: true,
        json: false,
        remote: "origin",
        sourceRef: "codex/safe-task",
        targetBranch: "main",
      });
    });

    expect(finalReport.status).toBe("SAFE_PUSHED");
    expect(git(repoPath, ["rev-parse", "main"])).toBe(git(remotePath, ["rev-parse", "main"]));
    expect(git(repoPath, ["rev-list", "--count", "origin/main..main"])).toBe("0");
  });

  it("blocks instead of moving main when main has unique local commits", () => {
    const { repoPath } = createRepo();
    writeFileSync(path.join(repoPath, "main-only.txt"), "local main\n");
    git(repoPath, ["add", "main-only.txt"]);
    git(repoPath, ["commit", "-m", "local main only"]);
    git(repoPath, ["switch", "-c", "codex/safe-task"]);
    writeFileSync(path.join(repoPath, "task.txt"), "task\n");
    git(repoPath, ["add", "task.txt"]);
    git(repoPath, ["commit", "-m", "add task file"]);

    const report = withCwd(repoPath, () =>
      buildReport({
        apply: true,
        json: false,
        remote: "origin",
        sourceRef: "codex/safe-task",
        targetBranch: "main",
      }),
    );

    expect(report.status).toBe("LOCAL_MAIN_UNIQUE_BLOCK");
    expect(report.recommendations.join("\n")).toContain("refuses to overwrite");
  });

  it("blocks rebasing and promotion from a dirty worktree", () => {
    const { repoPath } = createRepo();
    git(repoPath, ["switch", "-c", "codex/safe-task"]);
    writeFileSync(path.join(repoPath, "task.txt"), "uncommitted\n");

    const report = withCwd(repoPath, () =>
      buildReport({
        apply: true,
        json: false,
        remote: "origin",
        sourceRef: "codex/safe-task",
        targetBranch: "main",
      }),
    );

    expect(report.status).toBe("DIRTY_BLOCK");
    expect(report.recommendations.join("\n")).toContain("dirty worktree");
    expect(git(repoPath, ["rev-parse", "main"])).toBe(git(repoPath, ["rev-parse", "origin/main"]));
  });
});
