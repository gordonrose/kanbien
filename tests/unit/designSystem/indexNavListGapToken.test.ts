import { describe, expect, it } from "vitest";

import {
  indexNavListGapTokenSpec,
  indexNavListGapTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/index-nav-list-gap/systems/default.mjs";

describe("index-nav-list-gap token seam", () => {
  it("exposes governed spacing between index nav items", () => {
    expect(indexNavListGapTokenSpec).toMatchObject({
      contractId: "tokens.index-nav-list-gap",
      systemKey: "default",
      tokenType: "index-nav-list-gap",
    });

    expect(indexNavListGapTokenVariants).toHaveLength(1);
    expect(indexNavListGapTokenVariants[0]).toMatchObject({
      tokenName: "--index-nav-list-gap",
      gapRole: "index nav list item gap",
      lengthValue: "0.5rem",
      layoutContext: "vertical stack of governed index-nav-item patterns",
    });
  });

  it("does not approve item internals or scroll behavior", () => {
    expect(indexNavListGapTokenSpec.consumerRestrictions.join(" ")).toContain("item internals");
    expect(indexNavListGapTokenSpec.consumerRestrictions.join(" ")).toContain("scrolling");
  });
});
