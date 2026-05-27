import { describe, expect, it } from "vitest";

import {
  indexNavPanelHeaderControlPrimitive,
  indexNavPanelHeaderControlPrimitiveContract,
  renderIndexNavPanelHeaderControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/index-nav-panel-header-control/index.mjs";

describe("index-nav-panel-header-control primitive seam", () => {
  it("exposes fixed sticky header geometry from signed tokens", () => {
    const header = indexNavPanelHeaderControlPrimitive({
      id: "primary-index-header",
      title: "Primary index",
      addLabel: "Add index item",
    });

    expect(header).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "index-nav-panel-header-control",
      tokenDependencies: {
        headerFrame: {
          tokenName: "--index-nav-panel-header-frame",
          variantId: "index-nav-panel-header-default",
        },
        labelTextStyle: {
          tokenName: "--label-text-style-short-default",
        },
      },
      styleVars: {
        "--primitive-index-nav-panel-header-block-size": "3.25rem",
        "--primitive-index-nav-panel-header-min-block-size": "3.25rem",
        "--primitive-index-nav-panel-header-max-block-size": "3.25rem",
        "--primitive-index-nav-panel-header-sticky-top": "0",
        "--primitive-index-nav-panel-header-separator": "#dbe4f0",
      },
    });
  });

  it("renders a header with governed icon-button action", () => {
    const html = renderIndexNavPanelHeaderControlPrimitive({
      id: "primary-index-header",
      title: "Primary index",
      addLabel: "Add index item",
    });

    expect(html).toContain('data-index-nav-panel-header-control=""');
    expect(html).toContain("Primary index");
    expect(html).toContain('data-truncating-label=""');
    expect(html).toContain('data-icon-button-control=""');
    expect(html).not.toContain("ds-index-nav-panel-header ");
  });

  it("documents its primitive boundary", () => {
    expect(indexNavPanelHeaderControlPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "index-nav-panel-header-control",
      requiredTokens: ["index-nav-panel-frame", "label-text-style"],
      requiredPrimitives: ["icon-button-control", "truncating-label"],
    });
  });
});
