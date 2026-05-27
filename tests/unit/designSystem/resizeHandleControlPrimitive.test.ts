import { describe, expect, it } from "vitest";

import {
  renderResizeHandleControlPrimitive,
  resizeHandleControlPrimitive,
  resizeHandleControlPrimitiveContract,
} from "../../../src/frontend/designSystem/layers/03-primitive/resize-handle-control/index.mjs";

describe("resize-handle-control primitive seam", () => {
  it("resolves signed token dependencies and external min/max constraints", () => {
    const control = resizeHandleControlPrimitive({
      id: "panel-resize",
      label: "Resize panel",
      targetId: "panel",
      minInlineSize: "10rem",
      currentInlineSize: "13rem",
      maxInlineSize: "32rem",
    });

    expect(control).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "resize-handle-control",
      minInlineSize: "10rem",
      currentInlineSize: "13rem",
      maxInlineSize: "32rem",
      tokenDependencies: {
        resizeHandle: { tokenName: "--resize-handle-inline-default" },
        focusRing: { tokenName: "--focus-ring-visible-original" },
        minimumTargetSize: { tokenName: "--target-size-interactive-min" },
      },
      styleVars: {
        "--primitive-resize-handle-visual-radius": "999px",
      },
    });
  });

  it("renders separator semantics for keyboard resizing", () => {
    const html = renderResizeHandleControlPrimitive({
      id: "panel-resize",
      label: "Resize panel",
      targetId: "panel",
      minInlineSize: "10rem",
      currentInlineSize: "13rem",
      maxInlineSize: "32rem",
    });

    expect(html).toContain('role="separator"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('aria-orientation="vertical"');
    expect(html).toContain('aria-valuemin="10rem"');
    expect(html).toContain('aria-valuemax="32rem"');
    expect(html).toContain('data-resize-handle-control=""');
  });

  it("documents the primitive boundary", () => {
    expect(resizeHandleControlPrimitiveContract).toMatchObject({
      primitiveName: "resize-handle-control",
      eventName: "resize-handle-control:resize",
      requiredTokens: ["resize-handle", "focus-ring", "minimum-target-size"],
    });
  });
});
