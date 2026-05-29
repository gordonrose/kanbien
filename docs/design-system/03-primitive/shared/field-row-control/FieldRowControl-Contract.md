# Field Row Control Primitive Contract

## Purpose

`field-row-control` is the governed primitive for rendering one form-field row around a future hosted control.

It owns label and description structure, stable state hooks, token-backed spacing, and the public child-slot boundary. It does not own text input, textarea, selector, radio, toggle, validation, form submission, or product data behavior.

## Upstream Gates

- Behavior rule: `docs/design-system/01-behavior-rule/shared/form-field/FormField-Behaviour.md`
- Tokens: `field-row-frame`, `label-text-style`, `supporting-text-style`, `error-text-style`
- Primitive dependency: `truncating-label`

## Behavior Contract

The primitive renders one label, one control slot, and optional helper or error text.

The visible label must render through `truncating-label`; `field-row-control` must not implement local ellipsis, clipping, tooltip, or full-text disclosure behavior.

The primitive returns stable IDs for the label and description text so a future hosted control can wire `aria-labelledby` and `aria-describedby`.

The primitive supports these states: `default`, `required`, `read-only`, `disabled`, and `error`.

The primitive exposes state hooks on the field row and control slot. It may render the required marker and error description wiring, but native `required`, `readonly`, `disabled`, and `aria-invalid` behavior belongs to the hosted control primitive.

The primitive must reject unsupported states instead of silently rendering an unknown state.

## Accessibility Contract

The label and description IDs must be present in rendered markup when their corresponding text exists.

When the label text is visually truncated, the full label must be available through the governed `truncating-label` hover and keyboard-focus disclosure behavior. Fitting labels must not show a tooltip.

The field row must not claim native input semantics. The hosted control primitive owns native roles, values, keyboard behavior, focus behavior, `disabled`, and `readonly`.

Error text must be present as text, not only as color.

Error text must consume `error-text-style`; helper text must consume `supporting-text-style`. The primitive must not use helper/supporting typography as a substitute for error text.

## Consumer Boundary

Consumers may provide governed child HTML for the control slot.

Consumers must not reconstruct field-row label, helper, error, state, spacing, truncation, or tooltip-disclosure structure locally when this primitive exists.

Proof-only slot content is not a governed form control.

## Readiness Evidence

The default proof must show labels, helper text, error text, RTL order, constrained-width truncation behavior through `truncating-label`, fitting-label tooltip suppression, and empty child-slot blocking without creating a fake input.
