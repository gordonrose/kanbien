import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const assetRoot = resolve(process.cwd(), "src/frontend/designSystem/assets");

function readAsset(path: string) {
  return readFileSync(resolve(assetRoot, path), "utf8");
}

const dedicatedRenderAssets = [
  "simpleSelectCanonical.mjs",
  "choiceGroupCanonical.mjs",
  "datePickerCanonical.mjs",
  "drawerSelectCanonical.mjs",
  "timePickerCanonical.mjs",
  "iconGridCanonical.mjs",
  "uploadFileCanonical.mjs",
  "listRecordCardCanonical.mjs",
  "listDetailPanelCanonical.mjs",
  "listDetailSplitLayoutCanonical.mjs",
  "pageShellBannerCanonical.mjs",
];

describe("design-system canonical theme scope audit", () => {
  it("prevents dedicated render controllers from theming the whole render layout", () => {
    for (const asset of dedicatedRenderAssets) {
      const source = readAsset(asset);
      expect(source, `${asset} should not assign theme scope to the full canonical render layout`).not.toMatch(
        /\brenderLayout\.dataset\.themeScope\s*=/,
      );
      expect(source, `${asset} should not assign theme scope to the full canonical render layout`).not.toMatch(
        /\blayout\.dataset\.themeScope\s*=/,
      );
    }
  });

  it("pins dedicated render theme scope to the local preview shell or frame", () => {
    expect(readAsset("pageShellBannerCanonical.mjs")).toContain("previewShell.dataset.themeScope = theme;");

    for (const asset of dedicatedRenderAssets.filter((name) => name !== "pageShellBannerCanonical.mjs")) {
      const source = readAsset(asset);
      expect(source, `${asset} should assign local theme scope to the preview frame`).toContain(
        "previewFrame.dataset.themeScope = theme;",
      );
    }
  });

  it("prevents the shared navigation canonical controller from theming page-level render layouts", () => {
    const source = readAsset("app.mjs");

    expect(source).toContain("function clearCanonicalRenderLayoutAppearanceScopes()");
    expect(source).toContain('topNavCanonicalRenderLayout?.removeAttribute("data-theme-scope");');
    expect(source).toContain('subNavCanonicalRenderLayout?.removeAttribute("data-theme-scope");');
    expect(source).toContain('contextNavCanonicalRenderLayout?.removeAttribute("data-theme-scope");');
    expect(source).not.toContain('topNavCanonicalRenderLayout?.setAttribute("data-theme-scope"');
    expect(source).not.toContain('subNavCanonicalRenderLayout?.setAttribute("data-theme-scope"');
    expect(source).not.toContain('contextNavCanonicalRenderLayout?.setAttribute("data-theme-scope"');
  });

  it("keeps canonical-render-page template theme controls scoped to the specimen lane", () => {
    const source = readAsset("canonicalRenderPageTemplate.mjs");

    expect(source).toContain("previewShell.dataset.themeScope = renderState.theme;");
    expect(source).not.toMatch(/\bpreviewFrame\.dataset\.themeScope\s*=/);
    expect(source).not.toMatch(/\b(document\.documentElement|document\.body)\.dataset\.theme/);
  });
});
