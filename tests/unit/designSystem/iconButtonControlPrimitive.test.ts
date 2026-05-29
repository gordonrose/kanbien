import { describe, expect, it } from "vitest";

import {
  iconButtonControlPrimitive,
  iconButtonControlPrimitiveContract,
  renderIconButtonControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/icon-button-control/index.mjs";
import {
  defaultGlyphRegistry,
  resolveDefaultGlyphPath,
} from "../../../src/frontend/designSystem/systems/default/glyphs/registry.mjs";

describe("icon-button-control primitive seam", () => {
  it("resolves signed token dependencies for an icon-only add action", () => {
    const control = iconButtonControlPrimitive({
      id: "add-index-item",
      label: "Add index item",
      value: "add",
    });

    expect(control).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "icon-button-control",
      frameIntent: "subtle",
      tokenDependencies: {
        buttonFrame: { tokenName: "--button-frame-icon-subtle-original" },
        iconSize: { tokenName: "--icon-button-glyph-size" },
        focusRing: { tokenName: "--focus-ring-visible-original" },
        minimumTargetSize: { tokenName: "--target-size-interactive-min" },
      },
    });
    expect(control.attributes["aria-label"]).toBe("Add index item");
    expect(control.styleVars["--primitive-icon-button-visual-inset"]).toBe("0.25rem");
  });

  it("allows consumers to choose signed icon-button frame intents", () => {
    const control = iconButtonControlPrimitive({
      id: "add-index-item",
      label: "Add index item",
      value: "add",
      frameIntent: "quiet",
    });

    expect(control).toMatchObject({
      frameIntent: "quiet",
      tokenDependencies: {
        buttonFrame: { tokenName: "--button-frame-icon-quiet-original" },
      },
    });
    expect(control.attributes["data-icon-button-control-frame-intent"]).toBe("quiet");
  });

  it("renders native button markup with a decorative glyph", () => {
    const html = renderIconButtonControlPrimitive({
      id: "add-index-item",
      label: "Add index item",
      value: "add",
    });

    expect(html).toContain("<button");
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Add index item"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-icon-button-control=""');
  });

  it("supports a governed close glyph without changing button semantics", () => {
    const control = iconButtonControlPrimitive({
      id: "close-panel",
      label: "Close panel",
      value: "close",
      icon: "close",
      frameIntent: "quiet",
    });
    const html = renderIconButtonControlPrimitive({
      id: "close-panel",
      label: "Close panel",
      value: "close",
      icon: "close",
      frameIntent: "quiet",
    });

    expect(control.icon).toBe("close");
    expect(control.systemDependencies.glyphRegistry).toMatchObject({
      systemKey: "default",
      semanticGlyphName: "close",
      runtimeSeam: "src/frontend/designSystem/systems/default/glyphs/registry.mjs#defaultGlyphRegistry",
    });
    expect(control.attributes["aria-label"]).toBe("Close panel");
    expect(html).toContain('aria-label="Close panel"');
    expect(html).toContain(resolveDefaultGlyphPath("close"));
  });

  it("supports a governed list glyph without changing button semantics", () => {
    const control = iconButtonControlPrimitive({
      id: "show-secondary-index",
      label: "Show secondary index",
      value: "show-secondary-index",
      icon: "list",
      frameIntent: "quiet",
    });
    const html = renderIconButtonControlPrimitive({
      id: "show-secondary-index",
      label: "Show secondary index",
      value: "show-secondary-index",
      icon: "list",
      frameIntent: "quiet",
    });

    expect(control.icon).toBe("list");
    expect(control.attributes["aria-label"]).toBe("Show secondary index");
    expect(html).toContain('aria-label="Show secondary index"');
    expect(html).toContain(resolveDefaultGlyphPath("list"));
  });

  it("keeps default glyph artwork in the selected-system registry", () => {
    expect(defaultGlyphRegistry).toMatchObject({
      schema: "kanbien.designSystem.glyphRegistry.v1",
      systemKey: "default",
      glyphs: {
        close: { semanticName: "close" },
        list: { semanticName: "list" },
        plus: { semanticName: "plus" },
      },
    });
    expect(resolveDefaultGlyphPath("plus")).toBe(defaultGlyphRegistry.glyphs.plus.svgPath);
  });

  it("documents the primitive boundary", () => {
    expect(iconButtonControlPrimitiveContract).toMatchObject({
      primitiveName: "icon-button-control",
      eventName: "icon-button-control:activate",
      supportedIcons: ["plus", "close", "list"],
      supportedFrameIntents: ["quiet", "subtle"],
      requiredTokens: ["button-frame", "icon-size", "focus-ring", "minimum-target-size"],
      requiredSystemRegistries: ["glyph-registry"],
    });
  });
});
