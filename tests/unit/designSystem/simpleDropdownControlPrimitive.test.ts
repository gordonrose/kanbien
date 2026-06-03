import { describe, expect, it } from "vitest";

import { dropdownTriggerFrameTokenSpec } from "../../../src/frontend/designSystem/layers/02-token/dropdown-trigger-frame/systems/default.mjs";
import {
  renderSimpleDropdownControlPrimitive,
  simpleDropdownControlPrimitive,
  simpleDropdownControlPrimitiveContract,
} from "../../../src/frontend/designSystem/layers/03-primitive/simple-dropdown-control/index.mjs";

describe("simple-dropdown-control primitive", () => {
  it("exposes a governed trigger frame token seam", () => {
    expect(dropdownTriggerFrameTokenSpec).toMatchObject({
      contractId: "tokens.dropdown-trigger-frame",
      systemKey: "default",
      tokenType: "dropdown-trigger-frame",
    });
    expect(dropdownTriggerFrameTokenSpec.variants.map((variant) => variant.id)).toContain(
      "dropdown-trigger-frame-default-original",
    );
    expect(dropdownTriggerFrameTokenSpec.variants.map((variant) => variant.id)).toContain(
      "dropdown-trigger-frame-open-original",
    );
    expect(dropdownTriggerFrameTokenSpec.consumerRestrictions.join(" ")).toContain("text-control-frame");
  });

  it("renders button/listbox semantics and signed token dependencies", () => {
    const spec = simpleDropdownControlPrimitive({
      id: "dropdown-test",
      name: "pageTemplate",
      label: "Page template",
      selectedValue: "list",
      options: [
        { value: "page", label: "Page" },
        { value: "list", label: "List" },
      ],
    });

    expect(spec).toMatchObject({
      primitiveName: "simple-dropdown-control",
      eventName: "simple-dropdown:change",
      selectedLabel: "List",
    });
    expect(spec.tokenDependencies.dropdownTriggerFrame.tokenName).toBe("--dropdown-trigger-frame-default-original");
    expect(spec.tokenDependencies.dropdownListboxFrame.tokenName).toBe("--dropdown-listbox-frame-original");
    expect(spec.tokenDependencies.choiceOptionFrameSelected.tokenName).toBe("--choice-option-frame-selected-original");
    expect(spec.tokenDependencies.iconSize.tokenName).toBe("--icon-button-glyph-size");
    expect(spec.systemDependencies.glyphRegistry.semanticGlyphName).toBe("chevron-down");

    const html = renderSimpleDropdownControlPrimitive({
      id: "dropdown-test",
      name: "pageTemplate",
      label: "Page template",
      selectedValue: "list",
      options: [
        { value: "page", label: "Page" },
        { value: "list", label: "List" },
      ],
    });

    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain('role="option"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('class="ds-simple-dropdown-trigger-indicator"');
    expect(simpleDropdownControlPrimitiveContract.consumerRules.join(" ")).toContain("listbox ARIA");
  });

  it("rejects unsupported states instead of inventing local behavior", () => {
    expect(() =>
      simpleDropdownControlPrimitive({
        state: "multi-select",
        options: [{ value: "a", label: "A" }],
      }),
    ).toThrow(/does not support state/);
  });
});
