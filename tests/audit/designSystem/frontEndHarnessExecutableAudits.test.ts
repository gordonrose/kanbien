import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const frontEndSkillRoot = resolve(repoRoot, ".codex/skills/41-front-end");
const governedLayerRoot = resolve(repoRoot, "src/frontend/designSystem/layers");
const tokenLayerRoot = join(governedLayerRoot, "02-token");
const primitiveLayerRoot = join(governedLayerRoot, "03-primitive");
const patternLayerRoot = join(governedLayerRoot, "04-pattern-contract");
const systemRoot = resolve(repoRoot, "src/frontend/designSystem/systems");
const defaultSystemRoot = join(systemRoot, "default");
const defaultSystemStyles = join(defaultSystemRoot, "assets", "styles.css");
const visualDesignSystemRoot = resolve(repoRoot, "tests/visual/designSystem");

function collectFiles(dir: string, predicate: (path: string) => boolean): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      return collectFiles(path, predicate);
    }

    return entry.isFile() && predicate(path) ? [path] : [];
  });
}

function readRepoFile(path: string) {
  return readFileSync(path, "utf8");
}

function extractImportSpecifiers(source: string): string[] {
  return Array.from(
    source.matchAll(/\b(?:import|export)\s+(?:[^'"]*?\s+from\s+)?["']([^"']+)["']/g),
    (match) => match[1],
  );
}

function resolvedRelativeImports(file: string) {
  const source = readRepoFile(file);

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

function routeFamilyForProofPage(file: string) {
  const relativePath = relative(defaultSystemRoot, dirname(file));
  const segments = relativePath.split("/");
  if (segments.length < 2) {
    return null;
  }
  return {
    proofKind: segments[0],
    family: segments[1],
  };
}

function cssBlocks(source: string) {
  return Array.from(source.matchAll(/([^{}]+)\{([^{}]*)\}/g), (match) => ({
    selector: match[1].trim(),
    body: match[2].trim(),
  }));
}

function declarationsForBlock(body: string) {
  return body
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(":");
      return separator === -1
        ? null
        : {
            property: declaration.slice(0, separator).trim(),
            value: declaration.slice(separator + 1).trim(),
          };
    })
    .filter((declaration): declaration is { property: string; value: string } => declaration !== null);
}

function isGovernedRuntimeSelector(selector: string) {
  return selector
    .split(",")
    .map((part) => part.trim())
    .some((part) => /^\.ds-(?:index-nav|truncating-label)(?:\b|[-_:.[#])/.test(part));
}

describe("41 front-end executable audit categories", () => {
  it("requires source-material decision ledgers before governed layer implementation", () => {
    const requiredSections = [
      {
        file: join(frontEndSkillRoot, "01-behavior-rule", "TEMPLATE.md"),
        snippets: ["## Source Decomposition", "Observed Source Decision", "Owning Layer", "Missing Seam Or Blocker"],
      },
      {
        file: join(frontEndSkillRoot, "02-token", "TEMPLATE.md"),
        snippets: ["## Preflight Decision Ledger", "Observed Decision", "Token Action"],
      },
      {
        file: join(frontEndSkillRoot, "03-primitive", "TEMPLATE.md"),
        snippets: ["## Preflight Decision Ledger", "Observed Decision", "Primitive Action"],
      },
      {
        file: join(frontEndSkillRoot, "04-pattern-contract", "TEMPLATE.md"),
        snippets: ["## Preflight Decision Ledger", "Observed Decision", "Pattern Action"],
      },
      {
        file: join(frontEndSkillRoot, "00-orchestrator", "EVAL.md"),
        snippets: ["layer-work-preflight.md", "decision ledger", "source-material-derived"],
      },
    ];

    const violations = requiredSections.flatMap(({ file, snippets }) => {
      const source = readRepoFile(file);
      return snippets
        .filter((snippet) => !source.includes(snippet))
        .map((snippet) => `${relative(repoRoot, file)} is missing ${snippet}`);
    });

    expect(violations).toEqual([]);
  });

  it("keeps rendered proof controls paired with visual browser evidence", () => {
    const proofPages = collectFiles(defaultSystemRoot, (path) => /\/(tokens|primitives|patterns)\/[^/]+\/page\.mjs$/.test(path));
    const visualTests = collectFiles(visualDesignSystemRoot, (path) => /\.spec\.ts$/.test(path)).map((file) => ({
      file,
      source: readRepoFile(file),
    }));

    const violations = proofPages.flatMap((file) => {
      const source = readRepoFile(file);
      const controlAttributes = Array.from(
        source.matchAll(/querySelector\(["']\[(data-[a-z0-9-]+-control)\]["']\)/g),
        (match) => match[1],
      );
      if (controlAttributes.length === 0) {
        return [];
      }

      const routeFamily = routeFamilyForProofPage(file);
      const matchingTests = visualTests.filter(({ file: testFile, source: testSource }) => {
        const relativeTest = relative(visualDesignSystemRoot, testFile);
        return routeFamily
          ? relativeTest.includes(`${routeFamily.proofKind}/`) && relativeTest.toLowerCase().includes(routeFamily.family.replace(/-/g, "").toLowerCase().slice(0, 10))
          : testSource.includes(relative(defaultSystemRoot, dirname(file)));
      });
      const matchingSource = matchingTests.map(({ source }) => source).join("\n");

      return Array.from(new Set(controlAttributes))
        .filter((attribute) => !matchingSource.includes(attribute))
        .map((attribute) => `${relative(repoRoot, file)} exposes ${attribute} without matching visual test evidence`);
    });

    expect(violations).toEqual([]);
  });

  it("keeps governed layer imports on layer seams instead of system proof internals", () => {
    const layerFiles = collectFiles(governedLayerRoot, (path) => /\.(mjs|js|ts|tsx)$/.test(path));

    const violations = layerFiles.flatMap((file) => {
      if (isInside(file, tokenLayerRoot) && /\/systems\/[^/]+\.mjs$/.test(file)) {
        return [];
      }

      return resolvedRelativeImports(file)
        .filter(({ resolvedPath }) => isInside(resolvedPath, systemRoot))
        .map(({ specifier }) => `${relative(repoRoot, file)} imports system proof/internal module ${specifier}`);
    });

    expect(violations).toEqual([]);
  });

  it("keeps Layer 4 pattern runtime seams from rendering local interactive controls", () => {
    const patternFiles = collectFiles(patternLayerRoot, (path) => /\/index\.mjs$/.test(path));
    const interactiveMarkup = /<\s*(button|input|select|textarea|summary)\b|role=["'](?:button|checkbox|radio|switch|tab|menuitem)["']/;

    const violations = patternFiles.flatMap((file) => {
      const source = readRepoFile(file);
      return interactiveMarkup.test(source) ? [`${relative(repoRoot, file)} renders local interactive markup`] : [];
    });

    expect(violations).toEqual([]);
  });

  it("keeps governed runtime CSS color and scrollbar values on token or browser-native provenance", () => {
    const styles = readRepoFile(defaultSystemStyles);
    const literalColorValue = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\bcolor-mix\(/;

    const violations = cssBlocks(styles)
      .filter(({ selector }) => isGovernedRuntimeSelector(selector))
      .flatMap(({ selector, body }) => {
        return declarationsForBlock(body).flatMap(({ property, value }) => {
          if (property.startsWith("scrollbar-") && value !== "auto" && !value.includes("var(")) {
            return [`${selector} sets ${property}: ${value}`];
          }

          if (literalColorValue.test(value)) {
            return [`${selector} sets ${property}: ${value}`];
          }

          return [];
        });
      });

    expect(violations).toEqual([]);
  });

  it("keeps governed runtime CSS radius values on primitive or pattern provenance", () => {
    const styles = readRepoFile(defaultSystemStyles);

    const violations = cssBlocks(styles)
      .filter(({ selector }) => selector.includes(".ds-"))
      .flatMap(({ selector, body }) => {
        return declarationsForBlock(body)
          .filter(({ property }) => property === "border-radius")
          .filter(({ value }) => !/\bvar\(--(?:primitive|pattern)-/.test(value))
          .map(({ value }) => `${selector} sets border-radius without primitive or pattern provenance: ${value}`);
      });

    expect(violations).toEqual([]);
  });
});
