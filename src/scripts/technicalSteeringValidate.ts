import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  frontendActorScopes,
  frontendArtifactBlockingPostures,
  frontendArtifactObligationActions,
  frontendAuthorityTransitionPostures,
  frontendBrowserSecurityAreas,
  frontendDesignSystemPrerequisites,
  frontendImplementationReadiness,
  frontendLocatorTypes,
  frontendMaterializationModels,
  frontendRouteFamilies,
  frontendRouteVisibilities,
  frontendRuntimeShapes,
  frontendShellGovernancePostures,
  frontendSourcePlacements,
  frontendStateOwners,
  frontendSurfaceClasses,
  frontendTopologyAuthorities,
  frontendTopologyClasses,
} from "./featureCompiler/contracts";

const requiredHeadings = [
  "# Technical Steering",
  "## Status",
  "## Product Handoff",
  "## Architecture Classification",
  "## Architecture Risk Flags",
  "## Frontend Architecture Classification",
  "## Browser Security Posture",
  "## Artifact Obligations",
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
const allowedFrontendRouteFamilies: Set<string> = new Set(frontendRouteFamilies);
const allowedFrontendRuntimeShapes: Set<string> = new Set(frontendRuntimeShapes);
const allowedFrontendSurfaceClasses: Set<string> = new Set(frontendSurfaceClasses);
const allowedFrontendTopologyClasses: Set<string> = new Set(frontendTopologyClasses);
const allowedFrontendLocatorTypes: Set<string> = new Set(frontendLocatorTypes);
const allowedFrontendTopologyAuthorities: Set<string> = new Set(frontendTopologyAuthorities);
const allowedFrontendAuthorityTransitionPostures: Set<string> = new Set(frontendAuthorityTransitionPostures);
const allowedFrontendStateOwners: Set<string> = new Set(frontendStateOwners);
const allowedFrontendShellGovernancePostures: Set<string> = new Set(frontendShellGovernancePostures);
const allowedFrontendDesignSystemPrerequisites: Set<string> = new Set(frontendDesignSystemPrerequisites);
const allowedFrontendMaterializationModels: Set<string> = new Set(frontendMaterializationModels);
const allowedFrontendRouteVisibilities: Set<string> = new Set(frontendRouteVisibilities);
const allowedFrontendActorScopes: Set<string> = new Set(frontendActorScopes);
const allowedFrontendImplementationReadiness: Set<string> = new Set(frontendImplementationReadiness);
const allowedFrontendSourcePlacements: Set<string> = new Set(frontendSourcePlacements);
const allowedFrontendBrowserSecurityAreas: Set<string> = new Set(frontendBrowserSecurityAreas);
const allowedFrontendArtifactObligationActions: Set<string> = new Set(frontendArtifactObligationActions);
const allowedFrontendArtifactBlockingPostures: Set<string> = new Set(frontendArtifactBlockingPostures);

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

type FrontendClassificationRow = {
  scopeElement: string;
  routeFamily: string;
  productModule: string;
  journeyGroup: string;
  routeVisibility: string;
  actorScope: string;
  runtimeShape: string;
  surfaceClass: string;
  topologyClass: string;
  locatorType: string;
  canonicalLocator: string;
  compatibilityLocators: string;
  topologyAuthority: string;
  targetTopologyAuthority: string;
  authorityTransitionPosture: string;
  stateOwner: string;
  shellGovernance: string;
  designSystemPrerequisite: string;
  materializationModel: string;
  sourcePlacement: string;
  implementationReadiness: string;
  evidence: string;
};

type BrowserSecurityPostureRow = {
  securityArea: string;
  present: string;
  decisionEvidence: string;
  requiredLayer4Signal: string;
  stopIfMissing: string;
};

type ArtifactObligationRow = {
  artifact: string;
  requiredAction: string;
  ownerLayer: string;
  blocksHandoff: string;
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
  const frontendClassifications = parseFrontendClassificationRows(content);
  const browserSecurityPosture = parseBrowserSecurityPostureRows(content);
  const artifactObligations = parseArtifactObligationRows(content);

  if (classifications.length === 0) {
    errors.push("Architecture Classification has no rows");
  }

  if (signalChecks.length === 0) {
    errors.push("Deterministic Signal Checks has no rows");
  }

  const classificationsById = new Map(classifications.map((row) => [row.classificationId, row]));
  const signalChecksById = new Map(signalChecks.map((row) => [row.triggerId, row]));
  const frontendAffectingSignal = signalChecks.some(
    (signal) =>
      (signal.triggerId === "TSIG-GOVERNED-FRONTEND" || signal.triggerId === "TSIG-FRONTEND-SURFACE") &&
      (signal.triggerStatus === "yes" || signal.triggerStatus === "blocked"),
  );

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

  validateFrontendArchitectureClassification(frontendClassifications, frontendAffectingSignal, errors);
  validateBrowserSecurityPosture(browserSecurityPosture, frontendAffectingSignal, errors);
  validateArtifactObligations(artifactObligations, frontendAffectingSignal, browserSecurityPosture, errors);

  return {
    status: errors.length === 0 ? "PASS" : "BLOCKED",
    errors,
  };
}

function validateFrontendArchitectureClassification(
  rows: FrontendClassificationRow[],
  frontendAffectingSignal: boolean,
  errors: string[],
): void {
  if (frontendAffectingSignal && rows.length === 0) {
    errors.push("frontend-affecting steering requires Frontend Architecture Classification rows");
    return;
  }

  for (const row of rows) {
    validateRequiredField(row.scopeElement, "Product Module", row.productModule, errors);
    validateRequiredField(row.scopeElement, "Journey Group", row.journeyGroup, errors);
    validateRequiredField(row.scopeElement, "Canonical Locator", row.canonicalLocator, errors);
    validateRequiredField(row.scopeElement, "Compatibility Locators", row.compatibilityLocators, errors);
    validateRequiredField(row.scopeElement, "Evidence", row.evidence, errors);

    validateAllowedValue(row.scopeElement, "Route Family", row.routeFamily, allowedFrontendRouteFamilies, errors);
    validateAllowedValue(row.scopeElement, "Route Visibility", row.routeVisibility, allowedFrontendRouteVisibilities, errors);
    validateAllowedValue(row.scopeElement, "Actor Scope", row.actorScope, allowedFrontendActorScopes, errors);
    validateAllowedValue(row.scopeElement, "Runtime Shape", row.runtimeShape, allowedFrontendRuntimeShapes, errors);
    validateAllowedValue(row.scopeElement, "Surface Class", row.surfaceClass, allowedFrontendSurfaceClasses, errors);
    validateAllowedValue(row.scopeElement, "Topology Class", row.topologyClass, allowedFrontendTopologyClasses, errors);
    validateAllowedValue(row.scopeElement, "Locator Type", row.locatorType, allowedFrontendLocatorTypes, errors);
    validateAllowedValue(
      row.scopeElement,
      "Topology Authority",
      row.topologyAuthority,
      allowedFrontendTopologyAuthorities,
      errors,
    );
    validateAllowedValue(
      row.scopeElement,
      "Target Topology Authority",
      row.targetTopologyAuthority,
      allowedFrontendTopologyAuthorities,
      errors,
    );
    validateAllowedValue(
      row.scopeElement,
      "Authority Transition Posture",
      row.authorityTransitionPosture,
      allowedFrontendAuthorityTransitionPostures,
      errors,
    );
    validateAllowedValue(row.scopeElement, "State Owner", row.stateOwner, allowedFrontendStateOwners, errors);
    validateAllowedValue(
      row.scopeElement,
      "Shell Governance",
      row.shellGovernance,
      allowedFrontendShellGovernancePostures,
      errors,
    );
    validateAllowedValue(
      row.scopeElement,
      "Design-System Prerequisite",
      row.designSystemPrerequisite,
      allowedFrontendDesignSystemPrerequisites,
      errors,
    );
    validateAllowedValue(
      row.scopeElement,
      "Materialization Model",
      row.materializationModel,
      allowedFrontendMaterializationModels,
      errors,
    );
    validateAllowedValue(
      row.scopeElement,
      "Source Placement",
      row.sourcePlacement,
      allowedFrontendSourcePlacements,
      errors,
    );
    validateAllowedValue(
      row.scopeElement,
      "Implementation Readiness",
      row.implementationReadiness,
      allowedFrontendImplementationReadiness,
      errors,
    );

    if (row.implementationReadiness.startsWith("blocked-on")) {
      errors.push(`${row.scopeElement} frontend implementation readiness is ${row.implementationReadiness}`);
    }
  }
}

function validateBrowserSecurityPosture(
  rows: BrowserSecurityPostureRow[],
  frontendAffectingSignal: boolean,
  errors: string[],
): void {
  if (frontendAffectingSignal && rows.length === 0) {
    errors.push("frontend-affecting steering requires Browser Security Posture rows");
    return;
  }

  for (const row of rows) {
    validateAllowedValue(row.securityArea, "Security Area", row.securityArea, allowedFrontendBrowserSecurityAreas, errors);
    validateAllowedValue(row.securityArea, "Present", row.present, allowedTriggerStatuses, errors);
    validateRequiredField(row.securityArea, "Layer 2 Decision / Evidence", row.decisionEvidence, errors);
    validateRequiredField(row.securityArea, "Required Layer 4 Signal", row.requiredLayer4Signal, errors);
    validateAllowedValue(row.securityArea, "Stop If Missing", row.stopIfMissing, allowedFrontendArtifactBlockingPostures, errors);

    if (row.present === "blocked") {
      errors.push(`${row.securityArea} browser security posture is blocked`);
    }

    if (row.present === "yes" && row.decisionEvidence.trim().toLowerCase() === "not-applicable") {
      errors.push(`${row.securityArea} browser security posture is yes without a concrete decision`);
    }
  }
}

function validateArtifactObligations(
  rows: ArtifactObligationRow[],
  frontendAffectingSignal: boolean,
  browserSecurityRows: BrowserSecurityPostureRow[],
  errors: string[],
): void {
  if (frontendAffectingSignal && rows.length === 0) {
    errors.push("frontend-affecting steering requires Artifact Obligations rows");
    return;
  }

  for (const row of rows) {
    validateRequiredField(row.artifact, "Artifact", row.artifact, errors);
    validateRequiredField(row.artifact, "Owner Layer", row.ownerLayer, errors);
    validateRequiredField(row.artifact, "Notes", row.notes, errors);
    validateAllowedValue(
      row.artifact,
      "Required Action",
      row.requiredAction,
      allowedFrontendArtifactObligationActions,
      errors,
    );
    validateAllowedValue(
      row.artifact,
      "Blocks Handoff",
      row.blocksHandoff,
      allowedFrontendArtifactBlockingPostures,
      errors,
    );
  }

  const hasAssetDelivery = browserSecurityRows.some((row) => row.securityArea === "asset-delivery" && row.present === "yes");
  if (hasAssetDelivery) {
    const hasAssetDecisionRecord = rows.some((row) =>
      `${row.artifact} ${row.notes}`.toLowerCase().includes("asset consumer decision record") &&
      row.blocksHandoff === "yes",
    );
    if (!hasAssetDecisionRecord) {
      errors.push("asset-delivery browser security posture requires a blocking asset consumer decision record obligation");
    }
  }
}

function validateAllowedValue(
  id: string,
  fieldName: string,
  value: string,
  allowedValues: Set<string>,
  errors: string[],
): void {
  if (!allowedValues.has(value)) {
    errors.push(`${id} has invalid ${fieldName}: ${value || "(blank)"}`);
  }
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

function parseFrontendClassificationRows(content: string): FrontendClassificationRow[] {
  return parseTableRows(section(content, "## Frontend Architecture Classification")).map((cells) => ({
    scopeElement: cells[0] ?? "",
    routeFamily: cells[1] ?? "",
    productModule: cells[2] ?? "",
    journeyGroup: cells[3] ?? "",
    routeVisibility: cells[4] ?? "",
    actorScope: cells[5] ?? "",
    runtimeShape: cells[6] ?? "",
    surfaceClass: cells[7] ?? "",
    topologyClass: cells[8] ?? "",
    locatorType: cells[9] ?? "",
    canonicalLocator: cells[10] ?? "",
    compatibilityLocators: cells[11] ?? "",
    topologyAuthority: cells[12] ?? "",
    targetTopologyAuthority: cells[13] ?? "",
    authorityTransitionPosture: cells[14] ?? "",
    stateOwner: cells[15] ?? "",
    shellGovernance: cells[16] ?? "",
    designSystemPrerequisite: cells[17] ?? "",
    materializationModel: cells[18] ?? "",
    sourcePlacement: cells[19] ?? "",
    implementationReadiness: cells[20] ?? "",
    evidence: cells[21] ?? "",
  }));
}

function parseBrowserSecurityPostureRows(content: string): BrowserSecurityPostureRow[] {
  return parseTableRows(section(content, "## Browser Security Posture")).map((cells) => ({
    securityArea: cells[0] ?? "",
    present: cells[1] ?? "",
    decisionEvidence: cells[2] ?? "",
    requiredLayer4Signal: cells[3] ?? "",
    stopIfMissing: cells[4] ?? "",
  }));
}

function parseArtifactObligationRows(content: string): ArtifactObligationRow[] {
  return parseTableRows(section(content, "## Artifact Obligations")).map((cells) => ({
    artifact: cells[0] ?? "",
    requiredAction: cells[1] ?? "",
    ownerLayer: cells[2] ?? "",
    blocksHandoff: cells[3] ?? "",
    notes: cells[4] ?? "",
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
        !first.includes("Story Scope Element") &&
        !first.includes("Scope Element") &&
        !first.includes("Security Area") &&
        first !== "Artifact"
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
