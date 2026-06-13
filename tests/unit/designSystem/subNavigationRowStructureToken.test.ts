import { describe, expect, it } from "vitest";

import { subNavigationRowStructureTokenContract } from "../../../src/frontend/designSystem/layers/02-token/sub-navigation-row-structure/contract.mjs";
import {
  subNavigationRowStructureTokenSpec,
  subNavigationRowStructureTokenVariants,
} from "../../../src/frontend/designSystem/layers/02-token/sub-navigation-row-structure/systems/default.mjs";

describe("sub-navigation-row-structure token seam", () => {
  it("exposes the reusable breadcrumb, gap, search, and reserve lane map", () => {
    expect(subNavigationRowStructureTokenContract).toMatchObject({
      contractId: "tokens.sub-navigation-row-structure",
      tokenType: "sub-navigation-row-structure",
      requiredVariantRoles: ["sub-navigation row structure"],
    });

    const variant = subNavigationRowStructureTokenVariants.find(
      (candidate: { id: string }) => candidate.id === "sub-navigation-row-structure-default",
    );

    expect(variant).toMatchObject({
      tokenName: "--sub-navigation-row-structure",
      columnCount: "24",
      minimumColumnInlineSize: "2.75rem",
    });
    expect(variant?.lanes).toContain("1-7: breadcrumb");
    expect(variant?.lanes).toContain("8: gap");
    expect(variant?.lanes).toContain("9-17: search");
    expect(variant?.lanes).toContain("18-24: reserve");
    expect(variant?.collapseBehavior).toContain("remove reserve columns 18-24 first");
  });

  it("is published as a review-ready default token spec", () => {
    expect(subNavigationRowStructureTokenSpec).toMatchObject({
      contractId: "tokens.sub-navigation-row-structure",
      systemKey: "default",
      tokenType: "sub-navigation-row-structure",
    });
    expect(subNavigationRowStructureTokenSpec.consumerRestrictions.join(" ")).toContain(
      "sub-navigation column spans",
    );
  });
});
