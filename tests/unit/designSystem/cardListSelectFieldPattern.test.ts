import { describe, expect, it } from "vitest";

import {
  cardListSelectFieldPattern,
  cardListSelectFieldPatternContract,
  renderCardListSelectFieldPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/card-list-select-field/index.mjs";

const options = [
  { value: "email", label: "Email" },
  { value: "description", label: "Description" },
  { value: "owner", label: "Owner" },
];

describe("card-list-select-field pattern", () => {
  it("composes field-row-control and card-list-select without direct token consumption", () => {
    const pattern = cardListSelectFieldPattern({
      id: "list-display-field",
      name: "listDisplay",
      label: "List display",
      helperText: "Choose visible fields.",
      selectedValues: ["email"],
      variant: "visibility",
      columns: 2,
      options,
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "card-list-select-field",
      primitives: {
        fieldRow: { primitiveName: "field-row-control" },
        cardList: {
          primitiveName: "card-list-select",
          legendPresentation: "visually-hidden",
        },
      },
    });
    expect(cardListSelectFieldPatternContract.directTokenDependencies).toEqual([]);
  });

  it("renders through governed primitive seams", () => {
    const html = renderCardListSelectFieldPattern({
      id: "list-display-field",
      name: "listDisplay",
      label: "List display",
      helperText: "Choose visible fields.",
      selectedValues: ["email"],
      variant: "visibility",
      columns: 2,
      options,
    });

    expect(html).toContain('data-card-list-select-field=""');
    expect(html).toContain("data-field-row-control");
    expect(html).toContain('data-card-list-select=""');
    expect(html).toContain('data-card-list-select-legend-presentation="visually-hidden"');
    expect(html).not.toContain("pattern-proof-controls");
  });

  it("maps field state consistently to child primitives", () => {
    const disabled = cardListSelectFieldPattern({ state: "disabled", options });
    expect(disabled.primitives.fieldRow.state).toBe("disabled");
    expect(disabled.primitives.cardList.state).toBe("disabled-group");

    const error = renderCardListSelectFieldPattern({
      id: "list-display-error-field",
      state: "error",
      errorText: "Choose at least one field.",
      options,
    });
    expect(error).toContain('data-field-row-control-message="error"');
    expect(error).toContain('data-card-list-select-state="error"');
    expect(error).toContain('aria-invalid="true"');
    expect(error).toContain('aria-describedby="list-display-error-field-field-row-error"');
    expect(() => cardListSelectFieldPattern({ state: "read-only", options })).toThrow(
      'card-list-select-field does not support state "read-only".',
    );
  });
});
