import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import {
  applyPromotion,
  buildReport,
} from "../../../src/scripts/codexPromoteTask";

const tempRoots: string[] = [];

function git(cwd: string, args: string[]): string {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function createRepo(): { repoPath: string; taskPath: string } {
  const root = mkdtempSync(path.join(tmpdir(), "kanbien-promote-task-"));
  tempRoots.push(root);
  const repoPath = path.join(root, "repo");
  const taskPath = path.join(root, "task");

  execFileSync("git", ["init", "-b", "main", repoPath], { stdio: "ignore" });
  git(repoPath, ["config", "user.name", "Codex Test"]);
  git(repoPath, ["config", "user.email", "codex@example.test"]);
  writeFileSync(path.join(repoPath, "README.md"), "base\n");
  git(repoPath, ["add", "README.md"]);
  git(repoPath, ["commit", "-m", "base"]);
  git(repoPath, ["update-ref", "refs/remotes/origin/main", "HEAD"]);
  git(repoPath, ["worktree", "add", "-b", "codex/sample-task", taskPath, "main"]);

  return { repoPath, taskPath };
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

describe("codex promote task", () => {
  it("retires the promoted task branch and worktree after a clean fast-forward promotion", () => {
    const { repoPath, taskPath } = createRepo();
    writeFileSync(path.join(taskPath, "task.txt"), "promoted\n");
    git(taskPath, ["add", "task.txt"]);
    git(taskPath, ["commit", "-m", "add task file"]);

    const finalReport = withCwd(repoPath, () => {
      const report = buildReport({
        apply: true,
        json: false,
        taskId: "sample-task",
      });
      expect(report.status).toBe("READY_TO_PROMOTE");
      return applyPromotion(report);
    });

    expect(finalReport.status).toBe("PROMOTED_LOCALLY");
    expect(finalReport.retirementActions).toContain(`Removed worktree ${taskPath}`);
    expect(finalReport.retirementActions).toContain("Deleted branch codex/sample-task");
    expect(existsSync(taskPath)).toBe(false);
    expect(git(repoPath, ["branch", "--list", "codex/sample-task"])).toBe("");
    expect(git(repoPath, ["rev-parse", "--abbrev-ref", "HEAD"])).toBe("main");
    expect(existsSync(path.join(repoPath, "task.txt"))).toBe(true);
  });

  it("blocks promotion when the source task worktree has uncommitted changes", () => {
    const { repoPath, taskPath } = createRepo();
    writeFileSync(path.join(taskPath, "task.txt"), "committed\n");
    git(taskPath, ["add", "task.txt"]);
    git(taskPath, ["commit", "-m", "add task file"]);
    writeFileSync(path.join(taskPath, "wip.txt"), "uncommitted\n");

    const report = withCwd(repoPath, () =>
      buildReport({
        apply: true,
        json: false,
        taskId: "sample-task",
      }),
    );

    expect(report.status).toBe("TASK_BLOCK");
    expect(report.recommendations.join("\n")).toContain("source task worktree has local changes");
    expect(existsSync(taskPath)).toBe(true);
    expect(git(repoPath, ["rev-parse", "main"])).toBe(git(repoPath, ["rev-parse", "origin/main"]));
  });
});
