import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const requiredHeadings = [
  "# Technical Steering",
  "## Status",
  "## Product Handoff",
  "## Architecture Classification",
  "## Architecture Risk Flags",
  "## Deterministic Signal Checks",
  "## Steering Decisions",
  "## Blockers",
  "## Layer 3 Handoff",
];

const allowedClassifications = new Set([
  "feature-local",
  "feature-public-seam",
  "platform-seam",
  "shared-lib-candidate",
  "design-system-seam",
  "architecture-foundation-required",
  "blocked",
]);

const allowedDecisionStatuses = new Set(["approved", "blocked", "deferred-with-owner"]);
const allowedTriggerStatuses = new Set(["yes", "no", "blocked"]);
const allowedHandoffStatuses = new Set(["ready-for-story-breakdown", "blocked", "superseded"]);

const requiredTriggerIds = new Set([
  "TSIG-PLATFORM-SEAM",
  "TSIG-API-CONTRACT",
  "TSIG-PERSISTENCE",
  "TSIG-PERMISSION",
  "TSIG-GOVERNED-FRONTEND",
  "TSIG-FRONTEND-SURFACE",
  "TSIG-SHARED-CODE",
  "TSIG-DATA-DICTIONARY",
  "TSIG-QA-RUNTIME",
  "TSIG-DOCS-ARTIFACT",
]);

const vaguePhrases = [
  "as needed",
  "etc.",
  "handle later",
  "figure out later",
  "shared maybe",
  "probably feature-local",
];

export type TechnicalSteeringValidationResult = {
  status: "PASS" | "BLOCKED";
  errors: string[];
};

type ClassificationRow = {
  classificationId: string;
  scopeElement: string;
  classification: string;
  ownerSeam: string;
  decisionStatus: string;
  rationale: string;
  downstreamSignal: string;
};

type SignalCheckRow = {
  triggerId: string;
  triggerQuestion: string;
  triggerStatus: string;
  evidence: string;
  requiredClassification: string;
  requiredTaskType: string;
  exceptionDecision: string;
};

type HandoffRow = {
  scopeElement: string;
  handoffStatus: string;
  requiredClassificationIds: string;
  notes: string;
};

export function validateTechnicalSteeringContent(content: string): TechnicalSteeringValidationResult {
  const errors: string[] = [];

  for (const heading of requiredHeadings) {
    if (!content.includes(heading)) {
      errors.push(`missing heading: ${heading}`);
    }
  }

  validateVaguePhrases(content, errors);

  const classifications = parseClassificationRows(content);
  const signalChecks = parseSignalCheckRows(content);
  const handoffs = parseHandoffRows(content);

  if (classifications.length === 0) {
    errors.push("Architecture Classification has no rows");
  }

  if (signalChecks.length === 0) {
    errors.push("Deterministic Signal Checks has no rows");
  }

  const classificationsById = new Map(classifications.map((row) => [row.classificationId, row]));
  const signalChecksById = new Map(signalChecks.map((row) => [row.triggerId, row]));

  for (const triggerId of requiredTriggerIds) {
    if (!signalChecksById.has(triggerId)) {
      errors.push(`missing deterministic signal check: ${triggerId}`);
    }
  }

  for (const classification of classifications) {
    validateRequiredField(classification.classificationId, "Scope Element", classification.scopeElement, errors);
    validateRequiredField(classification.classificationId, "Owner / Seam", classification.ownerSeam, errors);
    validateRequiredField(classification.classificationId, "Rationale", classification.rationale, errors);
    validateRequiredField(
      classification.classificationId,
      "Required Downstream Signal",
      classification.downstreamSignal,
      errors,
    );

    if (!allowedClassifications.has(classification.classification)) {
      errors.push(
        `${classification.classificationId} has invalid classification: ${classification.classification || "(blank)"}`,
      );
    }

    if (!allowedDecisionStatuses.has(classification.decisionStatus)) {
      errors.push(
        `${classification.classificationId} has invalid decision status: ${classification.decisionStatus || "(blank)"}`,
      );
    }

    if (classification.classification === "blocked" || classification.decisionStatus === "blocked") {
      errors.push(`${classification.classificationId} architecture classification is blocked`);
    }
  }

  for (const signal of signalChecks) {
    validateRequiredField(signal.triggerId, "Trigger Question", signal.triggerQuestion, errors);
    validateRequiredField(signal.triggerId, "Evidence", signal.evidence, errors);
    validateRequiredField(signal.triggerId, "Required Classification", signal.requiredClassification, errors);
    validateRequiredField(signal.triggerId, "Required Layer 4 Task Type", signal.requiredTaskType, errors);

    if (!allowedTriggerStatuses.has(signal.triggerStatus)) {
      errors.push(`${signal.triggerId} has invalid trigger status: ${signal.triggerStatus || "(blank)"}`);
    }

    if (!allowedClassifications.has(signal.requiredClassification)) {
      errors.push(`${signal.triggerId} has invalid required classification: ${signal.requiredClassification || "(blank)"}`);
    }

    if (signal.triggerStatus === "blocked") {
      errors.push(`${signal.triggerId} deterministic signal is blocked`);
    }

    if (signal.triggerStatus === "yes") {
      const matchingClassification = classifications.some(
        (classification) =>
          classification.classification === signal.requiredClassification &&
          classification.downstreamSignal === signal.requiredTaskType,
      );

      if (!matchingClassification && !hasApprovedException(signal.exceptionDecision)) {
        errors.push(
          `${signal.triggerId} is yes but no classification row or approved exception maps to ${signal.requiredTaskType}`,
        );
      }
    }
  }

  for (const handoff of handoffs) {
    validateRequiredField(handoff.scopeElement, "Handoff Status", handoff.handoffStatus, errors);
    validateRequiredField(handoff.scopeElement, "Required Classification IDs", handoff.requiredClassificationIds, errors);
    validateRequiredField(handoff.scopeElement, "Notes", handoff.notes, errors);

    if (!allowedHandoffStatuses.has(handoff.handoffStatus)) {
      errors.push(`${handoff.scopeElement} has invalid Layer 3 handoff status: ${handoff.handoffStatus || "(blank)"}`);
    }

    for (const classificationId of splitIds(handoff.requiredClassificationIds)) {
      if (!classificationsById.has(classificationId)) {
        errors.push(`${handoff.scopeElement} references unknown classification ${classificationId}`);
      }
    }

    if (handoff.handoffStatus === "ready-for-story-breakdown") {
      const blockedClassification = splitIds(handoff.requiredClassificationIds).find((classificationId) => {
        const classification = classificationsById.get(classificationId);
        return classification?.classification === "blocked" || classification?.decisionStatus === "blocked";
      });

      if (blockedClassification) {
        errors.push(`${handoff.scopeElement} is ready while ${blockedClassification} is blocked`);
      }
    }
  }

  return {
    status: errors.length === 0 ? "PASS" : "BLOCKED",
    errors,
  };
}

function hasApprovedException(value: string): boolean {
  return value.trim().toLowerCase().startsWith("approved:");
}

function validateRequiredField(id: string, fieldName: string, value: string, errors: string[]): void {
  const trimmed = value.trim();
  if (!trimmed) {
    errors.push(`${id} missing ${fieldName}`);
    return;
  }

  if (trimmed.toLowerCase() === "tbd") {
    errors.push(`${id} has TBD ${fieldName}`);
  }
}

function validateVaguePhrases(content: string, errors: string[]): void {
  const lowered = content.toLowerCase();
  for (const phrase of vaguePhrases) {
    if (lowered.includes(phrase)) {
      errors.push(`vague phrase found: ${phrase}`);
    }
  }
}

function parseClassificationRows(content: string): ClassificationRow[] {
  return parseTableRows(section(content, "## Architecture Classification")).map((cells) => ({
    classificationId: cells[0] ?? "",
    scopeElement: cells[1] ?? "",
    classification: cells[2] ?? "",
    ownerSeam: cells[3] ?? "",
    decisionStatus: cells[4] ?? "",
    rationale: cells[5] ?? "",
    downstreamSignal: cells[6] ?? "",
  }));
}

function parseSignalCheckRows(content: string): SignalCheckRow[] {
  return parseTableRows(section(content, "## Deterministic Signal Checks")).map((cells) => ({
    triggerId: cells[0] ?? "",
    triggerQuestion: cells[1] ?? "",
    triggerStatus: cells[2] ?? "",
    evidence: cells[3] ?? "",
    requiredClassification: cells[4] ?? "",
    requiredTaskType: cells[5] ?? "",
    exceptionDecision: cells[6] ?? "",
  }));
}

function parseHandoffRows(content: string): HandoffRow[] {
  return parseTableRows(section(content, "## Layer 3 Handoff")).map((cells) => ({
    scopeElement: cells[0] ?? "",
    handoffStatus: cells[1] ?? "",
    requiredClassificationIds: cells[2] ?? "",
    notes: cells[3] ?? "",
  }));
}

function section(content: string, heading: string): string {
  const start = content.indexOf(heading);
  if (start === -1) {
    return "";
  }

  const rest = content.slice(start + heading.length);
  const next = rest.search(/\n##\s/);
  return next === -1 ? rest : rest.slice(0, next);
}

function parseTableRows(sectionContent: string): string[][] {
  return sectionContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"))
    .map((line) => line.slice(1, -1).split("|").map((cell) => cell.trim()))
    .filter((cells) => {
      const first = cells[0] ?? "";
      return (
        first !== "---" &&
        !first.startsWith("---") &&
        !first.includes("Classification ID") &&
        !first.includes("Trigger ID") &&
        !first.includes("Story Scope Element")
      );
    });
}

function splitIds(value: string): string[] {
  return value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function main(): void {
  const packetArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));

  if (!packetArg) {
    console.error("Usage: npm run technical-steering:validate -- <packet-path>");
    process.exit(1);
  }

  const packetPath = path.resolve(process.cwd(), packetArg);

  if (!existsSync(packetPath)) {
    console.error(`Packet not found: ${packetPath}`);
    process.exit(1);
  }

  const result = validateTechnicalSteeringContent(readFileSync(packetPath, "utf8"));

  console.log("Technical Steering Validation");
  console.log(`- status: ${result.status}`);
  console.log(`- packet: ${packetPath}`);

  if (result.errors.length > 0) {
    console.log("- blockers:");
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
