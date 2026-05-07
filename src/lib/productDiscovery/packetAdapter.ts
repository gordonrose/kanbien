export type ProductDiscoveryQuestionAnswer = {
  question: string;
  answer: string;
  disposition: "rule" | "usual-case" | "exception" | "out-of-scope" | "deferred";
};

export type ProductDiscoveryPacketAdapterInput = {
  title: string;
  originalRequest: string;
  plainLanguageRequestSummary: string;
  packetDate: string;
  ownerRequester: string;
  initialUnderstanding: string;
  interviewTurns: ProductDiscoveryQuestionAnswer[];
  assumptionsConfirmed: string[];
  technicalQuestionsPackaged: string[];
  confidencePercent: number;
  problemToSolve: string;
  businessOutcome: string;
  primaryUserOutcome: string;
  whyNow: string;
  successSignal: string;
  nonGoalSummary: string;
  taxonomy: ProductDiscoveryTaxonomyInput;
  jobToBeDone: ProductDiscoveryJobToBeDoneInput;
  useCases: ProductDiscoveryUseCaseInput[];
  capabilityBreakdown: ProductDiscoveryCapabilityInput[];
  technicalSteeringHandoff: ProductDiscoveryTechnicalSteeringHandoffInput;
};

export type ProductDiscoveryTaxonomyInput = {
  productFeatureType: string;
  uxPatterns: string;
  dataOwnershipShape: string;
  surfaceManagementLocation: string;
  actorPermissionShape: string;
  relationshipShape: string;
  reportingReadModelShape: string;
  lifecycleShape: string;
  integrationExternalityShape: string;
  evidenceComplianceSensitivity: string;
};

export type ProductDiscoveryJobToBeDoneInput = {
  actor: string;
  situation: string;
  motivation: string;
  outcome: string;
};

export type ProductDiscoveryUseCaseInput = {
  id: string;
  actor: string;
  statement: string;
  successOutcome: string;
};

export type ProductDiscoveryCapabilityInput = {
  id: string;
  capability: string;
  rationale: string;
  downstreamSignal: string;
};

export type ProductDiscoveryTechnicalSteeringHandoffInput = {
  handoffStatus: "ready-for-technical-steering" | "blocked-product-intent" | "discovery-only";
  architectureSignals: string[];
  riskFlags: string[];
  packagedQuestions: string[];
};

export type ProductDiscoveryPacketData = ProductDiscoveryPacketAdapterInput & {
  packetHeading: string;
  discoveryStatus: ProductDiscoveryTechnicalSteeringHandoffInput["handoffStatus"];
};

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function createProductDiscoveryPacketData(input: ProductDiscoveryPacketAdapterInput): ProductDiscoveryPacketData {
  validateInput(input);

  return {
    ...input,
    title: normalizeInline(input.title),
    originalRequest: normalizeInline(input.originalRequest),
    plainLanguageRequestSummary: normalizeInline(input.plainLanguageRequestSummary),
    ownerRequester: normalizeInline(input.ownerRequester),
    initialUnderstanding: normalizeInline(input.initialUnderstanding),
    assumptionsConfirmed: input.assumptionsConfirmed.map(normalizeInline),
    technicalQuestionsPackaged: input.technicalQuestionsPackaged.map(normalizeInline),
    problemToSolve: normalizeInline(input.problemToSolve),
    businessOutcome: normalizeInline(input.businessOutcome),
    primaryUserOutcome: normalizeInline(input.primaryUserOutcome),
    whyNow: normalizeInline(input.whyNow),
    successSignal: normalizeInline(input.successSignal),
    nonGoalSummary: normalizeInline(input.nonGoalSummary),
    packetHeading: `# Product Discovery Packet: ${normalizeInline(input.title)}`,
    discoveryStatus: input.technicalSteeringHandoff.handoffStatus,
  };
}

export function renderProductDiscoveryPacketMarkdown(data: ProductDiscoveryPacketData): string {
  return `${data.packetHeading}

## Status

- Discovery status:
  \`${data.discoveryStatus}\`
- Draft posture:
  \`governed-discovery\`
- Original request:
  ${data.originalRequest}
- Plain-language request summary:
  ${data.plainLanguageRequestSummary}
- Packet date:
  ${data.packetDate}
- Owner / requester:
  ${data.ownerRequester}
- Related product template:
  \`generic-feature\`
- Product template posture:
  \`generic-template-used\`
- Taxonomy version:
  \`current\`
- Prior packet or feedback reference:
  not-applicable

## Discovery Interview Summary

- Initial understanding shared with requester:
  ${data.initialUnderstanding}
- Interview cadence:
  \`one-question-at-a-time-followed\`
- If interview cadence exception was approved, why:
  not-applicable
- Coverage areas tracked internally:
  universal matrix and triggered overlays
- Assumptions confirmed by requester:
${renderBullets(data.assumptionsConfirmed)}
- Business questions explicitly signed off as deferred until later:
  none
- Technical questions packaged for technical stakeholder:
${renderBullets(data.technicalQuestionsPackaged)}
- Questions still blocking packet confidence:
  none
- Scope cuts used to reach confidence:
  ${data.nonGoalSummary}
- Confidence for chosen status:
  \`${data.confidencePercent}%; must be 95% or higher for ready-for-technical-steering\`

## Known Questions Gate

- Plain-language summary shown before drafting:
  ${data.plainLanguageRequestSummary}
- First one question asked before drafting:
  ${data.interviewTurns[0].question}
- Requester answered, corrected, or explicitly deferred first question:
  \`yes\`
- Known important product questions left unasked:
  none
- For each unasked business question, requester signoff for "deferred until
  later":
  none
- Technical questions not asked of business owner and packaged for technical
  stakeholder:
${renderBullets(data.technicalQuestionsPackaged)}
- If any known question was not asked, why was it safe to defer or package:
  Remaining questions are technical implementation questions for Technical Steering.
- Packet status allowed:
  \`yes\`

## Product Intent

- Problem to solve:
  ${data.problemToSolve}
- Business outcome:
  ${data.businessOutcome}
- Primary user outcome:
  ${data.primaryUserOutcome}
- Why now:
  ${data.whyNow}
- Success signal:
  ${data.successSignal}
- Non-goal summary:
  ${data.nonGoalSummary}

## Taxonomy Classification

Reference: \`docs/product-discovery/taxonomy.md\`.

- Product feature type:
  ${data.taxonomy.productFeatureType}
- UX pattern(s):
  ${data.taxonomy.uxPatterns}
- Data ownership shape:
  ${data.taxonomy.dataOwnershipShape}
- Surface / management location:
  ${data.taxonomy.surfaceManagementLocation}
- Actor and permission shape:
  ${data.taxonomy.actorPermissionShape}
- Relationship shape:
  ${data.taxonomy.relationshipShape}
- Reporting / read model shape:
  ${data.taxonomy.reportingReadModelShape}
- Lifecycle shape:
  ${data.taxonomy.lifecycleShape}
- Integration / externality shape:
  ${data.taxonomy.integrationExternalityShape}
- Evidence / compliance sensitivity:
  ${data.taxonomy.evidenceComplianceSensitivity}
- New taxonomy value needed:
  none currently
- New taxonomy axis needed:
  none currently

## Job-To-Be-Done Bridge

| Actor | Situation | Motivation | Outcome |
| --- | --- | --- | --- |
| ${escapeCell(data.jobToBeDone.actor)} | ${escapeCell(data.jobToBeDone.situation)} | ${escapeCell(data.jobToBeDone.motivation)} | ${escapeCell(data.jobToBeDone.outcome)} |

## Use Case Statements

| Use Case ID | Actor | Statement | Success Outcome |
| --- | --- | --- | --- |
${data.useCases.map((useCase) => `| ${escapeCell(useCase.id)} | ${escapeCell(useCase.actor)} | ${escapeCell(useCase.statement)} | ${escapeCell(useCase.successOutcome)} |`).join("\n")}

## State-Based Journey Matrix

| State | User Need | Expected System Response | Evidence |
| --- | --- | --- | --- |
${data.interviewTurns.map((turn, index) => `| interview-turn-${index + 1} | ${escapeCell(turn.question)} | Treat answer as ${escapeCell(turn.disposition)}. | ${escapeCell(turn.answer)} |`).join("\n")}

## Product Capability Breakdown

| Capability ID | Capability | Rationale | Downstream Signal |
| --- | --- | --- | --- |
${data.capabilityBreakdown.map((capability) => `| ${escapeCell(capability.id)} | ${escapeCell(capability.capability)} | ${escapeCell(capability.rationale)} | ${escapeCell(capability.downstreamSignal)} |`).join("\n")}

## Technical Steering Handoff

- Handoff status:
  \`${data.technicalSteeringHandoff.handoffStatus}\`
- Architecture signals:
${renderBullets(data.technicalSteeringHandoff.architectureSignals)}
- Risk flags:
${renderBullets(data.technicalSteeringHandoff.riskFlags)}
- Packaged questions:
${renderBullets(data.technicalSteeringHandoff.packagedQuestions)}
`;
}

function validateInput(input: ProductDiscoveryPacketAdapterInput): void {
  const requiredFields: Array<[string, string]> = [
    ["title", input.title],
    ["originalRequest", input.originalRequest],
    ["plainLanguageRequestSummary", input.plainLanguageRequestSummary],
    ["packetDate", input.packetDate],
    ["ownerRequester", input.ownerRequester],
    ["initialUnderstanding", input.initialUnderstanding],
    ["problemToSolve", input.problemToSolve],
    ["businessOutcome", input.businessOutcome],
    ["primaryUserOutcome", input.primaryUserOutcome],
    ["whyNow", input.whyNow],
    ["successSignal", input.successSignal],
    ["nonGoalSummary", input.nonGoalSummary],
  ];

  for (const [field, value] of requiredFields) {
    if (!normalizeInline(value)) {
      throw new Error(`${field} is required for Product Discovery packet data.`);
    }
  }

  if (!isoDatePattern.test(input.packetDate)) {
    throw new Error("packetDate must use YYYY-MM-DD.");
  }

  if (input.technicalSteeringHandoff.handoffStatus === "ready-for-technical-steering" && input.confidencePercent < 95) {
    throw new Error("ready-for-technical-steering requires confidencePercent >= 95.");
  }

  requireNonEmpty("interviewTurns", input.interviewTurns);
  requireNonEmpty("assumptionsConfirmed", input.assumptionsConfirmed);
  requireNonEmpty("technicalQuestionsPackaged", input.technicalQuestionsPackaged);
  requireNonEmpty("useCases", input.useCases);
  requireNonEmpty("capabilityBreakdown", input.capabilityBreakdown);
  requireNonEmpty("architectureSignals", input.technicalSteeringHandoff.architectureSignals);
  requireNonEmpty("riskFlags", input.technicalSteeringHandoff.riskFlags);
  requireNonEmpty("packagedQuestions", input.technicalSteeringHandoff.packagedQuestions);
}

function requireNonEmpty(field: string, values: readonly unknown[]): void {
  if (values.length === 0) {
    throw new Error(`${field} must include at least one entry.`);
  }
}

function renderBullets(values: string[]): string {
  return values.map((value) => `  - ${value}`).join("\n");
}

function normalizeInline(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function escapeCell(value: string): string {
  return normalizeInline(value).replace(/\|/g, "\\|");
}
