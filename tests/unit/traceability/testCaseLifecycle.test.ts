import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { parseLifecycleDocument } from "../../../src/lib/testingData/testCaseLifecycle";

const tempDirs: string[] = [];
const ROOT_AUTH_UNIT_000 = ["TC", "ROOT", "AUTH", "UNIT", "000"].join("-");

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

function writeTempDoc(contents: string): string {
  const dir = mkdtempSync(join(tmpdir(), "traceability-lifecycle-"));
  tempDirs.push(dir);
  const path = join(dir, "test-cases.md");
  writeFileSync(path, contents, "utf8");
  return path;
}

describe("test-case lifecycle parsing", () => {
  it("parses the detailed PRD test-case block format", () => {
    const path = writeTempDoc(`# Cases

- Capability: sample
  Test Case ID: \`TC-ROOT-AUTH-UNIT-001\`
  Version: v2
  Lifecycle Status: superseded
  Supersedes: \`${ROOT_AUTH_UNIT_000}\`
  Superseded By: none
  Reason: merged
  Approval Note: approved
`);

    expect(parseLifecycleDocument(path)).toMatchObject({
      traceabilityEnforcement: "enforced",
      cases: [
        {
          testCaseId: "TC-ROOT-AUTH-UNIT-001",
          version: "v2",
          status: "superseded",
          supersedes: `\`${ROOT_AUTH_UNIT_000}\``,
          supersededBy: null,
          reason: "merged",
          approvalNote: "approved",
        },
      ],
    });
  });

  it("parses shorthand PRD test-case bullets as active cases", () => {
    const path = writeTempDoc(`# Cases

- \`TC-ROOT-ADMIN-SHELL-UNIT-001\`
  - Scenario: helper client builds the request correctly

- \`TC-ROOT-ADMIN-SHELL-INT-001\`
  - Scenario: browser auth works
`);

    expect(parseLifecycleDocument(path)).toMatchObject({
      traceabilityEnforcement: "enforced",
      cases: [
        {
          testCaseId: "TC-ROOT-ADMIN-SHELL-UNIT-001",
          version: "v1",
          status: "active",
        },
        {
          testCaseId: "TC-ROOT-ADMIN-SHELL-INT-001",
          version: "v1",
          status: "active",
        },
      ],
    });
  });
});
