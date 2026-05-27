import { describe, expect, it } from "vitest";

import {
  indexNavIconButtonControlPrimitive,
  indexNavIconButtonControlPrimitiveContract,
  renderIndexNavIconButtonControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/index-nav-icon-button-control/index.mjs";

describe("index-nav-icon-button-control primitive seam", () => {
  it("resolves signed token dependencies for an icon-only add action", () => {
    const control = indexNavIconButtonControlPrimitive({
      id: "add-index-item",
      label: "Add index item",
      value: "add",
    });

    expect(control).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "index-nav-icon-button-control",
      tokenDependencies: {
        actionFrame: { tokenName: "--index-nav-panel-action-frame" },
        iconSize: { tokenName: "--icon-button-glyph-size" },
        focusRing: { tokenName: "--focus-ring-visible-original" },
        minimumTargetSize: { tokenName: "--target-size-interactive-min" },
      },
    });
    expect(control.attributes["aria-label"]).toBe("Add index item");
  });

  it("renders native button markup with a decorative glyph", () => {
    const html = renderIndexNavIconButtonControlPrimitive({
      id: "add-index-item",
      label: "Add index item",
      value: "add",
    });

    expect(html).toContain("<button");
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Add index item"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-index-nav-icon-button-control=""');
  });

  it("documents the primitive boundary", () => {
    expect(indexNavIconButtonControlPrimitiveContract).toMatchObject({
      primitiveName: "index-nav-icon-button-control",
      eventName: "index-nav-icon-button-control:activate",
      requiredTokens: ["index-nav-panel-frame", "icon-size", "focus-ring", "minimum-target-size"],
    });
  });
});
