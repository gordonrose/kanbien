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
    home: {
      semanticName: "home",
      svgPath: "M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z",
    },
    grid: {
      semanticName: "grid",
      svgPath: "M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 3.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z",
    },
    doc: {
      semanticName: "doc",
      svgPath: "M7 4h8l4 4v12H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm7 1.5V9h3.5",
    },
    token: {
      semanticName: "token",
      svgPath: "m12 3 7 4v10l-7 4-7-4V7zm0 3.1L8.1 8.3v4.4L12 15l3.9-2.3V8.3z",
    },
    spark: {
      semanticName: "spark",
      svgPath:
        "M12 2.5 14.2 8l5.3 2-5.3 2-2.2 5.5L9.8 12 4.5 10l5.3-2zm-5 13 1.15 2.85L11 19.5l-2.85 1.15L7 23.5l-1.15-2.85L3 19.5l2.85-1.15z",
    },
    text: {
      semanticName: "text",
      svgPath: "M5 5h14v3h-5.5v11h-3V8H5z",
    },
    shield: {
      semanticName: "shield",
      svgPath:
        "M12 3.2 18.5 5v5.2c0 4.3-2.75 8.05-6.5 9.8-3.75-1.75-6.5-5.5-6.5-9.8V5zM10.8 14.7l4.7-4.7-1.4-1.4-3.3 3.3-1.8-1.8-1.4 1.4z",
    },
    globe: {
      semanticName: "globe",
      svgPath:
        "M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm5.85 8h-3.2a14.4 14.4 0 0 0-1.2-5A7.03 7.03 0 0 1 17.85 11zM12 5.2A12.1 12.1 0 0 1 13.4 11h-2.8A12.1 12.1 0 0 1 12 5.2zM6.15 13h3.2a14.4 14.4 0 0 0 1.2 5A7.03 7.03 0 0 1 6.15 13zm3.2-2h-3.2A7.03 7.03 0 0 1 10.55 6a14.4 14.4 0 0 0-1.2 5zm2.65 7.8A12.1 12.1 0 0 1 10.6 13h2.8A12.1 12.1 0 0 1 12 18.8zM13.45 18a14.4 14.4 0 0 0 1.2-5h3.2A7.03 7.03 0 0 1 13.45 18z",
    },
    accessibility: {
      semanticName: "accessibility",
      svgPath:
        "M12 2.75a9.25 9.25 0 1 0 9.25 9.25A9.26 9.26 0 0 0 12 2.75zm0 3.1a2.15 2.15 0 1 1-2.15 2.15A2.15 2.15 0 0 1 12 5.85zm0 11.55a5.4 5.4 0 0 1-4.19-1.97 4.87 4.87 0 0 1 8.38 0A5.4 5.4 0 0 1 12 17.4z",
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
    signpost: {
      semanticName: "signpost",
      svgPath: "M12 21V5M7 5h10l2 3-2 3H7zM5 11h10l2 3-2 3H5z",
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
