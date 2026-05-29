import { describe, expect, it } from "vitest";

import {
  renderTextFieldControlPrimitive,
  textFieldControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/text-field-control/index.mjs";

describe("text-field-control primitive", () => {
  it("renders a native text input wired to field-row IDs and signed tokens", () => {
    const spec = textFieldControlPrimitive({
      id: "text-field-test",
      label: "Entity name",
      helperText: "Helper copy",
      value: "Organization",
    });

    expect(spec).toMatchObject({
      primitiveName: "text-field-control",
      ids: {
        inputId: "text-field-test-input",
        labelId: "text-field-test-label",
        describedBy: "text-field-test-helper",
      },
      tokenDependencies: {
        textControlFrame: { variantId: "text-control-frame-default" },
        fieldValueTextStyle: { variantId: "field-value-text-style-default" },
        minimumTargetSize: { variantId: "target-size-interactive-all" },
      },
    });

    const html = renderTextFieldControlPrimitive({
      id: "text-field-test",
      label: "Entity name",
      helperText: "Helper copy",
      value: "Organization",
    });

    expect(html).toContain('<input id="text-field-test-input"');
    expect(html).toContain('type="text"');
    expect(html).toContain('aria-labelledby="text-field-test-label"');
    expect(html).toContain('aria-describedby="text-field-test-helper"');
    expect(html).toContain('data-field-row-control');
  });

  it("maps state to native attributes and rejects unsupported states", () => {
    expect(textFieldControlPrimitive({ state: "required" }).tokenDependencies.textControlFrame).toMatchObject({
      variantId: "text-control-frame-required",
    });
    expect(renderTextFieldControlPrimitive({ state: "required" })).toContain("required");
    expect(textFieldControlPrimitive({ state: "read-only" }).tokenDependencies.textControlFrame).toMatchObject({
      variantId: "text-control-frame-read-only",
    });
    expect(renderTextFieldControlPrimitive({ state: "read-only" })).toContain("readonly");
    expect(textFieldControlPrimitive({ state: "disabled" }).tokenDependencies.textControlFrame).toMatchObject({
      variantId: "text-control-frame-disabled",
    });
    expect(renderTextFieldControlPrimitive({ state: "disabled" })).toContain("disabled");
    expect(textFieldControlPrimitive({ state: "error" }).tokenDependencies.textControlFrame).toMatchObject({
      variantId: "text-control-frame-error",
    });
    expect(renderTextFieldControlPrimitive({ state: "error", errorText: "Error" })).toContain('aria-invalid="true"');
    expect(() => textFieldControlPrimitive({ state: "textarea" })).toThrow(
      'text-field-control does not support state "textarea".',
    );
  });
});
