import { describe, expect, it } from "vitest";

import {
  fieldRowControlPrimitiveContract,
  fieldRowControlPrimitive,
  renderFieldRowControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/field-row-control/index.mjs";

describe("field-row-control primitive", () => {
  it("renders token-backed label, description IDs, and child slot boundary", () => {
    const spec = fieldRowControlPrimitive({
      id: "field-row-test",
      label: "Entity name",
      helperText: "Helper copy",
      state: "default",
    });

    expect(spec).toMatchObject({
      primitiveName: "field-row-control",
      state: "default",
      ids: {
        labelId: "field-row-test-label",
        helperId: "field-row-test-helper",
        describedBy: "field-row-test-helper",
      },
    });
    expect(fieldRowControlPrimitiveContract.requiredPrimitives).toContain("truncating-label");
    expect(spec.tokenDependencies).toMatchObject({
      fieldRowFrame: { variantId: "field-row-frame-default" },
      labelTextStyle: { variantId: "label-text-style-short-default" },
      supportingTextStyle: { variantId: "supporting-text-style-default" },
      errorTextStyle: { variantId: "error-text-style-default" },
      truncatingLabel: { primitiveName: "truncating-label" },
    });

    const html = renderFieldRowControlPrimitive({
      id: "field-row-test",
      label: "Entity name",
      helperText: "Helper copy",
      controlHtml: "<span>Future control</span>",
    });

    expect(html).toContain('aria-labelledby="field-row-test-label"');
    expect(html).toContain('id="field-row-test-label"');
    expect(html).toContain('data-truncating-label=""');
    expect(html).not.toContain('tabindex="0"');
    expect(html).toContain('aria-describedby="field-row-test-helper"');
    expect(html).toContain('data-field-row-control-slot="provided"');
    expect(html).toContain('data-field-row-control-slot-state="default"');
    expect(html).toContain('data-field-row-control-slot-required="false"');
    expect(html).toContain('data-field-row-control-slot-readonly="false"');
    expect(html).toContain('data-field-row-control-slot-disabled="false"');
    expect(html).toContain('data-field-row-control-slot-invalid="false"');
    expect(html).toContain('data-field-row-control-slot-label-id="field-row-test-label"');
    expect(html).toContain('data-field-row-control-slot-describedby="field-row-test-helper"');
  });

  it("exposes state hooks without pretending to own native control behavior", () => {
    const html = renderFieldRowControlPrimitive({
      id: "field-row-state-test",
      label: "Entity status",
      state: "disabled",
    });

    expect(html).toContain('data-field-row-control-state="disabled"');
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('data-field-row-control-slot-disabled="true"');
    expect(html).toContain('data-field-row-control-slot-readonly="false"');
  });

  it("rejects unsupported states instead of inventing behavior", () => {
    expect(() => fieldRowControlPrimitive({ state: "submitted" })).toThrow(
      'field-row-control does not support state "submitted".',
    );
  });
});
