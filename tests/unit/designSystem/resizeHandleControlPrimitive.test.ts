import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

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
      resizeEdge: "inline-end",
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
    expect(html).toContain('data-resize-handle-control-edge="inline-end"');
  });

  it("supports inline-start edge resizing for leading-edge drawers", () => {
    const html = renderResizeHandleControlPrimitive({
      id: "panel-resize",
      label: "Resize panel",
      targetId: "panel",
      minInlineSize: "10rem",
      currentInlineSize: "13rem",
      maxInlineSize: "32rem",
      resizeEdge: "inline-start",
    });

    expect(html).toContain('data-resize-handle-control-edge="inline-start"');
    expect(() =>
      resizeHandleControlPrimitive({
        id: "panel-resize",
        label: "Resize panel",
        targetId: "panel",
        minInlineSize: "10rem",
        currentInlineSize: "13rem",
        maxInlineSize: "32rem",
        resizeEdge: "block-start",
      }),
    ).toThrow('resize-handle-control does not support resizeEdge "block-start".');
  });

  it("documents the primitive boundary", () => {
    expect(resizeHandleControlPrimitiveContract).toMatchObject({
      primitiveName: "resize-handle-control",
      eventName: "resize-handle-control:resize",
      requiredTokens: ["resize-handle", "focus-ring", "minimum-target-size"],
    });
  });

  it("does not emit a user resize event during attach-time initialization", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/layers/03-primitive/resize-handle-control/index.mjs"),
      "utf8",
    );

    expect(source).toContain("applyInlineSize(control, initial || target.getBoundingClientRect().width, { emit: false })");
  });

  it("starts pointer resizing from the live target width", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/layers/03-primitive/resize-handle-control/index.mjs"),
      "utf8",
    );

    expect(source).toContain("function currentTargetWidth");
    expect(source).toContain("const startWidth = currentTargetWidth(control, ownerDocument)");
  });
});
