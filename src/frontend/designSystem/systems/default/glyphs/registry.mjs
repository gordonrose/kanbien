export const defaultGlyphRegistry = {
  schema: "kanbien.designSystem.glyphRegistry.v1",
  systemKey: "default",
  glyphs: {
    close: {
      semanticName: "close",
      svgPath: "M6 6l12 12M18 6L6 18",
    },
    list: {
      semanticName: "list",
      svgPath: "M5 7h14M5 12h14M5 17h14",
    },
    plus: {
      semanticName: "plus",
      svgPath: "M12 5v14M5 12h14",
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
