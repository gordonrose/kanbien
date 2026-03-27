import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildTraceabilityReport, formatTraceabilityReport } from "../lib/testingData/traceabilityReport";

const repoRoot = process.cwd();
const testCaseDir = join(repoRoot, "docs", "prd", "test_cases");
const searchRoots = [
  join(repoRoot, "tests"),
  join(repoRoot, "src"),
];

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

function readTestCaseIds(): string[] {
  const markdownFiles = walkFiles(
    testCaseDir,
    (path) => path.endsWith(".md") && !path.endsWith("README.md"),
  );
  const idPattern = /`(TC-[A-Z0-9-]+)`/g;
  const ids = new Set<string>();

  for (const filePath of markdownFiles) {
    const contents = readFileSync(filePath, "utf8");

    for (const match of contents.matchAll(idPattern)) {
      ids.add(match[1]);
    }
  }

  return [...ids].sort();
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
  const ids = readTestCaseIds();

  if (ids.length === 0) {
    console.error("No `TC-*` test case IDs were found under docs/prd/test_cases.");
    process.exit(1);
  }

  const corpus = readSearchCorpus();
  const report = buildTraceabilityReport(ids, corpus);

  const writer = report.missingIds.length > 0 ? console.error : console.log;
  for (const line of formatTraceabilityReport(report)) {
    writer(line);
  }

  if (report.missingIds.length > 0) {
    console.error(
      "\nAdd each ID to an executable test name or nearby test comment so the documented plan stays traceable.",
    );
    process.exit(1);
  }
}

main();
