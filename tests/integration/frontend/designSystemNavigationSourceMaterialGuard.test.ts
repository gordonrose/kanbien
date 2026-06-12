import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveDefaultGlyphPath } from "../../../src/frontend/designSystem/systems/default/glyphs/registry.mjs";

const sourcePath = "src/frontend/designSystem/assets/app.mjs";
const source = readFileSync(sourcePath, "utf8");
const shellNavigationSharedSeams = [
  "src/frontend/designSystem/layers/03-primitive/breadcrumb-trail-control/index.mjs",
  "src/frontend/designSystem/layers/03-primitive/context-navigation-bottom-bar/index.mjs",
  "src/frontend/designSystem/layers/03-primitive/context-navigation-item-control/index.mjs",
  "src/frontend/designSystem/layers/03-primitive/context-navigation-overflow-menu/index.mjs",
  "src/frontend/designSystem/layers/03-primitive/search-shell-control/index.mjs",
  "src/frontend/designSystem/layers/03-primitive/tools-navigation-item-control/index.mjs",
  "src/frontend/designSystem/layers/03-primitive/top-navigation-brand-control/index.mjs",
  "src/frontend/designSystem/layers/03-primitive/top-navigation-link-control/index.mjs",
  "src/frontend/designSystem/layers/03-primitive/top-navigation-trigger-control/index.mjs",
  "src/frontend/designSystem/layers/04-pattern-contract/context-navigation/index.mjs",
  "src/frontend/designSystem/layers/04-pattern-contract/standard-page-shell/index.mjs",
  "src/frontend/designSystem/layers/04-pattern-contract/sub-navigation/index.mjs",
  "src/frontend/designSystem/layers/04-pattern-contract/tools-navigation/index.mjs",
  "src/frontend/designSystem/layers/04-pattern-contract/top-navigation/index.mjs",
];

function sourceIconPath(iconKey: string): string {
  const pattern = new RegExp(
    `key: "${iconKey}",[\\s\\S]*?markup: '<path d="([^"]+)" />'`,
  );
  const match = source.match(pattern);
  if (!match?.[1]) {
    throw new Error(`Missing source design-system icon path for "${iconKey}" in ${sourcePath}.`);
  }
  return match[1];
}

describe("design-system navigation source material guard", () => {
  it("keeps shared shell-navigation seams routed through the token spec resolver", () => {
    for (const seamPath of shellNavigationSharedSeams) {
      const seamSource = readFileSync(seamPath, "utf8");

      expect(seamSource, seamPath).not.toMatch(/^import .*systems\/default\.mjs/m);
    }
  });

  it("keeps 41 context-navigation glyphs aligned to the existing design-system source material", () => {
    expect(resolveDefaultGlyphPath("home")).toBe(sourceIconPath("home"));
    expect(resolveDefaultGlyphPath("grid")).toBe(sourceIconPath("grid"));
    expect(resolveDefaultGlyphPath("context-list")).toBe(sourceIconPath("list"));
    expect(resolveDefaultGlyphPath("doc")).toBe(sourceIconPath("doc"));
    expect(resolveDefaultGlyphPath("token")).toBe(sourceIconPath("token"));
    expect(resolveDefaultGlyphPath("spark")).toBe(sourceIconPath("spark"));
    expect(resolveDefaultGlyphPath("text")).toBe(sourceIconPath("text"));
    expect(resolveDefaultGlyphPath("shield")).toBe(sourceIconPath("shield"));
    expect(resolveDefaultGlyphPath("globe")).toBe(sourceIconPath("globe"));
    expect(resolveDefaultGlyphPath("context-filter")).toBe(sourceIconPath("filter"));
    expect(resolveDefaultGlyphPath("accessibility")).toBe(sourceIconPath("accessibility"));
  });

  it("keeps the 41 context-navigation More glyph aligned to the existing context-nav source", () => {
    expect(resolveDefaultGlyphPath("context-more")).toBe(
      "M12 6.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5z",
    );
  });
});
