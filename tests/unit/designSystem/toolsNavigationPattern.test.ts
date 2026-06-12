import { describe, expect, it } from "vitest";

import {
  renderToolsNavigationPattern,
  toolsNavigationPattern,
  toolsNavigationPatternContract,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/tools-navigation/index.mjs";

const items = [
  { id: "build", label: "Build", iconLabel: "B", value: "build", state: "active" },
  { id: "reports", label: "Reports", iconLabel: "R", value: "reports", state: "resting" },
];

describe("tools-navigation pattern seam", () => {
  it("resolves tools-navigation frame token and mobile-hidden behavior", () => {
    const pattern = toolsNavigationPattern({
      id: "tools-navigation-test",
      viewportMode: "mobile",
      items,
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "tools-navigation",
      viewportMode: "mobile",
      behavior: {
        desktopPositioning: "fixed right rail",
        mobileVisibility: "hidden",
      },
      tokenDependencies: {
        toolsNavigationFrame: {
          tokenName: "--tools-navigation-frame",
        },
      },
    });
  });

  it("renders a named rail composed from item primitives", () => {
    const html = renderToolsNavigationPattern({
      id: "tools-navigation-render",
      mode: "proof-contained",
      viewportMode: "desktop",
      items,
    });

    expect(html).toContain('data-tools-navigation=""');
    expect(html).toContain('data-tools-navigation-region="desktop-rail"');
    expect(html).toContain('aria-label="Tools navigation"');
    expect(html).toContain('data-tools-navigation-item-control=""');
    expect(html).toContain('data-icon-button-control=""');
    expect(html).toContain("Build");
  });

  it("documents the no-mobile-tools boundary", () => {
    expect(toolsNavigationPatternContract.consumerRules).toContain(
      "Mobile tools-navigation is hidden in this pattern version; consumers must not invent mobile tool drawers, overflow, bottom bars, or floating launchers.",
    );
  });
});
