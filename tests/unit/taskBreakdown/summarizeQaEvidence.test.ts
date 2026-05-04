import { describe, expect, it } from "vitest";

import { summarizeQaEvidenceContent } from "../../../src/scripts/summarizeQaEvidence";

const packetWithCompleteEvidence = `# Task Breakdown Packet

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | S-001 | EVIDENCE:qa-evidence | Capture runtime QA evidence and mock-honesty status. | docs/workspace/qa/runtime-evidence.md | production code and tests | none | not-applicable: evidence only | queued-for-delivery |
| T-S001-02 | S-001 | DEV:backend | Implement approved backend behavior. | src/features/example/domain/update.ts | evidence sweep | none | not-applicable: feature-local | queued-for-delivery |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S001-01 | runtime-level, mock-honesty | npm run test:coverage-strength; npx playwright test tests/visual/example.spec.ts | runtime payload evidence must match production API/projection shape; mocks may not invent fallback behavior |

## QA Evidence Instrument Summary

| Task ID | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Evidence Status / Remaining Gap |
| --- | --- | --- | --- | --- |
| T-S001-01 | focused test command; coverage-strength summary; browser screenshot | live API payload and served browser route checked | fixture compared with live payload shape | partial: broader browser sweep deferred |

## Debt Health Summary Commands

| Task ID | Summary Command | Summary Result | Debt Found | Debt Disposition | Follow-Up Task ID / Owner |
| --- | --- | --- | --- | --- | --- |
| T-S001-01 | npm run test:coverage-strength | debt-found | broader suite strength debt unchanged | accepted-deferred | QA roadmap |

## Task Guardrail Evidence

| Task ID | Check ID | Status | Evidence / Rationale |
| --- | --- | --- | --- |
| T-S001-01 | qa-proof-target | pass | Runtime evidence target named. |
| T-S001-01 | qa-command-plan | pass | Commands named. |
| T-S001-01 | qa-runtime-evidence | pass | Runtime evidence named. |
| T-S001-01 | qa-mock-honesty | pass | Mock honesty named. |
| T-S001-01 | qa-evidence-status | pass | Status named. |
| T-S001-01 | qa-coverage-strength-summary | pass | Coverage summary named. |
`;

describe("QA evidence summary", () => {
  it("summarizes complete EVIDENCE:qa-evidence task evidence categories", () => {
    const summary = summarizeQaEvidenceContent(packetWithCompleteEvidence);

    expect(summary.taskCount).toBe(1);
    expect(summary.completeTaskCount).toBe(1);
    expect(summary.tasks[0]).toMatchObject({
      taskId: "T-S001-01",
      proofTarget: true,
      commandPlan: true,
      runtimeEvidence: true,
      mockHonesty: true,
      evidenceStatus: true,
      coverageStrengthSummary: true,
      missing: [],
    });
  });

  it("reports missing evidence categories without failing unrelated task types", () => {
    const summary = summarizeQaEvidenceContent(
      packetWithCompleteEvidence
        .replace("runtime-level, mock-honesty", "evidence-level")
        .replace("runtime payload evidence must match production API/projection shape; mocks may not invent fallback behavior", "")
        .replace("## QA Evidence Instrument Summary", "## Removed QA Evidence Instrument Summary")
        .replace("| T-S001-01 | npm run test:coverage-strength | debt-found | broader suite strength debt unchanged | accepted-deferred | QA roadmap |\n", "")
        .replace("| T-S001-01 | qa-runtime-evidence | pass | Runtime evidence named. |\n", "")
        .replace("| T-S001-01 | qa-mock-honesty | pass | Mock honesty named. |\n", "")
        .replace("| T-S001-01 | qa-evidence-status | pass | Status named. |\n", "")
        .replace("| T-S001-01 | qa-coverage-strength-summary | pass | Coverage summary named. |\n", ""),
    );

    expect(summary.taskCount).toBe(1);
    expect(summary.completeTaskCount).toBe(0);
    expect(summary.tasks[0]?.missing).toEqual([
      "runtime/live evidence",
      "mock honesty",
      "evidence status",
      "coverage-strength summary",
    ]);
  });
});
