import { describe, expect, it } from "vitest";

import {
  indexNavPanelPattern,
  indexNavPanelPatternContract,
  renderIndexNavPanelPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/index-nav-panel/index.mjs";

const items = [
  { value: "identity", label: "Identity", supportingText: "3 items" },
  { value: "workflow", label: "Workflow", supportingText: "10 fields" },
];

describe("index-nav-panel pattern seam", () => {
  it("composes the governed header, list, and add-button primitive with signed panel tokens", () => {
    const panel = indexNavPanelPattern({
      id: "primary-index-panel",
      title: "Primary index",
      currentValue: "identity",
      items,
    });

    expect(panel).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "index-nav-panel",
      tokenDependencies: {
        panelFrame: {
          tokenName: "--index-nav-panel-frame",
        },
        labelTextStyle: {
          tokenName: "--label-text-style-short-default",
        },
      },
      styleVars: {
        "--pattern-index-nav-panel-inline-size": "13rem",
      },
      attributes: {
        "data-index-nav-panel-mobile-breakpoint": "44rem",
      },
    });
  });

  it("renders panel header, add action, list, and empty state without route-local proof classes", () => {
    const html = renderIndexNavPanelPattern({
      id: "primary-index-panel",
      title: "Primary index",
      currentValue: "identity",
      items,
    });

    expect(html).toContain('data-index-nav-panel=""');
    expect(html).toContain('data-index-nav-panel-header-control=""');
    expect(html).toContain('data-index-nav-icon-button-control=""');
    expect(html).toContain('data-index-nav-list=""');
    expect(html).not.toContain("pattern-proof-row");

    const emptyHtml = renderIndexNavPanelPattern({
      id: "empty-index-panel",
      title: "Primary index",
      items: [],
      emptyMessage: "No sections yet.",
    });
    expect(emptyHtml).toContain('data-index-nav-panel-empty');
    expect(emptyHtml).toContain("No sections yet.");
  });

  it("guards unsupported width and mobile modes", () => {
    expect(() => indexNavPanelPattern({ items, widthMode: "triple" })).toThrow('index-nav-panel does not support widthMode "triple".');
    expect(() => indexNavPanelPattern({ items, mobileMode: "drawer" })).toThrow('index-nav-panel does not support mobileMode "drawer".');
  });

  it("documents the pattern boundary", () => {
    expect(indexNavPanelPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "index-nav-panel",
      requiredPatterns: ["index-nav-list"],
      requiredPrimitives: ["index-nav-panel-header-control", "index-nav-icon-button-control"],
      directTokenDependencies: ["index-nav-panel-frame", "label-text-style"],
    });
  });
});
