# Count Card Control Primitive Contract

Behavior rule: `docs/design-system/01-behavior-rule/shared/count-card/CountCard-Behaviour.md`

Rendered proof: `/design-system/default/primitives/count-card-control`

Runtime seam: `src/frontend/designSystem/layers/03-primitive/count-card-control/index.mjs#countCardControlPrimitive`

## Responsibility

`count-card-control` owns the low-level labelled count card primitive.

It presents one label, one explicit count, optional state meaning, and optional
activation behavior. It does not calculate counts, open panels, group selected
items, filter records, define drawer behavior, or act as an app component.

## Token Dependencies

The primitive may consume only these signed Layer 2 token seams:

- `count-card-frame`
- `label-text-style`
- `supporting-text-style`
- `tooltip-surface`
- `tooltip-text-style`
- `focus-ring`
- `minimum-target-size`

If a later use needs a different count-card state, typography, spacing, glyph,
or frame decision, return to Layer 2 before changing this primitive.

## Behavior Contract

The primitive supports `static` and `actionable` modes.

Static cards are not placed in the tab order and do not emit activation events.

Actionable cards render as native buttons and emit `count-card:activate` with
the card value and current state when activated.

Disabled cards remain understandable and must not activate.

The count is always visible, including zero.

Selected, disabled, warning, and error states must expose non-colour state text
so the state is not communicated by colour alone.

## Accessibility Contract

The accessible name must include the visible label and count meaning. When the
card has state meaning, the accessible name also includes the state cue.

Actionable cards use native button semantics and visible focus.

Static cards are semantic grouped content, not fake buttons.

Truncated labels must expose the full label through governed text-overflow
disclosure only when the rendered label actually overflows. Native `title`
alone is not sufficient.

## Allowed States

- `default`
- `selected`
- `disabled`
- `warning`
- `error`

These states change state semantics and token selection. They do not define
filter selection, drawer state, backend counts, or app route state.

## Consumer Boundary

Consumers may pass:

- `id`
- `value`
- `label`
- `count`
- `state`
- `mode`
- `theme`

Consumers must not recreate count-card markup, state cue logic, activation
controller behavior, tooltip overflow behavior, or frame CSS locally.

## Evidence Before Layer 4

Before a pattern consumes this primitive, evidence must show:

- rendered default, selected, disabled, warning, and error states
- static versus actionable semantics
- disabled activation blocking
- visible focus for actionable cards
- count visibility for zero and non-zero counts
- truncation disclosure only when overflow exists
- original, dark, and desert theme rendering
- RTL rendering

