import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  frontendActorScopes,
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
  "# Story Breakdown",
  "## Status",
  "## Handoff Validation",
  "## Steering Architecture Classification Snapshot",
  "## Frontend Architecture Classification Snapshot",
  "## Browser Security Posture Snapshot",
  "## Task-Type Signal Matrix",
  "## Epic Summary",
  "## Story Queue",
  "## Acceptance Criteria",
  "## Capability Mapping",
  "## Dependency And Seam Map",
  "## Story Test Input Matrix",
  "## Acceptance Criteria To Test Obligation Matrix",
  "## Follow-Up Decision Questions",
  "## Layer 3 Unblock Queue",
  "## Artifact Ledger",
  "## Layer 4 Handoff",
];

const allowedStoryStatuses = new Set([
  "draft",
  "blocked",
  "needs-capability-matrix",
  "needs-prd-refinement",
  "ready-for-task-breakdown",
  "superseded",
]);

const allowedValueTypes = new Set(["user-value", "system-value", "harness-value"]);

const allowedDeliveryShapes = new Set([
  "backend",
  "frontend",
  "vertical-slice",
  "docs-artifact",
  "test-only",
  "test-suite-alignment",
  "refactor-first",
  "architecture-foundation",
  "standards-compliance",
]);

const allowedArchitectureClassifications = new Set([
  "feature-local",
  "feature-public-seam",
  "platform-seam",
  "shared-lib-candidate",
  "design-system-seam",
  "architecture-foundation-required",
  "blocked",
]);

const allowedTaskSignalPresence = new Set(["yes", "no", "blocked"]);
const frontendTaskTypes = new Set(["frontend", "design-system", "vertical-slice"]);
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
const allowedBrowserSecurityPresence = new Set(["yes", "no", "blocked"]);
const allowedYesNo = new Set(["yes", "no"]);

const allowedUnblockTypes = new Set([
  "human-decision",
  "artifact-creation",
  "technical-steering-revisit",
  "design-system-governance",
  "source-of-truth-inspection",
  "capability-matrix-required",
  "prd-required",
  "api-contract-required",
  "permission-mapping-required",
  "data-dictionary-required",
]);

const allowedUnblockStatuses = new Set([
  "needs-human-answer",
  "ready-to-create-artifact",
  "blocked-on-steering",
  "blocked-on-source-truth",
  "resolved",
  "deferred-with-owner",
]);

const allowedProofLayers = new Set([
  "source-level",
  "contract-level",
  "persistence-level",
  "runtime-api",
  "rendered-browser",
  "human-visible-parity",
  "deployment-runtime-process",
  "mixed",
]);

const vaguePhrases = [
  "implement feature",
  "wire up",
  "clean up",
  "handle errors",
  "add tests",
  "update docs",
  "as needed",
  "etc.",
];

export type StoryBreakdownValidationResult = {
  status: "PASS" | "BLOCKED";
  errors: string[];
};

type StoryRow = {
  storyId: string;
  status: string;
  valueType: string;
  deliveryShape: string;
  title: string;
  jobToBeDone: string;
  perspective: string;
  outcome: string;
};

type AcceptanceCriterionRow = {
  acId: string;
  storyId: string;
  criterion: string;
  proofLayer: string;
  requiredTestFamilies: string;
  requiredArtifactObligations: string;
};

type CapabilityRow = {
  storyId: string;
  acId: string;
  capabilityRows: string;
  posture: string;
};

type FrontendClassificationSnapshotRow = {
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

type BrowserSecurityPostureSnapshotRow = {
  securityArea: string;
  present: string;
  decisionEvidence: string;
  requiredLayer4Signal: string;
  stopIfMissing: string;
};

type DependencyRow = {
  dependencyId: string;
  neededBy: string;
  provider: string;
  dependencyType: string;
  contractProof: string;
  integrationTestObligation: string;
};

type StoryTestInputRow = {
  storyId: string;
  actors: string;
  permissions: string;
  actorStates: string;
  objectStates: string;
  values: string;
  transitions: string;
  systemErrors: string;
  nfrs: string;
};

type BlockerRow = {
  blockerId: string;
  blocksStory: string;
  blockerType: string;
  reason: string;
  requiredOutput: string;
  stopCondition: string;
};

type FollowUpDecisionQuestionRow = {
  questionId: string;
  trigger: string;
  question: string;
  requiredBeforeLayer3Completion: string;
  resolution: string;
};

type Layer3UnblockRow = {
  unblockId: string;
  blocks: string;
  blockerSource: string;
  unblockType: string;
  humanDecisionNeeded: string;
  optionsOrSafeDefaults: string;
  recommendedNextAction: string;
  canAutoCreateArtifact: string;
  status: string;
};

type ArtifactRow = {
  artifactId: string;
  storyId: string;
  artifactType: string;
  requiredAction: string;
  owner: string;
  blocksTaskBreakdown: string;
};

type SteeringClassificationRow = {
  classificationId: string;
  scopeElement: string;
  classification: string;
  ownerSeam: string;
  decisionStatus: string;
  downstreamSignal: string;
};

type TaskTypeSignalRow = {
  storyId: string;
  signal: string;
  present: string;
  evidence: string;
  impliedTaskType: string;
};

export function validateStoryBreakdownContent(content: string): StoryBreakdownValidationResult {
  const errors: string[] = [];

  for (const heading of requiredHeadings) {
    if (!content.includes(heading)) {
      errors.push(`missing heading: ${heading}`);
    }
  }

  validateArchitectureInvention(content, errors);

  const stories = parseStoryRows(content);
  const acceptanceCriteria = parseAcceptanceCriteriaRows(content);
  const capabilities = parseCapabilityRows(content);
  const dependencies = parseDependencyRows(content);
  const testInputs = parseStoryTestInputRows(content);
  const blockers = parseBlockerRows(content);
  const followUpQuestions = parseFollowUpDecisionQuestionRows(content);
  const unblockRows = parseLayer3UnblockRows(content);
  const artifacts = parseArtifactRows(content);
  const steeringClassifications = parseSteeringClassificationRows(content);
  const frontendClassificationSnapshots = parseFrontendClassificationSnapshotRows(content);
  const browserSecurityPostureSnapshots = parseBrowserSecurityPostureSnapshotRows(content);
  const taskTypeSignals = parseTaskTypeSignalRows(content);
  const packetStatus = parsePacketStatus(content);

  if (stories.length === 0) {
    errors.push("Story Queue has no story rows");
  }

  const storiesById = new Map(stories.map((story) => [story.storyId, story]));
  const acByStory = groupBy(acceptanceCriteria, (row) => row.storyId);
  const capabilityByAc = groupBy(capabilities, (row) => row.acId);
  const dependencyByStoryOrAc = dependencies;
  const testInputsByStory = new Map(testInputs.map((row) => [row.storyId, row]));
  const taskTypeSignalsByStory = groupBy(taskTypeSignals, (row) => row.storyId);

  for (const story of stories) {
    validateStoryRow(story, errors);

    const storyAcs = acByStory.get(story.storyId) ?? [];
    if (story.status !== "superseded" && storyAcs.length === 0) {
      errors.push(`${story.storyId} has no acceptance criteria`);
    }

    if (story.status === "ready-for-task-breakdown") {
      const testInput = testInputsByStory.get(story.storyId);
      if (!testInput) {
        errors.push(`${story.storyId} is ready but missing Story Test Input Matrix row`);
      } else {
        validateStoryTestInputRow(testInput, errors);
      }

      if (!dependencyByStoryOrAc.some((row) => row.neededBy.includes(story.storyId))) {
        errors.push(`${story.storyId} is ready but has no dependency or seam mapping`);
      }

      if ((taskTypeSignalsByStory.get(story.storyId) ?? []).length === 0) {
        errors.push(`${story.storyId} is ready but has no task-type signal rows`);
      }
    }
  }

  for (const classification of steeringClassifications) {
    validateRequiredField(classification.classificationId, "Scope Element", classification.scopeElement, errors);
    validateRequiredField(classification.classificationId, "Owner / Seam", classification.ownerSeam, errors);
    validateRequiredField(classification.classificationId, "Decision Status", classification.decisionStatus, errors);
    validateRequiredField(classification.classificationId, "Required Downstream Signal", classification.downstreamSignal, errors);

    if (!allowedArchitectureClassifications.has(classification.classification)) {
      errors.push(
        `${classification.classificationId} has invalid architecture classification: ${
          classification.classification || "(blank)"
        }`,
      );
    }

    if (classification.classification === "blocked" || classification.decisionStatus === "blocked") {
      errors.push(`${classification.classificationId} steering architecture classification is blocked`);
    }
  }

  for (const signal of taskTypeSignals) {
    if (!storiesById.has(signal.storyId)) {
      errors.push(`${signal.signal} references unknown story ${signal.storyId}`);
    }

    validateRequiredField(signal.storyId, "Signal", signal.signal, errors);
    validateRequiredField(signal.storyId, "Evidence", signal.evidence, errors);
    validateRequiredField(signal.storyId, "Implied Task Type", signal.impliedTaskType, errors);

    if (!allowedTaskSignalPresence.has(signal.present)) {
      errors.push(`${signal.storyId} has invalid task signal presence: ${signal.present || "(blank)"}`);
    }
  }

  validateFrontendClassificationSnapshots(frontendClassificationSnapshots, taskTypeSignals, errors);
  validateBrowserSecurityPostureSnapshots(browserSecurityPostureSnapshots, taskTypeSignals, errors);

  for (const ac of acceptanceCriteria) {
    if (!storiesById.has(ac.storyId)) {
      errors.push(`${ac.acId} references unknown story ${ac.storyId}`);
    }

    validateRequiredField(ac.acId, "Acceptance Criterion", ac.criterion, errors);
    validateRequiredField(ac.acId, "Required Test Families", ac.requiredTestFamilies, errors);
    validateRequiredField(ac.acId, "Required Artifact Obligations", ac.requiredArtifactObligations, errors);

    if (!allowedProofLayers.has(ac.proofLayer)) {
      errors.push(`${ac.acId} has invalid or missing proof layer: ${ac.proofLayer || "(blank)"}`);
    }

    if (!capabilityByAc.has(ac.acId)) {
      errors.push(`${ac.acId} has no capability mapping row`);
    }
  }

  for (const capability of capabilities) {
    if (capability.posture === "blocked") {
      errors.push(`${capability.acId} capability mapping is blocked`);
    }

    if (capability.posture === "existing-approved" || capability.posture === "create-or-refresh-required") {
      validateRequiredField(capability.acId, "Capability Matrix Row(s)", capability.capabilityRows, errors);
    }
  }

  for (const dependency of dependencies) {
    validateRequiredField(dependency.dependencyId, "Provider Feature Or Seam", dependency.provider, errors);
    validateRequiredField(dependency.dependencyId, "Required Contract Proof", dependency.contractProof, errors);
    validateRequiredField(
      dependency.dependencyId,
      "Integration Test Obligation",
      dependency.integrationTestObligation,
      errors,
    );
  }

  validateFollowUpDecisionQuestions(stories, blockers, followUpQuestions, packetStatus, errors);
  validateLayer3UnblockQueue(stories, followUpQuestions, unblockRows, artifacts, errors);

  validateVaguePhrases(content, errors);

  return {
    status: errors.length === 0 ? "PASS" : "BLOCKED",
    errors,
  };
}

function validateLayer3UnblockQueue(
  stories: StoryRow[],
  followUpQuestions: FollowUpDecisionQuestionRow[],
  unblockRows: Layer3UnblockRow[],
  artifacts: ArtifactRow[],
  errors: string[],
): void {
  const hasReadyStory = stories.some((story) => story.status === "ready-for-task-breakdown");
  const hasBlockedStory = stories.some((story) =>
    story.status === "blocked" ||
    story.status === "needs-capability-matrix" ||
    story.status === "needs-prd-refinement",
  );

  if (!hasReadyStory && hasBlockedStory && unblockRows.length === 0) {
    errors.push("Layer 3 Unblock Queue must include at least one row when no stories are ready for Task Breakdown");
  }

  const unblockSourceText = unblockRows.map((row) => row.blockerSource).join(" ");

  for (const question of followUpQuestions) {
    const requiredValue = question.requiredBeforeLayer3Completion.trim().toLowerCase();
    if (requiredValue === "yes" && isUnresolvedDecision(question.resolution)) {
      if (!unblockSourceText.includes(question.questionId)) {
        errors.push(`${question.questionId} unresolved required decision is missing a Layer 3 Unblock Queue row`);
      }
    }
  }

  for (const artifact of artifacts) {
    if (artifact.blocksTaskBreakdown.trim().toLowerCase() === "yes") {
      if (!unblockSourceText.includes(artifact.artifactId)) {
        errors.push(`${artifact.artifactId} blocking artifact is missing a Layer 3 Unblock Queue row`);
      }
    }
  }

  for (const row of unblockRows) {
    validateRequiredField(row.unblockId, "Blocks Story / AC", row.blocks, errors);
    validateRequiredField(row.unblockId, "Blocker Source", row.blockerSource, errors);
    validateRequiredField(row.unblockId, "Human Decision Needed", row.humanDecisionNeeded, errors);
    validateRequiredField(row.unblockId, "Options / Safe Defaults", row.optionsOrSafeDefaults, errors);
    validateRequiredField(row.unblockId, "Recommended Next Action", row.recommendedNextAction, errors);
    validateRequiredField(row.unblockId, "Can Auto-Create Artifact", row.canAutoCreateArtifact, errors);

    if (!allowedUnblockTypes.has(row.unblockType)) {
      errors.push(`${row.unblockId} has invalid unblock type: ${row.unblockType || "(blank)"}`);
    }

    if (!allowedUnblockStatuses.has(row.status)) {
      errors.push(`${row.unblockId} has invalid unblock status: ${row.status || "(blank)"}`);
    }

    const canAutoCreateArtifact = row.canAutoCreateArtifact.trim().toLowerCase();
    if (canAutoCreateArtifact !== "yes" && canAutoCreateArtifact !== "no") {
      errors.push(`${row.unblockId} has invalid Can Auto-Create Artifact: ${row.canAutoCreateArtifact || "(blank)"}`);
    }

    if (row.status === "needs-human-answer") {
      if (!row.humanDecisionNeeded.includes("?")) {
        errors.push(`${row.unblockId} needs-human-answer must include a concrete question`);
      }

      if (!row.optionsOrSafeDefaults.includes(";") && !row.optionsOrSafeDefaults.toLowerCase().includes("no safe default")) {
        errors.push(`${row.unblockId} needs-human-answer must list options or explain no safe default`);
      }
    }
  }
}

function parsePacketStatus(content: string): string {
  const match = content.match(/- Packet status:\s*\n\s*`?([^`\n]+)`?/);
  return match?.[1]?.trim() ?? "";
}

function validateArchitectureInvention(content: string, errors: string[]): void {
  const match = content.match(/- Architecture invention check:\s*\n\s*`?([^`\n]+)`?/);
  const value = match?.[1]?.trim() ?? "";

  if (value === "proposes-new-architecture" || value === "blocked") {
    errors.push(`Architecture invention check is ${value}`);
  }
}

function validateStoryRow(story: StoryRow, errors: string[]): void {
  if (!allowedStoryStatuses.has(story.status)) {
    errors.push(`${story.storyId} has invalid status: ${story.status || "(blank)"}`);
  }

  if (!allowedValueTypes.has(story.valueType)) {
    errors.push(`${story.storyId} has invalid value type: ${story.valueType || "(blank)"}`);
  }

  if (!allowedDeliveryShapes.has(story.deliveryShape)) {
    errors.push(`${story.storyId} has invalid delivery shape: ${story.deliveryShape || "(blank)"}`);
  }

  validateRequiredField(story.storyId, "Title", story.title, errors);
  validateRequiredField(story.storyId, "Job To Be Done", story.jobToBeDone, errors);
  validateRequiredField(story.storyId, "Actor / System Perspective", story.perspective, errors);
  validateRequiredField(story.storyId, "Outcome", story.outcome, errors);
}

function validateStoryTestInputRow(row: StoryTestInputRow, errors: string[]): void {
  validateRequiredField(row.storyId, "Actors", row.actors, errors);
  validateRequiredField(row.storyId, "Actor Permissions", row.permissions, errors);
  validateRequiredField(row.storyId, "Actor States", row.actorStates, errors);
  validateRequiredField(row.storyId, "Object States", row.objectStates, errors);
  validateRequiredField(row.storyId, "Value Types / Validation Rules", row.values, errors);
  validateRequiredField(row.storyId, "Lifecycle Transitions", row.transitions, errors);
  validateRequiredField(row.storyId, "System Errors", row.systemErrors, errors);
  validateRequiredField(row.storyId, "NFRs", row.nfrs, errors);
}

function validateFollowUpDecisionQuestions(
  stories: StoryRow[],
  blockers: BlockerRow[],
  followUpQuestions: FollowUpDecisionQuestionRow[],
  packetStatus: string,
  errors: string[],
): void {
  const decisionSensitiveStories = stories.filter((story) =>
    story.status === "blocked" || story.status === "needs-prd-refinement",
  );
  const requiresQuestions = blockers.length > 0 || decisionSensitiveStories.length > 0;

  if (requiresQuestions && followUpQuestions.length === 0) {
    errors.push(
      "Follow-Up Decision Questions must include at least one row when blockers or PRD-refinement story statuses are present",
    );
  }

  for (const question of followUpQuestions) {
    validateRequiredField(question.questionId, "Trigger / Blocker", question.trigger, errors);
    validateRequiredField(question.questionId, "Question", question.question, errors);
    validateRequiredField(
      question.questionId,
      "Required Before Layer 3 Completion",
      question.requiredBeforeLayer3Completion,
      errors,
    );
    validateRequiredField(question.questionId, "Resolution / Owner", question.resolution, errors);

    const requiredValue = question.requiredBeforeLayer3Completion.trim().toLowerCase();
    if (requiredValue !== "yes" && requiredValue !== "no") {
      errors.push(
        `${question.questionId} has invalid Required Before Layer 3 Completion: ${
          question.requiredBeforeLayer3Completion || "(blank)"
        }`,
      );
    }

    if (
      packetStatus === "ready-for-task-breakdown" &&
      requiredValue === "yes" &&
      isUnresolvedDecision(question.resolution)
    ) {
      errors.push(`${question.questionId} must be resolved before Layer 3 can be ready-for-task-breakdown`);
    }
  }
}

function isUnresolvedDecision(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    !normalized ||
    normalized === "unresolved" ||
    normalized === "pending" ||
    normalized === "open" ||
    normalized.includes("ask requester") ||
    normalized.includes("must ask") ||
    normalized.includes("needs answer") ||
    normalized.includes("not answered")
  );
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

function validateFrontendClassificationSnapshots(
  rows: FrontendClassificationSnapshotRow[],
  taskTypeSignals: TaskTypeSignalRow[],
  errors: string[],
): void {
  const frontendAffectingSignal = taskTypeSignals.some(
    (signal) => signal.present === "yes" && frontendTaskTypes.has(signal.impliedTaskType),
  );

  if (frontendAffectingSignal && rows.length === 0) {
    errors.push("frontend-affecting stories require Frontend Architecture Classification Snapshot rows");
    return;
  }

  for (const row of rows) {
    validateRequiredField(row.scopeElement, "Frontend Scope Element", row.scopeElement, errors);
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
    validateAllowedValue(row.scopeElement, "Topology Authority", row.topologyAuthority, allowedFrontendTopologyAuthorities, errors);
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
    validateAllowedValue(row.scopeElement, "Shell Governance", row.shellGovernance, allowedFrontendShellGovernancePostures, errors);
    validateAllowedValue(
      row.scopeElement,
      "Design-System Prerequisite",
      row.designSystemPrerequisite,
      allowedFrontendDesignSystemPrerequisites,
      errors,
    );
    validateAllowedValue(row.scopeElement, "Materialization Model", row.materializationModel, allowedFrontendMaterializationModels, errors);
    validateAllowedValue(row.scopeElement, "Source Placement", row.sourcePlacement, allowedFrontendSourcePlacements, errors);
    validateAllowedValue(row.scopeElement, "Implementation Readiness", row.implementationReadiness, allowedFrontendImplementationReadiness, errors);

    if (row.implementationReadiness.startsWith("blocked-on")) {
      errors.push(`${row.scopeElement} frontend implementation readiness is ${row.implementationReadiness}`);
    }
  }
}

function validateBrowserSecurityPostureSnapshots(
  rows: BrowserSecurityPostureSnapshotRow[],
  taskTypeSignals: TaskTypeSignalRow[],
  errors: string[],
): void {
  const frontendAffectingSignal = taskTypeSignals.some(
    (signal) => signal.present === "yes" && frontendTaskTypes.has(signal.impliedTaskType),
  );

  if (frontendAffectingSignal && rows.length === 0) {
    errors.push("frontend-affecting stories require Browser Security Posture Snapshot rows");
    return;
  }

  for (const row of rows) {
    validateRequiredField(row.securityArea, "Security Area", row.securityArea, errors);
    validateRequiredField(row.securityArea, "Present", row.present, errors);
    validateRequiredField(row.securityArea, "Layer 2 Decision / Evidence", row.decisionEvidence, errors);
    validateRequiredField(row.securityArea, "Required Layer 4 Signal", row.requiredLayer4Signal, errors);
    validateRequiredField(row.securityArea, "Stop If Missing", row.stopIfMissing, errors);

    validateAllowedValue(row.securityArea, "Security Area", row.securityArea, allowedFrontendBrowserSecurityAreas, errors);
    validateAllowedValue(row.securityArea, "Present", row.present, allowedBrowserSecurityPresence, errors);
    validateAllowedValue(row.securityArea, "Stop If Missing", row.stopIfMissing, allowedYesNo, errors);

    if (row.present === "blocked") {
      errors.push(`${row.securityArea} browser security posture is blocked`);
    }
  }
}

function validateAllowedValue(id: string, fieldName: string, value: string, allowed: Set<string>, errors: string[]): void {
  if (!allowed.has(value)) {
    errors.push(`${id} has invalid ${fieldName}: ${value || "(blank)"}`);
  }
}

function parseStoryRows(content: string): StoryRow[] {
  return parseTableRows(section(content, "## Story Queue")).map((cells) => ({
    storyId: cells[0] ?? "",
    status: cells[1] ?? "",
    valueType: cells[2] ?? "",
    deliveryShape: cells[3] ?? "",
    title: cells[4] ?? "",
    jobToBeDone: cells[5] ?? "",
    perspective: cells[6] ?? "",
    outcome: cells[7] ?? "",
  }));
}

function parseAcceptanceCriteriaRows(content: string): AcceptanceCriterionRow[] {
  return parseTableRows(section(content, "## Acceptance Criteria")).map((cells) => ({
    acId: cells[0] ?? "",
    storyId: cells[1] ?? "",
    criterion: cells[2] ?? "",
    proofLayer: cells[3] ?? "",
    requiredTestFamilies: cells[4] ?? "",
    requiredArtifactObligations: cells[5] ?? "",
  }));
}

function parseCapabilityRows(content: string): CapabilityRow[] {
  return parseTableRows(section(content, "## Capability Mapping")).map((cells) => ({
    storyId: cells[0] ?? "",
    acId: cells[1] ?? "",
    capabilityRows: cells[2] ?? "",
    posture: cells[4] ?? "",
  }));
}

function parseDependencyRows(content: string): DependencyRow[] {
  return parseTableRows(section(content, "## Dependency And Seam Map")).map((cells) => ({
    dependencyId: cells[0] ?? "",
    neededBy: cells[1] ?? "",
    provider: cells[2] ?? "",
    dependencyType: cells[3] ?? "",
    contractProof: cells[5] ?? "",
    integrationTestObligation: cells[6] ?? "",
  }));
}

function parseStoryTestInputRows(content: string): StoryTestInputRow[] {
  return parseTableRows(section(content, "## Story Test Input Matrix")).map((cells) => ({
    storyId: cells[0] ?? "",
    actors: cells[1] ?? "",
    permissions: cells[2] ?? "",
    actorStates: cells[3] ?? "",
    objectStates: cells[4] ?? "",
    values: cells[5] ?? "",
    transitions: cells[6] ?? "",
    systemErrors: cells[7] ?? "",
    nfrs: cells[8] ?? "",
  }));
}

function parseBlockerRows(content: string): BlockerRow[] {
  return parseTableRows(section(content, "## Refactor-First And Architecture-Foundation Queue")).map((cells) => ({
    blockerId: cells[0] ?? "",
    blocksStory: cells[1] ?? "",
    blockerType: cells[2] ?? "",
    reason: cells[3] ?? "",
    requiredOutput: cells[4] ?? "",
    stopCondition: cells[5] ?? "",
  }));
}

function parseFollowUpDecisionQuestionRows(content: string): FollowUpDecisionQuestionRow[] {
  return parseTableRows(section(content, "## Follow-Up Decision Questions")).map((cells) => ({
    questionId: cells[0] ?? "",
    trigger: cells[1] ?? "",
    question: cells[2] ?? "",
    requiredBeforeLayer3Completion: cells[3] ?? "",
    resolution: cells[4] ?? "",
  }));
}

function parseLayer3UnblockRows(content: string): Layer3UnblockRow[] {
  return parseTableRows(section(content, "## Layer 3 Unblock Queue")).map((cells) => ({
    unblockId: cells[0] ?? "",
    blocks: cells[1] ?? "",
    blockerSource: cells[2] ?? "",
    unblockType: cells[3] ?? "",
    humanDecisionNeeded: cells[4] ?? "",
    optionsOrSafeDefaults: cells[5] ?? "",
    recommendedNextAction: cells[6] ?? "",
    canAutoCreateArtifact: cells[7] ?? "",
    status: cells[8] ?? "",
  }));
}

function parseArtifactRows(content: string): ArtifactRow[] {
  return parseTableRows(section(content, "## Artifact Ledger")).map((cells) => ({
    artifactId: cells[0] ?? "",
    storyId: cells[1] ?? "",
    artifactType: cells[2] ?? "",
    requiredAction: cells[3] ?? "",
    owner: cells[4] ?? "",
    blocksTaskBreakdown: cells[5] ?? "",
  }));
}

function parseSteeringClassificationRows(content: string): SteeringClassificationRow[] {
  return parseTableRows(section(content, "## Steering Architecture Classification Snapshot")).map((cells) => ({
    classificationId: cells[0] ?? "",
    scopeElement: cells[1] ?? "",
    classification: cells[2] ?? "",
    ownerSeam: cells[3] ?? "",
    decisionStatus: cells[4] ?? "",
    downstreamSignal: cells[5] ?? "",
  }));
}

function parseFrontendClassificationSnapshotRows(content: string): FrontendClassificationSnapshotRow[] {
  return parseTableRows(section(content, "## Frontend Architecture Classification Snapshot")).map((cells) => ({
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

function parseBrowserSecurityPostureSnapshotRows(content: string): BrowserSecurityPostureSnapshotRow[] {
  return parseTableRows(section(content, "## Browser Security Posture Snapshot")).map((cells) => ({
    securityArea: cells[0] ?? "",
    present: cells[1] ?? "",
    decisionEvidence: cells[2] ?? "",
    requiredLayer4Signal: cells[3] ?? "",
    stopIfMissing: cells[4] ?? "",
  }));
}

function parseTaskTypeSignalRows(content: string): TaskTypeSignalRow[] {
  return parseTableRows(section(content, "## Task-Type Signal Matrix")).map((cells) => ({
    storyId: cells[0] ?? "",
    signal: cells[1] ?? "",
    present: cells[2] ?? "",
    evidence: cells[3] ?? "",
    impliedTaskType: cells[4] ?? "",
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
      return first !== "---" && !first.startsWith("---") && !first.includes("Story ID") && !first.includes("AC ID") && !first.includes("Dependency ID") && !first.includes("Artifact ID") && !first.includes("Blocker ID") && !first.includes("Question ID") && !first.includes("Classification ID") && !first.includes("Unblock ID") && !first.includes("New Or Changed") && !first.includes("Scope Element") && !first.includes("Security Area");
    });
}

function groupBy<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    const existing = map.get(key) ?? [];
    existing.push(item);
    map.set(key, existing);
  }
  return map;
}

function main(): void {
  const packetArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));

  if (!packetArg) {
    console.error("Usage: npm run story-breakdown:validate -- <packet-path>");
    process.exit(1);
  }

  const packetPath = path.resolve(process.cwd(), packetArg);

  if (!existsSync(packetPath)) {
    console.error(`Packet not found: ${packetPath}`);
    process.exit(1);
  }

  const content = readFileSync(packetPath, "utf8");
  const result = validateStoryBreakdownContent(content);

  console.log("Story Breakdown Validation");
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
