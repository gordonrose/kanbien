# Radio Simple Select Field Pattern Contract

Status: `accepted`

Layer: `04-pattern-contract`

## Boundary

`radio-simple-select-field` composes a governed field row with a governed native
radio simple select. It owns the field-level composition: visible label,
optional helper text, optional error text, required marker, and the radio group
slot.

It does not define product validation, persistence, form-section layout,
accordion behavior, drawer behavior, workflow behavior, card-list
prioritization, or multi-select behavior.

## Upstream Gates

| Gate | Source |
| --- | --- |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/radio-simple-select/RadioSimpleSelect-Behaviour.md` |
| Field row primitive | `src/frontend/designSystem/layers/03-primitive/field-row-control/index.mjs#fieldRowControlPrimitive` |
| Radio primitive | `src/frontend/designSystem/layers/03-primitive/radio-simple-select/index.mjs#radioSimpleSelectPrimitive` |

## Composition Contract

The pattern must render `field-row-control` as the visible field structure. The
radio primitive must render inside the field-row control slot.

The visible field label belongs to `field-row-control`. The radio primitive must
keep its native legend present but visually hidden to avoid duplicate visible
labels.

Required, disabled, and error state must be passed consistently to both
primitives:

- `required` shows the field-row required marker and sets native required radio
  attributes.
- `disabled` disables the radio group and marks the field row disabled.
- `error` shows field-row error text and exposes radio invalid/describedby
  semantics.

## Accessibility Contract

The pattern must preserve the radio primitive's native radio group, option
names, keyboard behavior, focus behavior, disabled behavior, error semantics,
and overflow-gated text disclosure.

The pattern must not add a second focus target for labels, replace the native
radio group with ARIA-only behavior, or hide error text from assistive
technology.

## Allowed States

| State | Meaning |
| --- | --- |
| `default` | Enabled radio field. |
| `required` | Required radio field. |
| `disabled` | Disabled radio field. |
| `error` | Invalid radio field with visible and described error text. |

## Public Consumer Boundary

Later layers must consume the Layer 4 runtime seam instead of composing
field-row and radio primitive markup locally when they need this form field
shape.

Consumers may provide field label, helper text, error text, selected value,
radio options, option supporting text, column count, direction context, and
theme. Consumers must not override primitive token values or radio behavior.

## Required Evidence

Before later layers consume this pattern, proof must show:

- default, required, disabled, and error states
- options with and without supporting text
- 1-4 column requests inherited by the radio primitive
- long field label disclosure through field-row/truncating-label
- long option disclosure through radio-simple-select
- RTL and constrained-width behavior
- native radio selection and event evidence
