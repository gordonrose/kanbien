import { describe, expect, it } from "vitest";

import { classifyBranchStackEntry } from "../../../src/scripts/gitBranchStackAudit";

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
      }),
    ).toBe("base-only");
  });
});
