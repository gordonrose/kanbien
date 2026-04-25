import { describe, expect, it } from "vitest";

import {
  parseBootstrapRecord,
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
