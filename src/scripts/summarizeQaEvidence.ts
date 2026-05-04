import { existsSync, readFileSync } from "node:fs";

interface MarkdownTable {
  heading: string;
  headers: string[];
  rows: string[][];
}

interface QaEvidenceTaskSummary {
  taskId: string;
  title: string;
  proofTarget: boolean;
  commandPlan: boolean;
  runtimeEvidence: boolean;
  mockHonesty: boolean;
  evidenceStatus: boolean;
  coverageStrengthSummary: boolean;
  missing: string[];
}

export interface QaEvidenceSummary {
  packetPath?: string;
  taskCount: number;
  completeTaskCount: number;
  tasks: QaEvidenceTaskSummary[];
}

const requiredEvidenceChecks = new Set([
  "qa-proof-target",
  "qa-command-plan",
  "qa-runtime-evidence",
  "qa-mock-honesty",
  "qa-evidence-status",
  "qa-coverage-strength-summary",
]);

function normalize(value: string): string {
  return value.trim().replace(/`/g, "").toLowerCase();
}

function splitMarkdownRow(line: string): string[] {
  return line
    .trim()
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function isSeparatorRow(line: string): boolean {
  return /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function extractMarkdownTables(source: string): MarkdownTable[] {
  const lines = source.split(/\r?\n/);
  const tables: MarkdownTable[] = [];
  let currentHeading = "";

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const heading = line.match(/^##\s+(.+?)\s*$/)?.[1]?.trim();
    if (heading) {
      currentHeading = heading;
      continue;
    }

    const nextLine = lines[index + 1] ?? "";
    if (!line.trim().startsWith("|") || !nextLine.trim().startsWith("|") || !isSeparatorRow(nextLine)) {
      continue;
    }

    const headers = splitMarkdownRow(line);
    const rows: string[][] = [];
    index += 2;

    while (index < lines.length && (lines[index] ?? "").trim().startsWith("|")) {
      const rowLine = lines[index] ?? "";
      if (!isSeparatorRow(rowLine)) {
        rows.push(splitMarkdownRow(rowLine));
      }
      index += 1;
    }

    index -= 1;
    tables.push({ heading: currentHeading, headers, rows });
  }

  return tables;
}

function findTable(tables: MarkdownTable[], heading: string): MarkdownTable | undefined {
  return tables.find((table) => normalize(table.heading) === normalize(heading));
}

function cell(row: string[], headers: string[], header: string): string {
  const index = headers.findIndex((candidate) => normalize(candidate) === normalize(header));
  return index === -1 ? "" : row[index] ?? "";
}

function rowsForTask(table: MarkdownTable | undefined, taskId: string): string[][] {
  if (!table) {
    return [];
  }

  const taskIdColumn = table.headers.findIndex((header) => normalize(header) === "task id");
  if (taskIdColumn === -1) {
    return [];
  }

  return table.rows.filter((row) => normalize(row[taskIdColumn] ?? "") === normalize(taskId));
}

function hasMeaningfulValue(value: string): boolean {
  const normalized = normalize(value);
  return (
    normalized.length > 0 &&
    !normalized.startsWith("not-applicable") &&
    !normalized.startsWith("not-run") &&
    normalized !== "missing" &&
    normalized !== "tbd" &&
    normalized !== "todo"
  );
}

function hasCheck(taskGuardrailRows: string[][], taskGuardrailHeaders: string[], checkId: string): boolean {
  return taskGuardrailRows.some((row) => {
    const rowCheckId = normalize(cell(row, taskGuardrailHeaders, "Check ID"));
    const status = normalize(cell(row, taskGuardrailHeaders, "Status"));
    return rowCheckId === checkId && status === "pass";
  });
}

function includesAny(value: string, needles: string[]): boolean {
  const normalized = normalize(value);
  return needles.some((needle) => normalized.includes(needle));
}

export function summarizeQaEvidenceContent(source: string, packetPath?: string): QaEvidenceSummary {
  const tables = extractMarkdownTables(source);
  const taskQueue = findTable(tables, "Task Queue");
  const proofPlan = findTable(tables, "Proof And Command Plan");
  const instrumentSummary = findTable(tables, "QA Evidence Instrument Summary");
  const debtSummary = findTable(tables, "Debt Health Summary Commands");
  const guardrailEvidence = findTable(tables, "Task Guardrail Evidence");

  const taskRows =
    taskQueue?.rows.filter((row) => normalize(cell(row, taskQueue.headers, "Task Type")) === "evidence:qa-evidence") ?? [];

  const tasks = taskRows.map((taskRow): QaEvidenceTaskSummary => {
    const taskId = cell(taskRow, taskQueue?.headers ?? [], "Task ID");
    const title = cell(taskRow, taskQueue?.headers ?? [], "Title / Execution Scope");
    const proofRows = rowsForTask(proofPlan, taskId);
    const instrumentRows = rowsForTask(instrumentSummary, taskId);
    const debtRows = rowsForTask(debtSummary, taskId);
    const guardrailRows = rowsForTask(guardrailEvidence, taskId);
    const guardrailHeaders = guardrailEvidence?.headers ?? [];

    const proofText = proofRows.flat().join(" ");
    const instrumentText = instrumentRows.flat().join(" ");

    const proofTarget =
      hasCheck(guardrailRows, guardrailHeaders, "qa-proof-target") ||
      includesAny(proofText, ["proof target", "evidence target", "runtime evidence"]);
    const commandPlan =
      hasCheck(guardrailRows, guardrailHeaders, "qa-command-plan") ||
      proofRows.some((row) => hasMeaningfulValue(cell(row, proofPlan?.headers ?? [], "Required Test Or Proof Commands")));
    const runtimeEvidence =
      hasCheck(guardrailRows, guardrailHeaders, "qa-runtime-evidence") ||
      includesAny(instrumentText || proofText, ["runtime", "live api", "projection", "persistence", "served asset", "browser"]);
    const mockHonesty =
      hasCheck(guardrailRows, guardrailHeaders, "qa-mock-honesty") ||
      includesAny(instrumentText || proofText, ["mock-honesty", "mock honesty", "fixture", "live payload"]);
    const evidenceStatus =
      hasCheck(guardrailRows, guardrailHeaders, "qa-evidence-status") ||
      instrumentRows.some((row) =>
        hasMeaningfulValue(cell(row, instrumentSummary?.headers ?? [], "Evidence Status / Remaining Gap")),
      );
    const coverageStrengthSummary =
      hasCheck(guardrailRows, guardrailHeaders, "qa-coverage-strength-summary") ||
      debtRows.some((row) => normalize(cell(row, debtSummary?.headers ?? [], "Summary Command")).includes("npm run test:coverage-strength"));

    const missing = [
      proofTarget ? "" : "proof target",
      commandPlan ? "" : "command plan",
      runtimeEvidence ? "" : "runtime/live evidence",
      mockHonesty ? "" : "mock honesty",
      evidenceStatus ? "" : "evidence status",
      coverageStrengthSummary ? "" : "coverage-strength summary",
    ].filter(Boolean);

    return {
      taskId,
      title,
      proofTarget,
      commandPlan,
      runtimeEvidence,
      mockHonesty,
      evidenceStatus,
      coverageStrengthSummary,
      missing,
    };
  });

  return {
    packetPath,
    taskCount: tasks.length,
    completeTaskCount: tasks.filter((task) => task.missing.length === 0).length,
    tasks,
  };
}

function printSummary(summary: QaEvidenceSummary): void {
  console.log("QA Evidence Summary");
  if (summary.packetPath) {
    console.log(`- Packet: ${summary.packetPath}`);
  }
  console.log(`- EVIDENCE:qa-evidence tasks: ${summary.taskCount}`);
  console.log(`- Tasks with all evidence categories present: ${summary.completeTaskCount}`);
  console.log(`- Tasks with missing evidence categories: ${summary.taskCount - summary.completeTaskCount}`);

  if (summary.tasks.length === 0) {
    console.log("\nEvidence Task Details");
    console.log("- none");
    return;
  }

  console.log("\nEvidence Task Details");
  for (const task of summary.tasks) {
    const status = task.missing.length === 0 ? "complete" : `missing ${task.missing.join(", ")}`;
    console.log(`- ${task.taskId}: ${status}`);
    if (task.title) {
      console.log(`  title: ${task.title}`);
    }
  }
}

function main(): void {
  const packetPath = process.argv.slice(2).find((arg) => !arg.startsWith("-"));

  if (!packetPath) {
    console.error("Usage: npm run qa:evidence-summary -- <task-packet-path>");
    process.exitCode = 1;
    return;
  }

  if (!existsSync(packetPath)) {
    console.error(`QA evidence packet not found: ${packetPath}`);
    process.exitCode = 1;
    return;
  }

  printSummary(summarizeQaEvidenceContent(readFileSync(packetPath, "utf8"), packetPath));
}

if (require.main === module) {
  main();
}
