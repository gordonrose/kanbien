import { describe, expect, it } from "vitest";

import {
  cardListSelectPrimitive,
  renderCardListSelectPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/card-list-select/index.mjs";

const options = [
  { value: "email", label: "Email" },
  { value: "description", label: "Description" },
  { value: "owner", label: "Owner" },
];

describe("card-list-select primitive", () => {
  it("renders a native checkbox group wired to signed card-list tokens", () => {
    const spec = cardListSelectPrimitive({
      id: "card-list-select-test",
      name: "listDisplay",
      label: "List display",
      variant: "visibility",
      selectedValues: ["email"],
      columns: 2,
      options,
    });

    expect(spec).toMatchObject({
      primitiveName: "card-list-select",
      variant: "visibility",
      tokenDependencies: {
        choiceOptionFrameDefault: { variantId: "choice-option-frame-default-original" },
        choiceOptionFrameError: { variantId: "choice-option-frame-error-original" },
        choiceCardStateAffordanceVisible: { variantId: "choice-card-state-affordance-visible-original" },
        choiceGroupLayout: { variantId: "choice-group-layout-2-column" },
      },
    });

    const html = renderCardListSelectPrimitive({
      id: "card-list-select-test",
      name: "listDisplay",
      label: "List display",
      variant: "visibility",
      selectedValues: ["email"],
      columns: 2,
      options,
    });

    expect(html).toContain("<fieldset");
    expect(html).toContain("<legend");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('name="listDisplay"');
    expect(html).toContain('data-card-list-select-glyph-semantic="visibility-on"');
    expect(html).toContain('data-card-list-select-glyph-semantic="visibility-off"');
    expect(html).toContain("<svg");
    expect(html).toContain("Visible");
    expect(html).toContain("Hidden");
  });

  it("supports priority ranking and rejects invalid variants or columns", () => {
    const spec = cardListSelectPrimitive({
      variant: "priority",
      selectedValues: ["description", "email"],
      priorityOrder: ["description", "email"],
      options,
    });

    expect(spec.priorityOrder).toEqual(["description", "email"]);
    expect(renderCardListSelectPrimitive({ variant: "priority", selectedValues: ["email"], options })).toContain("Priority 1");
    expect(renderCardListSelectPrimitive({ variant: "priority", selectedValues: ["email"], options })).toContain(
      'data-card-list-select-glyph-semantic="selected-check"',
    );
    expect(renderCardListSelectPrimitive({ variant: "priority", selectedValues: [], options })).toContain("Not on");
    expect(renderCardListSelectPrimitive({ variant: "priority", selectedValues: [], options })).toContain(
      'data-card-list-select-glyph-semantic="not-selected-x"',
    );
    expect(() => cardListSelectPrimitive({ variant: "radio", options })).toThrow(
      'card-list-select does not support variant "radio".',
    );
    expect(() => cardListSelectPrimitive({ columns: 5, options })).toThrow(
      "card-list-select columns must be 1, 2, 3, or 4.",
    );
  });

  it("supports error state and visually hidden semantic legends for field composition", () => {
    const html = renderCardListSelectPrimitive({
      state: "error",
      legendPresentation: "visually-hidden",
      selectedValues: [],
      options,
    });

    expect(html).toContain('data-card-list-select-state="error"');
    expect(html).toContain('data-card-list-select-option-state="error"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('data-card-list-select-legend-presentation="visually-hidden"');
    expect(() => cardListSelectPrimitive({ legendPresentation: "hidden", options })).toThrow(
      'card-list-select legendPresentation must be "visible" or "visually-hidden".',
    );
  });
});
