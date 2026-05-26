import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const governedLayerRoot = resolve(process.cwd(), "src/frontend/designSystem/layers");
const tokenLayerRoot = join(governedLayerRoot, "02-token");
const primitiveLayerRoot = join(governedLayerRoot, "03-primitive");
const patternLayerRoot = join(governedLayerRoot, "04-pattern-contract");
const systemRoot = resolve(process.cwd(), "src/frontend/designSystem/systems");
const legacyContractRoot = resolve(process.cwd(), "src/frontend/designSystem/contracts");
const designSystemTopologyReadme = resolve(process.cwd(), "src/frontend/designSystem/README.md");
const frontEndSkillRoot = resolve(process.cwd(), ".codex/skills/41-front-end");

function collectFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectFiles(path);
    }

    return entry.isFile() && /\.(mjs|js|ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

function extractImportSpecifiers(source: string): string[] {
  return Array.from(
    source.matchAll(/\b(?:import|export)\s+(?:[^'"]*?\s+from\s+)?["']([^"']+)["']/g),
    (match) => match[1],
  );
}

function resolvedRelativeImports(file: string) {
  const source = readFileSync(file, "utf8");

  return extractImportSpecifiers(source)
    .filter((specifier) => specifier.startsWith("."))
    .map((specifier) => ({
      specifier,
      resolvedPath: resolve(dirname(file), specifier),
    }));
}

function isInside(childPath: string, parentPath: string) {
  const relativePath = relative(parentPath, childPath);
  return relativePath.length > 0 && !relativePath.startsWith("..");
}

describe("governed design-system layer import guard", () => {
  it("keeps Layer 3 primitives from importing directly from system proof areas", () => {
    const violations = collectFiles(primitiveLayerRoot).flatMap((file) => {
      return resolvedRelativeImports(file)
        .filter(({ resolvedPath }) => isInside(resolvedPath, systemRoot))
        .map(({ specifier }) => `${relative(process.cwd(), file)} imports ${specifier}`);
    });

    expect(violations).toEqual([]);
  });

  it("keeps Layer 2 token system facades scoped to their own proof modules", () => {
    const violations = collectFiles(tokenLayerRoot).flatMap((file) => {
      if (!/\/systems\/[^/]+\.mjs$/.test(file)) {
        return [];
      }

      const systemKey = file.match(/\/systems\/([^/]+)\.mjs$/)?.[1];
      const allowedProofRoot = join(systemRoot, systemKey ?? "", "tokens", "proofs");

      return resolvedRelativeImports(file)
        .filter(({ resolvedPath }) => isInside(resolvedPath, systemRoot))
        .filter(({ resolvedPath }) => !isInside(resolvedPath, allowedProofRoot))
        .map(({ specifier }) => `${relative(process.cwd(), file)} imports ${specifier}`);
    });

    expect(violations).toEqual([]);
  });

  it("keeps the retired top-level design-system contract folder from coming back", () => {
    expect(existsSync(legacyContractRoot)).toBe(false);
  });

  it("documents governed and legacy design-system source areas", () => {
    const readme = readFileSync(designSystemTopologyReadme, "utf8");

    for (const governedFolder of ["layers/", "systems/", "shared/", "registry/"]) {
      expect(readme).toContain(governedFolder);
    }

    for (const legacyFolder of [
      "assets/",
      "tokens/",
      "patterns/",
      "components/",
      "templates/",
      "canonicals/",
      "canonical-renderings/",
      "exploration/",
    ]) {
      expect(readme).toContain(legacyFolder);
    }

    expect(readme).toContain("legacy or pre-governed inventory");
    expect(readme.replace(/\s+/g, " ")).toContain("New governed work must use the numbered layer structure");
  });

  it("keeps Layer 4 pattern-contract harness files present before pattern work", () => {
    const requiredPaths = [
      join(frontEndSkillRoot, "04-pattern-contract", "SKILL.md"),
      join(frontEndSkillRoot, "04-pattern-contract", "TEMPLATE.md"),
      join(frontEndSkillRoot, "04-pattern-contract", "EVAL.md"),
      join(frontEndSkillRoot, "04-pattern-contract", "ACCESSIBILITY-EVAL.md"),
      resolve(process.cwd(), "docs/design-system/04-pattern-contract/pattern-readiness-index.md"),
      patternLayerRoot,
      resolve(process.cwd(), "src/frontend/designSystem/systems/default/patterns"),
    ];

    for (const requiredPath of requiredPaths) {
      expect(existsSync(requiredPath), `${requiredPath} must exist`).toBe(true);
    }
  });
});
