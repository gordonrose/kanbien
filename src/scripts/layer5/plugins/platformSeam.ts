import type { Layer5TaskContext, Layer5TaskPlugin, PluginCheckResult } from "../contract";

const platformSeamPluginName = "DEV:platform-seam";

const requiredPlatformCheckIds = [
  "platform-source-authority",
  "platform-seam-kind",
  "platform-seam-owner",
  "platform-exact-write-envelope",
  "platform-consumer-inventory",
  "platform-compatibility-mode",
  "platform-representative-consumer-proof",
  "platform-proof-commands",
  "platform-split-routing",
];

const requiredContractFields: Array<[field: keyof Layer5TaskContext["platformSeamContracts"][number], label: string]> = [
  ["seamKind", "seam kind"],
  ["compatibilityMode", "compatibility mode"],
  ["approvedAuthoritySource", "approved authority source"],
  ["seamOwnerLocation", "seam owner/location"],
  ["seamSourceInventory", "seam source inventory"],
  ["seamChangeScope", "seam change scope"],
  ["exactWriteEnvelope", "exact write envelope"],
  ["whyNotFeatureLocal", "why not feature-local"],
  ["consumers", "current/future/unsupported consumers"],
  ["compatibilityContract", "compatibility contract"],
  ["representativeConsumerProof", "representative consumer proof"],
  ["runtimeRestartImpact", "runtime/restart impact"],
  ["rolloutBackoutPosture", "rollout/backout posture"],
  ["artifactMaterializationImpact", "artifact/materialization impact"],
  ["expectedSeamOutput", "expected seam output"],
  ["architectureStandardsBoundary", "architecture/standards boundary"],
  ["splitBlockedFollowUp", "split/blocked follow-up"],
  ["proofCommands", "proof commands"],
  ["humanReviewBoundary", "human review boundary"],
];

export const platformSeamPlugin: Layer5TaskPlugin = {
  taskType: platformSeamPluginName,
  check(context: Layer5TaskContext): PluginCheckResult {
    const notes: string[] = [];
    const checkIds = new Set(context.guardrailEvidence.map((row) => row.checkId));
    const missing = requiredPlatformCheckIds.filter((checkId) => !checkIds.has(checkId));
    const failing = context.guardrailEvidence.filter((row) => row.status !== "pass");

    if (missing.length > 0) {
      notes.push(`missing check ids: ${missing.join(", ")}`);
    } else {
      notes.push("guardrail evidence includes required platform-seam check ids");
    }

    if (failing.length > 0) {
      notes.push(`non-pass guardrail rows: ${failing.map((row) => row.checkId).join(", ")}`);
    } else {
      notes.push("guardrail evidence rows pass");
    }

    if (context.platformSeamContracts.length !== 1) {
      notes.push(`expected exactly one Platform Seam Contract row, found ${context.platformSeamContracts.length}`);
      return blocked(notes);
    }

    const contract = context.platformSeamContracts[0];
    const blankFields = requiredContractFields.filter(([field]) => isBlank(contract[field])).map(([, label]) => label);
    if (blankFields.length > 0) {
      notes.push(`missing Platform Seam Contract fields: ${blankFields.join(", ")}`);
    } else {
      notes.push(`contract parsed: ${contract.seamKind} / ${contract.compatibilityMode}`);
    }

    if (context.platformSeamClassContracts.length !== 1) {
      notes.push(`expected exactly one Platform Seam Class Contract row, found ${context.platformSeamClassContracts.length}`);
    } else {
      const classContract = context.platformSeamClassContracts[0];
      if (classContract.platformSeamClass !== contract.seamKind) {
        notes.push(`platform seam class ${classContract.platformSeamClass} does not match seam kind ${contract.seamKind}`);
      } else {
        notes.push(`class contract matches seam kind ${contract.seamKind}`);
      }

      if (isBlank(classContract.requiredConsumerCoverage)) {
        notes.push("missing class contract required consumer coverage");
      }

      if (!hasRoutedContamination(classContract.forbiddenContaminationSplitNotes, contract.splitBlockedFollowUp)) {
        notes.push("forbidden contamination is not routed to separate task types");
      }
    }

    if (!mentionsScriptableInventory(contract.seamSourceInventory)) {
      notes.push("seam source inventory is not scriptable enough to locate files or docs");
    } else {
      notes.push("source inventory names scriptable files or path patterns");
    }

    if (!isNarrowWriteEnvelope(contract.exactWriteEnvelope, context.task.allowedWriteSet)) {
      notes.push("exact write envelope is missing exact files/narrow patterns or diverges from the task allowed write set");
    } else {
      notes.push("exact write envelope is narrow and aligns with task allowed write set");
    }

    if (isBlockedCompatibilityMode(contract.compatibilityMode, contract.compatibilityContract, contract.splitBlockedFollowUp)) {
      notes.push("compatibility-sensitive or blocked mode lacks an approved compatibility strategy or routed follow-up");
    }

    if (!hasRepresentativeProof(contract.representativeConsumerProof, contract.proofCommands, context.proofRows.map((row) => row.commands).join("; "))) {
      notes.push("representative consumer proof is missing or not backed by focused proof commands");
    } else {
      notes.push("representative consumer proof is backed by focused proof commands");
    }

    if (!hasRuntimePosture(contract.runtimeRestartImpact)) {
      notes.push("runtime/restart impact must name restart, reload, redeploy, or not-required posture");
    }

    if (!hasBackoutPosture(contract.rolloutBackoutPosture)) {
      notes.push("rollout/backout posture must name rollout, rollback, backout, revert, or not-applicable posture");
    }

    const blockedNotes = notes.filter((note) =>
      note.startsWith("missing") ||
      note.startsWith("expected exactly") ||
      note.includes("does not match") ||
      note.includes("not routed") ||
      note.includes("not scriptable") ||
      note.includes("diverges") ||
      note.includes("lacks") ||
      note.includes("must name") ||
      note.includes("not backed"),
    );

    if (missing.length > 0 || failing.length > 0 || blockedNotes.length > 0) {
      return blocked(notes);
    }

    return {
      plugin: platformSeamPluginName,
      status: "pass",
      notes,
    };
  },
};

function blocked(notes: string[]): PluginCheckResult {
  return {
    plugin: platformSeamPluginName,
    status: "blocked",
    notes,
  };
}

function isBlank(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "" || normalized === "todo" || normalized === "tbd" || normalized === "unknown";
}

function mentionsScriptableInventory(value: string): boolean {
  return /(^|[\s;])(?:docs|src|tests)\//.test(value) || value.includes("**") || value.includes("*.ts");
}

function isNarrowWriteEnvelope(exactWriteEnvelope: string, allowedWriteSet: string): boolean {
  const envelope = normalizeEnvelope(exactWriteEnvelope);
  const allowed = normalizeEnvelope(allowedWriteSet);
  if (envelope.length === 0 || allowed.length === 0) {
    return false;
  }

  if (envelope.some((entry) => isBroadEntry(entry))) {
    return false;
  }

  return envelope.every((entry) => allowed.some((allowedEntry) => patternsOverlapOrContain(allowedEntry, entry)));
}

function normalizeEnvelope(value: string): string[] {
  return value
    .replace(/^narrow exact patterns:\s*/i, "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function isBroadEntry(value: string): boolean {
  return ["src/**", "src", "tests/**", "docs/**", "**"].includes(value) || /^(src|tests|docs)\/\*\*$/.test(value);
}

function patternsOverlapOrContain(allowedEntry: string, envelopeEntry: string): boolean {
  if (allowedEntry === envelopeEntry) {
    return true;
  }

  const allowedPrefix = patternPrefix(allowedEntry);
  const envelopePrefix = patternPrefix(envelopeEntry);
  return envelopePrefix.startsWith(allowedPrefix) || allowedPrefix.startsWith(envelopePrefix);
}

function patternPrefix(value: string): string {
  return value
    .replace(/\*\*\/\*.*$/, "")
    .replace(/\*\*.*$/, "")
    .replace(/\*.*$/, "")
    .replace(/\/$/, "");
}

function isBlockedCompatibilityMode(compatibilityMode: string, compatibilityContract: string, splitBlockedFollowUp: string): boolean {
  const combined = `${compatibilityMode} ${compatibilityContract} ${splitBlockedFollowUp}`.toLowerCase();
  if (!combined.includes("compatibility-sensitive") && !compatibilityMode.toLowerCase().includes("blocked")) {
    return false;
  }

  return !/(approved|strategy|follow-up|gov:architecture-update|compatibility plan|migration)/.test(combined);
}

function hasRepresentativeProof(representativeProof: string, contractProofCommands: string, proofPlanCommands: string): boolean {
  if (isBlank(representativeProof) || representativeProof.toLowerCase().startsWith("not-applicable")) {
    return false;
  }

  const commands = `${contractProofCommands}; ${proofPlanCommands}`.toLowerCase();
  if (commands.includes("blocked")) {
    return false;
  }

  return /(npx vitest run|npx playwright test|npm run [a-z0-9:-]+)/.test(commands);
}

function hasRuntimePosture(value: string): boolean {
  return /(restart|reload|redeploy|not-required|not-applicable|normal test runtime)/i.test(value);
}

function hasBackoutPosture(value: string): boolean {
  return /(rollout|rollback|backout|revert|not-applicable)/i.test(value);
}

function hasRoutedContamination(forbiddenNotes: string, splitFollowUp: string): boolean {
  const combined = `${forbiddenNotes} ${splitFollowUp}`.toLowerCase();
  const contaminationWords = ["api", "permission", "feature behavior", "persistence", "migration", "evidence"];
  const mentioned = contaminationWords.filter((word) => combined.includes(word));
  if (mentioned.length === 0) {
    return true;
  }

  return /(doc:api-contract|doc:permission-mapping|dev:backend|dev:frontend|dev:vertical-slice|dev:migration-persistence|evidence:qa-evidence)/.test(combined);
}
