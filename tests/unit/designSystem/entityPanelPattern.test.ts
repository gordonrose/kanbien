import { describe, expect, it } from "vitest";

import {
  entityPanelPattern,
  entityPanelPatternContract,
  renderEntityPanelPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/entity-panel/index.mjs";
import { resolveDefaultGlyphPath } from "../../../src/frontend/designSystem/systems/default/glyphs/registry.mjs";

describe("entity-panel pattern seam", () => {
  it("resolves signed panel-frame values and declares governed dependencies", () => {
    const panel = entityPanelPattern({
      id: "entity-panel-test",
      title: "Identity",
      secondaryItems: [{ label: "Primary Details", value: "primary-details" }],
    });

    expect(panel).toMatchObject({
      patternName: "entity-panel",
      tokenDependencies: {
        panelFrame: {
          tokenName: "--panel-frame",
          variantId: "panel-frame-default",
        },
      },
      mobileActiveRegion: "body",
    });
    expect(panel.styleVars["--pattern-entity-panel-gap"]).toBe("0.75rem");
    expect(entityPanelPatternContract).toMatchObject({
      requiredPatterns: ["index-nav-panel", "entity-body-panel"],
      requiredPrimitives: ["panel-header-control", "icon-button-control"],
      directTokenDependencies: ["panel-frame"],
    });
  });

  it("renders generic header, optional primary index, embedded secondary index, and governed body scroll region", () => {
    const html = renderEntityPanelPattern({
      id: "entity-panel-render",
      title: "Identity",
      primaryItems: [{ label: "Identity", value: "identity" }],
      primaryCurrent: "identity",
      showPrimaryIndex: true,
      primaryResizable: true,
      secondaryItems: [{ label: "Primary Details", value: "primary-details" }],
      bodyHtml: "<p>Body placeholder</p>",
    });

    expect(html).toContain('data-entity-panel=""');
    expect(html).toContain("data-panel-header-control");
    expect(html).toContain('aria-label="Close panel"');
    expect(html).toContain(resolveDefaultGlyphPath("close"));
    expect(html).toContain('data-entity-panel-region="primary-index"');
    expect(html).toContain('data-resize-handle-control-target-id="entity-panel-render-primary-index"');
    expect(html).toContain('data-index-nav-panel-header-mode="hidden"');
    expect(html).not.toContain('aria-label="Close secondary index"');
    expect(html).toContain("data-entity-body-panel");
    expect(html).toContain("data-body-region-control");
    expect(html).toContain("Body placeholder");
  });

  it("renders the supported hidden secondary-index and mobile active-region states", () => {
    const html = renderEntityPanelPattern({
      id: "entity-panel-state-render",
      title: "Identity",
      primaryItems: [{ label: "Identity", value: "identity" }],
      showPrimaryIndex: true,
      secondaryItems: [{ label: "Primary Details", value: "primary-details" }],
      showSecondaryIndex: false,
      mobileActiveRegion: "primary-index",
      bodyHtml: "<p>Body placeholder</p>",
    });

    expect(html).not.toContain('data-entity-panel-region="secondary-index"');
    expect(html).toContain('data-entity-panel-region="primary-index"');
    expect(html).toContain('data-entity-panel-mobile-active="primary-index"');
    expect(html).toContain("data-scroll-region-control");
  });

  it("guards unsupported mobile active regions", () => {
    expect(() =>
      entityPanelPattern({
        id: "entity-panel-invalid-region",
        title: "Identity",
        mobileActiveRegion: "activity-feed",
      }),
    ).toThrow('entity-panel does not support mobileActiveRegion "activity-feed".');
  });

  it("can render the embedded secondary index header with a governed add action", () => {
    const html = renderEntityPanelPattern({
      id: "entity-panel-secondary-header",
      title: "Identity",
      secondaryItems: [{ label: "Primary Details", value: "primary-details" }],
      showSecondaryHeader: true,
      secondaryActionLabel: "Add secondary index item",
      secondaryActionIcon: "plus",
      bodyHtml: "<p>Body placeholder</p>",
    });

    expect(html).toContain('data-index-nav-panel-header-mode="shown"');
    expect(html).toContain('aria-label="Add secondary index item"');
    expect(html).toContain(resolveDefaultGlyphPath("plus"));
  });

  it("can pass the governed resize handle through to the embedded secondary index", () => {
    const html = renderEntityPanelPattern({
      id: "entity-panel-secondary-resize",
      title: "Identity",
      secondaryItems: [{ label: "Primary Details", value: "primary-details" }],
      secondaryResizable: true,
      bodyHtml: "<p>Body placeholder</p>",
    });

    expect(html).toContain('data-index-nav-panel-resizable="true"');
    expect(html).toContain('data-resize-handle-control=""');
    expect(html).toContain('data-resize-handle-control-target-id="entity-panel-secondary-resize-secondary-index"');
  });
});
