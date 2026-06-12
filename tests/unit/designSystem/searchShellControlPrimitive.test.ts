import { describe, expect, it } from "vitest";

import {
  renderSearchShellControlPrimitive,
  searchShellControlPrimitive,
  searchShellControlPrimitiveContract,
} from "../../../src/frontend/designSystem/layers/03-primitive/search-shell-control/index.mjs";

describe("search-shell-control primitive", () => {
  it("wraps the governed search-field-control primitive and shell max-width token", () => {
    const spec = searchShellControlPrimitive({
      id: "search-shell-test",
      label: "Search records",
      placeholder: "Search records",
      value: "brief",
    });

    expect(spec).toMatchObject({
      primitiveName: "search-shell-control",
      state: "filled",
      tokenDependencies: {
        standardPageShellFrame: { variantId: "standard-page-shell-frame-default" },
        searchFieldControl: { primitiveName: "search-field-control" },
      },
    });
    expect(spec.styleVars["--primitive-search-shell-max-inline-size"]).toBe("40rem");
  });

  it("renders native search semantics without inventing results or routing behavior", () => {
    const html = renderSearchShellControlPrimitive({
      id: "search-shell-render",
      label: "Search records",
      placeholder: "Search records",
      value: "brief",
      hint: "Enter",
    });

    expect(html).toContain('role="search"');
    expect(html).toContain('data-search-shell-control=""');
    expect(html).toContain("data-search-field-control");
    expect(html).toContain('type="search"');
    expect(html).toContain("Press");
    expect(html).toContain("Enter");
    expect(html).not.toContain("results");
  });

  it("uses mobile full-width behavior and keeps result ownership out of scope", () => {
    const spec = searchShellControlPrimitive({ mode: "mobile" });
    const html = renderSearchShellControlPrimitive({ mode: "mobile" });

    expect(spec.styleVars["--primitive-search-shell-max-inline-size"]).toBe("none");
    expect(html).toContain('data-search-shell-control-mode="mobile"');
    expect(html).toContain("hidden");
    expect(searchShellControlPrimitiveContract.requiredTokens).toEqual(["standard-page-shell-frame"]);
    expect(searchShellControlPrimitiveContract.primitiveDependencies).toEqual(["search-field-control"]);
    expect(searchShellControlPrimitiveContract.consumerRules.join(" ")).toContain("backend search");
  });
});
