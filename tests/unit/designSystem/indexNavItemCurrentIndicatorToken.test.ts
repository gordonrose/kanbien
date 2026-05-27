import { describe, expect, it } from "vitest";

import {
  indexNavItemCurrentIndicatorTokenSpec,
  indexNavItemCurrentIndicatorTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/index-nav-item-current-indicator/systems/default.mjs";

describe("index-nav-item-current-indicator token seam", () => {
  it("exposes the governed current-state non-color affordance", () => {
    expect(indexNavItemCurrentIndicatorTokenSpec).toMatchObject({
      contractId: "tokens.index-nav-item-current-indicator",
      systemKey: "default",
      tokenType: "index-nav-item-current-indicator",
    });

    expect(indexNavItemCurrentIndicatorTokenVariants).toHaveLength(1);
    expect(indexNavItemCurrentIndicatorTokenVariants[0]).toMatchObject({
      tokenName: "--index-nav-item-current-indicator",
      inlineSize: "0.25rem",
      minBlockSize: "1.5rem",
      blockSizeBehavior: "stretch",
      radiusValue: "999px",
      colorSource: "currentColor",
    });
    expect(indexNavItemCurrentIndicatorTokenVariants[0]?.preview).toMatchObject({
      background: "color-mix(in srgb, #635bff 12%, white)",
      foreground: "color-mix(in srgb, #635bff 48%, #111827)",
      border: "color-mix(in srgb, #635bff 38%, #20242c)",
    });
  });

  it("does not own current semantics", () => {
    expect(indexNavItemCurrentIndicatorTokenSpec.consumerRestrictions.join(" ")).toContain(
      "does not approve current semantics",
    );
    expect(indexNavItemCurrentIndicatorTokenVariants[0]?.usage.map((item: { text: string }) => item.text).join(" ")).toContain(
      "Semantic owner is the consuming primitive",
    );
  });
});
