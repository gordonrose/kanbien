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
});
