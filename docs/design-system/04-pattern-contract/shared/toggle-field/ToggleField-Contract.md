# Toggle Field Pattern Contract

Status: `review-ready`

Layer: `04-pattern-contract`

## Boundary

`toggle-field` composes a governed field row with a governed boolean
`toggle-control`. It owns the field-level composition: visible label, optional
helper text, optional error text, required marker, switch slot, and event
forwarding.

It does not define product validation, persistence, form-section layout,
accordion behavior, drawer behavior, workflow behavior, checkbox-list behavior,
or backend values.

## Upstream Gates

| Gate | Source |
| --- | --- |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/toggle-control/ToggleControl-Behaviour.md` |
| Field row primitive | `src/frontend/designSystem/layers/03-primitive/field-row-control/index.mjs#fieldRowControlPrimitive` |
| Toggle primitive | `src/frontend/designSystem/layers/03-primitive/toggle-control/index.mjs#toggleControlPrimitive` |

## Composition Contract

The pattern must render `field-row-control` as the visible field structure. The
toggle primitive must render inside the field-row control slot.

The visible field label belongs to `field-row-control`. The toggle primitive
must receive its accessible name through the field-row label ID to avoid a
duplicate visible label.

Required, read-only, disabled, and error state must be passed consistently to
both primitives.

The broader field label row may activate the switch. The truncating label must
still disclose full text when it truncates through its own hover/focus
behavior.

## Accessibility Contract

The pattern must preserve the toggle primitive's native checkbox/switch
semantics, checked state, keyboard behavior, focus behavior, disabled behavior,
read-only blocking, invalid semantics, target size, and non-text contrast.

The pattern must wire helper and error text through the toggle's
`aria-describedby` IDs when those messages are present.

The pattern must not add a second focus target for the toggle, replace the
native switch with ARIA-only behavior, hide error text from assistive
technology, or make color the only state cue.

## Allowed States

| State | Meaning |
| --- | --- |
| `default` | Enabled toggle field. |
| `required` | Required toggle field. |
| `read-only` | Focusable value display that cannot be changed. |
| `disabled` | Disabled toggle field. |
| `error` | Invalid toggle field with visible and described error text. |

## Public Consumer Boundary

Later layers must consume the Layer 4 runtime seam instead of composing
field-row and toggle primitive markup locally when they need this form field
shape.

Consumers may provide field label, helper text, error text, checked value,
toggle name/value, direction context, and theme. Consumers must not override
primitive token values, switch semantics, checked behavior, read-only blocking,
or event dispatch.

## Required Evidence

Before later layers consume this pattern, proof must show:

- default, required, read-only, disabled, and error states
- checked and unchecked values
- helper and error text wired to the switch description IDs
- long field label disclosure through field-row/truncating-label
- RTL, constrained-width, and zoom behavior
- pointer and keyboard toggle changes
- read-only and disabled blocking
- event evidence forwarded from the toggle primitive
