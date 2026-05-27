import { describe, expect, it } from "vitest";

import {
  indexNavItemPattern,
  indexNavItemPatternContract,
  renderIndexNavItemPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/index-nav-item/index.mjs";

describe("index-nav-item pattern seam", () => {
  it("composes the governed index-nav-item-control primitive", () => {
    const item = indexNavItemPattern({
      id: "identity-index-item",
      label: "Identity and source authority ownership model",
      supportingText: "3 items",
      state: "current",
    });

    expect(item).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "index-nav-item",
      systemKey: "default",
      theme: "original",
      state: "current",
      primitive: {
        primitiveName: "index-nav-item-control",
        current: true,
      },
    });
    expect(item.primitive.tokenDependencies.surface.tokenName).toBe("--index-nav-item-surface-current-original");
  });

  it("renders through the primitive seam rather than route-local card markup", () => {
    const html = renderIndexNavItemPattern({
      id: "rendered-index-item",
      label: "Rendered index item",
      state: "disabled",
    });

    expect(html).toContain('data-index-nav-item=""');
    expect(html).toContain('data-index-nav-item-control=""');
    expect(html).toContain("disabled");
    expect(html).not.toContain("pattern-proof-row");
  });

  it("documents the pattern boundary", () => {
    expect(indexNavItemPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "index-nav-item",
      status: "review-ready",
      requiredPrimitives: ["index-nav-item-control"],
      directTokenDependencies: [],
    });
    expect(indexNavItemPatternContract.consumerRules).toContain(
      "Consumers must not treat this pattern as a full index list, tablist, route, component seam, template, or app adoption seam.",
    );
  });
});
