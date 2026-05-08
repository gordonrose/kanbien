import { spawnSync } from "node:child_process";
import path from "node:path";

import type { CommandResult, ProofRow, RunnerStatus } from "./contract";

const allowedProofCommandPrefixes = [
  "npm run task-breakdown:validate",
  "npm run story-breakdown:validate",
  "npm run product-request:validate",
  "npm run product-discovery:validate",
  "npm run technical-steering:validate",
  "npm run check:feature-dependencies",
  "npm run check:frontend-architecture",
  "npm run data:compliance-health",
  "npm run test:traceability",
  "npm run test:coverage-strength",
  "npm run qa:evidence-summary",
  "npm run typecheck",
  "npx vitest run ",
  "npx playwright test ",
];

export function runValidationCommand(command: string, storyPath: string | undefined, status: RunnerStatus): CommandResult {
  if (!command) {
    return {
      command: "task-breakdown validation",
      status: "skipped",
      reason: "no Validation command found in packet status",
      output: "",
    };
  }

  const commandToRun = storyPath && !command.includes(" --story ") ? `${command} --story ${storyPath}` : command;
  if (!isSafeCommand(commandToRun)) {
    return {
      command: commandToRun,
      status: "blocked",
      reason: "validation command is outside the Layer 5 allowlist",
      output: "",
    };
  }

  const result = executeCommand(commandToRun);

  return {
    command: commandToRun,
    status: result.status === 0 ? "pass" : "fail",
    reason: commandReason(result, status === "ready" ? "pre-edit task packet validation" : "blocked-task validation evidence"),
    output: summarizeOutput(`${result.stdout ?? ""}${result.stderr ?? ""}`),
  };
}

export function runProofCommands(proofRows: ProofRow[], shouldRunProofs: boolean, status: RunnerStatus): CommandResult[] {
  if (proofRows.length === 0) {
    return [
      {
        command: "proof command plan",
        status: "skipped",
        reason: "no proof rows found for task",
        output: "",
      },
    ];
  }

  return proofRows.flatMap((row) => splitCommands(row.commands).map((command) => runProofCommand(command, shouldRunProofs, status)));
}

function runProofCommand(command: string, shouldRunProofs: boolean, status: RunnerStatus): CommandResult {
  if (!command || command.toLowerCase().startsWith("blocked")) {
    return {
      command: command || "proof command",
      status: "blocked",
      reason: "proof plan says this proof is blocked",
      output: "",
    };
  }

  if (status !== "ready") {
    return {
      command,
      status: "blocked",
      reason: "task is not queued and unblocked",
      output: "",
    };
  }

  if (!shouldRunProofs) {
    return {
      command,
      status: "skipped",
      reason: "use --run-proofs to execute focused proof commands",
      output: "",
    };
  }

  if (!isSafeCommand(command)) {
    return {
      command,
      status: "blocked",
      reason: "proof command is outside the Layer 5 allowlist",
      output: "",
    };
  }

  const result = executeCommand(command);

  return {
    command,
    status: result.status === 0 ? "pass" : "fail",
    reason: commandReason(result, "focused proof command"),
    output: summarizeOutput(`${result.stdout ?? ""}${result.stderr ?? ""}`),
  };
}

function isSafeCommand(command: string): boolean {
  const trimmed = command.trim();
  if (
    trimmed.includes("&&") ||
    trimmed.includes("||") ||
    trimmed.includes("|") ||
    trimmed.includes(">") ||
    trimmed.includes("<") ||
    trimmed.includes("$(") ||
    trimmed.includes("`")
  ) {
    return false;
  }

  return allowedProofCommandPrefixes.some((prefix) => trimmed.startsWith(prefix));
}

function executeCommand(command: string): ReturnType<typeof spawnSync> {
  const invocation = toCommandInvocation(command);
  return spawnSync(invocation.command, invocation.args, {
    cwd: process.cwd(),
    shell: false,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 5,
  });
}

function commandReason(result: ReturnType<typeof spawnSync>, baseReason: string): string {
  if (result.status === 0) {
    return baseReason;
  }

  const details = [
    `exit=${String(result.status)}`,
    result.signal ? `signal=${result.signal}` : "",
    result.error ? `error=${result.error.message}` : "",
  ].filter(Boolean);

  return `${baseReason}; ${details.join("; ")}`;
}

function toCommandInvocation(command: string): { command: string; args: string[] } {
  const parts = command.trim().split(/\s+/);

  if (parts[0] === "npx" && parts[1] === "vitest") {
    return {
      command: process.execPath,
      args: [path.resolve(process.cwd(), "node_modules", "vitest", "vitest.mjs"), ...parts.slice(2)],
    };
  }

  if (parts[0] === "npx" && parts[1] === "playwright") {
    return {
      command: process.execPath,
      args: [path.resolve(process.cwd(), "node_modules", "@playwright", "test", "cli.js"), ...parts.slice(2)],
    };
  }

  if (parts[0] === "npm") {
    return {
      command: process.platform === "win32" ? "npm.cmd" : "npm",
      args: parts.slice(1),
    };
  }

  return {
    command: parts[0],
    args: parts.slice(1),
  };
}

function splitCommands(value: string): string[] {
  return value
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

function summarizeOutput(output: string): string {
  const cleaned = output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-8)
    .join(" / ");
  return cleaned || "no output";
}
