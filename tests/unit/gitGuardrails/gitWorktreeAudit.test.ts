import { describe, expect, it } from "vitest";

import {
  classifyWorktreeRisks,
  hasTopicOverlap,
  parsePreservedWorktreeRecordMarkdown,
  parseWorktreeListPorcelain,
} from "../../../src/scripts/gitWorktreeAudit";

describe("git worktree audit helpers", () => {
  it("parses porcelain worktree output with branch names and heads", () => {
    const parsed = parseWorktreeListPorcelain(`
worktree /home/gordon/kanbien
HEAD 65e879dc47189d227be15e01b290cd94ed54a867
branch refs/heads/main

worktree /tmp/kanbien-job-processing-planning
HEAD 8905af64a04f9f0c479e69303563d664e8ac2b35
branch refs/heads/codex/job-processing-planning-isolated
`);

    expect(parsed).toEqual([
      {
        path: "/home/gordon/kanbien",
        branch: "main",
        head: "65e879dc47189d227be15e01b290cd94ed54a867",
      },
      {
        path: "/tmp/kanbien-job-processing-planning",
        branch: "codex/job-processing-planning-isolated",
        head: "8905af64a04f9f0c479e69303563d664e8ac2b35",
      },
    ]);
  });

  it("spots dirty worktree topic mismatches without treating main as suspicious", () => {
    expect(
      hasTopicOverlap(
        "codex/job-processing-planning-isolated",
        "Add brochure editable-state affordances",
      ),
    ).toBe(false);
    expect(
      hasTopicOverlap(
        "codex/job-processing-planning-isolated",
        "Plan job processing foundation",
      ),
    ).toBe(true);
    expect(hasTopicOverlap("main", "Implement asset foundation v1")).toBeNull();
  });

  it("parses preserved worktree records only when the decision is explicit", () => {
    expect(
      parsePreservedWorktreeRecordMarkdown(
        `
# Preserved Worktree

- Worktree Path: /tmp/kanbien-admin-profile-logo-assets
- Branch: codex/admin-profile-logo-assets
- Allowed To Block Unrelated Work: no
`,
        "docs/workspace/preserved-worktrees/admin-profile-logo-assets.md",
      ),
    ).toEqual({
      filePath: "docs/workspace/preserved-worktrees/admin-profile-logo-assets.md",
      worktreePath: "/tmp/kanbien-admin-profile-logo-assets",
      branch: "codex/admin-profile-logo-assets",
      allowedToBlockUnrelatedWork: false,
    });

    expect(
      parsePreservedWorktreeRecordMarkdown(
        `
- Worktree Path: /tmp/example
- Branch: codex/example
`,
        "docs/workspace/preserved-worktrees/example.md",
      ),
    ).toBeNull();
  });

  it("downgrades explicitly preserved stale WIP without downgrading unknown stale worktrees", () => {
    expect(
      classifyWorktreeRisks({
        clean: false,
        descendsFromBase: false,
        topicOverlap: false,
        preservedWorktreeRecord: null,
      }),
    ).toEqual(["dirty", "dirty-stale-base", "topic-mismatch"]);

    expect(
      classifyWorktreeRisks({
        clean: false,
        descendsFromBase: false,
        topicOverlap: false,
        preservedWorktreeRecord: {
          filePath: "docs/workspace/preserved-worktrees/admin-profile-logo-assets.md",
          worktreePath: "/tmp/kanbien-admin-profile-logo-assets",
          branch: "codex/admin-profile-logo-assets",
          allowedToBlockUnrelatedWork: false,
        },
      }),
    ).toEqual(["dirty", "preserved-stale-wip"]);
  });
});
