import { readFileSync } from "node:fs";

export type TestCaseLifecycleStatus =
  | "active"
  | "superseded"
  | "archived"
  | "pending-review";

export type TraceabilityEnforcement = "enforced" | "deferred";

export interface ParsedTestCaseLifecycle {
  testCaseId: string;
  version: string;
  status: TestCaseLifecycleStatus;
  supersedes: string | null;
  supersededBy: string | null;
  reason: string | null;
  approvalNote: string | null;
}

export interface ParsedTestCaseLifecycleDocument {
  path: string;
  traceabilityEnforcement: TraceabilityEnforcement;
  cases: ParsedTestCaseLifecycle[];
}

const TEST_CASE_ID_PATTERN = /^ {2}Test Case ID: `(TC-[A-Z0-9-]+)`$/m;

function readField(block: string, label: string): string | null {
  const expression = new RegExp(`^ {2}${label}:\\s*(.+)$`, "m");
  const match = block.match(expression);
  if (!match) {
    return null;
  }

  return match[1].trim();
}

function normalizeLifecycleStatus(value: string | null): TestCaseLifecycleStatus {
  switch (value) {
    case "active":
    case "superseded":
    case "archived":
    case "pending-review":
      return value;
    case null:
      return "active";
    default:
      throw new Error(`Invalid test-case lifecycle status: ${value}`);
  }
}

function normalizeNullableField(value: string | null): string | null {
  if (!value || value === "none" || value === "n/a") {
    return null;
  }

  return value;
}

export function parseTraceabilityEnforcement(contents: string): TraceabilityEnforcement {
  const match = contents.match(/^\s*-\s*Traceability Enforcement:\s*(enforced|deferred)$/m);
  return match?.[1] === "deferred" ? "deferred" : "enforced";
}

export function parseLifecycleDocument(path: string): ParsedTestCaseLifecycleDocument {
  const contents = readFileSync(path, "utf8");
  const traceabilityEnforcement = parseTraceabilityEnforcement(contents);
  const blocks = contents
    .split(/\n(?=- )/)
    .filter((block) => TEST_CASE_ID_PATTERN.test(block));

  const cases = blocks.map((block) => {
    const idMatch = block.match(TEST_CASE_ID_PATTERN);
    if (!idMatch) {
      throw new Error(`Unable to parse test-case ID in ${path}`);
    }

    return {
      testCaseId: idMatch[1],
      version: normalizeNullableField(readField(block, "Version")) ?? "v1",
      status: normalizeLifecycleStatus(normalizeNullableField(readField(block, "Lifecycle Status"))),
      supersedes: normalizeNullableField(readField(block, "Supersedes")),
      supersededBy: normalizeNullableField(readField(block, "Superseded By")),
      reason: normalizeNullableField(readField(block, "Reason")),
      approvalNote: normalizeNullableField(readField(block, "Approval Note")),
    };
  });

  return {
    path,
    traceabilityEnforcement,
    cases,
  };
}
