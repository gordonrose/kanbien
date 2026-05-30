import { describe, expect, it } from "vitest";

import {
  radioSimpleSelectFieldPattern,
  radioSimpleSelectFieldPatternContract,
  renderRadioSimpleSelectFieldPattern,
} from "../../../src/frontend/designSystem/layers/04-pattern-contract/radio-simple-select-field/index.mjs";

const options = [
  { value: "existing", label: "Existing" },
  { value: "planned", label: "Planned" },
];

describe("radio-simple-select-field pattern seam", () => {
  it("composes field-row-control and radio-simple-select without direct token consumption", () => {
    const pattern = radioSimpleSelectFieldPattern({
      id: "feature-status-field",
      name: "featureStatus",
      label: "Feature status",
      helperText: "Choose one.",
      selectedValue: "existing",
      columns: 2,
      options,
    });

    expect(pattern).toMatchObject({
      schema: "kanbien.designSystem.patternSpec.v1",
      patternName: "radio-simple-select-field",
      primitives: {
        fieldRow: { primitiveName: "field-row-control" },
        radio: {
          primitiveName: "radio-simple-select",
          legendPresentation: "visually-hidden",
        },
      },
    });
    expect(radioSimpleSelectFieldPatternContract.directTokenDependencies).toEqual([]);
  });

  it("renders through governed primitive seams", () => {
    const html = renderRadioSimpleSelectFieldPattern({
      id: "feature-status-field",
      name: "featureStatus",
      label: "Feature status",
      helperText: "Choose one.",
      selectedValue: "existing",
      columns: 2,
      options,
    });

    expect(html).toContain('data-radio-simple-select-field=""');
    expect(html).toContain('data-field-row-control');
    expect(html).toContain('data-radio-simple-select=""');
    expect(html).toContain('data-radio-simple-select-legend-presentation="visually-hidden"');
    expect(html).not.toContain("pattern-proof-controls");
  });

  it("maps pattern state consistently to child primitives", () => {
    const disabled = radioSimpleSelectFieldPattern({ state: "disabled", options });
    expect(disabled.primitives.fieldRow.state).toBe("disabled");
    expect(disabled.primitives.radio.state).toBe("disabled-group");

    const error = renderRadioSimpleSelectFieldPattern({
      id: "feature-error-field",
      state: "error",
      errorText: "Choose one.",
      options,
    });
    expect(error).toContain('data-field-row-control-message="error"');
    expect(error).toContain('aria-invalid="true"');
    expect(() => radioSimpleSelectFieldPattern({ state: "multi-select", options })).toThrow(
      'radio-simple-select-field does not support state "multi-select".',
    );
  });
});

