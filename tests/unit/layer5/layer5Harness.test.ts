import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { runProofCommands, runValidationCommand } from "../../../src/scripts/layer5/commandRunner";
import type { Layer5TaskContext } from "../../../src/scripts/layer5/contract";
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
          plugin: "generic",
          status: "pass",
          notes: ["no task-type plugin registered for DEV:frontend"],
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
});
