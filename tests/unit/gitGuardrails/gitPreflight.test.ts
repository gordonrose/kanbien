import { describe, expect, it } from "vitest";

import {
  findDirtyWriteSetCollisions,
  parseBootstrapRecord,
  parseDirtyPaths,
  parseWriteSetPaths,
  validateBootstrapRecord,
} from "../../../src/scripts/gitPreflight";

describe("git preflight bootstrap validation", () => {
  it("parses the fields that make a material chat auditable", () => {
    const parsed = parseBootstrapRecord(`
# Chat Branch Bootstrap Template

- Base Commit: 65e879dc47189d227be15e01b290cd94ed54a867
- Dedicated Branch: codex/git-harness-stricter-worktree-guardrails
- Dedicated Worktree Path: /home/gordon/kanbien
- Planned Write Set: src/scripts/gitPreflight.ts and git guardrail docs
`);

    expect(parsed).toEqual({
      baseCommit: "65e879dc47189d227be15e01b290cd94ed54a867",
      dedicatedBranch: "codex/git-harness-stricter-worktree-guardrails",
      dedicatedWorktreePath: "/home/gordon/kanbien",
      plannedWriteSet: "src/scripts/gitPreflight.ts and git guardrail docs",
    });
  });

  it("flags branch and worktree mismatches instead of accepting any bootstrap file", () => {
    const mismatches = validateBootstrapRecord({
      bootstrap: {
        baseCommit: "65e879d",
        dedicatedBranch: "codex/other-task",
        dedicatedWorktreePath: "/tmp/other-worktree",
        plannedWriteSet: null,
      },
      branch: "codex/git-harness-stricter-worktree-guardrails",
      cwd: "/home/gordon/kanbien",
      headCommit: "65e879dc47189d227be15e01b290cd94ed54a867",
    });

    expect(mismatches).toContain(
      "bootstrap branch codex/other-task does not match current branch codex/git-harness-stricter-worktree-guardrails",
    );
    expect(mismatches).toContain(
      "bootstrap worktree /tmp/other-worktree does not match current worktree /home/gordon/kanbien",
    );
    expect(mismatches).toContain("bootstrap is missing Planned Write Set");
  });
});

describe("git preflight dirty write-set collision detection", () => {
  it("extracts explicit path tokens from a planned write set", () => {
    expect(
      parseWriteSetPaths(
        "src/scripts/gitPreflight.ts, tests/unit/gitGuardrails/gitPreflight.test.ts and git guardrail docs",
      ),
    ).toEqual([
      "src/scripts/gitPreflight.ts",
      "tests/unit/gitGuardrails/gitPreflight.test.ts",
    ]);
  });

  it("extracts both sides of renamed dirty paths", () => {
    expect(parseDirtyPaths("R  docs/old.md -> docs/new.md")).toEqual([
      "docs/old.md",
      "docs/new.md",
    ]);
  });

  it("does not drop the first character from modified dirty paths", () => {
    expect(parseDirtyPaths(" M docs/architecture/frontend-overview.md")).toEqual([
      "docs/architecture/frontend-overview.md",
    ]);
  });

  it("allows unrelated dirty paths to stay disjoint from the current chat write set", () => {
    const collisions = findDirtyWriteSetCollisions({
      dirtyPaths: ["docs/workspace/product-discovery/reporting-dashboard.md"],
      plannedWriteSetPaths: ["src/scripts/gitPreflight.ts", "tests/unit/gitGuardrails"],
    });

    expect(collisions).toEqual([]);
  });

  it("flags exact and nested collisions with the current chat write set", () => {
    const collisions = findDirtyWriteSetCollisions({
      dirtyPaths: [
        "src/scripts/gitPreflight.ts",
        "tests/unit/gitGuardrails/gitPreflight.test.ts",
      ],
      plannedWriteSetPaths: ["src/scripts/gitPreflight.ts", "tests/unit/gitGuardrails"],
    });

    expect(collisions).toEqual([
      "src/scripts/gitPreflight.ts",
      "tests/unit/gitGuardrails/gitPreflight.test.ts",
    ]);
  });
});
