import { describe, expect, it } from "vitest";

import {
  renderStandardPageShellPattern,
  standardPageShellPattern,
  standardPageShellPatternContract,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/standard-page-shell/index.mjs";

describe("standard-page-shell pattern seam", () => {
  it("resolves the signed shell frame token and required child pattern seams", () => {
    const pattern = standardPageShellPattern({ id: "standard-page-shell-test" });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "standard-page-shell",
      tokenDependencies: {
        standardPageShellFrame: {
          tokenName: "--standard-page-shell-frame",
          variantId: "standard-page-shell-frame-default",
        },
      },
      patternDependencies: {
        subNavigation: "src/frontend/designSystem/layers/04-pattern-contract/sub-navigation/index.mjs#subNavigationPattern",
      },
    });
  });

  it("renders standard shell by consuming governed child patterns", () => {
    const html = renderStandardPageShellPattern({
      id: "standard-page-shell-render",
      subNavigation: {
        breadcrumbs: [
          { id: "home", label: "Home", href: "#home" },
          { id: "current", label: "Current", current: true },
        ],
      },
    });

    expect(html).toContain('data-standard-page-shell=""');
    expect(html).toContain('data-top-navigation=""');
    expect(html).toContain('data-sub-navigation=""');
    expect(html).toContain('data-context-navigation=""');
    expect(html).toContain('data-tools-navigation=""');
    expect(html).toContain('data-breadcrumb-trail-control=""');
    expect(html).toContain('data-search-shell-control=""');
  });

  it("documents the Layer 4 boundary", () => {
    expect(standardPageShellPatternContract.requiredPatterns).toEqual([
      "top-navigation",
      "sub-navigation",
      "context-navigation",
      "tools-navigation",
    ]);
    expect(standardPageShellPatternContract.consumerRules.join(" ")).toContain("Layer 4 pattern");
    expect(() => standardPageShellPattern({ mode: "app" })).toThrow(
      'standard-page-shell does not support mode "app".',
    );
  });
});
