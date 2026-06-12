export const defaultGlyphRegistry = {
  schema: "kanbien.designSystem.glyphRegistry.v1",
  layer: "03-primitive",
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
    "context-filter": {
      semanticName: "context-filter",
      svgPath: "M4 6h16l-6.5 7.25V19l-3-1.5v-4.25z",
    },
    "context-more": {
      semanticName: "context-more",
      svgPath:
        "M12 6.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5z",
    },
    "context-list": {
      semanticName: "context-list",
      svgPath: "M5 6h14v3H5zm0 5h14v3H5zm0 5h9v3H5z",
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
