# Search Field Control Primitive Contract

Layer: `03-primitive`
Status: `review-ready`
Behavior rule: `docs/design-system/01-behavior-rule/shared/searchable-selection-panel/SearchableSelectionPanel-Behaviour.md`

## Purpose

`search-field-control` is the governed native search-input primitive for search, filter, selection, and drawer panels.

It owns accessible search text entry and token-backed input framing. It does not own filtering results, selected grouping, count summaries, drawer behavior, async loading, or app persistence.

## Token Dependencies

The primitive may consume only signed Layer 2 token seams:

- `text-control-frame`
- `field-value-text-style`
- `focus-ring`
- `minimum-target-size`

If any dependency is missing for a design system, that design system cannot prove or consume this primitive.

## Behavior Contract

The primitive must:

- render a native `<input type="search">`
- expose one accessible label for the search input
- support `default`, `disabled`, and `error` states
- map disabled state to native `disabled`
- map error state to `aria-invalid="true"` when supplied
- preserve native browser search input behavior, including native text entry and browser-provided clear affordances where available
- emit normal browser input and search events only
- reject unsupported states and unsupported design systems

## Accessibility Contract

The input must reference the primitive-owned label with `aria-labelledby`.

Optional description IDs may be forwarded by a later pattern, but the primitive must not invent helper, result-count, loading, or error copy.

Keyboard focus must remain native and must use the signed focus-ring token.

The primitive must not rely on placeholder text as the accessible name.

## Consumer Boundary

Consumers may provide `name`, `value`, `placeholder`, `label`, and optional external description IDs.

Consumers must not reconstruct the input frame, label wiring, focus behavior, search state attributes, or token CSS variables locally.

Consumers must not add filtering, selected grouping, async loading, count summaries, drawer behavior, or app persistence inside this primitive.

## Rendered View

Review the default system proof at:

`/design-system/default/primitives/search-field-control`
