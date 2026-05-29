# Text Entry Control Behavior

## Purpose

Govern single-line and multi-line text entry controls before entity body panels render real editable text fields.

This rule covers the control behavior only. Field labels and helper or error text remain owned by `form-field` and the `field-row-control` primitive.

## Behavior Contract

A text entry control lets a user review or edit textual content inside a governed field row.

Single-line text entry must use native single-line text input semantics.

Multi-line text entry must use native textarea semantics when that primitive is created later.

The control may expose `default`, `required`, `read-only`, `disabled`, and `error` states. These states affect native attributes and accessibility wiring, not product validation rules.

The control must not normalize, persist, validate, submit, translate, or interpret domain values.

## Accessibility Contract

The control must reference the field-row label and any helper or error text through IDs supplied by the field-row primitive.

Keyboard focus must remain native and visible.

Disabled controls must use native disabled behavior. Read-only controls must use native read-only behavior.

Error state must expose invalid semantics when error text is present, but it must not invent validation copy.

## Layer Classification

Layer 2 needs a text-value typography token and a text-control frame token.

Layer 3 may create a single-line `text-field-control` primitive once those tokens and `field-row-control` are available.

Textarea growth, radio groups, toggles, dropdowns, drawer selectors, card selectors, accordions, and workflow builders remain separate downstream families.

## Forbidden Moves

Do not style value text, input padding, borders, radius, focus, or target size locally in the primitive.

Do not build textarea auto-growth, select menus, radio state, toggles, validation, form submission, or product persistence inside the text field primitive.

Do not copy markup from entity templates or old design-system token pages.
