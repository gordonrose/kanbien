import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../../src/app";

const registrySource = readFileSync(
  resolve(process.cwd(), "src/frontend/designSystem/registry/designSystems.mjs"),
  "utf8",
);

function registryBlock(systemKey: string): string {
  const match = registrySource.match(new RegExp(`\\n  ${systemKey}: \\{[\\s\\S]*?\\n  \\},`));
  expect(match, `${systemKey} registry block must exist`).toBeTruthy();
  return match?.[0] ?? "";
}

async function importRepoModule(path: string): Promise<Record<string, unknown>> {
  return import(pathToFileURL(resolve(process.cwd(), path)).href) as Promise<Record<string, unknown>>;
}

describe("design-system system isolation guard", () => {
  it("keeps registered system loaders scoped to their own implementation folders", () => {
    const defaultBlock = registryBlock("default");
    const brochureBlock = registryBlock("brochure");

    expect(defaultBlock).toContain('../systems/default/');
    expect(defaultBlock).not.toContain('../systems/brochure/');
    expect(defaultBlock).not.toContain('/brochure/');

    expect(brochureBlock).toContain('../systems/brochure/');
    expect(brochureBlock).not.toContain('../systems/default/');
    expect(brochureBlock).not.toContain('/default/');
  });

  it("keeps default routes free of brochure assets and public-site literals", async () => {
    const app = createApp();
    const defaultRoot = await request(app).get("/design-system/default/").set("host", "admin.example.test");
    const defaultBackground = await request(app)
      .get("/design-system/default/tokens/background-color")
      .set("host", "admin.example.test");

    for (const response of [defaultRoot, defaultBackground]) {
      expect(response.status).toBe(200);
      expect(response.text).toContain("/design-system/assets/styles.css");
      expect(response.text).not.toContain("/design-system/systems/brochure/");
      expect(response.text).not.toContain("public-site.css");
      expect(response.text).not.toContain("public-site-body");
      expect(response.text).not.toContain("Brochure design-system variant");
    }
  });

  it("serves brochure routes from brochure assets without changing default routes", async () => {
    const app = createApp();
    const brochureRoot = await request(app).get("/design-system/brochure/").set("host", "admin.example.test");
    const brochureBackground = await request(app)
      .get("/design-system/brochure/tokens/background-color")
      .set("host", "admin.example.test");

    expect(brochureRoot.status).toBe(200);
    expect(brochureRoot.text).toContain("Brochure design-system variant");
    expect(brochureRoot.text).not.toContain("/design-system/systems/default/assets/styles.css");

    expect(brochureBackground.status).toBe(200);
    expect(brochureBackground.text).toContain("Brochure background color");
    expect(brochureBackground.text).not.toContain("/design-system/systems/default/assets/styles.css");
  });

  it("keeps brochure token proof styling on the shared token renderer instead of public-site CSS", async () => {
    const app = createApp();
    const brochureTokenStyles = await request(app)
      .get("/design-system/systems/brochure/assets/styles.css")
      .set("host", "admin.example.test");
    const sharedTokenStyles = await request(app).get("/design-system/assets/token-spec.css").set("host", "admin.example.test");

    expect(brochureTokenStyles.status).toBe(200);
    expect(brochureTokenStyles.text).toContain('/design-system/assets/token-spec.css');
    expect(brochureTokenStyles.text).not.toContain("public-site.css");
    expect(brochureTokenStyles.text).not.toContain(".public-site-body");

    expect(sharedTokenStyles.status).toBe(200);
    expect(sharedTokenStyles.text).toContain(".token-spec-page");
    expect(sharedTokenStyles.text).toContain('data-token-preview-ornament-id="visual-proof-grid-lines"');
    expect(sharedTokenStyles.text).toContain('data-token-preview-ornament-id="visual-proof-marker"');
  });

  it("keeps visual proof ornament previews role-specific instead of reusing one generic sample", async () => {
    const rendererSource = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs"),
      "utf8",
    );
    const brochureVisualOrnament = await importRepoModule(
      "src/frontend/designSystem/systems/brochure/tokens/proofs/visualProofOrnament.tokens.mjs",
    );

    const variants = (
      brochureVisualOrnament.visualProofOrnamentTokenSpec as {
        variants: Array<{ id: string; preview: { ornamentId?: string } }>;
      }
    ).variants;

    expect(rendererSource).toContain("data-token-preview-ornament-id");
    expect(variants.map((variant) => variant.preview.ornamentId)).toEqual(variants.map((variant) => variant.id));
    expect(new Set(variants.map((variant) => variant.preview.ornamentId)).size).toBe(variants.length);
  });

  it("keeps shared token contracts free of brochure-specific literals", () => {
    const sharedTokenContractPaths = [
      "docs/design-system/02-token/shared/background-color/BackgroundColor-Contract.md",
      "docs/design-system/02-token/shared/button-frame/ButtonFrame-Contract.md",
      "docs/design-system/02-token/shared/content-width/ContentWidth-Contract.md",
      "docs/design-system/02-token/shared/focus-ring/FocusRing-Contract.md",
      "docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md",
      "docs/design-system/02-token/shared/list-marker-style/ListMarkerStyle-Contract.md",
      "docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md",
      "docs/design-system/02-token/shared/panel-corner-radius/PanelCornerRadius-Contract.md",
      "docs/design-system/02-token/shared/pipeline-showcase-frame/PipelineShowcaseFrame-Contract.md",
      "docs/design-system/02-token/shared/primary-color-source/PrimaryColorSource-Contract.md",
      "docs/design-system/02-token/shared/primary-tinted-background/PrimaryTintedBackground-Contract.md",
      "docs/design-system/02-token/shared/primary-tinted-foreground/PrimaryTintedForeground-Contract.md",
      "docs/design-system/02-token/shared/spacing-scale/SpacingScale-Contract.md",
      "docs/design-system/02-token/shared/supporting-text-style/SupportingTextStyle-Contract.md",
      "docs/design-system/02-token/shared/surface-frame/SurfaceFrame-Contract.md",
      "docs/design-system/02-token/shared/typography-scale/TypographyScale-Contract.md",
      "docs/design-system/02-token/shared/visual-proof-ornament/VisualProofOrnament-Contract.md",
      "src/frontend/designSystem/layers/02-token/background-color/contract.mjs",
      "src/frontend/designSystem/layers/02-token/button-frame/contract.mjs",
      "src/frontend/designSystem/layers/02-token/content-width/contract.mjs",
      "src/frontend/designSystem/layers/02-token/focus-ring/contract.mjs",
      "src/frontend/designSystem/layers/02-token/label-text-style/contract.mjs",
      "src/frontend/designSystem/layers/02-token/list-marker-style/contract.mjs",
      "src/frontend/designSystem/layers/02-token/minimum-target-size/contract.mjs",
      "src/frontend/designSystem/layers/02-token/panel-corner-radius/contract.mjs",
      "src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/contract.mjs",
      "src/frontend/designSystem/layers/02-token/primary-color-source/contract.mjs",
      "src/frontend/designSystem/layers/02-token/primary-tinted-background/contract.mjs",
      "src/frontend/designSystem/layers/02-token/primary-tinted-foreground/contract.mjs",
      "src/frontend/designSystem/layers/02-token/spacing-scale/contract.mjs",
      "src/frontend/designSystem/layers/02-token/supporting-text-style/contract.mjs",
      "src/frontend/designSystem/layers/02-token/surface-frame/contract.mjs",
      "src/frontend/designSystem/layers/02-token/typography-scale/contract.mjs",
      "src/frontend/designSystem/layers/02-token/visual-proof-ornament/contract.mjs",
    ];

    for (const path of sharedTokenContractPaths) {
      const source = readFileSync(resolve(process.cwd(), path), "utf8");

      expect(source, path).not.toContain("public-site");
      expect(source, path).not.toContain("Brochure");
      expect(source, path).not.toContain("brochure");
      expect(source, path).not.toContain("#f6f8f3");
      expect(source, path).not.toContain("#fffdf8");
      expect(source, path).not.toContain("#fbf2df");
    }
  });

  it("keeps default and brochure token implementation values separated", async () => {
    const defaultPrimary = await importRepoModule(
      "src/frontend/designSystem/systems/default/tokens/proofs/primaryColorSource.tokens.mjs",
    );
    const brochurePrimary = await importRepoModule(
      "src/frontend/designSystem/systems/brochure/tokens/proofs/primaryColorSource.tokens.mjs",
    );
    const defaultBackground = await importRepoModule(
      "src/frontend/designSystem/systems/default/tokens/proofs/backgroundColor.tokens.mjs",
    );
    const brochureBackground = await importRepoModule(
      "src/frontend/designSystem/systems/brochure/tokens/proofs/backgroundColor.tokens.mjs",
    );

    expect((defaultPrimary.primaryColorSourceTokenSpec as { variants: Array<{ colorValue: string }> }).variants[0].colorValue).toBe(
      "#635bff",
    );
    expect((brochurePrimary.primaryColorSourceTokenSpec as { variants: Array<{ colorValue: string }> }).variants[0].colorValue).toBe(
      "#1f6f78",
    );
    expect((brochurePrimary.primaryColorSourceTokenSpec as { variants: Array<{ colorValue: string }> }).variants[0].colorValue).not.toBe(
      (defaultPrimary.primaryColorSourceTokenSpec as { variants: Array<{ colorValue: string }> }).variants[0].colorValue,
    );
    expect((defaultBackground.backgroundColorTokenSpec as { variants: Array<{ tokenValue: string }> }).variants[0].tokenValue).toBe(
      "#ffffff",
    );
    expect((brochureBackground.backgroundColorTokenSpec as { variants: Array<{ tokenValue: string }> }).variants[0].tokenValue).toBe(
      "#f6f8f3",
    );
  });
});
