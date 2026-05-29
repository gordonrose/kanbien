import { describe, expect, it } from "vitest";

import {
  fieldRowFrameTokenSpec,
  fieldRowFrameTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/field-row-frame/systems/default.mjs";

describe("field-row-frame token seam", () => {
  it("exposes governed field-row spacing and slot sizing", () => {
    expect(fieldRowFrameTokenSpec).toMatchObject({
      contractId: "tokens.field-row-frame",
      systemKey: "default",
      tokenType: "field-row-frame",
    });

    expect(fieldRowFrameTokenVariants).toHaveLength(1);
    expect(fieldRowFrameTokenVariants[0]).toMatchObject({
      tokenName: "--field-row-frame",
      frameRole: "field row frame",
      rowGapValue: "0.75rem",
      labelToControlGapValue: "0.5rem",
      controlToMessageGapValue: "0.375rem",
      controlSlotMinBlockSize: "44px",
      controlSlotBorderValue: "#dbe4f0",
      minInlineSize: "min(100%, 16rem)",
      maxInlineSize: "100%",
    });

    expect(fieldRowFrameTokenVariants[0].sourceTokenName).toBe("body-region-frame + minimum-target-size");
  });
});
