import type {
  ArtifactObligationResult,
  CloseoutResult,
  CommandResult,
  PluginCheckResult,
  RunnerStatus,
  WriteSetResult,
} from "./contract";

export function classifyCloseoutResult(input: {
  preEditRecordExists: boolean;
  taskStatus: RunnerStatus;
  pluginResults: PluginCheckResult[];
  writeSetResult: WriteSetResult;
  artifactObligationResult: ArtifactObligationResult;
  validationResult: CommandResult;
  proofResults: CommandResult[];
}): CloseoutResult {
  if (!input.preEditRecordExists) {
    return blocked("blocked-pre-edit-record", 2, "pre-edit run record is missing");
  }

  if (input.taskStatus !== "ready") {
    return blocked("blocked-task-status", 2, `task status is ${input.taskStatus}`);
  }

  const blockedPlugin = input.pluginResults.find((result) => result.status === "blocked");
  if (blockedPlugin) {
    return blocked("blocked-plugin", 2, `task-type plugin blocked: ${blockedPlugin.plugin}`);
  }

  if (input.writeSetResult.status === "blocked") {
    return blocked("blocked-write-set", 2, input.writeSetResult.reason);
  }

  if (input.artifactObligationResult.status === "blocked") {
    return blocked("blocked-artifact-obligation", 2, input.artifactObligationResult.reason);
  }

  if (input.validationResult.status === "fail" || input.validationResult.status === "blocked") {
    return blocked("blocked-validation", input.validationResult.status === "fail" ? 1 : 2, input.validationResult.reason);
  }

  const blockedProof = input.proofResults.find((result) => result.status === "fail" || result.status === "blocked");
  if (blockedProof) {
    return blocked("blocked-proof", blockedProof.status === "fail" ? 1 : 2, `${blockedProof.command}: ${blockedProof.reason}`);
  }

  return {
    code: "pass",
    status: "pass",
    exitCode: 0,
    reason: "closeout gates passed",
  };
}

function blocked(code: CloseoutResult["code"], exitCode: 1 | 2, reason: string): CloseoutResult {
  return {
    code,
    status: "blocked",
    exitCode,
    reason,
  };
}
