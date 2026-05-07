export type CliOptions = {
  taskBreakdownPath: string;
  taskId: string;
  storyPath?: string;
  writeRecord: boolean;
  runProofs: boolean;
  enforceWriteSet: boolean;
  recordRoot: string;
};

export type TaskQueueRow = {
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

export type DependencyRow = {
  taskId: string;
  dependsOn: string;
  reason: string;
  mustCompleteBeforeQueueing: string;
};

export type ProofRow = {
  taskId: string;
  proofLayers: string;
  commands: string;
  mockHonesty: string;
};

export type GuardrailEvidenceRow = {
  taskId: string;
  checkId: string;
  status: string;
  evidence: string;
};

export type PlatformSeamContractRow = {
  taskId: string;
  seamKind: string;
  compatibilityMode: string;
  approvedAuthoritySource: string;
  seamOwnerLocation: string;
  seamSourceInventory: string;
  seamChangeScope: string;
  exactWriteEnvelope: string;
  whyNotFeatureLocal: string;
  consumers: string;
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

export type PlatformSeamClassContractRow = {
  taskId: string;
  platformSeamClass: string;
  classSpecificRequiredProof: string;
  requiredConsumerCoverage: string;
  runtimeMaterializationExpectation: string;
  forbiddenContaminationSplitNotes: string;
};

export type BlockerRow = {
  blockerId: string;
  blocksTaskId: string;
  blockerType: string;
  requiredSeparateTaskId: string;
  reason: string;
  resolutionOwner: string;
};

export type HandoffRow = {
  taskId: string;
  handoffStatus: string;
  blockersRemaining: string;
  deliveryNotes: string;
};

export type CommandResult = {
  command: string;
  status: "pass" | "fail" | "skipped" | "blocked";
  reason: string;
  output: string;
};

export type WriteSetResult = {
  status: "pass" | "blocked" | "skipped";
  mode: "report" | "enforced";
  reason: string;
  allowedEntries: string[];
  changedFiles: string[];
  allowedFiles: string[];
  forbiddenFiles: string[];
  ambiguousEntries: string[];
};

export type RunnerStatus = "ready" | "blocked" | "refused";

export type Layer5TaskContext = {
  taskBreakdownPath: string;
  task: TaskQueueRow;
  handoff: HandoffRow | undefined;
  dependencies: DependencyRow[];
  blockers: BlockerRow[];
  proofRows: ProofRow[];
  guardrailEvidence: GuardrailEvidenceRow[];
  platformSeamContracts: PlatformSeamContractRow[];
  platformSeamClassContracts: PlatformSeamClassContractRow[];
  routeAwayRows: string[][];
  status: RunnerStatus;
};

export type PluginCheckResult = {
  plugin: string;
  status: "pass" | "blocked";
  notes: string[];
};

export type Layer5TaskPlugin = {
  taskType: string;
  check(context: Layer5TaskContext): PluginCheckResult;
};
