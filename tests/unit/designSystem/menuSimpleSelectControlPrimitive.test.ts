import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  menuSimpleSelectControlPrimitive,
  menuSimpleSelectControlPrimitiveContract,
  renderMenuSimpleSelectControlPrimitive,
} from "../../../src/frontend/designSystem/layers/03-primitive/menu-simple-select-control/index.mjs";
import { resolveDefaultGlyphPath } from "../../../src/frontend/designSystem/systems/default/glyphs/registry.mjs";

const options = [
  { value: "chats", label: "Chats", eyebrow: "Parent", trailingLabel: "Chats" },
  { value: "organizations", label: "Organizations", eyebrow: "Current", trailingLabel: "Organizations" },
  { value: "users", label: "Users", eyebrow: "Child", trailingLabel: "Users", disabled: true },
];

describe("menu-simple-select-control primitive", () => {
  it("declares governed token dependencies and allowed states", () => {
    expect(menuSimpleSelectControlPrimitiveContract).toMatchObject({
      primitiveName: "menu-simple-select-control",
      requiredTokens: [
        "menu-simple-select-frame",
        "label-text-style",
        "supporting-text-style",
        "focus-ring",
        "minimum-target-size",
      ],
      allowedStates: ["closed", "open", "disabled", "empty"],
      allowedTriggerVariants: ["text", "icon"],
      allowedTriggerIcons: ["chevron", "filter", "sort"],
      requiredSystemRegistries: ["glyph-registry"],
    });
  });

  it("normalizes selected value and token dependencies", () => {
    const spec = menuSimpleSelectControlPrimitive({
      id: "menu-select-test",
      label: "Layer",
      name: "layer",
      value: "organizations",
      options,
    });

    expect(spec).toMatchObject({
      primitiveName: "menu-simple-select-control",
      value: "organizations",
      currentLabel: "Organizations",
      state: "closed",
      tokenDependencies: {
        menuSimpleSelectFrame: {
          variantId: "menu-simple-select-trigger-frame-default",
        },
        supportingTextStyle: {
          variantId: "supporting-text-style-control-eyebrow",
        },
        focusRing: {
          variantId: "focus-ring-visible-original",
        },
        minimumTargetSize: {
          variantId: "target-size-interactive-all",
        },
      },
    });
  });

  it("renders trigger, listbox, selected option, disabled option, and hidden value", () => {
    const html = renderMenuSimpleSelectControlPrimitive({
      id: "menu-select-render-test",
      label: "Layer",
      name: "layer",
      value: "organizations",
      options,
    });

    expect(html).toContain("data-menu-simple-select-control");
    expect(html).toContain('name="layer" value="organizations"');
    expect(html).toContain("data-menu-simple-select-trigger");
    expect(html).toContain("ds-menu-simple-select-trigger-glyph");
    expect(html).toContain('d="M6 9l6 6 6-6"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('role="listbox"');
    expect(html).toContain("data-menu-simple-select-sheet-header");
    expect(html).toContain("data-menu-simple-select-close");
    expect(html).toContain('role="option"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('aria-disabled="true" disabled');
    expect(html).toContain("data-menu-simple-select-option-value");
  });

  it("renders an icon-only trigger variant with a governed square frame", () => {
    const spec = menuSimpleSelectControlPrimitive({
      id: "menu-select-icon-test",
      label: "Layer",
      triggerVariant: "icon",
      triggerIcon: "filter",
      value: "organizations",
      options,
    });
    const html = renderMenuSimpleSelectControlPrimitive({
      id: "menu-select-icon-render-test",
      label: "Layer",
      triggerVariant: "icon",
      triggerIcon: "filter",
      value: "organizations",
      options,
    });

    expect(spec.triggerVariant).toBe("icon");
    expect(spec.triggerIcon).toBe("filter");
    expect(spec.tokenDependencies.menuSimpleSelectFrame.variantId).toBe("menu-simple-select-trigger-frame-icon");
    expect(html).toContain('data-menu-simple-select-trigger-variant="icon"');
    expect(html).toContain('data-menu-simple-select-trigger-icon="filter"');
    expect(html).toContain('aria-label="Layer: Organizations"');
    expect(html).toContain(resolveDefaultGlyphPath("filter"));
    expect(html).not.toContain("ds-menu-simple-select-trigger-value");
  });

  it("keeps empty and disabled states explicit", () => {
    expect(
      renderMenuSimpleSelectControlPrimitive({
        id: "menu-select-empty-test",
        label: "Layer",
        options: [],
      }),
    ).toContain('data-menu-simple-select-state="empty"');
    expect(
      renderMenuSimpleSelectControlPrimitive({
        id: "menu-select-disabled-test",
        label: "Layer",
        disabled: true,
        options,
      }),
    ).toContain('data-menu-simple-select-disabled="true"');
  });

  it("implements controller-owned open, keyboard, select, and dismiss behavior", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/frontend/designSystem/layers/03-primitive/menu-simple-select-control/index.mjs"),
      "utf8",
    );

    expect(source).toContain("function setOpen");
    expect(source).toContain("function selectOption");
    expect(source).toContain("function renderTriggerIcon");
    expect(source).toContain('event.key === "ArrowDown"');
    expect(source).toContain('event.key === "Escape"');
    expect(source).toContain('event.key === "Enter"');
    expect(source).toContain("document.addEventListener");
  });
});
