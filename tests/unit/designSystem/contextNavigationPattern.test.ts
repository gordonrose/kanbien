import { describe, expect, it } from "vitest";

import {
  contextNavigationPattern,
  contextNavigationPatternContract,
  renderContextNavigationPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/context-navigation/index.mjs";
import { resolveDefaultGlyphPath } from "../../../src/frontend/designSystem/systems/default/glyphs/registry.mjs";

const primaryItems = [
  { id: "overview", value: "overview", label: "Overview", icon: "home", kind: "destination", href: "/design-system", state: "current" },
  { id: "components", value: "components", label: "Components", icon: "grid", kind: "destination", href: "/design-system/components", state: "resting" },
  { id: "patterns", value: "patterns", label: "Patterns", icon: "context-list", kind: "destination", href: "/design-system/patterns", state: "resting" },
  { id: "templates", value: "templates", label: "Templates", icon: "doc", kind: "destination", href: "/design-system/templates", state: "resting" },
  { id: "tokens", value: "tokens", label: "Tokens", icon: "token", kind: "destination", href: "/design-system/tokens", state: "resting" },
  { id: "motion", value: "motion", label: "Motion", icon: "spark", kind: "destination", href: "/design-system/motion", state: "resting" },
];

const utilityItems = [
  { id: "filters", value: "filters", label: "Filters", icon: "context-filter", kind: "utility", state: "resting" },
  { id: "accessibility", value: "accessibility", label: "Access", icon: "accessibility", kind: "utility", state: "resting" },
];

describe("context-navigation pattern seam", () => {
  it("resolves signed frame token and item inputs", () => {
    const pattern = contextNavigationPattern({
      id: "context-navigation-test",
      viewportMode: "desktop",
      primaryItems,
      utilityItems,
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "context-navigation",
      systemKey: "default",
      theme: "original",
      id: "context-navigation-test",
      viewportMode: "desktop",
      tokenDependencies: {
        contextNavigationFrame: {
          tokenName: "--context-navigation-frame",
        },
      },
      behavior: {
        primaryScroll: "primary zone flexes and scrolls with overscroll-behavior: contain",
        utilityAnchor: "bottom utility zone remains anchored with margin-top: auto",
      },
    });
    expect(pattern.primaryItems).toHaveLength(6);
    expect(pattern.utilityItems).toHaveLength(2);
    expect(pattern.mobileItems).toHaveLength(8);
  });

  it("renders desktop rail and mobile bottom bar through governed primitives", () => {
    const html = renderContextNavigationPattern({
      id: "context-navigation-render",
      mode: "proof-contained",
      viewportMode: "mobile",
      primaryItems,
      utilityItems,
    });

    expect(html).toContain('data-context-navigation=""');
    expect(html).toContain('data-context-navigation-region="desktop-rail"');
    expect(html).toContain('data-context-navigation-region="mobile-bottom-bar"');
    expect(html).toContain('data-context-navigation-item-control=""');
    expect(html).toContain('data-context-navigation-bottom-bar=""');
    expect(html).toContain('data-context-navigation-overflow-menu=""');
    expect(html).toContain("Tokens");
    expect(html).toContain("Access");
    expect(html).toContain(resolveDefaultGlyphPath("home"));
    expect(html).toContain(resolveDefaultGlyphPath("context-list"));
    expect(html).toContain('aria-current="page"');
    expect(html).not.toContain("context-nav-item ");
  });

  it("rejects unsupported proof and viewport modes", () => {
    expect(() => contextNavigationPattern({ viewportMode: "tablet" })).toThrow(
      'context-navigation does not support viewportMode "tablet".',
    );
    expect(() => contextNavigationPattern({ mode: "floating" })).toThrow(
      'context-navigation does not support mode "floating".',
    );
  });

  it("documents the pattern boundary", () => {
    expect(contextNavigationPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "context-navigation",
      status: "review-ready",
      requiredPrimitives: [
        "context-navigation-item-control",
        "context-navigation-bottom-bar",
        "context-navigation-overflow-menu",
      ],
      directTokenDependencies: ["context-navigation-frame"],
    });
    expect(contextNavigationPatternContract.consumerRules).toContain(
      "Consumers must not treat this pattern as a routed app shell, component seam, drawer implementation, or app adoption seam.",
    );
  });
});
