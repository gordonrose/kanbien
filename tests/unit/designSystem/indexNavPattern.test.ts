import { describe, expect, it } from "vitest";

import {
  indexNavPattern,
  indexNavPatternContract,
  renderIndexNavPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/index-nav/index.mjs";

const primaryItems = [
  { value: "identity", label: "Identity", supportingText: "3 items" },
  { value: "workflow", label: "Workflow", supportingText: "10 fields" },
];

const secondaryItems = [
  { value: "primary-details", label: "Primary Details", supportingText: "10 fields" },
  { value: "owning-feature", label: "Owning Feature", supportingText: "4 fields" },
];

describe("index-nav pattern seam", () => {
  it("composes one standard primary panel from the governed panel pattern", () => {
    const spec = indexNavPattern({
      id: "entity-index-nav",
      doubleWidth: false,
      primary: {
        title: "Primary index",
        currentValue: "identity",
        items: primaryItems,
      },
    });

    expect(spec).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "index-nav",
      doubleWidth: false,
      styleVars: {
        "--pattern-index-nav-gap": "0.75rem",
      },
      attributes: {
        "data-index-nav-mobile-breakpoint": "44rem",
      },
    });
  });

  it("uses a double-width primary panel when configured without a secondary panel", () => {
    const html = renderIndexNavPattern({
      id: "entity-index-nav",
      doubleWidth: true,
      primary: {
        title: "Primary index",
        currentValue: "identity",
        items: primaryItems,
      },
    });

    expect(html).toContain('data-index-nav=""');
    expect(html).toContain('data-index-nav-double-width="true"');
    expect(html).toContain('data-index-nav-panel-width-mode="double"');
    expect(html).not.toContain("pattern-proof-row");
  });

  it("renders primary and secondary panels as standard-width siblings", () => {
    const html = renderIndexNavPattern({
      id: "entity-index-nav",
      primary: {
        title: "Primary index",
        currentValue: "identity",
        items: primaryItems,
      },
      secondary: {
        title: "Secondary index",
        currentValue: "primary-details",
        items: secondaryItems,
      },
    });

    expect(html.match(/data-index-nav-panel=""/g)).toHaveLength(2);
    expect(html).toContain('data-index-nav-double-width="true"');
    expect(html.match(/data-index-nav-panel-width-mode="standard"/g)).toHaveLength(2);
  });

  it("documents the pattern boundary", () => {
    expect(indexNavPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "index-nav",
      requiredPatterns: ["index-nav-panel"],
      directTokenDependencies: ["index-nav-panel-frame"],
    });
  });
});
