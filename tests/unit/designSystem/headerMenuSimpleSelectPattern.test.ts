import { describe, expect, it } from "vitest";

import {
  headerLayerOptions,
  headerMenuSimpleSelectPattern,
  headerMenuSimpleSelectPatternContract,
  renderHeaderMenuSimpleSelectPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/header-menu-simple-select/index.mjs";

describe("header-menu-simple-select pattern seam", () => {
  it("composes the governed menu-simple-select-control primitive", () => {
    const pattern = headerMenuSimpleSelectPattern({
      id: "header-menu-select-test",
      value: "organizations",
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "header-menu-simple-select",
      value: "organizations",
      primitive: {
        primitiveName: "menu-simple-select-control",
        currentLabel: "Organizations",
      },
    });
    expect(pattern.primitive.tokenDependencies.menuSimpleSelectFrame.variantId).toBe(
      "menu-simple-select-trigger-frame-default",
    );
  });

  it("keeps the representative layer options available to the pattern", () => {
    expect(headerLayerOptions.map((option) => option.value)).toEqual([
      "chats",
      "tenants",
      "owners",
      "organizations",
      "deals",
      "locations",
      "business-units",
      "users",
    ]);
  });

  it("renders through the primitive seam rather than local select markup", () => {
    const html = renderHeaderMenuSimpleSelectPattern({
      id: "header-menu-select-render",
    });

    expect(html).toContain("data-header-menu-simple-select");
    expect(html).toContain("data-menu-simple-select-control");
    expect(html).toContain("data-menu-simple-select-trigger");
    expect(html).toContain('role="listbox"');
    expect(html).not.toContain("form-select");
  });

  it("documents the pattern boundary", () => {
    expect(headerMenuSimpleSelectPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "header-menu-simple-select",
      status: "review-ready",
      requiredPrimitives: ["menu-simple-select-control"],
      directTokenDependencies: [],
    });
    expect(headerMenuSimpleSelectPatternContract.consumerRules).toContain(
      "Consumers must not treat this pattern as a component seam, demo, canonical scenario, or app adoption seam.",
    );
  });
});
