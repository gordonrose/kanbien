import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { decisionEvidencePaths, type EvidencePacketRecord } from "../../../src/scripts/lib/decisionEvidenceRegistry";

function runDecisionEvidence(args: string[], cwd = process.cwd()): string {
  return execFileSync("node", ["--import", "tsx", "src/scripts/decisionEvidence.ts", ...args], {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

describe("decision evidence CLI", () => {
  it("records a quick decision and attaches it to an existing packet", () => {
    const rootDir = mkdtempSync(path.join(tmpdir(), "decision-evidence-cli-"));
    const paths = decisionEvidencePaths(rootDir);
    const packet: EvidencePacketRecord = {
      evidencePacketKey: "packet.test.quick",
      status: "active_planning",
      target: {
        targetType: "capability",
        entityKey: "decision",
        capabilityKey: "create_decision",
      },
      currentTruth: {
        statement: "Quick decision can be attached to an existing packet.",
        version: 1,
        updatedAt: "2026-05-20T00:00:00.000Z",
        updatedByActorKey: "codex_5_5",
      },
      sourceDecisionKeys: [],
      execution: {
        intent: "Exercise quick-decision.",
        requiredInputs: [],
        expectedOutputs: [],
        verificationNotes: [],
      },
      affectedRegistryRows: [],
      affectedArtifacts: [],
      approval: {
        reviewStatus: "needs_review",
        reviewedByActorKey: "not_approved",
        approvedByActorKey: "not_approved",
        reviewedAt: null,
      },
      migrationPosture: "repo_artifact_until_decision_capabilities_exist",
      createdAt: "2026-05-20T00:00:00.000Z",
      createdByActorKey: "codex_5_5",
    };
    writeFileSync(
      paths.evidencePacketRegistryPath,
      JSON.stringify(
        {
          artifactKey: "evidence_packet_registry",
          generatedAt: "2026-05-20T00:00:00.000Z",
          storagePosture: "repo_artifact_until_capabilities_exist",
          migrationTarget: "evidence_packet_entity_capabilities",
          evidencePackets: [packet],
        },
        null,
        2,
      ),
    );

    const output = runDecisionEvidence([
      "quick-decision",
      "--root-dir",
      rootDir,
      "--decision-key",
      "decision.test.quick",
      "--type",
      "harness_policy",
      "--statement",
      "Quick decisions reduce friction for live decision capture.",
      "--entity",
      "decision",
      "--capability",
      "create_decision",
      "--source-key",
      "test_source",
      "--llm-chat-id",
      "llm-chat-test-123",
      "--proof",
      "The CLI should create a decision and attach it to a packet.",
      "--packet-key",
      "packet.test.quick",
    ]);

    const parsedOutput = JSON.parse(output);
    const decisionRegistry = JSON.parse(readFileSync(paths.decisionRegistryPath, "utf8"));
    const packetRegistry = JSON.parse(readFileSync(paths.evidencePacketRegistryPath, "utf8"));

    expect(parsedOutput.status).toBe("quick_decision_recorded_and_attached");
    expect(decisionRegistry.decisions[0].decisionKey).toBe("decision.test.quick");
    expect(decisionRegistry.decisions[0].sourceRefs[0].llmChatId).toBe("llm-chat-test-123");
    expect(packetRegistry.evidencePackets[0].sourceDecisionKeys).toEqual(["decision.test.quick"]);
  });
});
