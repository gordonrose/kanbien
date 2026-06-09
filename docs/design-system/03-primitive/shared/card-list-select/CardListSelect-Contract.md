# Card List Select Primitive Contract

Layer: `03-primitive`
Status: `review-ready`
Behavior rule: `docs/design-system/01-behavior-rule/shared/card-list-select/CardListSelect-Behaviour.md`

## Purpose

`card-list-select` is a governed native multi-select primitive for option cards.

It supports two behavior variants:

- `visibility`: each card toggles between visible and hidden
- `priority`: each selected card receives a compacted priority rank; deselecting an item removes its rank and shifts later selected items up

## Token Dependencies

The primitive may consume only signed Layer 2 token seams:

- `choice-option-frame`
- `choice-group-layout`
- `choice-card-state-affordance`
- `label-text-style`
- `supporting-text-style`
- `tooltip-surface`
- `tooltip-text-style`
- `focus-ring`
- `minimum-target-size`

If any dependency is missing for a design system, that design system cannot prove or consume this primitive.

## Primitive Dependencies

- `focus-instruction-disclosure`

Keyboard instruction copy for option selection must be rendered through the
shared focus-instruction-disclosure primitive. `card-list-select` owns the
checkbox behavior and selected-value updates; it must not recreate a local
keyboard hint surface.

## Behavior Contract

The primitive must:

- render native checkbox inputs for multi-selection
- preserve one stable value per option
- emit `card-list-select:change` with selected values and priority order
- keep visible/hidden and priority variants behaviorally separate
- compact priority ranks whenever an item is deselected
- allow 1, 2, 3, or 4 requested columns through `choice-group-layout`
- support default, disabled group, disabled option, and error visual states through signed `choice-option-frame` variants
- allow the semantic legend to be visible or visually hidden when a field pattern supplies the visible label
- allow `glyph-and-text` or `text-only` state-affordance presentation without changing checkbox semantics
- preserve RTL and constrained-width rendering without overlapping text
- show text-disclosure tooltip behavior only when rendered text truncates
- expose a focus-only keyboard instruction for Space selection through
  `focus-instruction-disclosure`

## Accessibility Contract

The primitive must preserve:

- a fieldset and legend for grouped choices
- native checkbox focus and keyboard behavior
- label association for every option
- `aria-describedby` wiring only for real supporting/error/tooltip descriptions
- color-independent state through trailing state text, with optional primitive-owned glyph semantics
- disabled option and disabled group behavior when exposed

## Forbidden Local Behavior

Consumers must not reconstruct card-list select markup, checkbox behavior, ranking logic, state-affordance presentation, token CSS variables, text-disclosure behavior, or option state styling locally.

This primitive is not approved for dropdowns, radio groups, navigation, workflow builders, or app adoption by itself.

## Rendered View

Review the default system proof at:

`/design-system/default/primitives/card-list-select`
