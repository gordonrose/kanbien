import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

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
  "## Task-Type Signal Matrix",
  "## Layer 4 Handoff",
];

const allowedTaskTypes = new Set([
  "backend",
  "frontend",
  "vertical-slice",
  "docs-artifact",
  "test-only",
  "refactor-first",
  "architecture-foundation",
  "standards-compliance",
  "platform-seam",
  "migration/persistence",
  "design-system",
  "API-contract",
  "permission-mapping",
  "data-dictionary",
  "QA/evidence",
]);

const allowedTaskStatuses = new Set(["draft", "blocked", "queued-for-delivery", "superseded"]);
const allowedCapabilityCoverageStatuses = new Set(["approved", "not-capability-backed", "blocked-missing-row"]);

const foundationBlockerTypes = new Set(["refactor-first", "architecture-foundation"]);
const foundationTaskTypes = new Set(["refactor-first", "architecture-foundation"]);
const implementationTaskTypes = new Set([
  "backend",
  "frontend",
  "vertical-slice",
  "migration/persistence",
  "design-system",
  "platform-seam",
]);

const guardrailReferenceByTaskType = new Map([
  ["backend", "backend-task-guardrail.md"],
  ["frontend", "frontend-task-guardrail.md"],
  ["vertical-slice", "vertical-slice-task-guardrail.md"],
  ["docs-artifact", "docs-artifact-task-guardrail.md"],
  ["test-only", "test-only-task-guardrail.md"],
  ["refactor-first", "refactor-first-task-guardrail.md"],
  ["architecture-foundation", "architecture-foundation-task-guardrail.md"],
  ["standards-compliance", "standards-compliance-task-guardrail.md"],
  ["platform-seam", "platform-seam-task-guardrail.md"],
  ["migration/persistence", "migration-persistence-task-guardrail.md"],
  ["design-system", "design-system-task-guardrail.md"],
  ["API-contract", "api-contract-task-guardrail.md"],
  ["permission-mapping", "permission-mapping-task-guardrail.md"],
  ["data-dictionary", "data-dictionary-task-guardrail.md"],
  ["QA/evidence", "qa-evidence-task-guardrail.md"],
]);

const allowedPlacementDecisions = new Set(["feature-local", "platform-seam", "shared-lib", "stay-put", "blocked"]);
const allowedGuardrailEvidenceStatuses = new Set(["pass", "blocked"]);
const allowedWriteClasses = new Set([
  "feature-local",
  "platform-seam",
  "test",
  "docs-artifact",
  "generated-artifact",
  "config-script",
  "blocked",
]);

const requiredCheckIdsByTaskType = new Map([
  ["backend", [
    "backend-owning-feature",
    "backend-feature-structure",
    "backend-cross-feature-seams",
    "backend-authz-tenant",
    "backend-persistence-migration",
    "backend-artifacts",
    "backend-proof-commands",
  ]],
  ["frontend", [
    "frontend-design-system-seam",
    "frontend-no-app-css",
    "frontend-no-copied-behavior",
    "frontend-accessibility-state",
    "frontend-rendered-proof",
    "frontend-runtime-evidence",
    "frontend-artifacts",
  ]],
  ["vertical-slice", [
    "vertical-backend-seam",
    "vertical-frontend-seam",
    "vertical-api-data-shape",
    "vertical-browser-workflow",
    "vertical-mock-honesty",
    "vertical-artifacts",
    "vertical-proof-commands",
  ]],
  ["docs-artifact", [
    "docs-source-truth-reviewed",
    "docs-stale-artifact-sweep",
    "docs-status-posture",
    "docs-validation-command",
  ]],
  ["test-only", [
    "test-traceability",
    "test-proof-layer",
    "test-mock-honesty",
    "test-no-behavior-change",
    "test-command",
  ]],
  ["refactor-first", [
    "refactor-existing-behavior",
    "refactor-affected-consumers",
    "refactor-compatibility-proof",
    "refactor-downstream-unblocker",
    "refactor-no-product-change",
  ]],
  ["architecture-foundation", [
    "architecture-adrs-reviewed",
    "architecture-decision-owner",
    "architecture-output-path",
    "architecture-downstream-block",
    "architecture-compatibility",
  ]],
  ["standards-compliance", [
    "standards-gate-named",
    "standards-posture-recorded",
    "standards-command",
    "standards-status-artifact",
  ]],
  ["platform-seam", [
    "platform-seam-owner",
    "platform-not-feature-local",
    "platform-consumers",
    "platform-compatibility-proof",
    "platform-artifact-impact",
    "platform-architecture-impact",
  ]],
  ["migration/persistence", [
    "migration-live-schema",
    "migration-applied-file-safety",
    "migration-index-normalization",
    "migration-read-write-proof",
    "migration-postgres-harness",
  ]],
  ["design-system", [
    "design-system-family",
    "design-system-behavior-lock",
    "design-system-render-behavior",
    "design-system-visual-proof",
    "design-system-adoption-path",
  ]],
  ["API-contract", [
    "api-route-family",
    "api-request-response",
    "api-authz-validation",
    "api-compatibility",
    "api-maintained-artifacts",
    "api-validation-command",
  ]],
  ["permission-mapping", [
    "permission-capability-rows",
    "permission-boundary",
    "permission-allow-deny",
    "permission-grants-migration",
    "permission-authz-proof",
  ]],
  ["data-dictionary", [
    "data-entity-table",
    "data-source-reviewed",
    "data-field-index-lifecycle",
    "data-durable-facts",
    "data-validation-proof",
  ]],
  ["QA/evidence", [
    "qa-proof-target",
    "qa-command-plan",
    "qa-runtime-evidence",
    "qa-mock-honesty",
    "qa-evidence-status",
  ]],
]);

const sharedCodePlacementCheckIds = [
  "shared-code-current-owner",
  "shared-code-proposed-owner",
  "shared-code-location-rationale",
  "shared-code-existing-consumers",
  "shared-code-compatibility-proof",
  "shared-code-extraction-task",
];

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
  const sourceTaskTypeSignals = storyContent ? parseSourceTaskTypeSignalRows(storyContent) : [];

  const selectedStories = parseSelectedStoryRows(taskContent);
  const acSnapshot = parseTaskAcSnapshotRows(taskContent);
  const capabilitySnapshot = parseTaskCapabilitySnapshotRows(taskContent);
  const steeringReconciliation = parseSteeringReconciliationRows(taskContent);
  const expectedTaskTypeReconciliation = parseExpectedTaskTypeReconciliationRows(taskContent);
  const tasks = parseTaskRows(taskContent);
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
  const bootstrapsByTask = groupBy(bootstraps, (row) => row.taskId);
  const blockersByTask = groupBy(blockers, (row) => row.blocksTaskId);
  const handoffsByTask = new Map(handoffs.map((row) => [row.taskId, row]));

  for (const task of tasks) {
    validateTaskRow(task, selectedStoryIds, errors);
    validateTaskReferences(task.taskId, taskIds, errors);

    validateAcCoverage(task, acCoverageByTask.get(task.taskId) ?? [], sourceAcsById, selectedStoryIds, errors);
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
    validateBootstrap(task, bootstrapsByTask.get(task.taskId) ?? [], errors);
    validateDeliveryHandoff(task, handoffsByTask.get(task.taskId), blockersByTask.get(task.taskId) ?? [], errors);
  }

  validateUnknownTaskReferences("Task Acceptance Criteria Coverage", acCoverage.map((row) => row.taskId), taskIds, errors);
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
        (candidate.taskType === "refactor-first" || candidate.taskType === "platform-seam")
      );

      if (extractionTasks.length === 0 && task.taskType !== "refactor-first" && task.taskType !== "platform-seam") {
        errors.push(`${task.taskId} needs separate refactor-first or platform-seam extraction task`);
      }

      const dependencyIds = new Set(dependencyRows.flatMap((dependency) => splitIds(dependency.dependsOnTaskIds)));
      const dependsOnExtractionTask = extractionTasks.some((candidate) => dependencyIds.has(candidate.taskId));
      const blocksQueueing = dependencyRows.some((dependency) =>
        splitIds(dependency.dependsOnTaskIds).some((dependencyTaskId) =>
          extractionTasks.some((candidate) => candidate.taskId === dependencyTaskId)
        ) && dependency.mustCompleteBeforeQueueing.trim().toLowerCase() === "yes"
      );

      if (
        task.taskType !== "refactor-first" &&
        task.taskType !== "platform-seam" &&
        (!dependsOnExtractionTask || !blocksQueueing)
      ) {
        errors.push(`${task.taskId} extraction dependency must block queueing on a refactor-first or platform-seam task`);
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
