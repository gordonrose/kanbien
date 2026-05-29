import { describe, expect, it } from "vitest";

import {
  errorTextStyleTokenSpec,
  errorTextStyleTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/error-text-style/systems/default.mjs";

describe("error-text-style token seam", () => {
  it("exposes governed field error text typography and foreground", () => {
    expect(errorTextStyleTokenSpec).toMatchObject({
      contractId: "tokens.error-text-style",
      systemKey: "default",
      tokenType: "error-text-style",
    });

    expect(errorTextStyleTokenVariants).toHaveLength(1);
    expect(errorTextStyleTokenVariants[0]).toMatchObject({
      tokenName: "--error-text-style-default",
      role: "field error text",
      foregroundValue: "#7a1f1f",
      fontSizeValue: "0.75rem",
      fontWeightValue: "800",
      lineHeightValue: "1.2",
      letterSpacingValue: "0",
    });
  });
});
