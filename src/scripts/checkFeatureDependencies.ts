import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();
const FEATURES_ROOT = path.join(REPO_ROOT, "src", "features");
const GENERATED_DIR = path.join(REPO_ROOT, "docs", "architecture", "generated");
const JSON_OUTPUT = path.join(GENERATED_DIR, "feature-dependency-graph.json");
const MARKDOWN_OUTPUT = path.join(GENERATED_DIR, "feature-dependency-graph.md");
const FEATURE_MANIFEST_FILENAME = "feature.manifest.json";

const SOURCE_FILE_EXTENSIONS = new Set([".ts", ".tsx"]);
const IMPORT_PATTERN = /\b(?:import|export)\b[\s\S]*?\bfrom\s+["']([^"']+)["']/g;
const SIDE_EFFECT_IMPORT_PATTERN = /\bimport\s+["']([^"']+)["']/g;

type PublicSeamManifest = {
  seamId: string;
  symbol: string;
  path: string;
  kind: string;
  stability: "stable" | "experimental" | "internal";
  description: string;
};

type DeclaredDependencyManifest = {
  featureName: string;
  seamIds: string[];
  description: string;
};

type FeatureManifest = {
  schemaVersion: 1;
  featureName: string;
  publicSeams: PublicSeamManifest[];
  dependsOn: DeclaredDependencyManifest[];
  breakingChangeRisks: string[];
};

type ManifestLoadResult = {
  manifest: FeatureManifest;
  manifestPath: string;
};

type ImportReference = {
  sourceFile: string;
  sourceFeature: string;
  importPath: string;
  line: number;
  resolvedPath: string | null;
  targetFeature: string;
  visibility: "public" | "private";
};

type ValidationViolation = {
  category:
    | "private-cross-feature-import"
    | "missing-manifest"
    | "invalid-manifest"
    | "undeclared-import-dependency"
    | "stale-declared-dependency"
    | "unknown-dependency-feature"
    | "unknown-dependency-seam";
  featureName: string;
  filePath: string;
  line?: number;
  importPath?: string;
  resolvedPath?: string | null;
  relatedFeature?: string;
  reason: string;
};

type FeatureSummary = {
  featureName: string;
  manifestPath: string;
  fileCount: number;
  publicSeams: Array<{
    seamId: string;
    symbol: string;
    kind: string;
    stability: PublicSeamManifest["stability"];
    path: string;
  }>;
  declaredDependencies: string[];
  publicDependencies: string[];
  privateDependencyCount: number;
  dependedOnBy: string[];
  breakingChangeRisks: string[];
};

type DependencySummary = {
  sourceFeature: string;
  targetFeature: string;
  declaredInManifest: boolean;
  declaredSeamIds: string[];
  publicImportCount: number;
  privateImportCount: number;
  imports: Array<{
    sourceFile: string;
    importPath: string;
    line: number;
    resolvedPath: string | null;
    visibility: "public" | "private";
  }>;
};

type OutputDocument = {
  ruleVersion: 2;
  ruleSummary: string;
  featureCount: number;
  edgeCount: number;
  violationCount: number;
  features: FeatureSummary[];
  dependencies: DependencySummary[];
  violations: ValidationViolation[];
};

function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

function relativeToRepo(absolutePath: string): string {
  return toPosix(path.relative(REPO_ROOT, absolutePath));
}

function listFeatureNames(): string[] {
  return readdirSync(FEATURES_ROOT)
    .filter((entry) => statSync(path.join(FEATURES_ROOT, entry)).isDirectory())
    .filter((entry) => existsSync(path.join(FEATURES_ROOT, entry, "index.ts")))
    .sort((left, right) => left.localeCompare(right));
}

function listFeatureSourceFiles(featureName: string): string[] {
  const featureRoot = path.join(FEATURES_ROOT, featureName);
  const files: string[] = [];

  function walk(currentPath: string) {
    for (const entry of readdirSync(currentPath)) {
      const entryPath = path.join(currentPath, entry);
      const stats = statSync(entryPath);
      if (stats.isDirectory()) {
        if (relativeToRepo(entryPath).startsWith(`src/features/${featureName}/persistence/migrations/`)) {
          continue;
        }
        walk(entryPath);
        continue;
      }

      if (SOURCE_FILE_EXTENSIONS.has(path.extname(entryPath))) {
        files.push(entryPath);
      }
    }
  }

  walk(featureRoot);
  return files.sort((left, right) => relativeToRepo(left).localeCompare(relativeToRepo(right)));
}

function collectModuleSpecifiers(contents: string): Array<{ specifier: string; line: number }> {
  const matches: Array<{ specifier: string; line: number }> = [];
  const seen = new Set<string>();

  const collect = (pattern: RegExp) => {
    pattern.lastIndex = 0;
    let match = pattern.exec(contents);
    while (match) {
      const specifier = match[1];
      const line = contents.slice(0, match.index).split("\n").length;
      const key = `${specifier}:${line}`;
      if (!seen.has(key)) {
        seen.add(key);
        matches.push({ specifier, line });
      }
      match = pattern.exec(contents);
    }
  };

  collect(IMPORT_PATTERN);
  collect(SIDE_EFFECT_IMPORT_PATTERN);

  return matches.sort((left, right) =>
    left.line - right.line || left.specifier.localeCompare(right.specifier),
  );
}

function resolveImportPath(sourceFile: string, importPath: string): string | null {
  if (!importPath.startsWith(".")) {
    return null;
  }

  const basePath = path.resolve(path.dirname(sourceFile), importPath);
  const candidates: string[] = [];

  if (existsSync(basePath) && statSync(basePath).isFile()) {
    candidates.push(basePath);
  }

  candidates.push(
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
  );

  const match = candidates.find((candidate) => existsSync(candidate));
  return match ?? null;
}

function parseFeaturePath(resolvedPath: string | null): { featureName: string; repoPath: string } | null {
  if (!resolvedPath) {
    return null;
  }

  const repoPath = relativeToRepo(resolvedPath);
  const segments = repoPath.split("/");
  if (segments[0] !== "src" || segments[1] !== "features" || !segments[2]) {
    return null;
  }

  return { featureName: segments[2], repoPath };
}

function isPublicFeatureSeam(targetFeature: string, resolvedRepoPath: string): boolean {
  return (
    resolvedRepoPath === `src/features/${targetFeature}/index.ts`
    || resolvedRepoPath === `src/features/${targetFeature}/index.tsx`
  );
}

function createEmptyManifest(featureName: string): FeatureManifest {
  return {
    schemaVersion: 1,
    featureName,
    publicSeams: [],
    dependsOn: [],
    breakingChangeRisks: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function readStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const items = value
    .map((item) => readString(item))
    .filter((item): item is string => Boolean(item));

  return items.length === value.length ? items : null;
}

function loadFeatureManifest(
  featureName: string,
  featureNames: string[],
  violations: ValidationViolation[],
): ManifestLoadResult {
  const manifestPath = path.join(FEATURES_ROOT, featureName, FEATURE_MANIFEST_FILENAME);
  const repoManifestPath = relativeToRepo(manifestPath);

  if (!existsSync(manifestPath)) {
    violations.push({
      category: "missing-manifest",
      featureName,
      filePath: repoManifestPath,
      reason: `Missing ${FEATURE_MANIFEST_FILENAME}.`,
    });
    return { manifest: createEmptyManifest(featureName), manifestPath: repoManifestPath };
  }

  try {
    const raw = JSON.parse(readFileSync(manifestPath, "utf8")) as unknown;
    if (!isRecord(raw)) {
      throw new Error("Manifest root must be an object.");
    }

    if (raw.schemaVersion !== 1) {
      throw new Error("schemaVersion must be 1.");
    }

    const manifestFeatureName = readString(raw.featureName);
    if (!manifestFeatureName || manifestFeatureName !== featureName) {
      throw new Error(`featureName must match folder name "${featureName}".`);
    }

    if (!Array.isArray(raw.publicSeams) || raw.publicSeams.length === 0) {
      throw new Error("publicSeams must be a non-empty array.");
    }

    const publicSeams: PublicSeamManifest[] = raw.publicSeams.map((item) => {
      if (!isRecord(item)) {
        throw new Error("Each publicSeams item must be an object.");
      }

      const seamId = readString(item.seamId);
      const symbol = readString(item.symbol);
      const seamPath = readString(item.path);
      const kind = readString(item.kind);
      const stability = readString(item.stability);
      const description = readString(item.description);

      if (!seamId || !symbol || !seamPath || !kind || !stability || !description) {
        throw new Error("Each publicSeams item must define seamId, symbol, path, kind, stability, and description.");
      }

      if (stability !== "stable" && stability !== "experimental" && stability !== "internal") {
        throw new Error(`Unsupported seam stability "${stability}" in ${repoManifestPath}.`);
      }

      const absoluteSeamPath = path.join(FEATURES_ROOT, featureName, seamPath);
      if (!existsSync(absoluteSeamPath)) {
        throw new Error(`Public seam path "${seamPath}" does not exist for ${featureName}.`);
      }

      return {
        seamId,
        symbol,
        path: seamPath,
        kind,
        stability,
        description,
      };
    });

    const seamIds = new Set<string>();
    for (const publicSeam of publicSeams) {
      if (seamIds.has(publicSeam.seamId)) {
        throw new Error(`Duplicate public seam id "${publicSeam.seamId}" in ${repoManifestPath}.`);
      }
      seamIds.add(publicSeam.seamId);
    }

    if (!Array.isArray(raw.dependsOn)) {
      throw new Error("dependsOn must be an array.");
    }

    const dependsOn: DeclaredDependencyManifest[] = raw.dependsOn.map((item) => {
      if (!isRecord(item)) {
        throw new Error("Each dependsOn item must be an object.");
      }

      const dependencyFeatureName = readString(item.featureName);
      const dependencySeamIds = readStringArray(item.seamIds);
      const description = readString(item.description);

      if (!dependencyFeatureName || !dependencySeamIds || !description || dependencySeamIds.length === 0) {
        throw new Error("Each dependsOn item must define featureName, non-empty seamIds, and description.");
      }

      if (!featureNames.includes(dependencyFeatureName)) {
        throw new Error(`Unknown dependency feature "${dependencyFeatureName}" in ${repoManifestPath}.`);
      }

      return {
        featureName: dependencyFeatureName,
        seamIds: dependencySeamIds,
        description,
      };
    });

    const dependencyNames = new Set<string>();
    for (const dependency of dependsOn) {
      if (dependencyNames.has(dependency.featureName)) {
        throw new Error(`Duplicate dependency entry for "${dependency.featureName}" in ${repoManifestPath}.`);
      }
      dependencyNames.add(dependency.featureName);
    }

    const breakingChangeRisks = readStringArray(raw.breakingChangeRisks);
    if (!breakingChangeRisks || breakingChangeRisks.length === 0) {
      throw new Error("breakingChangeRisks must be a non-empty array of strings.");
    }

    return {
      manifest: {
        schemaVersion: 1,
        featureName,
        publicSeams,
        dependsOn,
        breakingChangeRisks,
      },
      manifestPath: repoManifestPath,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid manifest.";
    violations.push({
      category: "invalid-manifest",
      featureName,
      filePath: repoManifestPath,
      reason: message,
    });
    return { manifest: createEmptyManifest(featureName), manifestPath: repoManifestPath };
  }
}

function buildGraph(featureNames: string[]): OutputDocument {
  const violations: ValidationViolation[] = [];
  const manifests = new Map<string, ManifestLoadResult>();

  for (const featureName of featureNames) {
    manifests.set(featureName, loadFeatureManifest(featureName, featureNames, violations));
  }

  for (const featureName of featureNames) {
    const manifest = manifests.get(featureName)?.manifest ?? createEmptyManifest(featureName);
    for (const dependency of manifest.dependsOn) {
      const targetManifest = manifests.get(dependency.featureName)?.manifest;
      if (!targetManifest) {
        violations.push({
          category: "unknown-dependency-feature",
          featureName,
          filePath: manifests.get(featureName)?.manifestPath ?? "",
          relatedFeature: dependency.featureName,
          reason: `Declared dependency feature "${dependency.featureName}" is missing a readable manifest.`,
        });
        continue;
      }

      const targetSeamIds = new Set(targetManifest.publicSeams.map((seam) => seam.seamId));
      for (const seamId of dependency.seamIds) {
        if (!targetSeamIds.has(seamId)) {
          violations.push({
            category: "unknown-dependency-seam",
            featureName,
            filePath: manifests.get(featureName)?.manifestPath ?? "",
            relatedFeature: dependency.featureName,
            reason: `Declared dependency seam "${seamId}" is not exported by ${dependency.featureName}.`,
          });
        }
      }
    }
  }

  const imports: ImportReference[] = [];

  for (const featureName of featureNames) {
    const files = listFeatureSourceFiles(featureName);
    for (const file of files) {
      const contents = readFileSync(file, "utf8");
      for (const reference of collectModuleSpecifiers(contents)) {
        const resolvedPath = resolveImportPath(file, reference.specifier);
        const target = parseFeaturePath(resolvedPath);

        if (!target || target.featureName === featureName) {
          continue;
        }

        const visibility = isPublicFeatureSeam(target.featureName, target.repoPath)
          ? "public"
          : "private";

        const importReference: ImportReference = {
          sourceFile: relativeToRepo(file),
          sourceFeature: featureName,
          importPath: reference.specifier,
          line: reference.line,
          resolvedPath: resolvedPath ? target.repoPath : null,
          targetFeature: target.featureName,
          visibility,
        };

        imports.push(importReference);

        if (visibility === "private") {
          violations.push({
            category: "private-cross-feature-import",
            featureName,
            filePath: importReference.sourceFile,
            line: importReference.line,
            importPath: importReference.importPath,
            resolvedPath: importReference.resolvedPath,
            relatedFeature: importReference.targetFeature,
            reason: "Cross-feature imports must go through the target feature root index.ts seam.",
          });
        }
      }
    }
  }

  const dependencyMap = new Map<string, DependencySummary>();

  for (const reference of imports) {
    const sourceManifest = manifests.get(reference.sourceFeature)?.manifest ?? createEmptyManifest(reference.sourceFeature);
    const declaredDependency = sourceManifest.dependsOn.find(
      (dependency) => dependency.featureName === reference.targetFeature,
    );
    const key = `${reference.sourceFeature}->${reference.targetFeature}`;
    const existing = dependencyMap.get(key);

    if (existing) {
      existing.imports.push({
        sourceFile: reference.sourceFile,
        importPath: reference.importPath,
        line: reference.line,
        resolvedPath: reference.resolvedPath,
        visibility: reference.visibility,
      });
      if (reference.visibility === "public") {
        existing.publicImportCount += 1;
      } else {
        existing.privateImportCount += 1;
      }
      continue;
    }

    dependencyMap.set(key, {
      sourceFeature: reference.sourceFeature,
      targetFeature: reference.targetFeature,
      declaredInManifest: Boolean(declaredDependency),
      declaredSeamIds: declaredDependency?.seamIds ?? [],
      publicImportCount: reference.visibility === "public" ? 1 : 0,
      privateImportCount: reference.visibility === "private" ? 1 : 0,
      imports: [{
        sourceFile: reference.sourceFile,
        importPath: reference.importPath,
        line: reference.line,
        resolvedPath: reference.resolvedPath,
        visibility: reference.visibility,
      }],
    });
  }

  const dependencies = [...dependencyMap.values()]
    .map((dependency) => ({
      ...dependency,
      imports: dependency.imports.sort((left, right) =>
        left.sourceFile.localeCompare(right.sourceFile)
        || left.line - right.line
        || left.importPath.localeCompare(right.importPath),
      ),
    }))
    .sort((left, right) =>
      left.sourceFeature.localeCompare(right.sourceFeature)
      || left.targetFeature.localeCompare(right.targetFeature),
    );

  for (const dependency of dependencies) {
    if (!dependency.declaredInManifest) {
      violations.push({
        category: "undeclared-import-dependency",
        featureName: dependency.sourceFeature,
        filePath: manifests.get(dependency.sourceFeature)?.manifestPath ?? "",
        relatedFeature: dependency.targetFeature,
        reason: `Manifest for ${dependency.sourceFeature} does not declare its dependency on ${dependency.targetFeature}.`,
      });
    }
  }

  for (const featureName of featureNames) {
    const manifest = manifests.get(featureName)?.manifest ?? createEmptyManifest(featureName);
    const importedFeatures = new Set(
      dependencies
        .filter((dependency) => dependency.sourceFeature === featureName)
        .map((dependency) => dependency.targetFeature),
    );

    for (const dependency of manifest.dependsOn) {
      if (!importedFeatures.has(dependency.featureName)) {
        violations.push({
          category: "stale-declared-dependency",
          featureName,
          filePath: manifests.get(featureName)?.manifestPath ?? "",
          relatedFeature: dependency.featureName,
          reason: `Manifest declares a dependency on ${dependency.featureName}, but no current cross-feature imports were found.`,
        });
      }
    }
  }

  const reverseDependencies = new Map<string, Set<string>>();
  for (const dependency of dependencies) {
    if (!reverseDependencies.has(dependency.targetFeature)) {
      reverseDependencies.set(dependency.targetFeature, new Set());
    }
    reverseDependencies.get(dependency.targetFeature)?.add(dependency.sourceFeature);
  }

  const features: FeatureSummary[] = featureNames.map((featureName) => {
    const manifest = manifests.get(featureName)?.manifest ?? createEmptyManifest(featureName);
    const manifestPath = manifests.get(featureName)?.manifestPath ?? relativeToRepo(path.join(FEATURES_ROOT, featureName, FEATURE_MANIFEST_FILENAME));
    const featureDependencies = dependencies.filter((dependency) => dependency.sourceFeature === featureName);

    return {
      featureName,
      manifestPath,
      fileCount: listFeatureSourceFiles(featureName).length,
      publicSeams: manifest.publicSeams.map((seam) => ({
        seamId: seam.seamId,
        symbol: seam.symbol,
        kind: seam.kind,
        stability: seam.stability,
        path: seam.path,
      })),
      declaredDependencies: manifest.dependsOn.map((dependency) => dependency.featureName),
      publicDependencies: featureDependencies
        .filter((dependency) => dependency.publicImportCount > 0)
        .map((dependency) => dependency.targetFeature),
      privateDependencyCount: featureDependencies.reduce(
        (count, dependency) => count + dependency.privateImportCount,
        0,
      ),
      dependedOnBy: [...(reverseDependencies.get(featureName) ?? new Set())].sort((left, right) =>
        left.localeCompare(right),
      ),
      breakingChangeRisks: manifest.breakingChangeRisks,
    };
  });

  return {
    ruleVersion: 2,
    ruleSummary:
      "Cross-feature imports in src/features must go through target feature index.ts seams, and each feature manifest must declare current downstream dependencies and public seams.",
    featureCount: features.length,
    edgeCount: dependencies.length,
    violationCount: violations.length,
    features,
    dependencies,
    violations: violations.sort((left, right) =>
      left.featureName.localeCompare(right.featureName)
      || left.filePath.localeCompare(right.filePath)
      || (left.line ?? 0) - (right.line ?? 0)
      || (left.relatedFeature ?? "").localeCompare(right.relatedFeature ?? ""),
    ),
  };
}

function renderMarkdown(document: OutputDocument): string {
  const lines: string[] = [];
  lines.push("# Feature Dependency Graph");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- Features analyzed: ${document.featureCount}`);
  lines.push(`- Cross-feature edges: ${document.edgeCount}`);
  lines.push(`- Validation violations: ${document.violationCount}`);
  lines.push("");
  lines.push(`Rule: ${document.ruleSummary}`);
  lines.push("");
  lines.push("## By Feature");
  lines.push("");

  for (const feature of document.features) {
    lines.push(`### ${feature.featureName}`);
    lines.push("");
    lines.push(`- Manifest: \`${feature.manifestPath}\``);
    lines.push(`- Source files: ${feature.fileCount}`);
    lines.push(
      `- Declared dependencies: ${feature.declaredDependencies.length > 0 ? feature.declaredDependencies.join(", ") : "none"}`,
    );
    lines.push(
      `- Current public dependencies: ${feature.publicDependencies.length > 0 ? feature.publicDependencies.join(", ") : "none"}`,
    );
    lines.push(`- Private seam violations: ${feature.privateDependencyCount}`);
    lines.push(
      `- Depended on by: ${feature.dependedOnBy.length > 0 ? feature.dependedOnBy.join(", ") : "none"}`,
    );
    lines.push("- Public seams:");
    for (const seam of feature.publicSeams) {
      lines.push(
        `  - \`${seam.seamId}\` via \`${seam.symbol}\` in \`${seam.path}\` (${seam.kind}, ${seam.stability})`,
      );
    }
    lines.push("- Breaking-change risks:");
    for (const risk of feature.breakingChangeRisks) {
      lines.push(`  - ${risk}`);
    }
    lines.push("");
  }

  lines.push("## Dependency Edges");
  lines.push("");

  for (const dependency of document.dependencies) {
    lines.push(`### ${dependency.sourceFeature} -> ${dependency.targetFeature}`);
    lines.push("");
    lines.push(`- Declared in manifest: ${dependency.declaredInManifest ? "yes" : "no"}`);
    lines.push(
      `- Declared seam ids: ${dependency.declaredSeamIds.length > 0 ? dependency.declaredSeamIds.join(", ") : "none"}`,
    );
    lines.push(`- Public imports: ${dependency.publicImportCount}`);
    lines.push(`- Private imports: ${dependency.privateImportCount}`);
    lines.push("");
    for (const reference of dependency.imports) {
      lines.push(
        `- \`${reference.sourceFile}:${reference.line}\` imports \`${reference.importPath}\` -> \`${reference.resolvedPath ?? "unresolved"}\` (${reference.visibility})`,
      );
    }
    lines.push("");
  }

  lines.push("## Violations");
  lines.push("");

  if (document.violations.length === 0) {
    lines.push("- None.");
    lines.push("");
    return `${lines.join("\n")}\n`;
  }

  for (const violation of document.violations) {
    const location = violation.line ? `${violation.filePath}:${violation.line}` : violation.filePath;
    const relation = violation.relatedFeature ? ` [related: ${violation.relatedFeature}]` : "";
    lines.push(`- \`${location}\` (${violation.category})${relation}: ${violation.reason}`);
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function ensureGeneratedOutputs(
  document: OutputDocument,
  options: { checkOnly: boolean; writeFiles: boolean },
): string[] {
  const updates: string[] = [];
  const json = `${JSON.stringify(document, null, 2)}\n`;
  const markdown = renderMarkdown(document);

  const outputs = [
    { filePath: JSON_OUTPUT, contents: json },
    { filePath: MARKDOWN_OUTPUT, contents: markdown },
  ];

  for (const output of outputs) {
    const current = existsSync(output.filePath) ? readFileSync(output.filePath, "utf8") : null;
    if (current === output.contents) {
      continue;
    }

    updates.push(relativeToRepo(output.filePath));

    if (options.writeFiles) {
      mkdirSync(path.dirname(output.filePath), { recursive: true });
      writeFileSync(output.filePath, output.contents, "utf8");
    }
  }

  return updates;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const checkOnly = args.has("--check");
  const writeFiles = args.has("--write");

  const featureNames = listFeatureNames();
  const document = buildGraph(featureNames);
  const updatedOutputs = ensureGeneratedOutputs(document, { checkOnly, writeFiles });

  console.log("Feature dependency graph:");
  console.log(`- features: ${document.featureCount}`);
  console.log(`- cross-feature edges: ${document.edgeCount}`);
  console.log(`- validation violations: ${document.violationCount}`);

  if (updatedOutputs.length > 0) {
    console.log("- generated outputs changed:");
    for (const updatedOutput of updatedOutputs) {
      console.log(`  - ${updatedOutput}`);
    }
  } else {
    console.log("- generated outputs are up to date.");
  }

  if (document.violations.length > 0) {
    console.error("");
    console.error("Validation violations:");
    for (const violation of document.violations) {
      const location = violation.line ? `${violation.filePath}:${violation.line}` : violation.filePath;
      console.error(`- ${location} (${violation.category}): ${violation.reason}`);
    }
  }

  if (checkOnly && updatedOutputs.length > 0 && !writeFiles) {
    console.error("");
    console.error("Run the generator to refresh the feature dependency graph artifacts.");
  }

  if (document.violations.length > 0 || (checkOnly && updatedOutputs.length > 0 && !writeFiles)) {
    process.exitCode = 1;
  }
}

main();
