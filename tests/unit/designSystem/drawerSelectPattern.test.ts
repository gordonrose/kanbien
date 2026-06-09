import { describe, expect, it } from "vitest";

import {
  drawerSelectPattern,
  drawerSelectPatternContract,
  renderDrawerSelectPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/drawer-select/index.mjs";

const options = [
  { value: "record-page", label: "Record management page", supportingText: "A standard page template." },
  { value: "list-centric", label: "Record management list centric", supportingText: "A list-centric template." },
  { value: "workflow", label: "Workflow routing and operational handoff posture", supportingText: "Long option." },
];

describe("drawer-select pattern", () => {
  it("declares only governed primitive and pattern dependencies", () => {
    expect(drawerSelectPatternContract.requiredPrimitives).toEqual([
      "count-card-control",
      "icon-button-control",
      "panel-header-control",
      "text-action-button-control",
    ]);
    expect(drawerSelectPatternContract.requiredPatterns).toEqual(["panel-stack", "searchable-selection-panel"]);
    expect(drawerSelectPatternContract.directTokenDependencies).toEqual(["drawer-overlay-placement"]);
  });

  it("composes trigger, header, stack, searchable selection, and action primitives", () => {
    const pattern = drawerSelectPattern({
      id: "page-template-drawer",
      label: "Page template",
      mode: "multi",
      open: true,
      committedValues: ["record-page"],
      pendingValues: ["record-page", "workflow"],
      options,
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "drawer-select",
      pendingChanged: true,
      primitives: {
        trigger: { primitiveName: "count-card-control" },
        header: { primitiveName: "panel-header-control" },
        apply: { primitiveName: "text-action-button-control" },
        cancel: { primitiveName: "text-action-button-control" },
      },
      patterns: {
        panelStack: { patternName: "panel-stack", theme: "original" },
        searchableSelectionPanel: { patternName: "searchable-selection-panel" },
      },
      tokenDependencies: {
        drawerOverlayPlacement: {
          tokenName: "--drawer-overlay-placement-page-shell",
          variantId: "drawer-overlay-placement-page-shell",
        },
      },
    });
  });

  it("renders closed state as a trigger without drawer panel markup", () => {
    const html = renderDrawerSelectPattern({
      id: "page-template-drawer",
      label: "Page template",
      mode: "multi",
      open: false,
      committedValues: ["record-page", "list-centric"],
      options,
    });

    expect(html).toContain('data-count-card-control=""');
    expect(html).toContain("2 selected");
    expect(html).not.toContain('data-panel-stack=""');
    expect(html).not.toContain('data-searchable-selection-panel=""');
  });

  it("renders open state by composing governed child seams", () => {
    const html = renderDrawerSelectPattern({
      id: "page-template-drawer",
      label: "Page template",
      mode: "single",
      open: true,
      committedValue: "record-page",
      pendingValues: ["workflow"],
      query: "workflow",
      theme: "dark",
      origin: "left",
      viewport: "mobile",
      options,
    });

    expect(html).toContain('data-panel-stack=""');
    expect(html).toContain('data-panel-stack-theme="dark"');
    expect(html).toContain('data-panel-surface-control-theme="dark"');
    expect(html).toContain("--primitive-panel-surface-background: #171b22");
    expect(html).toContain('data-panel-stack-origin="left"');
    expect(html).toContain('data-panel-stack-viewport="mobile"');
    expect(html).toContain('data-drawer-select-overlay="page-shell"');
    expect(html).toContain("--pattern-drawer-overlay-position: fixed");
    expect(html).toContain("--pattern-drawer-overlay-inset: var(--drawer-overlay-page-shell-inset, 4rem 0 0 4.25rem)");
    expect(html).toContain('data-searchable-selection-panel=""');
    expect(html).toContain('data-panel-header-control=""');
    expect(html).toContain('data-text-action-button-control-value="apply"');
    expect(html).toContain('data-text-action-button-control-value="cancel"');
    expect(html).not.toContain('data-radio-simple-select=""');
  });

  it("rejects unsupported modes and placement before consumers can invent variants", () => {
    expect(() =>
      drawerSelectPattern({
        mode: "combobox",
        options,
      }),
    ).toThrow('drawer-select does not support mode "combobox".');

    expect(() =>
      drawerSelectPattern({
        origin: "center",
        options,
      }),
    ).toThrow('drawer-select does not support origin "center".');
  });
});
