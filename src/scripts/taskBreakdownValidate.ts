import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  layer4ApiContractClasses,
  layer4ArchitectureUpdateClasses,
  layer4BackendCapabilityFileStrategies,
  layer4BackendChangeClasses,
  layer4CapabilityCoverageStatuses,
  layer4DesignSystemSeamClasses,
  layer4DesignSystemSeamPostures,
  layer4DocsArtifactClasses,
  layer4FoundationBlockerTypes,
  layer4FoundationTaskTypes,
  layer4FrontendDesignSystemSubStandards,
  layer4FrontendPerformancePostures,
  layer4FrontendTaskTypes,
  layer4GuardrailEvidenceStatuses,
  layer4GuardrailReferenceByTaskType,
  layer4ImplementationTaskTypes,
  layer4MigrationPersistenceChangeTypes,
  layer4PlacementDecisions,
  layer4PermissionMappingClasses,
  layer4PlatformCompatibilityModes,
  layer4PlatformSeamKinds,
  layer4ProceedIfTriggerHitValues,
  layer4ProofSpecificityStatuses,
  layer4RequiredCheckIdsByTaskType,
  layer4StandardsUpdateClasses,
  layer4SharedCodePlacementCheckIds,
  layer4StopConditionTriggerTypes,
  layer4SuspiciousCoarseScopePhrases,
  layer4TaskGrainClassifications,
  layer4TaskStatuses,
  layer4TaskTypes,
  layer4WriteEnvelopeClasses,
  layer4WriteClasses,
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
  "# Task Breakdown",
  "## Status",
  "## Source Story Handoff",
  "## Steering Classification Reconciliation",
  "## Expected Task-Type Reconciliation",
  "## Selected Story Scope",
  "## Story Acceptance Criteria Snapshot",
  "## Story Capability And Artifact Snapshot",
  "## Task Queue",
  "## Task Size Guardrail",
  "## Decision Escalation / Stop Conditions",
  "## Exact Starting Context",
  "## Frontend Architecture Decision Reconciliation",
  "## Frontend Change Class Contract",
  "## Frontend / Design-System Sub-Standard",
  "## Frontend Performance Posture",
  "## Design-System Seam Contract",
  "## Design-System Seam Class Contract",
  "## Frontend Adoption Contract",
  "## Frontend Security Evidence",
  "## Frontend Permission Rendering Evidence",
  "## Frontend Runtime Data And Mock Honesty",
  "## Vertical Slice Coupling",
  "## Vertical Slice Split Pressure",
  "## Platform Seam Contract",
  "## Platform Seam Class Contract",
  "## Backend Implementation Approach",
  "## Migration / Persistence Approach",
  "## Migration / Persistence Class Contract",
  "## Tight Allowed Write Envelope",
  "## Task-Specific Proof Plan",
  "## Refactor-First Contract",
  "## Architecture Foundation Contract",
  "## Architecture Update Contract",
  "## Docs Artifact Contract",
  "## Standards Compliance Contract",
  "## Standards Update Contract",
  "## Permission Mapping Contract",
  "## API Contract",
  "## Data Dictionary Contract",
  "## Test-Only Coverage Contract",
  "## Test Suite Alignment Contract",
  "## Capability Permission / State Matrix",
  "## Forbidden Assumptions",
  "## Task-Type Approval Guardrails",
  "## Task Guardrail Evidence",
  "## Code Placement And Extraction Review",
  "## Allowed Write Set Classification",
  "## Forbidden Work",
  "## Task Acceptance Criteria Coverage",
  "## Task Capability Coverage",
  "## Task Dependencies",
  "## Shared Seams",
  "## Artifact Obligations",
  "## Proof And Command Plan",
  "## QA Evidence Instrument Summary",
  "## Branch Worktree Bootstrap Strategy",
  "## Blockers And Isolation Controls",
  "## Layer 5 Delivery Handoff",
];

const storyHeadings = [
  "## Story Queue",
  "## Acceptance Criteria",
  "## Capability Mapping",
  "## Artifact Ledger",
  "## Steering Architecture Classification Snapshot",
  "## Frontend Architecture Classification Snapshot",
  "## Browser Security Posture Snapshot",
  "## Task-Type Signal Matrix",
  "## Layer 4 Handoff",
];

const allowedTaskTypes: Set<string> = new Set(layer4TaskTypes);
const allowedTaskStatuses: Set<string> = new Set(layer4TaskStatuses);
const allowedCapabilityCoverageStatuses: Set<string> = new Set(layer4CapabilityCoverageStatuses);
const foundationBlockerTypes: Set<string> = new Set(layer4FoundationBlockerTypes);
const foundationTaskTypes: Set<string> = new Set(layer4FoundationTaskTypes);
const implementationTaskTypes: Set<string> = new Set(layer4ImplementationTaskTypes);
const frontendTaskTypes: Set<string> = new Set(layer4FrontendTaskTypes);
const guardrailReferenceByTaskType: Map<string, string> = new Map(Object.entries(layer4GuardrailReferenceByTaskType));
const allowedPlacementDecisions: Set<string> = new Set(layer4PlacementDecisions);
const allowedGuardrailEvidenceStatuses: Set<string> = new Set(layer4GuardrailEvidenceStatuses);
const allowedWriteClasses: Set<string> = new Set(layer4WriteClasses);
const allowedDocsArtifactClasses: Set<string> = new Set(layer4DocsArtifactClasses);
const allowedTaskGrainClassifications: Set<string> = new Set(layer4TaskGrainClassifications);
const allowedStopConditionTriggerTypes: Set<string> = new Set(layer4StopConditionTriggerTypes);
const allowedProceedIfTriggerHitValues: Set<string> = new Set(layer4ProceedIfTriggerHitValues);
const allowedWriteEnvelopeClasses: Set<string> = new Set(layer4WriteEnvelopeClasses);
const allowedProofSpecificityStatuses: Set<string> = new Set(layer4ProofSpecificityStatuses);
const allowedFrontendDesignSystemSubStandards: Set<string> = new Set(layer4FrontendDesignSystemSubStandards);
const allowedFrontendPerformancePostures: Set<string> = new Set(layer4FrontendPerformancePostures);
const allowedDesignSystemSeamPostures: Set<string> = new Set(layer4DesignSystemSeamPostures);
const allowedDesignSystemSeamClasses: Set<string> = new Set(layer4DesignSystemSeamClasses);
const allowedBackendCapabilityFileStrategies: Set<string> = new Set(layer4BackendCapabilityFileStrategies);
const allowedBackendChangeClasses: Set<string> = new Set(layer4BackendChangeClasses);
const allowedMigrationPersistenceChangeTypes: Set<string> = new Set(layer4MigrationPersistenceChangeTypes);
const allowedPlatformSeamKinds: Set<string> = new Set(layer4PlatformSeamKinds);
const allowedPlatformCompatibilityModes: Set<string> = new Set(layer4PlatformCompatibilityModes);
const suspiciousCoarseScopePhrases: string[] = [...layer4SuspiciousCoarseScopePhrases];
const requiredCheckIdsByTaskType: Map<string, readonly string[]> = new Map(Object.entries(layer4RequiredCheckIdsByTaskType));
const sharedCodePlacementCheckIds: string[] = [...layer4SharedCodePlacementCheckIds];
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
const allowedSecurityPresence = new Set(["yes", "no", "blocked"]);
const allowedYesNo = new Set(["yes", "no"]);
const allowedFrontendChangeClasses = new Set([
  "app-adoption",
  "route-module-behavior",
  "interaction-behavior",
  "permission-rendering",
  "api-projection-consumer",
  "topology-materialization-consumer",
  "runtime-defect-fix",
  "accessibility-semantics",
  "visual-rendering",
  "evidence-sweep-route-away",
]);
const allowedVerticalSliceSplitConcerns = new Set([
  "backend-behavior",
  "frontend-behavior",
  "api-data-contract",
  "design-system-seam",
  "permission-truth",
  "migration-persistence",
  "executable-proof",
  "qa-evidence",
]);
const requiredVerticalSliceSplitConcerns = [...allowedVerticalSliceSplitConcerns];
const allowedVerticalSliceSplitDecisions = new Set([
  "inseparable-in-slice",
  "approved-preexisting",
  "split-before-delivery",
  "not-applicable",
  "blocked",
]);
const allowedQaEvidenceClasses = new Set([
  "live-payload-sample",
  "served-asset-verification",
  "mock-honesty-comparison",
  "runtime-process-check",
  "browser-proof",
  "coverage-strength-summary",
  "evidence-sweep",
]);
const allowedTestOnlyChangeClasses = new Set([
  "prd-test-case",
  "proof-gap",
  "permission-state-matrix",
  "security-boundary",
  "e2e-journey",
  "regression-lock",
  "fixture-honesty",
]);
const allowedRefactorTriggers = new Set([
  "over-broad-write-set",
  "shared-logic-before-behavior",
  "unreliable-proof-seam",
  "duplicated-equivalent-behavior",
  "wrong-owner-or-layer",
  "decision-guess-risk",
  "extraction-before-reuse",
  "test-seam-needed",
]);
const allowedRefactorTypes = new Set([
  "extract",
  "move",
  "rename-clarify",
  "decompose",
  "consolidate",
  "adapter-compatibility",
  "test-seam",
  "performance-preserving",
]);
const allowedRefactorRoutingChecks = new Set([
  "stays-refactor-first",
  "blocked-route-to-DEV:platform-seam",
  "blocked-route-to-GOV:architecture-update",
  "blocked-route-to-GOV:standards-update",
  "blocked-route-to-DOC:api-contract",
  "blocked-route-to-DEV:migration-persistence",
  "blocked-route-to-DOC:permission-mapping",
  "blocked-route-to-GOV:design-system",
]);
const allowedArchitectureFoundationConcernAreas = new Set([
  "ownership-boundary",
  "integration-boundary",
  "security-privacy-boundary",
  "authorization-boundary",
  "persistence-data-model",
  "data-governance-compliance",
  "frontend-architecture-boundary",
  "design-system-architecture-boundary",
  "scalability-performance",
  "resilience-consistency",
  "observability-operability",
  "deployment-runtime-topology",
  "dependency-selection",
  "migration-rollout-strategy",
  "testing-strategy-architecture",
]);
const allowedArchitectureFoundationTriggers = new Set([
  "owner-boundary",
  "platform-vs-feature",
  "authz-boundary",
  "persistence-model",
  "topology-authority",
  "lifecycle-cleanup",
  "shared-seam-authority",
  "compatibility-strategy",
  "architecture-source-gap",
]);
const allowedArchitectureFoundationRoutes = new Set([
  "existing-architecture-source",
  "Layer-2-technical-steering",
  "ADR-required",
  "GOV:architecture-update",
  "GOV:standards-update",
  "blocked-human-decision",
]);
const allowedArchitectureDecisionAnalysisStatuses = new Set([
  "approved-source-exists",
  "missing-layer-2-analysis",
  "incomplete-layer-2-analysis",
  "adr-required",
  "blocked-human-decision",
]);
const allowedArchitectureUpdateDecisionSources = new Set([
  "Layer-2-technical-steering",
  "ADR",
  "existing-architecture-source",
  "approved-architecture-foundation-output",
  "explicit-recorded-human-approval",
]);
const allowedArchitectureUpdateClasses: Set<string> = new Set(layer4ArchitectureUpdateClasses);
const allowedStandardsUpdateChangeSources = new Set([
  "Layer-2-technical-steering",
  "standards-compliance-audit",
  "issue-reconciliation",
  "escaped-defect-reconciliation",
  "harness-retrospective",
  "existing-standards-contradiction",
  "explicit-recorded-human-approval",
]);
const allowedStandardsUpdateEnforcementPostures = new Set([
  "validator-or-gate-enforced-now",
  "template-required-now",
  "script-reported-debt",
  "advisory-with-approved-debt-route",
]);
const allowedStandardsUpdateClasses: Set<string> = new Set(layer4StandardsUpdateClasses);
const allowedStandardsComplianceTargetTypes = new Set([
  "repo-standard-gate",
  "external-standard-control-map",
  "platform-status-snapshot",
  "task-slice-gate-review",
  "waiver-or-blocker-review",
]);
const allowedStandardsCompliancePostures = new Set([
  "pass",
  "partial",
  "fail",
  "not-assessed",
  "not-applicable",
  "blocked",
  "waived-with-approval",
]);
const allowedDocsArtifactFamilies = new Set([
  "feature-doc",
  "readme",
  "runbook",
  "workspace-status",
  "implementation-blueprint-status",
  "generated-artifact-summary",
  "maintained-artifact-sweep",
  "ordinary-doc-sync",
]);
const allowedPermissionGrantSourcePostures = new Set([
  "documentation-only",
  "seed-backed",
  "corrective-migration-backed",
  "runtime-enforced",
  "blocked",
]);
const allowedPermissionMappingRowPostures = new Set([
  "current",
  "target",
  "architecture-target",
  "blocked",
]);
const allowedPermissionMappingClasses: Set<string> = new Set(layer4PermissionMappingClasses);
const allowedApiCompatibilityPostures = new Set([
  "no-wire-change",
  "additive",
  "compatibility-sensitive",
  "blocked-pending-migration-or-approval",
]);
const allowedApiMaintainedArtifactPostures = new Set([
  "docs-api-contract-only",
  "openapi-maintained",
  "postman-maintained",
  "openapi-and-postman-maintained",
  "generated-docs-maintained",
  "not-maintained-with-rationale",
]);
const allowedApiContractClasses: Set<string> = new Set(layer4ApiContractClasses);
const allowedDataCompatibilityPostures = new Set([
  "docs-only-alignment",
  "no-schema-change",
  "additive",
  "compatibility-sensitive",
  "blocked-pending-migration-or-approval",
]);
const allowedDataEnforcementPostures = new Set([
  "schema-enforced",
  "code-enforced",
  "test-enforced",
  "artifact-documented",
  "manual-review",
  "planned-work",
  "blocked",
  "not-applicable",
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

export type TaskBreakdownValidationResult = {
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
  outcome: string;
};

type StoryAcceptanceCriterionRow = {
  acId: string;
  storyId: string;
  criterion: string;
  proofLayer: string;
  requiredTestFamilies: string;
  requiredArtifactObligations: string;
};

type SourceSteeringClassificationRow = {
  classificationId: string;
  classification: string;
  downstreamSignal: string;
};

type SourceTaskTypeSignalRow = {
  storyId: string;
  signal: string;
  present: string;
  impliedTaskType: string;
};

type SteeringReconciliationRow = {
  classificationId: string;
  classification: string;
  downstreamSignal: string;
  coveredByTaskId: string;
  status: string;
};

type ExpectedTaskTypeReconciliationRow = {
  storyId: string;
  expectedTaskType: string;
  sourceSignal: string;
  coveredByTaskId: string;
  reason: string;
};

type SourceCapabilityRow = {
  storyId: string;
  acId: string;
  capabilityRows: string;
  posture: string;
};

type SourceArtifactRow = {
  artifactId: string;
  storyId: string;
  artifactType: string;
  requiredAction: string;
  owner: string;
  blocksTaskBreakdown: string;
};

type SourceHandoffRow = {
  storyId: string;
  handoffStatus: string;
};

type TaskRow = {
  taskId: string;
  parentStoryId: string;
  taskType: string;
  scope: string;
  allowedWriteSet: string;
  nonGoals: string;
  dependencies: string;
  sharedSeams: string;
  handoffStatus: string;
};

type TaskSizeGuardrailRow = {
  taskId: string;
  taskGrain: string;
  acCount: string;
  acCountRationale: string;
  primaryTarget: string;
  primarySeam: string;
  mainProofStory: string;
  additionalBehaviorsPresent: string;
  whyNotFurtherSplit: string;
};

type StopConditionRow = {
  taskId: string;
  triggerType: string;
  stopCondition: string;
  requiredEscalation: string;
  mayProceedIfHit: string;
  rationale: string;
};

type StartingContextRow = {
  taskId: string;
  filesRoutesCanonicals: string;
  seamsToConsume: string;
  governingArtifacts: string;
};

type FrontendArchitectureDecisionRow = {
  taskId: string;
  sourceScopeElement: string;
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
  sourceSteeringDecision: string;
};

type SourceFrontendArchitectureClassificationRow = {
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
};

type SourceBrowserSecurityPostureRow = {
  securityArea: string;
  present: string;
  decisionEvidence: string;
  requiredLayer4Signal: string;
  stopIfMissing: string;
};

type FrontendSubStandardRow = {
  taskId: string;
  primarySubStandard: string;
  additionalSubStandards: string;
  splitRationale: string;
  complianceProof: string;
};

type FrontendPerformancePostureRow = {
  taskId: string;
  posture: string;
  proofPlan: string;
  rationale: string;
};

type FrontendChangeClassContractRow = {
  taskId: string;
  changeClass: string;
  requiredContractRows: string;
  runtimeBrowserEvidence: string;
  routeAwaySplitNotes: string;
};

type FrontendSecurityEvidenceRow = {
  taskId: string;
  securityArea: string;
  sourcePresent: string;
  layer2DecisionEvidence: string;
  requiredLayer4Signal: string;
  layer4EvidencePlan: string;
};

type FrontendPermissionRenderingEvidenceRow = {
  taskId: string;
  sensitiveRenderingScope: string;
  allowedStateProof: string;
  deniedUnauthorizedStateProof: string;
  expiredUnauthenticatedStateProof: string;
  crossTenantDenialProof: string;
};

type FrontendRuntimeDataMockHonestyRow = {
  taskId: string;
  governingContract: string;
  fixtureSource: string;
  liveRuntimePayloadEvidence: string;
  unavailableReason: string;
  mockHonestyStatement: string;
};

type VerticalSliceCouplingRow = {
  taskId: string;
  journeyBehavior: string;
  backendSeam: string;
  frontendSeam: string;
  apiDataContract: string;
  browserProofStory: string;
  inseparableProofRationale: string;
  splitRejectionRationale: string;
};

type VerticalSliceSplitPressureRow = {
  taskId: string;
  concern: string;
  splitDecision: string;
  rationale: string;
  owningTaskIfSplit: string;
};

type PlatformSeamContractRow = {
  taskId: string;
  seamKind: string;
  compatibilityMode: string;
  approvedAuthoritySource: string;
  seamOwnerLocation: string;
  seamSourceInventory: string;
  seamChangeScope: string;
  exactWriteEnvelope: string;
  whyNotFeatureLocal: string;
  currentFutureUnsupportedConsumers: string;
  compatibilityContract: string;
  representativeConsumerProof: string;
  runtimeRestartImpact: string;
  rolloutBackoutPosture: string;
  artifactMaterializationImpact: string;
  generatedApplyCheckCommand: string;
  expectedSeamOutput: string;
  architectureStandardsBoundary: string;
  splitBlockedFollowUp: string;
  proofCommands: string;
  humanReviewBoundary: string;
};

type PlatformSeamClassContractRow = {
  taskId: string;
  platformSeamClass: string;
  classSpecificRequiredProof: string;
  requiredConsumerCoverage: string;
  runtimeMaterializationExpectation: string;
  forbiddenContaminationSplitNotes: string;
};

type DesignSystemSeamContractRow = {
  taskId: string;
  seamPosture: string;
  seamNameExportRoute: string;
  ownedRenderStructure: string;
  ownedBehaviorController: string;
  ownedAccessibilitySemantics: string;
  canonicalBehaviorLockEvidence: string;
  frontendConsumptionContract: string;
};

type DesignSystemSeamClassContractRow = {
  taskId: string;
  seamClass: string;
  classSpecificRequiredProof: string;
  downstreamConsumptionBoundary: string;
  forbiddenAppEvidenceStandardsWork: string;
};

type FrontendAdoptionContractRow = {
  taskId: string;
  consumedRenderSeam: string;
  consumedBehaviorControllerSeam: string;
  consumedAccessibilitySemantics: string;
  consumedStyleCssSeam: string;
  allowedAppLocalCompositionDataBinding: string;
  forbiddenLocalReconstruction: string;
  adoptionProofRouteScenario: string;
};

type BackendImplementationApproachRow = {
  taskId: string;
  changeClass: string;
  approvedSourceAuthority: string;
  featureOwner: string;
  capabilityFileStrategy: string;
  backendSourceInventory: string;
  exactWriteEnvelope: string;
  expectedFilesLayers: string;
  layerResponsibilities: string;
  contractApiPosture: string;
  authzTenantLifecyclePosture: string;
  persistenceMigrationPosture: string;
  publicSeamManifestImpact: string;
  artifactObligations: string;
  scaffoldScriptCommand: string;
  expectedBackendOutput: string;
  splitBlockedFollowUp: string;
  proofCommands: string;
  formattingGeneratedArtifactExpectations: string;
  humanReviewBoundary: string;
};

type MigrationPersistenceApproachRow = {
  taskId: string;
  changeType: string;
  liveSchemaCheck: string;
  sourceDataShapeValidation: string;
  perRowEligibilityValidation: string;
  rejectedRowBehavior: string;
  migrationIdentityPosture: string;
  sqlExecutionSemanticsCheck: string;
  representativeReadWriteProof: string;
  postgresHarnessImpact: string;
};

type MigrationPersistenceClassContractRow = {
  taskId: string;
  migrationPersistenceClass: string;
  classSpecificRequiredProof: string;
  requiredDataSchemaCoverage: string;
  requiredReadWriteOrHarnessCoverage: string;
  splitBlockedFollowUp: string;
};

type TightWriteEnvelopeRow = {
  taskId: string;
  envelopeClass: string;
  exactFilesOrPatterns: string;
  broadWriteRationale: string;
};

type TaskSpecificProofPlanRow = {
  taskId: string;
  proofSpecificity: string;
  taskSpecificProofName: string;
  broadProofRationale: string;
};

type RefactorFirstContractRow = {
  taskId: string;
  trigger: string;
  refactorType: string;
  refactorTargetInventory: string;
  detectionHints: string;
  unchangedBehavior: string;
  affectedConsumers: string;
  downstreamTaskUnblocked: string;
  compatibilityProof: string;
  routingCheck: string;
  humanReviewBoundary: string;
  forbiddenBehaviorOrAuthorityChange: string;
};

type ArchitectureFoundationContractRow = {
  taskId: string;
  concernArea: string;
  trigger: string;
  question: string;
  decisionAnalysisStatus: string;
  decisionProvenanceSource: string;
  missingAnalysisFields: string;
  sourcesToReview: string;
  decisionSourceInventory: string;
  decisionAnalysisChecklist: string;
  decisionOwner: string;
  outputArtifactTarget: string;
  downstreamTasksBlocked: string;
  compatibilityPosture: string;
  finalAuthorityRoute: string;
  humanReviewBoundary: string;
  forbiddenImplementationGuess: string;
};

type ArchitectureUpdateContractRow = {
  taskId: string;
  architectureUpdateClass: string;
  approvedDecisionSource: string;
  decisionSourcePathReference: string;
  decisionSummary: string;
  architectureArtifactTarget: string;
  consistencySweepTargets: string;
  authorityConsistencyInventory: string;
  downstreamImpact: string;
  compatibilityPosture: string;
  forbiddenImplementationStandardsWork: string;
  humanReviewBoundary: string;
  validationReviewEvidence: string;
};

type DocsArtifactContractRow = {
  taskId: string;
  artifactFamily: string;
  docsArtifactClass: string;
  scriptableSourceInventory: string;
  sourceTruthReviewed: string;
  docsTarget: string;
  statusPosture: string;
  staleArtifactSweep: string;
  specializedRoutingSplitDecisions: string;
  diffCheckCommand: string;
  humanReviewBoundary: string;
  validationReviewEvidence: string;
};

type StandardsComplianceContractRow = {
  taskId: string;
  complianceTargetType: string;
  standardGate: string;
  sourceStandardPathReference: string;
  scopeUnderReview: string;
  controlEvidenceInventory: string;
  reviewMethodCommand: string;
  compliancePosture: string;
  evidenceArtifactTarget: string;
  coverageSummaryCommand: string;
  findingsSummary: string;
  followUpRouting: string;
  humanReviewBoundary: string;
  waiverBlockerPosture: string;
};

type StandardsUpdateContractRow = {
  taskId: string;
  standardsUpdateClass: string;
  approvedStandardsChangeSource: string;
  sourcePathReference: string;
  standardsChangeSummary: string;
  standardsArtifactTarget: string;
  affectedSurfacesConsistencySweep: string;
  artifactInvalidationSweep: string;
  enforcementPosture: string;
  compatibilityRolloutPosture: string;
  debtRouteIfNotEnforcedNow: string;
  forbiddenImplementationArchitectureComplianceWork: string;
  validationReviewEvidence: string;
};

type PermissionMappingContractRow = {
  taskId: string;
  permissionMappingClass: string;
  approvedAuthzSource: string;
  capabilityRouteSurface: string;
  authorityWorldActorBoundary: string;
  grantSourcePosture: string;
  mappingRowPosture: string;
  tenantObjectBoundary: string;
  allowDenyExpectations: string;
  uiEligibility: string;
  denialAuditProofExpectation: string;
  evidenceMappingInventory: string;
  migrationImpact: string;
  splitBlockedFollowUp: string;
  humanReviewBoundary: string;
};

type ApiContractRow = {
  taskId: string;
  apiContractClass: string;
  routeFamily: string;
  contractSourceAuthority: string;
  methodsPaths: string;
  paramsQueryBody: string;
  responseStatusErrorShape: string;
  authnAuthzTenantBoundary: string;
  validationPaginationSortingSystemFields: string;
  compatibilityPosture: string;
  maintainedApiArtifacts: string;
  maintainedArtifactInventory: string;
  splitBlockedFollowUp: string;
  humanReviewBoundary: string;
  validationReviewEvidence: string;
};

type DataDictionaryContractRow = {
  taskId: string;
  entityTableFactGroup: string;
  dictionaryArtifactTarget: string;
  sourceTruthReviewed: string;
  fieldIndexLifecycleTruth: string;
  durableFactRetentionTruth: string;
  classificationCompliancePosture: string;
  standardsControlTrace: string;
  enforcementTrace: string;
  enforcementEvidence: string;
  testEvidenceTrace: string;
  compatibilityPosture: string;
  splitBlockedFollowUp: string;
  validationReviewEvidence: string;
};

type TestOnlyCoverageContractRow = {
  taskId: string;
  testChangeClass: string;
  coverageSource: string;
  traceabilityIds: string;
  testLayer: string;
  proofTarget: string;
  fixtureDataSource: string;
  mockRuntimeHonesty: string;
  productionBehaviorChangePosture: string;
  focusedCommand: string;
  splitBlockedFollowUp: string;
};

type TestSuiteAlignmentContractRow = {
  taskId: string;
  alignmentSourceTrigger: string;
  mismatchClass: string;
  documentationTargets: string;
  executableTargets: string;
  allowedEditPosture: string;
  splitDecisionForNewProof: string;
  traceabilityCommand: string;
  completionEvidence: string;
};

type CapabilityPermissionStateMatrixRow = {
  taskId: string;
  capabilityRouteObject: string;
  actorStatesCovered: string;
  permissionStatesCovered: string;
  objectLifecycleStatesCovered: string;
  boundaryStatesCovered: string;
  requiredNegativeCases: string;
  notApplicableRationale: string;
  missingCoverageFollowUpTask: string;
};

type ForbiddenAssumptionRow = {
  taskId: string;
  forbiddenAssumption: string;
  escalationPath: string;
};

type TaskTypeGuardrailRow = {
  taskId: string;
  taskType: string;
  reference: string;
  approvalStatus: string;
  evidence: string;
};

type TaskGuardrailEvidenceRow = {
  taskId: string;
  checkId: string;
  status: string;
  evidence: string;
};

type CodePlacementRow = {
  taskId: string;
  placementDecision: string;
  currentOwner: string;
  proposedOwner: string;
  extractionNeeded: string;
  supplementalGuardrails: string;
  compatibilityProof: string;
  approvalStatus: string;
};

type WriteSetClassificationRow = {
  taskId: string;
  pathPattern: string;
  writeClass: string;
  reason: string;
};

type ForbiddenWorkRow = {
  taskId: string;
  forbiddenWork: string;
  reason: string;
};

type TaskAcCoverageRow = {
  taskId: string;
  acIds: string;
};

type TaskCapabilityCoverageRow = {
  taskId: string;
  capabilityRows: string;
  status: string;
};

type TaskDependencyRow = {
  taskId: string;
  dependsOnTaskIds: string;
  dependencyReason: string;
  mustCompleteBeforeQueueing: string;
};

type SharedSeamRow = {
  taskId: string;
  sharedSeam: string;
  seamType: string;
  existingOrNew: string;
  proof: string;
};

type ArtifactObligationRow = {
  taskId: string;
  requiredArtifact: string;
  requiredAction: string;
  owner: string;
  blocksDeliveryHandoff: string;
};

type ProofCommandRow = {
  taskId: string;
  proofLayers: string;
  commands: string;
  evidenceNotes: string;
};

type QaEvidenceInstrumentSummaryRow = {
  taskId: string;
  qaEvidenceClass: string;
  evidenceSourceInventory: string;
  selectedEvidenceInstruments: string;
  liveRuntimePayloadEvidence: string;
  mockHonestyComparison: string;
  expectedEvidenceOutput: string;
  evidenceStatusRemainingGap: string;
  humanReviewBoundary: string;
};

type DebtHealthSummaryRow = {
  taskId: string;
  summaryCommand: string;
  summaryResult: string;
  debtFound: string;
  debtDisposition: string;
  followUpTaskOrOwner: string;
};

type BootstrapRow = {
  taskId: string;
  branchName: string;
  worktreeStrategy: string;
  bootstrapArtifact: string;
  baseRef: string;
  baseCommitPolicy: string;
  promotionTarget: string;
};

type BlockerRow = {
  blockerId: string;
  blocksTaskId: string;
  blockerType: string;
  requiredSeparateTaskId: string;
  reason: string;
  resolution: string;
};

type DeliveryHandoffRow = {
  taskId: string;
  handoffStatus: string;
  blockersRemaining: string;
};

export function validateTaskBreakdownContent(
  taskContent: string,
  storyContent?: string,
): TaskBreakdownValidationResult {
  const errors: string[] = [];

  for (const heading of requiredHeadings) {
    if (!taskContent.includes(heading)) {
      errors.push(`missing heading: ${heading}`);
    }
  }

  if (!storyContent) {
    errors.push("source Story Breakdown packet content is required");
  } else {
    for (const heading of storyHeadings) {
      if (!storyContent.includes(heading)) {
        errors.push(`source story packet missing heading: ${heading}`);
      }
    }
  }

  validateSourceHandoffFields(taskContent, errors);
  validateVaguePhrases(taskContent, errors);

  const sourceStories = storyContent ? parseSourceStoryRows(storyContent) : [];
  const sourceAcs = storyContent ? parseSourceAcceptanceCriteriaRows(storyContent) : [];
  const sourceCapabilities = storyContent ? parseSourceCapabilityRows(storyContent) : [];
  const sourceArtifacts = storyContent ? parseSourceArtifactRows(storyContent) : [];
  const sourceHandoffs = storyContent ? parseSourceHandoffRows(storyContent) : [];
  const sourceSteeringClassifications = storyContent ? parseSourceSteeringClassificationRows(storyContent) : [];
  const sourceFrontendArchitectureClassifications = storyContent ? parseSourceFrontendArchitectureClassificationRows(storyContent) : [];
  const sourceBrowserSecurityPosture = storyContent ? parseSourceBrowserSecurityPostureRows(storyContent) : [];
  const sourceTaskTypeSignals = storyContent ? parseSourceTaskTypeSignalRows(storyContent) : [];

  const selectedStories = parseSelectedStoryRows(taskContent);
  const acSnapshot = parseTaskAcSnapshotRows(taskContent);
  const capabilitySnapshot = parseTaskCapabilitySnapshotRows(taskContent);
  const steeringReconciliation = parseSteeringReconciliationRows(taskContent);
  const expectedTaskTypeReconciliation = parseExpectedTaskTypeReconciliationRows(taskContent);
  const tasks = parseTaskRows(taskContent);
  const taskSizeGuardrails = parseTaskSizeGuardrailRows(taskContent);
  const stopConditions = parseStopConditionRows(taskContent);
  const startingContexts = parseStartingContextRows(taskContent);
  const frontendArchitectureDecisions = parseFrontendArchitectureDecisionRows(taskContent);
  const frontendChangeClassContracts = parseFrontendChangeClassContractRows(taskContent);
  const frontendSubStandards = parseFrontendSubStandardRows(taskContent);
  const frontendPerformancePostures = parseFrontendPerformancePostureRows(taskContent);
  const designSystemSeamContracts = parseDesignSystemSeamContractRows(taskContent);
  const designSystemSeamClassContracts = parseDesignSystemSeamClassContractRows(taskContent);
  const frontendAdoptionContracts = parseFrontendAdoptionContractRows(taskContent);
  const frontendSecurityEvidence = parseFrontendSecurityEvidenceRows(taskContent);
  const frontendPermissionRenderingEvidence = parseFrontendPermissionRenderingEvidenceRows(taskContent);
  const frontendRuntimeDataMockHonesty = parseFrontendRuntimeDataMockHonestyRows(taskContent);
  const verticalSliceCouplings = parseVerticalSliceCouplingRows(taskContent);
  const verticalSliceSplitPressures = parseVerticalSliceSplitPressureRows(taskContent);
  const platformSeamContracts = parsePlatformSeamContractRows(taskContent);
  const platformSeamClassContracts = parsePlatformSeamClassContractRows(taskContent);
  const backendImplementationApproaches = parseBackendImplementationApproachRows(taskContent);
  const migrationPersistenceApproaches = parseMigrationPersistenceApproachRows(taskContent);
  const migrationPersistenceClassContracts = parseMigrationPersistenceClassContractRows(taskContent);
  const tightWriteEnvelopes = parseTightWriteEnvelopeRows(taskContent);
  const taskSpecificProofPlans = parseTaskSpecificProofPlanRows(taskContent);
  const refactorFirstContracts = parseRefactorFirstContractRows(taskContent);
  const architectureFoundationContracts = parseArchitectureFoundationContractRows(taskContent);
  const architectureUpdateContracts = parseArchitectureUpdateContractRows(taskContent);
  const docsArtifactContracts = parseDocsArtifactContractRows(taskContent);
  const standardsComplianceContracts = parseStandardsComplianceContractRows(taskContent);
  const standardsUpdateContracts = parseStandardsUpdateContractRows(taskContent);
  const permissionMappingContracts = parsePermissionMappingContractRows(taskContent);
  const apiContracts = parseApiContractRows(taskContent);
  const dataDictionaryContracts = parseDataDictionaryContractRows(taskContent);
  const testOnlyCoverageContracts = parseTestOnlyCoverageContractRows(taskContent);
  const testSuiteAlignmentContracts = parseTestSuiteAlignmentContractRows(taskContent);
  const capabilityPermissionStateMatrices = parseCapabilityPermissionStateMatrixRows(taskContent);
  const forbiddenAssumptions = parseForbiddenAssumptionRows(taskContent);
  const guardrails = parseTaskTypeGuardrailRows(taskContent);
  const guardrailEvidence = parseTaskGuardrailEvidenceRows(taskContent);
  const placements = parseCodePlacementRows(taskContent);
  const writeSetClassifications = parseWriteSetClassificationRows(taskContent);
  const forbiddenWork = parseForbiddenWorkRows(taskContent);
  const acCoverage = parseTaskAcCoverageRows(taskContent);
  const capabilityCoverage = parseTaskCapabilityCoverageRows(taskContent);
  const dependencies = parseTaskDependencyRows(taskContent);
  const sharedSeams = parseSharedSeamRows(taskContent);
  const artifacts = parseArtifactObligationRows(taskContent);
  const proofs = parseProofCommandRows(taskContent);
  const qaEvidenceInstrumentSummaries = parseQaEvidenceInstrumentSummaryRows(taskContent);
  const debtHealthSummaries = parseDebtHealthSummaryRows(taskContent);
  const bootstraps = parseBootstrapRows(taskContent);
  const blockers = parseBlockerRows(taskContent);
  const handoffs = parseDeliveryHandoffRows(taskContent);

  if (selectedStories.length === 0) {
    errors.push("Selected Story Scope has no story rows");
  }

  if (tasks.length === 0) {
    errors.push("Task Queue has no task rows");
  }

  const sourceStoriesById = new Map(sourceStories.map((row) => [row.storyId, row]));
  const sourceAcsById = new Map(sourceAcs.map((row) => [row.acId, row]));
  const sourceCapabilitiesByAc = groupBy(sourceCapabilities, (row) => row.acId);
  const sourceHandoffsByStory = new Map(sourceHandoffs.map((row) => [row.storyId, row]));
  const sourceFrontendArchitectureByScope = new Map(
    sourceFrontendArchitectureClassifications.map((row) => [row.scopeElement, row]),
  );
  const selectedStoryIds = new Set(selectedStories.map((row) => row.storyId));
  const taskIds = new Set(tasks.map((row) => row.taskId));

  validateSelectedStories(selectedStories, sourceStoriesById, sourceHandoffsByStory, errors);
  validateAcceptanceCriteriaSnapshot(acSnapshot, selectedStoryIds, sourceAcsById, errors);
  validateCapabilitySnapshot(capabilitySnapshot, selectedStoryIds, sourceCapabilitiesByAc, errors);
  validateStoryArtifactObligationsSelected(selectedStoryIds, sourceArtifacts, errors);
  validateSteeringReconciliation(steeringReconciliation, sourceSteeringClassifications, taskIds, errors);
  validateExpectedTaskTypeReconciliation(
    expectedTaskTypeReconciliation,
    sourceTaskTypeSignals,
    selectedStoryIds,
    taskIds,
    tasks,
    errors,
  );

  const acCoverageByTask = groupBy(acCoverage, (row) => row.taskId);
  const taskSizeGuardrailsByTask = groupBy(taskSizeGuardrails, (row) => row.taskId);
  const stopConditionsByTask = groupBy(stopConditions, (row) => row.taskId);
  const startingContextsByTask = groupBy(startingContexts, (row) => row.taskId);
  const frontendArchitectureDecisionsByTask = groupBy(frontendArchitectureDecisions, (row) => row.taskId);
  const frontendChangeClassContractsByTask = groupBy(frontendChangeClassContracts, (row) => row.taskId);
  const frontendSubStandardsByTask = groupBy(frontendSubStandards, (row) => row.taskId);
  const frontendPerformancePosturesByTask = groupBy(frontendPerformancePostures, (row) => row.taskId);
  const designSystemSeamContractsByTask = groupBy(designSystemSeamContracts, (row) => row.taskId);
  const designSystemSeamClassContractsByTask = groupBy(designSystemSeamClassContracts, (row) => row.taskId);
  const frontendAdoptionContractsByTask = groupBy(frontendAdoptionContracts, (row) => row.taskId);
  const frontendSecurityEvidenceByTask = groupBy(frontendSecurityEvidence, (row) => row.taskId);
  const frontendPermissionRenderingEvidenceByTask = groupBy(frontendPermissionRenderingEvidence, (row) => row.taskId);
  const frontendRuntimeDataMockHonestyByTask = groupBy(frontendRuntimeDataMockHonesty, (row) => row.taskId);
  const verticalSliceCouplingsByTask = groupBy(verticalSliceCouplings, (row) => row.taskId);
  const verticalSliceSplitPressuresByTask = groupBy(verticalSliceSplitPressures, (row) => row.taskId);
  const platformSeamContractsByTask = groupBy(platformSeamContracts, (row) => row.taskId);
  const platformSeamClassContractsByTask = groupBy(platformSeamClassContracts, (row) => row.taskId);
  const backendImplementationApproachesByTask = groupBy(backendImplementationApproaches, (row) => row.taskId);
  const migrationPersistenceApproachesByTask = groupBy(migrationPersistenceApproaches, (row) => row.taskId);
  const migrationPersistenceClassContractsByTask = groupBy(migrationPersistenceClassContracts, (row) => row.taskId);
  const tightWriteEnvelopesByTask = groupBy(tightWriteEnvelopes, (row) => row.taskId);
  const taskSpecificProofPlansByTask = groupBy(taskSpecificProofPlans, (row) => row.taskId);
  const refactorFirstContractsByTask = groupBy(refactorFirstContracts, (row) => row.taskId);
  const architectureFoundationContractsByTask = groupBy(architectureFoundationContracts, (row) => row.taskId);
  const architectureUpdateContractsByTask = groupBy(architectureUpdateContracts, (row) => row.taskId);
  const docsArtifactContractsByTask = groupBy(docsArtifactContracts, (row) => row.taskId);
  const standardsComplianceContractsByTask = groupBy(standardsComplianceContracts, (row) => row.taskId);
  const standardsUpdateContractsByTask = groupBy(standardsUpdateContracts, (row) => row.taskId);
  const permissionMappingContractsByTask = groupBy(permissionMappingContracts, (row) => row.taskId);
  const apiContractsByTask = groupBy(apiContracts, (row) => row.taskId);
  const dataDictionaryContractsByTask = groupBy(dataDictionaryContracts, (row) => row.taskId);
  const testOnlyCoverageContractsByTask = groupBy(testOnlyCoverageContracts, (row) => row.taskId);
  const testSuiteAlignmentContractsByTask = groupBy(testSuiteAlignmentContracts, (row) => row.taskId);
  const capabilityPermissionStateMatricesByTask = groupBy(capabilityPermissionStateMatrices, (row) => row.taskId);
  const forbiddenAssumptionsByTask = groupBy(forbiddenAssumptions, (row) => row.taskId);
  const guardrailsByTask = groupBy(guardrails, (row) => row.taskId);
  const guardrailEvidenceByTask = groupBy(guardrailEvidence, (row) => row.taskId);
  const placementsByTask = groupBy(placements, (row) => row.taskId);
  const writeSetClassificationsByTask = groupBy(writeSetClassifications, (row) => row.taskId);
  const forbiddenWorkByTask = groupBy(forbiddenWork, (row) => row.taskId);
  const capabilityCoverageByTask = groupBy(capabilityCoverage, (row) => row.taskId);
  const dependenciesByTask = groupBy(dependencies, (row) => row.taskId);
  const sharedSeamsByTask = groupBy(sharedSeams, (row) => row.taskId);
  const artifactsByTask = groupBy(artifacts, (row) => row.taskId);
  const proofsByTask = groupBy(proofs, (row) => row.taskId);
  const qaEvidenceInstrumentSummariesByTask = groupBy(qaEvidenceInstrumentSummaries, (row) => row.taskId);
  const debtHealthSummariesByTask = groupBy(debtHealthSummaries, (row) => row.taskId);
  const bootstrapsByTask = groupBy(bootstraps, (row) => row.taskId);
  const blockersByTask = groupBy(blockers, (row) => row.blocksTaskId);
  const handoffsByTask = new Map(handoffs.map((row) => [row.taskId, row]));

  for (const task of tasks) {
    validateTaskRow(task, selectedStoryIds, errors);
    validateTaskReferences(task.taskId, taskIds, errors);
    validateTaskCategoryBoundary(task, errors);

    validateAcCoverage(task, acCoverageByTask.get(task.taskId) ?? [], sourceAcsById, selectedStoryIds, errors);
    validateDeepDeliveryReadiness(
      task,
      taskSizeGuardrailsByTask.get(task.taskId) ?? [],
      stopConditionsByTask.get(task.taskId) ?? [],
      startingContextsByTask.get(task.taskId) ?? [],
      frontendArchitectureDecisionsByTask.get(task.taskId) ?? [],
      frontendChangeClassContractsByTask.get(task.taskId) ?? [],
      sourceFrontendArchitectureByScope,
      frontendSubStandardsByTask.get(task.taskId) ?? [],
      frontendPerformancePosturesByTask.get(task.taskId) ?? [],
      designSystemSeamContractsByTask.get(task.taskId) ?? [],
      frontendAdoptionContractsByTask.get(task.taskId) ?? [],
      frontendSecurityEvidenceByTask.get(task.taskId) ?? [],
      sourceBrowserSecurityPosture,
      frontendPermissionRenderingEvidenceByTask.get(task.taskId) ?? [],
      frontendRuntimeDataMockHonestyByTask.get(task.taskId) ?? [],
      proofsByTask.get(task.taskId) ?? [],
      verticalSliceCouplingsByTask.get(task.taskId) ?? [],
      verticalSliceSplitPressuresByTask.get(task.taskId) ?? [],
      backendImplementationApproachesByTask.get(task.taskId) ?? [],
      migrationPersistenceApproachesByTask.get(task.taskId) ?? [],
      tightWriteEnvelopesByTask.get(task.taskId) ?? [],
      taskSpecificProofPlansByTask.get(task.taskId) ?? [],
      testOnlyCoverageContractsByTask.get(task.taskId) ?? [],
      testSuiteAlignmentContractsByTask.get(task.taskId) ?? [],
      capabilityPermissionStateMatricesByTask.get(task.taskId) ?? [],
      forbiddenAssumptionsByTask.get(task.taskId) ?? [],
      acCoverageByTask.get(task.taskId) ?? [],
      errors,
    );
    validateTaskTypeGuardrail(task, guardrailsByTask.get(task.taskId) ?? [], errors);
    validateTaskGuardrailEvidence(task, guardrailEvidenceByTask.get(task.taskId) ?? [], placementsByTask.get(task.taskId) ?? [], errors);
    validateRefactorFirstContract(task, refactorFirstContractsByTask.get(task.taskId) ?? [], tasks, errors);
    validateArchitectureFoundationContract(task, architectureFoundationContractsByTask.get(task.taskId) ?? [], tasks, errors);
    validateArchitectureUpdateContract(task, architectureUpdateContractsByTask.get(task.taskId) ?? [], errors);
    validateDocsArtifactContract(task, docsArtifactContractsByTask.get(task.taskId) ?? [], errors);
    validateStandardsComplianceContract(task, standardsComplianceContractsByTask.get(task.taskId) ?? [], errors);
    validateStandardsUpdateContract(task, standardsUpdateContractsByTask.get(task.taskId) ?? [], errors);
    validatePermissionMappingContract(task, permissionMappingContractsByTask.get(task.taskId) ?? [], errors);
    validateApiContract(task, apiContractsByTask.get(task.taskId) ?? [], errors);
    validateDataDictionaryContract(task, dataDictionaryContractsByTask.get(task.taskId) ?? [], errors);
    validateDesignSystemSeamClassContract(task, designSystemSeamClassContractsByTask.get(task.taskId) ?? [], errors);
    validatePlatformSeamContract(task, platformSeamContractsByTask.get(task.taskId) ?? [], errors);
    validatePlatformSeamClassContract(
      task,
      platformSeamContractsByTask.get(task.taskId) ?? [],
      platformSeamClassContractsByTask.get(task.taskId) ?? [],
      errors,
    );
    validateMigrationPersistenceClassContract(
      task,
      migrationPersistenceApproachesByTask.get(task.taskId) ?? [],
      migrationPersistenceClassContractsByTask.get(task.taskId) ?? [],
      errors,
    );
    validateCodePlacement(task, placementsByTask.get(task.taskId) ?? [], tasks, dependenciesByTask.get(task.taskId) ?? [], errors);
    validateWriteSetClassification(task, writeSetClassificationsByTask.get(task.taskId) ?? [], errors);
    validateForbiddenWork(task, forbiddenWorkByTask.get(task.taskId) ?? [], errors);
    validateCapabilityCoverage(task, capabilityCoverageByTask.get(task.taskId) ?? [], errors);
    validateDependencyRows(task.taskId, dependenciesByTask.get(task.taskId) ?? [], taskIds, errors);
    validateSharedSeams(task, sharedSeamsByTask.get(task.taskId) ?? [], errors);
    validateArtifacts(task, artifactsByTask.get(task.taskId) ?? [], errors);
    validateProofs(task, proofsByTask.get(task.taskId) ?? [], errors);
    validateQaEvidenceInstrumentSummaries(task, qaEvidenceInstrumentSummariesByTask.get(task.taskId) ?? [], errors);
    validateDebtHealthSummaries(task, debtHealthSummariesByTask.get(task.taskId) ?? [], errors);
    validateBootstrap(task, bootstrapsByTask.get(task.taskId) ?? [], errors);
    validateDeliveryHandoff(task, handoffsByTask.get(task.taskId), blockersByTask.get(task.taskId) ?? [], errors);
  }

  validateUnknownTaskReferences("Task Acceptance Criteria Coverage", acCoverage.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Task Size Guardrail", taskSizeGuardrails.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Decision Escalation / Stop Conditions", stopConditions.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Exact Starting Context", startingContexts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Architecture Decision Reconciliation", frontendArchitectureDecisions.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Change Class Contract", frontendChangeClassContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend / Design-System Sub-Standard", frontendSubStandards.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Performance Posture", frontendPerformancePostures.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Design-System Seam Contract", designSystemSeamContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Design-System Seam Class Contract", designSystemSeamClassContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Adoption Contract", frontendAdoptionContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Security Evidence", frontendSecurityEvidence.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Permission Rendering Evidence", frontendPermissionRenderingEvidence.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Runtime Data And Mock Honesty", frontendRuntimeDataMockHonesty.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Vertical Slice Coupling", verticalSliceCouplings.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Vertical Slice Split Pressure", verticalSliceSplitPressures.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Platform Seam Contract", platformSeamContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Platform Seam Class Contract", platformSeamClassContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Backend Implementation Approach", backendImplementationApproaches.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Migration / Persistence Approach", migrationPersistenceApproaches.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Migration / Persistence Class Contract", migrationPersistenceClassContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Tight Allowed Write Envelope", tightWriteEnvelopes.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Task-Specific Proof Plan", taskSpecificProofPlans.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Refactor-First Contract", refactorFirstContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Architecture Foundation Contract", architectureFoundationContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Architecture Update Contract", architectureUpdateContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Docs Artifact Contract", docsArtifactContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Standards Compliance Contract", standardsComplianceContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Standards Update Contract", standardsUpdateContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Permission Mapping Contract", permissionMappingContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("API Contract", apiContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Data Dictionary Contract", dataDictionaryContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Test-Only Coverage Contract", testOnlyCoverageContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Test Suite Alignment Contract", testSuiteAlignmentContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Capability Permission / State Matrix", capabilityPermissionStateMatrices.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Forbidden Assumptions", forbiddenAssumptions.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Task-Type Approval Guardrails", guardrails.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Task Guardrail Evidence", guardrailEvidence.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Code Placement And Extraction Review", placements.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Allowed Write Set Classification", writeSetClassifications.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Forbidden Work", forbiddenWork.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Task Capability Coverage", capabilityCoverage.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Task Dependencies", dependencies.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Shared Seams", sharedSeams.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Artifact Obligations", artifacts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Proof And Command Plan", proofs.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("QA Evidence Instrument Summary", qaEvidenceInstrumentSummaries.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Debt Health Summary Commands", debtHealthSummaries.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Branch Worktree Bootstrap Strategy", bootstraps.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Layer 5 Delivery Handoff", handoffs.map((row) => row.taskId), taskIds, errors);

  validateFoundationBlockers(blockers, tasks, taskIds, errors);

  return {
    status: errors.length === 0 ? "PASS" : "BLOCKED",
    errors,
  };
}

function validateTaskTypeGuardrail(task: TaskRow, rows: TaskTypeGuardrailRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} has no task-type approval guardrail row`);
    return;
  }

  for (const row of rows) {
    if (row.taskType !== task.taskType) {
      errors.push(`${task.taskId} guardrail task type ${row.taskType || "(blank)"} does not match ${task.taskType}`);
    }

    const expectedReference = guardrailReferenceByTaskType.get(task.taskType);
    if (expectedReference && !row.reference.includes(expectedReference)) {
      errors.push(`${task.taskId} must reference ${expectedReference}`);
    }

    validateRequiredField(task.taskId, "Guardrail Evidence / Rationale", row.evidence, errors);

    if (row.approvalStatus === "blocked") {
      errors.push(`${task.taskId} task-type guardrail is blocked`);
    } else if (row.approvalStatus === "approved") {
      return;
    } else {
      errors.push(`${task.taskId} has invalid task-type guardrail approval status: ${row.approvalStatus || "(blank)"}`);
    }
  }
}

function validateDeepDeliveryReadiness(
  task: TaskRow,
  sizeRows: TaskSizeGuardrailRow[],
  stopRows: StopConditionRow[],
  contextRows: StartingContextRow[],
  frontendArchitectureRows: FrontendArchitectureDecisionRow[],
  frontendChangeClassRows: FrontendChangeClassContractRow[],
  sourceFrontendArchitectureByScope: Map<string, SourceFrontendArchitectureClassificationRow>,
  subStandardRows: FrontendSubStandardRow[],
  performancePostureRows: FrontendPerformancePostureRow[],
  seamContractRows: DesignSystemSeamContractRow[],
  adoptionContractRows: FrontendAdoptionContractRow[],
  securityEvidenceRows: FrontendSecurityEvidenceRow[],
  sourceBrowserSecurityRows: SourceBrowserSecurityPostureRow[],
  permissionRenderingRows: FrontendPermissionRenderingEvidenceRow[],
  runtimeDataRows: FrontendRuntimeDataMockHonestyRow[],
  proofRowsForRuntime: ProofCommandRow[],
  verticalSliceCouplingRows: VerticalSliceCouplingRow[],
  verticalSliceSplitPressureRows: VerticalSliceSplitPressureRow[],
  backendApproachRows: BackendImplementationApproachRow[],
  migrationApproachRows: MigrationPersistenceApproachRow[],
  envelopeRows: TightWriteEnvelopeRow[],
  proofRows: TaskSpecificProofPlanRow[],
  testOnlyCoverageRows: TestOnlyCoverageContractRow[],
  testSuiteAlignmentRows: TestSuiteAlignmentContractRow[],
  capabilityPermissionStateMatrixRows: CapabilityPermissionStateMatrixRow[],
  forbiddenAssumptionRows: ForbiddenAssumptionRow[],
  acCoverageRows: TaskAcCoverageRow[],
  errors: string[],
): void {
  if (task.handoffStatus !== "queued-for-delivery") {
    return;
  }

  validateTaskSizeGuardrail(task, sizeRows, acCoverageRows, errors);
  validateStopConditions(task, stopRows, errors);
  validateStartingContext(task, contextRows, errors);
  validateFrontendArchitectureDecision(task, frontendArchitectureRows, sourceFrontendArchitectureByScope, contextRows, envelopeRows, errors);
  validateFrontendChangeClassContract(
    task,
    frontendChangeClassRows,
    frontendArchitectureRows,
    subStandardRows,
    seamContractRows,
    adoptionContractRows,
    permissionRenderingRows,
    runtimeDataRows,
    proofRowsForRuntime,
    envelopeRows,
    errors,
  );
  validateFrontendSubStandard(task, subStandardRows, errors);
  validateFrontendPerformancePosture(task, performancePostureRows, errors);
  validateDesignSystemSeamContract(task, seamContractRows, errors);
  validateFrontendAdoptionContract(task, seamContractRows, adoptionContractRows, errors);
  validateFrontendSecurityEvidence(task, securityEvidenceRows, sourceBrowserSecurityRows, errors);
  validateFrontendPermissionRenderingEvidence(task, frontendArchitectureRows, securityEvidenceRows, permissionRenderingRows, errors);
  validateFrontendRuntimeDataMockHonesty(task, frontendArchitectureRows, runtimeDataRows, proofRowsForRuntime, errors);
  validateVerticalSliceCoupling(task, verticalSliceCouplingRows, errors);
  validateVerticalSliceSplitPressure(task, verticalSliceSplitPressureRows, errors);
  validateBackendImplementationApproach(task, backendApproachRows, errors);
  validateMigrationPersistenceApproach(task, migrationApproachRows, errors);
  validateTightWriteEnvelope(task, envelopeRows, errors);
  validateTaskSpecificProofPlan(task, proofRows, errors);
  validateTestOnlyCoverage(task, testOnlyCoverageRows, capabilityPermissionStateMatrixRows, errors);
  validateTestSuiteAlignment(task, testSuiteAlignmentRows, errors);
  validateForbiddenAssumptions(task, forbiddenAssumptionRows, errors);
}

function validateTaskSizeGuardrail(
  task: TaskRow,
  rows: TaskSizeGuardrailRow[],
  acCoverageRows: TaskAcCoverageRow[],
  errors: string[],
): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} queued task has no task size guardrail row`);
    return;
  }

  const actualAcCount = new Set(acCoverageRows.flatMap((row) => splitIds(row.acIds))).size;

  for (const row of rows) {
    if (!allowedTaskGrainClassifications.has(row.taskGrain)) {
      errors.push(`${task.taskId} has invalid task grain: ${row.taskGrain || "(blank)"}`);
    }

    validateRequiredField(task.taskId, "AC Count", row.acCount, errors);
    validateRequiredField(task.taskId, "AC Count Rationale", row.acCountRationale, errors);
    validateRequiredField(task.taskId, "Primary Behavior / Decision / Proof Target", row.primaryTarget, errors);
    validateRequiredField(task.taskId, "Primary Seam", row.primarySeam, errors);
    validateRequiredField(task.taskId, "Main Proof Story", row.mainProofStory, errors);
    validateRequiredField(task.taskId, "Additional Behaviors Present", row.additionalBehaviorsPresent, errors);
    validateRequiredField(task.taskId, "Why Not Further Split", row.whyNotFurtherSplit, errors);

    const declaredAcCount = Number.parseInt(row.acCount, 10);
    if (!Number.isFinite(declaredAcCount) || declaredAcCount < 0) {
      errors.push(`${task.taskId} has invalid AC Count: ${row.acCount || "(blank)"}`);
    } else if (actualAcCount > 0 && declaredAcCount !== actualAcCount) {
      errors.push(`${task.taskId} AC Count ${declaredAcCount} does not match coverage count ${actualAcCount}`);
    }

    if (declaredAcCount > 2) {
      errors.push(`${task.taskId} covers more than two acceptance criteria and must be split`);
    } else if (declaredAcCount === 2 && !mentionsInseparable(row.acCountRationale, row.whyNotFurtherSplit)) {
      errors.push(`${task.taskId} covers two acceptance criteria without inseparable split rationale`);
    }

    if (row.taskGrain === "split-required" || row.taskGrain === "coarse-blocked") {
      errors.push(`${task.taskId} task grain ${row.taskGrain} cannot be queued for delivery`);
    }

    if (hasAffirmativeValue(row.additionalBehaviorsPresent) && !mentionsInseparable(row.whyNotFurtherSplit, row.acCountRationale)) {
      errors.push(`${task.taskId} has additional behaviors without inseparable split rationale`);
    }

    for (const phrase of suspiciousCoarseScopePhrases) {
      if (task.scope.toLowerCase().includes(phrase) && !mentionsInseparable(row.whyNotFurtherSplit, row.acCountRationale)) {
        errors.push(`${task.taskId} scope contains coarse phrase "${phrase}" without split rationale`);
      }
    }
  }
}

function validateStopConditions(task: TaskRow, rows: StopConditionRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} queued task has no decision escalation / stop condition row`);
    return;
  }

  for (const row of rows) {
    if (!allowedStopConditionTriggerTypes.has(row.triggerType)) {
      errors.push(`${task.taskId} has invalid stop condition trigger type: ${row.triggerType || "(blank)"}`);
    }

    validateRequiredField(task.taskId, "Stop Condition / Do Not Guess Decision", row.stopCondition, errors);
    validateRequiredField(task.taskId, "Required Escalation", row.requiredEscalation, errors);
    validateRequiredField(task.taskId, "May Proceed If Hit", row.mayProceedIfHit, errors);
    validateRequiredField(task.taskId, "Stop Condition Rationale", row.rationale, errors);

    const mayProceed = row.mayProceedIfHit.trim().toLowerCase();
    if (!allowedProceedIfTriggerHitValues.has(mayProceed)) {
      errors.push(`${task.taskId} has invalid May Proceed If Hit: ${row.mayProceedIfHit || "(blank)"}`);
    }

    if (row.triggerType === "none-known" && mayProceed !== "yes") {
      errors.push(`${task.taskId} none-known stop condition must allow proceed with rationale`);
    }

    if (row.triggerType !== "none-known" && mayProceed === "yes") {
      errors.push(`${task.taskId} decision-bearing stop condition must not proceed when hit`);
    }
  }
}

function validateStartingContext(task: TaskRow, rows: StartingContextRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} queued task has no exact starting context row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Files / Routes / Canonicals To Inspect", row.filesRoutesCanonicals, errors);
    validateRequiredField(task.taskId, "Existing Seams To Consume", row.seamsToConsume, errors);
    validateRequiredField(task.taskId, "Governing Source Artifacts", row.governingArtifacts, errors);
  }
}

function validateFrontendArchitectureDecision(
  task: TaskRow,
  rows: FrontendArchitectureDecisionRow[],
  sourceRowsByScope: Map<string, SourceFrontendArchitectureClassificationRow>,
  contextRows: StartingContextRow[],
  envelopeRows: TightWriteEnvelopeRow[],
  errors: string[],
): void {
  if (!frontendTaskTypes.has(task.taskType)) {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:frontend/GOV:design-system task has no DEV:frontend architecture decision row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Source Scope Element", row.sourceScopeElement, errors);
    validateRequiredField(task.taskId, "Frontend Product Module", row.productModule, errors);
    validateRequiredField(task.taskId, "Frontend Journey Group", row.journeyGroup, errors);
    validateRequiredField(task.taskId, "Canonical Locator", row.canonicalLocator, errors);
    validateRequiredField(task.taskId, "Compatibility Locators", row.compatibilityLocators, errors);
    validateRequiredField(task.taskId, "Source Steering Decision", row.sourceSteeringDecision, errors);

    validateAllowedValue(task.taskId, "Route Family", row.routeFamily, allowedFrontendRouteFamilies, errors);
    validateAllowedValue(task.taskId, "Route Visibility", row.routeVisibility, allowedFrontendRouteVisibilities, errors);
    validateAllowedValue(task.taskId, "Actor Scope", row.actorScope, allowedFrontendActorScopes, errors);
    validateAllowedValue(task.taskId, "Runtime Shape", row.runtimeShape, allowedFrontendRuntimeShapes, errors);
    validateAllowedValue(task.taskId, "Surface Class", row.surfaceClass, allowedFrontendSurfaceClasses, errors);
    validateAllowedValue(task.taskId, "Topology Class", row.topologyClass, allowedFrontendTopologyClasses, errors);
    validateAllowedValue(task.taskId, "Locator Type", row.locatorType, allowedFrontendLocatorTypes, errors);
    validateAllowedValue(task.taskId, "Topology Authority", row.topologyAuthority, allowedFrontendTopologyAuthorities, errors);
    validateAllowedValue(
      task.taskId,
      "Target Topology Authority",
      row.targetTopologyAuthority,
      allowedFrontendTopologyAuthorities,
      errors,
    );
    validateAllowedValue(
      task.taskId,
      "Authority Transition Posture",
      row.authorityTransitionPosture,
      allowedFrontendAuthorityTransitionPostures,
      errors,
    );
    validateAllowedValue(task.taskId, "State Owner", row.stateOwner, allowedFrontendStateOwners, errors);
    validateAllowedValue(task.taskId, "Shell Governance", row.shellGovernance, allowedFrontendShellGovernancePostures, errors);
    validateAllowedValue(
      task.taskId,
      "Design-System Prerequisite",
      row.designSystemPrerequisite,
      allowedFrontendDesignSystemPrerequisites,
      errors,
    );
    validateAllowedValue(task.taskId, "Materialization Model", row.materializationModel, allowedFrontendMaterializationModels, errors);
    validateAllowedValue(task.taskId, "Source Placement", row.sourcePlacement, allowedFrontendSourcePlacements, errors);
    validateAllowedValue(task.taskId, "Implementation Readiness", row.implementationReadiness, allowedFrontendImplementationReadiness, errors);

    const sourceRow = sourceRowsByScope.get(row.sourceScopeElement);
    if (!sourceRow) {
      errors.push(`${task.taskId} DEV:frontend architecture decision references unknown Layer 2/3 scope: ${row.sourceScopeElement || "(blank)"}`);
    } else {
      validateFrontendArchitectureMatchesSource(task.taskId, row, sourceRow, errors);
    }

    if (row.implementationReadiness.startsWith("blocked-on")) {
      errors.push(`${task.taskId} DEV:frontend architecture decision readiness is ${row.implementationReadiness}`);
    }

    if ((task.taskType === "DEV:frontend" || task.taskType === "GOV:design-system") && row.routeFamily === "not-applicable") {
      errors.push(`${task.taskId} ${task.taskType} task must consume a DEV:frontend architecture classification, not not-applicable`);
    }

    if (task.taskType === "DEV:frontend" && row.designSystemPrerequisite === "DS-task-required") {
      errors.push(`${task.taskId} DEV:frontend task cannot proceed while Layer 2 requires upstream GOV:design-system work`);
    }

    if (row.authorityTransitionPosture === "blocked-until-transition") {
      errors.push(`${task.taskId} DEV:frontend topology authority transition blocks delivery`);
    }

    if (
      task.taskType === "DEV:frontend" &&
      (row.topologyClass === "durable-page" || row.topologyClass === "durable-subroute") &&
      row.locatorType === "none"
    ) {
      errors.push(`${task.taskId} durable DEV:frontend topology requires a non-none locator type`);
    }

    if (task.taskType === "DEV:frontend" && row.locatorType === "migration" && !mentionsCompatibilityLocator(row.compatibilityLocators)) {
      errors.push(`${task.taskId} DEV:frontend locator migration must name compatibility locators`);
    }

    if (row.sourcePlacement === "generated-output" && row.materializationModel !== "preview-apply-required") {
      errors.push(`${task.taskId} generated DEV:frontend output requires preview-apply materialization`);
    }

    if (
      row.sourcePlacement === "generated-output" &&
      row.materializationModel === "preview-apply-required" &&
      !mentionsPreviewApplyOrMaterializationSeam(task, row, contextRows, envelopeRows)
    ) {
      errors.push(`${task.taskId} generated DEV:frontend output must name the preview/apply or materialization seam`);
    }

    if (
      row.sourcePlacement === "generated-output" &&
      mentionsGeneratedOutputHandEdit(task.allowedWriteSet, envelopeRows.map((envelope) => envelope.exactFilesOrPatterns).join(" ")) &&
      !mentionsApprovedGeneratedCanonicalSweep(task.scope, task.nonGoals, task.allowedWriteSet, envelopeRows.map((envelope) => envelope.broadWriteRationale).join(" "))
    ) {
      errors.push(`${task.taskId} generated DEV:frontend output cannot be hand-edited without an approved generated/canonical sweep rationale`);
    }

    if (row.sourcePlacement === "shell-route-registry" && mentionsPageJourneyBehaviorOwnership(task.scope, task.allowedWriteSet)) {
      errors.push(`${task.taskId} shell-route-registry placement may only own registry or route mounting, not page or journey behavior`);
    }

    if (
      row.sourcePlacement === "module-journey-files" &&
      !writeSetMatchesProductModuleJourneyGroup(task.allowedWriteSet, row.productModule, row.journeyGroup) &&
      !mentionsUnknownModuleJourneyPathRationale(task.allowedWriteSet, task.scope)
    ) {
      errors.push(`${task.taskId} module-journey-files placement must include the approved product module/journey group in the allowed write paths or give concrete path-unknown rationale`);
    }

    if (task.taskType === "DEV:frontend" && row.stateOwner === "never-serialize" && mentionsUrlOrReplayState(task.scope, task.allowedWriteSet)) {
      errors.push(`${task.taskId} never-serialize DEV:frontend state must not be placed in URL or replay payloads`);
    }

    if (
      task.taskType === "DEV:frontend" &&
      row.sourcePlacement === "module-journey-files" &&
      mentionsRootAdminShellEntry(task.allowedWriteSet)
    ) {
      errors.push(`${task.taskId} module/journey DEV:frontend work must not add behavior to rootAdminShell/assets/app.mjs`);
    }
  }
}

function validateFrontendArchitectureMatchesSource(
  taskId: string,
  row: FrontendArchitectureDecisionRow,
  sourceRow: SourceFrontendArchitectureClassificationRow,
  errors: string[],
): void {
  const fields: Array<[keyof FrontendArchitectureDecisionRow, keyof SourceFrontendArchitectureClassificationRow, string]> = [
    ["routeFamily", "routeFamily", "Route Family"],
    ["productModule", "productModule", "Product Module"],
    ["journeyGroup", "journeyGroup", "Journey Group"],
    ["routeVisibility", "routeVisibility", "Route Visibility"],
    ["actorScope", "actorScope", "Actor Scope"],
    ["runtimeShape", "runtimeShape", "Runtime Shape"],
    ["surfaceClass", "surfaceClass", "Surface Class"],
    ["topologyClass", "topologyClass", "Topology Class"],
    ["locatorType", "locatorType", "Locator Type"],
    ["canonicalLocator", "canonicalLocator", "Canonical Locator"],
    ["compatibilityLocators", "compatibilityLocators", "Compatibility Locators"],
    ["topologyAuthority", "topologyAuthority", "Topology Authority"],
    ["targetTopologyAuthority", "targetTopologyAuthority", "Target Topology Authority"],
    ["authorityTransitionPosture", "authorityTransitionPosture", "Authority Transition Posture"],
    ["stateOwner", "stateOwner", "State Owner"],
    ["shellGovernance", "shellGovernance", "Shell Governance"],
    ["designSystemPrerequisite", "designSystemPrerequisite", "Design-System Prerequisite"],
    ["materializationModel", "materializationModel", "Materialization Model"],
    ["sourcePlacement", "sourcePlacement", "Source Placement"],
    ["implementationReadiness", "implementationReadiness", "Implementation Readiness"],
  ];

  for (const [taskField, sourceField, label] of fields) {
    if (row[taskField] !== sourceRow[sourceField]) {
      errors.push(
        `${taskId} DEV:frontend architecture ${label} does not match Layer 2/3 snapshot for ${sourceRow.scopeElement}`,
      );
    }
  }
}

function validateFrontendChangeClassContract(
  task: TaskRow,
  rows: FrontendChangeClassContractRow[],
  frontendArchitectureRows: FrontendArchitectureDecisionRow[],
  subStandardRows: FrontendSubStandardRow[],
  seamRows: DesignSystemSeamContractRow[],
  adoptionRows: FrontendAdoptionContractRow[],
  permissionRows: FrontendPermissionRenderingEvidenceRow[],
  runtimeRows: FrontendRuntimeDataMockHonestyRow[],
  proofRows: ProofCommandRow[],
  envelopeRows: TightWriteEnvelopeRow[],
  errors: string[],
): void {
  if (task.taskType !== "DEV:frontend") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Frontend Change Class Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:frontend task has no Frontend Change Class Contract row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Frontend Change Class", row.changeClass, errors);
    validateRequiredField(task.taskId, "Primary Contract Rows Required", row.requiredContractRows, errors);
    validateRequiredField(task.taskId, "Runtime / Browser Evidence Required", row.runtimeBrowserEvidence, errors);
    validateRequiredField(task.taskId, "Route-Away / Split Notes", row.routeAwaySplitNotes, errors);
    validateAllowedValue(task.taskId, "Frontend Change Class", row.changeClass, allowedFrontendChangeClasses, errors);

    if (row.changeClass === "evidence-sweep-route-away") {
      errors.push(`${task.taskId} evidence-sweep-route-away must route to EVIDENCE:qa-evidence, not DEV:frontend`);
    }

    validateFrontendChangeClassSpecifics(
      task,
      row,
      frontendArchitectureRows,
      subStandardRows,
      seamRows,
      adoptionRows,
      permissionRows,
      runtimeRows,
      proofRows,
      envelopeRows,
      errors,
    );
  }
}

function validateFrontendChangeClassSpecifics(
  task: TaskRow,
  row: FrontendChangeClassContractRow,
  frontendArchitectureRows: FrontendArchitectureDecisionRow[],
  subStandardRows: FrontendSubStandardRow[],
  seamRows: DesignSystemSeamContractRow[],
  adoptionRows: FrontendAdoptionContractRow[],
  permissionRows: FrontendPermissionRenderingEvidenceRow[],
  runtimeRows: FrontendRuntimeDataMockHonestyRow[],
  proofRows: ProofCommandRow[],
  envelopeRows: TightWriteEnvelopeRow[],
  errors: string[],
): void {
  const contractText = row.requiredContractRows.toLowerCase();
  const evidenceText = row.runtimeBrowserEvidence.toLowerCase();
  const routeAwayText = row.routeAwaySplitNotes.toLowerCase();
  const proofText = proofRows.map((proof) => `${proof.requiredProofLayers} ${proof.requiredCommands} ${proof.mockHonestyNotes}`).join(" ").toLowerCase();
  const writeText = `${task.allowedWriteSet} ${envelopeRows.map((envelope) => envelope.exactFilesOrPatterns).join(" ")}`.toLowerCase();

  if (row.changeClass === "app-adoption") {
    const consumesExistingSeam = seamRows.some((seam) => seam.seamPosture === "consumes-existing-seam" || seam.seamPosture === "approved-exception");
    if (!consumesExistingSeam || adoptionRows.length === 0 || !contractText.includes("frontend adoption contract")) {
      errors.push(`${task.taskId} app-adoption frontend change class requires a consumed GOV:design-system seam and Frontend Adoption Contract`);
    }
  }

  if (row.changeClass === "route-module-behavior") {
    const approvedModulePlacement = frontendArchitectureRows.some((architecture) => architecture.sourcePlacement === "module-journey-files");
    if (!approvedModulePlacement || mentionsRootAdminShellEntry(writeText)) {
      errors.push(`${task.taskId} route-module-behavior frontend change class must use approved module/journey files and avoid shell entry behavior`);
    }
  }

  if (row.changeClass === "interaction-behavior") {
    const hasInteractionSubStandard = subStandardRows.some((subStandard) => subStandard.primarySubStandard === "interaction-behavior");
    if (!hasInteractionSubStandard || !mentionsInteractionScenario(`${evidenceText} ${proofText}`)) {
      errors.push(`${task.taskId} interaction-behavior frontend change class requires exact interaction/state-transition proof`);
    }
  }

  if (row.changeClass === "permission-rendering") {
    if (permissionRows.length === 0 || !contractText.includes("permission")) {
      errors.push(`${task.taskId} permission-rendering frontend change class requires permission rendering evidence`);
    }
  }

  if (row.changeClass === "api-projection-consumer") {
    if (runtimeRows.length === 0 || !contractText.includes("runtime data") || !contractText.includes("mock")) {
      errors.push(`${task.taskId} api-projection-consumer frontend change class requires runtime data and mock-honesty contract rows`);
    }
  }

  if (row.changeClass === "topology-materialization-consumer") {
    const materialized = frontendArchitectureRows.some((architecture) => architecture.materializationModel === "preview-apply-required");
    if (!materialized || !mentionsPreviewApplyOrMaterializationText(`${evidenceText} ${routeAwayText}`)) {
      errors.push(`${task.taskId} topology-materialization-consumer frontend change class requires approved preview/apply materialization evidence`);
    }
  }

  if (row.changeClass === "runtime-defect-fix" && !mentionsRuntimeDefectEvidence(`${evidenceText} ${proofText}`)) {
    errors.push(`${task.taskId} runtime-defect-fix frontend change class requires live process, served asset/module, runtime payload, and regression proof`);
  }

  if (row.changeClass === "accessibility-semantics") {
    const hasAccessibilitySubStandard = subStandardRows.some((subStandard) => subStandard.primarySubStandard === "accessibility-semantics");
    if (!hasAccessibilitySubStandard || !mentionsAccessibilitySemanticsProof(`${evidenceText} ${proofText}`)) {
      errors.push(`${task.taskId} accessibility-semantics frontend change class requires role/name/state/focus proof`);
    }
  }

  if (row.changeClass === "visual-rendering") {
    const hasVisualSubStandard = subStandardRows.some((subStandard) => subStandard.primarySubStandard === "visual-rendering");
    if (!hasVisualSubStandard || !mentionsScreenshotOrEvidenceArtifact(`${evidenceText} ${proofText}`)) {
      errors.push(`${task.taskId} visual-rendering frontend change class requires rendered browser/canonical screenshot evidence`);
    }
  }

  if (mentionsEvidenceOnlyFrontendWork(`${task.scope} ${row.routeAwaySplitNotes}`) && !routeAwayText.includes("evidence:qa-evidence")) {
    errors.push(`${task.taskId} evidence-only frontend work must route to EVIDENCE:qa-evidence`);
  }
}

function validateFrontendSubStandard(task: TaskRow, rows: FrontendSubStandardRow[], errors: string[]): void {
  if (!frontendTaskTypes.has(task.taskType)) {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:frontend/GOV:design-system task has no sub-standard row`);
    return;
  }

  for (const row of rows) {
    if (!allowedFrontendDesignSystemSubStandards.has(row.primarySubStandard)) {
      errors.push(`${task.taskId} has invalid DEV:frontend/GOV:design-system sub-standard: ${row.primarySubStandard || "(blank)"}`);
    }

    validateRequiredField(task.taskId, "Additional Sub-Standards", row.additionalSubStandards, errors);
    validateRequiredField(task.taskId, "Frontend / Design-System Split Rationale", row.splitRationale, errors);
    validateRequiredField(task.taskId, "Frontend / Design-System Compliance Proof", row.complianceProof, errors);

    if (row.primarySubStandard === "not-applicable" && task.taskType !== "DEV:vertical-slice") {
      errors.push(`${task.taskId} ${task.taskType} task must name a DEV:frontend/GOV:design-system sub-standard`);
    }

    if (row.primarySubStandard === "not-applicable" && !mentionsNotApplicableRationale(row.splitRationale, row.complianceProof)) {
      errors.push(`${task.taskId} not-applicable DEV:frontend/GOV:design-system sub-standard requires concrete rationale`);
    }

    validateFrontendSubStandardProof(task.taskId, row, errors);

    if (hasMeaningfulAdditionalSubStandards(row.additionalSubStandards) && !mentionsInseparable(row.splitRationale, "")) {
      errors.push(`${task.taskId} has additional DEV:frontend/GOV:design-system sub-standards without inseparable split rationale`);
    }
  }
}

function validateFrontendSubStandardProof(taskId: string, row: FrontendSubStandardRow, errors: string[]): void {
  if (!allowedFrontendDesignSystemSubStandards.has(row.primarySubStandard)) {
    return;
  }

  if (row.primarySubStandard === "not-applicable") {
    return;
  }

  const proof = row.complianceProof;
  if (row.primarySubStandard === "fixture-data-contract" && !mentionsFixtureDataContractProof(proof)) {
    errors.push(`${taskId} fixture-data-contract sub-standard requires contract/fixture/live-payload proof`);
  }

  if (row.primarySubStandard === "visual-rendering" && !mentionsScreenshotOrEvidenceArtifact(proof)) {
    errors.push(`${taskId} visual-rendering sub-standard requires a canonical screenshot or evidence artifact name`);
  }

  if (row.primarySubStandard === "interaction-behavior" && !mentionsInteractionScenario(proof)) {
    errors.push(`${taskId} interaction-behavior sub-standard requires an exact state transition or interaction scenario name`);
  }

  if (row.primarySubStandard === "accessibility-semantics" && !mentionsAccessibilitySemanticsProof(proof)) {
    errors.push(`${taskId} accessibility-semantics sub-standard requires role/name/state/focus proof`);
  }

  if (row.primarySubStandard === "evidence-sweep" && !mentionsEvidenceSweepArtifactsAndScope(proof)) {
    errors.push(`${taskId} evidence-sweep sub-standard requires exact evidence artifact names and sweep scope`);
  }
}

function validateFrontendPerformancePosture(task: TaskRow, rows: FrontendPerformancePostureRow[], errors: string[]): void {
  if (!frontendTaskTypes.has(task.taskType)) {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:frontend/GOV:design-system task has no performance posture row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Frontend Performance Posture", row.posture, errors);
    validateRequiredField(task.taskId, "Frontend Performance Proof Plan", row.proofPlan, errors);
    validateRequiredField(task.taskId, "Frontend Performance Rationale", row.rationale, errors);

    if (!allowedFrontendPerformancePostures.has(row.posture)) {
      errors.push(`${task.taskId} has invalid DEV:frontend performance posture: ${row.posture || "(blank)"}`);
      continue;
    }

    if (row.posture === "unknown-blocked") {
      errors.push(`${task.taskId} DEV:frontend performance posture unknown-blocked cannot be queued for delivery`);
      continue;
    }

    if (row.posture === "not-applicable" && !mentionsNotApplicableRationale(row.rationale, row.proofPlan)) {
      errors.push(`${task.taskId} not-applicable DEV:frontend performance posture requires concrete rationale`);
    }

    validateFrontendPerformanceProof(task.taskId, row, errors);
  }
}

function validateFrontendPerformanceProof(taskId: string, row: FrontendPerformancePostureRow, errors: string[]): void {
  const proof = `${row.proofPlan} ${row.rationale}`;

  if (row.posture === "static-low-risk" && !mentionsStaticLowRiskPerformanceProof(proof)) {
    errors.push(`${taskId} static-low-risk performance posture must explain why render proof is sufficient`);
  }

  if (row.posture === "interactive-low-risk" && !mentionsInteractiveLowRiskPerformanceProof(proof)) {
    errors.push(`${taskId} interactive-low-risk performance posture requires interaction proof with no repeated work or fetch loop`);
  }

  if (row.posture === "data-list-or-table" && !mentionsDataListPerformanceProof(proof)) {
    errors.push(`${taskId} data-list-or-table performance posture requires bounded data-size and DOM/list rendering proof`);
  }

  if (row.posture === "route-initialization" && !mentionsRouteInitializationPerformanceProof(proof)) {
    errors.push(`${taskId} route-initialization performance posture requires route init/load proof or Lighthouse/trace evidence`);
  }

  if (row.posture === "large-dom-or-canvas" && !mentionsLargeDomCanvasPerformanceProof(proof)) {
    errors.push(`${taskId} large-dom-or-canvas performance posture requires bounded DOM/canvas size and nonblank interaction proof`);
  }

  if (row.posture === "asset-heavy" && !mentionsAssetHeavyPerformanceProof(proof)) {
    errors.push(`${taskId} asset-heavy performance posture requires asset size/loading strategy and rendered asset evidence`);
  }

  if (row.posture === "animation-or-transition-heavy" && !mentionsAnimationPerformanceProof(proof)) {
    errors.push(`${taskId} animation-or-transition-heavy performance posture requires timing or reduced-motion proof`);
  }
}

function validateDesignSystemSeamContract(task: TaskRow, rows: DesignSystemSeamContractRow[], errors: string[]): void {
  if (!frontendTaskTypes.has(task.taskType)) {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:frontend/GOV:design-system task has no GOV:design-system seam contract row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Design-System Seam Posture", row.seamPosture, errors);
    validateRequiredField(task.taskId, "Design-System Seam Name / Export / Route", row.seamNameExportRoute, errors);
    validateRequiredField(task.taskId, "Owned Render Structure", row.ownedRenderStructure, errors);
    validateRequiredField(task.taskId, "Owned Behavior Controller", row.ownedBehaviorController, errors);
    validateRequiredField(task.taskId, "Owned Accessibility Semantics", row.ownedAccessibilitySemantics, errors);
    validateRequiredField(task.taskId, "Canonical / Behavior Lock / Evidence", row.canonicalBehaviorLockEvidence, errors);
    validateRequiredField(task.taskId, "Frontend Consumption Contract", row.frontendConsumptionContract, errors);

    if (!allowedDesignSystemSeamPostures.has(row.seamPosture)) {
      errors.push(`${task.taskId} has invalid GOV:design-system seam posture: ${row.seamPosture || "(blank)"}`);
    }

    if (task.taskType === "GOV:design-system" && !isDesignSystemProducerPosture(row.seamPosture)) {
      errors.push(`${task.taskId} GOV:design-system task must produce, refine, or prove a consumable seam`);
    }

    if (task.taskType === "DEV:frontend" && !isFrontendConsumerPosture(row.seamPosture)) {
      errors.push(`${task.taskId} DEV:frontend task must consume an existing GOV:design-system seam or record an approved exception`);
    }

    if (task.taskType === "DEV:vertical-slice" && row.seamPosture === "blocks-on-missing-seam") {
      errors.push(`${task.taskId} queued DEV:vertical-slice task cannot proceed with a missing GOV:design-system seam`);
    }

    if (row.seamPosture !== "not-applicable" && !mentionsDesignSystemSeam(row.seamNameExportRoute, row.frontendConsumptionContract)) {
      errors.push(`${task.taskId} GOV:design-system seam contract must name a consumable route, export, component, or controller seam`);
    }
  }
}

function validateDesignSystemSeamClassContract(
  task: TaskRow,
  rows: DesignSystemSeamClassContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "GOV:design-system") {
    if (rows.length > 0 && task.taskType !== "DEV:frontend" && task.taskType !== "DEV:vertical-slice") {
      errors.push(`${task.taskId} has Design-System Seam Class Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued GOV:design-system task has no design-system seam class contract row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "Design-System Seam Class", row.seamClass, allowedDesignSystemSeamClasses, errors);
    validateRequiredField(task.taskId, "Design-System Class-Specific Required Proof", row.classSpecificRequiredProof, errors);
    validateRequiredField(task.taskId, "Design-System Downstream Consumption Boundary", row.downstreamConsumptionBoundary, errors);
    validateRequiredField(task.taskId, "Design-System Forbidden App / Evidence / Standards Work", row.forbiddenAppEvidenceStandardsWork, errors);

    validateDesignSystemSeamClassSpecifics(task.taskId, row, errors);
  }
}

function validateDesignSystemSeamClassSpecifics(taskId: string, row: DesignSystemSeamClassContractRow, errors: string[]): void {
  const proof = row.classSpecificRequiredProof.toLowerCase();
  const boundary = row.downstreamConsumptionBoundary.toLowerCase();
  const forbidden = row.forbiddenAppEvidenceStandardsWork.toLowerCase();
  const combined = `${proof} ${boundary} ${forbidden}`;
  const forbiddenRequiresRouting = !forbidden.includes("not-applicable") && !forbidden.includes("unchanged");

  if (row.seamClass === "render-structure-seam" && !mentionsRenderStructureSeamProof(combined)) {
    errors.push(`${taskId} render-structure-seam design-system class must name renderer/component/template/export proof and prohibit copied markup`);
  }

  if (row.seamClass === "behavior-controller-seam" && !mentionsBehaviorControllerSeamProof(combined)) {
    errors.push(`${taskId} behavior-controller-seam design-system class must name controller/state/event proof and prohibit copied interaction logic`);
  }

  if (row.seamClass === "accessibility-semantics-seam" && !mentionsAccessibilitySeamProof(combined)) {
    errors.push(`${taskId} accessibility-semantics-seam design-system class must name role/name/state/focus proof and prohibit copied ARIA/state behavior`);
  }

  if (row.seamClass === "style-css-seam" && !mentionsStyleCssSeamProof(combined)) {
    errors.push(`${taskId} style-css-seam design-system class must name governed CSS/style seam proof and prohibit app-page CSS drift`);
  }

  if (row.seamClass === "fixture-data-contract" && !mentionsFixtureDataContractProof(combined)) {
    errors.push(`${taskId} fixture-data-contract design-system class must name contract, fixture, and live/runtime payload proof`);
  }

  if (row.seamClass === "canonical-evidence-update" && !mentionsCanonicalEvidenceUpdateProof(combined)) {
    errors.push(`${taskId} canonical-evidence-update design-system class must name canonical route, behavior lock, and screenshot/evidence artifact proof`);
  }

  if (forbiddenRequiresRouting && mentionsAppFrontendImplementationPath(forbidden) && !forbidden.includes("dev:frontend")) {
    errors.push(`${taskId} Design-System Seam Class Contract app adoption work must route to DEV:frontend`);
  }

  if (
    forbiddenRequiresRouting &&
    (forbidden.includes("screenshot") || forbidden.includes("evidence sweep") || forbidden.includes("served asset")) &&
    !forbidden.includes("evidence:qa-evidence")
  ) {
    errors.push(`${taskId} Design-System Seam Class Contract evidence-only work must route to EVIDENCE:qa-evidence`);
  }

  if (
    forbiddenRequiresRouting &&
    (forbidden.includes("standard") || forbidden.includes("architecture")) &&
    !forbidden.includes("gov:standards-update") &&
    !forbidden.includes("gov:architecture-update")
  ) {
    errors.push(`${taskId} Design-System Seam Class Contract standards or architecture work must route to GOV:standards-update or GOV:architecture-update`);
  }
}

function validateFrontendAdoptionContract(
  task: TaskRow,
  seamRows: DesignSystemSeamContractRow[],
  rows: FrontendAdoptionContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "DEV:frontend") {
    return;
  }

  const consumesExistingSeam = seamRows.some((row) => row.seamPosture === "consumes-existing-seam");
  if (!consumesExistingSeam) {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} DEV:frontend task consuming an existing GOV:design-system seam must have a DEV:frontend adoption contract row`);
    return;
  }

  for (const row of rows) {
    validateRequiredOrConcreteNotApplicable(
      task.taskId,
      "Consumed DS Render Seam",
      row.consumedRenderSeam,
      errors,
    );
    validateRequiredOrConcreteNotApplicable(
      task.taskId,
      "Consumed DS Behavior / Controller Seam",
      row.consumedBehaviorControllerSeam,
      errors,
    );
    validateRequiredOrConcreteNotApplicable(
      task.taskId,
      "Consumed DS Accessibility Semantics",
      row.consumedAccessibilitySemantics,
      errors,
    );
    validateRequiredOrConcreteNotApplicable(
      task.taskId,
      "Consumed DS Style / CSS Seam",
      row.consumedStyleCssSeam,
      errors,
    );
    validateRequiredField(
      task.taskId,
      "Allowed App-Local Composition / Data Binding",
      row.allowedAppLocalCompositionDataBinding,
      errors,
    );
    validateRequiredField(task.taskId, "Forbidden Local Reconstruction", row.forbiddenLocalReconstruction, errors);
    validateRequiredField(task.taskId, "Adoption Proof Route / Scenario", row.adoptionProofRouteScenario, errors);

    if (!explicitlyProhibitsCopiedDsInternals(row.forbiddenLocalReconstruction)) {
      errors.push(`${task.taskId} forbidden local reconstruction must explicitly prohibit copied markup, controller, ARIA, and CSS`);
    }

    if (claimsGovernedDsInternalOwnership(row.allowedAppLocalCompositionDataBinding)) {
      errors.push(`${task.taskId} app-local composition/data binding cannot claim ownership of governed render/controller/accessibility/style internals`);
    }
  }
}

function validateFrontendSecurityEvidence(
  task: TaskRow,
  rows: FrontendSecurityEvidenceRow[],
  sourceRows: SourceBrowserSecurityPostureRow[],
  errors: string[],
): void {
  if (!frontendTaskTypes.has(task.taskType)) {
    return;
  }

  if (sourceRows.length === 0) {
    errors.push(`${task.taskId} queued DEV:frontend/GOV:design-system task has no Layer 2/3 browser security posture snapshot`);
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:frontend/GOV:design-system task has no DEV:frontend security evidence row`);
    return;
  }

  const sourceByArea = new Map(sourceRows.map((row) => [row.securityArea, row]));
  const rowsByArea = new Map(rows.map((row) => [row.securityArea, row]));

  for (const source of sourceRows) {
    validateBrowserSecuritySourceRow(source, errors);

    if (source.present === "blocked") {
      errors.push(`${task.taskId} browser security posture ${source.securityArea} is blocked in Layer 2/3`);
    }

    if (source.present === "yes" || source.stopIfMissing === "yes") {
      const row = rowsByArea.get(source.securityArea);
      if (!row) {
        errors.push(`${task.taskId} missing DEV:frontend security evidence for ${source.securityArea}`);
      }
    }
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Frontend Security Area", row.securityArea, errors);
    validateRequiredField(task.taskId, "Source Present", row.sourcePresent, errors);
    validateRequiredField(task.taskId, "Layer 2 Decision / Evidence", row.layer2DecisionEvidence, errors);
    validateRequiredField(task.taskId, "Required Layer 4 Signal", row.requiredLayer4Signal, errors);
    validateRequiredField(task.taskId, "Layer 4 Evidence Plan / Blocking Reason", row.layer4EvidencePlan, errors);

    validateAllowedValue(task.taskId, "Frontend Security Area", row.securityArea, allowedFrontendBrowserSecurityAreas, errors);
    validateAllowedValue(task.taskId, "Source Present", row.sourcePresent, allowedSecurityPresence, errors);

    if (row.securityArea === "not-applicable") {
      continue;
    }

    const source = sourceByArea.get(row.securityArea);
    if (!source) {
      errors.push(`${task.taskId} DEV:frontend security evidence invents Layer 2 posture for ${row.securityArea}`);
      continue;
    }

    if (row.sourcePresent !== source.present) {
      errors.push(`${task.taskId} DEV:frontend security evidence for ${row.securityArea} does not match Layer 2/3 present value`);
    }

    if (row.layer2DecisionEvidence !== source.decisionEvidence) {
      errors.push(`${task.taskId} DEV:frontend security evidence for ${row.securityArea} does not match Layer 2/3 decision evidence`);
    }

    if (row.requiredLayer4Signal !== source.requiredLayer4Signal) {
      errors.push(`${task.taskId} DEV:frontend security evidence for ${row.securityArea} does not match Layer 2/3 required Layer 4 signal`);
    }

    if (source.present === "yes" && !mentionsRuntimeEvidence(row.layer4EvidencePlan)) {
      errors.push(`${task.taskId} DEV:frontend security evidence for ${row.securityArea} must name proof or runtime evidence`);
    }
  }
}

function validateBrowserSecuritySourceRow(source: SourceBrowserSecurityPostureRow, errors: string[]): void {
  validateRequiredField(source.securityArea, "Security Area", source.securityArea, errors);
  validateRequiredField(source.securityArea, "Present", source.present, errors);
  validateRequiredField(source.securityArea, "Layer 2 Decision / Evidence", source.decisionEvidence, errors);
  validateRequiredField(source.securityArea, "Required Layer 4 Signal", source.requiredLayer4Signal, errors);
  validateRequiredField(source.securityArea, "Stop If Missing", source.stopIfMissing, errors);
  validateAllowedValue(source.securityArea, "Security Area", source.securityArea, allowedFrontendBrowserSecurityAreas, errors);
  validateAllowedValue(source.securityArea, "Present", source.present, allowedSecurityPresence, errors);
  validateAllowedValue(source.securityArea, "Stop If Missing", source.stopIfMissing, allowedYesNo, errors);
}

function validateFrontendPermissionRenderingEvidence(
  task: TaskRow,
  frontendArchitectureRows: FrontendArchitectureDecisionRow[],
  securityRows: FrontendSecurityEvidenceRow[],
  rows: FrontendPermissionRenderingEvidenceRow[],
  errors: string[],
): void {
  if (!frontendTaskTypes.has(task.taskType)) {
    return;
  }

  const required = requiresPermissionRenderingEvidence(task, frontendArchitectureRows, securityRows);
  if (!required) {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} renders sensitive DEV:frontend data but has no permission rendering evidence row`);
    return;
  }

  const tenantScoped = frontendArchitectureRows.some((row) => row.actorScope === "tenant-actor") || mentionsTenantScope(task.scope, task.allowedWriteSet);

  for (const row of rows) {
    validateRequiredField(task.taskId, "Sensitive Rendering Scope", row.sensitiveRenderingScope, errors);
    validateRequiredField(task.taskId, "Allowed State Proof", row.allowedStateProof, errors);
    validateRequiredField(task.taskId, "Denied / Unauthorized State Proof", row.deniedUnauthorizedStateProof, errors);
    validateRequiredField(task.taskId, "Expired / Unauthenticated State Proof", row.expiredUnauthenticatedStateProof, errors);
    validateRequiredField(task.taskId, "Cross-Tenant Denial Proof", row.crossTenantDenialProof, errors);

    if (!mentionsAllowedProof(row.allowedStateProof)) {
      errors.push(`${task.taskId} permission rendering evidence must prove the allowed state`);
    }

    if (!mentionsDeniedProof(row.deniedUnauthorizedStateProof)) {
      errors.push(`${task.taskId} permission rendering evidence must prove denied or unauthorized state`);
    }

    if (!mentionsExpiredOrUnauthenticated(row.expiredUnauthenticatedStateProof)) {
      errors.push(`${task.taskId} permission rendering evidence must prove expired or unauthenticated state`);
    }

    if (tenantScoped && !mentionsCrossTenantDenial(row.crossTenantDenialProof)) {
      errors.push(`${task.taskId} tenant-scoped permission rendering evidence must prove cross-tenant denial`);
    }
  }
}

function validateFrontendRuntimeDataMockHonesty(
  task: TaskRow,
  frontendArchitectureRows: FrontendArchitectureDecisionRow[],
  rows: FrontendRuntimeDataMockHonestyRow[],
  proofRows: ProofCommandRow[],
  errors: string[],
): void {
  if (!frontendTaskTypes.has(task.taskType)) {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:frontend/GOV:design-system task has no runtime data and mock-honesty row`);
    return;
  }

  const requiresRuntimeTie = requiresRuntimeDataEvidence(task, frontendArchitectureRows, proofRows, rows);

  for (const row of rows) {
    validateRequiredField(task.taskId, "Governing API / Projection Contract", row.governingContract, errors);
    validateRequiredField(task.taskId, "Fixture Source", row.fixtureSource, errors);
    validateRequiredField(task.taskId, "Mock-Honesty Statement", row.mockHonestyStatement, errors);

    const hasLiveEvidence = hasMeaningfulEvidence(row.liveRuntimePayloadEvidence);
    const hasUnavailableReason = hasMeaningfulEvidence(row.unavailableReason);

    if (!hasLiveEvidence && !hasUnavailableReason) {
      errors.push(`${task.taskId} runtime data evidence must include live/runtime payload evidence or an explicit unavailable reason`);
    }

    if (!mentionsMockHonesty(row.mockHonestyStatement)) {
      errors.push(`${task.taskId} runtime data evidence must include a mock-honesty statement`);
    }

    if (requiresRuntimeTie && isNotApplicableValue(row.governingContract) && !hasLiveEvidence) {
      errors.push(`${task.taskId} rendered proof using mocks requires a governing API/projection contract or live runtime payload evidence`);
    }
  }
}

function validateVerticalSliceCoupling(
  task: TaskRow,
  rows: VerticalSliceCouplingRow[],
  errors: string[],
): void {
  if (task.taskType !== "DEV:vertical-slice") {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:vertical-slice task has no vertical slice coupling row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Vertical Slice Journey Behavior", row.journeyBehavior, errors);
    validateRequiredField(task.taskId, "Vertical Slice Backend Seam", row.backendSeam, errors);
    validateRequiredField(task.taskId, "Vertical Slice Frontend Seam", row.frontendSeam, errors);
    validateRequiredField(task.taskId, "Vertical Slice API / Data Contract", row.apiDataContract, errors);
    validateRequiredField(task.taskId, "Vertical Slice Browser Proof Story", row.browserProofStory, errors);
    validateRequiredField(
      task.taskId,
      "Why Backend And Frontend Proof Are Inseparable",
      row.inseparableProofRationale,
      errors,
    );
    validateRequiredField(task.taskId, "Vertical Slice Split Rejection Rationale", row.splitRejectionRationale, errors);

    if (!mentionsInseparable(row.inseparableProofRationale, row.splitRejectionRationale)) {
      errors.push(`${task.taskId} vertical slice must explain why DEV:backend and DEV:frontend proof are inseparable`);
    }

    if (!mentionsBackendToFrontendSeamRisk(row.inseparableProofRationale, row.splitRejectionRationale)) {
      errors.push(`${task.taskId} vertical slice must name the backend-to-frontend seam risk that makes split proof insufficient`);
    }

    if (!mentionsJourneyBehavior(row.journeyBehavior, row.browserProofStory)) {
      errors.push(`${task.taskId} vertical slice must name one journey behavior and browser proof story`);
    }

    if (!mentionsBackendAndFrontendSeams(row.backendSeam, row.frontendSeam)) {
      errors.push(`${task.taskId} vertical slice must name both DEV:backend and DEV:frontend seams`);
    }

    if (!mentionsContractOrPayload(row.apiDataContract)) {
      errors.push(`${task.taskId} vertical slice must name an API/data contract or payload seam`);
    }

    if (mentionsShortcutScope(task.scope, row.splitRejectionRationale)) {
      errors.push(`${task.taskId} vertical slice cannot be used as a shortcut around separable task types`);
    }
  }
}

function validateVerticalSliceSplitPressure(
  task: TaskRow,
  rows: VerticalSliceSplitPressureRow[],
  errors: string[],
): void {
  if (task.taskType !== "DEV:vertical-slice") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Vertical Slice Split Pressure rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:vertical-slice task has no split-pressure rows`);
    return;
  }

  const concerns = new Set(rows.map((row) => row.concern));
  for (const concern of requiredVerticalSliceSplitConcerns) {
    if (!concerns.has(concern)) {
      errors.push(`${task.taskId} vertical slice split pressure is missing concern ${concern}`);
    }
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Vertical Slice Split Concern", row.concern, errors);
    validateRequiredField(task.taskId, "Vertical Slice Split Decision", row.splitDecision, errors);
    validateRequiredField(task.taskId, "Vertical Slice Coupling / Not-Applicable Rationale", row.rationale, errors);
    validateRequiredField(task.taskId, "Vertical Slice Owning Task If Split", row.owningTaskIfSplit, errors);
    validateAllowedValue(task.taskId, "Vertical Slice Split Concern", row.concern, allowedVerticalSliceSplitConcerns, errors);
    validateAllowedValue(task.taskId, "Vertical Slice Split Decision", row.splitDecision, allowedVerticalSliceSplitDecisions, errors);

    if (row.splitDecision === "blocked" || row.splitDecision === "split-before-delivery") {
      errors.push(`${task.taskId} vertical slice split pressure ${row.concern} is ${row.splitDecision} and blocks delivery`);
    }

    if (
      ["backend-behavior", "frontend-behavior", "api-data-contract"].includes(row.concern) &&
      !["inseparable-in-slice", "approved-preexisting"].includes(row.splitDecision)
    ) {
      errors.push(`${task.taskId} vertical slice ${row.concern} must be inseparable-in-slice or approved-preexisting`);
    }

    if (row.splitDecision === "not-applicable" && !mentionsNotApplicableRationale(row.rationale, row.owningTaskIfSplit)) {
      errors.push(`${task.taskId} vertical slice split pressure ${row.concern} needs concrete not-applicable rationale`);
    }

    if (row.splitDecision === "inseparable-in-slice" && !mentionsVerticalSliceCouplingRationale(row.rationale)) {
      errors.push(`${task.taskId} vertical slice split pressure ${row.concern} must explain the backend-to-frontend coupling`);
    }

    if (row.concern === "qa-evidence" && row.splitDecision === "inseparable-in-slice" && mentionsEvidenceOnlyFrontendWork(row.rationale)) {
      errors.push(`${task.taskId} evidence-only vertical slice work must route to EVIDENCE:qa-evidence`);
    }
  }
}

function validateBackendImplementationApproach(
  task: TaskRow,
  rows: BackendImplementationApproachRow[],
  errors: string[],
): void {
  if (task.taskType !== "DEV:backend") {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:backend task has no DEV:backend implementation approach row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "Backend Change Class", row.changeClass, allowedBackendChangeClasses, errors);
    validateRequiredField(task.taskId, "Approved Source Authority", row.approvedSourceAuthority, errors);
    validateRequiredField(task.taskId, "Backend Feature Owner", row.featureOwner, errors);
    validateRequiredField(task.taskId, "Backend Capability File Strategy", row.capabilityFileStrategy, errors);
    validateRequiredField(task.taskId, "Backend Source Inventory", row.backendSourceInventory, errors);
    validateRequiredField(task.taskId, "Exact Write Envelope", row.exactWriteEnvelope, errors);
    validateRequiredField(task.taskId, "Expected Files / Layers", row.expectedFilesLayers, errors);
    validateRequiredField(task.taskId, "Layer Responsibilities", row.layerResponsibilities, errors);
    validateRequiredField(task.taskId, "Contract / API Posture", row.contractApiPosture, errors);
    validateRequiredField(task.taskId, "Authz / Tenant / Lifecycle Posture", row.authzTenantLifecyclePosture, errors);
    validateRequiredField(task.taskId, "Persistence / Migration Posture", row.persistenceMigrationPosture, errors);
    validateRequiredField(task.taskId, "Public Seam / Manifest Impact", row.publicSeamManifestImpact, errors);
    validateRequiredField(task.taskId, "Artifact Obligations", row.artifactObligations, errors);
    validateRequiredField(task.taskId, "Scaffold / Script Command", row.scaffoldScriptCommand, errors);
    validateRequiredField(task.taskId, "Expected Backend Output", row.expectedBackendOutput, errors);
    validateRequiredField(task.taskId, "Split / Blocked Follow-Up", row.splitBlockedFollowUp, errors);
    validateRequiredField(task.taskId, "Proof Commands", row.proofCommands, errors);
    validateRequiredField(
      task.taskId,
      "Formatting / Generated Artifact Expectations",
      row.formattingGeneratedArtifactExpectations,
      errors,
    );
    validateRequiredField(task.taskId, "Human Review Boundary", row.humanReviewBoundary, errors);

    if (!allowedBackendCapabilityFileStrategies.has(row.capabilityFileStrategy)) {
      errors.push(`${task.taskId} has invalid DEV:backend capability file strategy: ${row.capabilityFileStrategy || "(blank)"}`);
    }

    if (!mentionsBackendFeatureOwner(row.featureOwner)) {
      errors.push(`${task.taskId} DEV:backend feature owner should name a src/features/<featureName> owner`);
    }

    const authority = row.approvedSourceAuthority.toLowerCase();
    if (!mentionsApprovedBackendSourceAuthority(authority)) {
      errors.push(`${task.taskId} DEV:backend needs approved source authority from story, PRD, capability, Technical Steering, ADR, API contract, permission mapping, data dictionary, standard, or implementation blueprint`);
    }

    const writeEnvelope = row.exactWriteEnvelope.replace(/\\/g, "/").toLowerCase();
    if (!mentionsScriptableInventory(row.backendSourceInventory)) {
      errors.push(`${task.taskId} DEV:backend needs scriptable backend source inventory`);
    }
    if (mentionsBroadBackendWriteEnvelope(writeEnvelope)) {
      errors.push(`${task.taskId} DEV:backend must use an exact or narrow feature-local write envelope, not broad backend/source edits`);
    }
    if (!writeEnvelope.includes("src/features/") && !writeEnvelope.includes("tests/") && !writeEnvelope.includes("exact") && !writeEnvelope.includes("narrow")) {
      errors.push(`${task.taskId} DEV:backend write envelope must name exact files or narrow src/features/tests path patterns`);
    }

    if (row.capabilityFileStrategy === "not-applicable-with-rationale" && !mentionsNotApplicableRationale(row.expectedFilesLayers, row.layerResponsibilities)) {
      errors.push(`${task.taskId} DEV:backend not-applicable capability strategy needs rationale`);
    }

    const apiPosture = row.contractApiPosture.toLowerCase();
    if (requiresBackendApiContractPosture(row.changeClass) && !mentionsApiContractPosture(apiPosture)) {
      errors.push(`${task.taskId} DEV:backend ${row.changeClass} must name approved API/contract posture or DOC:api-contract split`);
    }

    const authzPosture = row.authzTenantLifecyclePosture.toLowerCase();
    if (requiresBackendAuthzPosture(row.changeClass, task.scope, task.allowedWriteSet) && !mentionsBackendAuthzPosture(authzPosture)) {
      errors.push(`${task.taskId} DEV:backend protected/authz/lifecycle work must name authz, tenant, lifecycle, allow/deny, or not-applicable posture`);
    }

    const persistencePosture = row.persistenceMigrationPosture.toLowerCase();
    if (requiresBackendPersistencePosture(row.changeClass) && !mentionsBackendPersistencePosture(persistencePosture)) {
      errors.push(`${task.taskId} DEV:backend ${row.changeClass} must name persistence/repository posture or DEV:migration-persistence split`);
    }

    const scaffold = row.scaffoldScriptCommand.toLowerCase();
    if (!mentionsScriptCommandOrRationale(scaffold)) {
      errors.push(`${task.taskId} DEV:backend scaffold/script command must name a generator/check command or not-applicable rationale`);
    }

    const expectedOutput = row.expectedBackendOutput.toLowerCase();
    if (
      !expectedOutput.includes("behavior") &&
      !expectedOutput.includes("route") &&
      !expectedOutput.includes("response") &&
      !expectedOutput.includes("repository") &&
      !expectedOutput.includes("manifest") &&
      !expectedOutput.includes("audit") &&
      !expectedOutput.includes("event") &&
      !expectedOutput.includes("lifecycle") &&
      !expectedOutput.includes("not-applicable")
    ) {
      errors.push(`${task.taskId} DEV:backend must name expected backend output or behavior target`);
    }

    const followUp = row.splitBlockedFollowUp.toLowerCase();
    const followUpRequiresRouting = !followUp.includes("not-applicable") && !followUp.includes("unchanged") && !followUp.includes("already split");
    if (followUpRequiresRouting) {
      validateBackendSplitRouting(task.taskId, followUp, errors);
    }

    if (apiPosture.includes("changing") && !followUp.includes("doc:api-contract")) {
      errors.push(`${task.taskId} DEV:backend API contract changes must route to DOC:api-contract`);
    }
    if (persistencePosture.includes("schema") || persistencePosture.includes("migration") || persistencePosture.includes("index")) {
      if (!followUp.includes("dev:migration-persistence") && !persistencePosture.includes("not-applicable") && !persistencePosture.includes("no schema")) {
        errors.push(`${task.taskId} DEV:backend schema, migration, or index work must route to DEV:migration-persistence`);
      }
    }

    const proof = row.proofCommands.toLowerCase();
    if (!mentionsExecutableFocusedProof(proof)) {
      errors.push(`${task.taskId} DEV:backend proof commands must include focused behavior, route, repository, authz, lifecycle, manifest, or consumer proof`);
    }
  }
}

function mentionsApprovedBackendSourceAuthority(value: string): boolean {
  return (
    value.includes("story") ||
    value.includes("prd") ||
    value.includes("capability") ||
    value.includes("technical steering") ||
    value.includes("adr") ||
    value.includes("api contract") ||
    value.includes("permission mapping") ||
    value.includes("data dictionary") ||
    value.includes("standard") ||
    value.includes("implementation blueprint")
  );
}

function mentionsBroadBackendWriteEnvelope(value: string): boolean {
  return (
    value === "src/" ||
    value === "src/*" ||
    value === "src/features/" ||
    value === "src/features/*" ||
    value.includes("broad src") ||
    value.includes("broad backend") ||
    value.includes("all backend") ||
    value.includes("as needed") ||
    value.includes("etc.")
  );
}

function requiresBackendApiContractPosture(changeClass: string): boolean {
  return changeClass === "contract-schema" || changeClass === "transport-route" || changeClass === "projection-read-model";
}

function mentionsApiContractPosture(value: string): boolean {
  return (
    value.includes("api contract") ||
    value.includes("contract approved") ||
    value.includes("approved contract") ||
    value.includes("doc:api-contract")
  );
}

function requiresBackendAuthzPosture(changeClass: string, ...values: string[]): boolean {
  const context = values.join(" ").toLowerCase();
  return (
    changeClass === "authz-enforcement" ||
    changeClass === "lifecycle-behavior" ||
    context.includes("authz") ||
    context.includes("permission") ||
    context.includes("tenant") ||
    context.includes("root") ||
    context.includes("protected")
  );
}

function mentionsBackendAuthzPosture(value: string): boolean {
  return (
    value.includes("authz") ||
    value.includes("permission") ||
    value.includes("tenant") ||
    value.includes("root") ||
    value.includes("allow") ||
    value.includes("deny") ||
    value.includes("lifecycle")
  );
}

function requiresBackendPersistencePosture(changeClass: string): boolean {
  return (
    changeClass === "repository-consumer" ||
    changeClass === "persistence-adapter" ||
    changeClass === "transaction-consistency" ||
    changeClass === "projection-read-model" ||
    changeClass === "background-job-handler"
  );
}

function mentionsBackendPersistencePosture(value: string): boolean {
  return (
    value.includes("repository") ||
    value.includes("persistence") ||
    value.includes("schema") ||
    value.includes("migration") ||
    value.includes("existing storage") ||
    value.includes("dev:migration-persistence")
  );
}

function mentionsScriptCommandOrRationale(value: string): boolean {
  return (
    value.includes("npm run") ||
    value.includes("npx ") ||
    value.includes("node ") ||
    value.includes("tsx ") ||
    value.includes("not-applicable") ||
    value.includes("manual logic only")
  );
}

function mentionsScriptableInventory(value: string): boolean {
  const normalized = value.replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("docs/") ||
    normalized.includes("src/") ||
    normalized.includes("tests/") ||
    normalized.includes(".codex/") ||
    normalized.includes("package.json") ||
    normalized.includes("readme") ||
    normalized.includes("rg ") ||
    normalized.includes("git diff") ||
    normalized.includes("npm run") ||
    normalized.includes("node ") ||
    normalized.includes("npx ")
  );
}

function validateBackendSplitRouting(taskId: string, followUp: string, errors: string[]): void {
  if ((followUp.includes("api") || followUp.includes("openapi") || followUp.includes("postman")) && !followUp.includes("doc:api-contract")) {
    errors.push(`${taskId} DEV:backend API contract work must route to DOC:api-contract`);
  }
  if ((followUp.includes("permission") || followUp.includes("authz") || followUp.includes("grant")) && !followUp.includes("doc:permission-mapping")) {
    errors.push(`${taskId} DEV:backend permission mapping work must route to DOC:permission-mapping`);
  }
  if ((followUp.includes("data dictionary") || followUp.includes("durable fact") || followUp.includes("classification")) && !followUp.includes("doc:data-dictionary")) {
    errors.push(`${taskId} DEV:backend data dictionary work must route to DOC:data-dictionary`);
  }
  if ((followUp.includes("schema") || followUp.includes("migration") || followUp.includes("index") || followUp.includes("live data")) && !followUp.includes("dev:migration-persistence")) {
    errors.push(`${taskId} DEV:backend migration/persistence work must route to DEV:migration-persistence`);
  }
  if ((followUp.includes("platform seam") || followUp.includes("shared platform") || followUp.includes("middleware")) && !followUp.includes("dev:platform-seam")) {
    errors.push(`${taskId} DEV:backend platform seam work must route to DEV:platform-seam`);
  }
  if ((followUp.includes("test") || followUp.includes("executable proof")) && !followUp.includes("test:test-only")) {
    errors.push(`${taskId} DEV:backend executable proof-only work must route to TEST:test-only`);
  }
  if ((followUp.includes("evidence sweep") || followUp.includes("artifact sweep")) && !followUp.includes("evidence:qa-evidence")) {
    errors.push(`${taskId} DEV:backend evidence or artifact sweep work must route to EVIDENCE:qa-evidence`);
  }
}

function mentionsExecutableFocusedProof(value: string): boolean {
  return (
    (value.includes("npm run") || value.includes("npx ") || value.includes("vitest") || value.includes("playwright") || value.includes("node ")) &&
    (value.includes("tests/") ||
      value.includes("route") ||
      value.includes("domain") ||
      value.includes("repository") ||
      value.includes("persistence") ||
      value.includes("authz") ||
      value.includes("lifecycle") ||
      value.includes("manifest") ||
      value.includes("dependency") ||
      value.includes("consumer"))
  );
}

function validateMigrationPersistenceApproach(
  task: TaskRow,
  rows: MigrationPersistenceApproachRow[],
  errors: string[],
): void {
  if (task.taskType !== "DEV:migration-persistence") {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} queued DEV:migration-persistence task has no migration / persistence approach row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Migration / Persistence Change Type", row.changeType, errors);
    validateRequiredField(task.taskId, "Live Schema Check", row.liveSchemaCheck, errors);
    validateRequiredField(task.taskId, "Source Data Shape Validation", row.sourceDataShapeValidation, errors);
    validateRequiredField(task.taskId, "Per-Row Eligibility Validation", row.perRowEligibilityValidation, errors);
    validateRequiredField(task.taskId, "Rejected Row Behavior", row.rejectedRowBehavior, errors);
    validateRequiredField(task.taskId, "Migration Identity / Applied File Posture", row.migrationIdentityPosture, errors);
    validateRequiredField(task.taskId, "SQL Execution Semantics Check", row.sqlExecutionSemanticsCheck, errors);
    validateRequiredField(task.taskId, "Representative Read / Write Proof", row.representativeReadWriteProof, errors);
    validateRequiredField(task.taskId, "Postgres Harness Impact", row.postgresHarnessImpact, errors);

    if (!allowedMigrationPersistenceChangeTypes.has(row.changeType)) {
      errors.push(`${task.taskId} has invalid DEV:migration-persistence change type: ${row.changeType || "(blank)"}`);
    }

    if (row.changeType === "not-applicable-with-rationale" && !mentionsNotApplicableRationale(row.liveSchemaCheck, row.migrationIdentityPosture)) {
      errors.push(`${task.taskId} DEV:migration-persistence not-applicable change type needs rationale`);
    }

    if (
      (row.changeType === "new-migration" || row.changeType === "corrective-migration") &&
      !mentionsMigrationIdentity(row.migrationIdentityPosture)
    ) {
      errors.push(`${task.taskId} migration task must name new/corrective migration identity posture`);
    }
  }
}

function validateMigrationPersistenceClassContract(
  task: TaskRow,
  approachRows: MigrationPersistenceApproachRow[],
  classRows: MigrationPersistenceClassContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "DEV:migration-persistence") {
    if (classRows.length > 0) {
      errors.push(`${task.taskId} has Migration / Persistence Class Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (classRows.length === 0) {
    errors.push(`${task.taskId} queued DEV:migration-persistence task has no migration / persistence class contract row`);
    return;
  }

  for (const row of classRows) {
    validateAllowedValue(task.taskId, "Migration / Persistence Class", row.migrationPersistenceClass, allowedMigrationPersistenceChangeTypes, errors);
    validateRequiredField(task.taskId, "Class-Specific Required Proof", row.classSpecificRequiredProof, errors);
    validateRequiredField(task.taskId, "Required Data / Schema Coverage", row.requiredDataSchemaCoverage, errors);
    validateRequiredField(task.taskId, "Required Read / Write Or Harness Coverage", row.requiredReadWriteOrHarnessCoverage, errors);
    validateRequiredField(task.taskId, "Migration / Persistence Split / Blocked Follow-Up", row.splitBlockedFollowUp, errors);

    if (approachRows.length > 0 && !approachRows.some((approachRow) => approachRow.changeType === row.migrationPersistenceClass)) {
      errors.push(`${task.taskId} Migration / Persistence Class Contract class must match the Migration / Persistence Approach change type`);
    }

    validateMigrationPersistenceClassSpecifics(task.taskId, row, errors);
  }
}

function validateMigrationPersistenceClassSpecifics(
  taskId: string,
  row: MigrationPersistenceClassContractRow,
  errors: string[],
): void {
  const proof = row.classSpecificRequiredProof.toLowerCase();
  const dataSchema = row.requiredDataSchemaCoverage.toLowerCase();
  const readWriteHarness = row.requiredReadWriteOrHarnessCoverage.toLowerCase();
  const followUp = row.splitBlockedFollowUp.toLowerCase();
  const combined = `${proof} ${dataSchema} ${readWriteHarness} ${followUp}`;
  const followUpRequiresRouting = !followUp.includes("not-applicable") && !followUp.includes("unchanged");

  if (row.migrationPersistenceClass === "live-schema-inspection" && !mentionsLiveSchemaInspectionClassProof(combined)) {
    errors.push(`${taskId} live-schema-inspection migration class must prove live schema, indexes, and code expectations agree or route drift`);
  }

  if (row.migrationPersistenceClass === "new-migration" && !mentionsNewMigrationClassProof(combined)) {
    errors.push(`${taskId} new-migration class must prove migration identity, live start state, SQL semantics, source data shape, per-row eligibility, rejected-row behavior, and read/write paths`);
  }

  if (row.migrationPersistenceClass === "corrective-migration" && !mentionsCorrectiveMigrationClassProof(combined)) {
    errors.push(`${taskId} corrective-migration class must prove defect/drift source, repair compatibility, eligibility/rejected-row handling, and read/write paths`);
  }

  if (row.migrationPersistenceClass === "repository-query-semantics" && !mentionsRepositoryQuerySemanticsClassProof(combined)) {
    errors.push(`${taskId} repository-query-semantics class must prove query semantics and representative read/write behavior without hiding schema or index work`);
  }

  if (row.migrationPersistenceClass === "index-or-constraint" && !mentionsIndexConstraintClassProof(combined)) {
    errors.push(`${taskId} index-or-constraint class must prove index/constraint behavior, existing-data compatibility, and representative read/write paths`);
  }

  if (row.migrationPersistenceClass === "normalization-or-uniqueness" && !mentionsNormalizationUniquenessClassProof(combined)) {
    errors.push(`${taskId} normalization-or-uniqueness class must prove normalization, uniqueness, duplicate/corrupt data handling, and create/update/read behavior`);
  }

  if (row.migrationPersistenceClass === "postgres-harness-update" && !mentionsPostgresHarnessClassProof(combined)) {
    errors.push(`${taskId} postgres-harness-update class must prove shared Postgres harness/script behavior and representative persistence test consumers`);
  }

  if (row.migrationPersistenceClass === "not-applicable-with-rationale" && !mentionsNotApplicableRationale(proof, dataSchema, readWriteHarness)) {
    errors.push(`${taskId} not-applicable-with-rationale migration class must explain why migration/persistence proof is not applicable`);
  }

  if (
    followUpRequiresRouting &&
    (followUp.includes("data dictionary") || followUp.includes("durable fact") || followUp.includes("retention")) &&
    !followUp.includes("doc:data-dictionary")
  ) {
    errors.push(`${taskId} Migration / Persistence Class Contract data dictionary debt must route to DOC:data-dictionary`);
  }

  if (
    followUpRequiresRouting &&
    (followUp.includes("test") || followUp.includes("executable proof") || followUp.includes("coverage")) &&
    !followUp.includes("test:test-only")
  ) {
    errors.push(`${taskId} Migration / Persistence Class Contract executable proof debt must route to TEST:test-only`);
  }
}

function validateTightWriteEnvelope(task: TaskRow, rows: TightWriteEnvelopeRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} queued task has no tight allowed write envelope row`);
    return;
  }

  for (const row of rows) {
    if (!allowedWriteEnvelopeClasses.has(row.envelopeClass)) {
      errors.push(`${task.taskId} has invalid write envelope class: ${row.envelopeClass || "(blank)"}`);
    }

    validateRequiredField(task.taskId, "Exact Files Or Narrow Patterns", row.exactFilesOrPatterns, errors);
    validateRequiredField(task.taskId, "Broad Write Rationale", row.broadWriteRationale, errors);

    if (row.envelopeClass === "broad-pattern-blocked") {
      errors.push(`${task.taskId} write envelope is broad-pattern-blocked`);
    }

    if (isBroadFrontendWriteEnvelope(task, row) && !isApprovedBroadFrontendEnvelope(task, row)) {
      errors.push(`${task.taskId} has broad DEV:frontend/GOV:design-system write envelope without approved broad-scope rationale`);
    }
  }
}

function validateTaskSpecificProofPlan(task: TaskRow, rows: TaskSpecificProofPlanRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} queued task has no task-specific proof plan row`);
    return;
  }

  for (const row of rows) {
    if (!allowedProofSpecificityStatuses.has(row.proofSpecificity)) {
      errors.push(`${task.taskId} has invalid proof specificity: ${row.proofSpecificity || "(blank)"}`);
    }

    validateRequiredField(task.taskId, "Task-Specific Test / Scenario / Evidence Name", row.taskSpecificProofName, errors);
    validateRequiredField(task.taskId, "Broad Proof Rationale", row.broadProofRationale, errors);

    if (row.proofSpecificity === "blocked") {
      errors.push(`${task.taskId} proof specificity is blocked`);
    }

    if (row.proofSpecificity === "broad-with-rationale" && !isBroadProofAllowed(task)) {
      errors.push(`${task.taskId} broad proof requires an intentionally broad task type`);
    }
  }
}

function validateTestOnlyCoverage(
  task: TaskRow,
  coverageRows: TestOnlyCoverageContractRow[],
  matrixRows: CapabilityPermissionStateMatrixRow[],
  errors: string[],
): void {
  if (task.taskType !== "TEST:test-only") {
    return;
  }

  if (coverageRows.length === 0) {
    errors.push(`${task.taskId} queued TEST:test-only task has no TEST:test-only coverage contract row`);
    return;
  }

  const matrixRequired = isPermissionStateMatrixRequired(task, coverageRows);

  for (const row of coverageRows) {
    validateRequiredField(task.taskId, "Test Change Class", row.testChangeClass, errors);
    validateRequiredField(task.taskId, "Test-Only Coverage Source", row.coverageSource, errors);
    validateRequiredField(task.taskId, "Test-Only Traceability IDs", row.traceabilityIds, errors);
    validateRequiredField(task.taskId, "Test-Only Test Layer", row.testLayer, errors);
    validateRequiredField(task.taskId, "Test-Only Proof Target", row.proofTarget, errors);
    validateRequiredField(task.taskId, "Fixture / Data Source", row.fixtureDataSource, errors);
    validateRequiredField(task.taskId, "Mock / Runtime Honesty", row.mockRuntimeHonesty, errors);
    validateRequiredField(
      task.taskId,
      "Production Behavior Change Posture",
      row.productionBehaviorChangePosture,
      errors,
    );
    validateRequiredField(task.taskId, "Focused Command", row.focusedCommand, errors);
    validateRequiredField(task.taskId, "Test-Only Split / Blocked Follow-Up", row.splitBlockedFollowUp, errors);
    validateAllowedValue(task.taskId, "Test Change Class", row.testChangeClass, allowedTestOnlyChangeClasses, errors);

    if (!mentionsTraceabilityId(row.traceabilityIds)) {
      errors.push(`${task.taskId} TEST:test-only task must name approved TC-* or AC-* traceability IDs`);
    }

    validateTestOnlyChangeClassSpecifics(task.taskId, row, errors);

    if (!mentionsConcreteTestLayer(row.testLayer)) {
      errors.push(`${task.taskId} TEST:test-only task must name a concrete test layer`);
    }

    if (!mentionsMockHonesty(row.mockRuntimeHonesty)) {
      errors.push(`${task.taskId} TEST:test-only task must include mock-honesty or runtime-data evidence`);
    }

    if (row.productionBehaviorChangePosture === "blocked-production-change-required") {
      errors.push(`${task.taskId} TEST:test-only task cannot queue when production behavior changes are required`);
    } else if (!mentionsNoProductionBehaviorChange(row.productionBehaviorChangePosture)) {
      errors.push(`${task.taskId} TEST:test-only task must declare no production behavior change or test-harness-only posture`);
    }

    if (isBroadOnlyCommand(row.focusedCommand)) {
      errors.push(`${task.taskId} TEST:test-only task must name a focused test command, not only a broad suite`);
    }

    validateTestOnlySplitBoundary(task.taskId, row.splitBlockedFollowUp, errors);
  }

  if (matrixRequired && matrixRows.length === 0) {
    errors.push(`${task.taskId} privileged/security-sensitive TEST:test-only task has no capability permission/state matrix row`);
    return;
  }

  for (const row of matrixRows) {
    validateRequiredField(task.taskId, "Capability / Route / Object", row.capabilityRouteObject, errors);
    validateRequiredField(task.taskId, "Actor States Covered", row.actorStatesCovered, errors);
    validateRequiredField(task.taskId, "Permission States Covered", row.permissionStatesCovered, errors);
    validateRequiredField(task.taskId, "Object Lifecycle States Covered", row.objectLifecycleStatesCovered, errors);
    validateRequiredField(task.taskId, "Boundary States Covered", row.boundaryStatesCovered, errors);
    validateRequiredField(task.taskId, "Required Negative Cases", row.requiredNegativeCases, errors);
    validateRequiredField(task.taskId, "Matrix Not Applicable Rationale", row.notApplicableRationale, errors);
    validateRequiredField(task.taskId, "Missing Coverage / Follow-Up Task", row.missingCoverageFollowUpTask, errors);

    if (matrixRequired && !mentionsAllowedAndDenied(row.actorStatesCovered, row.permissionStatesCovered, row.requiredNegativeCases)) {
      errors.push(`${task.taskId} permission/state matrix must cover both allowed and denied states`);
    }

    if (matrixRequired && !mentionsActorPermissionObjectBoundary(row)) {
      errors.push(`${task.taskId} permission/state matrix must cover actor, permission, object lifecycle, and boundary dimensions`);
    }

    if (matrixRequired && isHappyPathOnly(row.requiredNegativeCases)) {
      errors.push(`${task.taskId} permission/state matrix cannot be happy-path only`);
    }
  }
}

function validateTestOnlyChangeClassSpecifics(taskId: string, row: TestOnlyCoverageContractRow, errors: string[]): void {
  const combined = [
    row.coverageSource,
    row.traceabilityIds,
    row.testLayer,
    row.proofTarget,
    row.fixtureDataSource,
    row.mockRuntimeHonesty,
    row.focusedCommand,
    row.splitBlockedFollowUp,
  ]
    .join(" ")
    .toLowerCase();

  if (row.testChangeClass === "prd-test-case" && !combined.includes("tc-")) {
    errors.push(`${taskId} prd-test-case TEST:test-only task must name TC-* source coverage`);
  }

  if (row.testChangeClass === "proof-gap" && !combined.includes("proof gap") && !combined.includes("proof-gap")) {
    errors.push(`${taskId} proof-gap TEST:test-only task must name the approved proof gap`);
  }

  if (row.testChangeClass === "permission-state-matrix" && !mentionsPermissionMatrixProof(combined)) {
    errors.push(`${taskId} permission-state-matrix TEST:test-only task must name actor, permission, object, and boundary proof`);
  }

  if (row.testChangeClass === "security-boundary" && !mentionsSecurityBoundaryProof(combined)) {
    errors.push(`${taskId} security-boundary TEST:test-only task must name allowed and denied security boundary proof`);
  }

  if (row.testChangeClass === "e2e-journey" && !mentionsE2eJourneyProof(combined)) {
    errors.push(`${taskId} e2e-journey TEST:test-only task must name the journey and runtime/browser proof`);
  }

  if (row.testChangeClass === "regression-lock" && !mentionsRegressionLockProof(combined)) {
    errors.push(`${taskId} regression-lock TEST:test-only task must name issue reconciliation or escaped defect source`);
  }

  if (row.testChangeClass === "fixture-honesty" && !mentionsMockHonesty(combined)) {
    errors.push(`${taskId} fixture-honesty TEST:test-only task must name mock-honesty or fixture/runtime contract proof`);
  }
}

function validateTestOnlySplitBoundary(taskId: string, followUp: string, errors: string[]): void {
  const normalized = followUp.toLowerCase();
  if (
    (normalized.includes("production behavior") ||
      normalized.includes("runtime behavior") ||
      normalized.includes("implementation") ||
      normalized.includes("src/")) &&
    !normalized.includes("dev:")
  ) {
    errors.push(`${taskId} TEST:test-only implementation behavior changes must route to DEV:*`);
  }

  if ((normalized.includes("api contract") || normalized.includes("route contract")) && !normalized.includes("doc:api-contract")) {
    errors.push(`${taskId} TEST:test-only API contract changes must route to DOC:api-contract`);
  }

  if ((normalized.includes("permission") || normalized.includes("authz")) && !normalized.includes("doc:permission-mapping")) {
    errors.push(`${taskId} TEST:test-only permission truth changes must route to DOC:permission-mapping`);
  }

  if ((normalized.includes("test case") || normalized.includes("traceability") || normalized.includes("alignment")) && !normalized.includes("test:test-suite-alignment")) {
    errors.push(`${taskId} TEST:test-only test-case alignment changes must route to TEST:test-suite-alignment`);
  }
}

function validateTestSuiteAlignment(
  task: TaskRow,
  alignmentRows: TestSuiteAlignmentContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "TEST:test-suite-alignment") {
    return;
  }

  if (alignmentRows.length === 0) {
    errors.push(`${task.taskId} queued TEST:test-suite-alignment task has no test suite alignment contract row`);
    return;
  }

  for (const row of alignmentRows) {
    validateRequiredField(task.taskId, "Alignment Source / Trigger", row.alignmentSourceTrigger, errors);
    validateRequiredField(task.taskId, "Mismatch Class", row.mismatchClass, errors);
    validateRequiredField(task.taskId, "Documentation Targets", row.documentationTargets, errors);
    validateRequiredField(task.taskId, "Executable Targets", row.executableTargets, errors);
    validateRequiredField(task.taskId, "Allowed Edit Posture", row.allowedEditPosture, errors);
    validateRequiredField(task.taskId, "Split Decision For New Proof", row.splitDecisionForNewProof, errors);
    validateRequiredField(task.taskId, "Traceability Command", row.traceabilityCommand, errors);
    validateRequiredField(task.taskId, "Completion Evidence", row.completionEvidence, errors);

    if (!mentionsAlignmentMismatchClass(row.mismatchClass)) {
      errors.push(`${task.taskId} TEST:test-suite-alignment task must name an approved mismatch class`);
    }

    if (!mentionsAlignmentDocumentationTarget(row.documentationTargets)) {
      errors.push(`${task.taskId} TEST:test-suite-alignment task must name docs/prd/test_cases, QA backlog/status, or another documentation target`);
    }

    if (!mentionsAlignmentExecutableTarget(row.executableTargets)) {
      errors.push(`${task.taskId} TEST:test-suite-alignment task must name executable test targets or a concrete not-applicable rationale`);
    }

    if (row.allowedEditPosture === "blocked-production-change-required") {
      errors.push(`${task.taskId} TEST:test-suite-alignment task cannot queue when production behavior changes are required`);
    } else if (!mentionsAlignmentOnlyEditPosture(row.allowedEditPosture)) {
      errors.push(`${task.taskId} TEST:test-suite-alignment task must restrict edits to docs and test labels/comments`);
    }

    if (mentionsProductionCodePath(task.allowedWriteSet, row.documentationTargets, row.executableTargets)) {
      errors.push(`${task.taskId} TEST:test-suite-alignment task must not include production code paths in its write envelope`);
    }

    if (!mentionsSplitNewProofDecision(row.splitDecisionForNewProof)) {
      errors.push(`${task.taskId} TEST:test-suite-alignment task must split newly required proof into TEST:test-only or state no new proof is required`);
    }

    if (!mentionsTraceabilityCommand(row.traceabilityCommand)) {
      errors.push(`${task.taskId} TEST:test-suite-alignment task must include npm run test:traceability or an approved traceability-equivalent command`);
    }

    if (!mentionsBeforeAfterEvidence(row.completionEvidence)) {
      errors.push(`${task.taskId} TEST:test-suite-alignment task must define before/after traceability or alignment evidence`);
    }
  }
}

function validateForbiddenAssumptions(task: TaskRow, rows: ForbiddenAssumptionRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} queued task has no forbidden assumptions row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Forbidden Assumption", row.forbiddenAssumption, errors);
    validateRequiredField(task.taskId, "Forbidden Assumption Escalation Path", row.escalationPath, errors);
  }
}

function validateSteeringReconciliation(
  rows: SteeringReconciliationRow[],
  sourceRows: SourceSteeringClassificationRow[],
  taskIds: Set<string>,
  errors: string[],
): void {
  const sourceRowsById = new Map(sourceRows.map((row) => [row.classificationId, row]));
  const rowsById = new Map(rows.map((row) => [row.classificationId, row]));

  for (const source of sourceRows) {
    const row = rowsById.get(source.classificationId);
    if (!row) {
      errors.push(`${source.classificationId} missing Steering Classification Reconciliation row`);
      continue;
    }

    if (row.classification !== source.classification) {
      errors.push(`${source.classificationId} changes steering classification`);
    }

    if (row.downstreamSignal !== source.downstreamSignal) {
      errors.push(`${source.classificationId} changes steering downstream signal`);
    }
  }

  for (const row of rows) {
    if (!sourceRowsById.has(row.classificationId)) {
      errors.push(`${row.classificationId} is not present in source steering classification snapshot`);
    }

    validateRequiredField(row.classificationId, "Covered By Task ID", row.coveredByTaskId, errors);

    if (row.status === "covered") {
      for (const taskId of splitIds(row.coveredByTaskId)) {
        if (!taskIds.has(taskId)) {
          errors.push(`${row.classificationId} is covered by unknown task ${taskId}`);
        }
      }
    } else if (row.status !== "blocked" && row.status !== "deferred-with-owner") {
      errors.push(`${row.classificationId} has invalid reconciliation status: ${row.status || "(blank)"}`);
    }
  }
}

function validateExpectedTaskTypeReconciliation(
  rows: ExpectedTaskTypeReconciliationRow[],
  sourceSignals: SourceTaskTypeSignalRow[],
  selectedStoryIds: Set<string>,
  taskIds: Set<string>,
  tasks: TaskRow[],
  errors: string[],
): void {
  const relevantSignals = sourceSignals.filter((signal) =>
    selectedStoryIds.has(signal.storyId) && (signal.present === "yes" || signal.present === "blocked")
  );
  const rowsByStorySignalType = new Map(
    rows.map((row) => [`${row.storyId}|${row.sourceSignal}|${row.expectedTaskType}`, row]),
  );
  const tasksById = new Map(tasks.map((task) => [task.taskId, task]));

  for (const signal of relevantSignals) {
    const key = `${signal.storyId}|${signal.signal}|${signal.impliedTaskType}`;
    const row = rowsByStorySignalType.get(key);
    if (!row) {
      errors.push(`${signal.storyId} ${signal.signal} missing expected task-type reconciliation for ${signal.impliedTaskType}`);
      continue;
    }

    validateRequiredField(row.storyId, "Missing / Deferred Reason", row.reason, errors);

    for (const taskId of splitIds(row.coveredByTaskId)) {
      if (taskId.startsWith("blocked") || taskId.startsWith("deferred")) {
        continue;
      }

      if (!taskIds.has(taskId)) {
        errors.push(`${row.storyId} ${row.expectedTaskType} is covered by unknown task ${taskId}`);
        continue;
      }

      const task = tasksById.get(taskId);
      if (task && task.taskType !== row.expectedTaskType) {
        errors.push(`${row.storyId} expected ${row.expectedTaskType} but ${taskId} is ${task.taskType}`);
      }
    }
  }
}

function validateTaskGuardrailEvidence(
  task: TaskRow,
  rows: TaskGuardrailEvidenceRow[],
  placementRows: CodePlacementRow[],
  errors: string[],
): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} has no task guardrail evidence rows`);
    return;
  }

  const requiredCheckIds = new Set(requiredCheckIdsByTaskType.get(task.taskType) ?? []);
  const requiresSharedCodeChecks = placementRows.some((row) =>
    row.placementDecision === "shared-lib" ||
    row.placementDecision === "stay-put" ||
    row.extractionNeeded.trim().toLowerCase() === "yes"
  );

  if (requiresSharedCodeChecks) {
    for (const checkId of sharedCodePlacementCheckIds) {
      requiredCheckIds.add(checkId);
    }
  }

  const providedCheckIds = new Set(rows.map((row) => row.checkId));
  for (const checkId of requiredCheckIds) {
    if (!providedCheckIds.has(checkId)) {
      errors.push(`${task.taskId} missing guardrail check ${checkId}`);
    }
  }

  const allowedCheckIds = new Set([...requiredCheckIds]);
  for (const row of rows) {
    validateRequiredField(task.taskId, "Guardrail Check ID", row.checkId, errors);
    validateRequiredField(task.taskId, "Guardrail Evidence", row.evidence, errors);

    if (!allowedCheckIds.has(row.checkId)) {
      errors.push(`${task.taskId} has unknown guardrail check ${row.checkId || "(blank)"}`);
    }

    if (row.status === "blocked") {
      errors.push(`${task.taskId} guardrail check ${row.checkId} is blocked`);
    } else if (row.status.startsWith("not-applicable:")) {
      if (row.status.trim().length <= "not-applicable:".length) {
        errors.push(`${task.taskId} guardrail check ${row.checkId} not-applicable status needs a reason`);
      }
    } else if (!allowedGuardrailEvidenceStatuses.has(row.status)) {
      errors.push(`${task.taskId} guardrail check ${row.checkId} has invalid status: ${row.status || "(blank)"}`);
    }
  }
}

function validateRefactorFirstContract(
  task: TaskRow,
  rows: RefactorFirstContractRow[],
  tasks: TaskRow[],
  errors: string[],
): void {
  if (task.taskType !== "DECISION:refactor-first") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Refactor-First Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no Refactor-First Contract row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "Refactor Trigger", row.trigger, allowedRefactorTriggers, errors);
    validateAllowedValue(task.taskId, "Refactor Type", row.refactorType, allowedRefactorTypes, errors);
    validateAllowedValue(task.taskId, "Routing Check", row.routingCheck, allowedRefactorRoutingChecks, errors);
    validateRequiredField(task.taskId, "Refactor Target Inventory", row.refactorTargetInventory, errors);
    validateRequiredField(task.taskId, "Detection Hints", row.detectionHints, errors);
    validateRequiredField(task.taskId, "Unchanged Behavior", row.unchangedBehavior, errors);
    validateRequiredField(task.taskId, "Affected Consumers", row.affectedConsumers, errors);
    validateRequiredField(task.taskId, "Downstream Task Unblocked", row.downstreamTaskUnblocked, errors);
    validateRequiredField(task.taskId, "Compatibility Proof", row.compatibilityProof, errors);
    validateRequiredField(task.taskId, "Human Review Boundary", row.humanReviewBoundary, errors);
    validateRequiredField(task.taskId, "Forbidden Behavior / Authority Change", row.forbiddenBehaviorOrAuthorityChange, errors);

    if (!mentionsScriptableInventory(row.refactorTargetInventory)) {
      errors.push(`${task.taskId} Refactor-First Contract must name concrete refactor target inventory paths, artifacts, or command output`);
    }

    const detectionHints = row.detectionHints.toLowerCase();
    if (!mentionsScriptCommandOrRationale(detectionHints) && !detectionHints.includes("rg ") && !detectionHints.includes("git diff")) {
      errors.push(`${task.taskId} Refactor-First Contract detection hints must name a command or explicit manual-review rationale`);
    }

    if (!mentionsCompatibilityEvidence(row.compatibilityProof)) {
      errors.push(`${task.taskId} Refactor-First Contract needs existing-consumer compatibility proof`);
    }

    const downstreamIds = splitIds(row.downstreamTaskUnblocked);
    const knownTaskIds = new Set(tasks.map((candidate) => candidate.taskId));
    for (const downstreamId of downstreamIds) {
      if (
        downstreamId.startsWith("blocked") ||
        downstreamId.startsWith("deferred") ||
        downstreamId.startsWith("not-applicable")
      ) {
        continue;
      }
      if (!knownTaskIds.has(downstreamId)) {
        errors.push(`${task.taskId} Refactor-First Contract references unknown downstream task ${downstreamId}`);
      }
    }

    if (row.routingCheck.startsWith("blocked-route-to-")) {
      errors.push(`${task.taskId} Refactor-First Contract routes away to ${row.routingCheck.replace("blocked-route-to-", "")}`);
    }

    const refactorText = [
      task.scope,
      row.unchangedBehavior,
      row.affectedConsumers,
      row.downstreamTaskUnblocked,
      row.compatibilityProof,
      row.forbiddenBehaviorOrAuthorityChange,
    ].join(" ").toLowerCase();
    for (const phrase of ["make nicer", "tidy up", "future-proof", "prepare for future", "make reusable"]) {
      if (refactorText.includes(phrase)) {
        errors.push(`${task.taskId} has vague refactor rationale: ${phrase}`);
      }
    }
  }
}

function validateArchitectureFoundationContract(
  task: TaskRow,
  rows: ArchitectureFoundationContractRow[],
  tasks: TaskRow[],
  errors: string[],
): void {
  if (task.taskType !== "DECISION:architecture-foundation") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Architecture Foundation Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no Architecture Foundation Contract row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "Concern Area", row.concernArea, allowedArchitectureFoundationConcernAreas, errors);
    validateAllowedValue(task.taskId, "Architecture Trigger", row.trigger, allowedArchitectureFoundationTriggers, errors);
    validateAllowedValue(task.taskId, "Decision Analysis Status", row.decisionAnalysisStatus, allowedArchitectureDecisionAnalysisStatuses, errors);
    validateAllowedValue(task.taskId, "Final Authority Route", row.finalAuthorityRoute, allowedArchitectureFoundationRoutes, errors);
    validateRequiredField(task.taskId, "Architecture Question", row.question, errors);
    validateRequiredField(task.taskId, "Decision Provenance Source", row.decisionProvenanceSource, errors);
    validateRequiredField(task.taskId, "Missing Analysis Fields", row.missingAnalysisFields, errors);
    validateRequiredField(task.taskId, "Sources To Review", row.sourcesToReview, errors);
    validateRequiredField(task.taskId, "Decision Source Inventory", row.decisionSourceInventory, errors);
    validateRequiredField(task.taskId, "Decision Analysis Checklist", row.decisionAnalysisChecklist, errors);
    validateRequiredField(task.taskId, "Decision Owner", row.decisionOwner, errors);
    validateRequiredField(task.taskId, "Output Artifact Target", row.outputArtifactTarget, errors);
    validateRequiredField(task.taskId, "Downstream Tasks Blocked", row.downstreamTasksBlocked, errors);
    validateRequiredField(task.taskId, "Compatibility Posture", row.compatibilityPosture, errors);
    validateRequiredField(task.taskId, "Human Review Boundary", row.humanReviewBoundary, errors);
    validateRequiredField(task.taskId, "Forbidden Implementation / Guess", row.forbiddenImplementationGuess, errors);

    const sources = row.sourcesToReview.toLowerCase();
    if (!sources.includes("adr") && !sources.includes("architecture") && !sources.includes("technical steering")) {
      errors.push(`${task.taskId} Architecture Foundation Contract must review ADRs, architecture docs, or Technical Steering`);
    }

    if (!mentionsScriptableInventory(row.decisionSourceInventory)) {
      errors.push(`${task.taskId} Architecture Foundation Contract needs a scriptable decision source inventory`);
    }

    const checklist = row.decisionAnalysisChecklist.toLowerCase();
    const checklistTerms = [
      "option",
      "trade",
      "risk",
      "cost",
      "compat",
      "operab",
      "test",
      "revers",
      "recommend",
      "signoff",
      "missing",
    ];
    if (!checklistTerms.some((term) => checklist.includes(term))) {
      errors.push(`${task.taskId} Architecture Foundation Contract needs a decision-analysis checklist or missing-fields list`);
    }

    const outputTarget = row.outputArtifactTarget.toLowerCase();
    if (!outputTarget.includes("adr") && !outputTarget.includes("architecture") && !outputTarget.includes("technical-steering") && !outputTarget.includes("technical steering")) {
      errors.push(`${task.taskId} Architecture Foundation Contract needs an architecture or Technical Steering output artifact target`);
    }

    const compatibility = row.compatibilityPosture.toLowerCase();
    if (!compatibility.includes("compat") && !compatibility.includes("migration") && !compatibility.includes("not-applicable")) {
      errors.push(`${task.taskId} Architecture Foundation Contract needs compatibility, migration, or not-applicable posture`);
    }

    if (row.decisionAnalysisStatus !== "approved-source-exists") {
      const missing = row.missingAnalysisFields.trim().toLowerCase();
      if (missing === "none" || missing.startsWith("not-applicable")) {
        errors.push(`${task.taskId} Architecture Foundation Contract must name missing analysis fields when decision analysis is not approved`);
      }
    }

    const downstreamIds = splitIds(row.downstreamTasksBlocked);
    const knownTaskIds = new Set(tasks.map((candidate) => candidate.taskId));
    const tasksById = new Map(tasks.map((candidate) => [candidate.taskId, candidate]));
    for (const downstreamId of downstreamIds) {
      if (
        downstreamId.startsWith("blocked") ||
        downstreamId.startsWith("deferred") ||
        downstreamId.startsWith("not-applicable")
      ) {
        continue;
      }
      if (!knownTaskIds.has(downstreamId)) {
        errors.push(`${task.taskId} Architecture Foundation Contract references unknown downstream task ${downstreamId}`);
        continue;
      }

      const downstreamTask = tasksById.get(downstreamId);
      if (
        row.decisionAnalysisStatus !== "approved-source-exists" &&
        downstreamTask &&
        downstreamTask.taskType.startsWith("DEV:") &&
        downstreamTask.handoffStatus === "queued-for-delivery"
      ) {
        errors.push(`${downstreamId} must remain blocked until ${task.taskId} has approved architecture decision analysis`);
      }
    }

    const vagueText = [task.scope, row.question, row.outputArtifactTarget].join(" ").toLowerCase();
    for (const phrase of ["think about architecture", "figure out architecture", "architecture stuff", "as needed"]) {
      if (vagueText.includes(phrase)) {
        errors.push(`${task.taskId} has vague architecture foundation rationale: ${phrase}`);
      }
    }
  }
}

function validateArchitectureUpdateContract(
  task: TaskRow,
  rows: ArchitectureUpdateContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "GOV:architecture-update") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Architecture Update Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no Architecture Update Contract row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "Architecture Update Class", row.architectureUpdateClass, allowedArchitectureUpdateClasses, errors);
    validateAllowedValue(task.taskId, "Approved Decision Source", row.approvedDecisionSource, allowedArchitectureUpdateDecisionSources, errors);
    validateRequiredField(task.taskId, "Decision Source Path / Reference", row.decisionSourcePathReference, errors);
    validateRequiredField(task.taskId, "Decision Summary", row.decisionSummary, errors);
    validateRequiredField(task.taskId, "Architecture Artifact Target", row.architectureArtifactTarget, errors);
    validateRequiredField(task.taskId, "Consistency Sweep Targets", row.consistencySweepTargets, errors);
    validateRequiredField(task.taskId, "Authority / Consistency Inventory", row.authorityConsistencyInventory, errors);
    validateRequiredField(task.taskId, "Downstream Impact", row.downstreamImpact, errors);
    validateRequiredField(task.taskId, "Compatibility Posture", row.compatibilityPosture, errors);
    validateRequiredField(task.taskId, "Forbidden Implementation / Standards Work", row.forbiddenImplementationStandardsWork, errors);
    validateRequiredField(task.taskId, "Human Review Boundary", row.humanReviewBoundary, errors);
    validateRequiredField(task.taskId, "Validation / Review Evidence", row.validationReviewEvidence, errors);

    const source = `${row.approvedDecisionSource} ${row.decisionSourcePathReference}`.toLowerCase();
    if (
      !source.includes("technical") &&
      !source.includes("adr") &&
      !source.includes("architecture") &&
      !source.includes("approval")
    ) {
      errors.push(`${task.taskId} Architecture Update Contract needs an approved architecture decision source`);
    }

    const target = row.architectureArtifactTarget.toLowerCase();
    if (!target.includes("docs/architecture") && !target.includes("docs/workspace/technical-steering") && !target.includes("docs/templates")) {
      errors.push(`${task.taskId} Architecture Update Contract target must be an architecture-owned artifact`);
    }

    const inventory = row.authorityConsistencyInventory.toLowerCase();
    if (!mentionsScriptableInventory(inventory)) {
      errors.push(`${task.taskId} Architecture Update Contract must name concrete architecture authority, consistency sweep, or source inventory`);
    }

    validateArchitectureUpdateClassTarget(task.taskId, row.architectureUpdateClass, row.architectureArtifactTarget, row.decisionSummary, errors);

    const forbidden = row.forbiddenImplementationStandardsWork.toLowerCase();
    if (!forbidden.includes("implementation") || !forbidden.includes("standards")) {
      errors.push(`${task.taskId} Architecture Update Contract must forbid implementation and standards work`);
    }
  }
}

function validateArchitectureUpdateClassTarget(
  taskId: string,
  updateClass: string,
  target: string,
  summary: string,
  errors: string[],
): void {
  const normalizedTarget = target.replace(/\\/g, "/").toLowerCase();
  const normalizedText = `${normalizedTarget} ${summary}`.toLowerCase();

  if ((updateClass === "adr-create" || updateClass === "adr-amendment") && !normalizedTarget.includes("docs/architecture/adr/")) {
    errors.push(`${taskId} Architecture Update Contract ${updateClass} must target docs/architecture/adr/`);
  }

  if (updateClass === "system-overview-update" && !normalizedTarget.includes("docs/architecture/system-overview.md")) {
    errors.push(`${taskId} Architecture Update Contract system-overview-update must target docs/architecture/system-overview.md`);
  }

  if (updateClass === "frontend-topology-authority" && !normalizedText.includes("topology")) {
    errors.push(`${taskId} Architecture Update Contract frontend-topology-authority must name topology authority`);
  }

  if (updateClass === "architecture-template-update" && !normalizedTarget.includes("docs/templates/")) {
    errors.push(`${taskId} Architecture Update Contract architecture-template-update must target docs/templates/`);
  }

  if (updateClass === "architecture-map-update" && !normalizedText.includes("map")) {
    errors.push(`${taskId} Architecture Update Contract architecture-map-update must target an architecture map`);
  }
}

function validateDocsArtifactContract(
  task: TaskRow,
  rows: DocsArtifactContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "DOC:docs-artifact") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Docs Artifact Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no Docs Artifact Contract row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "Artifact Family", row.artifactFamily, allowedDocsArtifactFamilies, errors);
    validateAllowedValue(task.taskId, "Docs Artifact Class", row.docsArtifactClass, allowedDocsArtifactClasses, errors);
    validateRequiredField(task.taskId, "Scriptable Source Inventory", row.scriptableSourceInventory, errors);
    validateRequiredField(task.taskId, "Source Truth Reviewed", row.sourceTruthReviewed, errors);
    validateRequiredField(task.taskId, "Docs Target", row.docsTarget, errors);
    validateRequiredField(task.taskId, "Status Posture", row.statusPosture, errors);
    validateRequiredField(task.taskId, "Stale Artifact Sweep", row.staleArtifactSweep, errors);
    validateRequiredField(task.taskId, "Specialized Routing / Split Decisions", row.specializedRoutingSplitDecisions, errors);
    validateRequiredField(task.taskId, "Diff / Check Command", row.diffCheckCommand, errors);
    validateRequiredField(task.taskId, "Human Review Boundary", row.humanReviewBoundary, errors);
    validateRequiredField(task.taskId, "Validation / Review Evidence", row.validationReviewEvidence, errors);

    const docsTarget = row.docsTarget.replace(/\\/g, "/").toLowerCase();
    if (!docsTarget.includes("docs/") && !docsTarget.includes("readme")) {
      errors.push(`${task.taskId} Docs Artifact Contract target must be a docs or README artifact`);
    }

    const classText = `${row.docsArtifactClass} ${row.scriptableSourceInventory} ${row.docsTarget} ${row.diffCheckCommand} ${row.validationReviewEvidence}`.toLowerCase();
    validateDocsArtifactClassSpecifics(task.taskId, row, classText, errors);

    const sourceInventory = row.scriptableSourceInventory.toLowerCase();
    if (!mentionsScriptableInventory(sourceInventory)) {
      errors.push(`${task.taskId} DOC:docs-artifact must name concrete source paths, globs, artifacts, or command output for scriptable inventory`);
    }

    const diffCommand = row.diffCheckCommand.toLowerCase();
    if (!mentionsScriptCommandOrRationale(diffCommand) && !diffCommand.includes("rg ") && !diffCommand.includes("git diff")) {
      errors.push(`${task.taskId} DOC:docs-artifact diff/check command must name an executable command or explicit manual-review rationale`);
    }

    const specializedText = `${task.scope} ${task.allowedWriteSet} ${row.docsTarget} ${row.sourceTruthReviewed} ${row.scriptableSourceInventory}`.toLowerCase();
    const routeAwayTask = docsArtifactRouteAwayTask(specializedText);
    if (routeAwayTask) {
      errors.push(`${task.taskId} DOC:docs-artifact must route this specialized artifact work to ${routeAwayTask}`);
    }

    const routing = row.specializedRoutingSplitDecisions.toLowerCase();
    if (
      !routing.includes("not-applicable") &&
      !routing.includes("doc:api-contract") &&
      !routing.includes("doc:data-dictionary") &&
      !routing.includes("doc:permission-mapping") &&
      !routing.includes("doc:standards-compliance") &&
      !routing.includes("gov:standards-update") &&
      !routing.includes("gov:architecture-update") &&
      !routing.includes("gov:design-system") &&
      !routing.includes("evidence:qa-evidence") &&
      !routing.includes("test:test-suite-alignment") &&
      !routing.includes("test:test-only")
    ) {
      errors.push(`${task.taskId} Docs Artifact Contract must record specialized routing decisions`);
    }
  }
}

function validateDocsArtifactClassSpecifics(
  taskId: string,
  row: DocsArtifactContractRow,
  combinedText: string,
  errors: string[],
): void {
  if (row.docsArtifactClass === "feature-doc-refresh" && !combinedText.includes("docs/features/")) {
    errors.push(`${taskId} DOC:docs-artifact feature-doc-refresh must target docs/features/`);
  }

  if (row.docsArtifactClass === "readme-index-sync" && !combinedText.includes("readme")) {
    errors.push(`${taskId} DOC:docs-artifact readme-index-sync must target a README or index artifact`);
  }

  if (row.docsArtifactClass === "runbook-update" && !combinedText.includes("runbook")) {
    errors.push(`${taskId} DOC:docs-artifact runbook-update must target a runbook artifact`);
  }

  if (
    row.docsArtifactClass === "implementation-status-note" &&
    !combinedText.includes("status") &&
    !combinedText.includes("implementation-blueprint")
  ) {
    errors.push(`${taskId} DOC:docs-artifact implementation-status-note must target implementation status truth`);
  }

  if (row.docsArtifactClass === "workspace-summary-artifact" && !combinedText.includes("docs/workspace/")) {
    errors.push(`${taskId} DOC:docs-artifact workspace-summary-artifact must target docs/workspace/`);
  }

  if (row.docsArtifactClass === "stale-artifact-sweep") {
    const sweep = `${row.staleArtifactSweep} ${row.specializedRoutingSplitDecisions}`.toLowerCase();
    if (
      !sweep.includes("sweep") ||
      (!sweep.includes("doc:") &&
        !sweep.includes("gov:") &&
        !sweep.includes("test:") &&
        !sweep.includes("evidence:"))
    ) {
      errors.push(`${taskId} DOC:docs-artifact stale-artifact-sweep must name sweep scope and route-away outcomes`);
    }
  }

  if (
    row.docsArtifactClass === "template-or-example-sync" &&
    !combinedText.includes("template") &&
    !combinedText.includes("example")
  ) {
    errors.push(`${taskId} DOC:docs-artifact template-or-example-sync must target template or example artifacts`);
  }
}

function validateStandardsComplianceContract(
  task: TaskRow,
  rows: StandardsComplianceContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "DOC:standards-compliance") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Standards Compliance Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no Standards Compliance Contract row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "Compliance Target Type", row.complianceTargetType, allowedStandardsComplianceTargetTypes, errors);
    validateRequiredField(task.taskId, "Standard / Gate", row.standardGate, errors);
    validateRequiredField(task.taskId, "Source Standard Path / Reference", row.sourceStandardPathReference, errors);
    validateRequiredField(task.taskId, "Scope Under Review", row.scopeUnderReview, errors);
    validateRequiredField(task.taskId, "Control / Evidence Inventory", row.controlEvidenceInventory, errors);
    validateRequiredField(task.taskId, "Review Method / Command", row.reviewMethodCommand, errors);
    validateAllowedValue(task.taskId, "Compliance Posture", row.compliancePosture, allowedStandardsCompliancePostures, errors);
    validateRequiredField(task.taskId, "Evidence Artifact Target", row.evidenceArtifactTarget, errors);
    validateRequiredField(task.taskId, "Coverage Summary Command", row.coverageSummaryCommand, errors);
    validateRequiredField(task.taskId, "Findings Summary", row.findingsSummary, errors);
    validateRequiredField(task.taskId, "Follow-Up Routing", row.followUpRouting, errors);
    validateRequiredField(task.taskId, "Human Review Boundary", row.humanReviewBoundary, errors);
    validateRequiredField(task.taskId, "Waiver / Blocker Posture", row.waiverBlockerPosture, errors);

    const source = row.sourceStandardPathReference.replace(/\\/g, "/").toLowerCase();
    if (
      !source.includes("docs/standards/") &&
      !source.includes("https://") &&
      !source.includes("http://") &&
      !source.includes("external:") &&
      !source.includes("agents.md")
    ) {
      errors.push(`${task.taskId} Standards Compliance Contract needs a repo standard path or external source reference`);
    }

    const evidenceTarget = row.evidenceArtifactTarget.replace(/\\/g, "/").toLowerCase();
    if (
      !evidenceTarget.includes("docs/standards/platform-status/") &&
      !evidenceTarget.includes("docs/standards/control-maps/") &&
      !evidenceTarget.includes("docs/workspace/") &&
      !evidenceTarget.includes("docs/prd/") &&
      !evidenceTarget.includes("docs/architecture/")
    ) {
      errors.push(`${task.taskId} Standards Compliance Contract evidence target must be a compliance evidence artifact`);
    }

    const inventory = row.controlEvidenceInventory.toLowerCase();
    if (!mentionsScriptableInventory(inventory)) {
      errors.push(`${task.taskId} Standards Compliance Contract must name concrete control/evidence inventory paths, artifacts, or command output`);
    }

    const reviewCommand = row.reviewMethodCommand.toLowerCase();
    if (!mentionsScriptCommandOrRationale(reviewCommand) && !reviewCommand.includes("rg ") && !reviewCommand.includes("manual standards review")) {
      errors.push(`${task.taskId} Standards Compliance Contract review method must name a command or explicit manual standards review rationale`);
    }

    const coverageCommand = row.coverageSummaryCommand.toLowerCase();
    if (
      !mentionsScriptCommandOrRationale(coverageCommand) &&
      !coverageCommand.includes("rg ") &&
      !coverageCommand.includes("git diff") &&
      !coverageCommand.includes("manual standards review")
    ) {
      errors.push(`${task.taskId} Standards Compliance Contract coverage summary must name a command or explicit manual-review rationale`);
    }

    if (row.complianceTargetType === "external-standard-control-map") {
      if (!evidenceTarget.includes("docs/standards/control-maps/")) {
        errors.push(`${task.taskId} external-standard-control-map evidence must target docs/standards/control-maps/`);
      }

      const summary = `${row.standardGate} ${row.findingsSummary} ${row.controlEvidenceInventory}`.toLowerCase();
      if (summary.includes("full text") || summary.includes("copy external standard") || summary.includes("duplicate external standard")) {
        errors.push(`${task.taskId} external control maps must not duplicate external standard text`);
      }
    }

    const posture = row.compliancePosture.toLowerCase();
    const followUp = row.followUpRouting.toLowerCase();
    if (["partial", "fail", "blocked", "waived-with-approval"].includes(posture)) {
      if (
        !followUp.includes("gov:standards-update") &&
        !followUp.includes("doc:standards-compliance") &&
        !followUp.includes("doc:docs-artifact") &&
        !followUp.includes("dev:") &&
        !followUp.includes("test:") &&
        !followUp.includes("evidence:") &&
        !followUp.includes("approved waiver")
      ) {
        errors.push(`${task.taskId} Standards Compliance Contract needs follow-up routing for non-passing posture`);
      }
    }
  }
}

function validateStandardsUpdateContract(
  task: TaskRow,
  rows: StandardsUpdateContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "GOV:standards-update") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Standards Update Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no Standards Update Contract row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "Standards Update Class", row.standardsUpdateClass, allowedStandardsUpdateClasses, errors);
    validateAllowedValue(task.taskId, "Approved Standards Change Source", row.approvedStandardsChangeSource, allowedStandardsUpdateChangeSources, errors);
    validateRequiredField(task.taskId, "Source Path / Reference", row.sourcePathReference, errors);
    validateRequiredField(task.taskId, "Standards Change Summary", row.standardsChangeSummary, errors);
    validateRequiredField(task.taskId, "Standards Artifact Target", row.standardsArtifactTarget, errors);
    validateRequiredField(task.taskId, "Affected Surfaces / Consistency Sweep", row.affectedSurfacesConsistencySweep, errors);
    validateRequiredField(task.taskId, "Artifact Invalidation Sweep", row.artifactInvalidationSweep, errors);
    validateAllowedValue(task.taskId, "Enforcement Posture", row.enforcementPosture, allowedStandardsUpdateEnforcementPostures, errors);
    validateRequiredField(task.taskId, "Compatibility / Rollout Posture", row.compatibilityRolloutPosture, errors);
    validateRequiredField(task.taskId, "Debt Route If Not Enforced Now", row.debtRouteIfNotEnforcedNow, errors);
    validateRequiredField(task.taskId, "Forbidden Implementation / Architecture / Compliance Work", row.forbiddenImplementationArchitectureComplianceWork, errors);
    validateRequiredField(task.taskId, "Validation / Review Evidence", row.validationReviewEvidence, errors);

    const source = `${row.approvedStandardsChangeSource} ${row.sourcePathReference}`.toLowerCase();
    if (
      !source.includes("approval") &&
      !source.includes("audit") &&
      !source.includes("reconciliation") &&
      !source.includes("retrospective") &&
      !source.includes("technical") &&
      !source.includes("contradiction")
    ) {
      errors.push(`${task.taskId} Standards Update Contract needs an approved standards change source`);
    }

    const target = row.standardsArtifactTarget.replace(/\\/g, "/").toLowerCase();
    if (
      !target.includes("agents.md") &&
      !target.includes("docs/standards/") &&
      !target.includes("docs/templates/") &&
      !target.includes(".codex/skills/") &&
      !target.includes("src/scripts/")
    ) {
      errors.push(`${task.taskId} Standards Update Contract target must be a standards-owned artifact`);
    }

    const enforcement = row.enforcementPosture.toLowerCase();
    const updateClass = row.standardsUpdateClass.toLowerCase();
    const debtRoute = row.debtRouteIfNotEnforcedNow.toLowerCase();
    const invalidationSweep = `${row.affectedSurfacesConsistencySweep} ${row.artifactInvalidationSweep}`.toLowerCase();
    if (!invalidationSweep.includes("sweep") && !invalidationSweep.includes("reviewed") && !invalidationSweep.includes("not-applicable")) {
      errors.push(`${task.taskId} Standards Update Contract must record an artifact invalidation sweep or not-applicable rationale`);
    }

    validateStandardsUpdateClassPosture(task.taskId, updateClass, enforcement, invalidationSweep, errors);

    if (enforcement === "advisory-with-approved-debt-route") {
      if (
        !debtRoute.includes("docs/workspace/") &&
        !debtRoute.includes("follow-up") &&
        !debtRoute.includes("task") &&
        !debtRoute.includes("cleanup") &&
        !debtRoute.includes("debt")
      ) {
        errors.push(`${task.taskId} Standards Update Contract advisory posture needs an explicit approved debt route`);
      }
    } else if (!debtRoute.includes("not-applicable") && !debtRoute.includes("enforced now")) {
      errors.push(`${task.taskId} Standards Update Contract enforced posture should mark debt route not-applicable or enforced now`);
    }

    const forbidden = row.forbiddenImplementationArchitectureComplianceWork.toLowerCase();
    if (!forbidden.includes("implementation") || !forbidden.includes("architecture") || !forbidden.includes("compliance")) {
      errors.push(`${task.taskId} Standards Update Contract must forbid implementation, architecture, and compliance work`);
    }
  }
}

function validateStandardsUpdateClassPosture(
  taskId: string,
  updateClass: string,
  enforcement: string,
  invalidationSweep: string,
  errors: string[],
): void {
  if (updateClass === "enforced-now" && enforcement !== "validator-or-gate-enforced-now") {
    errors.push(`${taskId} Standards Update Contract enforced-now class must use validator-or-gate-enforced-now posture`);
  }

  if (updateClass === "template-required" && enforcement !== "template-required-now") {
    errors.push(`${taskId} Standards Update Contract template-required class must use template-required-now posture`);
  }

  if (updateClass === "script-reported-debt" && enforcement !== "script-reported-debt") {
    errors.push(`${taskId} Standards Update Contract script-reported-debt class must use script-reported-debt posture`);
  }

  if (updateClass === "advisory-approved-debt" && enforcement !== "advisory-with-approved-debt-route") {
    errors.push(`${taskId} Standards Update Contract advisory-approved-debt class must use advisory-with-approved-debt-route posture`);
  }

  if (updateClass === "artifact-invalidation-sweep" && !invalidationSweep.includes("invalidation")) {
    errors.push(`${taskId} Standards Update Contract artifact-invalidation-sweep class must name invalidation sweep scope`);
  }
}

function validatePermissionMappingContract(
  task: TaskRow,
  rows: PermissionMappingContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "DOC:permission-mapping") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Permission Mapping Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no Permission Mapping Contract row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "Permission Mapping Class", row.permissionMappingClass, allowedPermissionMappingClasses, errors);
    validateRequiredField(task.taskId, "Approved Authz Source", row.approvedAuthzSource, errors);
    validateRequiredField(task.taskId, "Capability / Route / Surface", row.capabilityRouteSurface, errors);
    validateRequiredField(task.taskId, "Authority World / Actor Boundary", row.authorityWorldActorBoundary, errors);
    validateAllowedValue(task.taskId, "Grant Source Posture", row.grantSourcePosture, allowedPermissionGrantSourcePostures, errors);
    validateAllowedValue(task.taskId, "Mapping Row Posture", row.mappingRowPosture, allowedPermissionMappingRowPostures, errors);
    validateRequiredField(task.taskId, "Tenant / Object Boundary", row.tenantObjectBoundary, errors);
    validateRequiredField(task.taskId, "Allow / Deny Expectations", row.allowDenyExpectations, errors);
    validateRequiredField(task.taskId, "UI Eligibility", row.uiEligibility, errors);
    validateRequiredField(task.taskId, "Denial / Audit / Proof Expectation", row.denialAuditProofExpectation, errors);
    validateRequiredField(task.taskId, "Evidence Mapping Inventory", row.evidenceMappingInventory, errors);
    validateRequiredField(task.taskId, "Migration Impact", row.migrationImpact, errors);
    validateRequiredField(task.taskId, "Split / Blocked Follow-Up", row.splitBlockedFollowUp, errors);
    validateRequiredField(task.taskId, "Human Review Boundary", row.humanReviewBoundary, errors);

    const source = row.approvedAuthzSource.toLowerCase();
    if (
      !source.includes("adr") &&
      !source.includes("technical steering") &&
      !source.includes("product discovery") &&
      !source.includes("prd") &&
      !source.includes("capability") &&
      !source.includes("api contract") &&
      !source.includes("permission-mapping") &&
      !source.includes("architecture")
    ) {
      errors.push(`${task.taskId} Permission Mapping Contract needs an approved authz source`);
    }

    const boundary = `${row.authorityWorldActorBoundary} ${row.tenantObjectBoundary}`.toLowerCase();
    if (!mentionsPermissionBoundary(boundary)) {
      errors.push(`${task.taskId} Permission Mapping Contract must name root, tenant, system, public, support, emergency, object, relationship, attribute, or shared-cross-tenant boundary`);
    }

    const expectations = `${row.allowDenyExpectations} ${row.denialAuditProofExpectation}`.toLowerCase();
    if (!expectations.includes("allow") || !expectations.includes("deny")) {
      errors.push(`${task.taskId} Permission Mapping Contract must name allow and deny expectations`);
    }
    if (!expectations.includes("audit") && !expectations.includes("proof")) {
      errors.push(`${task.taskId} Permission Mapping Contract must name audit or proof expectation`);
    }

    const uiEligibility = row.uiEligibility.toLowerCase();
    if (
      ["documentation-only", "seed-backed", "corrective-migration-backed", "blocked"].includes(row.grantSourcePosture) &&
      !uiEligibility.includes("not selectable") &&
      !uiEligibility.includes("not usable") &&
      !uiEligibility.includes("hidden") &&
      !uiEligibility.includes("blocked")
    ) {
      errors.push(`${task.taskId} Permission Mapping Contract UI eligibility must prevent non-runtime-enforced capabilities from becoming usable`);
    }

    const migrationImpact = row.migrationImpact.toLowerCase();
    const followUp = row.splitBlockedFollowUp.toLowerCase();
    const evidenceInventory = row.evidenceMappingInventory.toLowerCase();
    if (!mentionsScriptableInventory(evidenceInventory)) {
      errors.push(`${task.taskId} Permission Mapping Contract must name concrete permission evidence inventory paths, artifacts, or command output`);
    }

    validatePermissionMappingClassPosture(task.taskId, row.permissionMappingClass, row.grantSourcePosture, row.mappingRowPosture, row.uiEligibility, errors);

    const authzModelText = [
      row.permissionMappingClass,
      row.approvedAuthzSource,
      row.capabilityRouteSurface,
      row.authorityWorldActorBoundary,
      row.tenantObjectBoundary,
      row.allowDenyExpectations,
      row.uiEligibility,
      row.denialAuditProofExpectation,
      row.migrationImpact,
      row.splitBlockedFollowUp,
    ]
      .join(" ")
      .toLowerCase();
    const futureAuthzModelSignal =
      authzModelText.includes("configuration-based") ||
      authzModelText.includes("relationship-based") ||
      authzModelText.includes("abac") ||
      authzModelText.includes("rebac");
    if (futureAuthzModelSignal && !["architecture-target", "blocked"].includes(row.mappingRowPosture)) {
      errors.push(`${task.taskId} Permission Mapping Contract future authz model rows must be architecture-target or blocked until Layer 2 approval`);
    }

    if (
      (migrationImpact.includes("seed") || migrationImpact.includes("migration") || migrationImpact.includes("repair")) &&
      !followUp.includes("dev:migration-persistence") &&
      !followUp.includes("not-applicable")
    ) {
      errors.push(`${task.taskId} Permission Mapping Contract migration impact must route grant changes to DEV:migration-persistence`);
    }

    if (followUp.includes("runtime") && !followUp.includes("dev:")) {
      errors.push(`${task.taskId} Permission Mapping Contract runtime enforcement must route to DEV:*`);
    }
    if (followUp.includes("test") && !followUp.includes("test:test-only")) {
      errors.push(`${task.taskId} Permission Mapping Contract executable proof must route to TEST:test-only`);
    }
    if ((followUp.includes("api") || followUp.includes("denial contract")) && !followUp.includes("doc:api-contract")) {
      errors.push(`${task.taskId} Permission Mapping Contract API-visible authz contract changes must route to DOC:api-contract`);
    }
    if (
      (futureAuthzModelSignal ||
        followUp.includes("authz model") ||
        followUp.includes("evaluator order") ||
        followUp.includes("authority-world policy")) &&
      !followUp.includes("gov:architecture-update")
    ) {
      errors.push(`${task.taskId} Permission Mapping Contract authz model changes must route to GOV:architecture-update`);
    }
  }
}

function validatePermissionMappingClassPosture(
  taskId: string,
  mappingClass: string,
  grantSourcePosture: string,
  mappingRowPosture: string,
  uiEligibility: string,
  errors: string[],
): void {
  const normalizedUi = uiEligibility.toLowerCase();

  if (mappingClass === "runtime-enforced-row" && grantSourcePosture !== "runtime-enforced") {
    errors.push(`${taskId} Permission Mapping Contract runtime-enforced-row class must use runtime-enforced grant source posture`);
  }

  if (mappingClass === "documentation-only-row" && grantSourcePosture !== "documentation-only") {
    errors.push(`${taskId} Permission Mapping Contract documentation-only-row class must use documentation-only grant source posture`);
  }

  if (mappingClass === "grant-source-row" && !["seed-backed", "corrective-migration-backed"].includes(grantSourcePosture)) {
    errors.push(`${taskId} Permission Mapping Contract grant-source-row class must use seed-backed or corrective-migration-backed grant posture`);
  }

  if (mappingClass === "future-authz-model-row" && !["architecture-target", "blocked"].includes(mappingRowPosture)) {
    errors.push(`${taskId} Permission Mapping Contract future-authz-model-row class must be architecture-target or blocked`);
  }

  if (
    mappingClass === "ui-eligibility-review" &&
    !normalizedUi.includes("selectable") &&
    !normalizedUi.includes("usable") &&
    !normalizedUi.includes("hidden") &&
    !normalizedUi.includes("blocked")
  ) {
    errors.push(`${taskId} Permission Mapping Contract ui-eligibility-review class must name selectable, usable, hidden, or blocked UI posture`);
  }
}

function validateApiContract(
  task: TaskRow,
  rows: ApiContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "DOC:api-contract") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has API Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no API Contract row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "API Contract Class", row.apiContractClass, allowedApiContractClasses, errors);
    validateRequiredField(task.taskId, "Route Family", row.routeFamily, errors);
    validateRequiredField(task.taskId, "Contract Source / Authority", row.contractSourceAuthority, errors);
    validateRequiredField(task.taskId, "Methods / Paths", row.methodsPaths, errors);
    validateRequiredField(task.taskId, "Params / Query / Body", row.paramsQueryBody, errors);
    validateRequiredField(task.taskId, "Response / Status / Error Shape", row.responseStatusErrorShape, errors);
    validateRequiredField(task.taskId, "Authn / Authz / Tenant Boundary", row.authnAuthzTenantBoundary, errors);
    validateRequiredField(task.taskId, "Validation / Pagination / Sorting / System Fields", row.validationPaginationSortingSystemFields, errors);
    validateAllowedValue(task.taskId, "Compatibility Posture", row.compatibilityPosture, allowedApiCompatibilityPostures, errors);
    validateAllowedValue(task.taskId, "Maintained API Artifacts", row.maintainedApiArtifacts, allowedApiMaintainedArtifactPostures, errors);
    validateRequiredField(task.taskId, "Maintained Artifact Inventory", row.maintainedArtifactInventory, errors);
    validateRequiredField(task.taskId, "Split / Blocked Follow-Up", row.splitBlockedFollowUp, errors);
    validateRequiredField(task.taskId, "Human Review Boundary", row.humanReviewBoundary, errors);
    validateRequiredField(task.taskId, "Validation / Review Evidence", row.validationReviewEvidence, errors);

    const source = row.contractSourceAuthority.toLowerCase();
    if (
      !source.includes("story") &&
      !source.includes("prd") &&
      !source.includes("technical steering") &&
      !source.includes("api contract") &&
      !source.includes("openapi") &&
      !source.includes("postman") &&
      !source.includes("implementation blueprint") &&
      !source.includes("capability")
    ) {
      errors.push(`${task.taskId} API Contract needs an approved contract source or authority`);
    }

    const methodsPaths = row.methodsPaths.toLowerCase();
    if (!mentionsHttpMethod(methodsPaths) || !methodsPaths.includes("/")) {
      errors.push(`${task.taskId} API Contract must name HTTP method and route path`);
    }

    const shape = `${row.paramsQueryBody} ${row.responseStatusErrorShape}`.toLowerCase();
    if (!shape.includes("response") || !shape.includes("status")) {
      errors.push(`${task.taskId} API Contract must name response shape and status/error posture`);
    }

    const boundary = row.authnAuthzTenantBoundary.toLowerCase();
    if (!boundary.includes("auth") && !boundary.includes("public") && !boundary.includes("not-applicable")) {
      errors.push(`${task.taskId} API Contract must name authn/authz or public boundary`);
    }
    if (boundary.includes("tenant") && !boundary.includes("tenant boundary") && !boundary.includes("tenant context")) {
      errors.push(`${task.taskId} API Contract tenant routes must name tenant boundary or tenant context`);
    }

    const behaviorDefaults = row.validationPaginationSortingSystemFields.toLowerCase();
    if (
      !behaviorDefaults.includes("validation") &&
      !behaviorDefaults.includes("pagination") &&
      !behaviorDefaults.includes("sorting") &&
      !behaviorDefaults.includes("system-managed") &&
      !behaviorDefaults.includes("not-applicable")
    ) {
      errors.push(`${task.taskId} API Contract must classify validation, pagination, sorting, or system-managed field posture`);
    }

    if (
      row.maintainedApiArtifacts === "not-maintained-with-rationale" &&
      !row.splitBlockedFollowUp.toLowerCase().includes("not-maintained") &&
      !row.validationReviewEvidence.toLowerCase().includes("not-maintained")
    ) {
      errors.push(`${task.taskId} API Contract must include rationale when OpenAPI/Postman/generated docs are not maintained`);
    }

    const inventory = row.maintainedArtifactInventory.toLowerCase();
    if (!mentionsScriptableInventory(inventory)) {
      errors.push(`${task.taskId} API Contract must name concrete maintained artifact inventory paths, artifacts, or command output`);
    }

    validateApiContractClassPosture(task.taskId, row.apiContractClass, row.compatibilityPosture, row.maintainedApiArtifacts, row.maintainedArtifactInventory, errors);

    const compatibility = row.compatibilityPosture.toLowerCase();
    const followUp = row.splitBlockedFollowUp.toLowerCase();
    if (compatibility === "compatibility-sensitive" || compatibility === "blocked-pending-migration-or-approval") {
      if (
        !followUp.includes("approval") &&
        !followUp.includes("migration") &&
        !followUp.includes("compatibility") &&
        !followUp.includes("blocked")
      ) {
        errors.push(`${task.taskId} API Contract compatibility-sensitive changes need approval, migration, compatibility, or blocked follow-up`);
      }
    }

    if (followUp.includes("runtime") && !followUp.includes("dev:")) {
      errors.push(`${task.taskId} API Contract runtime implementation must route to DEV:*`);
    }
    if ((followUp.includes("authz") || followUp.includes("permission")) && !followUp.includes("doc:permission-mapping")) {
      errors.push(`${task.taskId} API Contract permission mapping changes must route to DOC:permission-mapping`);
    }
    if ((followUp.includes("persistence") || followUp.includes("migration") || followUp.includes("schema")) && !followUp.includes("dev:migration-persistence")) {
      errors.push(`${task.taskId} API Contract persistence or migration changes must route to DEV:migration-persistence`);
    }
    if (followUp.includes("test") && !followUp.includes("test:test-only")) {
      errors.push(`${task.taskId} API Contract executable proof must route to TEST:test-only`);
    }
  }
}

function validateApiContractClassPosture(
  taskId: string,
  apiContractClass: string,
  compatibilityPosture: string,
  artifactPosture: string,
  inventory: string,
  errors: string[],
): void {
  const normalizedInventory = inventory.toLowerCase();

  if (apiContractClass === "no-wire-change-refresh" && compatibilityPosture !== "no-wire-change") {
    errors.push(`${taskId} API Contract no-wire-change-refresh class must use no-wire-change compatibility posture`);
  }

  if (apiContractClass === "additive-route-contract" && compatibilityPosture !== "additive") {
    errors.push(`${taskId} API Contract additive-route-contract class must use additive compatibility posture`);
  }

  if (apiContractClass === "compatibility-sensitive-contract" && !["compatibility-sensitive", "blocked-pending-migration-or-approval"].includes(compatibilityPosture)) {
    errors.push(`${taskId} API Contract compatibility-sensitive-contract class must use compatibility-sensitive or blocked-pending-migration-or-approval posture`);
  }

  if (apiContractClass === "openapi-postman-sync" && !["openapi-maintained", "postman-maintained", "openapi-and-postman-maintained"].includes(artifactPosture)) {
    errors.push(`${taskId} API Contract openapi-postman-sync class must use OpenAPI/Postman maintained artifact posture`);
  }

  if (apiContractClass === "generated-docs-sync" && artifactPosture !== "generated-docs-maintained") {
    errors.push(`${taskId} API Contract generated-docs-sync class must use generated-docs-maintained posture`);
  }

  if ((apiContractClass === "openapi-postman-sync" || apiContractClass === "generated-docs-sync") && !normalizedInventory.includes("openapi") && !normalizedInventory.includes("postman") && !normalizedInventory.includes("generated")) {
    errors.push(`${taskId} API Contract maintained-artifact sync classes must name OpenAPI, Postman, or generated-docs inventory`);
  }
}

function validateDataDictionaryContract(
  task: TaskRow,
  rows: DataDictionaryContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "DOC:data-dictionary") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Data Dictionary Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no Data Dictionary Contract row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Entity / Table / Fact Group", row.entityTableFactGroup, errors);
    validateRequiredField(task.taskId, "Dictionary Artifact Target", row.dictionaryArtifactTarget, errors);
    validateRequiredField(task.taskId, "Source Truth Reviewed", row.sourceTruthReviewed, errors);
    validateRequiredField(task.taskId, "Field / Index / Lifecycle Truth", row.fieldIndexLifecycleTruth, errors);
    validateRequiredField(task.taskId, "Durable Fact / Retention Truth", row.durableFactRetentionTruth, errors);
    validateRequiredField(task.taskId, "Classification / Compliance Posture", row.classificationCompliancePosture, errors);
    validateRequiredField(task.taskId, "Standards / Control Trace", row.standardsControlTrace, errors);
    validateAllowedValue(task.taskId, "Enforcement Trace", row.enforcementTrace, allowedDataEnforcementPostures, errors);
    validateRequiredField(task.taskId, "Enforcement Evidence", row.enforcementEvidence, errors);
    validateRequiredField(task.taskId, "Test / Evidence Trace", row.testEvidenceTrace, errors);
    validateAllowedValue(task.taskId, "Compatibility Posture", row.compatibilityPosture, allowedDataCompatibilityPostures, errors);
    validateRequiredField(task.taskId, "Split / Blocked Follow-Up", row.splitBlockedFollowUp, errors);
    validateRequiredField(task.taskId, "Validation / Review Evidence", row.validationReviewEvidence, errors);

    const target = row.dictionaryArtifactTarget.replace(/\\/g, "/").toLowerCase();
    if (!target.includes("docs/data-dictionary/")) {
      errors.push(`${task.taskId} Data Dictionary Contract target must be under docs/data-dictionary/`);
    }

    const source = row.sourceTruthReviewed.toLowerCase();
    if (
      !source.includes("migration") &&
      !source.includes("schema") &&
      !source.includes("repository") &&
      !source.includes("domain") &&
      !source.includes("contract") &&
      !source.includes("prd") &&
      !source.includes("technical steering") &&
      !source.includes("data dictionary") &&
      !source.includes("capability")
    ) {
      errors.push(`${task.taskId} Data Dictionary Contract needs source truth from migrations, schema, repositories, domain/contract code, PRD, Technical Steering, capability rows, or existing data dictionary docs`);
    }

    const dataTruth = `${row.fieldIndexLifecycleTruth} ${row.durableFactRetentionTruth}`.toLowerCase();
    if (
      !dataTruth.includes("field") &&
      !dataTruth.includes("index") &&
      !dataTruth.includes("lifecycle") &&
      !dataTruth.includes("retention") &&
      !dataTruth.includes("durable fact") &&
      !dataTruth.includes("soft-delete") &&
      !dataTruth.includes("normalization") &&
      !dataTruth.includes("uniqueness")
    ) {
      errors.push(`${task.taskId} Data Dictionary Contract must name field, index, lifecycle, retention, durable fact, soft-delete, normalization, or uniqueness truth`);
    }

    const compliance = row.classificationCompliancePosture.toLowerCase();
    if (
      !compliance.includes("classification") &&
      !compliance.includes("privacy") &&
      !compliance.includes("security") &&
      !compliance.includes("audit") &&
      !compliance.includes("retention") &&
      !compliance.includes("compliance") &&
      !compliance.includes("not-applicable")
    ) {
      errors.push(`${task.taskId} Data Dictionary Contract must classify data compliance, privacy, security, audit, or retention posture`);
    }

    if (!mentionsDataStandardsControlTrace(row.standardsControlTrace)) {
      errors.push(`${task.taskId} Data Dictionary Contract must name applicable repo or external standards/control trace, or not-applicable with rationale`);
    }

    if (!mentionsDataEnforcementEvidence(row.enforcementTrace, row.enforcementEvidence)) {
      errors.push(`${task.taskId} Data Dictionary Contract enforcement evidence must name repo enforcement, evidence path, command, test case, planned work, blocked work, or not-applicable rationale`);
    }

    if (!mentionsDataTestEvidenceTrace(row.testEvidenceTrace)) {
      errors.push(`${task.taskId} Data Dictionary Contract test/evidence trace must name test case, executable test path, validation command, evidence artifact, planned work, blocked work, or not-applicable rationale`);
    }

    if (!mentionsDataComplianceHealthCommand(row.validationReviewEvidence)) {
      errors.push(`${task.taskId} Data Dictionary Contract validation evidence must include npm run data:compliance-health or explicit debt summary command evidence`);
    }

    const followUp = row.splitBlockedFollowUp.toLowerCase();
    const followUpRequiresRouting = !followUp.includes("not-applicable") && !followUp.includes("unchanged") && !followUp.includes("already split");
    if (followUpRequiresRouting) {
      if ((followUp.includes("schema") || followUp.includes("migration") || followUp.includes("index")) && !followUp.includes("dev:migration-persistence")) {
        errors.push(`${task.taskId} Data Dictionary Contract schema, migration, or index changes must route to DEV:migration-persistence`);
      }
      if (
        (followUp.includes("repository") ||
          followUp.includes("domain") ||
          followUp.includes("normalization") ||
          followUp.includes("runtime") ||
          followUp.includes("persistence behavior")) &&
        !followUp.includes("dev:backend") &&
        !followUp.includes("dev:vertical-slice")
      ) {
        errors.push(`${task.taskId} Data Dictionary Contract runtime or persistence behavior changes must route to DEV:backend or DEV:vertical-slice`);
      }
      if ((followUp.includes("api") || followUp.includes("response") || followUp.includes("request")) && !followUp.includes("doc:api-contract")) {
        errors.push(`${task.taskId} Data Dictionary Contract API-visible data shape changes must route to DOC:api-contract`);
      }
      if ((followUp.includes("permission") || followUp.includes("authz") || followUp.includes("tenant boundary")) && !followUp.includes("doc:permission-mapping")) {
        errors.push(`${task.taskId} Data Dictionary Contract permission or tenant-boundary changes must route to DOC:permission-mapping`);
      }
      if ((followUp.includes("test") || followUp.includes("executable proof")) && !followUp.includes("test:test-only")) {
        errors.push(`${task.taskId} Data Dictionary Contract executable proof changes must route to TEST:test-only`);
      }
      if ((followUp.includes("standard") || followUp.includes("control") || followUp.includes("external compliance")) && !followUp.includes("doc:standards-compliance") && !followUp.includes("gov:standards-update")) {
        errors.push(`${task.taskId} Data Dictionary Contract standards/control follow-up must route to DOC:standards-compliance or GOV:standards-update`);
      }
    }
    if (row.enforcementTrace === "blocked" || row.compatibilityPosture === "blocked-pending-migration-or-approval") {
      if (!followUp.includes("blocked") && !followUp.includes("approval") && !followUp.includes("migration")) {
        errors.push(`${task.taskId} Data Dictionary Contract blocked posture must name blocked, approval, or migration follow-up`);
      }
    }
  }
}

function mentionsDataStandardsControlTrace(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("standard") ||
    normalized.includes("control") ||
    normalized.includes("rule") ||
    normalized.includes("gdpr") ||
    normalized.includes("hipaa") ||
    normalized.includes("iso") ||
    normalized.includes("wcag") ||
    normalized.includes("owasp") ||
    normalized.includes("repo") ||
    normalized.includes("privacy") ||
    normalized.includes("security") ||
    normalized.includes("retention") ||
    normalized.includes("not-applicable")
  );
}

function mentionsDataEnforcementEvidence(enforcementTrace: string, evidence: string): boolean {
  const normalized = `${enforcementTrace} ${evidence}`.toLowerCase();
  return (
    normalized.includes("schema") ||
    normalized.includes("migration") ||
    normalized.includes("repository") ||
    normalized.includes("domain") ||
    normalized.includes("contract") ||
    normalized.includes("test") ||
    normalized.includes("tc-") ||
    normalized.includes("docs/data-dictionary/") ||
    normalized.includes("npm run") ||
    normalized.includes("manual-review") ||
    normalized.includes("planned") ||
    normalized.includes("blocked") ||
    normalized.includes("not-applicable")
  );
}

function mentionsDataTestEvidenceTrace(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("test") ||
    normalized.includes("tc-") ||
    normalized.includes("npm run") ||
    normalized.includes("data:compliance-health") ||
    normalized.includes("evidence") ||
    normalized.includes("docs/data-dictionary/") ||
    normalized.includes("planned") ||
    normalized.includes("blocked") ||
    normalized.includes("not-applicable")
  );
}

function validatePlatformSeamContract(
  task: TaskRow,
  rows: PlatformSeamContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "DEV:platform-seam") {
    if (rows.length > 0) {
      errors.push(`${task.taskId} has Platform Seam Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no Platform Seam Contract row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "Seam Kind", row.seamKind, allowedPlatformSeamKinds, errors);
    validateAllowedValue(task.taskId, "Compatibility Mode", row.compatibilityMode, allowedPlatformCompatibilityModes, errors);
    validateRequiredField(task.taskId, "Approved Authority Source", row.approvedAuthoritySource, errors);
    validateRequiredField(task.taskId, "Seam Owner / Location", row.seamOwnerLocation, errors);
    validateRequiredField(task.taskId, "Seam Source Inventory", row.seamSourceInventory, errors);
    validateRequiredField(task.taskId, "Seam Change Scope", row.seamChangeScope, errors);
    validateRequiredField(task.taskId, "Exact Write Envelope", row.exactWriteEnvelope, errors);
    validateRequiredField(task.taskId, "Why Not Feature-Local", row.whyNotFeatureLocal, errors);
    validateRequiredField(task.taskId, "Current / Future / Unsupported Consumers", row.currentFutureUnsupportedConsumers, errors);
    validateRequiredField(task.taskId, "Compatibility Contract", row.compatibilityContract, errors);
    validateRequiredField(task.taskId, "Representative Consumer Proof", row.representativeConsumerProof, errors);
    validateRequiredField(task.taskId, "Runtime / Restart Impact", row.runtimeRestartImpact, errors);
    validateRequiredField(task.taskId, "Rollout / Backout Posture", row.rolloutBackoutPosture, errors);
    validateRequiredField(task.taskId, "Artifact / Materialization Impact", row.artifactMaterializationImpact, errors);
    validateRequiredField(task.taskId, "Generated / Apply / Check Command", row.generatedApplyCheckCommand, errors);
    validateRequiredField(task.taskId, "Expected Seam Output", row.expectedSeamOutput, errors);
    validateRequiredField(task.taskId, "Architecture / Standards Boundary", row.architectureStandardsBoundary, errors);
    validateRequiredField(task.taskId, "Split / Blocked Follow-Up", row.splitBlockedFollowUp, errors);
    validateRequiredField(task.taskId, "Proof Commands", row.proofCommands, errors);
    validateRequiredField(task.taskId, "Human Review Boundary", row.humanReviewBoundary, errors);

    const authority = row.approvedAuthoritySource.toLowerCase();
    if (
      !authority.includes("technical steering") &&
      !authority.includes("adr") &&
      !authority.includes("standard") &&
      !authority.includes("implementation blueprint") &&
      !authority.includes("story") &&
      !authority.includes("architecture") &&
      !authority.includes("capability")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract needs approved authority from Technical Steering, ADR, standard, implementation blueprint, story classification, architecture docs, or capability rows`);
    }

    const ownerScope = `${row.seamOwnerLocation} ${row.seamChangeScope}`.replace(/\\/g, "/").toLowerCase();
    if (
      !ownerScope.includes("src/routes") &&
      !ownerScope.includes("src/lib") &&
      !ownerScope.includes("src/scripts") &&
      !ownerScope.includes("src/server") &&
      !ownerScope.includes("middleware") &&
      !ownerScope.includes("router") &&
      !ownerScope.includes("scheduler") &&
      !ownerScope.includes("bootstrap") &&
      !ownerScope.includes("generated") &&
      !ownerScope.includes("materialization") &&
      !ownerScope.includes("platform")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract must name a shared platform, runtime, tooling, generated-artifact, or materialization seam`);
    }

    if (!mentionsScriptableInventory(row.seamSourceInventory)) {
      errors.push(`${task.taskId} Platform Seam Contract needs scriptable seam source inventory`);
    }

    const writeEnvelope = row.exactWriteEnvelope.replace(/\\/g, "/").toLowerCase();
    if (
      (writeEnvelope === "src/" ||
        writeEnvelope === "src/*" ||
        writeEnvelope.includes("broad src") ||
        writeEnvelope.includes("broad platform") ||
        writeEnvelope.includes("as needed") ||
        writeEnvelope.includes("etc.")) &&
      !writeEnvelope.includes("blocked")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract must use an exact or narrow write envelope, not broad platform/source edits`);
    }
    if (
      !writeEnvelope.includes(".ts") &&
      !writeEnvelope.includes(".json") &&
      !writeEnvelope.includes(".md") &&
      !writeEnvelope.includes("exact") &&
      !writeEnvelope.includes("narrow") &&
      !writeEnvelope.includes("not-applicable") &&
      !writeEnvelope.includes("blocked")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract must name exact files or narrow path patterns`);
    }

    const featureLocal = row.whyNotFeatureLocal.toLowerCase();
    if (
      !featureLocal.includes("not feature-local") &&
      !featureLocal.includes("shared") &&
      !featureLocal.includes("multiple") &&
      !featureLocal.includes("platform") &&
      !featureLocal.includes("cross-feature")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract must explain why the work is not feature-local`);
    }

    const consumers = row.currentFutureUnsupportedConsumers.toLowerCase();
    if (!consumers.includes("current") || !consumers.includes("future") || !consumers.includes("unsupported")) {
      errors.push(`${task.taskId} Platform Seam Contract must name current, future, and unsupported consumers`);
    }

    const compatibility = row.compatibilityContract.toLowerCase();
    if (
      !compatibility.includes("backwards") &&
      !compatibility.includes("compatible") &&
      !compatibility.includes("compatibility") &&
      !compatibility.includes("blocked")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract must name backwards-compatibility expectations or a compatibility blocker`);
    }

    const representativeProof = row.representativeConsumerProof.toLowerCase();
    if (
      !representativeProof.includes("consumer") &&
      !representativeProof.includes("route") &&
      !representativeProof.includes("harness") &&
      !representativeProof.includes("generated") &&
      !representativeProof.includes("test") &&
      !representativeProof.includes("check")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract must name representative consumer proof`);
    }

    const runtimeImpact = row.runtimeRestartImpact.toLowerCase();
    if (isRuntimePlatformSeamKind(row.seamKind)) {
      if (
        !runtimeImpact.includes("restart") &&
        !runtimeImpact.includes("reload") &&
        !runtimeImpact.includes("redeploy") &&
        !runtimeImpact.includes("not-required") &&
        !runtimeImpact.includes("not required")
      ) {
        errors.push(`${task.taskId} Platform Seam Contract runtime seams must name restart, reload, redeploy, or not-required posture`);
      }
    }

    const rollout = row.rolloutBackoutPosture.toLowerCase();
    if (
      !rollout.includes("rollout") &&
      !rollout.includes("backout") &&
      !rollout.includes("rollback") &&
      !rollout.includes("revert") &&
      !rollout.includes("not-applicable")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract must name rollout, rollback, backout, revert, or not-applicable posture`);
    }

    const materializationCommand = row.generatedApplyCheckCommand.toLowerCase();
    const expectedOutput = row.expectedSeamOutput.toLowerCase();
    if (
      !expectedOutput.includes("output") &&
      !expectedOutput.includes("artifact") &&
      !expectedOutput.includes("route") &&
      !expectedOutput.includes("helper") &&
      !expectedOutput.includes("generated") &&
      !expectedOutput.includes("seam") &&
      !expectedOutput.includes("not-applicable")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract must name expected seam output or artifact target`);
    }
    if (row.seamKind === "generated-artifact-materialization") {
      if (
        materializationCommand.includes("not-applicable") ||
        (!materializationCommand.includes("npm run") &&
          !materializationCommand.includes("npx ") &&
          !materializationCommand.includes("node ") &&
          !materializationCommand.includes("tsx ") &&
          !materializationCommand.includes("apply") &&
          !materializationCommand.includes("check") &&
          !materializationCommand.includes("generate"))
      ) {
        errors.push(`${task.taskId} Platform Seam Contract generated/materialized seams must name generator, preview/apply, or check command`);
      }
    }

    const boundary = row.architectureStandardsBoundary.toLowerCase();
    const followUp = row.splitBlockedFollowUp.toLowerCase();
    const followUpRequiresRouting = !followUp.includes("not-applicable") && !followUp.includes("unchanged");
    if (row.compatibilityMode === "compatibility-sensitive-blocked") {
      if (
        !followUp.includes("blocked") &&
        !followUp.includes("approval") &&
        !followUp.includes("compatibility") &&
        !followUp.includes("gov:architecture-update")
      ) {
        errors.push(`${task.taskId} Platform Seam Contract compatibility-sensitive mode must name blocked, approval, compatibility, or GOV:architecture-update follow-up`);
      }
    }
    if (
      (boundary.includes("architecture changes") ||
        boundary.includes("authority changes") ||
        boundary.includes("policy changes") ||
        boundary.includes("new architecture")) &&
      !boundary.includes("no authority changes") &&
      !boundary.includes("no architecture changes") &&
      !followUp.includes("gov:architecture-update")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract architecture authority changes must route to GOV:architecture-update`);
    }
    if (
      (boundary.includes("standard changes") || boundary.includes("standards changes")) &&
      !boundary.includes("no standard changes") &&
      !boundary.includes("no standards changes") &&
      !followUp.includes("gov:standards-update")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract standards authority changes must route to GOV:standards-update`);
    }
    if (
      followUpRequiresRouting &&
      (followUp.includes("feature-local") || followUp.includes("feature behavior")) &&
      !followUp.includes("dev:backend") &&
      !followUp.includes("dev:frontend") &&
      !followUp.includes("dev:vertical-slice")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract feature-local behavior must route to DEV:backend, DEV:frontend, or DEV:vertical-slice`);
    }
    if (
      followUpRequiresRouting &&
      (followUp.includes("api") || followUp.includes("openapi") || followUp.includes("postman")) &&
      !followUp.includes("doc:api-contract")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract API contract changes must route to DOC:api-contract`);
    }
    if (
      followUpRequiresRouting &&
      (followUp.includes("permission") || followUp.includes("authz") || followUp.includes("capability key")) &&
      !followUp.includes("doc:permission-mapping")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract permission mapping changes must route to DOC:permission-mapping`);
    }
    if (
      followUpRequiresRouting &&
      (followUp.includes("schema") || followUp.includes("migration") || followUp.includes("persistence")) &&
      !followUp.includes("dev:migration-persistence")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract schema, migration, or persistence changes must route to DEV:migration-persistence`);
    }
    if (
      followUpRequiresRouting &&
      (followUp.includes("evidence sweep") || followUp.includes("artifact sweep")) &&
      !followUp.includes("evidence:qa-evidence")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract evidence or artifact sweeps must route to EVIDENCE:qa-evidence`);
    }

    const proofCommands = row.proofCommands.toLowerCase();
    if (
      !proofCommands.includes("npm run") &&
      !proofCommands.includes("npx ") &&
      !proofCommands.includes("vitest") &&
      !proofCommands.includes("playwright") &&
      !proofCommands.includes("node ") &&
      !proofCommands.includes("tsx ")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract must name executable focused proof commands`);
    }
    if (
      (proofCommands.trim() === "npm test" ||
        proofCommands.trim() === "npm run test" ||
        proofCommands.trim() === "npm run typecheck") &&
      !proofCommands.includes("tests/") &&
      !proofCommands.includes("feature-dependencies") &&
      !proofCommands.includes("route") &&
      !proofCommands.includes("consumer")
    ) {
      errors.push(`${task.taskId} Platform Seam Contract proof commands must include focused seam or representative consumer proof, not only broad suite commands`);
    }
  }
}

function validatePlatformSeamClassContract(
  task: TaskRow,
  seamRows: PlatformSeamContractRow[],
  classRows: PlatformSeamClassContractRow[],
  errors: string[],
): void {
  if (task.taskType !== "DEV:platform-seam") {
    if (classRows.length > 0) {
      errors.push(`${task.taskId} has Platform Seam Class Contract rows but is ${task.taskType}`);
    }
    return;
  }

  if (classRows.length === 0) {
    errors.push(`${task.taskId} has no Platform Seam Class Contract row`);
    return;
  }

  for (const row of classRows) {
    validateAllowedValue(task.taskId, "Platform Seam Class", row.platformSeamClass, allowedPlatformSeamKinds, errors);
    validateRequiredField(task.taskId, "Class-Specific Required Proof", row.classSpecificRequiredProof, errors);
    validateRequiredField(task.taskId, "Required Consumer Coverage", row.requiredConsumerCoverage, errors);
    validateRequiredField(task.taskId, "Runtime / Materialization Expectation", row.runtimeMaterializationExpectation, errors);
    validateRequiredField(task.taskId, "Forbidden Contamination / Split Notes", row.forbiddenContaminationSplitNotes, errors);

    if (seamRows.length > 0 && !seamRows.some((seamRow) => seamRow.seamKind === row.platformSeamClass)) {
      errors.push(`${task.taskId} Platform Seam Class Contract class must match the Platform Seam Contract seam kind`);
    }

    validatePlatformSeamClassSpecifics(task.taskId, row, errors);
  }
}

function validatePlatformSeamClassSpecifics(taskId: string, row: PlatformSeamClassContractRow, errors: string[]): void {
  const proof = row.classSpecificRequiredProof.toLowerCase();
  const consumers = row.requiredConsumerCoverage.toLowerCase();
  const runtime = row.runtimeMaterializationExpectation.toLowerCase();
  const splitNotes = row.forbiddenContaminationSplitNotes.toLowerCase();
  const combined = `${proof} ${consumers} ${runtime} ${splitNotes}`;
  const splitNotesRequireRouting = !splitNotes.includes("not-applicable") && !splitNotes.includes("unchanged");

  if (row.platformSeamClass === "router-route-mounting" && !mentionsRouterMountingClassProof(combined)) {
    errors.push(`${taskId} router-route-mounting platform seam class must prove route registration/mounting and an existing route consumer`);
  }

  if (row.platformSeamClass === "middleware-auth-request-context" && !mentionsMiddlewareRequestContextClassProof(combined)) {
    errors.push(`${taskId} middleware-auth-request-context platform seam class must prove middleware/auth/request-context behavior and a route-family consumer`);
  }

  if (row.platformSeamClass === "scheduler-job-runtime" && !mentionsSchedulerJobClassProof(combined)) {
    errors.push(`${taskId} scheduler-job-runtime platform seam class must prove job scheduling/runtime behavior, timing or retry posture, and a job consumer`);
  }

  if (row.platformSeamClass === "bootstrap-runtime" && !mentionsBootstrapRuntimeClassProof(combined)) {
    errors.push(`${taskId} bootstrap-runtime platform seam class must prove startup/bootstrap behavior and restart, reload, or deploy posture`);
  }

  if (row.platformSeamClass === "generated-artifact-materialization" && !mentionsGeneratedArtifactClassProof(combined)) {
    errors.push(`${taskId} generated-artifact-materialization platform seam class must prove generator/apply/check behavior and generated artifact consumers`);
  }

  if (row.platformSeamClass === "tooling-harness" && !mentionsToolingHarnessClassProof(combined)) {
    errors.push(`${taskId} tooling-harness platform seam class must prove the tool/script/harness command and repo workflow or test consumer`);
  }

  if (row.platformSeamClass === "shared-runtime-helper" && !mentionsSharedRuntimeHelperClassProof(combined)) {
    errors.push(`${taskId} shared-runtime-helper platform seam class must prove helper/runtime behavior and existing consumer compatibility`);
  }

  if (row.platformSeamClass === "cross-feature-seam-infrastructure" && !mentionsCrossFeatureSeamClassProof(combined)) {
    errors.push(`${taskId} cross-feature-seam-infrastructure platform seam class must prove cross-feature seam mechanics, public seam or manifest posture, and consumer boundaries`);
  }

  if (
    splitNotesRequireRouting &&
    (splitNotes.includes("api") || splitNotes.includes("openapi") || splitNotes.includes("postman")) &&
    !splitNotes.includes("doc:api-contract")
  ) {
    errors.push(`${taskId} Platform Seam Class Contract API contamination must route to DOC:api-contract`);
  }

  if (
    splitNotesRequireRouting &&
    (splitNotes.includes("permission") || splitNotes.includes("authz") || splitNotes.includes("capability")) &&
    !splitNotes.includes("doc:permission-mapping")
  ) {
    errors.push(`${taskId} Platform Seam Class Contract permission contamination must route to DOC:permission-mapping`);
  }

  if (
    splitNotesRequireRouting &&
    (splitNotes.includes("feature behavior") || splitNotes.includes("feature-local")) &&
    !splitNotes.includes("dev:backend") &&
    !splitNotes.includes("dev:frontend") &&
    !splitNotes.includes("dev:vertical-slice")
  ) {
    errors.push(`${taskId} Platform Seam Class Contract feature behavior contamination must route to DEV:backend, DEV:frontend, or DEV:vertical-slice`);
  }
}

function mentionsRouterMountingClassProof(value: string): boolean {
  return (
    (value.includes("route registration") || value.includes("route mounting") || value.includes("router mounting")) &&
    value.includes("consumer")
  );
}

function mentionsMiddlewareRequestContextClassProof(value: string): boolean {
  return (
    (value.includes("middleware") || value.includes("auth") || value.includes("request-context") || value.includes("request context")) &&
    (value.includes("route-family") || value.includes("route family") || value.includes("consumer"))
  );
}

function mentionsSchedulerJobClassProof(value: string): boolean {
  return (
    (value.includes("scheduler") || value.includes("job")) &&
    (value.includes("runtime") || value.includes("scheduling")) &&
    (value.includes("timing") || value.includes("retry")) &&
    value.includes("consumer")
  );
}

function mentionsBootstrapRuntimeClassProof(value: string): boolean {
  return (
    (value.includes("bootstrap") || value.includes("startup")) &&
    (value.includes("restart") || value.includes("reload") || value.includes("deploy") || value.includes("redeploy"))
  );
}

function mentionsGeneratedArtifactClassProof(value: string): boolean {
  return (
    (value.includes("generated artifact") || value.includes("materialization")) &&
    (value.includes("generator") || value.includes("apply") || value.includes("check")) &&
    value.includes("consumer")
  );
}

function mentionsToolingHarnessClassProof(value: string): boolean {
  return (
    (value.includes("tool") || value.includes("script") || value.includes("harness")) &&
    (value.includes("command") || value.includes("check")) &&
    (value.includes("workflow") || value.includes("test consumer") || value.includes("consumer"))
  );
}

function mentionsSharedRuntimeHelperClassProof(value: string): boolean {
  return (
    value.includes("helper") &&
    value.includes("runtime") &&
    value.includes("consumer") &&
    value.includes("compat")
  );
}

function mentionsCrossFeatureSeamClassProof(value: string): boolean {
  return (
    (value.includes("cross-feature") || value.includes("cross feature")) &&
    (value.includes("public seam") || value.includes("manifest")) &&
    value.includes("consumer")
  );
}

function isRuntimePlatformSeamKind(seamKind: string): boolean {
  return (
    seamKind === "router-route-mounting" ||
    seamKind === "middleware-auth-request-context" ||
    seamKind === "scheduler-job-runtime" ||
    seamKind === "bootstrap-runtime" ||
    seamKind === "shared-runtime-helper" ||
    seamKind === "cross-feature-seam-infrastructure"
  );
}

function validateCodePlacement(
  task: TaskRow,
  rows: CodePlacementRow[],
  tasks: TaskRow[],
  dependencyRows: TaskDependencyRow[],
  errors: string[],
): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} has no code placement and extraction review row`);
    return;
  }

  for (const row of rows) {
    if (!allowedPlacementDecisions.has(row.placementDecision)) {
      errors.push(`${task.taskId} has invalid placement decision: ${row.placementDecision || "(blank)"}`);
    }

    validateRequiredField(task.taskId, "Current Owner", row.currentOwner, errors);
    validateRequiredField(task.taskId, "Proposed Owner", row.proposedOwner, errors);
    validateRequiredField(task.taskId, "Extraction Needed", row.extractionNeeded, errors);
    validateRequiredField(task.taskId, "Required Supplemental Guardrail References", row.supplementalGuardrails, errors);
    validateRequiredField(task.taskId, "Compatibility Proof", row.compatibilityProof, errors);

    const extractionNeeded = row.extractionNeeded.trim().toLowerCase();
    if (extractionNeeded !== "yes" && extractionNeeded !== "no") {
      errors.push(`${task.taskId} has invalid Extraction Needed: ${row.extractionNeeded || "(blank)"}`);
    }

    if (row.approvalStatus === "blocked" || row.placementDecision === "blocked") {
      errors.push(`${task.taskId} code placement is blocked`);
    } else if (row.approvalStatus !== "approved" && !row.approvalStatus.startsWith("not-applicable:")) {
      errors.push(`${task.taskId} has invalid code placement approval status: ${row.approvalStatus || "(blank)"}`);
    }

    if (task.handoffStatus === "queued-for-delivery" && row.approvalStatus !== "approved") {
      errors.push(`${task.taskId} is queued-for-delivery without approved code placement`);
    }

    if (row.placementDecision === "shared-lib") {
      if (!row.proposedOwner.includes("src/lib")) {
        errors.push(`${task.taskId} shared-lib placement must propose src/lib ownership`);
      }

      if (!mentionsCompatibilityEvidence(row.compatibilityProof)) {
        errors.push(`${task.taskId} shared-lib placement needs existing-consumer compatibility proof`);
      }
    }

    if (row.placementDecision === "shared-lib" || row.placementDecision === "stay-put" || extractionNeeded === "yes") {
      if (!row.supplementalGuardrails.includes("shared-code-placement-task-guardrail.md")) {
        errors.push(`${task.taskId} must reference shared-code-placement-task-guardrail.md`);
      }
    }

    if (extractionNeeded === "yes") {
      const extractionTasks = tasks.filter((candidate) =>
        candidate.taskId !== task.taskId &&
        (candidate.taskType === "DECISION:refactor-first" || candidate.taskType === "DEV:platform-seam")
      );

      if (extractionTasks.length === 0 && task.taskType !== "DECISION:refactor-first" && task.taskType !== "DEV:platform-seam") {
        errors.push(`${task.taskId} needs separate DECISION:refactor-first or DEV:platform-seam extraction task`);
      }

      const dependencyIds = new Set(dependencyRows.flatMap((dependency) => splitIds(dependency.dependsOnTaskIds)));
      const dependsOnExtractionTask = extractionTasks.some((candidate) => dependencyIds.has(candidate.taskId));
      const blocksQueueing = dependencyRows.some((dependency) =>
        splitIds(dependency.dependsOnTaskIds).some((dependencyTaskId) =>
          extractionTasks.some((candidate) => candidate.taskId === dependencyTaskId)
        ) && dependency.mustCompleteBeforeQueueing.trim().toLowerCase() === "yes"
      );

      if (
        task.taskType !== "DECISION:refactor-first" &&
        task.taskType !== "DEV:platform-seam" &&
        (!dependsOnExtractionTask || !blocksQueueing)
      ) {
        errors.push(`${task.taskId} extraction dependency must block queueing on a DECISION:refactor-first or DEV:platform-seam task`);
      }
    }
  }
}

function validateWriteSetClassification(task: TaskRow, rows: WriteSetClassificationRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} has no allowed write set classification rows`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Path Pattern", row.pathPattern, errors);
    validateRequiredField(task.taskId, "Write Class", row.writeClass, errors);
    validateRequiredField(task.taskId, "Write Set Reason", row.reason, errors);

    if (!allowedWriteClasses.has(row.writeClass)) {
      errors.push(`${task.taskId} has invalid write class: ${row.writeClass || "(blank)"}`);
    }

    if (row.writeClass === "blocked") {
      errors.push(`${task.taskId} write set classification is blocked for ${row.pathPattern || "(blank)"}`);
    }
  }
}

function validateForbiddenWork(task: TaskRow, rows: ForbiddenWorkRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} has no forbidden work rows`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Forbidden Work", row.forbiddenWork, errors);
    validateRequiredField(task.taskId, "Forbidden Work Reason", row.reason, errors);
  }
}

function validateSourceHandoffFields(content: string, errors: string[]): void {
  const storyScopePreserved = parseBulletValue(content, "Story scope preserved");
  const acPreserved = parseBulletValue(content, "Acceptance criteria preserved");
  const productIntentPreserved = parseBulletValue(content, "Product intent preserved");
  const steeringPreserved = parseBulletValue(content, "Technical Steering architecture preserved");
  const architectureInvention = parseBulletValue(content, "Architecture invention check");
  const capabilityRowsComplete = parseBulletValue(content, "Capability rows complete for implementation tasks");

  for (const [field, value] of [
    ["Story scope preserved", storyScopePreserved],
    ["Acceptance criteria preserved", acPreserved],
    ["Product intent preserved", productIntentPreserved],
    ["Technical Steering architecture preserved", steeringPreserved],
  ]) {
    if (value !== "yes") {
      errors.push(`${field} must be yes`);
    }
  }

  if (architectureInvention === "proposes-new-architecture" || architectureInvention === "blocked") {
    errors.push(`Architecture invention check is ${architectureInvention}`);
  }

  if (capabilityRowsComplete === "no") {
    errors.push("Capability rows complete for implementation tasks is no");
  }
}

function validateSelectedStories(
  selectedStories: StoryRow[],
  sourceStoriesById: Map<string, StoryRow>,
  sourceHandoffsByStory: Map<string, SourceHandoffRow>,
  errors: string[],
): void {
  for (const selected of selectedStories) {
    const source = sourceStoriesById.get(selected.storyId);
    if (!source) {
      errors.push(`selected story ${selected.storyId} is not present in the source Story Breakdown packet`);
      continue;
    }

    const handoff = sourceHandoffsByStory.get(selected.storyId);
    if (source.status !== "ready-for-task-breakdown") {
      errors.push(`selected story ${selected.storyId} source status is ${source.status || "(blank)"}`);
    }

    if (handoff?.handoffStatus !== "ready-for-task-breakdown") {
      errors.push(`selected story ${selected.storyId} Layer 4 handoff is ${handoff?.handoffStatus || "(missing)"}`);
    }

    if (selected.status !== source.status) {
      errors.push(`selected story ${selected.storyId} changes story status from ${source.status} to ${selected.status}`);
    }

    for (const [field, taskValue, sourceValue] of [
      ["Value Type", selected.valueType, source.valueType],
      ["Delivery Shape", selected.deliveryShape, source.deliveryShape],
      ["Title", selected.title, source.title],
      ["Job To Be Done", selected.jobToBeDone, source.jobToBeDone],
      ["Outcome", selected.outcome, source.outcome],
    ]) {
      if (taskValue !== sourceValue) {
        errors.push(`selected story ${selected.storyId} changes story ${field}`);
      }
    }
  }
}

function validateAcceptanceCriteriaSnapshot(
  acSnapshot: StoryAcceptanceCriterionRow[],
  selectedStoryIds: Set<string>,
  sourceAcsById: Map<string, StoryAcceptanceCriterionRow>,
  errors: string[],
): void {
  const snapshotAcIds = new Set(acSnapshot.map((row) => row.acId));

  for (const ac of acSnapshot) {
    const source = sourceAcsById.get(ac.acId);
    if (!source) {
      errors.push(`${ac.acId} is not present in the source Story Breakdown packet`);
      continue;
    }

    if (!selectedStoryIds.has(ac.storyId)) {
      errors.push(`${ac.acId} references unselected story ${ac.storyId}`);
    }

    for (const [field, taskValue, sourceValue] of [
      ["Story ID", ac.storyId, source.storyId],
      ["Acceptance Criterion", ac.criterion, source.criterion],
      ["Primary Proof Layer", ac.proofLayer, source.proofLayer],
      ["Required Test Families", ac.requiredTestFamilies, source.requiredTestFamilies],
      ["Required Artifact Obligations", ac.requiredArtifactObligations, source.requiredArtifactObligations],
    ]) {
      if (taskValue !== sourceValue) {
        errors.push(`${ac.acId} changes story ${field}`);
      }
    }
  }

  for (const source of sourceAcsById.values()) {
    if (selectedStoryIds.has(source.storyId) && !snapshotAcIds.has(source.acId)) {
      errors.push(`${source.acId} is missing from Story Acceptance Criteria Snapshot`);
    }
  }
}

function validateCapabilitySnapshot(
  capabilitySnapshot: SourceCapabilityRow[],
  selectedStoryIds: Set<string>,
  sourceCapabilitiesByAc: Map<string, SourceCapabilityRow[]>,
  errors: string[],
): void {
  for (const row of capabilitySnapshot) {
    if (!selectedStoryIds.has(row.storyId)) {
      errors.push(`${row.acId} capability snapshot references unselected story ${row.storyId}`);
    }

    const matching = sourceCapabilitiesByAc.get(row.acId) ?? [];
    if (matching.length === 0) {
      errors.push(`${row.acId} capability snapshot is not present in the source Story Breakdown packet`);
      continue;
    }

    if (!matching.some((source) => source.capabilityRows === row.capabilityRows && source.posture === row.posture)) {
      errors.push(`${row.acId} capability snapshot changes source capability rows or posture`);
    }
  }
}

function validateStoryArtifactObligationsSelected(
  selectedStoryIds: Set<string>,
  sourceArtifacts: SourceArtifactRow[],
  errors: string[],
): void {
  for (const storyId of selectedStoryIds) {
    if (!sourceArtifacts.some((row) => row.storyId === storyId)) {
      errors.push(`${storyId} has no source Artifact Ledger row to preserve into Task Breakdown`);
    }
  }
}

function validateTaskRow(task: TaskRow, selectedStoryIds: Set<string>, errors: string[]): void {
  validateRequiredField(task.taskId, "Task ID", task.taskId, errors);
  validateRequiredField(task.taskId, "Title / Execution Scope", task.scope, errors);
  validateRequiredField(task.taskId, "Allowed Write Set", task.allowedWriteSet, errors);
  validateRequiredField(task.taskId, "Non-Goals", task.nonGoals, errors);
  validateRequiredField(task.taskId, "Dependencies", task.dependencies, errors);
  validateRequiredField(task.taskId, "Shared Seams", task.sharedSeams, errors);

  if (!selectedStoryIds.has(task.parentStoryId)) {
    errors.push(`${task.taskId} references unapproved story ${task.parentStoryId || "(blank)"}`);
  }

  if (!allowedTaskTypes.has(task.taskType)) {
    errors.push(`${task.taskId} has invalid task type: ${task.taskType || "(blank)"}`);
  }

  if (!allowedTaskStatuses.has(task.handoffStatus)) {
    errors.push(`${task.taskId} has invalid delivery handoff status: ${task.handoffStatus || "(blank)"}`);
  }
}

function validateTaskCategoryBoundary(task: TaskRow, errors: string[]): void {
  if (!allowedTaskTypes.has(task.taskType)) {
    return;
  }

  if (task.taskType.startsWith("DOC:") && mentionsProductionCodePath(task.allowedWriteSet)) {
    errors.push(`${task.taskId} DOC task type must not own source implementation write paths`);
  }

  if (task.taskType.startsWith("TEST:") && mentionsProductionCodePath(task.allowedWriteSet)) {
    errors.push(`${task.taskId} TEST task type must not own production code write paths`);
  }

  if (task.taskType.startsWith("EVIDENCE:") && mentionsProductionCodePath(task.allowedWriteSet)) {
    errors.push(`${task.taskId} EVIDENCE task type must not patch production behavior`);
  }

  if (task.taskType === "EVIDENCE:qa-evidence" && mentionsExecutableTestWritePath(task.allowedWriteSet)) {
    errors.push(`${task.taskId} EVIDENCE:qa-evidence must not own executable test changes; use TEST:test-only or TEST:test-suite-alignment`);
  }

  if (task.taskType === "EVIDENCE:qa-evidence" && mentionsAuthorityWritePath(task.allowedWriteSet)) {
    errors.push(`${task.taskId} EVIDENCE:qa-evidence must not change durable standards or architecture authority; use GOV:standards-update or GOV:architecture-update`);
  }

  if (task.taskType.startsWith("GOV:") && task.taskType !== "GOV:design-system" && mentionsProductionCodePath(task.allowedWriteSet)) {
    errors.push(`${task.taskId} GOV task type must not own product/runtime implementation write paths`);
  }

  if (task.taskType === "GOV:design-system" && mentionsAppFrontendImplementationPath(task.allowedWriteSet)) {
    errors.push(`${task.taskId} GOV:design-system task must not own app-page implementation paths; split app adoption to DEV:frontend`);
  }

  if (task.taskType.startsWith("DEV:") && mentionsBroadDocsSweep(task.allowedWriteSet)) {
    errors.push(`${task.taskId} DEV task type must not own broad source-independent artifact sweeps`);
  }

  if (task.taskType === "DECISION:architecture-foundation" && mentionsProductionCodePath(task.allowedWriteSet)) {
    errors.push(`${task.taskId} DECISION:architecture-foundation must record decisions before source implementation changes`);
  }

  if (task.taskType === "DOC:standards-compliance" && mentionsStandardsAuthorityWritePath(task.allowedWriteSet)) {
    errors.push(`${task.taskId} DOC:standards-compliance must not change standards authority; use GOV:standards-update`);
  }
}

function validateTaskReferences(taskId: string, taskIds: Set<string>, errors: string[]): void {
  if (!taskIds.has(taskId)) {
    errors.push(`unknown task ${taskId}`);
  }
}

function validateAcCoverage(
  task: TaskRow,
  rows: TaskAcCoverageRow[],
  sourceAcsById: Map<string, StoryAcceptanceCriterionRow>,
  selectedStoryIds: Set<string>,
  errors: string[],
): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} has no acceptance-criterion coverage row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "AC IDs Covered", row.acIds, errors);
    for (const acId of splitIds(row.acIds)) {
      const sourceAc = sourceAcsById.get(acId);
      if (!sourceAc) {
        errors.push(`${task.taskId} references unknown acceptance criterion ${acId}`);
      } else if (!selectedStoryIds.has(sourceAc.storyId)) {
        errors.push(`${task.taskId} references acceptance criterion ${acId} for unselected story ${sourceAc.storyId}`);
      }
    }
  }
}

function validateCapabilityCoverage(
  task: TaskRow,
  rows: TaskCapabilityCoverageRow[],
  errors: string[],
): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} has no capability coverage row`);
    return;
  }

  for (const row of rows) {
    if (!allowedCapabilityCoverageStatuses.has(row.status)) {
      errors.push(`${task.taskId} has invalid capability coverage status: ${row.status || "(blank)"}`);
    }

    if (row.status === "blocked-missing-row") {
      errors.push(`${task.taskId} capability coverage is blocked-missing-row`);
    }

    if (implementationTaskTypes.has(task.taskType) && row.status !== "not-capability-backed") {
      validateRequiredField(task.taskId, "Capability Matrix Row(s) Covered", row.capabilityRows, errors);
    }
  }
}

function validateDependencyRows(
  taskId: string,
  rows: TaskDependencyRow[],
  taskIds: Set<string>,
  errors: string[],
): void {
  if (rows.length === 0) {
    errors.push(`${taskId} has no task dependency row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(taskId, "Dependency Reason", row.dependencyReason, errors);
    validateRequiredField(taskId, "Must Complete Before Queueing", row.mustCompleteBeforeQueueing, errors);

    for (const dependencyTaskId of splitIds(row.dependsOnTaskIds)) {
      if (dependencyTaskId.startsWith("not-applicable")) {
        continue;
      }

      if (!taskIds.has(dependencyTaskId)) {
        errors.push(`${taskId} depends on unknown task ${dependencyTaskId}`);
      }
    }
  }
}

function validateSharedSeams(task: TaskRow, rows: SharedSeamRow[], errors: string[]): void {
  if (mentionsSharedSeam(task.sharedSeams) && rows.length === 0) {
    errors.push(`${task.taskId} touches shared seams but has no Shared Seams row`);
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} has no Shared Seams row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Shared Seam", row.sharedSeam, errors);
    validateRequiredField(task.taskId, "Seam Type", row.seamType, errors);
    validateRequiredField(task.taskId, "Existing Or New", row.existingOrNew, errors);
    validateRequiredField(task.taskId, "Required Contract / Ownership Proof", row.proof, errors);
  }
}

function validateArtifacts(task: TaskRow, rows: ArtifactObligationRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} has no artifact obligations row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Required Artifact", row.requiredArtifact, errors);
    validateRequiredField(task.taskId, "Required Action", row.requiredAction, errors);
    validateRequiredField(task.taskId, "Owner Skill Or Workflow", row.owner, errors);
    validateRequiredField(task.taskId, "Blocks Delivery Handoff", row.blocksDeliveryHandoff, errors);
  }
}

function validateProofs(task: TaskRow, rows: ProofCommandRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} has no proof and command plan row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Required Proof Layers", row.proofLayers, errors);
    validateRequiredField(task.taskId, "Required Test Or Proof Commands", row.commands, errors);
    validateRequiredField(task.taskId, "Mock Honesty / Runtime Evidence Notes", row.evidenceNotes, errors);
  }
}

function validateQaEvidenceInstrumentSummaries(
  task: TaskRow,
  rows: QaEvidenceInstrumentSummaryRow[],
  errors: string[],
): void {
  if (task.taskType !== "EVIDENCE:qa-evidence") {
    return;
  }

  if (rows.length === 0) {
    errors.push(`${task.taskId} EVIDENCE:qa-evidence task has no QA evidence instrument summary row`);
    return;
  }

  for (const row of rows) {
    validateAllowedValue(task.taskId, "QA Evidence Class", row.qaEvidenceClass, allowedQaEvidenceClasses, errors);
    validateRequiredField(task.taskId, "Evidence Source Inventory", row.evidenceSourceInventory, errors);
    validateRequiredField(task.taskId, "Selected Evidence Instruments", row.selectedEvidenceInstruments, errors);
    validateRequiredField(task.taskId, "Live Runtime / Payload Evidence", row.liveRuntimePayloadEvidence, errors);
    validateRequiredField(task.taskId, "Mock Honesty Comparison", row.mockHonestyComparison, errors);
    validateRequiredField(task.taskId, "Expected Evidence Output", row.expectedEvidenceOutput, errors);
    validateRequiredField(task.taskId, "Evidence Status / Remaining Gap", row.evidenceStatusRemainingGap, errors);
    validateRequiredField(task.taskId, "Human Review Boundary", row.humanReviewBoundary, errors);

    if (!mentionsQaEvidenceSourceInventory(row.evidenceSourceInventory)) {
      errors.push(`${task.taskId} QA Evidence Instrument Summary needs scriptable evidence source inventory or exact runtime target`);
    }

    const runtime = row.liveRuntimePayloadEvidence.toLowerCase();
    const mockHonesty = row.mockHonestyComparison.toLowerCase();
    if (
      row.qaEvidenceClass === "live-payload-sample" &&
      !runtime.includes("payload") &&
      !runtime.includes("api") &&
      !runtime.includes("projection") &&
      !runtime.includes("persistence")
    ) {
      errors.push(`${task.taskId} live-payload-sample QA evidence must name live API, projection, payload, or persistence evidence`);
    }
    if (
      row.qaEvidenceClass === "served-asset-verification" &&
      !runtime.includes("served") &&
      !runtime.includes("asset") &&
      !runtime.includes("browser") &&
      !runtime.includes("process") &&
      !runtime.includes("port")
    ) {
      errors.push(`${task.taskId} served-asset-verification QA evidence must name served asset, browser, process, or port evidence`);
    }
    if (
      row.qaEvidenceClass === "mock-honesty-comparison" &&
      (isNotApplicableValue(row.mockHonestyComparison) ||
        (!mockHonesty.includes("mock") && !mockHonesty.includes("fixture")) ||
        (!mockHonesty.includes("live") && !mockHonesty.includes("contract") && !mockHonesty.includes("payload")))
    ) {
      errors.push(`${task.taskId} mock-honesty-comparison QA evidence must compare mocks or fixtures with live, payload, or contract shape`);
    }
  }
}

function mentionsQaEvidenceSourceInventory(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    mentionsScriptableInventory(value) ||
    normalized.includes("api") ||
    normalized.includes("payload") ||
    normalized.includes("projection") ||
    normalized.includes("browser") ||
    normalized.includes("screenshot") ||
    normalized.includes("trace") ||
    normalized.includes("served asset") ||
    normalized.includes("process") ||
    normalized.includes("port") ||
    normalized.includes("postgres") ||
    normalized.includes("database")
  );
}

function validateDebtHealthSummaries(task: TaskRow, rows: DebtHealthSummaryRow[], errors: string[]): void {
  const requiresSummary =
    task.taskType === "DOC:data-dictionary" ||
    task.taskType === "TEST:test-only" ||
    task.taskType === "TEST:test-suite-alignment" ||
    task.taskType === "EVIDENCE:qa-evidence";

  if (requiresSummary && rows.length === 0) {
    errors.push(`${task.taskId} ${task.taskType} task has no debt health summary command row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Summary Command", row.summaryCommand, errors);
    validateRequiredField(task.taskId, "Summary Result", row.summaryResult, errors);
    validateRequiredField(task.taskId, "Debt Found", row.debtFound, errors);
    validateRequiredField(task.taskId, "Debt Disposition", row.debtDisposition, errors);
    validateRequiredField(task.taskId, "Follow-Up Task ID / Owner", row.followUpTaskOrOwner, errors);

    if (!mentionsAllowedDebtSummaryResult(row.summaryResult)) {
      errors.push(`${task.taskId} has invalid debt health summary result: ${row.summaryResult || "(blank)"}`);
    }

    if (!mentionsAllowedDebtDisposition(row.debtDisposition)) {
      errors.push(`${task.taskId} has invalid debt disposition: ${row.debtDisposition || "(blank)"}`);
    }

    if (task.taskType === "DOC:data-dictionary" && !mentionsDataComplianceHealthCommand(row.summaryCommand)) {
      errors.push(`${task.taskId} DOC:data-dictionary task must include npm run data:compliance-health`);
    }

    if (task.taskType === "DOC:data-dictionary" && mentionsDataRetentionReviewDebt(row)) {
      if (row.debtDisposition === "none" || row.debtDisposition.startsWith("not-applicable")) {
        errors.push(`${task.taskId} DOC:data-dictionary retention/export/delete/legal-hold review debt must be resolved in scope, split, accepted with owner, or blocked`);
      }

      if (!mentionsDataRetentionReviewOwner(row.followUpTaskOrOwner) && row.debtDisposition !== "in-scope-resolved") {
        errors.push(`${task.taskId} DOC:data-dictionary retention/export/delete/legal-hold review debt must name a data, standards, or governance owner`);
      }
    }

    if (
      (task.taskType === "TEST:test-only" ||
        task.taskType === "TEST:test-suite-alignment" ||
        task.taskType === "EVIDENCE:qa-evidence") &&
      !mentionsCoverageStrengthCommand(row.summaryCommand)
    ) {
      errors.push(`${task.taskId} ${task.taskType} task must include npm run test:coverage-strength`);
    }

    if (row.summaryResult === "blocked" || row.debtDisposition === "blocked") {
      errors.push(`${task.taskId} debt health summary is blocked`);
    }

    if (
      (row.debtDisposition === "split-follow-up" || row.debtDisposition === "accepted-deferred") &&
      isNotApplicableValue(row.followUpTaskOrOwner)
    ) {
      errors.push(`${task.taskId} debt disposition ${row.debtDisposition} must name a follow-up task or owner`);
    }
  }
}

function validateBootstrap(task: TaskRow, rows: BootstrapRow[], errors: string[]): void {
  if (rows.length === 0) {
    errors.push(`${task.taskId} has no branch/worktree/bootstrap strategy row`);
    return;
  }

  for (const row of rows) {
    validateRequiredField(task.taskId, "Branch Name", row.branchName, errors);
    validateRequiredField(task.taskId, "Worktree Strategy", row.worktreeStrategy, errors);
    validateRequiredField(task.taskId, "Bootstrap Artifact", row.bootstrapArtifact, errors);
    validateRequiredField(task.taskId, "Base Ref", row.baseRef, errors);
    validateRequiredField(task.taskId, "Base Commit Policy", row.baseCommitPolicy, errors);
    validateRequiredField(task.taskId, "Promotion Target", row.promotionTarget, errors);
  }
}

function validateDeliveryHandoff(
  task: TaskRow,
  row: DeliveryHandoffRow | undefined,
  blockers: BlockerRow[],
  errors: string[],
): void {
  if (!row) {
    errors.push(`${task.taskId} has no Layer 5 Delivery Handoff row`);
    return;
  }

  if (!allowedTaskStatuses.has(row.handoffStatus)) {
    errors.push(`${task.taskId} has invalid Layer 5 handoff status: ${row.handoffStatus || "(blank)"}`);
  }

  if (row.handoffStatus !== task.handoffStatus) {
    errors.push(`${task.taskId} Task Queue handoff status does not match Layer 5 handoff status`);
  }

  if (row.handoffStatus === "queued-for-delivery" && !isNoBlockers(row.blockersRemaining)) {
    errors.push(`${task.taskId} is queued-for-delivery with blockers remaining`);
  }

  if (row.handoffStatus === "queued-for-delivery" && blockers.some((blocker) => !isResolved(blocker.resolution))) {
    errors.push(`${task.taskId} is queued-for-delivery while blocker rows remain unresolved`);
  }
}

function validateUnknownTaskReferences(
  sectionName: string,
  ids: string[],
  taskIds: Set<string>,
  errors: string[],
): void {
  for (const id of ids) {
    if (!taskIds.has(id)) {
      errors.push(`${sectionName} references unknown task ${id || "(blank)"}`);
    }
  }
}

function validateFoundationBlockers(
  blockers: BlockerRow[],
  tasks: TaskRow[],
  taskIds: Set<string>,
  errors: string[],
): void {
  const tasksById = new Map(tasks.map((task) => [task.taskId, task]));

  for (const blocker of blockers) {
    validateRequiredField(blocker.blockerId, "Blocks Task ID", blocker.blocksTaskId, errors);
    validateRequiredField(blocker.blockerId, "Blocker Type", blocker.blockerType, errors);
    validateRequiredField(blocker.blockerId, "Reason", blocker.reason, errors);
    validateRequiredField(blocker.blockerId, "Resolution / Owner", blocker.resolution, errors);

    if (!taskIds.has(blocker.blocksTaskId)) {
      errors.push(`${blocker.blockerId} blocks unknown task ${blocker.blocksTaskId}`);
    }

    if (foundationBlockerTypes.has(blocker.blockerType)) {
      validateRequiredField(blocker.blockerId, "Required Separate Task ID", blocker.requiredSeparateTaskId, errors);
      const separateTask = tasksById.get(blocker.requiredSeparateTaskId);
      if (!separateTask) {
        errors.push(`${blocker.blockerId} requires unknown separate task ${blocker.requiredSeparateTaskId}`);
      } else if (!foundationTaskTypes.has(separateTask.taskType)) {
        errors.push(`${blocker.blockerId} required separate task ${separateTask.taskId} is not a foundation task`);
      }
    }
  }
}

function parseBulletValue(content: string, label: string): string {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(new RegExp(`- ${escaped}:\\s*\\n\\s*\`?([^\`\\n]+)\`?`));
  return match?.[1]?.trim() ?? "";
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

function validateRequiredOrConcreteNotApplicable(id: string, fieldName: string, value: string, errors: string[]): void {
  const before = errors.length;
  validateRequiredField(id, fieldName, value, errors);
  if (errors.length > before || !value.trim().toLowerCase().startsWith("not-applicable")) {
    return;
  }

  if (!mentionsNotApplicableRationale(value)) {
    errors.push(`${id} ${fieldName} uses not-applicable without concrete rationale`);
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

function validateVaguePhrases(content: string, errors: string[]): void {
  const lowered = content.toLowerCase();
  for (const phrase of vaguePhrases) {
    if (lowered.includes(phrase)) {
      errors.push(`vague phrase found: ${phrase}`);
    }
  }
}

function mentionsSharedSeam(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return Boolean(normalized) && !normalized.startsWith("none") && !normalized.startsWith("not-applicable");
}

function mentionsCompatibilityEvidence(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.includes("existing consumer") ||
    normalized.includes("existing-consumer") ||
    normalized.includes("compatibility") ||
    normalized.includes("regression")
  );
}

function mentionsInseparable(...values: string[]): boolean {
  const normalized = values.join(" ").trim().toLowerCase();
  return normalized.includes("inseparable") || normalized.includes("same invariant");
}

function hasAffirmativeValue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "yes" || normalized === "true" || normalized === "present";
}

function hasMeaningfulAdditionalSubStandards(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return Boolean(normalized) && !normalized.startsWith("none") && !normalized.startsWith("not-applicable");
}

function hasMeaningfulEvidence(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return Boolean(normalized) && !normalized.startsWith("none") && !normalized.startsWith("not-applicable");
}

function isNotApplicableValue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return !normalized || normalized.startsWith("not-applicable");
}

function mentionsRuntimeEvidence(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.includes("proof") ||
    normalized.includes("evidence") ||
    normalized.includes("test") ||
    normalized.includes("scenario") ||
    normalized.includes("runtime") ||
    normalized.includes("payload")
  );
}

function requiresPermissionRenderingEvidence(
  task: TaskRow,
  frontendArchitectureRows: FrontendArchitectureDecisionRow[],
  securityRows: FrontendSecurityEvidenceRow[],
): boolean {
  if (securityRows.some((row) => row.securityArea === "sensitive-rendering" && row.sourcePresent === "yes")) {
    return true;
  }

  const combined = `${task.scope} ${task.allowedWriteSet} ${task.sharedSeams}`.toLowerCase();
  return (
    combined.includes("privileged") ||
    combined.includes("permission") ||
    combined.includes("tenant") ||
    combined.includes("user") ||
    combined.includes("role") ||
    combined.includes("asset") ||
    combined.includes("lifecycle") ||
    combined.includes("sensitive") ||
    frontendArchitectureRows.some((row) => row.actorScope === "tenant-actor" || row.actorScope === "root-operator")
  );
}

function requiresRuntimeDataEvidence(
  task: TaskRow,
  frontendArchitectureRows: FrontendArchitectureDecisionRow[],
  proofRows: ProofCommandRow[],
  runtimeRows: FrontendRuntimeDataMockHonestyRow[],
): boolean {
  const combined = [
    task.scope,
    task.allowedWriteSet,
    task.sharedSeams,
    ...proofRows.flatMap((row) => [row.proofLayers, row.commands, row.evidenceNotes]),
    ...runtimeRows.flatMap((row) => [row.governingContract, row.fixtureSource, row.liveRuntimePayloadEvidence, row.mockHonestyStatement]),
  ].join(" ").toLowerCase();

  return (
    combined.includes("mock") ||
    combined.includes("fixture") ||
    combined.includes("api") ||
    combined.includes("projection") ||
    combined.includes("payload") ||
    combined.includes("rendered-browser") ||
    frontendArchitectureRows.some((row) => row.runtimeShape === "app-shell" || row.runtimeShape === "browser-workflow")
  );
}

function mentionsTenantScope(...values: string[]): boolean {
  return values.join(" ").toLowerCase().includes("tenant");
}

function mentionsAllowedProof(value: string): boolean {
  return value.toLowerCase().includes("allowed");
}

function mentionsDeniedProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes("denied") || normalized.includes("unauthorized") || normalized.includes("forbidden");
}

function mentionsExpiredOrUnauthenticated(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes("expired") || normalized.includes("unauthenticated") || normalized.includes("anonymous");
}

function mentionsCrossTenantDenial(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes("cross-tenant") && (normalized.includes("denial") || normalized.includes("denied"));
}

function mentionsMockHonesty(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes("mock-honesty") || (normalized.includes("fixture") && !normalized.includes("invent"));
}

function mentionsPermissionMatrixProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("actor") &&
    normalized.includes("permission") &&
    normalized.includes("object") &&
    normalized.includes("boundary")
  );
}

function mentionsSecurityBoundaryProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("security") || normalized.includes("authn") || normalized.includes("authz") || normalized.includes("tenant")) &&
    normalized.includes("allowed") &&
    (normalized.includes("denied") || normalized.includes("forbidden") || normalized.includes("unauthorized"))
  );
}

function mentionsE2eJourneyProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("e2e") || normalized.includes("end-to-end") || normalized.includes("browser")) &&
    (normalized.includes("journey") || normalized.includes("workflow") || normalized.includes("scenario")) &&
    (normalized.includes("runtime") || normalized.includes("browser"))
  );
}

function mentionsRegressionLockProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("regression") &&
    (normalized.includes("issue reconciliation") || normalized.includes("escaped defect") || normalized.includes("defect"))
  );
}

function mentionsJourneyBehavior(...values: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  return normalized.includes("journey") && (normalized.includes("behavior") || normalized.includes("workflow") || normalized.includes("scenario"));
}

function mentionsBackendAndFrontendSeams(backendSeam: string, frontendSeam: string): boolean {
  const backend = backendSeam.toLowerCase();
  const frontend = frontendSeam.toLowerCase();
  return (
    (backend.includes("DEV:backend") || backend.includes("api") || backend.includes("persistence") || backend.includes("service")) &&
    (frontend.includes("DEV:frontend") || frontend.includes("browser") || frontend.includes("render") || frontend.includes("route"))
  );
}

function mentionsContractOrPayload(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes("contract") || normalized.includes("payload") || normalized.includes("api") || normalized.includes("projection");
}

function mentionsBackendToFrontendSeamRisk(...values: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  const hasBackendFrontend = normalized.includes("backend") && normalized.includes("frontend");
  const hasBrowserRuntime = normalized.includes("browser") || normalized.includes("route") || normalized.includes("render");
  const hasSeamRisk = [
    "payload",
    "projection",
    "api/data",
    "api data",
    "persistence-to-render",
    "persisted",
    "response",
    "permission rendering",
    "browser workflow",
    "runtime coupling",
    "cross-boundary",
  ].some((token) => normalized.includes(token));
  return hasBackendFrontend && hasBrowserRuntime && hasSeamRisk;
}

function mentionsVerticalSliceCouplingRationale(value: string): boolean {
  return mentionsInseparable(value) || mentionsBackendToFrontendSeamRisk(value);
}

function mentionsShortcutScope(...values: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  return (
    normalized.includes("shortcut") ||
    normalized.includes("do everything") ||
    normalized.includes("end-to-end implementation") ||
    normalized.includes("full feature") ||
    normalized.includes("all tasks") ||
    normalized.includes("avoid separate")
  );
}

function mentionsFixtureDataContractProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("contract") &&
    normalized.includes("fixture") &&
    (normalized.includes("live payload") || normalized.includes("live/runtime payload") || normalized.includes("runtime payload"))
  );
}

function mentionsScreenshotOrEvidenceArtifact(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("screenshot") ||
    normalized.includes(".png") ||
    normalized.includes(".jpg") ||
    normalized.includes(".jpeg") ||
    normalized.includes(".webp") ||
    normalized.includes("evidence artifact")
  );
}

function mentionsInteractionScenario(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("scenario") || normalized.includes("state transition")) &&
    (normalized.includes("interaction") || normalized.includes("click") || normalized.includes("keyboard") || normalized.includes("toggle"))
  );
}

function mentionsAccessibilitySemanticsProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("role") &&
    normalized.includes("name") &&
    normalized.includes("state") &&
    normalized.includes("focus")
  );
}

function mentionsEvidenceSweepArtifactsAndScope(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("artifact") || normalized.includes(".png") || normalized.includes(".json") || normalized.includes(".md")) &&
    normalized.includes("scope")
  );
}

function mentionsRenderStructureSeamProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("renderer") || normalized.includes("component") || normalized.includes("template") || normalized.includes("export")) &&
    (normalized.includes("markup") || normalized.includes("render structure")) &&
    (normalized.includes("must not copy") || normalized.includes("prohibit") || normalized.includes("forbidden"))
  );
}

function mentionsBehaviorControllerSeamProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("controller") || normalized.includes("state") || normalized.includes("event")) &&
    (normalized.includes("interaction logic") || normalized.includes("behavior")) &&
    (normalized.includes("must not copy") || normalized.includes("prohibit") || normalized.includes("forbidden"))
  );
}

function mentionsAccessibilitySeamProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return mentionsAccessibilitySemanticsProof(normalized) && (normalized.includes("aria") || normalized.includes("keyboard"));
}

function mentionsStyleCssSeamProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("css") || normalized.includes("style")) &&
    (normalized.includes("seam") || normalized.includes("governed")) &&
    (normalized.includes("app-page css") || normalized.includes("local css") || normalized.includes("css drift"))
  );
}

function mentionsCanonicalEvidenceUpdateProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("canonical") &&
    (normalized.includes("behavior lock") || normalized.includes("lock")) &&
    mentionsScreenshotOrEvidenceArtifact(normalized)
  );
}

function mentionsStaticLowRiskPerformanceProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes("render proof") && (normalized.includes("sufficient") || normalized.includes("no performance-specific"));
}

function mentionsInteractiveLowRiskPerformanceProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("interaction") || normalized.includes("scenario")) &&
    (normalized.includes("no repeated work") || normalized.includes("no repeated fetch") || normalized.includes("no fetch loop"))
  );
}

function mentionsDataListPerformanceProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("bounded data") || normalized.includes("bounded data-size") || normalized.includes("page size")) &&
    (normalized.includes("dom") || normalized.includes("list") || normalized.includes("table")) &&
    (normalized.includes("proof") || normalized.includes("scenario") || normalized.includes("evidence"))
  );
}

function mentionsRouteInitializationPerformanceProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("route init") || normalized.includes("route load") || normalized.includes("initialization") || normalized.includes("lighthouse") || normalized.includes("trace")) &&
    (normalized.includes("proof") || normalized.includes("evidence") || normalized.includes("scenario") || normalized.includes("trace"))
  );
}

function mentionsLargeDomCanvasPerformanceProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("bounded dom") || normalized.includes("bounded canvas") || normalized.includes("canvas size") || normalized.includes("dom size")) &&
    normalized.includes("nonblank") &&
    (normalized.includes("interaction") || normalized.includes("proof") || normalized.includes("scenario"))
  );
}

function mentionsAssetHeavyPerformanceProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("asset size") &&
    (normalized.includes("loading strategy") || normalized.includes("load strategy")) &&
    (normalized.includes("rendered asset") || normalized.includes("asset evidence"))
  );
}

function mentionsAnimationPerformanceProof(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("timing") || normalized.includes("duration") || normalized.includes("reduced-motion")) &&
    (normalized.includes("transition") || normalized.includes("animation") || normalized.includes("motion"))
  );
}

function isDesignSystemProducerPosture(value: string): boolean {
  return value === "produces-consumable-seam" || value === "refines-existing-seam" || value === "proves-existing-seam";
}

function isFrontendConsumerPosture(value: string): boolean {
  return value === "consumes-existing-seam" || value === "approved-exception";
}

function mentionsDesignSystemSeam(...values: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  return (
    normalized.includes("/design-system") ||
    normalized.includes("src/frontend/design-system") ||
    normalized.includes("render") ||
    normalized.includes("controller") ||
    normalized.includes("export") ||
    normalized.includes("component")
  );
}

function explicitlyProhibitsCopiedDsInternals(value: string): boolean {
  const normalized = value.toLowerCase();
  const prohibitsCopying =
    normalized.includes("prohibit") ||
    normalized.includes("forbid") ||
    normalized.includes("must not") ||
    normalized.includes("no copied") ||
    normalized.includes("not copy");
  return (
    prohibitsCopying &&
    normalized.includes("markup") &&
    normalized.includes("controller") &&
    normalized.includes("aria") &&
    normalized.includes("css")
  );
}

function claimsGovernedDsInternalOwnership(value: string): boolean {
  const normalized = value.toLowerCase();
  const claimsOwnership =
    normalized.includes("owns") ||
    normalized.includes("own ") ||
    normalized.includes("controls") ||
    normalized.includes("implements") ||
    normalized.includes("recreates");
  const governedInternal =
    normalized.includes("governed render") ||
    normalized.includes("render structure") ||
    normalized.includes("controller") ||
    normalized.includes("accessibility") ||
    normalized.includes("aria") ||
    normalized.includes("style internal") ||
    normalized.includes("css internal") ||
    normalized.includes("css seam");
  return claimsOwnership && governedInternal;
}

function mentionsRootAdminShellEntry(value: string): boolean {
  const normalized = value.replace(/\\/g, "/").toLowerCase();
  return normalized
    .split(/[,;\s]+/)
    .some((item: string) => item.endsWith("src/frontend/rootadminshell/assets/app.mjs"));
}

function mentionsPreviewApplyOrMaterializationSeam(
  task: TaskRow,
  row: FrontendArchitectureDecisionRow,
  contextRows: StartingContextRow[],
  envelopeRows: TightWriteEnvelopeRow[],
): boolean {
  const normalized = [
    task.scope,
    task.allowedWriteSet,
    task.sharedSeams,
    row.sourceSteeringDecision,
    ...contextRows.flatMap((context) => [
      context.filesRoutesCanonicals,
      context.seamsToConsume,
      context.governingArtifacts,
    ]),
    ...envelopeRows.flatMap((envelope) => [envelope.exactFilesOrPatterns, envelope.broadWriteRationale]),
  ]
    .join(" ")
    .toLowerCase();
  return (
    normalized.includes("preview/apply") ||
    normalized.includes("preview-apply") ||
    normalized.includes("apply seam") ||
    normalized.includes("preview seam") ||
    normalized.includes("materialization seam") ||
    normalized.includes("materialization")
  );
}

function mentionsPreviewApplyOrMaterializationText(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("preview/apply") ||
    normalized.includes("preview-apply") ||
    normalized.includes("apply seam") ||
    normalized.includes("preview seam") ||
    normalized.includes("materialization seam") ||
    normalized.includes("materialization")
  );
}

function mentionsRuntimeDefectEvidence(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("live process") &&
    (normalized.includes("served asset") || normalized.includes("served module")) &&
    normalized.includes("runtime payload") &&
    (normalized.includes("regression") || normalized.includes("regression proof"))
  );
}

function mentionsEvidenceOnlyFrontendWork(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("evidence-only") ||
    normalized.includes("screenshot capture") ||
    normalized.includes("payload sampling") ||
    normalized.includes("served asset check") ||
    normalized.includes("mock-honesty comparison")
  );
}

function mentionsGeneratedOutputHandEdit(...values: string[]): boolean {
  const normalized = values.join(" ").replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("hand-edit") ||
    normalized.includes("hand edit") ||
    normalized.includes("manual edit") ||
    normalized.includes("generated-output") ||
    normalized.includes("/generated/") ||
    normalized.includes("docs/architecture/generated") ||
    normalized.includes("generated routing") ||
    normalized.includes("generated route")
  );
}

function mentionsApprovedGeneratedCanonicalSweep(...values: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  return (
    normalized.includes("approved generated/canonical sweep") ||
    normalized.includes("approved generated sweep") ||
    normalized.includes("approved canonical sweep")
  );
}

function mentionsPageJourneyBehaviorOwnership(...values: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  const pageJourneyBehavior =
    normalized.includes("page behavior") ||
    normalized.includes("journey behavior") ||
    normalized.includes("controller behavior") ||
    normalized.includes("interaction behavior") ||
    normalized.includes("state machine") ||
    normalized.includes("render behavior");
  const registryOnly =
    normalized.includes("registry only") ||
    normalized.includes("route mounting only") ||
    normalized.includes("route mount only");
  return pageJourneyBehavior && !registryOnly;
}

function writeSetMatchesProductModuleJourneyGroup(allowedWriteSet: string, productModule: string, journeyGroup: string): boolean {
  const normalizedWriteSet = normalizePathToken(allowedWriteSet);
  const normalizedProductModule = normalizePathToken(productModule);
  const normalizedJourneyGroup = normalizePathToken(journeyGroup);

  if (!normalizedProductModule || normalizedProductModule.startsWith("notapplicable")) {
    return true;
  }

  if (!normalizedWriteSet.includes(normalizedProductModule)) {
    return false;
  }

  return !normalizedJourneyGroup || normalizedJourneyGroup.startsWith("notapplicable") || normalizedWriteSet.includes(normalizedJourneyGroup);
}

function normalizePathToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function mentionsUnknownModuleJourneyPathRationale(...values: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  return (
    normalized.includes("path-unknown:") ||
    normalized.includes("exact path unknown:") ||
    normalized.includes("path not known:") ||
    normalized.includes("exact module/journey path not known:")
  );
}

function mentionsCompatibilityLocator(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return Boolean(normalized) && !normalized.startsWith("none") && !normalized.startsWith("not-applicable");
}

function mentionsUrlOrReplayState(...values: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  return normalized.includes("url") || normalized.includes("query param") || normalized.includes("replay");
}

function isBroadFrontendWriteEnvelope(task: TaskRow, row: TightWriteEnvelopeRow): boolean {
  const normalizedPaths = row.exactFilesOrPatterns.toLowerCase();
  return (
    frontendTaskTypes.has(task.taskType) &&
    (row.envelopeClass.startsWith("broad-pattern") ||
      normalizedPaths.includes("src/frontend/**") ||
      normalizedPaths.includes("src/frontend/design-system/**") ||
      normalizedPaths.includes("src/frontend/designsystem/**"))
  );
}

function isApprovedBroadFrontendEnvelope(task: TaskRow, row: TightWriteEnvelopeRow): boolean {
  const rationale = row.broadWriteRationale.toLowerCase();
  return (
    row.envelopeClass === "broad-pattern-justified" &&
    (task.taskType === "EVIDENCE:qa-evidence" ||
      rationale.includes("audit") ||
      rationale.includes("migration") ||
      rationale.includes("generated") ||
      rationale.includes("canonical sweep") ||
      rationale.includes("evidence sweep"))
  );
}

function isBroadProofAllowed(task: TaskRow): boolean {
  return (
    task.taskType === "DOC:standards-compliance" ||
    task.taskType === "EVIDENCE:qa-evidence" ||
    task.taskType === "DOC:docs-artifact" ||
    task.taskType === "TEST:test-suite-alignment"
  );
}

function isPermissionStateMatrixRequired(task: TaskRow, coverageRows: TestOnlyCoverageContractRow[]): boolean {
  const normalized = [
    task.scope,
    task.nonGoals,
    ...coverageRows.flatMap((row) => [
      row.coverageSource,
      row.testChangeClass,
      row.testLayer,
      row.proofTarget,
      row.fixtureDataSource,
      row.mockRuntimeHonesty,
    ]),
  ].join(" ").toLowerCase();

  return [
    "root-admin",
    "root admin",
    "root-user",
    "root user",
    "root-role",
    "root role",
    "tenant-boundary",
    "cross-tenant",
    "authz",
    "authorization",
    "permission",
    "privileged",
    "security",
    "sensitive",
    "asset",
    "lifecycle",
  ].some((token) => normalized.includes(token));
}

function mentionsTraceabilityId(value: string): boolean {
  return /\b(?:TC|AC)-[A-Z0-9-]+/.test(value.toUpperCase());
}

function mentionsAlignmentMismatchClass(value: string): boolean {
  const normalized = value.toLowerCase();
  return [
    "missing-documented-test-case",
    "missing-executable-id",
    "stale-status",
    "malformed-id",
    "orphaned-executable-id",
    "standards-drift",
    "backlog-drift",
    "proof-layer-drift",
    "fixture-doc-drift",
  ].some((token) => normalized.includes(token));
}

function mentionsAlignmentDocumentationTarget(value: string): boolean {
  const normalized = value.replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("docs/prd/test_cases") ||
    normalized.includes("docs/workspace/qa") ||
    normalized.includes("qa backlog") ||
    normalized.includes("status artifact") ||
    normalized.includes("test case")
  );
}

function mentionsAlignmentExecutableTarget(value: string): boolean {
  const normalized = value.replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("tests/") ||
    normalized.includes("test name") ||
    normalized.includes("test title") ||
    normalized.includes("executable") ||
    normalized.includes("not-applicable:")
  );
}

function mentionsAlignmentOnlyEditPosture(value: string): boolean {
  const normalized = value.toLowerCase();
  return [
    "docs-only",
    "test-title-or-comment-only",
    "docs-and-test-labels-only",
  ].some((token) => normalized.includes(token));
}

function mentionsProductionCodePath(...values: string[]): boolean {
  const normalized = values.join(" ").replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("src/features/") ||
    normalized.includes("src/frontend/") ||
    normalized.includes("src/routes/") ||
    normalized.includes("src/lib/") ||
    normalized.includes("migrations/") ||
    normalized.includes("package.json")
  );
}

function mentionsAppFrontendImplementationPath(...values: string[]): boolean {
  const normalized = values.join(" ").replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("src/frontend/") &&
    !normalized.includes("src/frontend/design-system/") &&
    !normalized.includes("src/frontend/designsystem/")
  );
}

function mentionsBroadDocsSweep(...values: string[]): boolean {
  const normalized = values.join(" ").replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("docs/**") ||
    normalized.includes("docs/workspace/**") ||
    normalized.includes("docs/prd/**") ||
    normalized.includes("docs/templates/**") ||
    normalized.includes("docs/architecture/**") ||
    normalized.includes("source-independent artifact sweep") ||
    normalized.includes("artifact sweep")
  );
}

function mentionsExecutableTestWritePath(...values: string[]): boolean {
  const normalized = values.join(" ").replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("tests/") ||
    normalized.includes("test/") ||
    normalized.includes(".test.ts") ||
    normalized.includes(".spec.ts") ||
    normalized.includes("playwright.config") ||
    normalized.includes("vitest.config")
  );
}

function mentionsAuthorityWritePath(...values: string[]): boolean {
  const normalized = values.join(" ").replace(/\\/g, "/").toLowerCase();
  return (
    mentionsStandardsAuthorityWritePath(normalized) ||
    normalized.includes("docs/architecture/") ||
    normalized.includes("docs/templates/technical-steering") ||
    normalized.includes("docs/templates/story-breakdown") ||
    normalized.includes("docs/templates/task-breakdown")
  );
}

function mentionsStandardsAuthorityWritePath(...values: string[]): boolean {
  const normalized = values.join(" ").replace(/\\/g, "/").toLowerCase();
  return (
    normalized.includes("agents.md") ||
    (normalized.includes("docs/standards/") &&
      !normalized.includes("docs/standards/platform-status/") &&
      !normalized.includes("docs/standards/control-maps/")) ||
    normalized.includes("docs/templates/") ||
    normalized.includes(".codex/skills/") ||
    normalized.includes("src/scripts/")
  );
}

function docsArtifactRouteAwayTask(value: string): string | null {
  const normalized = value.replace(/\\/g, "/").toLowerCase();

  if (
    normalized.includes("docs/api-contracts/") ||
    normalized.includes("openapi") ||
    normalized.includes("postman") ||
    normalized.includes("api contract")
  ) {
    return "DOC:api-contract";
  }

  if (
    normalized.includes("docs/data-dictionary/") ||
    normalized.includes("data dictionary") ||
    normalized.includes("field semantics") ||
    normalized.includes("durable fact") ||
    normalized.includes("retention") ||
    normalized.includes("data classification")
  ) {
    return "DOC:data-dictionary";
  }

  if (
    normalized.includes("docs/architecture/permission-mappings/") ||
    normalized.includes("permission mapping") ||
    normalized.includes("capability mapping") ||
    normalized.includes("role-to-authz") ||
    normalized.includes("authz capability")
  ) {
    return "DOC:permission-mapping";
  }

  if (
    normalized.includes("docs/standards/platform-status/") ||
    normalized.includes("docs/standards/control-maps/") ||
    normalized.includes("standards compliance") ||
    normalized.includes("external control map")
  ) {
    return "DOC:standards-compliance";
  }

  if (
    normalized.includes("docs/standards/") ||
    normalized.includes("standards update") ||
    normalized.includes("validator contract") ||
    normalized.includes("check ids")
  ) {
    return "GOV:standards-update";
  }

  if (
    normalized.includes("docs/architecture/adr/") ||
    normalized.includes("docs/architecture/system-overview") ||
    normalized.includes("docs/architecture/priniciples") ||
    normalized.includes("architecture authority") ||
    normalized.includes("topology authority")
  ) {
    return "GOV:architecture-update";
  }

  if (
    normalized.includes("design-system") &&
    (normalized.includes("behavior lock") ||
      normalized.includes("canonical") ||
      normalized.includes("signoff") ||
      normalized.includes("governed seam") ||
      normalized.includes("adoption contract"))
  ) {
    return "GOV:design-system";
  }

  if (
    normalized.includes("runtime evidence") ||
    normalized.includes("browser evidence") ||
    normalized.includes("mock-honesty") ||
    normalized.includes("screenshot") ||
    normalized.includes("trace")
  ) {
    return "EVIDENCE:qa-evidence";
  }

  if (
    normalized.includes("test-suite alignment") ||
    normalized.includes("traceability drift") ||
    normalized.includes("test case id") ||
    normalized.includes("qa backlog") ||
    normalized.includes("executable test label")
  ) {
    return "TEST:test-suite-alignment";
  }

  if (normalized.includes("new executable proof") || normalized.includes("missing executable proof")) {
    return "TEST:test-only";
  }

  return null;
}

function mentionsPermissionBoundary(value: string): boolean {
  const normalized = value.toLowerCase();
  return [
    "root",
    "tenant",
    "system",
    "public",
    "support",
    "emergency",
    "object",
    "relationship",
    "attribute",
    "shared-cross-tenant",
    "cross-tenant",
    "internal",
  ].some((token) => normalized.includes(token));
}

function mentionsHttpMethod(value: string): boolean {
  const normalized = value.toLowerCase();
  return ["get", "post", "put", "patch", "delete", "options", "head"].some((method) =>
    new RegExp(`(^|[^a-z])${method}([^a-z]|$)`).test(normalized),
  );
}

function mentionsSplitNewProofDecision(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("split") && normalized.includes("TEST:test-only")) ||
    normalized.includes("no new proof") ||
    normalized.includes("no-new-proof")
  );
}

function mentionsTraceabilityCommand(value: string): boolean {
  const normalized = value.toLowerCase();
  return normalized.includes("npm run test:traceability") || normalized.includes("traceability-equivalent");
}

function mentionsDataComplianceHealthCommand(value: string): boolean {
  return value.toLowerCase().includes("npm run data:compliance-health");
}

function mentionsDataRetentionReviewDebt(row: DebtHealthSummaryRow): boolean {
  const normalized = `${row.debtFound} ${row.summaryResult} ${row.debtDisposition}`.toLowerCase();
  return (
    normalized.includes("manual-review-required") ||
    normalized.includes("retention") ||
    normalized.includes("export/delete") ||
    normalized.includes("legal-hold")
  );
}

function mentionsDataRetentionReviewOwner(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("doc:data-dictionary") ||
    normalized.includes("data-dictionary-maintainer") ||
    normalized.includes("doc:standards-compliance") ||
    normalized.includes("gov:standards-update") ||
    normalized.includes("compliance") ||
    normalized.includes("governance")
  );
}

function mentionsCoverageStrengthCommand(value: string): boolean {
  return value.toLowerCase().includes("npm run test:coverage-strength");
}

function mentionsAllowedDebtSummaryResult(value: string): boolean {
  const normalized = value.toLowerCase().trim();
  return (
    normalized === "pass" ||
    normalized === "debt-found" ||
    normalized === "blocked" ||
    normalized.startsWith("not-run:")
  );
}

function mentionsAllowedDebtDisposition(value: string): boolean {
  const normalized = value.toLowerCase().trim();
  return (
    normalized === "none" ||
    normalized === "in-scope-resolved" ||
    normalized === "split-follow-up" ||
    normalized === "accepted-deferred" ||
    normalized === "blocked" ||
    normalized.startsWith("not-applicable:")
  );
}

function mentionsBeforeAfterEvidence(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("before") && normalized.includes("after")) ||
    normalized.includes("before/after") ||
    normalized.includes("traceability delta") ||
    normalized.includes("alignment evidence")
  );
}

function mentionsConcreteTestLayer(value: string): boolean {
  const normalized = value.toLowerCase();
  return [
    "unit",
    "integration",
    "persistence",
    "security",
    "audit",
    "e2e",
    "visual",
    "browser",
    "performance",
    "traceability",
  ].some((token) => normalized.includes(token));
}

function mentionsNoProductionBehaviorChange(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized === "no-production-change" ||
    normalized === "test-harness-only" ||
    normalized.includes("no production behavior change") ||
    normalized.includes("test harness only")
  );
}

function isBroadOnlyCommand(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "npm test" || normalized === "npm run test" || normalized === "npm run test:all";
}

function mentionsAllowedAndDenied(...values: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  const hasAllowed = normalized.includes("allow") || normalized.includes("success") || normalized.includes("authorized");
  const hasDenied = normalized.includes("deny") || normalized.includes("denied") || normalized.includes("unauthorized") || normalized.includes("forbid");
  return hasAllowed && hasDenied;
}

function mentionsActorPermissionObjectBoundary(row: CapabilityPermissionStateMatrixRow): boolean {
  const actor = row.actorStatesCovered.toLowerCase();
  const permission = row.permissionStatesCovered.toLowerCase();
  const object = row.objectLifecycleStatesCovered.toLowerCase();
  const boundary = row.boundaryStatesCovered.toLowerCase();
  return (
    (actor.includes("actor") || actor.includes("root") || actor.includes("tenant") || actor.includes("session")) &&
    (permission.includes("permission") || permission.includes("capability") || permission.includes("role")) &&
    (object.includes("object") || object.includes("active") || object.includes("deleted") || object.includes("inactive")) &&
    (boundary.includes("boundary") || boundary.includes("tenant") || boundary.includes("root") || boundary.includes("cross-tenant"))
  );
}

function isHappyPathOnly(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    (normalized.includes("none") || normalized.includes("not-applicable")) &&
    !normalized.includes("deny") &&
    !normalized.includes("unauthorized") &&
    !normalized.includes("negative")
  );
}

function mentionsBackendFeatureOwner(value: string): boolean {
  return value.includes("src/features/");
}

function mentionsNotApplicableRationale(...values: string[]): boolean {
  const normalized = values.join(" ").toLowerCase();
  return normalized.includes("not-applicable:") || normalized.includes("not applicable because");
}

function mentionsMigrationIdentity(value: string): boolean {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("new migration") ||
    normalized.includes("corrective migration") ||
    normalized.includes(".sql") ||
    normalized.includes("applied migration")
  );
}

function mentionsLiveSchemaInspectionClassProof(value: string): boolean {
  return value.includes("live schema") && value.includes("index") && value.includes("code");
}

function mentionsNewMigrationClassProof(value: string): boolean {
  return (
    value.includes("migration identity") &&
    (value.includes("live start") || value.includes("start-state") || value.includes("start state")) &&
    value.includes("sql") &&
    value.includes("source data") &&
    value.includes("per-row") &&
    value.includes("rejected-row") &&
    (value.includes("read/write") || (value.includes("read") && value.includes("write")))
  );
}

function mentionsCorrectiveMigrationClassProof(value: string): boolean {
  return (
    (value.includes("defect") || value.includes("drift")) &&
    value.includes("repair") &&
    value.includes("compat") &&
    value.includes("eligibility") &&
    value.includes("rejected-row") &&
    (value.includes("read/write") || (value.includes("read") && value.includes("write")))
  );
}

function mentionsRepositoryQuerySemanticsClassProof(value: string): boolean {
  return (
    value.includes("query") &&
    (value.includes("filter") || value.includes("sort") || value.includes("tenant") || value.includes("lifecycle")) &&
    (value.includes("read/write") || (value.includes("read") && value.includes("write"))) &&
    (value.includes("schema") || value.includes("index"))
  );
}

function mentionsIndexConstraintClassProof(value: string): boolean {
  return (
    (value.includes("index") || value.includes("constraint")) &&
    (value.includes("compat") || value.includes("existing data")) &&
    (value.includes("read/write") || (value.includes("read") && value.includes("write")))
  );
}

function mentionsNormalizationUniquenessClassProof(value: string): boolean {
  return (
    value.includes("normalization") &&
    value.includes("uniqueness") &&
    (value.includes("duplicate") || value.includes("corrupt")) &&
    value.includes("create") &&
    value.includes("update") &&
    value.includes("read")
  );
}

function mentionsPostgresHarnessClassProof(value: string): boolean {
  return (
    value.includes("postgres") &&
    value.includes("harness") &&
    (value.includes("script") || value.includes("testdatabase") || value.includes("migrations.ts")) &&
    value.includes("persistence test")
  );
}

function isNoBlockers(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "none" || normalized.startsWith("not-applicable");
}

function isResolved(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized.includes("resolved") || normalized === "not-applicable" || normalized.startsWith("not-applicable:");
}

function splitIds(value: string): string[] {
  return value
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSourceStoryRows(content: string): StoryRow[] {
  return parseTableRows(section(content, "## Story Queue")).map((cells) => ({
    storyId: cells[0] ?? "",
    status: cells[1] ?? "",
    valueType: cells[2] ?? "",
    deliveryShape: cells[3] ?? "",
    title: cells[4] ?? "",
    jobToBeDone: cells[5] ?? "",
    outcome: cells[7] ?? "",
  }));
}

function parseSelectedStoryRows(content: string): StoryRow[] {
  return parseTableRows(section(content, "## Selected Story Scope")).map((cells) => ({
    storyId: cells[0] ?? "",
    status: cells[1] ?? "",
    valueType: cells[2] ?? "",
    deliveryShape: cells[3] ?? "",
    title: cells[4] ?? "",
    jobToBeDone: cells[5] ?? "",
    outcome: cells[6] ?? "",
  }));
}

function parseSourceAcceptanceCriteriaRows(content: string): StoryAcceptanceCriterionRow[] {
  return parseTableRows(section(content, "## Acceptance Criteria")).map((cells) => ({
    acId: cells[0] ?? "",
    storyId: cells[1] ?? "",
    criterion: cells[2] ?? "",
    proofLayer: cells[3] ?? "",
    requiredTestFamilies: cells[4] ?? "",
    requiredArtifactObligations: cells[5] ?? "",
  }));
}

function parseTaskAcSnapshotRows(content: string): StoryAcceptanceCriterionRow[] {
  return parseTableRows(section(content, "## Story Acceptance Criteria Snapshot")).map((cells) => ({
    acId: cells[0] ?? "",
    storyId: cells[1] ?? "",
    criterion: cells[2] ?? "",
    proofLayer: cells[3] ?? "",
    requiredTestFamilies: cells[4] ?? "",
    requiredArtifactObligations: cells[5] ?? "",
  }));
}

function parseSourceCapabilityRows(content: string): SourceCapabilityRow[] {
  return parseTableRows(section(content, "## Capability Mapping")).map((cells) => ({
    storyId: cells[0] ?? "",
    acId: cells[1] ?? "",
    capabilityRows: cells[2] ?? "",
    posture: cells[4] ?? "",
  }));
}

function parseTaskCapabilitySnapshotRows(content: string): SourceCapabilityRow[] {
  return parseTableRows(section(content, "## Story Capability And Artifact Snapshot")).map((cells) => ({
    storyId: cells[0] ?? "",
    acId: cells[1] ?? "",
    capabilityRows: cells[2] ?? "",
    posture: cells[4] ?? "",
  }));
}

function parseSourceArtifactRows(content: string): SourceArtifactRow[] {
  return parseTableRows(section(content, "## Artifact Ledger")).map((cells) => ({
    artifactId: cells[0] ?? "",
    storyId: cells[1] ?? "",
    artifactType: cells[2] ?? "",
    requiredAction: cells[3] ?? "",
    owner: cells[4] ?? "",
    blocksTaskBreakdown: cells[5] ?? "",
  }));
}

function parseSourceHandoffRows(content: string): SourceHandoffRow[] {
  return parseTableRows(section(content, "## Layer 4 Handoff")).map((cells) => ({
    storyId: cells[0] ?? "",
    handoffStatus: cells[1] ?? "",
  }));
}

function parseSourceSteeringClassificationRows(content: string): SourceSteeringClassificationRow[] {
  return parseTableRows(section(content, "## Steering Architecture Classification Snapshot")).map((cells) => ({
    classificationId: cells[0] ?? "",
    classification: cells[2] ?? "",
    downstreamSignal: cells[5] ?? "",
  }));
}

function parseSourceFrontendArchitectureClassificationRows(
  content: string,
): SourceFrontendArchitectureClassificationRow[] {
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
  }));
}

function parseSourceBrowserSecurityPostureRows(content: string): SourceBrowserSecurityPostureRow[] {
  return parseTableRows(section(content, "## Browser Security Posture Snapshot")).map((cells) => ({
    securityArea: cells[0] ?? "",
    present: cells[1] ?? "",
    decisionEvidence: cells[2] ?? "",
    requiredLayer4Signal: cells[3] ?? "",
    stopIfMissing: cells[4] ?? "",
  }));
}

function parseSourceTaskTypeSignalRows(content: string): SourceTaskTypeSignalRow[] {
  return parseTableRows(section(content, "## Task-Type Signal Matrix")).map((cells) => ({
    storyId: cells[0] ?? "",
    signal: cells[1] ?? "",
    present: cells[2] ?? "",
    impliedTaskType: cells[4] ?? "",
  }));
}

function parseSteeringReconciliationRows(content: string): SteeringReconciliationRow[] {
  return parseTableRows(section(content, "## Steering Classification Reconciliation")).map((cells) => ({
    classificationId: cells[0] ?? "",
    classification: cells[1] ?? "",
    downstreamSignal: cells[2] ?? "",
    coveredByTaskId: cells[3] ?? "",
    status: cells[4] ?? "",
  }));
}

function parseExpectedTaskTypeReconciliationRows(content: string): ExpectedTaskTypeReconciliationRow[] {
  return parseTableRows(section(content, "## Expected Task-Type Reconciliation")).map((cells) => ({
    storyId: cells[0] ?? "",
    expectedTaskType: cells[1] ?? "",
    sourceSignal: cells[2] ?? "",
    coveredByTaskId: cells[3] ?? "",
    reason: cells[4] ?? "",
  }));
}

function parseTaskRows(content: string): TaskRow[] {
  return parseTableRows(section(content, "## Task Queue")).map((cells) => ({
    taskId: cells[0] ?? "",
    parentStoryId: cells[1] ?? "",
    taskType: cells[2] ?? "",
    scope: cells[3] ?? "",
    allowedWriteSet: cells[4] ?? "",
    nonGoals: cells[5] ?? "",
    dependencies: cells[6] ?? "",
    sharedSeams: cells[7] ?? "",
    handoffStatus: cells[8] ?? "",
  }));
}

function parseTaskSizeGuardrailRows(content: string): TaskSizeGuardrailRow[] {
  return parseTableRows(section(content, "## Task Size Guardrail")).map((cells) => ({
    taskId: cells[0] ?? "",
    taskGrain: cells[1] ?? "",
    acCount: cells[2] ?? "",
    acCountRationale: cells[3] ?? "",
    primaryTarget: cells[4] ?? "",
    primarySeam: cells[5] ?? "",
    mainProofStory: cells[6] ?? "",
    additionalBehaviorsPresent: cells[7] ?? "",
    whyNotFurtherSplit: cells[8] ?? "",
  }));
}

function parseStopConditionRows(content: string): StopConditionRow[] {
  return parseTableRows(section(content, "## Decision Escalation / Stop Conditions")).map((cells) => ({
    taskId: cells[0] ?? "",
    triggerType: cells[1] ?? "",
    stopCondition: cells[2] ?? "",
    requiredEscalation: cells[3] ?? "",
    mayProceedIfHit: cells[4] ?? "",
    rationale: cells[5] ?? "",
  }));
}

function parseStartingContextRows(content: string): StartingContextRow[] {
  return parseTableRows(section(content, "## Exact Starting Context")).map((cells) => ({
    taskId: cells[0] ?? "",
    filesRoutesCanonicals: cells[1] ?? "",
    seamsToConsume: cells[2] ?? "",
    governingArtifacts: cells[3] ?? "",
  }));
}

function parseFrontendArchitectureDecisionRows(content: string): FrontendArchitectureDecisionRow[] {
  return parseTableRows(section(content, "## Frontend Architecture Decision Reconciliation")).map((cells) => ({
    taskId: cells[0] ?? "",
    sourceScopeElement: cells[1] ?? "",
    routeFamily: cells[2] ?? "",
    productModule: cells[3] ?? "",
    journeyGroup: cells[4] ?? "",
    routeVisibility: cells[5] ?? "",
    actorScope: cells[6] ?? "",
    runtimeShape: cells[7] ?? "",
    surfaceClass: cells[8] ?? "",
    topologyClass: cells[9] ?? "",
    locatorType: cells[10] ?? "",
    canonicalLocator: cells[11] ?? "",
    compatibilityLocators: cells[12] ?? "",
    topologyAuthority: cells[13] ?? "",
    targetTopologyAuthority: cells[14] ?? "",
    authorityTransitionPosture: cells[15] ?? "",
    stateOwner: cells[16] ?? "",
    shellGovernance: cells[17] ?? "",
    designSystemPrerequisite: cells[18] ?? "",
    materializationModel: cells[19] ?? "",
    sourcePlacement: cells[20] ?? "",
    implementationReadiness: cells[21] ?? "",
    sourceSteeringDecision: cells[22] ?? "",
  }));
}

function parseFrontendSubStandardRows(content: string): FrontendSubStandardRow[] {
  return parseTableRows(section(content, "## Frontend / Design-System Sub-Standard")).map((cells) => ({
    taskId: cells[0] ?? "",
    primarySubStandard: cells[1] ?? "",
    additionalSubStandards: cells[2] ?? "",
    splitRationale: cells[3] ?? "",
    complianceProof: cells[4] ?? "",
  }));
}

function parseFrontendPerformancePostureRows(content: string): FrontendPerformancePostureRow[] {
  return parseTableRows(section(content, "## Frontend Performance Posture")).map((cells) => ({
    taskId: cells[0] ?? "",
    posture: cells[1] ?? "",
    proofPlan: cells[2] ?? "",
    rationale: cells[3] ?? "",
  }));
}

function parseFrontendChangeClassContractRows(content: string): FrontendChangeClassContractRow[] {
  return parseTableRows(section(content, "## Frontend Change Class Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    changeClass: cells[1] ?? "",
    requiredContractRows: cells[2] ?? "",
    runtimeBrowserEvidence: cells[3] ?? "",
    routeAwaySplitNotes: cells[4] ?? "",
  }));
}

function parseDesignSystemSeamContractRows(content: string): DesignSystemSeamContractRow[] {
  return parseTableRows(section(content, "## Design-System Seam Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    seamPosture: cells[1] ?? "",
    seamNameExportRoute: cells[2] ?? "",
    ownedRenderStructure: cells[3] ?? "",
    ownedBehaviorController: cells[4] ?? "",
    ownedAccessibilitySemantics: cells[5] ?? "",
    canonicalBehaviorLockEvidence: cells[6] ?? "",
    frontendConsumptionContract: cells[7] ?? "",
  }));
}

function parseDesignSystemSeamClassContractRows(content: string): DesignSystemSeamClassContractRow[] {
  return parseTableRows(section(content, "## Design-System Seam Class Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    seamClass: cells[1] ?? "",
    classSpecificRequiredProof: cells[2] ?? "",
    downstreamConsumptionBoundary: cells[3] ?? "",
    forbiddenAppEvidenceStandardsWork: cells[4] ?? "",
  }));
}

function parseFrontendAdoptionContractRows(content: string): FrontendAdoptionContractRow[] {
  return parseTableRows(section(content, "## Frontend Adoption Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    consumedRenderSeam: cells[1] ?? "",
    consumedBehaviorControllerSeam: cells[2] ?? "",
    consumedAccessibilitySemantics: cells[3] ?? "",
    consumedStyleCssSeam: cells[4] ?? "",
    allowedAppLocalCompositionDataBinding: cells[5] ?? "",
    forbiddenLocalReconstruction: cells[6] ?? "",
    adoptionProofRouteScenario: cells[7] ?? "",
  }));
}

function parseFrontendSecurityEvidenceRows(content: string): FrontendSecurityEvidenceRow[] {
  return parseTableRows(section(content, "## Frontend Security Evidence")).map((cells) => ({
    taskId: cells[0] ?? "",
    securityArea: cells[1] ?? "",
    sourcePresent: cells[2] ?? "",
    layer2DecisionEvidence: cells[3] ?? "",
    requiredLayer4Signal: cells[4] ?? "",
    layer4EvidencePlan: cells[5] ?? "",
  }));
}

function parseFrontendPermissionRenderingEvidenceRows(content: string): FrontendPermissionRenderingEvidenceRow[] {
  return parseTableRows(section(content, "## Frontend Permission Rendering Evidence")).map((cells) => ({
    taskId: cells[0] ?? "",
    sensitiveRenderingScope: cells[1] ?? "",
    allowedStateProof: cells[2] ?? "",
    deniedUnauthorizedStateProof: cells[3] ?? "",
    expiredUnauthenticatedStateProof: cells[4] ?? "",
    crossTenantDenialProof: cells[5] ?? "",
  }));
}

function parseFrontendRuntimeDataMockHonestyRows(content: string): FrontendRuntimeDataMockHonestyRow[] {
  return parseTableRows(section(content, "## Frontend Runtime Data And Mock Honesty")).map((cells) => ({
    taskId: cells[0] ?? "",
    governingContract: cells[1] ?? "",
    fixtureSource: cells[2] ?? "",
    liveRuntimePayloadEvidence: cells[3] ?? "",
    unavailableReason: cells[4] ?? "",
    mockHonestyStatement: cells[5] ?? "",
  }));
}

function parseVerticalSliceCouplingRows(content: string): VerticalSliceCouplingRow[] {
  return parseTableRows(section(content, "## Vertical Slice Coupling")).map((cells) => ({
    taskId: cells[0] ?? "",
    journeyBehavior: cells[1] ?? "",
    backendSeam: cells[2] ?? "",
    frontendSeam: cells[3] ?? "",
    apiDataContract: cells[4] ?? "",
    browserProofStory: cells[5] ?? "",
    inseparableProofRationale: cells[6] ?? "",
    splitRejectionRationale: cells[7] ?? "",
  }));
}

function parseVerticalSliceSplitPressureRows(content: string): VerticalSliceSplitPressureRow[] {
  return parseTableRows(section(content, "## Vertical Slice Split Pressure")).map((cells) => ({
    taskId: cells[0] ?? "",
    concern: cells[1] ?? "",
    splitDecision: cells[2] ?? "",
    rationale: cells[3] ?? "",
    owningTaskIfSplit: cells[4] ?? "",
  }));
}

function parsePlatformSeamContractRows(content: string): PlatformSeamContractRow[] {
  return parseTableRows(section(content, "## Platform Seam Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    seamKind: cells[1] ?? "",
    compatibilityMode: cells[2] ?? "",
    approvedAuthoritySource: cells[3] ?? "",
    seamOwnerLocation: cells[4] ?? "",
    seamSourceInventory: cells[5] ?? "",
    seamChangeScope: cells[6] ?? "",
    exactWriteEnvelope: cells[7] ?? "",
    whyNotFeatureLocal: cells[8] ?? "",
    currentFutureUnsupportedConsumers: cells[9] ?? "",
    compatibilityContract: cells[10] ?? "",
    representativeConsumerProof: cells[11] ?? "",
    runtimeRestartImpact: cells[12] ?? "",
    rolloutBackoutPosture: cells[13] ?? "",
    artifactMaterializationImpact: cells[14] ?? "",
    generatedApplyCheckCommand: cells[15] ?? "",
    expectedSeamOutput: cells[16] ?? "",
    architectureStandardsBoundary: cells[17] ?? "",
    splitBlockedFollowUp: cells[18] ?? "",
    proofCommands: cells[19] ?? "",
    humanReviewBoundary: cells[20] ?? "",
  }));
}

function parsePlatformSeamClassContractRows(content: string): PlatformSeamClassContractRow[] {
  return parseTableRows(section(content, "## Platform Seam Class Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    platformSeamClass: cells[1] ?? "",
    classSpecificRequiredProof: cells[2] ?? "",
    requiredConsumerCoverage: cells[3] ?? "",
    runtimeMaterializationExpectation: cells[4] ?? "",
    forbiddenContaminationSplitNotes: cells[5] ?? "",
  }));
}

function parseBackendImplementationApproachRows(content: string): BackendImplementationApproachRow[] {
  return parseTableRows(section(content, "## Backend Implementation Approach")).map((cells) => ({
    taskId: cells[0] ?? "",
    changeClass: cells[1] ?? "",
    approvedSourceAuthority: cells[2] ?? "",
    featureOwner: cells[3] ?? "",
    capabilityFileStrategy: cells[4] ?? "",
    backendSourceInventory: cells[5] ?? "",
    exactWriteEnvelope: cells[6] ?? "",
    expectedFilesLayers: cells[7] ?? "",
    layerResponsibilities: cells[8] ?? "",
    contractApiPosture: cells[9] ?? "",
    authzTenantLifecyclePosture: cells[10] ?? "",
    persistenceMigrationPosture: cells[11] ?? "",
    publicSeamManifestImpact: cells[12] ?? "",
    artifactObligations: cells[13] ?? "",
    scaffoldScriptCommand: cells[14] ?? "",
    expectedBackendOutput: cells[15] ?? "",
    splitBlockedFollowUp: cells[16] ?? "",
    proofCommands: cells[17] ?? "",
    formattingGeneratedArtifactExpectations: cells[18] ?? "",
    humanReviewBoundary: cells[19] ?? "",
  }));
}

function parseMigrationPersistenceApproachRows(content: string): MigrationPersistenceApproachRow[] {
  return parseTableRows(section(content, "## Migration / Persistence Approach")).map((cells) => ({
    taskId: cells[0] ?? "",
    changeType: cells[1] ?? "",
    liveSchemaCheck: cells[2] ?? "",
    sourceDataShapeValidation: cells[3] ?? "",
    perRowEligibilityValidation: cells[4] ?? "",
    rejectedRowBehavior: cells[5] ?? "",
    migrationIdentityPosture: cells[6] ?? "",
    sqlExecutionSemanticsCheck: cells[7] ?? "",
    representativeReadWriteProof: cells[8] ?? "",
    postgresHarnessImpact: cells[9] ?? "",
  }));
}

function parseMigrationPersistenceClassContractRows(content: string): MigrationPersistenceClassContractRow[] {
  return parseTableRows(section(content, "## Migration / Persistence Class Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    migrationPersistenceClass: cells[1] ?? "",
    classSpecificRequiredProof: cells[2] ?? "",
    requiredDataSchemaCoverage: cells[3] ?? "",
    requiredReadWriteOrHarnessCoverage: cells[4] ?? "",
    splitBlockedFollowUp: cells[5] ?? "",
  }));
}

function parseTightWriteEnvelopeRows(content: string): TightWriteEnvelopeRow[] {
  return parseTableRows(section(content, "## Tight Allowed Write Envelope")).map((cells) => ({
    taskId: cells[0] ?? "",
    envelopeClass: cells[1] ?? "",
    exactFilesOrPatterns: cells[2] ?? "",
    broadWriteRationale: cells[3] ?? "",
  }));
}

function parseTaskSpecificProofPlanRows(content: string): TaskSpecificProofPlanRow[] {
  return parseTableRows(section(content, "## Task-Specific Proof Plan")).map((cells) => ({
    taskId: cells[0] ?? "",
    proofSpecificity: cells[1] ?? "",
    taskSpecificProofName: cells[2] ?? "",
    broadProofRationale: cells[3] ?? "",
  }));
}

function parseRefactorFirstContractRows(content: string): RefactorFirstContractRow[] {
  return parseTableRows(section(content, "## Refactor-First Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    trigger: cells[1] ?? "",
    refactorType: cells[2] ?? "",
    refactorTargetInventory: cells[3] ?? "",
    detectionHints: cells[4] ?? "",
    unchangedBehavior: cells[5] ?? "",
    affectedConsumers: cells[6] ?? "",
    downstreamTaskUnblocked: cells[7] ?? "",
    compatibilityProof: cells[8] ?? "",
    routingCheck: cells[9] ?? "",
    humanReviewBoundary: cells[10] ?? "",
    forbiddenBehaviorOrAuthorityChange: cells[11] ?? "",
  }));
}

function parseArchitectureFoundationContractRows(content: string): ArchitectureFoundationContractRow[] {
  return parseTableRows(section(content, "## Architecture Foundation Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    concernArea: cells[1] ?? "",
    trigger: cells[2] ?? "",
    question: cells[3] ?? "",
    decisionAnalysisStatus: cells[4] ?? "",
    decisionProvenanceSource: cells[5] ?? "",
    missingAnalysisFields: cells[6] ?? "",
    sourcesToReview: cells[7] ?? "",
    decisionSourceInventory: cells[8] ?? "",
    decisionAnalysisChecklist: cells[9] ?? "",
    decisionOwner: cells[10] ?? "",
    outputArtifactTarget: cells[11] ?? "",
    downstreamTasksBlocked: cells[12] ?? "",
    compatibilityPosture: cells[13] ?? "",
    finalAuthorityRoute: cells[14] ?? "",
    humanReviewBoundary: cells[15] ?? "",
    forbiddenImplementationGuess: cells[16] ?? "",
  }));
}

function parseArchitectureUpdateContractRows(content: string): ArchitectureUpdateContractRow[] {
  return parseTableRows(section(content, "## Architecture Update Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    architectureUpdateClass: cells[1] ?? "",
    approvedDecisionSource: cells[2] ?? "",
    decisionSourcePathReference: cells[3] ?? "",
    decisionSummary: cells[4] ?? "",
    architectureArtifactTarget: cells[5] ?? "",
    consistencySweepTargets: cells[6] ?? "",
    authorityConsistencyInventory: cells[7] ?? "",
    downstreamImpact: cells[8] ?? "",
    compatibilityPosture: cells[9] ?? "",
    forbiddenImplementationStandardsWork: cells[10] ?? "",
    humanReviewBoundary: cells[11] ?? "",
    validationReviewEvidence: cells[12] ?? "",
  }));
}

function parseDocsArtifactContractRows(content: string): DocsArtifactContractRow[] {
  return parseTableRows(section(content, "## Docs Artifact Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    artifactFamily: cells[1] ?? "",
    docsArtifactClass: cells[2] ?? "",
    scriptableSourceInventory: cells[3] ?? "",
    sourceTruthReviewed: cells[4] ?? "",
    docsTarget: cells[5] ?? "",
    statusPosture: cells[6] ?? "",
    staleArtifactSweep: cells[7] ?? "",
    specializedRoutingSplitDecisions: cells[8] ?? "",
    diffCheckCommand: cells[9] ?? "",
    humanReviewBoundary: cells[10] ?? "",
    validationReviewEvidence: cells[11] ?? "",
  }));
}

function parseStandardsComplianceContractRows(content: string): StandardsComplianceContractRow[] {
  return parseTableRows(section(content, "## Standards Compliance Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    complianceTargetType: cells[1] ?? "",
    standardGate: cells[2] ?? "",
    sourceStandardPathReference: cells[3] ?? "",
    scopeUnderReview: cells[4] ?? "",
    controlEvidenceInventory: cells[5] ?? "",
    reviewMethodCommand: cells[6] ?? "",
    compliancePosture: cells[7] ?? "",
    evidenceArtifactTarget: cells[8] ?? "",
    coverageSummaryCommand: cells[9] ?? "",
    findingsSummary: cells[10] ?? "",
    followUpRouting: cells[11] ?? "",
    humanReviewBoundary: cells[12] ?? "",
    waiverBlockerPosture: cells[13] ?? "",
  }));
}

function parseStandardsUpdateContractRows(content: string): StandardsUpdateContractRow[] {
  return parseTableRows(section(content, "## Standards Update Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    standardsUpdateClass: cells[1] ?? "",
    approvedStandardsChangeSource: cells[2] ?? "",
    sourcePathReference: cells[3] ?? "",
    standardsChangeSummary: cells[4] ?? "",
    standardsArtifactTarget: cells[5] ?? "",
    affectedSurfacesConsistencySweep: cells[6] ?? "",
    artifactInvalidationSweep: cells[7] ?? "",
    enforcementPosture: cells[8] ?? "",
    compatibilityRolloutPosture: cells[9] ?? "",
    debtRouteIfNotEnforcedNow: cells[10] ?? "",
    forbiddenImplementationArchitectureComplianceWork: cells[11] ?? "",
    validationReviewEvidence: cells[12] ?? "",
  }));
}

function parsePermissionMappingContractRows(content: string): PermissionMappingContractRow[] {
  return parseTableRows(section(content, "## Permission Mapping Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    permissionMappingClass: cells[1] ?? "",
    approvedAuthzSource: cells[2] ?? "",
    capabilityRouteSurface: cells[3] ?? "",
    authorityWorldActorBoundary: cells[4] ?? "",
    grantSourcePosture: cells[5] ?? "",
    mappingRowPosture: cells[6] ?? "",
    tenantObjectBoundary: cells[7] ?? "",
    allowDenyExpectations: cells[8] ?? "",
    uiEligibility: cells[9] ?? "",
    denialAuditProofExpectation: cells[10] ?? "",
    evidenceMappingInventory: cells[11] ?? "",
    migrationImpact: cells[12] ?? "",
    splitBlockedFollowUp: cells[13] ?? "",
    humanReviewBoundary: cells[14] ?? "",
  }));
}

function parseApiContractRows(content: string): ApiContractRow[] {
  return parseTableRows(section(content, "## API Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    apiContractClass: cells[1] ?? "",
    routeFamily: cells[2] ?? "",
    contractSourceAuthority: cells[3] ?? "",
    methodsPaths: cells[4] ?? "",
    paramsQueryBody: cells[5] ?? "",
    responseStatusErrorShape: cells[6] ?? "",
    authnAuthzTenantBoundary: cells[7] ?? "",
    validationPaginationSortingSystemFields: cells[8] ?? "",
    compatibilityPosture: cells[9] ?? "",
    maintainedApiArtifacts: cells[10] ?? "",
    maintainedArtifactInventory: cells[11] ?? "",
    splitBlockedFollowUp: cells[12] ?? "",
    humanReviewBoundary: cells[13] ?? "",
    validationReviewEvidence: cells[14] ?? "",
  }));
}

function parseDataDictionaryContractRows(content: string): DataDictionaryContractRow[] {
  return parseTableRows(section(content, "## Data Dictionary Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    entityTableFactGroup: cells[1] ?? "",
    dictionaryArtifactTarget: cells[2] ?? "",
    sourceTruthReviewed: cells[3] ?? "",
    fieldIndexLifecycleTruth: cells[4] ?? "",
    durableFactRetentionTruth: cells[5] ?? "",
    classificationCompliancePosture: cells[6] ?? "",
    standardsControlTrace: cells[7] ?? "",
    enforcementTrace: cells[8] ?? "",
    enforcementEvidence: cells[9] ?? "",
    testEvidenceTrace: cells[10] ?? "",
    compatibilityPosture: cells[11] ?? "",
    splitBlockedFollowUp: cells[12] ?? "",
    validationReviewEvidence: cells[13] ?? "",
  }));
}

function parseTestOnlyCoverageContractRows(content: string): TestOnlyCoverageContractRow[] {
  return parseTableRows(section(content, "## Test-Only Coverage Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    testChangeClass: cells[1] ?? "",
    coverageSource: cells[2] ?? "",
    traceabilityIds: cells[3] ?? "",
    testLayer: cells[4] ?? "",
    proofTarget: cells[5] ?? "",
    fixtureDataSource: cells[6] ?? "",
    mockRuntimeHonesty: cells[7] ?? "",
    productionBehaviorChangePosture: cells[8] ?? "",
    focusedCommand: cells[9] ?? "",
    splitBlockedFollowUp: cells[10] ?? "",
  }));
}

function parseTestSuiteAlignmentContractRows(content: string): TestSuiteAlignmentContractRow[] {
  return parseTableRows(section(content, "## Test Suite Alignment Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    alignmentSourceTrigger: cells[1] ?? "",
    mismatchClass: cells[2] ?? "",
    documentationTargets: cells[3] ?? "",
    executableTargets: cells[4] ?? "",
    allowedEditPosture: cells[5] ?? "",
    splitDecisionForNewProof: cells[6] ?? "",
    traceabilityCommand: cells[7] ?? "",
    completionEvidence: cells[8] ?? "",
  }));
}

function parseCapabilityPermissionStateMatrixRows(content: string): CapabilityPermissionStateMatrixRow[] {
  return parseTableRows(section(content, "## Capability Permission / State Matrix")).map((cells) => ({
    taskId: cells[0] ?? "",
    capabilityRouteObject: cells[1] ?? "",
    actorStatesCovered: cells[2] ?? "",
    permissionStatesCovered: cells[3] ?? "",
    objectLifecycleStatesCovered: cells[4] ?? "",
    boundaryStatesCovered: cells[5] ?? "",
    requiredNegativeCases: cells[6] ?? "",
    notApplicableRationale: cells[7] ?? "",
    missingCoverageFollowUpTask: cells[8] ?? "",
  }));
}

function parseForbiddenAssumptionRows(content: string): ForbiddenAssumptionRow[] {
  return parseTableRows(section(content, "## Forbidden Assumptions")).map((cells) => ({
    taskId: cells[0] ?? "",
    forbiddenAssumption: cells[1] ?? "",
    escalationPath: cells[2] ?? "",
  }));
}

function parseTaskTypeGuardrailRows(content: string): TaskTypeGuardrailRow[] {
  return parseTableRows(section(content, "## Task-Type Approval Guardrails")).map((cells) => ({
    taskId: cells[0] ?? "",
    taskType: cells[1] ?? "",
    reference: cells[2] ?? "",
    approvalStatus: cells[3] ?? "",
    evidence: cells[4] ?? "",
  }));
}

function parseTaskGuardrailEvidenceRows(content: string): TaskGuardrailEvidenceRow[] {
  return parseTableRows(section(content, "## Task Guardrail Evidence")).map((cells) => ({
    taskId: cells[0] ?? "",
    checkId: cells[1] ?? "",
    status: cells[2] ?? "",
    evidence: cells[3] ?? "",
  }));
}

function parseCodePlacementRows(content: string): CodePlacementRow[] {
  return parseTableRows(section(content, "## Code Placement And Extraction Review")).map((cells) => ({
    taskId: cells[0] ?? "",
    placementDecision: cells[1] ?? "",
    currentOwner: cells[2] ?? "",
    proposedOwner: cells[3] ?? "",
    extractionNeeded: cells[4] ?? "",
    supplementalGuardrails: cells[5] ?? "",
    compatibilityProof: cells[6] ?? "",
    approvalStatus: cells[7] ?? "",
  }));
}

function parseWriteSetClassificationRows(content: string): WriteSetClassificationRow[] {
  return parseTableRows(section(content, "## Allowed Write Set Classification")).map((cells) => ({
    taskId: cells[0] ?? "",
    pathPattern: cells[1] ?? "",
    writeClass: cells[2] ?? "",
    reason: cells[3] ?? "",
  }));
}

function parseForbiddenWorkRows(content: string): ForbiddenWorkRow[] {
  return parseTableRows(section(content, "## Forbidden Work")).map((cells) => ({
    taskId: cells[0] ?? "",
    forbiddenWork: cells[1] ?? "",
    reason: cells[2] ?? "",
  }));
}

function parseTaskAcCoverageRows(content: string): TaskAcCoverageRow[] {
  return parseTableRows(section(content, "## Task Acceptance Criteria Coverage")).map((cells) => ({
    taskId: cells[0] ?? "",
    acIds: cells[1] ?? "",
  }));
}

function parseTaskCapabilityCoverageRows(content: string): TaskCapabilityCoverageRow[] {
  return parseTableRows(section(content, "## Task Capability Coverage")).map((cells) => ({
    taskId: cells[0] ?? "",
    capabilityRows: cells[1] ?? "",
    status: cells[2] ?? "",
  }));
}

function parseTaskDependencyRows(content: string): TaskDependencyRow[] {
  return parseTableRows(section(content, "## Task Dependencies")).map((cells) => ({
    taskId: cells[0] ?? "",
    dependsOnTaskIds: cells[1] ?? "",
    dependencyReason: cells[2] ?? "",
    mustCompleteBeforeQueueing: cells[3] ?? "",
  }));
}

function parseSharedSeamRows(content: string): SharedSeamRow[] {
  return parseTableRows(section(content, "## Shared Seams")).map((cells) => ({
    taskId: cells[0] ?? "",
    sharedSeam: cells[1] ?? "",
    seamType: cells[2] ?? "",
    existingOrNew: cells[3] ?? "",
    proof: cells[4] ?? "",
  }));
}

function parseArtifactObligationRows(content: string): ArtifactObligationRow[] {
  return parseTableRows(section(content, "## Artifact Obligations")).map((cells) => ({
    taskId: cells[0] ?? "",
    requiredArtifact: cells[1] ?? "",
    requiredAction: cells[2] ?? "",
    owner: cells[3] ?? "",
    blocksDeliveryHandoff: cells[4] ?? "",
  }));
}

function parseProofCommandRows(content: string): ProofCommandRow[] {
  return parseTableRows(section(content, "## Proof And Command Plan")).map((cells) => ({
    taskId: cells[0] ?? "",
    proofLayers: cells[1] ?? "",
    commands: cells[2] ?? "",
    evidenceNotes: cells[3] ?? "",
  }));
}

function parseQaEvidenceInstrumentSummaryRows(content: string): QaEvidenceInstrumentSummaryRow[] {
  return parseTableRows(section(content, "## QA Evidence Instrument Summary")).map((cells) => ({
    taskId: cells[0] ?? "",
    qaEvidenceClass: cells[1] ?? "",
    evidenceSourceInventory: cells[2] ?? "",
    selectedEvidenceInstruments: cells[3] ?? "",
    liveRuntimePayloadEvidence: cells[4] ?? "",
    mockHonestyComparison: cells[5] ?? "",
    expectedEvidenceOutput: cells[6] ?? "",
    evidenceStatusRemainingGap: cells[7] ?? "",
    humanReviewBoundary: cells[8] ?? "",
  }));
}

function parseDebtHealthSummaryRows(content: string): DebtHealthSummaryRow[] {
  return parseTableRows(section(content, "## Debt Health Summary Commands")).map((cells) => ({
    taskId: cells[0] ?? "",
    summaryCommand: cells[1] ?? "",
    summaryResult: cells[2] ?? "",
    debtFound: cells[3] ?? "",
    debtDisposition: cells[4] ?? "",
    followUpTaskOrOwner: cells[5] ?? "",
  }));
}

function parseBootstrapRows(content: string): BootstrapRow[] {
  return parseTableRows(section(content, "## Branch Worktree Bootstrap Strategy")).map((cells) => ({
    taskId: cells[0] ?? "",
    branchName: cells[1] ?? "",
    worktreeStrategy: cells[2] ?? "",
    bootstrapArtifact: cells[3] ?? "",
    baseRef: cells[4] ?? "",
    baseCommitPolicy: cells[5] ?? "",
    promotionTarget: cells[6] ?? "",
  }));
}

function parseBlockerRows(content: string): BlockerRow[] {
  return parseTableRows(section(content, "## Blockers And Isolation Controls")).map((cells) => ({
    blockerId: cells[0] ?? "",
    blocksTaskId: cells[1] ?? "",
    blockerType: cells[2] ?? "",
    requiredSeparateTaskId: cells[3] ?? "",
    reason: cells[4] ?? "",
    resolution: cells[5] ?? "",
  }));
}

function parseDeliveryHandoffRows(content: string): DeliveryHandoffRow[] {
  return parseTableRows(section(content, "## Layer 5 Delivery Handoff")).map((cells) => ({
    taskId: cells[0] ?? "",
    handoffStatus: cells[1] ?? "",
    blockersRemaining: cells[2] ?? "",
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
        !first.includes("Story ID") &&
        !first.includes("AC ID") &&
        !first.includes("Task ID") &&
        !first.includes("Security Area") &&
        !first.includes("Blocker ID") &&
        !first.includes("Artifact ID") &&
        !first.includes("Classification ID") &&
        !first.includes("Expected Task Type")
      );
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
  const args = process.argv.slice(2);
  const packetArg = args.find((arg) => !arg.startsWith("--") && args[args.indexOf(arg) - 1] !== "--story");
  const storyFlagIndex = args.indexOf("--story");
  const storyArg = storyFlagIndex === -1 ? undefined : args[storyFlagIndex + 1];

  if (!packetArg) {
    console.error("Usage: npm run task-breakdown:validate -- <packet-path> --story <story-packet-path>");
    process.exit(1);
  }

  const packetPath = path.resolve(process.cwd(), packetArg);

  if (!existsSync(packetPath)) {
    console.error(`Packet not found: ${packetPath}`);
    process.exit(1);
  }

  const taskContent = readFileSync(packetPath, "utf8");
  const storyPathValue = storyArg ?? parseBulletValue(taskContent, "Source Story Breakdown packet");

  if (!storyPathValue) {
    console.error("Source Story Breakdown packet path is required. Pass --story <story-packet-path>.");
    process.exit(1);
  }

  const storyPath = path.resolve(process.cwd(), storyPathValue);

  if (!existsSync(storyPath)) {
    console.error(`Source Story Breakdown packet not found: ${storyPath}`);
    process.exit(1);
  }

  const result = validateTaskBreakdownContent(taskContent, readFileSync(storyPath, "utf8"));

  console.log("Task Breakdown Validation");
  console.log(`- status: ${result.status}`);
  console.log(`- packet: ${packetPath}`);
  console.log(`- story packet: ${storyPath}`);

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
