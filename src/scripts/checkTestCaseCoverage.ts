import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildTraceabilityReport, formatTraceabilityReport } from "../lib/testingData/traceabilityReport";
import { parseLifecycleDocument } from "../lib/testingData/testCaseLifecycle";

const repoRoot = process.cwd();
const testCaseDir = join(repoRoot, "docs", "prd", "test_cases");
const searchRoots = [
  join(repoRoot, "tests"),
  join(repoRoot, "src"),
];

interface TestCaseSourceSummary {
  activeIds: string[];
  deferredIds: string[];
  deferredDocumentPaths: string[];
  skippedCaseIdsByStatus: Record<string, string[]>;
}

interface CliOptions {
  docs: string[];
}

function parseArgs(args: string[]): CliOptions {
  const docs: string[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === "--doc" && next) {
      docs.push(next);
      index += 1;
      continue;
    }

    console.error(`Unknown or incomplete argument: ${arg}`);
    process.exit(1);
  }

  return { docs };
}

function walkFiles(root: string, predicate: (path: string) => boolean, acc: string[] = []): string[] {
  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      if (entry === "node_modules" || entry === "dist" || entry === "docs") {
        continue;
      }

      walkFiles(fullPath, predicate, acc);
      continue;
    }

    if (predicate(fullPath)) {
      acc.push(fullPath);
    }
  }

  return acc;
}

function readTestCaseSourceSummary(options: CliOptions): TestCaseSourceSummary {
  const markdownFiles = options.docs.length > 0
    ? options.docs.map((path) => join(repoRoot, path))
    : walkFiles(
        testCaseDir,
        (path) => path.endsWith(".md") && !path.endsWith("README.md"),
      );
  const activeIds = new Set<string>();
  const deferredIds = new Set<string>();
  const deferredDocumentPaths: string[] = [];
  const skippedCaseIdsByStatus: Record<string, string[]> = {};

  for (const filePath of markdownFiles) {
    const document = parseLifecycleDocument(filePath);

    if (document.traceabilityEnforcement === "deferred") {
      deferredDocumentPaths.push(filePath);
      const deferredMatches = new Set(readFileSync(filePath, "utf8").match(/TC-[A-Z0-9-]+/g) ?? []);
      for (const testCaseId of deferredMatches) {
        deferredIds.add(testCaseId);
      }
      continue;
    }

    for (const testCase of document.cases) {
      if (testCase.status === "active") {
        activeIds.add(testCase.testCaseId);
        continue;
      }

      skippedCaseIdsByStatus[testCase.status] ??= [];
      skippedCaseIdsByStatus[testCase.status].push(testCase.testCaseId);
    }
  }

  for (const key of Object.keys(skippedCaseIdsByStatus)) {
    skippedCaseIdsByStatus[key].sort();
  }

  return {
    activeIds: [...activeIds].sort(),
    deferredIds: [...deferredIds].sort(),
    deferredDocumentPaths: deferredDocumentPaths.sort(),
    skippedCaseIdsByStatus,
  };
}

function readSearchCorpus(): string {
  const files = searchRoots.flatMap((root) =>
    walkFiles(
      root,
      (path) => path.endsWith(".ts") || path.endsWith(".tsx"),
    ),
  );

  return files
    .map((filePath) => readFileSync(filePath, "utf8"))
    .join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const sourceSummary = readTestCaseSourceSummary(options);
  const ids = sourceSummary.activeIds;

  if (ids.length === 0) {
    if (sourceSummary.deferredDocumentPaths.length > 0) {
      console.log(`Deferred PRD test-case docs skipped: ${sourceSummary.deferredDocumentPaths.length}`);
      for (const path of sourceSummary.deferredDocumentPaths) {
        console.log(`- ${path}`);
      }
      console.log("No active enforced `TC-*` test case IDs were found in the scoped document set.");
      return;
    }

    console.error("No active enforced `TC-*` test case IDs were found under docs/prd/test_cases.");
    process.exit(1);
  }

  const corpus = readSearchCorpus();
  const report = buildTraceabilityReport(ids, corpus);
  report.orphanedExecutableIds = report.orphanedExecutableIds.filter((id) => (
    !sourceSummary.deferredIds.includes(id)
  ));

  const hasFailures =
    report.missingIds.length > 0 ||
    report.orphanedExecutableIds.length > 0 ||
    report.malformedIds.length > 0;
  const writer = hasFailures ? console.error : console.log;

  writer(`Deferred PRD test-case docs skipped: ${sourceSummary.deferredDocumentPaths.length}`);
  for (const path of sourceSummary.deferredDocumentPaths) {
    writer(`- ${path}`);
  }

  const skippedStatuses = Object.keys(sourceSummary.skippedCaseIdsByStatus).sort();
  writer(`Non-active documented test cases skipped: ${skippedStatuses.reduce((sum, status) => (
    sum + sourceSummary.skippedCaseIdsByStatus[status].length
  ), 0)}`);
  for (const status of skippedStatuses) {
    writer(`- ${status}: ${sourceSummary.skippedCaseIdsByStatus[status].length}`);
  }

  for (const line of formatTraceabilityReport(report)) {
    writer(line);
  }

  if (hasFailures) {
    console.error(
      "\nKeep reviewed PRD test cases active only when they still require executable proof, and keep executable `TC-*` IDs aligned with reviewed docs.",
    );
    process.exit(1);
  }
}

main();
