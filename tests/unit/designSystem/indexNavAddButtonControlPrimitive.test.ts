import { describe, expect, it } from "vitest";

import {
  indexNavAddButtonControlPrimitive,
  indexNavAddButtonControlPrimitiveContract,
  renderIndexNavAddButtonControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/index-nav-add-button-control/index.mjs";

describe("index-nav-add-button-control primitive seam", () => {
  it("resolves signed token dependencies for the add action", () => {
    const add = indexNavAddButtonControlPrimitive({ id: "add-section", label: "Add section" });

    expect(add).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "index-nav-add-button-control",
      tokenDependencies: {
        actionFrame: {
          tokenName: "--index-nav-panel-action-frame",
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
    const html = renderIndexNavAddButtonControlPrimitive({ id: "add-section", label: "Add section" });

    expect(html).toContain("<button");
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Add section"');
    expect(html).toContain('data-index-nav-add-button-control=""');
    expect(indexNavAddButtonControlPrimitiveContract).toMatchObject({
      primitiveName: "index-nav-add-button-control",
      eventName: "index-nav-add-button-control:activate",
    });
  });
});
