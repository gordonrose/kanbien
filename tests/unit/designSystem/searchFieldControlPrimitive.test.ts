import { describe, expect, it } from "vitest";

import {
  renderSearchFieldControlPrimitive,
  searchFieldControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/search-field-control/index.mjs";

describe("search-field-control primitive", () => {
  it("renders a native search input wired to a primitive-owned label and signed tokens", () => {
    const spec = searchFieldControlPrimitive({
      id: "search-field-test",
      label: "Search templates",
      value: "record",
      placeholder: "Search options",
    });

    expect(spec).toMatchObject({
      primitiveName: "search-field-control",
      ids: {
        inputId: "search-field-test-input",
        labelId: "search-field-test-label",
      },
      tokenDependencies: {
        textControlFrame: { variantId: "text-control-frame-default" },
        fieldValueTextStyle: { variantId: "field-value-text-style-default" },
        minimumTargetSize: { variantId: "target-size-interactive-all" },
      },
    });

    const html = renderSearchFieldControlPrimitive({
      id: "search-field-test",
      label: "Search templates",
      value: "record",
      placeholder: "Search options",
    });

    expect(html).toContain('data-search-field-control');
    expect(html).toContain('<input id="search-field-test-input"');
    expect(html).toContain('type="search"');
    expect(html).toContain('aria-labelledby="search-field-test-label"');
    expect(html).toContain('placeholder="Search options"');
    expect(html).not.toContain('type="text"');
  });

  it("maps states to native attributes and rejects unsupported states", () => {
    expect(searchFieldControlPrimitive({ state: "default" }).tokenDependencies.textControlFrame).toMatchObject({
      variantId: "text-control-frame-default",
    });
    expect(searchFieldControlPrimitive({ state: "disabled" }).tokenDependencies.textControlFrame).toMatchObject({
      variantId: "text-control-frame-disabled",
    });
    expect(renderSearchFieldControlPrimitive({ state: "disabled" })).toContain("disabled");
    expect(searchFieldControlPrimitive({ state: "error" }).tokenDependencies.textControlFrame).toMatchObject({
      variantId: "text-control-frame-error",
    });
    expect(renderSearchFieldControlPrimitive({ state: "error" })).toContain('aria-invalid="true"');
    expect(() => searchFieldControlPrimitive({ state: "loading" })).toThrow(
      'search-field-control does not support state "loading".',
    );
  });

  it("keeps filtering, selected grouping, and count summaries out of the primitive", () => {
    const spec = searchFieldControlPrimitive();

    expect(spec.consumerRestrictions).toContain(
      "Consumers must not add filtering, selected grouping, async loading, count summaries, or drawer behavior inside this primitive.",
    );
    expect(JSON.stringify(spec)).not.toContain("selectedCount");
    expect(JSON.stringify(spec)).not.toContain("results");
  });
});
