import { describe, expect, it } from "vitest";

import {
  resizeHandleTokenSpec,
  resizeHandleTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/resize-handle/systems/default.mjs";

describe("resize-handle token seam", () => {
  it("exposes the governed inline resize affordance without owning panel widths", () => {
    expect(resizeHandleTokenSpec).toMatchObject({
      contractId: "tokens.resize-handle",
      systemKey: "default",
      tokenType: "resize-handle",
    });

    expect(resizeHandleTokenVariants).toHaveLength(1);
    expect(resizeHandleTokenVariants[0]).toMatchObject({
      handleRole: "inline resize handle",
      placement: "inline-end",
      hitAreaInlineSize: "0.75rem",
      visualInlineSize: "0.125rem",
      visualRadiusValue: "999px",
      minBlockSize: "44px",
      cursorValue: "col-resize",
      touchActionValue: "none",
      visualColorValue: "color-mix(in srgb, #635bff 36%, #dbe4f0)",
    });
    expect(resizeHandleTokenVariants[0]?.sourceTokenName).toContain("--primary-color-source-original");
    expect(resizeHandleTokenVariants[0]?.sourceTokenName).toContain("--index-nav-panel-frame");
    expect(resizeHandleTokenVariants[0]?.formulaOrMapping).toContain("primary source 36%");
    expect(resizeHandleTokenSpec.consumerRestrictions.join(" ")).toContain("not use this token as panel width authority");
  });
});
