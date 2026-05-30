import { describe, expect, it } from "vitest";

import {
  radioSimpleSelectPrimitive,
  renderRadioSimpleSelectPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/radio-simple-select/index.mjs";

const options = [
  { value: "existing", label: "Existing" },
  { value: "planned", label: "Planned" },
];

describe("radio-simple-select primitive", () => {
  it("renders a native radio group wired to signed option-frame and layout tokens", () => {
    const spec = radioSimpleSelectPrimitive({
      id: "radio-simple-select-test",
      name: "featureStatus",
      label: "Feature status",
      selectedValue: "existing",
      columns: 2,
      options,
    });

    expect(spec).toMatchObject({
      primitiveName: "radio-simple-select",
      ids: {
        legendId: "radio-simple-select-test-legend",
      },
      tokenDependencies: {
        choiceOptionFrameDefault: { variantId: "choice-option-frame-default-original" },
        choiceOptionFrameSelected: { variantId: "choice-option-frame-selected-original" },
        choiceGroupLayout: { variantId: "choice-group-layout-2-column" },
        minimumTargetSize: { variantId: "target-size-interactive-all" },
      },
    });

    const html = renderRadioSimpleSelectPrimitive({
      id: "radio-simple-select-test",
      name: "featureStatus",
      label: "Feature status",
      selectedValue: "existing",
      columns: 2,
      options,
    });

    expect(html).toContain("<fieldset");
    expect(html).toContain("<legend");
    expect(html).toContain('type="radio"');
    expect(html).toContain('name="featureStatus"');
    expect(html).toContain('checked');
    expect(html).toContain("data-radio-simple-select-option-state=\"selected\"");
  });

  it("maps required, disabled, and error state to native attributes", () => {
    expect(renderRadioSimpleSelectPrimitive({ state: "required", options })).toContain("required");
    expect(renderRadioSimpleSelectPrimitive({ state: "disabled-group", options })).toContain("disabled");
    expect(
      renderRadioSimpleSelectPrimitive({
        id: "radio-error-test",
        state: "error",
        errorText: "Choose one.",
        options,
      }),
    ).toContain('aria-invalid="true"');
    expect(() => radioSimpleSelectPrimitive({ state: "multi-select", options })).toThrow(
      'radio-simple-select does not support state "multi-select".',
    );
    expect(() => radioSimpleSelectPrimitive({ columns: 5, options })).toThrow(
      "radio-simple-select columns must be 1, 2, 3, or 4.",
    );
  });
});

