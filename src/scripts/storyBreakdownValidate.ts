import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const requiredHeadings = [
  "# Story Breakdown",
  "## Status",
  "## Handoff Validation",
  "## Epic Summary",
  "## Story Queue",
  "## Acceptance Criteria",
  "## Capability Mapping",
  "## Dependency And Seam Map",
  "## Story Test Input Matrix",
  "## Acceptance Criteria To Test Obligation Matrix",
  "## Follow-Up Decision Questions",
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
  "refactor-first",
  "architecture-foundation",
  "standards-compliance",
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
  const packetStatus = parsePacketStatus(content);

  if (stories.length === 0) {
    errors.push("Story Queue has no story rows");
  }

  const storiesById = new Map(stories.map((story) => [story.storyId, story]));
  const acByStory = groupBy(acceptanceCriteria, (row) => row.storyId);
  const capabilityByAc = groupBy(capabilities, (row) => row.acId);
  const dependencyByStoryOrAc = dependencies;
  const testInputsByStory = new Map(testInputs.map((row) => [row.storyId, row]));

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
    }
  }

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

  validateVaguePhrases(content, errors);

  return {
    status: errors.length === 0 ? "PASS" : "BLOCKED",
    errors,
  };
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
      return first !== "---" && !first.startsWith("---") && !first.includes("Story ID") && !first.includes("AC ID") && !first.includes("Dependency ID") && !first.includes("Artifact ID") && !first.includes("Blocker ID") && !first.includes("Question ID") && !first.includes("New Or Changed");
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
