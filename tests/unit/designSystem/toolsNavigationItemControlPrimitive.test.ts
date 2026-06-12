import { describe, expect, it } from "vitest";

import {
  renderToolsNavigationItemControlPrimitive,
  toolsNavigationItemControlPrimitive,
  toolsNavigationItemControlPrimitiveContract,
} from "../../../src/frontend/designSystem/layers/03-primitive/tools-navigation-item-control/index.mjs";

describe("tools-navigation-item-control primitive seam", () => {
  it("resolves tool frame and shared control tokens", () => {
    const control = toolsNavigationItemControlPrimitive({
      id: "tools-navigation-item-build",
      label: "Build",
      value: "build",
      state: "active",
    });

    expect(control).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "tools-navigation-item-control",
      active: true,
      icon: "list",
      tokenDependencies: {
        iconButtonControl: {
          primitiveName: "icon-button-control",
        },
        toolsNavigationFrame: {
          tokenName: "--tools-navigation-frame",
          variantId: "tools-navigation-frame-default",
        },
      },
      systemDependencies: {
        glyphRegistry: {
          semanticGlyphName: "list",
        },
      },
      attributes: {
        "aria-label": "Build",
        "aria-pressed": "true",
        "data-icon-button-control": "",
      },
    });
  });

  it("renders a native named button and unavailable semantics", () => {
    const html = renderToolsNavigationItemControlPrimitive({
      id: "tools-navigation-item-audit",
      label: "Audit unavailable",
      value: "audit",
      state: "unavailable",
    });

    expect(html).toContain("<button ");
    expect(html).toContain("<svg ");
    expect(html).toContain("<path ");
    expect(html).toContain('data-icon-button-control=""');
    expect(html).toContain('data-tools-navigation-item-control=""');
    expect(html).toContain("ds-icon-button-control");
    expect(html).toContain("ds-icon-button-control-glyph");
    expect(html).toContain('aria-label="Audit unavailable"');
    expect(html).toContain('aria-disabled="true"');
  });

  it("guards unsupported states and documents the boundary", () => {
    expect(() =>
      toolsNavigationItemControlPrimitive({
        id: "tools-navigation-item-test",
        label: "Test",
        state: "current",
      }),
    ).toThrow('tools-navigation-item-control does not support state "current".');
    expect(() =>
      toolsNavigationItemControlPrimitive({
        id: "tools-navigation-item-test",
        label: "Test",
        icon: "missing",
      }),
    ).toThrow('tools-navigation-item-control does not support icon "missing".');
    expect(toolsNavigationItemControlPrimitiveContract.requiredTokens).toContain("tools-navigation-frame");
    expect(toolsNavigationItemControlPrimitiveContract.requiredSystemRegistries).toContain("glyph-registry");
    expect(toolsNavigationItemControlPrimitiveContract.iconButtonControlCompatibility).toMatchObject({
      relatedPrimitive: "icon-button-control",
      decision: "composed",
    });
  });
});
