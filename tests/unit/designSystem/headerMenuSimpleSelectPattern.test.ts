import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  headerFilterOptions,
  headerLayerOptions,
  headerMenuSimpleSelectPattern,
  headerMenuSimpleSelectPatternContract,
  headerSortOptions,
  renderHeaderMenuSimpleSelectPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/header-menu-simple-select/index.mjs";
import { resolveDefaultGlyphPath } from "../../../src/frontend/designSystem/systems/default/glyphs/registry.mjs";

describe("header-menu-simple-select pattern seam", () => {
  it("composes the governed menu-simple-select-control primitive", () => {
    const pattern = headerMenuSimpleSelectPattern({
      id: "header-menu-select-test",
      value: "organizations",
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "header-menu-simple-select",
      value: "organizations",
      primitive: {
        primitiveName: "menu-simple-select-control",
        currentLabel: "Organizations",
      },
    });
    expect(pattern.primitive.tokenDependencies.menuSimpleSelectFrame.variantId).toBe(
      "menu-simple-select-trigger-frame-default",
    );
  });

  it("keeps the representative layer options available to the pattern", () => {
    expect(headerLayerOptions.map((option) => option.value)).toEqual([
      "chats",
      "tenants",
      "owners",
      "organizations",
      "deals",
      "locations",
      "business-units",
      "users",
    ]);
    expect(headerFilterOptions.map((option) => option.value)).toEqual(["selected", "ready", "needs-review", "blocked"]);
    expect(headerSortOptions.map((option) => option.value)).toEqual(["current", "name", "status"]);
  });

  it("supports icon trigger composition for one-column header controls", () => {
    const pattern = headerMenuSimpleSelectPattern({
      id: "header-menu-filter-icon-test",
      label: "Filter controls",
      triggerVariant: "icon",
      triggerIcon: "filter",
      value: "selected",
      options: headerFilterOptions,
    });
    const html = renderHeaderMenuSimpleSelectPattern({
      id: "header-menu-sort-icon-render",
      label: "Sort controls",
      triggerVariant: "icon",
      triggerIcon: "sort",
      value: "current",
      options: headerSortOptions,
    });

    expect(pattern.triggerVariant).toBe("icon");
    expect(pattern.triggerIcon).toBe("filter");
    expect(pattern.primitive.tokenDependencies.menuSimpleSelectFrame.variantId).toBe(
      "menu-simple-select-trigger-frame-icon",
    );
    expect(html).toContain('data-menu-simple-select-trigger-variant="icon"');
    expect(html).toContain('data-menu-simple-select-trigger-icon="sort"');
    expect(html).toContain(resolveDefaultGlyphPath("sort"));
  });

  it("renders through the primitive seam rather than local select markup", () => {
    const html = renderHeaderMenuSimpleSelectPattern({
      id: "header-menu-select-render",
    });

    expect(html).toContain("data-header-menu-simple-select");
    expect(html).toContain("data-menu-simple-select-control");
    expect(html).toContain("data-menu-simple-select-trigger");
    expect(html).toContain('role="listbox"');
    expect(html).not.toContain("form-select");
  });

  it("documents the pattern boundary", () => {
    expect(headerMenuSimpleSelectPatternContract).toMatchObject({
      schema: "kanbien.designSystem.patternContract.v1",
      patternName: "header-menu-simple-select",
      status: "review-ready",
      requiredPrimitives: ["menu-simple-select-control"],
      directTokenDependencies: [],
    });
    expect(headerMenuSimpleSelectPatternContract.consumerRules).toContain(
      "Consumers must not treat this pattern as a component seam, demo, canonical scenario, or app adoption seam.",
    );
  });

  it("fits the closed trigger to its governed header slot", () => {
    const styles = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/systems/default/assets/styles.css"),
      "utf8",
    );
    const wrapperRule = styles.match(/\.ds-header-menu-simple-select\s*\{[^}]+\}/)?.[0] ?? "";
    const controlRule = styles.match(/\.ds-header-menu-simple-select \.ds-menu-simple-select-control\s*\{[^}]+\}/)?.[0] ?? "";
    const triggerRule = styles.match(/\.ds-header-menu-simple-select \.ds-menu-simple-select-trigger\s*\{[^}]+\}/)?.[0] ?? "";

    expect(wrapperRule).toContain("inline-size: 100%;");
    expect(controlRule).toContain("inline-size: 100%;");
    expect(triggerRule).toContain("min-width: 0;");
    expect(triggerRule).toContain("max-width: 100%;");
  });
});
