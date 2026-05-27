import { describe, expect, it } from "vitest";

import {
  indexNavItemSupportingTextStyleTokenSpec,
  indexNavItemSupportingTextStyleTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/index-nav-item-supporting-text-style/systems/default.mjs";

describe("index-nav-item-supporting-text-style token seam", () => {
  it("exposes a governed text style for secondary item text", () => {
    expect(indexNavItemSupportingTextStyleTokenSpec).toMatchObject({
      contractId: "tokens.index-nav-item-supporting-text-style",
      systemKey: "default",
      tokenType: "index-nav-item-supporting-text-style",
    });

    expect(indexNavItemSupportingTextStyleTokenVariants).toHaveLength(1);
    expect(indexNavItemSupportingTextStyleTokenVariants[0]).toMatchObject({
      tokenName: "--index-nav-item-supporting-text-style-default",
      role: "index nav item supporting text",
      fontSizeValue: "0.75rem",
      fontWeightValue: "800",
      lineHeightValue: "1.2",
      letterSpacingValue: "0",
    });
    expect(indexNavItemSupportingTextStyleTokenVariants[0]?.preview).toMatchObject({
      background: "inherit",
      foreground: "inherit",
    });
  });

  it("forbids local opacity or supporting text typography literals", () => {
    expect(indexNavItemSupportingTextStyleTokenSpec.consumerRestrictions.join(" ")).toContain("opacity");
    expect(indexNavItemSupportingTextStyleTokenSpec.consumerRestrictions.join(" ")).toContain("foreground color");
    expect(indexNavItemSupportingTextStyleTokenSpec.consumerRestrictions.join(" ")).toContain("styling supporting text locally");
  });
});
