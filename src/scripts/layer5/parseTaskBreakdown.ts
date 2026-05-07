import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type {
  BlockerRow,
  DependencyRow,
  GuardrailEvidenceRow,
  HandoffRow,
  Layer5TaskContext,
  PlatformSeamClassContractRow,
  PlatformSeamContractRow,
  ProofRow,
  RunnerStatus,
  TaskQueueRow,
} from "./contract";

const allowedTaskStatuses = new Set(["queued-for-delivery", "blocked", "draft", "superseded"]);

export function loadLayer5TaskContext(taskBreakdownInput: string, taskId: string): Layer5TaskContext {
  const packetPath = resolveTaskBreakdownPath(taskBreakdownInput);
  const packet = readFileSync(packetPath, "utf8");
  const task = findRequiredRow(parseTaskRows(packet), taskId, "Task Queue");
  const handoff = parseHandoffRows(packet).find((row) => row.taskId === taskId);
  const blockers = parseBlockerRows(packet).filter((row) => row.blocksTaskId === taskId);

  return {
    taskBreakdownPath: packetPath,
    task,
    handoff,
    dependencies: parseDependencyRows(packet).filter((row) => row.taskId === taskId),
    blockers,
    proofRows: parseProofRows(packet).filter((row) => row.taskId === taskId),
    guardrailEvidence: parseGuardrailEvidenceRows(packet).filter((row) => row.taskId === taskId),
    platformSeamContracts: parsePlatformSeamContractRows(packet).filter((row) => row.taskId === taskId),
    platformSeamClassContracts: parsePlatformSeamClassContractRows(packet).filter((row) => row.taskId === taskId),
    routeAwayRows: [
      ...parseStopConditionRows(packet).filter((row) => row[0] === taskId),
      ...parseForbiddenWorkRows(packet).filter((row) => row[0] === taskId),
    ],
    status: classifyTask(task, handoff, blockers),
  };
}

export function readTaskBreakdownContent(taskBreakdownPath: string): string {
  return readFileSync(resolveTaskBreakdownPath(taskBreakdownPath), "utf8");
}

export function resolveTaskBreakdownPath(inputPath: string): string {
  const resolved = path.resolve(inputPath);
  if (!existsSync(resolved)) {
    throw new Error(`Task breakdown path does not exist: ${inputPath}`);
  }

  const asPacket = path.join(resolved, "task-breakdown.md");
  if (existsSync(asPacket)) {
    return asPacket;
  }

  return resolved;
}

export function extractBulletValue(content: string, label: string): string {
  const lines = content.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].trim() === `- ${label}:`) {
      return (lines[index + 1] ?? "").trim().replace(/^`|`$/g, "");
    }
  }
  return "";
}

function findRequiredRow(rows: TaskQueueRow[], taskId: string, sectionName: string): TaskQueueRow {
  const row = rows.find((candidate) => candidate.taskId === taskId);
  if (!row) {
    throw new Error(`${sectionName} does not contain task ${taskId}`);
  }
  return row;
}

function classifyTask(task: TaskQueueRow, handoff: HandoffRow | undefined, blockers: BlockerRow[]): RunnerStatus {
  if (!allowedTaskStatuses.has(task.handoffStatus)) {
    return "refused";
  }

  if (task.handoffStatus !== "queued-for-delivery") {
    return "blocked";
  }

  if (handoff && handoff.handoffStatus !== "queued-for-delivery") {
    return "blocked";
  }

  if (blockers.length > 0 || (handoff && !isNoBlockers(handoff.blockersRemaining))) {
    return "blocked";
  }

  return "ready";
}

function parseTaskRows(content: string): TaskQueueRow[] {
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

function parseDependencyRows(content: string): DependencyRow[] {
  return parseTableRows(section(content, "## Task Dependencies")).map((cells) => ({
    taskId: cells[0] ?? "",
    dependsOn: cells[1] ?? "",
    reason: cells[2] ?? "",
    mustCompleteBeforeQueueing: cells[3] ?? "",
  }));
}

function parseProofRows(content: string): ProofRow[] {
  return parseTableRows(section(content, "## Proof And Command Plan")).map((cells) => ({
    taskId: cells[0] ?? "",
    proofLayers: cells[1] ?? "",
    commands: cells[2] ?? "",
    mockHonesty: cells[3] ?? "",
  }));
}

function parseGuardrailEvidenceRows(content: string): GuardrailEvidenceRow[] {
  return parseTableRows(section(content, "## Task Guardrail Evidence")).map((cells) => ({
    taskId: cells[0] ?? "",
    checkId: cells[1] ?? "",
    status: cells[2] ?? "",
    evidence: cells[3] ?? "",
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
    consumers: cells[9] ?? "",
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

function parseBlockerRows(content: string): BlockerRow[] {
  return parseTableRows(section(content, "## Blockers And Isolation Controls")).map((cells) => ({
    blockerId: cells[0] ?? "",
    blocksTaskId: cells[1] ?? "",
    blockerType: cells[2] ?? "",
    requiredSeparateTaskId: cells[3] ?? "",
    reason: cells[4] ?? "",
    resolutionOwner: cells[5] ?? "",
  }));
}

function parseHandoffRows(content: string): HandoffRow[] {
  return parseTableRows(section(content, "## Layer 5 Delivery Handoff")).map((cells) => ({
    taskId: cells[0] ?? "",
    handoffStatus: cells[1] ?? "",
    blockersRemaining: cells[2] ?? "",
    deliveryNotes: cells[3] ?? "",
  }));
}

function parseStopConditionRows(content: string): string[][] {
  return parseTableRows(section(content, "## Decision Escalation / Stop Conditions")).map((cells) => [
    cells[0] ?? "",
    "stop-condition",
    `${cells[1] ?? ""}: ${cells[2] ?? ""} Escalation: ${cells[3] ?? ""}`,
  ]);
}

function parseForbiddenWorkRows(content: string): string[][] {
  return parseTableRows(section(content, "## Forbidden Work")).map((cells) => [
    cells[0] ?? "",
    "forbidden-work",
    `${cells[1] ?? ""} Reason: ${cells[2] ?? ""}`,
  ]);
}

function parseTableRows(sectionContent: string): string[][] {
  return sectionContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"))
    .filter((line) => !/^\|\s*-+/.test(line))
    .map((line) => splitMarkdownTableRow(line))
    .filter((cells) => cells.length > 0 && !cells[0].startsWith("Task ID") && !cells[0].startsWith("Blocker ID"));
}

function splitMarkdownTableRow(line: string): string[] {
  return line
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim().replace(/`/g, ""));
}

function section(content: string, heading: string): string {
  const start = content.indexOf(heading);
  if (start === -1) {
    return "";
  }

  const afterStart = start + heading.length;
  const next = content.slice(afterStart).search(/\n## /);
  return next === -1 ? content.slice(afterStart) : content.slice(afterStart, afterStart + next);
}

function isNoBlockers(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === "none" || normalized === "not-applicable" || normalized.startsWith("not-applicable:");
}
