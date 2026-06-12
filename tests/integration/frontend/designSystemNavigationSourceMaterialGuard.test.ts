import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { resolveDefaultGlyphPath } from "../../../src/frontend/designSystem/systems/default/glyphs/registry.mjs";

const sourcePath = "src/frontend/designSystem/assets/app.mjs";
const source = readFileSync(sourcePath, "utf8");

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
