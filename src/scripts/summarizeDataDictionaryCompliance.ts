import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const repoRoot = process.cwd();
const dataDictionaryDir = join(repoRoot, "docs", "data-dictionary");
const failOnDebt = process.argv.includes("--fail-on-debt");

const riskyPostures = new Set([
  "",
  "blocked",
  "documented-not-enforced",
  "manual-review-required",
  "planned",
]);

const manualReviewPostures = new Set([
  "manual-review-required",
  "manual-review",
]);

const retentionReviewPattern = /retention|cleanup|export|delete|legal-hold/;

interface TraceRow {
  standard: string;
  applies: string;
  enforcement: string;
  evidence: string;
  notes: string;
}

interface EntityComplianceSummary {
  path: string;
  title: string;
  hasClassificationSection: boolean;
  hasTraceSection: boolean;
  traceRows: TraceRow[];
  riskyRows: TraceRow[];
  manualReviewRows: TraceRow[];
  retentionReviewRows: TraceRow[];
  missingEvidenceRows: TraceRow[];
}

function markdownFiles(): string[] {
  if (!existsSync(dataDictionaryDir)) {
    return [];
  }

  return readdirSync(dataDictionaryDir)
    .filter((entry) => entry.endsWith(".md"))
    .filter((entry) => entry !== "README.md" && entry !== "index.md")
    .map((entry) => join(dataDictionaryDir, entry))
    .sort();
}

function extractSection(source: string, heading: string): string {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = source.match(new RegExp(`^## ${escaped}\\s*$`, "m"));
  if (!match || match.index === undefined) {
    return "";
  }

  const start = match.index + match[0].length;
  const rest = source.slice(start);
  const nextHeading = rest.search(/^## /m);
  return nextHeading === -1 ? rest : rest.slice(0, nextHeading);
}

function parseMarkdownTable(section: string): TraceRow[] {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && line.endsWith("|"))
    .filter((line) => !/^\|\s*-+/.test(line))
    .filter((line) => !line.includes("Standard / Rule | Applies?"))
    .map((line) => line.slice(1, -1).split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 5)
    .map((cells) => ({
      standard: cells[0] ?? "",
      applies: normalize(cells[1] ?? ""),
      enforcement: normalize(cells[2] ?? ""),
      evidence: normalize(cells[3] ?? ""),
      notes: cells[4] ?? "",
    }));
}

function normalize(value: string): string {
  return value.trim().replace(/`/g, "").toLowerCase();
}

function isMissingEvidence(row: TraceRow): boolean {
  if (row.applies === "no" || row.applies === "not-applicable") {
    return false;
  }

  return (
    row.evidence === "" ||
    row.evidence === "missing" ||
    row.evidence === "tbd" ||
    row.evidence === "todo" ||
    row.evidence === "not-applicable"
  );
}

function readSummary(path: string): EntityComplianceSummary {
  const source = readFileSync(path, "utf8");
  const title = source.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? relative(repoRoot, path);
  const classificationSection = extractSection(source, "Compliance Classification And Governance");
  const traceSection = extractSection(source, "Compliance And Enforcement Trace");
  const traceRows = parseMarkdownTable(traceSection);
  const riskyRows = traceRows.filter((row) => riskyPostures.has(row.enforcement));
  const manualReviewRows = traceRows.filter((row) => manualReviewPostures.has(row.enforcement));
  const retentionReviewRows = manualReviewRows.filter((row) =>
    retentionReviewPattern.test(`${row.standard} ${row.notes}`.toLowerCase()),
  );
  const missingEvidenceRows = traceRows.filter(isMissingEvidence);

  return {
    path,
    title,
    hasClassificationSection: classificationSection.trim().length > 0,
    hasTraceSection: traceSection.trim().length > 0,
    traceRows,
    riskyRows,
    manualReviewRows,
    retentionReviewRows,
    missingEvidenceRows,
  };
}

function countBy<T extends string>(values: T[]): Record<T, number> {
  return values.reduce((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

function printCountMap(title: string, counts: Record<string, number>): void {
  console.log(`\n${title}`);
  const entries = Object.entries(counts).sort(([left], [right]) => left.localeCompare(right));
  if (entries.length === 0) {
    console.log("- none");
    return;
  }

  for (const [key, value] of entries) {
    console.log(`- ${key || "(blank)"}: ${value}`);
  }
}

function main(): void {
  const files = markdownFiles();
  const summaries = files.map(readSummary);
  const missingClassification = summaries.filter((summary) => !summary.hasClassificationSection);
  const missingTrace = summaries.filter((summary) => !summary.hasTraceSection);
  const allRows = summaries.flatMap((summary) => summary.traceRows);
  const riskyRows = summaries.flatMap((summary) =>
    summary.riskyRows.map((row) => ({ summary, row })),
  );
  const manualReviewRows = summaries.flatMap((summary) =>
    summary.manualReviewRows.map((row) => ({ summary, row })),
  );
  const retentionReviewRows = summaries.flatMap((summary) =>
    summary.retentionReviewRows.map((row) => ({ summary, row })),
  );
  const missingEvidenceRows = summaries.flatMap((summary) =>
    summary.missingEvidenceRows.map((row) => ({ summary, row })),
  );

  console.log("Data Dictionary Compliance Health");
  console.log(`- Entity pages: ${summaries.length}`);
  console.log(`- Pages with classification/governance section: ${summaries.length - missingClassification.length}`);
  console.log(`- Pages missing classification/governance section: ${missingClassification.length}`);
  console.log(`- Pages with enforcement trace section: ${summaries.length - missingTrace.length}`);
  console.log(`- Pages missing enforcement trace section: ${missingTrace.length}`);
  console.log(`- Enforcement trace rows: ${allRows.length}`);
  console.log(`- Risky or incomplete enforcement rows: ${riskyRows.length}`);
  console.log(`- Manual-review-required enforcement rows: ${manualReviewRows.length}`);
  console.log(`- Retention/export/delete/legal-hold review rows: ${retentionReviewRows.length}`);
  console.log(`- Applicable rows with missing evidence: ${missingEvidenceRows.length}`);

  printCountMap("Enforcement Posture Counts", countBy(allRows.map((row) => row.enforcement)));
  printCountMap("Applies Counts", countBy(allRows.map((row) => row.applies)));

  const debtByPage = summaries
    .map((summary) => ({
      summary,
      debt:
        (summary.hasClassificationSection ? 0 : 1) +
        (summary.hasTraceSection ? 0 : 1) +
        summary.riskyRows.length +
        summary.missingEvidenceRows.length,
    }))
    .filter((entry) => entry.debt > 0)
    .sort((left, right) => right.debt - left.debt || left.summary.path.localeCompare(right.summary.path))
    .slice(0, 15);

  console.log("\nHighest-Debt Entity Pages");
  if (debtByPage.length === 0) {
    console.log("- none");
  } else {
    for (const { summary, debt } of debtByPage) {
      console.log(`- ${relative(repoRoot, summary.path)}: ${debt} signal(s)`);
    }
  }

  console.log("\nSample Enforcement Debt");
  const sampleDebt = [...riskyRows, ...missingEvidenceRows].slice(0, 15);
  if (sampleDebt.length === 0) {
    console.log("- none");
  } else {
    for (const { summary, row } of sampleDebt) {
      console.log(
        `- ${relative(repoRoot, summary.path)} :: ${row.standard} :: enforcement=${row.enforcement || "(blank)"} evidence=${row.evidence || "(blank)"}`,
      );
    }
  }

  console.log("\nSample Retention / Export / Delete / Legal-Hold Review Rows");
  const sampleRetentionReviewRows = retentionReviewRows.slice(0, 15);
  if (sampleRetentionReviewRows.length === 0) {
    console.log("- none");
  } else {
    for (const { summary, row } of sampleRetentionReviewRows) {
      console.log(
        `- ${relative(repoRoot, summary.path)} :: ${row.standard} :: enforcement=${row.enforcement || "(blank)"} evidence=${row.evidence || "(blank)"}`,
      );
    }
  }

  if (failOnDebt && (missingClassification.length > 0 || missingTrace.length > 0 || riskyRows.length > 0 || missingEvidenceRows.length > 0)) {
    process.exit(1);
  }
}

main();
