export const defaultGlyphRegistry = {
  schema: "kanbien.designSystem.glyphRegistry.v1",
  systemKey: "default",
  glyphs: {
    close: {
      semanticName: "close",
      svgPath: "M6 6l12 12M18 6L6 18",
    },
    filter: {
      semanticName: "filter",
      svgPath: "M7 7h10l-4 5v4l-2 1v-5z",
    },
    "chevron-down": {
      semanticName: "chevron-down",
      svgPath: "M6 9l6 6l6-6",
    },
    list: {
      semanticName: "list",
      svgPath: "M5 7h14M5 12h14M5 17h14",
    },
    plus: {
      semanticName: "plus",
      svgPath: "M12 5v14M5 12h14",
    },
    sort: {
      semanticName: "sort",
      svgPath: "M7 8h10M9 12h6M11 16h2",
    },
  },
};

export function resolveDefaultGlyphPath(glyphName) {
  const glyph = defaultGlyphRegistry.glyphs[glyphName];
  if (!glyph) {
    throw new RangeError(`default design system has no glyph "${glyphName}".`);
  }
  return glyph.svgPath;
}
