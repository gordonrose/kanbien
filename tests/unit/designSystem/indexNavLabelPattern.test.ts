import { describe, expect, it } from "vitest";

import {
  indexNavLabelPattern,
  indexNavLabelPatternContract,
  renderIndexNavLabelPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/index-nav-label/index.mjs";

describe("index-nav-label pattern seam", () => {
  it("composes the accepted truncating-label primitive without direct token dependencies", () => {
    const pattern = indexNavLabelPattern({
      id: "identity-index-label",
      text: "Identity fields and source authority ownership model",
      slot: "primary-index",
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "index-nav-label",
      systemKey: "default",
      theme: "original",
      id: "identity-index-label",
      slot: "primary-index",
      primitive: {
        schema: "kanbien.designSystem.primitiveSpec.v1",
        primitiveName: "truncating-label",
        id: "identity-index-label-primitive",
      },
    });
    expect(pattern.primitive.tokenDependencies.labelTextStyle.tokenName).toBe("--label-text-style-short-default");
    expect(pattern.consumerRestrictions).toContain(
      "Consumers must not treat this pattern as a full nav item, route, selected state, count badge, or component seam.",
    );
  });

  it("blocks nested interactive hosts until a later focus-composition decision exists", () => {
    expect(() => indexNavLabelPattern({
      text: "Clickable host label",
      interactiveHost: true,
    })).toThrow(
      "index-nav-label cannot be nested inside an interactive host until a later governed focus-composition decision exists.",
    );
  });

  it("renders through the primitive seam rather than local truncation markup", () => {
    const html = renderIndexNavLabelPattern({
      id: "rendered-index-label",
      text: "Rendered <index> & label",
      slot: "secondary-index",
    });

    expect(html).toContain('data-index-nav-label=""');
    expect(html).toContain('data-index-nav-label-slot="secondary-index"');
    expect(html).toContain('data-truncating-label=""');
    expect(html).toContain('aria-label="Rendered &lt;index&gt; &amp; label"');
    expect(html).toContain('role="tooltip"');
    expect(html).not.toContain("pattern-proof-row");
    expect(html).not.toContain(" style=");
  });

  it("documents the pattern boundary", () => {
    expect(indexNavLabelPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "index-nav-label",
      status: "review-ready",
      requiredPrimitives: ["truncating-label"],
      directTokenDependencies: [],
    });
  });
});
