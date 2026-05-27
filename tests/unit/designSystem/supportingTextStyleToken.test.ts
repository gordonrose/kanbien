import { describe, expect, it } from "vitest";

import {
  supportingTextStyleTokenSpec,
  supportingTextStyleTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/supporting-text-style/systems/default.mjs";

describe("supporting-text-style token seam", () => {
  it("exposes a governed text style for secondary item text", () => {
    expect(supportingTextStyleTokenSpec).toMatchObject({
      contractId: "tokens.supporting-text-style",
      systemKey: "default",
      tokenType: "supporting-text-style",
    });

    expect(supportingTextStyleTokenVariants).toHaveLength(1);
    expect(supportingTextStyleTokenVariants[0]).toMatchObject({
      tokenName: "--supporting-text-style-default",
      role: "supporting text",
      fontSizeValue: "0.75rem",
      fontWeightValue: "800",
      lineHeightValue: "1.2",
      letterSpacingValue: "0",
    });
    expect(supportingTextStyleTokenVariants[0]?.preview).toMatchObject({
      background: "inherit",
      foreground: "inherit",
    });
  });

  it("forbids local opacity or supporting text typography literals", () => {
    expect(supportingTextStyleTokenSpec.consumerRestrictions.join(" ")).toContain("opacity");
    expect(supportingTextStyleTokenSpec.consumerRestrictions.join(" ")).toContain("foreground color");
    expect(supportingTextStyleTokenSpec.consumerRestrictions.join(" ")).toContain("styling supporting text locally");
  });
});
