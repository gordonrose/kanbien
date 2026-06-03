import { describe, expect, it } from "vitest";

import {
  countCardControlPrimitive,
  renderCountCardControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/count-card-control/index.mjs";

describe("count-card-control primitive", () => {
  it("renders a static labelled count card wired to signed token seams", () => {
    const spec = countCardControlPrimitive({
      id: "count-card-test",
      label: "Active filters",
      count: 0,
    });

    expect(spec).toMatchObject({
      primitiveName: "count-card-control",
      mode: "static",
      state: "default",
      count: "0",
      actionable: false,
      tokenDependencies: {
        countCardFrame: { variantId: "count-card-frame-default-original" },
        labelTextStyle: { variantId: "label-text-style-short-default" },
        supportingTextStyle: { variantId: "supporting-text-style-default" },
        minimumTargetSize: { variantId: "target-size-interactive-all" },
      },
    });

    const html = renderCountCardControlPrimitive({
      id: "count-card-test",
      label: "Active filters",
      count: 0,
    });

    expect(html).toContain("<div");
    expect(html).toContain('data-count-card-control-actionable="false"');
    expect(html).not.toContain('type="button"');
    expect(html).toContain("Active filters");
    expect(html).toContain(">0<");
  });

  it("renders actionable cards as native buttons and blocks disabled activation semantics", () => {
    const actionable = renderCountCardControlPrimitive({
      id: "count-card-actionable",
      label: "Open filters",
      count: 3,
      mode: "actionable",
    });
    expect(actionable).toContain("<button");
    expect(actionable).toContain('type="button"');
    expect(actionable).toContain('aria-label="Open filters, 3 items"');

    const disabled = renderCountCardControlPrimitive({
      id: "count-card-disabled",
      label: "Unavailable filters",
      count: 0,
      mode: "actionable",
      state: "disabled",
    });
    expect(disabled).toContain("<button");
    expect(disabled).toContain("disabled");
    expect(disabled).toContain("Disabled");
    expect(disabled).toContain('aria-label="Unavailable filters, 0 items, Disabled"');
  });

  it("exposes non-colour state cues and rejects unsupported states or modes", () => {
    const warning = renderCountCardControlPrimitive({
      label: "Needs review",
      count: 8,
      state: "warning",
      theme: "desert",
    });
    expect(warning).toContain("Warning");
    expect(warning).toContain("--count-card-frame-warning-desert");
    expect(warning).toContain('aria-label="Needs review, 8 items, Warning"');

    const error = renderCountCardControlPrimitive({
      label: "Blocked records",
      count: 2,
      state: "error",
      theme: "dark",
    });
    expect(error).toContain("Error");
    expect(error).toContain("--count-card-frame-error-dark");

    expect(() => countCardControlPrimitive({ state: "success" })).toThrow(
      'count-card-control does not support state "success".',
    );
    expect(() => countCardControlPrimitive({ mode: "link" })).toThrow('count-card-control does not support mode "link".');
  });
});
