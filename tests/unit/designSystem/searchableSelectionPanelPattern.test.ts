import { describe, expect, it } from "vitest";

import {
  renderSearchableSelectionPanelPattern,
  searchableSelectionPanelPattern,
  searchableSelectionPanelPatternContract,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/searchable-selection-panel/index.mjs";

const options = [
  { value: "record-page", label: "Record management page", supportingText: "A standard page template." },
  { value: "list-centric", label: "Record management list centric", supportingText: "A list centric template." },
  { value: "workflow", label: "Workflow routing and operational handoff posture", supportingText: "Long option." },
];

describe("searchable-selection-panel pattern", () => {
  it("composes governed primitives and consumes direct signed tokens", () => {
    const pattern = searchableSelectionPanelPattern({
      id: "template-panel",
      selectionMode: "multi",
      selectedValues: ["record-page"],
      options,
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "searchable-selection-panel",
      primitives: {
        scrollRegion: { primitiveName: "scroll-region-control" },
        search: { primitiveName: "search-field-control" },
      },
      tokenDependencies: {
        bodyRegionFrame: { tokenName: "--body-region-frame" },
        backgroundColorSurface: { tokenName: "--background-surface-original" },
        feedbackTextStyle: { tokenName: "--feedback-text-style-neutral-original" },
      },
    });
    expect(searchableSelectionPanelPatternContract.directTokenDependencies).toEqual([
      "body-region-frame",
      "background-color",
      "feedback-text-style",
    ]);
  });

  it("renders multi-select selected and available groups through card-list-select", () => {
    const html = renderSearchableSelectionPanelPattern({
      id: "template-panel",
      selectionMode: "multi",
      selectedValues: ["record-page"],
      query: "workflow",
      options,
    });

    expect(html).toContain('data-searchable-selection-panel=""');
    expect(html).toContain("data-search-field-control");
    expect(html).toContain("data-scroll-region-control");
    expect(html).toContain('aria-label="Selected options"');
    expect(html).toContain('aria-label="Available options"');
    expect(html).toContain('data-card-list-select=""');
    expect(html).toContain('data-card-list-select-affordance-presentation="text-only"');
    expect(html).not.toContain('class="ds-card-list-select-affordance"');
    expect(html).toContain("Record management page");
    expect(html).toContain("Workflow routing and operational handoff posture");
    expect(html).not.toContain("pattern-proof-controls");
  });

  it("renders single-select through the same selected and available card groups as multi-select", () => {
    const html = renderSearchableSelectionPanelPattern({
      id: "template-panel",
      selectionMode: "single",
      selectedValue: "record-page",
      query: "workflow",
      options,
    });

    expect(html).not.toContain('data-radio-simple-select=""');
    expect(html).toContain('aria-label="Selected options"');
    expect(html).toContain('aria-label="Available options"');
    expect(html).toContain('data-card-list-select=""');
    expect(html).toContain('data-card-list-select-affordance-presentation="text-only"');
    expect(html).toContain("Record management page");
    expect(html).toContain("Workflow routing and operational handoff posture");
  });

  it("rejects unsupported modes before downstream consumers can invent behavior", () => {
    expect(() =>
      searchableSelectionPanelPattern({
        selectionMode: "drawer",
        options,
      }),
    ).toThrow('searchable-selection-panel does not support selectionMode "drawer".');
  });

  it("uses feedback text tokens for non-field status messages", () => {
    const noMatch = searchableSelectionPanelPattern({
      id: "template-panel",
      query: "missing",
      options,
    });
    const error = searchableSelectionPanelPattern({
      id: "template-panel-error",
      state: "error",
      theme: "dark",
      options,
    });

    expect(noMatch).toMatchObject({
      state: "no-match",
      tokenDependencies: {
        feedbackTextStyle: { tokenName: "--feedback-text-style-neutral-original" },
      },
    });
    expect(error).toMatchObject({
      state: "error",
      tokenDependencies: {
        feedbackTextStyle: { tokenName: "--feedback-text-style-error-dark" },
      },
    });

    const html = renderSearchableSelectionPanelPattern({
      id: "template-panel",
      query: "missing",
      options,
    });

    expect(html).toContain("--pattern-searchable-selection-feedback-foreground");
    expect(html).toContain("No available options match the current search.");
  });
});
