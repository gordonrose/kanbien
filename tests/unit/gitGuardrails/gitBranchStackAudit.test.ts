import { describe, expect, it } from "vitest";

import {
  classifyBranchStackEntry,
  parseBranchStackReconciliationRecordMarkdown,
} from "../../../src/scripts/gitBranchStackAudit";

describe("git branch stack audit helpers", () => {
  it("treats sibling branch commits missing from the current branch as unaccounted", () => {
    expect(
      classifyBranchStackEntry({
        name: "codex/l4-evidence-qa-task-type",
        kind: "local",
        currentBranch: "codex/l4-permission-mapping-authz-model",
        aheadBase: 2,
        aheadCurrent: 2,
        unaccountedPatchCount: 2,
        reconciliationRecord: null,
      }),
    ).toBe("unaccounted-local");

    expect(
      classifyBranchStackEntry({
        name: "origin/codex/l4-evidence-qa-task-type",
        kind: "remote",
        currentBranch: "codex/l4-permission-mapping-authz-model",
        aheadBase: 2,
        aheadCurrent: 2,
        unaccountedPatchCount: 2,
        reconciliationRecord: null,
      }),
    ).toBe("unaccounted-remote");
  });

  it("distinguishes current, patch-equivalent, and already-accounted branches from hidden work", () => {
    expect(
      classifyBranchStackEntry({
        name: "codex/l4-permission-mapping-authz-model",
        kind: "local",
        currentBranch: "codex/l4-permission-mapping-authz-model",
        aheadBase: 17,
        aheadCurrent: 0,
        unaccountedPatchCount: 0,
        reconciliationRecord: null,
      }),
    ).toBe("current");

    expect(
      classifyBranchStackEntry({
        name: "codex/layer4-task-type-prefixes",
        kind: "local",
        currentBranch: "codex/l4-permission-mapping-authz-model",
        aheadBase: 6,
        aheadCurrent: 6,
        unaccountedPatchCount: 0,
        reconciliationRecord: null,
      }),
    ).toBe("patch-accounted-in-current");

    expect(
      classifyBranchStackEntry({
        name: "codex/platform-authz-definition",
        kind: "local",
        currentBranch: "codex/l4-permission-mapping-authz-model",
        aheadBase: 5,
        aheadCurrent: 0,
        unaccountedPatchCount: 0,
        reconciliationRecord: null,
      }),
    ).toBe("accounted-in-current");

    expect(
      classifyBranchStackEntry({
        name: "codex/old-clean-task",
        kind: "local",
        currentBranch: "codex/l4-permission-mapping-authz-model",
        aheadBase: 0,
        aheadCurrent: 0,
        unaccountedPatchCount: 0,
        reconciliationRecord: null,
      }),
    ).toBe("base-only");
  });

  it("classifies explicitly reconciled sibling branches as recorded instead of hidden", () => {
    expect(
      classifyBranchStackEntry({
        name: "codex/l4-evidence-qa-task-type",
        kind: "local",
        currentBranch: "codex/l4-permission-mapping-authz-model",
        aheadBase: 2,
        aheadCurrent: 2,
        unaccountedPatchCount: 2,
        reconciliationRecord: {
          filePath: "docs/workspace/branch-stack-reconciliations/l4-evidence-qa-task-type.md",
          branch: "codex/l4-evidence-qa-task-type",
          headCommit: "463ce307daad",
          disposition: "superseded-by-current",
          accountedBy: "cd3efc3",
        },
      }),
    ).toBe("recorded-superseded");
  });

  it("parses branch stack reconciliation records only when disposition is explicit", () => {
    expect(
      parseBranchStackReconciliationRecordMarkdown(
        `
# Branch Stack Reconciliation

- Branch: codex/l4-evidence-qa-task-type
- Head Commit: 463ce307daad17ba6ed537e280780c072631b4f8
- Disposition: superseded-by-current
- Accounted By: cd3efc383555
`,
        "docs/workspace/branch-stack-reconciliations/l4-evidence-qa-task-type.md",
      ),
    ).toEqual({
      filePath: "docs/workspace/branch-stack-reconciliations/l4-evidence-qa-task-type.md",
      branch: "codex/l4-evidence-qa-task-type",
      headCommit: "463ce307daad17ba6ed537e280780c072631b4f8",
      disposition: "superseded-by-current",
      accountedBy: "cd3efc383555",
    });

    expect(
      parseBranchStackReconciliationRecordMarkdown(
        `
- Branch: codex/example
- Head Commit: abc123
- Accounted By: later
`,
        "docs/workspace/branch-stack-reconciliations/example.md",
      ),
    ).toBeNull();
  });
});
