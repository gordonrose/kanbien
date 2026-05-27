import { describe, expect, it } from "vitest";

import {
  indexNavListPattern,
  indexNavListPatternContract,
  renderIndexNavListPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/index-nav-list/index.mjs";

const items = [
  { value: "identity", label: "Identity", supportingText: "3 items" },
  { value: "workflow", label: "Workflow", supportingText: "10 fields" },
];

describe("index-nav-list pattern seam", () => {
  it("composes index-nav-item entries with a signed list gap token", () => {
    const list = indexNavListPattern({
      id: "primary-index",
      ariaLabel: "Primary index",
      currentValue: "identity",
      items,
    });

    expect(list).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "index-nav-list",
      tokenDependencies: {
        listGap: {
          tokenName: "--index-nav-list-gap",
        },
      },
      styleVars: {
        "--pattern-index-nav-list-gap": "0.5rem",
      },
    });
  });

  it("renders nav list semantics and delegates item behavior to index-nav-item", () => {
    const html = renderIndexNavListPattern({
      id: "primary-index",
      ariaLabel: "Primary index",
      currentValue: "identity",
      items,
    });

    expect(html).toContain("<nav");
    expect(html).toContain("<ul");
    expect(html).toContain("<li");
    expect(html).toContain('aria-label="Primary index"');
    expect(html).toContain('data-index-nav-item=""');
    expect(html).toContain('data-index-nav-item-control=""');
    expect(html).not.toContain("pattern-proof-row");
  });

  it("guards invalid item data and duplicate current values", () => {
    expect(() => indexNavListPattern({ items: [] })).toThrow("items must be a non-empty array.");
    expect(() => indexNavListPattern({ items: [{ value: "x", label: "" }] })).toThrow("items[0].label must be a non-empty string.");
    expect(() =>
      indexNavListPattern({
        currentValue: "same",
        items: [
          { value: "same", label: "One" },
          { value: "same", label: "Two" },
        ],
      }),
    ).toThrow("currentValue must match at most one item.");
  });

  it("documents the pattern boundary", () => {
    expect(indexNavListPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "index-nav-list",
      status: "review-ready",
      requiredPatterns: ["index-nav-item"],
      directTokenDependencies: ["index-nav-list-gap"],
    });
  });
});
