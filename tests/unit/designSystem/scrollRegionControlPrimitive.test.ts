import { describe, expect, it } from "vitest";

import {
  scrollRegionControlPrimitive,
  scrollRegionControlPrimitiveContract,
  renderScrollRegionControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/scroll-region-control/index.mjs";

describe("scroll-region-control primitive seam", () => {
  it("exposes scroll ownership and scrollbar skin from signed tokens", () => {
    const region = scrollRegionControlPrimitive({
      id: "primary-index-scroll",
      mobileMode: "page-scroll",
    });

    expect(region).toMatchObject({
      schema: "kanbien.designSystem.primitiveSpec.v1",
      primitiveName: "scroll-region-control",
      tokenDependencies: {
        panelFrame: {
          tokenName: "inherited",
          variantId: "inherited-from-containing-pattern",
        },
        scrollbarSkin: {
          tokenName: "--scrollbar-skin-primary",
          variantId: "scrollbar-skin-primary",
        },
      },
      styleVars: {
        "--primitive-scroll-region-max-block-size": "none",
        "--primitive-scrollbar-width": "thin",
        "--primitive-scrollbar-gutter-inline-size": "0.75rem",
        "--primitive-scrollbar-radius": "999px",
      },
    });
  });

  it("renders a governed scroll region with optional content", () => {
    const html = renderScrollRegionControlPrimitive({
      id: "primary-index-scroll",
      contentHtml: "<p>Scrollable content</p>",
    });

    expect(html).toContain('data-scroll-region-control=""');
    expect(html).toContain("Scrollable content");
    expect(html).toContain("--primitive-scrollbar-thumb");
  });

  it("documents its primitive boundary", () => {
    expect(scrollRegionControlPrimitiveContract).toMatchObject({
      schema: "kanbien.designSystem.primitiveContract.v1",
      primitiveName: "scroll-region-control",
      requiredTokens: ["scrollbar-skin"],
    });
  });
});
