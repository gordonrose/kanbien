import { describe, expect, it } from "vitest";

import {
  fieldContainerControlPrimitive,
  fieldContainerControlPrimitiveContract,
  renderFieldContainerControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/field-container-control/index.mjs";

describe("field-container-control primitive", () => {
  it("renders token-backed outer field container without claiming child behavior", () => {
    const spec = fieldContainerControlPrimitive({ id: "field-container-test" });

    expect(spec).toMatchObject({
      primitiveName: "field-container-control",
      tokenDependencies: {
        fieldContainerFrame: {
          variantId: "field-container-frame-original",
        },
      },
    });
    expect(fieldContainerControlPrimitiveContract.requiredTokens).toContain("field-container-frame");

    const html = renderFieldContainerControlPrimitive({
      id: "field-container-test",
      childHtml: '<div data-proof-child="">Governed child</div>',
    });

    expect(html).toContain("data-field-container-control");
    expect(html).toContain('data-field-container-control-slot="provided"');
    expect(html).toContain('data-proof-child=""');
    expect(html).not.toContain("role=");
    expect(html).not.toContain("aria-label=");
  });

  it("keeps an empty slot honest for proof routes", () => {
    const html = renderFieldContainerControlPrimitive({ id: "field-container-empty" });

    expect(html).toContain('data-field-container-control-slot="empty"');
  });

  it("selects field-container frame tokens by theme", () => {
    expect(fieldContainerControlPrimitive({ theme: "dark" }).tokenDependencies.fieldContainerFrame).toMatchObject({
      variantId: "field-container-frame-dark",
    });
    expect(renderFieldContainerControlPrimitive({ theme: "dark" })).toContain("data-field-container-control-theme=\"dark\"");
    expect(() => fieldContainerControlPrimitive({ theme: "unknown" })).toThrow(
      'field-container-control does not support theme "unknown".',
    );
  });
});
