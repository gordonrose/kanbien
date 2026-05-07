import path from "node:path";

import type {
  ArtifactObligationResult,
  CommandResult,
  Layer5TaskContext,
  PluginCheckResult,
  WriteSetResult,
} from "./contract";

export function makeRecordPath(root: string, storyId: string, taskId: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return path.resolve(root, date, `${storyId}-${taskId}-run.md`);
}

export function renderRunRecord(input: {
  context: Layer5TaskContext;
  validationResult: CommandResult;
  proofResults: CommandResult[];
  pluginResults: PluginCheckResult[];
  writeSetResult?: WriteSetResult;
  artifactObligationResult?: ArtifactObligationResult;
}): string {
  const { context } = input;
  const allCommandResults = [input.validationResult, ...input.proofResults];
  return `# Layer 5 Task Run Record: ${context.task.taskId}

## Status

- Run status:
  \`${context.status}\`
- Created at:
  ${new Date().toISOString()}
- Source task breakdown:
  ${context.taskBreakdownPath}
- Task ID:
  \`${context.task.taskId}\`
- Parent story:
  \`${context.task.parentStoryId}\`
- Task type:
  \`${context.task.taskType}\`
- Delivery status:
  \`${context.task.handoffStatus}\`

## Task Contract Snapshot

| Field | Value |
| --- | --- |
| Execution scope | ${escapeTableCell(context.task.scope)} |
| Allowed write set | ${escapeTableCell(context.task.allowedWriteSet)} |
| Non-goals | ${escapeTableCell(context.task.nonGoals)} |
| Shared seams | ${escapeTableCell(context.task.sharedSeams)} |
| Handoff blockers | ${escapeTableCell(context.handoff?.blockersRemaining ?? "missing Layer 5 Delivery Handoff row")} |
| Handoff notes | ${escapeTableCell(context.handoff?.deliveryNotes ?? "missing Layer 5 Delivery Handoff row")} |

## Dependencies

${renderTable(["Task ID", "Depends On", "Reason", "Must Complete Before Queueing"], context.dependencies.map((row) => [
    row.taskId,
    row.dependsOn,
    row.reason,
    row.mustCompleteBeforeQueueing,
  ]))}

## Blockers

${renderTable(["Blocker ID", "Blocks Task ID", "Type", "Required Separate Task", "Reason", "Resolution / Owner"], context.blockers.map((row) => [
    row.blockerId,
    row.blocksTaskId,
    row.blockerType,
    row.requiredSeparateTaskId,
    row.reason,
    row.resolutionOwner,
  ]))}

## Proof Plan

${renderTable(["Task ID", "Proof Layers", "Commands", "Mock Honesty / Runtime Notes"], context.proofRows.map((row) => [
    row.taskId,
    row.proofLayers,
    row.commands,
    row.mockHonesty,
  ]))}

## Guardrail Evidence

${renderTable(["Task ID", "Check ID", "Status", "Evidence / Rationale"], context.guardrailEvidence.map((row) => [
    row.taskId,
    row.checkId,
    row.status,
    row.evidence,
  ]))}

## Plugin Checks

${renderTable(["Plugin", "Status", "Notes"], input.pluginResults.map((row) => [
    row.plugin,
    row.status,
    row.notes.join("; "),
  ]))}

## Write-Set Check

${renderWriteSetResult(input.writeSetResult)}

## Artifact Obligation Check

${renderArtifactObligationResult(input.artifactObligationResult)}

## Route-Away / Split Notes

${renderTable(["Task ID", "Route-Away Source", "Notes"], context.routeAwayRows.map((row) => row.slice(0, 3)))}

## Command Results

${renderTable(["Command", "Status", "Reason", "Output Summary"], allCommandResults.map((row) => [
    row.command,
    row.status,
    row.reason,
    row.output || "not-applicable",
  ]))}
`;
}

function renderArtifactObligationResult(result: ArtifactObligationResult | undefined): string {
  if (!result) {
    return renderTable(["Field", "Value"], [["Status", "skipped"], ["Reason", "artifact-obligation check was not run"]]);
  }

  return [
    renderTable([
      "Field",
      "Value",
    ], [
      ["Status", result.status],
      ["Reason", result.reason],
      ["Changed files", result.changedFiles.join("; ") || "not-applicable"],
    ]),
    "",
    renderTable([
      "Obligation",
      "Status",
      "Reason",
      "Evidence",
    ], result.obligations.map((obligation) => [
      obligation.obligation,
      obligation.status,
      obligation.reason,
      obligation.evidence.join("; ") || "not-applicable",
    ])),
  ].join("\n");
}

function renderTable(headers: string[], rows: string[][]): string {
  const safeRows = rows.length > 0 ? rows : [headers.map(() => "not-applicable")];
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...safeRows.map((row) => `| ${headers.map((_, index) => escapeTableCell(row[index] ?? "")).join(" | ")} |`),
  ].join("\n");
}

function escapeTableCell(value: string): string {
  return value.replace(/\n/g, " ").replace(/\|/g, "\\|").trim();
}

function renderWriteSetResult(result: WriteSetResult | undefined): string {
  if (!result) {
    return renderTable(["Field", "Value"], [["Status", "skipped"], ["Reason", "write-set check was not run"]]);
  }

  return renderTable([
    "Field",
    "Value",
  ], [
    ["Status", result.status],
    ["Mode", result.mode],
    ["Reason", result.reason],
    ["Allowed entries", result.allowedEntries.join("; ") || "not-applicable"],
    ["Changed files", result.changedFiles.join("; ") || "not-applicable"],
    ["Allowed changed files", result.allowedFiles.join("; ") || "not-applicable"],
    ["Forbidden changed files", result.forbiddenFiles.join("; ") || "not-applicable"],
    ["Ambiguous entries", result.ambiguousEntries.join("; ") || "not-applicable"],
  ]);
}
