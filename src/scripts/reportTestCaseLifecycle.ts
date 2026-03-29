import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  parseLifecycleDocument,
  type ParsedTestCaseLifecycle,
} from "../lib/testingData/testCaseLifecycle";

const repoRoot = process.cwd();
const testCaseDir = join(repoRoot, "docs", "prd", "test_cases");

function walkMarkdownFiles(root: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(root)) {
    const fullPath = join(root, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walkMarkdownFiles(fullPath, acc);
      continue;
    }

    if (entry.endsWith(".md") && entry !== "README.md") {
      acc.push(fullPath);
    }
  }

  return acc;
}

function shouldIncludeDocument(path: string, filters: string[]): boolean {
  if (filters.length === 0) {
    return true;
  }

  const normalizedPath = path.toLowerCase();
  return filters.some((filter) => normalizedPath.includes(filter.toLowerCase()));
}

function formatCase(testCase: ParsedTestCaseLifecycle): string[] {
  return [
    `  - ${testCase.testCaseId}`,
    `    Version: ${testCase.version}`,
    `    Lifecycle Status: ${testCase.status}`,
    `    Supersedes: ${testCase.supersedes ?? "none"}`,
    `    Superseded By: ${testCase.supersededBy ?? "none"}`,
    `    Reason: ${testCase.reason ?? "none"}`,
    `    Approval Note: ${testCase.approvalNote ?? "none"}`,
  ];
}

function main() {
  const filters = process.argv.slice(2);
  const files = walkMarkdownFiles(testCaseDir).filter((path) =>
    shouldIncludeDocument(path, filters),
  );

  if (files.length === 0) {
    console.error("No PRD test-case documents matched the requested lifecycle report filters.");
    process.exit(1);
  }

  for (const filePath of files.sort()) {
    const document = parseLifecycleDocument(filePath);
    console.log(`${filePath}`);
    console.log(`- Traceability Enforcement: ${document.traceabilityEnforcement}`);

    if (document.cases.length === 0) {
      console.log("- Cases: none");
      continue;
    }

    console.log(`- Cases: ${document.cases.length}`);
    for (const testCase of document.cases) {
      for (const line of formatCase(testCase)) {
        console.log(line);
      }
    }
  }
}

main();
