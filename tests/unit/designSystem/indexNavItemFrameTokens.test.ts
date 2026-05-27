import { describe, expect, it } from "vitest";

import { indexNavItemGapTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/index-nav-item-gap/systems/default.mjs";
import { indexNavItemPaddingTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/index-nav-item-padding/systems/default.mjs";
import { indexNavItemRadiusTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/index-nav-item-radius/systems/default.mjs";

describe("index-nav-item frame token seams", () => {
  it("exposes governed radius, padding, and gap seams for the default system", () => {
    expect(indexNavItemRadiusTokenSpec).toMatchObject({
      contractId: "tokens.index-nav-item-radius",
      systemKey: "default",
      tokenType: "index-nav-item-radius",
    });
    expect(indexNavItemPaddingTokenSpec).toMatchObject({
      contractId: "tokens.index-nav-item-padding",
      systemKey: "default",
      tokenType: "index-nav-item-padding",
    });
    expect(indexNavItemGapTokenSpec).toMatchObject({
      contractId: "tokens.index-nav-item-gap",
      systemKey: "default",
      tokenType: "index-nav-item-gap",
    });
  });

  it("keeps frame decisions separate from behavior and state semantics", () => {
    expect(indexNavItemRadiusTokenSpec.consumerRestrictions.join(" ")).toContain("activation behavior");
    expect(indexNavItemPaddingTokenSpec.consumerRestrictions.join(" ")).toContain("minimum target size");
    expect(indexNavItemGapTokenSpec.consumerRestrictions.join(" ")).toContain("truncation");
  });

  it("uses logical padding for RTL-safe item frames", () => {
    const inline = indexNavItemPaddingTokenSpec.variants.find(
      (variant: { id: string }) => variant.id === "index-nav-item-padding-inline",
    );

    expect(inline).toMatchObject({
      tokenName: "--index-nav-item-padding-inline",
      axis: "inline",
      lengthValue: "0.75rem",
    });
    expect(inline?.directionBehavior).toContain("RTL");
  });
});
