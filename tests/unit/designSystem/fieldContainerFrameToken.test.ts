import { describe, expect, it } from "vitest";

import {
  fieldContainerFrameTokenSpec,
  fieldContainerFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/field-container-frame/systems/default.mjs";

describe("field-container-frame token seam", () => {
  it("exposes governed outer field-container frame values", () => {
    expect(fieldContainerFrameTokenSpec).toMatchObject({
      contractId: "tokens.field-container-frame",
      systemKey: "default",
      tokenType: "field-container-frame",
    });

    expect(fieldContainerFrameTokenVariants).toHaveLength(1);
    expect(fieldContainerFrameTokenVariants[0]).toMatchObject({
      tokenName: "--field-container-frame",
      frameRole: "field container frame",
      backgroundValue: "#ffffff",
      foregroundValue: "#111827",
      borderValue: "#dbe4f0",
      radiusValue: "0.375rem",
      paddingBlockValue: "1rem",
      paddingInlineValue: "1rem",
      minBlockSize: "8.5rem",
      minInlineSize: "min(100%, 16rem)",
      maxInlineSize: "100%",
    });

    expect(fieldContainerFrameTokenVariants[0].sourceTokenName).toBe("--body-region-frame");
  });
});
