import { describe, expect, it } from "vitest";

import {
  renderTopNavigationPattern,
  topNavigationPattern,
  topNavigationPatternContract,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/top-navigation/index.mjs";

const destinations = [
  { id: "home", label: "Home", href: "#home", value: "home" },
  { id: "data", label: "Data", href: "#data", value: "data" },
  { id: "build", label: "Build", href: "#build", value: "build", current: true },
  { id: "reports", label: "Reports", href: "#reports", value: "reports" },
];
const profileLinks = [{ id: "account", label: "Account", href: "#account" }];

describe("top-navigation pattern seam", () => {
  it("resolves signed top-navigation and shell frame tokens", () => {
    const pattern = topNavigationPattern({
      id: "top-navigation-test",
      mode: "overflow",
      openSurface: "overflow",
      destinations,
      profileLinks,
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "top-navigation",
      mode: "overflow",
      openSurface: "overflow",
      tokenDependencies: {
        topNavigationFrame: {
          tokenName: "--top-navigation-frame-chrome-original",
        },
        topNavigationMenuFrame: {
          tokenName: "--top-navigation-frame-menu-panel-original",
        },
        standardPageShellFrame: {
          tokenName: "--standard-page-shell-frame",
        },
      },
      behavior: {
        overflowVisibleDestinationRule: "first two destinations plus More trigger",
      },
    });
  });

  it("renders composition from governed brand, link, and trigger primitives", () => {
    const html = renderTopNavigationPattern({
      id: "top-navigation-render",
      mode: "overflow",
      openSurface: "overflow",
      brand: { label: "Kanbien", mark: "K", href: "#brand" },
      destinations,
      profileLinks,
    });

    expect(html).toContain('data-top-navigation=""');
    expect(html).toContain('data-top-navigation-brand-control=""');
    expect(html).toContain('data-top-navigation-link-control=""');
    expect(html).toContain('data-top-navigation-trigger-control=""');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('data-top-navigation-surface="overflow"');
  });

  it("documents consumer boundaries", () => {
    expect(topNavigationPatternContract.requiredPrimitives).toEqual([
      "top-navigation-brand-control",
      "top-navigation-link-control",
      "top-navigation-trigger-control",
    ]);
    expect(topNavigationPatternContract.consumerRules.join(" ")).toContain("app-local CSS");
  });
});
