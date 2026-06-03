# Simple Dropdown Control Primitive Contract

| Field | Value |
| --- | --- |
| Layer | `03-primitive` |
| Primitive | `simple-dropdown-control` |
| Status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/simple-dropdown/SimpleDropdown-Behaviour.md` |
| Rendered view | `/design-system/default/primitives/simple-dropdown-control` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/simple-dropdown-control/index.mjs#simpleDropdownControlPrimitive` |

## Purpose

`simple-dropdown-control` owns the low-level trigger and listbox behavior for choosing one value from a short list.

It does not own field labels, product validation, search, async loading, multi-select, drawer selection, option grouping, app persistence, or app adoption.

## Required Tokens

- `dropdown-trigger-frame`
- `dropdown-listbox-frame`
- `choice-option-frame`
- `field-value-text-style`
- `label-text-style`
- `supporting-text-style`
- `error-text-style`
- `tooltip-surface`
- `tooltip-text-style`
- `focus-ring`
- `minimum-target-size`
- `body-region-frame`
- `icon-size`

## Required System Dependencies

- default glyph registry: `chevron-down`

## Contract

- The root exposes one trigger button and one owned listbox.
- The trigger exposes `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, and the current value.
- The trigger must include a visual dropdown indicator glyph from the selected design system's glyph registry.
- Options expose `role="option"` and `aria-selected`.
- Keyboard interaction follows the simple dropdown behavior rule.
- The listbox uses the signed popup max-height values and scrolls internally when option content exceeds the signed limit.
- Desktop and mobile may use different signed popup max-height values, but the button/listbox semantics and selection behavior stay the same.
- Disabled dropdowns do not open.
- Disabled options are skipped by keyboard movement and cannot be selected.
- Long visible trigger and option text must disclose only when text overflows.
- Consumers must listen to `simple-dropdown:change` rather than reading route-local DOM.

## Consumer Boundary

Later layers must consume the runtime seam and must not reconstruct dropdown markup, ARIA, keyboard behavior, tooltip behavior, or frame CSS from this document, screenshots, or route-local proof markup.
