import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

type TokenVariant = {
  id: string;
  preview?: {
    kind?: string;
  };
};

type TokenSpec = {
  tokenType: string;
  tokenTypeTemplate?: {
    previewKind?: string;
  };
  variants?: TokenVariant[];
  summaryPanels?: Array<{
    variantId?: string;
  }>;
};

type StructuralPreviewGuard = {
  label: string;
  modulePath: string;
  exportName: string;
  tokenType: string;
  expectedPreviewKind: string;
  expectedPreviewClass: string;
  visualSpecPath: string;
};

const structuralPreviewGuards: StructuralPreviewGuard[] = [
  {
    label: "standard page shell frame",
    modulePath: "src/frontend/designSystem/systems/default/tokens/proofs/standardPageShellFrame.tokens.mjs",
    exportName: "standardPageShellFrameTokenSpec",
    tokenType: "standard-page-shell-frame",
    expectedPreviewKind: "standard-page-shell-frame-sample",
    expectedPreviewClass: ".token-spec-shell-frame-preview",
    visualSpecPath: "tests/visual/designSystem/tokens/standardPageShellFrameTokenRoute.spec.ts",
  },
  {
    label: "context navigation frame",
    modulePath: "src/frontend/designSystem/systems/default/tokens/proofs/contextNavigationFrame.tokens.mjs",
    exportName: "contextNavigationFrameTokenSpec",
    tokenType: "context-navigation-frame",
    expectedPreviewKind: "context-navigation-frame-sample",
    expectedPreviewClass: ".token-spec-context-nav-frame-preview",
    visualSpecPath: "tests/visual/designSystem/tokens/contextNavigationFrameTokenRoute.spec.ts",
  },
  {
    label: "tools navigation frame",
    modulePath: "src/frontend/designSystem/systems/default/tokens/proofs/toolsNavigationFrame.tokens.mjs",
    exportName: "toolsNavigationFrameTokenSpec",
    tokenType: "tools-navigation-frame",
    expectedPreviewKind: "tools-navigation-frame-sample",
    expectedPreviewClass: ".token-spec-tools-nav-frame-preview",
    visualSpecPath: "tests/visual/designSystem/tokens/toolsNavigationFrameTokenRoute.spec.ts",
  },
];

const forbiddenGenericPreviewKinds = new Set(["surface-card", "page-preview", "frame", "text-sample"]);

function repoPath(path: string): string {
  return resolve(process.cwd(), path);
}

async function importRepoModule(path: string): Promise<Record<string, unknown>> {
  return import(pathToFileURL(repoPath(path)).href) as Promise<Record<string, unknown>>;
}

function readRepoText(path: string): string {
  const absolutePath = repoPath(path);
  expect(existsSync(absolutePath), `${path} must exist`).toBe(true);
  return readFileSync(absolutePath, "utf8");
}

describe("design-system structural token preview guard", () => {
  it("requires shell and navigation frame tokens to use dedicated rendered previews", async () => {
    const rendererSource = readRepoText("src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs");

    for (const guard of structuralPreviewGuards) {
      const moduleExports = await importRepoModule(guard.modulePath);
      const tokenSpec = moduleExports[guard.exportName] as TokenSpec | undefined;

      expect(tokenSpec, `${guard.label} must export ${guard.exportName}`).toBeDefined();
      expect(tokenSpec?.tokenType, `${guard.label} token type`).toBe(guard.tokenType);
      expect(
        tokenSpec?.tokenTypeTemplate?.previewKind,
        `${guard.label} must not advertise a generic token preview template`,
      ).toBe(guard.expectedPreviewKind);
      expect(
        forbiddenGenericPreviewKinds.has(tokenSpec?.tokenTypeTemplate?.previewKind ?? ""),
        `${guard.label} template preview must be structural, not generic`,
      ).toBe(false);

      for (const variant of tokenSpec?.variants ?? []) {
        expect(variant.preview?.kind, `${guard.label} variant ${variant.id} preview kind`).toBe(guard.expectedPreviewKind);
        expect(
          forbiddenGenericPreviewKinds.has(variant.preview?.kind ?? ""),
          `${guard.label} variant ${variant.id} preview must be structural, not generic`,
        ).toBe(false);
      }

      for (const panel of tokenSpec?.summaryPanels ?? []) {
        const panelVariant = tokenSpec?.variants?.find((variant) => variant.id === panel.variantId);
        expect(panelVariant, `${guard.label} summary panel must target an existing variant`).toBeDefined();
        expect(panelVariant?.preview?.kind, `${guard.label} summary panel must render the structural preview`).toBe(
          guard.expectedPreviewKind,
        );
      }

      expect(rendererSource, `${guard.label} renderer must branch on ${guard.expectedPreviewKind}`).toContain(
        `variant.preview.kind === "${guard.expectedPreviewKind}"`,
      );
      expect(rendererSource, `${guard.label} renderer must output ${guard.expectedPreviewClass}`).toContain(
        guard.expectedPreviewClass.slice(1),
      );

      const visualSpecSource = readRepoText(guard.visualSpecPath);
      expect(visualSpecSource, `${guard.label} visual spec must assert the structural preview class`).toContain(
        guard.expectedPreviewClass,
      );
    }
  });
});
