import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { analyzeArtifactObligations } from "../../../src/scripts/layer5/artifactObligations";
import { classifyCloseoutResult } from "../../../src/scripts/layer5/closeoutResult";
import { runProofCommands, runValidationCommand } from "../../../src/scripts/layer5/commandRunner";
import type {
  ArtifactObligationResult,
  CommandResult,
  ContractTableRow,
  Layer5TaskContext,
  PluginCheckResult,
  ProofRow,
  WriteSetResult,
} from "../../../src/scripts/layer5/contract";
import { loadLayer5TaskContext } from "../../../src/scripts/layer5/parseTaskBreakdown";
import { runPluginChecks } from "../../../src/scripts/layer5/plugins";
import { renderRunRecord } from "../../../src/scripts/layer5/runRecord";
import { analyzeWriteSet } from "../../../src/scripts/layer5/writeSet";

const platformGuardrailRows = [
  "platform-source-authority",
  "platform-seam-kind",
  "platform-seam-owner",
  "platform-exact-write-envelope",
  "platform-consumer-inventory",
  "platform-compatibility-mode",
  "platform-representative-consumer-proof",
  "platform-proof-commands",
  "platform-split-routing",
].map((checkId) => `| T-S001-01 | ${checkId} | pass | ${checkId} evidence. |`).join("\n");

const platformSeamContractSection = `
## Platform Seam Contract

| Task ID | Seam Kind | Compatibility Mode | Approved Authority Source | Seam Owner / Location | Seam Source Inventory | Seam Change Scope | Exact Write Envelope | Why Not Feature-Local | Current / Future / Unsupported Consumers | Compatibility Contract | Representative Consumer Proof | Runtime / Restart Impact | Rollout / Backout Posture | Artifact / Materialization Impact | Generated / Apply / Check Command | Expected Seam Output | Architecture / Standards Boundary | Split / Blocked Follow-Up | Proof Commands | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | cross-feature-seam-infrastructure | additive-compatible | Technical Steering TS-001 approves the seam. | platform helper under src/lib/example | docs/workspace/example.md; src/lib/example/**/*.ts; tests/unit/example/**/*.ts | Add a narrow adapter seam. | narrow exact patterns: src/lib/example/**; tests/unit/example/** | Not feature-local because multiple consumers need the same helper. | current: harness; future: app; unsupported: generic document generation | Additive compatible; existing semantics remain authoritative. | Focused adapter consumer test validates seam output. | not-required: helper only | additive rollout with revert/backout by removing consumer path | not-applicable: no generated artifact materialization | not-applicable: no generator/apply command | Adapter output data. | no authority changes; API, permission, persistence, and evidence work are split. | DOC:api-contract for API; DEV:migration-persistence for persistence; EVIDENCE:qa-evidence for evidence. | npx vitest run tests/unit/layer5 | Human review judges compatibility sufficiency. |

## Platform Seam Class Contract

| Task ID | Platform Seam Class | Class-Specific Required Proof | Required Consumer Coverage | Runtime / Materialization Expectation | Forbidden Contamination / Split Notes |
| --- | --- | --- | --- | --- | --- |
| T-S001-01 | cross-feature-seam-infrastructure | Prove seam mechanics and adapter output. | Current harness and future app consumers are named. | not-required: helper seam has no runtime materialization. | API routes to DOC:api-contract; persistence routes to DEV:migration-persistence; evidence routes to EVIDENCE:qa-evidence. |
`;

const readyTaskPacket = `# Task Breakdown

## Status

- Validation command:
  npm run task-breakdown:validate -- docs/workspace/example

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-S001-01 | S-001 | DEV:platform-seam | Create a narrow adapter seam. | src/lib/example/**; tests/unit/example/** | UI, API routes, persistence | none | example platform seam | queued-for-delivery |

## Decision Escalation / Stop Conditions

| Task ID | Trigger Type | Stop Condition / Do Not Guess Decision | Required Escalation | May Proceed If Hit | Rationale |
| --- | --- | --- | --- | --- | --- |
| T-S001-01 | source-truth-mismatch | Stop on source mismatch. | Return to owner. | no | Do not invent source truth. |

## Task Guardrail Evidence

| Task ID | Check ID | Status | Evidence / Rationale |
| --- | --- | --- | --- |
${platformGuardrailRows}

## Forbidden Work

| Task ID | Forbidden Work | Reason |
| --- | --- | --- |
| T-S001-01 | API routes and persistence | Keep the seam narrow. |

${platformSeamContractSection}

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-S001-01 | not-applicable: first task | Approved upstream artifacts exist. | no |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-S001-01 | contract-level | npx vitest run tests/unit/layer5 | Fixtures must match source truth. |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-S001-01 | queued-for-delivery | none | Ready for delivery. |
`;

const blockedTaskPacket = readyTaskPacket
  .split("T-S001-01").join("T-S002-01")
  .replace("| T-S002-01 | S-001 | DEV:platform-seam | Create a narrow adapter seam. | src/lib/example/**; tests/unit/example/** | UI, API routes, persistence | none | example platform seam | queued-for-delivery |", "| T-S002-01 | S-002 | DEV:frontend | Adopt the UI. | src/frontend/example/** | backend work | T-S001-01 | example UI seam | blocked |")
  .replace("| T-S002-01 | queued-for-delivery | none | Ready for delivery. |", "| T-S002-01 | blocked | T-S001-01 | Dependency is not complete. |")
  .replace("| --- | --- | --- | --- | --- | --- |\n\n## Proof", "| --- | --- | --- | --- | --- | --- |\n| BLK-001 | T-S002-01 | dependency | T-S001-01 | Dependency is not complete. | Complete T-S001-01. |\n\n## Proof")
  .replace("npx vitest run tests/unit/layer5", "blocked: proof after dependency");

function withPacket(content: string, fn: (packetPath: string, tempDir: string) => void): void {
  const tempDir = mkdtempSync(path.join(tmpdir(), "layer5-harness-"));
  try {
    const packetPath = path.join(tempDir, "task-breakdown.md");
    writeFileSync(packetPath, content);
    fn(packetPath, tempDir);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

function genericTaskPacket(taskType: string, contractSections = ""): string {
  return `# Task Breakdown

## Status

- Validation command:
  npm run task-breakdown:validate -- docs/workspace/example

## Task Queue

| Task ID | Parent Story ID | Task Type | Title / Execution Scope | Allowed Write Set | Non-Goals | Dependencies | Shared Seams | Delivery Handoff Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | S-GEN | ${taskType} | Execute the selected task contract. | src/features/example/**; tests/unit/example/**; docs/workspace/example/**; test-results/example/** | unrelated work | none | not-applicable | queued-for-delivery |

${contractSections}

## Task Dependencies

| Task ID | Depends On Task ID(s) | Dependency Reason | Must Complete Before Queueing |
| --- | --- | --- | --- |
| T-GEN-01 | not-applicable: first task | Approved upstream artifacts exist. | no |

## Blockers And Isolation Controls

| Blocker ID | Blocks Task ID | Blocker Type | Required Separate Task ID | Reason | Resolution / Owner |
| --- | --- | --- | --- | --- | --- |

## Proof And Command Plan

| Task ID | Required Proof Layers | Required Test Or Proof Commands | Mock Honesty / Runtime Evidence Notes |
| --- | --- | --- | --- |
| T-GEN-01 | contract-level | npx vitest run tests/unit/layer5 | Fixtures must match source truth. |

## Layer 5 Delivery Handoff

| Task ID | Handoff Status | Blockers Remaining | Delivery Notes |
| --- | --- | --- | --- |
| T-GEN-01 | queued-for-delivery | none | Ready for delivery. |
`;
}

function artifactContext(
  routing = "",
  commands = "",
): { routeAwayRows: string[][]; contractRows: ContractTableRow[]; proofRows: ProofRow[] } {
  return {
    routeAwayRows: routing ? [["T-GEN-01", "test", routing]] : [],
    contractRows: [],
    proofRows: commands ? [{
      taskId: "T-GEN-01",
      proofLayers: "contract-level",
      commands,
      mockHonesty: "not-applicable",
    }] : [],
  };
}

function commandResult(overrides: Partial<CommandResult> = {}): CommandResult {
  return {
    command: "npm run typecheck",
    status: "pass",
    reason: "ok",
    output: "",
    ...overrides,
  };
}

function pluginResult(overrides: Partial<PluginCheckResult> = {}): PluginCheckResult {
  return {
    plugin: "DEV:backend",
    status: "pass",
    notes: ["ok"],
    ...overrides,
  };
}

function writeSetResult(overrides: Partial<WriteSetResult> = {}): WriteSetResult {
  return {
    status: "pass",
    mode: "enforced",
    reason: "changed files are inside the allowed write set",
    allowedEntries: ["src/features/example/**"],
    changedFiles: ["src/features/example/domain/service.ts"],
    allowedFiles: ["src/features/example/domain/service.ts"],
    forbiddenFiles: [],
    ambiguousEntries: [],
    ...overrides,
  };
}

function artifactResult(overrides: Partial<ArtifactObligationResult> = {}): ArtifactObligationResult {
  return {
    status: "pass",
    reason: "artifact obligations are satisfied or explicitly routed",
    changedFiles: [],
    obligations: [],
    ...overrides,
  };
}

const genericPluginContracts: Array<[taskType: string, sections: string]> = [
  ["DEV:migration-persistence", `## Migration / Persistence Approach

| Task ID | Change Type | Live Schema Check | Source Data Shape Validation | Per-Row Eligibility Validation | Rejected Row Behavior | Migration Identity / Applied File Posture | SQL Execution Semantics Check | Representative Read / Write Proof | Postgres Harness Impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | additive-column | docs/workspace/example/schema.md; src/features/example/persistence/** | src/features/example/persistence/model.ts | not-applicable | not-applicable | new zero-padded migration only | migration command reviewed | npx vitest run tests/unit/layer5 proof evidence | not-applicable |

## Migration / Persistence Class Contract

| Task ID | Migration / Persistence Class | Class-Specific Required Proof | Required Data / Schema Coverage | Required Read / Write Or Harness Coverage | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- |
| T-GEN-01 | additive-schema | migration proof evidence | schema coverage evidence | read/write proof evidence | DOC:data-dictionary follow-up if dictionary changes. |`],
  ["DEV:vertical-slice", `## Vertical Slice Coupling

| Task ID | Journey Behavior | Backend Seam | Frontend Seam | API / Data Contract | Browser Proof Story | Why Backend And Frontend Proof Are Inseparable | Split Rejection Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | user completes example journey | DEV:backend example service seam | DEV:frontend example render seam | docs/api-contracts/example.md payload contract | npx playwright test browser proof evidence | backend and frontend proof are inseparable because payload/render timing must be proven together | Split rejected because independent backend/frontend proofs miss the runtime contract risk. |

## Vertical Slice Split Pressure

| Task ID | Concern | Split Decision | Coupling / Not-Applicable Rationale | Owning Task If Split |
| --- | --- | --- | --- | --- |
| T-GEN-01 | backend-behavior | inseparable-in-slice | backend-to-frontend coupling requires same proof | not-applicable |

## Frontend Runtime Data And Mock Honesty

| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |
| --- | --- | --- | --- | --- | --- |
| T-GEN-01 | docs/api-contracts/example.md | tests/fixtures/example.ts | live runtime evidence | not-applicable | mock honesty evidence |`],
  ["DOC:api-contract", `## API Contract

| Task ID | API Contract Class | Route Family | Contract Source / Authority | Methods / Paths | Params / Query / Body | Response / Status / Error Shape | Authn / Authz / Tenant Boundary | Validation / Pagination / Sorting / System Fields | Compatibility Posture | Maintained API Artifacts | Maintained Artifact Inventory | Split / Blocked Follow-Up | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | route-contract | example routes | docs/prd/example.md | GET /v1/example | query body contract | 200 and error shape | root authz boundary | pagination and system fields | additive-compatible | docs/api-contracts/example.md | docs/api-contracts/example.md | DEV:backend handles implementation. | Human review checks contract intent. | npm run product-request:validate evidence |`],
  ["DOC:docs-artifact", `## Docs Artifact Contract

| Task ID | Artifact Family | Docs Artifact Class | Scriptable Source Inventory | Source Truth Reviewed | Docs Target | Status Posture | Stale Artifact Sweep | Specialized Routing / Split Decisions | Diff / Check Command | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | ordinary-doc-sync | workspace-summary-artifact | docs/prd/example.md; src/features/example/** | source truth reviewed | docs/workspace/example.md | update-or-confirm-current | stale artifact sweep reviewed | not-applicable: no specialized routing | git diff -- docs/workspace/example.md | Human review checks docs truth. | npm run product-request:validate evidence |`],
  ["DOC:permission-mapping", `## Permission Mapping Contract

| Task ID | Permission Mapping Class | Approved Authz Source | Capability / Route / Surface | Authority World / Actor Boundary | Grant Source Posture | Mapping Row Posture | Tenant / Object Boundary | Allow / Deny Expectations | UI Eligibility | Denial / Audit / Proof Expectation | Evidence Mapping Inventory | Migration Impact | Split / Blocked Follow-Up | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | capability-map | docs/prd/example.md | example.read | root actor boundary | not-applicable | add mapping row | tenant boundary denied | allow and deny evidence | not-applicable | denial proof evidence | docs/workspace/example-permissions.md | not-applicable | DEV:backend owns enforcement. | Human review checks business policy. |`],
  ["DOC:data-dictionary", `## Data Dictionary Contract

| Task ID | Entity / Table / Fact Group | Dictionary Artifact Target | Source Truth Reviewed | Field / Index / Lifecycle Truth | Durable Fact / Retention Truth | Classification / Compliance Posture | Standards / Control Trace | Enforcement Trace | Enforcement Evidence | Test / Evidence Trace | Compatibility Posture | Split / Blocked Follow-Up | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | example_records | docs/data-dictionary/example.md | src/features/example/persistence/model.ts | fields and indexes | durable facts documented | internal | standard trace | src/features/example/domain/service.ts | enforcement evidence | npx vitest run tests/unit/layer5 | additive-compatible | DEV:migration-persistence owns schema. | npm run data:compliance-health evidence |`],
  ["DEV:backend", `## Backend Implementation Approach

| Task ID | Backend Change Class | Approved Source Authority | Feature Owner | Capability File Strategy | Backend Source Inventory | Exact Write Envelope | Expected Files / Layers | Layer Responsibilities | Contract / API Posture | Authz / Tenant / Lifecycle Posture | Persistence / Migration Posture | Public Seam / Manifest Impact | Artifact Obligations | Scaffold / Script Command | Expected Backend Output | Split / Blocked Follow-Up | Proof Commands | Formatting / Generated Artifact Expectations | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | feature-capability | docs/prd/example.md | example | capability-per-file | src/features/example/**; tests/unit/example/** | narrow exact patterns: src/features/example/**; tests/unit/example/** | domain and tests | domain owns behavior | additive API posture | root authz and lifecycle posture | no migration | manifest unchanged | docs update routed | not-applicable | backend output | DOC:api-contract owns contract. | npx vitest run tests/unit/layer5 | no generated artifacts | Human review checks source authority. |`],
  ["TEST:test-only", `## Test-Only Coverage Contract

| Task ID | Test Change Class | Coverage Source | Traceability IDs | Test Layer | Proof Target | Fixture / Data Source | Mock / Runtime Honesty | Production Behavior Change Posture | Focused Command | Split / Blocked Follow-Up |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | prd-test-case | docs/prd/test_cases/example.md | AC-EXAMPLE-001 | tests/unit/example | proof target evidence | tests/fixtures/example.ts | mock honesty evidence | no production behavior change | npx vitest run tests/unit/layer5 | DEV:backend owns implementation changes. |

## Capability Permission / State Matrix

| Task ID | Capability / Route / Object | Actor States Covered | Permission States Covered | Object Lifecycle States Covered | Boundary States Covered | Required Negative Cases | Matrix Not Applicable Rationale | Missing Coverage / Follow-Up Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | example.read | allowed and denied actors | allowed and denied permissions | active and deleted | tenant boundary denied | denied proof evidence | not-applicable | not-applicable |`],
  ["TEST:test-suite-alignment", `## Test Suite Alignment Contract

| Task ID | Alignment Source / Trigger | Mismatch Class | Documentation Targets | Executable Targets | Allowed Edit Posture | Split Decision For New Proof | Traceability Command | Completion Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | docs/prd/example-test-cases.md | traceability-drift | docs/prd/test_cases/example.md | tests/unit/example/** | docs-only | new proof routes to TEST:test-only | npm run test:traceability | before/after evidence recorded |`],
  ["DECISION:refactor-first", `## Refactor-First Contract

| Task ID | Refactor Trigger | Refactor Type | Refactor Target Inventory | Detection Hints | Unchanged Behavior | Affected Consumers | Downstream Task Unblocked | Compatibility Proof | Routing Check | Human Review Boundary | Forbidden Behavior / Authority Change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | extraction-needed | seam-extraction | src/features/example/** | rg example src/features/example evidence | unchanged behavior preserved | current consumers named | not-applicable | compatibility proof evidence | not-applicable | Human review checks split. | forbidden behavior change documented |`],
  ["DECISION:architecture-foundation", `## Architecture Foundation Contract

| Task ID | Concern Area | Architecture Trigger | Architecture Question | Decision Analysis Status | Decision Provenance Source | Missing Analysis Fields | Sources To Review | Decision Source Inventory | Decision Analysis Checklist | Decision Owner | Output Artifact Target | Downstream Tasks Blocked | Compatibility Posture | Final Authority Route | Human Review Boundary | Forbidden Implementation / Guess |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | platform-boundary | missing-decision | Which architecture path is approved? | approved-source-exists | docs/architecture/adr/example.md | not-applicable | docs/architecture/adr/example.md | docs/architecture/adr/example.md; src/features/example/** | options risks compatibility recommendation evidence | architecture owner | docs/architecture/adr/example.md | not-applicable | compatibility posture | GOV:architecture-update | Human review approves decision. | forbidden implementation guess |`],
  ["DOC:standards-compliance", `## Standards Compliance Contract

| Task ID | Compliance Target Type | Standard / Gate | Source Standard Path / Reference | Scope Under Review | Control / Evidence Inventory | Review Method / Command | Compliance Posture | Evidence Artifact Target | Coverage Summary Command | Findings Summary | Follow-Up Routing | Human Review Boundary | Waiver / Blocker Posture |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | repo-standard-audit | Layer 5 standard | docs/standards/example.md | src/scripts/layer5/** | src/scripts/layer5/**; docs/standards/example.md | npm run typecheck | pass | docs/workspace/standards-evidence/example.md | npm run typecheck | findings evidence | not-applicable | Human review checks compliance. | not-applicable |`],
  ["GOV:standards-update", `## Standards Update Contract

| Task ID | Standards Update Class | Approved Standards Change Source | Source Path / Reference | Standards Change Summary | Standards Artifact Target | Affected Surfaces / Consistency Sweep | Artifact Invalidation Sweep | Enforcement Posture | Compatibility / Rollout Posture | Debt Route If Not Enforced Now | Forbidden Implementation / Architecture / Compliance Work | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | enforced-now | approved standards change | docs/standards/example.md | standards change summary | docs/standards/example.md | affected surfaces sweep reviewed | artifact invalidation sweep reviewed | validator-or-gate-enforced-now | compatible rollout | not-applicable | forbid implementation architecture compliance work | npm run typecheck evidence |`],
  ["GOV:architecture-update", `## Architecture Update Contract

| Task ID | Architecture Update Class | Approved Decision Source | Decision Source Path / Reference | Decision Summary | Architecture Artifact Target | Consistency Sweep Targets | Authority / Consistency Inventory | Downstream Impact | Compatibility Posture | Forbidden Implementation / Standards Work | Human Review Boundary | Validation / Review Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | adr-create | approved architecture decision | docs/architecture/adr/example.md | decision summary | docs/architecture/adr/example.md | docs/architecture/** | docs/architecture/adr/example.md; src/features/example/** | not-applicable | compatibility posture | forbid implementation and standards work | Human review checks architecture update. | npm run typecheck evidence |`],
  ["EVIDENCE:qa-evidence", `## QA Evidence Instrument Summary

| Task ID | QA Evidence Class | Evidence Source Inventory | Selected Evidence Instruments | Live Runtime / Payload Evidence | Mock Honesty Comparison | Expected Evidence Output | Evidence Status / Remaining Gap | Human Review Boundary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | live-payload-sample | docs/workspace/example-evidence.md; exact runtime target | payload capture proof evidence | live payload evidence | mock comparison evidence | docs/workspace/qa-evidence/example.md | complete evidence | Human review checks evidence sufficiency. |`],
  ["DEV:frontend", `## Frontend Change Class Contract

| Task ID | Frontend Change Class | Primary Contract Rows Required | Runtime / Browser Evidence Required | Route-Away / Split Notes |
| --- | --- | --- | --- | --- |
| T-GEN-01 | governed-adoption | Frontend Adoption Contract | browser evidence proof | EVIDENCE:qa-evidence captures final proof. |

## Frontend / Design-System Sub-Standard

| Task ID | Primary Sub-Standard | Additional Sub-Standards | Split Rationale | Required Compliance Proof |
| --- | --- | --- | --- | --- |
| T-GEN-01 | governed-adoption | accessibility | evidence split | npx playwright test proof evidence |

## Frontend Runtime Data And Mock Honesty

| Task ID | Governing API / Projection Contract | Fixture Source | Live / Runtime Payload Evidence | Runtime Evidence Unavailable Reason | Mock-Honesty Statement |
| --- | --- | --- | --- | --- | --- |
| T-GEN-01 | docs/api-contracts/example.md | tests/fixtures/example.ts | live runtime evidence | not-applicable | mock honesty evidence |`],
  ["GOV:design-system", `## Design-System Seam Contract

| Task ID | Seam Posture | Seam Name / Export / Route | Owned Render Structure | Owned Behavior Controller | Owned Accessibility Semantics | Canonical / Behavior Lock / Evidence | Frontend Consumption Contract |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T-GEN-01 | new-seam | example seam route | owned render | owned controller | owned a11y | docs/workspace/design-system/example.md proof evidence | frontend consumption contract |

## Design-System Seam Class Contract

| Task ID | Design-System Seam Class | Class-Specific Required Proof | Downstream Consumption Boundary | Forbidden App / Evidence / Standards Work |
| --- | --- | --- | --- | --- |
| T-GEN-01 | component-seam | npx playwright test proof evidence | app consumes seam | EVIDENCE:qa-evidence owns evidence sweep. |`],
];

const semanticBlockedContracts: Array<[taskType: string, sections: string, expectedNote: string]> = genericPluginContracts.map(
  ([taskType, sections]) => {
    switch (taskType) {
      case "DEV:migration-persistence":
        return [taskType, sections.replace("new zero-padded migration only", "later maybe"), "Migration identity must"];
      case "DEV:vertical-slice":
        return [taskType, sections.replace("DEV:backend example service seam", "example service seam"), "Vertical slice must name both backend and frontend seams"];
      case "DOC:api-contract":
        return [taskType, sections.replace("GET /v1/example", "example endpoint"), "API contract must name concrete HTTP methods and paths"];
      case "DOC:docs-artifact":
        return [taskType, sections.replace("docs/workspace/example.md", "workspace/example.md"), "Docs artifact target must be under docs/"];
      case "DOC:permission-mapping":
        return [taskType, sections.replace("allow and deny evidence", "allow evidence"), "Permission mapping must name both allow and deny"];
      case "DOC:data-dictionary":
        return [taskType, sections.replace("docs/data-dictionary/example.md", "docs/workspace/example.md"), "Data dictionary target must be under docs/data-dictionary/"];
      case "DEV:backend":
        return [taskType, sections.replace("root authz and lifecycle posture", "business posture"), "Backend task must name authz"];
      case "TEST:test-only":
        return [taskType, sections.replace("AC-EXAMPLE-001", "EXAMPLE-001"), "Test-only task must name TC-* or AC-* traceability"];
      case "TEST:test-suite-alignment":
        return [taskType, sections.replace("npm run test:traceability", "npm run typecheck"), "Test suite alignment must name traceability command"];
      case "DECISION:refactor-first":
        return [taskType, sections.replace("rg example src/features/example evidence", "look around manually"), "Refactor-first detection hints must name command evidence"];
      case "DECISION:architecture-foundation":
        return [taskType, sections.replace("options risks compatibility recommendation evidence", "decision notes"), "Architecture foundation must include decision-analysis checklist terms"];
      case "DOC:standards-compliance":
        return [taskType, sections.replace("docs/standards/example.md", "docs/features/example.md"), "Standards compliance must name a repo standard"];
      case "GOV:standards-update":
        return [
          taskType,
          sections.replace("| docs/standards/example.md | affected surfaces", "| docs/workspace/example.md | affected surfaces"),
          "Standards update target must be standards-owned",
        ];
      case "GOV:architecture-update":
        return [
          taskType,
          sections.replace("| docs/architecture/adr/example.md | docs/architecture/**", "| docs/workspace/example.md | docs/architecture/**"),
          "Architecture update target must be architecture-owned",
        ];
      case "EVIDENCE:qa-evidence":
        return [taskType, sections.replace("live payload evidence", "not-applicable"), "QA evidence must not be queued without live/runtime payload evidence"];
      case "DEV:frontend":
        return [taskType, sections.replace("mock honesty evidence", "business note"), "Frontend task must include mock-honesty"];
      case "GOV:design-system":
        return [taskType, sections.replace("owned render", "render"), "Design-system task must name owned render"];
      default:
        return [taskType, sections, "blocked"];
    }
  },
);

describe("Layer 5 harness modules", () => {
  it("parses ready task context and route-away notes from a task packet", () => {
    withPacket(readyTaskPacket, (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-S001-01");

      expect(context.status).toBe("ready");
      expect(context.task.taskType).toBe("DEV:platform-seam");
      expect(context.dependencies).toHaveLength(1);
      expect(context.blockers).toHaveLength(0);
      expect(context.proofRows[0].commands).toBe("npx vitest run tests/unit/layer5");
      expect(context.platformSeamContracts[0].seamOwnerLocation).toContain("src/lib/example");
      expect(context.platformSeamClassContracts[0].platformSeamClass).toBe("cross-feature-seam-infrastructure");
      expect(context.routeAwayRows.map((row) => row[1])).toEqual(["stop-condition", "forbidden-work"]);
    });
  });

  it("classifies blocked tasks without allowing proof execution", () => {
    withPacket(blockedTaskPacket, (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-S002-01");
      const proofResults = runProofCommands(context.proofRows, true, context.status);

      expect(context.status).toBe("blocked");
      expect(context.blockers[0].blockerId).toBe("BLK-001");
      expect(proofResults).toEqual([
        {
          command: "npx vitest run tests/unit/layer5",
          status: "blocked",
          reason: "task is not queued and unblocked",
          output: "",
        },
      ]);
    });
  });

  it("blocks validation and proof commands outside the allowlist", () => {
    expect(runValidationCommand("node scripts/unsafe.js", undefined, "ready")).toMatchObject({
      status: "blocked",
      reason: "validation command is outside the Layer 5 allowlist",
    });

    expect(
      runProofCommands(
        [
          {
            taskId: "T-S001-01",
            proofLayers: "contract-level",
            commands: "npm run typecheck && npm run test",
            mockHonesty: "not-applicable",
          },
        ],
        true,
        "ready",
      )[0],
    ).toMatchObject({
      status: "blocked",
      reason: "proof command is outside the Layer 5 allowlist",
    });
  });

  it("allows data dictionary compliance health as a deterministic proof command", () => {
    const result = runProofCommands(
      [
        {
          taskId: "T-S009-01",
          proofLayers: "source-level",
          commands: "npm run data:compliance-health",
          mockHonesty: "not-applicable",
        },
      ],
      false,
      "ready",
    );

    expect(result).toEqual([
      {
        command: "npm run data:compliance-health",
        status: "skipped",
        reason: "use --run-proofs to execute focused proof commands",
        output: "",
      },
    ]);
  });

  it("runs the platform-seam plugin only for platform-seam tasks", () => {
    withPacket(readyTaskPacket, (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-S001-01");

      const result = runPluginChecks(context);

      expect(result[0].plugin).toBe("DEV:platform-seam");
      expect(result[0].status).toBe("pass");
      expect(result[0].notes).toContain("contract parsed: cross-feature-seam-infrastructure / additive-compatible");
      expect(result[0].notes).toContain("representative consumer proof is backed by focused proof commands");
    });

    withPacket(blockedTaskPacket, (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-S002-01");

      expect(runPluginChecks(context)).toEqual([
        {
          plugin: "DEV:frontend",
          status: "blocked",
          notes: ["expected exactly one Frontend Change Class Contract row, found 0"],
        },
      ]);
    });
  });

  it("blocks platform-seam tasks with missing owner/location", () => {
    const packet = readyTaskPacket.replace("platform helper under src/lib/example", "");

    withPacket(packet, (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-S001-01");
      const result = runPluginChecks(context)[0];

      expect(result.status).toBe("blocked");
      expect(result.notes.join("; ")).toContain("missing Platform Seam Contract fields: seam owner/location");
    });
  });

  it("blocks platform-seam tasks with unresolved compatibility-sensitive mode", () => {
    const packet = readyTaskPacket
      .replace("additive-compatible", "compatibility-sensitive")
      .replace("Additive compatible; existing semantics remain authoritative.", "Existing callers may break.")
      .replace("DOC:api-contract for API; DEV:migration-persistence for persistence; EVIDENCE:qa-evidence for evidence.", "none");

    withPacket(packet, (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-S001-01");
      const result = runPluginChecks(context)[0];

      expect(result.status).toBe("blocked");
      expect(result.notes.join("; ")).toContain("compatibility-sensitive or blocked mode lacks an approved compatibility strategy");
    });
  });

  it("blocks platform-seam tasks missing representative proof", () => {
    const packet = readyTaskPacket.replace("Focused adapter consumer test validates seam output.", "not-applicable");

    withPacket(packet, (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-S001-01");
      const result = runPluginChecks(context)[0];

      expect(result.status).toBe("blocked");
      expect(result.notes.join("; ")).toContain("representative consumer proof is missing");
    });
  });

  it("blocks platform-seam contamination that is not routed away", () => {
    const packet = readyTaskPacket
      .replace("DOC:api-contract for API; DEV:migration-persistence for persistence; EVIDENCE:qa-evidence for evidence.", "none")
      .replace("API routes to DOC:api-contract; persistence routes to DEV:migration-persistence; evidence routes to EVIDENCE:qa-evidence.", "API and persistence are allowed in this task.");

    withPacket(packet, (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-S001-01");
      const result = runPluginChecks(context)[0];

      expect(result.status).toBe("blocked");
      expect(result.notes.join("; ")).toContain("forbidden contamination is not routed to separate task types");
    });
  });

  it("renders plugin checks and command results into the run record", () => {
    withPacket(readyTaskPacket, (packetPath) => {
      const context: Layer5TaskContext = loadLayer5TaskContext(packetPath, "T-S001-01");
      const record = renderRunRecord({
        context,
        validationResult: {
          command: "npm run task-breakdown:validate -- docs/workspace/example",
          status: "pass",
          reason: "pre-edit task packet validation",
          output: "Task Breakdown Validation - status: PASS",
        },
        proofResults: [
          {
            command: "npx vitest run tests/unit/layer5",
            status: "skipped",
            reason: "use --run-proofs to execute focused proof commands",
            output: "",
          },
        ],
        pluginResults: runPluginChecks(context),
        writeSetResult: analyzeWriteSet(context.task.allowedWriteSet, ["src/lib/example/adapter.ts"], "report"),
      });

      expect(record).toContain("## Plugin Checks");
      expect(record).toContain("| DEV:platform-seam | pass | guardrail evidence includes required platform-seam check ids");
      expect(record).toContain("## Write-Set Check");
      expect(record).toContain("| Status | pass |");
      expect(record).toContain("| npx vitest run tests/unit/layer5 | skipped | use --run-proofs");
    });
  });

  it.each(genericPluginContracts)("passes generic contract plugin for %s", (taskType, contractSections) => {
    withPacket(genericTaskPacket(taskType, contractSections), (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-GEN-01");
      const result = runPluginChecks(context)[0];

      expect(context.contractRows.length).toBeGreaterThan(0);
      expect(result.plugin).toBe(taskType);
      expect(result.status).toBe("pass");
    });
  });

  it.each(genericPluginContracts.map(([taskType]) => [taskType]))("blocks generic contract plugin for %s with no contract row", (taskType) => {
    withPacket(genericTaskPacket(taskType), (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-GEN-01");
      const result = runPluginChecks(context)[0];

      expect(result.plugin).toBe(taskType);
      expect(result.status).toBe("blocked");
      expect(result.notes.join("; ")).toContain("expected exactly one");
    });
  });

  it.each(semanticBlockedContracts)("blocks generic contract plugin for %s with invalid task-specific semantics", (taskType, contractSections, expectedNote) => {
    withPacket(genericTaskPacket(taskType, contractSections), (packetPath) => {
      const context = loadLayer5TaskContext(packetPath, "T-GEN-01");
      const result = runPluginChecks(context)[0];

      expect(result.plugin).toBe(taskType);
      expect(result.status).toBe("blocked");
      expect(result.notes.join("; ")).toContain(expectedNote);
    });
  });

  it("passes write-set enforcement for exact files and narrow patterns", () => {
    expect(
      analyzeWriteSet(
        "src/lib/example/adapter.ts; tests/unit/example/**; src/scripts/productDiscovery*",
        [
          "src/lib/example/adapter.ts",
          "tests/unit/example/adapter.test.ts",
          "src/scripts/productDiscoveryValidate.ts",
        ],
        "enforced",
      ),
    ).toMatchObject({
      status: "pass",
      forbiddenFiles: [],
    });
  });

  it("blocks write-set enforcement for changed files outside the task envelope", () => {
    expect(
      analyzeWriteSet("src/lib/example/**", ["src/lib/example/adapter.ts", "src/frontend/example/page.ts"], "enforced"),
    ).toMatchObject({
      status: "blocked",
      forbiddenFiles: ["src/frontend/example/page.ts"],
    });
  });

  it("blocks write-set enforcement for ambiguous broad write sets", () => {
    expect(analyzeWriteSet("src/**; tests/unit/example/**", ["src/lib/example/adapter.ts"], "enforced")).toMatchObject({
      status: "blocked",
      ambiguousEntries: ["src/**"],
    });
  });

  it("includes untracked-style paths supplied to write-set analysis", () => {
    expect(analyzeWriteSet("tests/unit/example/**", ["tests/unit/example/new.test.ts"], "report")).toMatchObject({
      status: "pass",
      changedFiles: ["tests/unit/example/new.test.ts"],
      allowedFiles: ["tests/unit/example/new.test.ts"],
    });
  });

  it("blocks artifact obligations when changed file families lack maintained artifacts or routing", () => {
    expect(
      analyzeArtifactObligations(artifactContext(), ["src/features/example/feature.manifest.json"]),
    ).toMatchObject({
      status: "blocked",
      obligations: [
        {
          obligation: "feature dependency graph regeneration",
          status: "blocked",
        },
      ],
    });
  });

  it("passes artifact obligations when maintained artifacts changed", () => {
    expect(
      analyzeArtifactObligations(artifactContext("", "npm run check:feature-dependencies"), [
        "src/features/example/feature.manifest.json",
        "docs/architecture/generated/feature-dependency-graph.json",
        "docs/architecture/generated/feature-dependency-graph.md",
      ]),
    ).toMatchObject({
      status: "pass",
      obligations: [
        {
          obligation: "feature dependency graph regeneration",
          status: "pass",
        },
      ],
    });
  });

  it("blocks feature dependency graph obligations without both generated files and command evidence", () => {
    const result = analyzeArtifactObligations(artifactContext(), [
      "src/features/example/feature.manifest.json",
      "docs/architecture/generated/feature-dependency-graph.json",
    ]);

    expect(result).toMatchObject({
      status: "blocked",
      obligations: [
        {
          obligation: "feature dependency graph regeneration",
          status: "blocked",
        },
      ],
    });
    expect(result.obligations[0].reason).toContain("missing artifacts: feature dependency graph markdown");
    expect(result.obligations[0].reason).toContain("missing command evidence");
  });

  it("treats explicit route-away notes as artifact obligation routing", () => {
    expect(
      analyzeArtifactObligations(artifactContext("DOC:api-contract owns API contract refresh. DOC:permission-mapping owns authorization mapping."), [
        "src/features/example/transport/routes.ts",
      ]),
    ).toMatchObject({
      status: "pass",
      obligations: [
        {
          obligation: "api contract artifact",
          status: "routed",
        },
        {
          obligation: "OpenAPI artifact",
          status: "routed",
        },
        {
          obligation: "Postman artifact",
          status: "routed",
        },
        {
          obligation: "permission mapping artifact",
          status: "routed",
        },
      ],
    });
  });

  it("passes API route obligations when API docs, OpenAPI, Postman, and permission mappings changed", () => {
    expect(
      analyzeArtifactObligations(artifactContext(), [
        "src/features/example/transport/routes.ts",
        "docs/api-contracts/example.md",
        "docs/swagger/openapi.yaml",
        "docs/postman/collections/example.postman_collection.json",
        "docs/architecture/permission-mappings/example.md",
      ]),
    ).toMatchObject({
      status: "pass",
      obligations: [
        {
          obligation: "api contract artifact",
          status: "pass",
        },
        {
          obligation: "OpenAPI artifact",
          status: "pass",
        },
        {
          obligation: "Postman artifact",
          status: "pass",
        },
        {
          obligation: "permission mapping artifact",
          status: "pass",
        },
      ],
    });
  });

  it("blocks API route obligations when OpenAPI, Postman, and permission mappings are missing or unrouted", () => {
    const result = analyzeArtifactObligations(artifactContext(), [
      "src/features/example/transport/routes.ts",
      "docs/api-contracts/example.md",
    ]);

    expect(result.status).toBe("blocked");
    expect(result.obligations.map((obligation) => `${obligation.obligation}:${obligation.status}`)).toEqual([
      "api contract artifact:pass",
      "OpenAPI artifact:blocked",
      "Postman artifact:blocked",
      "permission mapping artifact:blocked",
    ]);
  });

  it("requires persistence evidence command shape for data dictionary obligations", () => {
    const missingCommand = analyzeArtifactObligations(artifactContext(), [
      "src/features/example/persistence/repository.ts",
      "docs/data-dictionary/example.md",
    ]);

    expect(missingCommand).toMatchObject({
      status: "blocked",
      obligations: [
        {
          obligation: "data dictionary artifact",
          status: "blocked",
        },
      ],
    });
    expect(missingCommand.obligations[0].reason).toContain("missing command evidence");

    expect(
      analyzeArtifactObligations(artifactContext("", "npx vitest run tests/integration/example/persistence"), [
        "src/features/example/persistence/repository.ts",
        "docs/data-dictionary/example.md",
      ]),
    ).toMatchObject({
      status: "pass",
      obligations: [
        {
          obligation: "data dictionary artifact",
          status: "pass",
        },
      ],
    });
  });

  it("requires runtime or browser evidence command shape for QA obligations", () => {
    const missingEvidence = analyzeArtifactObligations(artifactContext(), [
      "src/frontend/example/page.ts",
      "docs/workspace/qa/example-qa-checklist.md",
    ]);

    expect(missingEvidence).toMatchObject({
      status: "blocked",
      obligations: [
        {
          obligation: "qa evidence artifact",
          status: "blocked",
        },
      ],
    });
    expect(missingEvidence.obligations[0].reason).toContain("missing command evidence");

    expect(
      analyzeArtifactObligations(artifactContext("", "npx playwright test tests/visual/example.spec.ts"), [
        "src/frontend/example/page.ts",
        "docs/workspace/qa/example-qa-checklist.md",
      ]),
    ).toMatchObject({
      status: "pass",
      obligations: [
        {
          obligation: "qa evidence artifact",
          status: "pass",
        },
      ],
    });
  });

  it("passes Layer 5 harness obligations when tests and runner docs changed", () => {
    expect(
      analyzeArtifactObligations(artifactContext(), [
        "src/scripts/layer5/taskRun.ts",
        "tests/unit/layer5/layer5Harness.test.ts",
        "docs/workspace/layer5-task-runs/README.md",
      ]),
    ).toMatchObject({
      status: "pass",
      obligations: [
        {
          obligation: "layer5 harness documentation and tests",
          status: "pass",
        },
      ],
    });
  });

  it("classifies closeout pass when all gates pass", () => {
    expect(
      classifyCloseoutResult({
        preEditRecordExists: true,
        taskStatus: "ready",
        pluginResults: [pluginResult()],
        writeSetResult: writeSetResult(),
        artifactObligationResult: artifactResult(),
        validationResult: commandResult(),
        proofResults: [commandResult({ command: "npx vitest run tests/unit/layer5" })],
      }),
    ).toMatchObject({
      code: "pass",
      exitCode: 0,
    });
  });

  it("classifies closeout by the first blocking gate", () => {
    expect(
      classifyCloseoutResult({
        preEditRecordExists: false,
        taskStatus: "ready",
        pluginResults: [pluginResult()],
        writeSetResult: writeSetResult({ status: "blocked", reason: "outside write set" }),
        artifactObligationResult: artifactResult(),
        validationResult: commandResult(),
        proofResults: [],
      }),
    ).toMatchObject({
      code: "blocked-pre-edit-record",
      exitCode: 2,
    });

    expect(
      classifyCloseoutResult({
        preEditRecordExists: true,
        taskStatus: "ready",
        pluginResults: [pluginResult()],
        writeSetResult: writeSetResult({ status: "blocked", reason: "outside write set" }),
        artifactObligationResult: artifactResult({ status: "blocked", reason: "missing API contract", obligations: [] }),
        validationResult: commandResult(),
        proofResults: [commandResult({ status: "fail", reason: "exit=1" })],
      }),
    ).toMatchObject({
      code: "blocked-write-set",
      exitCode: 2,
    });
  });

  it("classifies artifact, validation, and proof closeout blockers", () => {
    expect(
      classifyCloseoutResult({
        preEditRecordExists: true,
        taskStatus: "ready",
        pluginResults: [pluginResult()],
        writeSetResult: writeSetResult(),
        artifactObligationResult: artifactResult({ status: "blocked", reason: "missing OpenAPI artifact" }),
        validationResult: commandResult(),
        proofResults: [],
      }),
    ).toMatchObject({
      code: "blocked-artifact-obligation",
      exitCode: 2,
    });

    expect(
      classifyCloseoutResult({
        preEditRecordExists: true,
        taskStatus: "ready",
        pluginResults: [pluginResult()],
        writeSetResult: writeSetResult(),
        artifactObligationResult: artifactResult(),
        validationResult: commandResult({ status: "fail", reason: "exit=1" }),
        proofResults: [],
      }),
    ).toMatchObject({
      code: "blocked-validation",
      exitCode: 1,
    });

    expect(
      classifyCloseoutResult({
        preEditRecordExists: true,
        taskStatus: "ready",
        pluginResults: [pluginResult()],
        writeSetResult: writeSetResult(),
        artifactObligationResult: artifactResult(),
        validationResult: commandResult(),
        proofResults: [commandResult({ command: "npx vitest run tests/unit/layer5", status: "fail", reason: "exit=1" })],
      }),
    ).toMatchObject({
      code: "blocked-proof",
      exitCode: 1,
    });
  });
});
