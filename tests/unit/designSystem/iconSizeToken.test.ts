import { describe, expect, it } from "vitest";

import {
  iconSizeTokenSpec,
  iconSizeTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/icon-size/systems/default.mjs";

describe("icon-size token seam", () => {
  it("exposes the governed icon button glyph size", () => {
    expect(iconSizeTokenSpec).toMatchObject({
      contractId: "tokens.icon-size",
      systemKey: "default",
      tokenType: "icon-size",
    });

    expect(iconSizeTokenVariants).toHaveLength(1);
    expect(iconSizeTokenVariants[0]).toMatchObject({
      tokenName: "--icon-button-glyph-size",
      iconRole: "icon button glyph",
      inlineSize: "1rem",
      blockSize: "1rem",
      viewBox: "24",
    });
  });
});
