import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  attachDecisionToPacket,
  decisionEvidencePaths,
  upsertDecision,
  upsertEvidencePacket,
  validateDecisionPacketLinks,
  type DecisionRecord,
  type EvidencePacketRecord,
} from "../../../src/scripts/lib/decisionEvidenceRegistry";

function tempPaths() {
  return decisionEvidencePaths(mkdtempSync(path.join(tmpdir(), "decision-evidence-")));
}

const decision: DecisionRecord = {
  decisionKey: "decision.test.create_decision_entity",
  decisionType: "entity_model",
  statement: "Decision is a durable planning/control entity.",
  status: "needs_review",
  appliesTo: {
    entityKey: "decision",
    capabilityKey: "create_decision",
  },
  sourceRefs: [
    {
      sourceKey: "docs/workspace/chat-records/2026-05-20-decision-evidence-harness-request.md",
      sourceType: "conversation",
      sourceLocationType: "repo_path",
      repoPath: "docs/workspace/chat-records/2026-05-20-decision-evidence-harness-request.md",
      proofStatement: "Gordon proposed using Decision as an entity that evidence packets can reference.",
    },
  ],
  relations: [],
  createdAt: "2026-05-20T00:00:00.000Z",
  createdByActorKey: "codex_5_5",
  reviewedAt: null,
  reviewedByActorKey: "not_approved",
  approvedByActorKey: "not_approved",
};

const packet: EvidencePacketRecord = {
  evidencePacketKey: "packet.test.create_decision",
  status: "active_planning",
  target: {
    targetType: "capability",
    entityKey: "decision",
    capabilityKey: "create_decision",
  },
  currentTruth: {
    statement: "Create decision stores a durable decision point in repo artifacts until persistence exists.",
    version: 1,
    updatedAt: "2026-05-20T00:00:00.000Z",
    updatedByActorKey: "codex_5_5",
  },
  sourceDecisionKeys: [],
  execution: {
    intent: "Capture a decision record that can later migrate to persistence.",
    requiredInputs: ["decisionKey", "statement"],
    expectedOutputs: ["decision-registry.json updated"],
    verificationNotes: ["validate command reports no missing decision links"],
  },
  affectedRegistryRows: [],
  affectedArtifacts: ["docs/workspace/decision-evidence/decision-registry.json"],
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

describe("decision evidence registry", () => {
  it("upserts decisions and evidence packets while preserving packet links", () => {
    const paths = tempPaths();

    upsertDecision(decision, { paths, now: new Date("2026-05-20T01:00:00.000Z") });
    upsertEvidencePacket(packet, { paths, now: new Date("2026-05-20T01:00:00.000Z") });
    attachDecisionToPacket(
      {
        evidencePacketKey: packet.evidencePacketKey,
        decisionKey: decision.decisionKey,
      },
      { paths, now: new Date("2026-05-20T01:00:00.000Z") },
    );

    const decisionRegistry = JSON.parse(readFileSync(paths.decisionRegistryPath, "utf8"));
    const packetRegistry = JSON.parse(readFileSync(paths.evidencePacketRegistryPath, "utf8"));

    expect(decisionRegistry.storagePosture).toBe("repo_artifact_until_capabilities_exist");
    expect(decisionRegistry.decisions).toHaveLength(1);
    expect(packetRegistry.evidencePackets[0].sourceDecisionKeys).toEqual([decision.decisionKey]);
    expect(validateDecisionPacketLinks({ paths }).missingDecisionLinks).toEqual([]);
  });

  it("reports evidence packets that reference missing decisions", () => {
    const paths = tempPaths();

    upsertEvidencePacket(
      {
        ...packet,
        sourceDecisionKeys: ["decision.missing"],
      },
      { paths },
    );

    expect(validateDecisionPacketLinks({ paths }).missingDecisionLinks).toEqual([
      {
        evidencePacketKey: packet.evidencePacketKey,
        decisionKey: "decision.missing",
      },
    ]);
  });
});
