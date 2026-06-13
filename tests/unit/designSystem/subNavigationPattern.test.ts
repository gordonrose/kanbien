import { describe, expect, it } from "vitest";

import {
  renderSubNavigationPattern,
  subNavigationPattern,
  subNavigationPatternContract,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/sub-navigation/index.mjs";

const breadcrumbs = [
  { id: "home", label: "Home", href: "#home" },
  { id: "workspace", label: "Workspace", href: "#workspace" },
  { id: "briefs", label: "Design briefs", href: "#briefs" },
  { id: "current", label: "Secondary navigation", current: true },
];

describe("sub-navigation pattern seam", () => {
  it("resolves the signed shell and row structure tokens with child primitive obligations", () => {
    const pattern = subNavigationPattern({
      id: "sub-navigation-test",
      mode: "compressed",
      breadcrumbs,
      searchValue: "brief",
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "sub-navigation",
      mode: "compressed",
      resolvedMode: "compressed",
      searchState: "filled",
      tokenDependencies: {
        standardPageShellFrame: {
          tokenName: "--standard-page-shell-frame",
          variantId: "standard-page-shell-frame-default",
        },
        subNavigationRowStructure: {
          tokenName: "--sub-navigation-row-structure",
          variantId: "sub-navigation-row-structure-default",
        },
      },
      behavior: {
        compressedRule: "breadcrumb reduces through the approved hidden-path reveal before search leaves the row",
      },
    });
    expect(pattern.behavior.responsiveRule).toContain("signed row-structure columns");
    expect(pattern.styleVars["--pattern-sub-navigation-column-count"]).toBe("24");
    expect(pattern.styleVars["--pattern-sub-navigation-breadcrumb-start"]).toBe("1");
    expect(pattern.styleVars["--pattern-sub-navigation-gap-start"]).toBe("8");
    expect(pattern.styleVars["--pattern-sub-navigation-gap-end"]).toBe("9");
    expect(pattern.styleVars["--pattern-sub-navigation-search-start"]).toBe("9");
    expect(pattern.styleVars["--pattern-sub-navigation-search-end"]).toBe("18");
    expect(pattern.styleVars["--pattern-sub-navigation-tooltip-layer"]).toBe("2147483000");
  });

  it("renders composition from governed breadcrumb and search-shell primitives", () => {
    const html = renderSubNavigationPattern({
      id: "sub-navigation-render",
      mode: "mobile",
      breadcrumbs,
      searchState: "active",
    });

    expect(html).toContain('data-sub-navigation=""');
    expect(html).toContain('data-sub-navigation-slot="mobile"');
    expect(html).toContain('data-breadcrumb-trail-control=""');
    expect(html).toContain('data-breadcrumb-trail-control-mode="mobile-hidden"');
    expect(html).toContain('data-search-shell-control=""');
    expect(html).toContain('data-search-shell-control-mode="mobile"');
    expect(html).toContain('data-search-field-control');
  });

  it("documents consumer boundaries and rejects unsupported states", () => {
    expect(subNavigationPatternContract.requiredPrimitives).toEqual([
      "breadcrumb-trail-control",
      "search-shell-control",
    ]);
    expect(subNavigationPatternContract.directTokenDependencies).toEqual([
      "standard-page-shell-frame",
      "sub-navigation-row-structure",
    ]);
    expect(subNavigationPatternContract.consumerRules.join(" ")).toContain("row-width negotiation");
    expect(() => subNavigationPattern({ mode: "drawer" })).toThrow('sub-navigation does not support mode "drawer".');
    expect(() => subNavigationPattern({ searchState: "loading" })).toThrow(
      'sub-navigation does not support searchState "loading".',
    );
  });
});
