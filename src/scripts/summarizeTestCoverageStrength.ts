import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const repoRoot = process.cwd();
const testsRoot = join(repoRoot, "tests");
const issueReconciliationRoot = join(repoRoot, "docs", "workspace", "issue-reconciliations");
const failOnDebt = process.argv.includes("--fail-on-debt");

const layerNames = [
  "unit",
  "integration",
  "security",
  "audit",
  "e2e",
  "visual",
  "performance",
  "accessibility",
  "contract",
  "persistence",
  "platform",
] as const;

type LayerName = typeof layerNames[number];

interface TestFileSummary {
  path: string;
  feature: string;
  layers: Set<LayerName>;
  testCount: number;
  skippedCount: number;
  focusedCount: number;
  assertionCount: number;
  tcIdCount: number;
  usesRuntimeHarness: boolean;
  usesMocking: boolean;
  hasRegressionSignal: boolean;
  isDebugVisual: boolean;
}

function walkFiles(root: string, acc: string[] = []): string[] {
  if (!existsSync(root)) {
    return acc;
  }

  for (const entry of readdirSync(root)) {
    const path = join(root, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      if (entry === "node_modules" || entry === "test-results") {
        continue;
      }

      walkFiles(path, acc);
      continue;
    }

    if ([".ts", ".tsx", ".js", ".mjs"].includes(extname(path)) && /\.test\.|\.spec\./.test(path)) {
      acc.push(path);
    }
  }

  return acc.sort();
}

function inferFeature(path: string): string {
  const relativePath = relative(testsRoot, path);
  const parts = relativePath.split(/[\\/]/);

  if (parts.length >= 2 && layerNames.includes(parts[0] as LayerName)) {
    return parts[1].replace(/\.(test|spec)\..+$/, "");
  }

  return parts[0].replace(/\.(test|spec)\..+$/, "");
}

function inferLayers(path: string, source: string): Set<LayerName> {
  const normalizedPath = relative(repoRoot, path).toLowerCase();
  const normalizedSource = source.toLowerCase();
  const layers = new Set<LayerName>();

  for (const layer of layerNames) {
    if (normalizedPath.includes(layer)) {
      layers.add(layer);
    }
  }

  if (normalizedPath.includes("persistence") || normalizedSource.includes("run_postgres_tests")) {
    layers.add("persistence");
  }
  if (normalizedSource.includes("supertest") || normalizedSource.includes("request(")) {
    layers.add("integration");
    layers.add("contract");
  }
  if (normalizedSource.includes("playwright") || normalizedSource.includes("@playwright/test")) {
    layers.add("e2e");
  }
  if (normalizedSource.includes("axe") || normalizedSource.includes("aria") || normalizedSource.includes("accessibility")) {
    layers.add("accessibility");
  }
  if (/TC-[A-Z0-9-]*SEC[A-Z0-9-]*/.test(source)) {
    layers.add("security");
  }
  if (/TC-[A-Z0-9-]*AUD[A-Z0-9-]*/.test(source)) {
    layers.add("audit");
  }
  if (/TC-[A-Z0-9-]*PERF[A-Z0-9-]*/.test(source)) {
    layers.add("performance");
  }

  return layers;
}

function summarizeFile(path: string): TestFileSummary {
  const source = readFileSync(path, "utf8");
  const layers = inferLayers(path, source);

  return {
    path,
    feature: inferFeature(path),
    layers,
    testCount: (source.match(/\b(?:it|test)\s*\(/g) ?? []).length,
    skippedCount: (source.match(/\b(?:it|test|describe)\.skip\s*\(/g) ?? []).length,
    focusedCount: (source.match(/\b(?:it|test|describe)\.only\s*\(/g) ?? []).length,
    assertionCount: (source.match(/\bexpect\s*\(/g) ?? []).length,
    tcIdCount: new Set(source.match(/TC-[A-Z0-9-]+/g) ?? []).size,
    usesRuntimeHarness:
      source.includes("supertest") ||
      source.includes("@playwright/test") ||
      source.includes("RUN_POSTGRES_TESTS") ||
      source.includes("hasPostgresTestDatabaseConfig") ||
      source.includes("createTest") ||
      source.includes("tests/helpers"),
    usesMocking:
      /\bvi\.(fn|mock|spyOn)\b/.test(source) ||
      /\bmock(?:Implementation|ResolvedValue|RejectedValue|ReturnValue)\b/.test(source) ||
      /\bstub(?:bed|s)?\b/i.test(source),
    hasRegressionSignal:
      /regression|escaped defect|issue[- ]reconciliation|would have failed/i.test(source),
    isDebugVisual: relative(repoRoot, path).replace(/\\/g, "/").includes("/debug/"),
  };
}

function increment(map: Map<string, number>, key: string, amount = 1): void {
  map.set(key, (map.get(key) ?? 0) + amount);
}

function printMap(title: string, map: Map<string, number>): void {
  console.log(`\n${title}`);
  const entries = [...map.entries()].sort(([left], [right]) => left.localeCompare(right));
  if (entries.length === 0) {
    console.log("- none");
    return;
  }

  for (const [key, value] of entries) {
    console.log(`- ${key}: ${value}`);
  }
}

function issueReconciliationFiles(): string[] {
  if (!existsSync(issueReconciliationRoot)) {
    return [];
  }

  return readdirSync(issueReconciliationRoot)
    .filter((entry) => entry.endsWith(".md"))
    .filter((entry) => entry !== "README.md")
    .map((entry) => join(issueReconciliationRoot, entry))
    .sort();
}

function main(): void {
  const summaries = walkFiles(testsRoot).map(summarizeFile);
  const reconciliationFiles = issueReconciliationFiles();
  const layerFileCounts = new Map<string, number>();
  const featureFileCounts = new Map<string, number>();
  const featureLayerCounts = new Map<string, Set<LayerName>>();
  let totalTests = 0;
  let totalAssertions = 0;
  let totalTcIds = 0;

  for (const summary of summaries) {
    totalTests += summary.testCount;
    totalAssertions += summary.assertionCount;
    totalTcIds += summary.tcIdCount;
    increment(featureFileCounts, summary.feature);
    featureLayerCounts.set(summary.feature, featureLayerCounts.get(summary.feature) ?? new Set());

    for (const layer of summary.layers) {
      increment(layerFileCounts, layer);
      featureLayerCounts.get(summary.feature)?.add(layer);
    }
  }

  const skippedFiles = summaries.filter((summary) => summary.skippedCount > 0);
  const focusedFiles = summaries.filter((summary) => summary.focusedCount > 0);
  const weakAssertionFiles = summaries.filter((summary) => summary.testCount > 0 && summary.assertionCount === 0);
  const weakAssertionDebugVisualFiles = weakAssertionFiles.filter((summary) => summary.isDebugVisual);
  const weakAssertionNonDebugFiles = weakAssertionFiles.filter((summary) => !summary.isDebugVisual);
  const mockOnlyRiskFiles = summaries.filter((summary) => summary.usesMocking && !summary.usesRuntimeHarness);
  const regressionSignalFiles = summaries.filter((summary) => summary.hasRegressionSignal);
  const e2eJourneyFiles = summaries.filter((summary) => summary.layers.has("e2e"));
  const visualJourneyFiles = summaries.filter((summary) => summary.layers.has("visual"));
  const browserTierFeatures = [...featureLayerCounts.entries()]
    .filter(([, layers]) => layers.has("e2e") || layers.has("visual"))
    .map(([feature]) => feature)
    .sort();
  const singleLayerFeatures = [...featureLayerCounts.entries()]
    .filter(([, layers]) => layers.size <= 1)
    .map(([feature]) => feature)
    .sort();

  console.log("Test Coverage Strength Summary");
  console.log(`- Test files: ${summaries.length}`);
  console.log(`- Test cases: ${totalTests}`);
  console.log(`- Assertions: ${totalAssertions}`);
  console.log(`- Unique executable TC-* IDs mentioned: ${totalTcIds}`);
  console.log(`- Files with skipped tests: ${skippedFiles.length}`);
  console.log(`- Files with focused .only tests: ${focusedFiles.length}`);
  console.log(`- Files with tests but no expect() assertions: ${weakAssertionFiles.length}`);
  console.log(`- Assertionless debug visual files: ${weakAssertionDebugVisualFiles.length}`);
  console.log(`- Assertionless non-debug files: ${weakAssertionNonDebugFiles.length}`);
  console.log(`- Mock/stub-heavy files without obvious runtime harness: ${mockOnlyRiskFiles.length}`);
  console.log(`- Test files with regression or issue-reconciliation signal: ${regressionSignalFiles.length}`);
  console.log(`- Issue reconciliation docs: ${reconciliationFiles.length}`);
  console.log(`- E2E/browser journey files: ${e2eJourneyFiles.length}`);
  console.log(`- Visual/browser proof files: ${visualJourneyFiles.length}`);
  console.log(`- Features with e2e or visual browser tier: ${browserTierFeatures.length}`);
  console.log(`- Features with only one detected coverage layer: ${singleLayerFeatures.length}`);

  printMap("Coverage Layer File Counts", layerFileCounts);
  printMap("Feature Test File Counts", featureFileCounts);

  console.log("\nFeature Layer Breadth");
  const featureLayerEntries = [...featureLayerCounts.entries()].sort(([left], [right]) => left.localeCompare(right));
  for (const [feature, layers] of featureLayerEntries) {
    console.log(`- ${feature}: ${[...layers].sort().join(", ") || "unclassified"}`);
  }

  console.log("\nEscaped Defect / Regression Calibration");
  console.log(`- Issue reconciliation docs: ${reconciliationFiles.length}`);
  console.log(`- Test files with regression or issue-reconciliation signal: ${regressionSignalFiles.length}`);
  if (regressionSignalFiles.length === 0) {
    console.log("- regression-lock signal: none detected");
  } else {
    for (const summary of regressionSignalFiles.slice(0, 15)) {
      console.log(`- ${relative(repoRoot, summary.path)}`);
    }
  }

  console.log("\nE2E / Browser Journey Tier Calibration");
  console.log(`- E2E journey files: ${e2eJourneyFiles.length}`);
  console.log(`- Visual proof files: ${visualJourneyFiles.length}`);
  console.log(`- Features with e2e or visual browser tier: ${browserTierFeatures.length}`);
  if (browserTierFeatures.length === 0) {
    console.log("- browser-tier features: none");
  } else {
    for (const feature of browserTierFeatures.slice(0, 20)) {
      console.log(`- ${feature}`);
    }
  }

  console.log("\nMock Honesty Risk Signals");
  if (mockOnlyRiskFiles.length === 0) {
    console.log("- none");
  } else {
    for (const summary of mockOnlyRiskFiles.slice(0, 15)) {
      console.log(`- ${relative(repoRoot, summary.path)}`);
    }
  }

  console.log("\nCoverage Debt Signals");
  const debtSignals = [
    ...focusedFiles.map((summary) => `${relative(repoRoot, summary.path)} uses .only`),
    ...skippedFiles.map((summary) => `${relative(repoRoot, summary.path)} has ${summary.skippedCount} skipped test block(s)`),
    ...weakAssertionNonDebugFiles.map((summary) => `${relative(repoRoot, summary.path)} has tests but no expect() assertions`),
    ...weakAssertionDebugVisualFiles.map((summary) => `${relative(repoRoot, summary.path)} is a debug visual file with no expect() assertions`),
    ...mockOnlyRiskFiles.map((summary) => `${relative(repoRoot, summary.path)} uses mocks/stubs without an obvious runtime harness`),
    ...singleLayerFeatures.slice(0, 20).map((feature) => `${feature} has one detected coverage layer`),
  ];

  if (debtSignals.length === 0) {
    console.log("- none");
  } else {
    for (const signal of debtSignals.slice(0, 40)) {
      console.log(`- ${signal}`);
    }
    if (debtSignals.length > 40) {
      console.log(`- ... ${debtSignals.length - 40} more signal(s)`);
    }
  }

  if (
    failOnDebt &&
    (focusedFiles.length > 0 ||
      skippedFiles.length > 0 ||
      weakAssertionFiles.length > 0 ||
      mockOnlyRiskFiles.length > 0 ||
      singleLayerFeatures.length > 0)
  ) {
    process.exit(1);
  }
}

main();
