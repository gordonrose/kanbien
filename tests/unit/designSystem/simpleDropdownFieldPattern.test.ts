import { describe, expect, it } from "vitest";

import {
  renderSimpleDropdownFieldPattern,
  simpleDropdownFieldPattern,
  simpleDropdownFieldPatternContract,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/simple-dropdown-field/index.mjs";

describe("simple-dropdown-field pattern", () => {
  it("composes field-row and dropdown primitives without direct token consumption", () => {
    const spec = simpleDropdownFieldPattern({
      id: "dropdown-field-test",
      name: "pageTemplate",
      label: "Page template",
      helperText: "Choose one page template.",
      selectedValue: "page",
      options: [{ value: "page", label: "Page" }],
    });

    expect(spec).toMatchObject({
      patternName: "simple-dropdown-field",
      state: "default",
    });
    expect(spec.primitives.fieldRow.primitiveName).toBe("field-row-control");
    expect(spec.primitives.dropdown.primitiveName).toBe("simple-dropdown-control");
    expect(simpleDropdownFieldPatternContract.directTokenDependencies).toEqual([]);
  });

  it("renders a labelled dropdown field and preserves error wiring", () => {
    const html = renderSimpleDropdownFieldPattern({
      id: "dropdown-field-test",
      name: "pageTemplate",
      label: "Page template",
      state: "error",
      errorText: "Choose a page template.",
      options: [{ value: "page", label: "Page" }],
    });

    expect(html).toContain("ds-field-row-control");
    expect(html).toContain("ds-simple-dropdown-control");
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain("Choose a page template.");
  });
});
