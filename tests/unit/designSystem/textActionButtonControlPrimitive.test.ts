import { describe, expect, it } from "vitest";

import {
  textActionButtonControlPrimitive,
  textActionButtonControlPrimitiveContract,
  renderTextActionButtonControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/text-action-button-control/index.mjs";

describe("text-action-button-control primitive seam", () => {
  it("resolves signed token dependencies for the add action", () => {
    const add = textActionButtonControlPrimitive({ id: "add-section", label: "Add section" });

    expect(add).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "text-action-button-control",
      tokenDependencies: {
        buttonFrame: {
          tokenName: "--button-frame-text-action-original",
        },
        labelTextStyle: {
          tokenName: "--label-text-style-short-default",
        },
        focusRing: {
          tokenName: "--focus-ring-visible-original",
        },
        minimumTargetSize: {
          tokenName: "--target-size-interactive-min",
        },
      },
      semantics: {
        element: "button",
        accessibleName: "Add section",
      },
    });
  });

  it("renders one native button and documents the primitive boundary", () => {
    const html = renderTextActionButtonControlPrimitive({ id: "add-section", label: "Add section" });

    expect(html).toContain("<button");
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Add section"');
    expect(html).toContain('data-text-action-button-control=""');
    expect(textActionButtonControlPrimitiveContract).toMatchObject({
      primitiveName: "text-action-button-control",
      eventName: "text-action-button-control:activate",
    });
  });
});
