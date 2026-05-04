import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  layer4BackendCapabilityFileStrategies,
  layer4CapabilityCoverageStatuses,
  layer4DesignSystemSeamPostures,
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
  layer4ProceedIfTriggerHitValues,
  layer4ProofSpecificityStatuses,
  layer4RequiredCheckIdsByTaskType,
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
  "## Frontend / Design-System Sub-Standard",
  "## Frontend Performance Posture",
  "## Design-System Seam Contract",
  "## Frontend Adoption Contract",
  "## Frontend Security Evidence",
  "## Frontend Permission Rendering Evidence",
  "## Frontend Runtime Data And Mock Honesty",
  "## Vertical Slice Coupling",
  "## Backend Implementation Approach",
  "## Migration / Persistence Approach",
  "## Tight Allowed Write Envelope",
  "## Task-Specific Proof Plan",
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
const allowedTaskGrainClassifications: Set<string> = new Set(layer4TaskGrainClassifications);
const allowedStopConditionTriggerTypes: Set<string> = new Set(layer4StopConditionTriggerTypes);
const allowedProceedIfTriggerHitValues: Set<string> = new Set(layer4ProceedIfTriggerHitValues);
const allowedWriteEnvelopeClasses: Set<string> = new Set(layer4WriteEnvelopeClasses);
const allowedProofSpecificityStatuses: Set<string> = new Set(layer4ProofSpecificityStatuses);
const allowedFrontendDesignSystemSubStandards: Set<string> = new Set(layer4FrontendDesignSystemSubStandards);
const allowedFrontendPerformancePostures: Set<string> = new Set(layer4FrontendPerformancePostures);
const allowedDesignSystemSeamPostures: Set<string> = new Set(layer4DesignSystemSeamPostures);
const allowedBackendCapabilityFileStrategies: Set<string> = new Set(layer4BackendCapabilityFileStrategies);
const allowedMigrationPersistenceChangeTypes: Set<string> = new Set(layer4MigrationPersistenceChangeTypes);
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
  featureOwner: string;
  capabilityFileStrategy: string;
  expectedFilesLayers: string;
  layerResponsibilities: string;
  publicSeamManifestImpact: string;
  formattingGeneratedArtifactExpectations: string;
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

type TestOnlyCoverageContractRow = {
  taskId: string;
  coverageSource: string;
  traceabilityIds: string;
  testLayer: string;
  proofTarget: string;
  fixtureDataSource: string;
  mockRuntimeHonesty: string;
  productionBehaviorChangePosture: string;
  focusedCommand: string;
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
  selectedEvidenceInstruments: string;
  liveRuntimePayloadEvidence: string;
  mockHonestyComparison: string;
  evidenceStatusRemainingGap: string;
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
  const frontendSubStandards = parseFrontendSubStandardRows(taskContent);
  const frontendPerformancePostures = parseFrontendPerformancePostureRows(taskContent);
  const designSystemSeamContracts = parseDesignSystemSeamContractRows(taskContent);
  const frontendAdoptionContracts = parseFrontendAdoptionContractRows(taskContent);
  const frontendSecurityEvidence = parseFrontendSecurityEvidenceRows(taskContent);
  const frontendPermissionRenderingEvidence = parseFrontendPermissionRenderingEvidenceRows(taskContent);
  const frontendRuntimeDataMockHonesty = parseFrontendRuntimeDataMockHonestyRows(taskContent);
  const verticalSliceCouplings = parseVerticalSliceCouplingRows(taskContent);
  const backendImplementationApproaches = parseBackendImplementationApproachRows(taskContent);
  const migrationPersistenceApproaches = parseMigrationPersistenceApproachRows(taskContent);
  const tightWriteEnvelopes = parseTightWriteEnvelopeRows(taskContent);
  const taskSpecificProofPlans = parseTaskSpecificProofPlanRows(taskContent);
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
  const frontendSubStandardsByTask = groupBy(frontendSubStandards, (row) => row.taskId);
  const frontendPerformancePosturesByTask = groupBy(frontendPerformancePostures, (row) => row.taskId);
  const designSystemSeamContractsByTask = groupBy(designSystemSeamContracts, (row) => row.taskId);
  const frontendAdoptionContractsByTask = groupBy(frontendAdoptionContracts, (row) => row.taskId);
  const frontendSecurityEvidenceByTask = groupBy(frontendSecurityEvidence, (row) => row.taskId);
  const frontendPermissionRenderingEvidenceByTask = groupBy(frontendPermissionRenderingEvidence, (row) => row.taskId);
  const frontendRuntimeDataMockHonestyByTask = groupBy(frontendRuntimeDataMockHonesty, (row) => row.taskId);
  const verticalSliceCouplingsByTask = groupBy(verticalSliceCouplings, (row) => row.taskId);
  const backendImplementationApproachesByTask = groupBy(backendImplementationApproaches, (row) => row.taskId);
  const migrationPersistenceApproachesByTask = groupBy(migrationPersistenceApproaches, (row) => row.taskId);
  const tightWriteEnvelopesByTask = groupBy(tightWriteEnvelopes, (row) => row.taskId);
  const taskSpecificProofPlansByTask = groupBy(taskSpecificProofPlans, (row) => row.taskId);
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
  validateUnknownTaskReferences("Frontend / Design-System Sub-Standard", frontendSubStandards.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Performance Posture", frontendPerformancePostures.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Design-System Seam Contract", designSystemSeamContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Adoption Contract", frontendAdoptionContracts.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Security Evidence", frontendSecurityEvidence.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Permission Rendering Evidence", frontendPermissionRenderingEvidence.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Frontend Runtime Data And Mock Honesty", frontendRuntimeDataMockHonesty.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Vertical Slice Coupling", verticalSliceCouplings.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Backend Implementation Approach", backendImplementationApproaches.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Migration / Persistence Approach", migrationPersistenceApproaches.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Tight Allowed Write Envelope", tightWriteEnvelopes.map((row) => row.taskId), taskIds, errors);
  validateUnknownTaskReferences("Task-Specific Proof Plan", taskSpecificProofPlans.map((row) => row.taskId), taskIds, errors);
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
  validateFrontendSubStandard(task, subStandardRows, errors);
  validateFrontendPerformancePosture(task, performancePostureRows, errors);
  validateDesignSystemSeamContract(task, seamContractRows, errors);
  validateFrontendAdoptionContract(task, seamContractRows, adoptionContractRows, errors);
  validateFrontendSecurityEvidence(task, securityEvidenceRows, sourceBrowserSecurityRows, errors);
  validateFrontendPermissionRenderingEvidence(task, frontendArchitectureRows, securityEvidenceRows, permissionRenderingRows, errors);
  validateFrontendRuntimeDataMockHonesty(task, frontendArchitectureRows, runtimeDataRows, proofRowsForRuntime, errors);
  validateVerticalSliceCoupling(task, verticalSliceCouplingRows, errors);
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
    validateRequiredField(task.taskId, "Backend Feature Owner", row.featureOwner, errors);
    validateRequiredField(task.taskId, "Backend Capability File Strategy", row.capabilityFileStrategy, errors);
    validateRequiredField(task.taskId, "Expected Files / Layers", row.expectedFilesLayers, errors);
    validateRequiredField(task.taskId, "Layer Responsibilities", row.layerResponsibilities, errors);
    validateRequiredField(task.taskId, "Public Seam / Manifest Impact", row.publicSeamManifestImpact, errors);
    validateRequiredField(
      task.taskId,
      "Formatting / Generated Artifact Expectations",
      row.formattingGeneratedArtifactExpectations,
      errors,
    );

    if (!allowedBackendCapabilityFileStrategies.has(row.capabilityFileStrategy)) {
      errors.push(`${task.taskId} has invalid DEV:backend capability file strategy: ${row.capabilityFileStrategy || "(blank)"}`);
    }

    if (!mentionsBackendFeatureOwner(row.featureOwner)) {
      errors.push(`${task.taskId} DEV:backend feature owner should name a src/features/<featureName> owner`);
    }

    if (row.capabilityFileStrategy === "not-applicable-with-rationale" && !mentionsNotApplicableRationale(row.expectedFilesLayers, row.layerResponsibilities)) {
      errors.push(`${task.taskId} DEV:backend not-applicable capability strategy needs rationale`);
    }
  }
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

    if (!mentionsTraceabilityId(row.traceabilityIds)) {
      errors.push(`${task.taskId} TEST:test-only task must name approved TC-* or AC-* traceability IDs`);
    }

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
    validateRequiredField(task.taskId, "Selected Evidence Instruments", row.selectedEvidenceInstruments, errors);
    validateRequiredField(task.taskId, "Live Runtime / Payload Evidence", row.liveRuntimePayloadEvidence, errors);
    validateRequiredField(task.taskId, "Mock Honesty Comparison", row.mockHonestyComparison, errors);
    validateRequiredField(task.taskId, "Evidence Status / Remaining Gap", row.evidenceStatusRemainingGap, errors);
  }
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
    (normalized.includes("docs/standards/") && !normalized.includes("docs/standards/platform-status/")) ||
    normalized.includes("docs/templates/") ||
    normalized.includes(".codex/skills/") ||
    normalized.includes("src/scripts/")
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

function parseBackendImplementationApproachRows(content: string): BackendImplementationApproachRow[] {
  return parseTableRows(section(content, "## Backend Implementation Approach")).map((cells) => ({
    taskId: cells[0] ?? "",
    featureOwner: cells[1] ?? "",
    capabilityFileStrategy: cells[2] ?? "",
    expectedFilesLayers: cells[3] ?? "",
    layerResponsibilities: cells[4] ?? "",
    publicSeamManifestImpact: cells[5] ?? "",
    formattingGeneratedArtifactExpectations: cells[6] ?? "",
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

function parseTestOnlyCoverageContractRows(content: string): TestOnlyCoverageContractRow[] {
  return parseTableRows(section(content, "## Test-Only Coverage Contract")).map((cells) => ({
    taskId: cells[0] ?? "",
    coverageSource: cells[1] ?? "",
    traceabilityIds: cells[2] ?? "",
    testLayer: cells[3] ?? "",
    proofTarget: cells[4] ?? "",
    fixtureDataSource: cells[5] ?? "",
    mockRuntimeHonesty: cells[6] ?? "",
    productionBehaviorChangePosture: cells[7] ?? "",
    focusedCommand: cells[8] ?? "",
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
    selectedEvidenceInstruments: cells[1] ?? "",
    liveRuntimePayloadEvidence: cells[2] ?? "",
    mockHonestyComparison: cells[3] ?? "",
    evidenceStatusRemainingGap: cells[4] ?? "",
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
