import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type ActorKey = "codex_5_5" | "gordon.rose" | "not_approved" | string;

export type DecisionRelationType =
  | "supports"
  | "clarifies"
  | "narrows"
  | "expands"
  | "supersedes"
  | "partially_supersedes"
  | "conflicts_with"
  | "implements";

export type DecisionReviewStatus =
  | "draft"
  | "needs_review"
  | "reviewed"
  | "approved"
  | "superseded"
  | "deferred";

export type SourceRef = {
  sourceKey: string;
  sourceType: string;
  sourceLocationType: "repo_path" | "git_commit" | "chat" | "runtime_observation" | "manual_note" | string;
  llmChatId?: string;
  llmTurnId?: string;
  repoPath?: string;
  commitSha?: string;
  proofStatement: string;
  supplementalRefs?: SourceRef[];
};

export type DecisionAppliesTo = {
  entityKey?: string;
  capabilityKey?: string;
  fieldKey?: string;
  artifactPath?: string;
  evidencePacketKey?: string;
};

export type DecisionRelation = {
  relationType: DecisionRelationType;
  targetDecisionKey: string;
  reason: string;
};

export type DecisionRecord = {
  decisionKey: string;
  decisionType: string;
  statement: string;
  status: DecisionReviewStatus;
  appliesTo: DecisionAppliesTo;
  sourceRefs: SourceRef[];
  relations: DecisionRelation[];
  createdAt: string;
  createdByActorKey: ActorKey;
  reviewedAt: string | null;
  reviewedByActorKey: ActorKey;
  approvedByActorKey: ActorKey;
  notes?: string;
};

export type EvidencePacketTarget = {
  targetType: "capability" | "field" | "page" | "entity" | "artifact" | string;
  entityKey?: string;
  capabilityKey?: string;
  fieldKey?: string;
  artifactPath?: string;
};

export type EvidencePacketRecord = {
  evidencePacketKey: string;
  status: "draft" | "active_planning" | "ready_for_review" | "approved" | "superseded" | string;
  target: EvidencePacketTarget;
  currentTruth: {
    statement: string;
    version: number;
    updatedAt: string;
    updatedByActorKey: ActorKey;
  };
  sourceDecisionKeys: string[];
  execution: {
    intent: string;
    requiredInputs: string[];
    expectedOutputs: string[];
    verificationNotes: string[];
  };
  affectedRegistryRows: string[];
  affectedArtifacts: string[];
  approval: {
    reviewStatus: DecisionReviewStatus;
    reviewedByActorKey: ActorKey;
    approvedByActorKey: ActorKey;
    reviewedAt: string | null;
  };
  migrationPosture: string;
  createdAt: string;
  createdByActorKey: ActorKey;
};

export type DecisionRegistryArtifact = {
  artifactKey: "decision_registry";
  generatedAt: string;
  storagePosture: "repo_artifact_until_capabilities_exist";
  migrationTarget: "decision_entity_capabilities";
  decisions: DecisionRecord[];
};

export type EvidencePacketRegistryArtifact = {
  artifactKey: "evidence_packet_registry";
  generatedAt: string;
  storagePosture: "repo_artifact_until_capabilities_exist";
  migrationTarget: "evidence_packet_entity_capabilities";
  evidencePackets: EvidencePacketRecord[];
};

export type DecisionEvidencePaths = {
  rootDir: string;
  decisionRegistryPath: string;
  evidencePacketRegistryPath: string;
};

export function decisionEvidencePaths(rootDir = "docs/workspace/decision-evidence"): DecisionEvidencePaths {
  return {
    rootDir,
    decisionRegistryPath: path.join(rootDir, "decision-registry.json"),
    evidencePacketRegistryPath: path.join(rootDir, "evidence-packet-registry.json"),
  };
}

function nowIso(now = new Date()): string {
  return now.toISOString();
}

function createEmptyDecisionRegistry(generatedAt: string): DecisionRegistryArtifact {
  return {
    artifactKey: "decision_registry",
    generatedAt,
    storagePosture: "repo_artifact_until_capabilities_exist",
    migrationTarget: "decision_entity_capabilities",
    decisions: [],
  };
}

function createEmptyEvidencePacketRegistry(generatedAt: string): EvidencePacketRegistryArtifact {
  return {
    artifactKey: "evidence_packet_registry",
    generatedAt,
    storagePosture: "repo_artifact_until_capabilities_exist",
    migrationTarget: "evidence_packet_entity_capabilities",
    evidencePackets: [],
  };
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

function writeJsonFile(filePath: string, data: unknown): void {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.trim().length > 0))].sort();
}

function sortDecision(decision: DecisionRecord): DecisionRecord {
  return {
    ...decision,
    sourceRefs: [...decision.sourceRefs].sort((left, right) => left.sourceKey.localeCompare(right.sourceKey)),
    relations: [...decision.relations].sort((left, right) => {
      const relation = left.relationType.localeCompare(right.relationType);
      return relation === 0 ? left.targetDecisionKey.localeCompare(right.targetDecisionKey) : relation;
    }),
  };
}

function sortPacket(packet: EvidencePacketRecord): EvidencePacketRecord {
  return {
    ...packet,
    sourceDecisionKeys: uniqueSorted(packet.sourceDecisionKeys),
    affectedRegistryRows: uniqueSorted(packet.affectedRegistryRows),
    affectedArtifacts: uniqueSorted(packet.affectedArtifacts),
    execution: {
      intent: packet.execution.intent,
      requiredInputs: uniqueSorted(packet.execution.requiredInputs),
      expectedOutputs: uniqueSorted(packet.execution.expectedOutputs),
      verificationNotes: uniqueSorted(packet.execution.verificationNotes),
    },
  };
}

export function loadDecisionRegistry(paths = decisionEvidencePaths(), now = new Date()): DecisionRegistryArtifact {
  return readJsonFile(paths.decisionRegistryPath, createEmptyDecisionRegistry(nowIso(now)));
}

export function loadEvidencePacketRegistry(paths = decisionEvidencePaths(), now = new Date()): EvidencePacketRegistryArtifact {
  return readJsonFile(paths.evidencePacketRegistryPath, createEmptyEvidencePacketRegistry(nowIso(now)));
}

export function upsertDecision(
  decision: DecisionRecord,
  options: { paths?: DecisionEvidencePaths; now?: Date } = {},
): DecisionRegistryArtifact {
  const paths = options.paths ?? decisionEvidencePaths();
  const generatedAt = nowIso(options.now);
  const registry = loadDecisionRegistry(paths, options.now);
  const nextDecision = sortDecision(decision);
  const existingIndex = registry.decisions.findIndex((entry) => entry.decisionKey === decision.decisionKey);
  const decisions =
    existingIndex === -1
      ? [...registry.decisions, nextDecision]
      : registry.decisions.map((entry, index) => (index === existingIndex ? nextDecision : entry));

  const nextRegistry: DecisionRegistryArtifact = {
    ...registry,
    generatedAt,
    decisions: decisions.sort((left, right) => left.decisionKey.localeCompare(right.decisionKey)),
  };
  writeJsonFile(paths.decisionRegistryPath, nextRegistry);
  return nextRegistry;
}

export function upsertEvidencePacket(
  packet: EvidencePacketRecord,
  options: { paths?: DecisionEvidencePaths; now?: Date } = {},
): EvidencePacketRegistryArtifact {
  const paths = options.paths ?? decisionEvidencePaths();
  const generatedAt = nowIso(options.now);
  const registry = loadEvidencePacketRegistry(paths, options.now);
  const nextPacket = sortPacket(packet);
  const existingIndex = registry.evidencePackets.findIndex((entry) => entry.evidencePacketKey === packet.evidencePacketKey);
  const evidencePackets =
    existingIndex === -1
      ? [...registry.evidencePackets, nextPacket]
      : registry.evidencePackets.map((entry, index) => (index === existingIndex ? nextPacket : entry));

  const nextRegistry: EvidencePacketRegistryArtifact = {
    ...registry,
    generatedAt,
    evidencePackets: evidencePackets.sort((left, right) => left.evidencePacketKey.localeCompare(right.evidencePacketKey)),
  };
  writeJsonFile(paths.evidencePacketRegistryPath, nextRegistry);
  return nextRegistry;
}

export function attachDecisionToPacket(
  input: {
    evidencePacketKey: string;
    decisionKey: string;
    relationReason?: string;
  },
  options: { paths?: DecisionEvidencePaths; now?: Date } = {},
): EvidencePacketRegistryArtifact {
  const paths = options.paths ?? decisionEvidencePaths();
  const registry = loadEvidencePacketRegistry(paths, options.now);
  const packet = registry.evidencePackets.find((entry) => entry.evidencePacketKey === input.evidencePacketKey);
  if (!packet) {
    throw new Error(`Evidence packet not found: ${input.evidencePacketKey}`);
  }

  return upsertEvidencePacket(
    {
      ...packet,
      sourceDecisionKeys: uniqueSorted([...packet.sourceDecisionKeys, input.decisionKey]),
    },
    { paths, now: options.now },
  );
}

export function validateDecisionPacketLinks(
  options: { paths?: DecisionEvidencePaths; now?: Date } = {},
): { missingDecisionLinks: Array<{ evidencePacketKey: string; decisionKey: string }> } {
  const paths = options.paths ?? decisionEvidencePaths();
  const decisionRegistry = loadDecisionRegistry(paths, options.now);
  const packetRegistry = loadEvidencePacketRegistry(paths, options.now);
  const knownDecisionKeys = new Set(decisionRegistry.decisions.map((decision) => decision.decisionKey));
  const missingDecisionLinks = packetRegistry.evidencePackets.flatMap((packet) =>
    packet.sourceDecisionKeys
      .filter((decisionKey) => !knownDecisionKeys.has(decisionKey))
      .map((decisionKey) => ({ evidencePacketKey: packet.evidencePacketKey, decisionKey })),
  );
  return { missingDecisionLinks };
}
