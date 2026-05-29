import { describe, expect, it } from "vitest";

import {
  panelHeaderControlPrimitive,
  panelHeaderControlPrimitiveContract,
  renderPanelHeaderControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/panel-header-control/index.mjs";

describe("panel-header-control primitive seam", () => {
  it("resolves signed panel header tokens and composes governed primitives", () => {
    const header = panelHeaderControlPrimitive({
      id: "panel-header-test",
      title: "Primary Details",
      actionLabel: "Add section",
    });

    expect(header).toMatchObject({
      primitiveName: "panel-header-control",
      tokenDependencies: {
        headerFrame: {
          tokenName: "--panel-header-frame",
          variantId: "panel-header-frame-default",
        },
      },
      showAction: true,
    });
    expect(header.styleVars["--primitive-panel-header-block-size"]).toBe("3.25rem");
    expect(header.styleVars["--primitive-panel-header-separator"]).toBe("#dbe4f0");
  });

  it("renders semantic header markup with truncating label and icon button primitives", () => {
    const html = renderPanelHeaderControlPrimitive({
      id: "panel-header-render",
      title: "Primary Details",
      actionLabel: "Add section",
    });

    expect(html).toContain("<header");
    expect(html).toContain('data-panel-header-control=""');
    expect(html).toContain("data-truncating-label");
    expect(html).toContain("data-icon-button-control");
  });

  it("declares generic panel dependencies", () => {
    expect(panelHeaderControlPrimitiveContract).toMatchObject({
      primitiveName: "panel-header-control",
      requiredTokens: ["panel-header-frame", "label-text-style"],
      requiredPrimitives: ["icon-button-control", "truncating-label"],
    });
  });
});
