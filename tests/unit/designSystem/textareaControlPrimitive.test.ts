import { describe, expect, it } from "vitest";

import { textareaGrowthTokenVariants } from "../../../src/frontend/designSystem/layers/02-token/textarea-growth/systems/default.mjs";
import {
  renderTextareaControlPrimitive,
  textareaControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/textarea-control/index.mjs";

describe("textarea-control primitive", () => {
  it("exposes governed textarea growth variants", () => {
    expect(textareaGrowthTokenVariants.map((variant) => [variant.id, variant.initialRows, variant.maxBlockSizeValue])).toEqual([
      ["textarea-growth-one-line", "1", "50vh"],
      ["textarea-growth-multi-line", "5", "75vh"],
      ["textarea-growth-paragraph", "15", "90vh"],
    ]);
  });

  it("renders a native textarea wired to field-row IDs and signed tokens", () => {
    const spec = textareaControlPrimitive({
      id: "textarea-test",
      label: "Description",
      helperText: "Helper copy",
      growthVariant: "paragraph",
      value: "Long copy",
    });

    expect(spec).toMatchObject({
      primitiveName: "textarea-control",
      growthVariant: "paragraph",
      ids: {
        textareaId: "textarea-test-textarea",
        labelId: "textarea-test-label",
        describedBy: "textarea-test-helper",
      },
      tokenDependencies: {
        textControlFrame: { variantId: "text-control-frame-default" },
        fieldValueTextStyle: { variantId: "field-value-text-style-default" },
        textareaGrowth: { variantId: "textarea-growth-paragraph" },
      },
    });

    const html = renderTextareaControlPrimitive({
      id: "textarea-test",
      label: "Description",
      helperText: "Helper copy",
      growthVariant: "paragraph",
      value: "Long copy",
    });

    expect(html).toContain("<textarea");
    expect(html).toContain('rows="15"');
    expect(html).toContain('aria-labelledby="textarea-test-label"');
    expect(html).toContain('aria-describedby="textarea-test-helper"');
  });

  it("rejects unsupported states and growth variants", () => {
    expect(textareaControlPrimitive({ state: "error" }).tokenDependencies.textControlFrame).toMatchObject({
      variantId: "text-control-frame-error",
    });
    expect(() => textareaControlPrimitive({ state: "submitted" })).toThrow(
      'textarea-control does not support state "submitted".',
    );
    expect(() => textareaControlPrimitive({ growthVariant: "freeform" })).toThrow(
      'textarea-control does not support growthVariant "freeform".',
    );
  });
});
