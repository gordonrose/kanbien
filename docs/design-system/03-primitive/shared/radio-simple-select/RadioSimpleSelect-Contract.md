# Radio Simple Select Primitive Contract

Status: `accepted`

Layer: `03-primitive`

## Boundary

`radio-simple-select` renders one labelled native radio group for mutually
exclusive choice selection. It owns radio semantics, option state wiring,
keyboard behavior, token-backed option frames, responsive column collapse, and
overflow-gated text disclosure.

It does not own product validation, persistence, form-section layout, drawer
behavior, accordion behavior, priority ordering, or card-list selection.

## Upstream Gates

| Gate | Source |
| --- | --- |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/radio-simple-select/RadioSimpleSelect-Behaviour.md` |
| Option frame token | `docs/design-system/02-token/shared/choice-option-frame/ChoiceOptionFrame-Contract.md` |
| Group layout token | `docs/design-system/02-token/shared/choice-group-layout/ChoiceGroupLayout-Contract.md` |
| Text tokens | `label-text-style`, `supporting-text-style`, `error-text-style`, `tooltip-text-style` |
| Interaction tokens | `focus-ring`, `minimum-target-size`, `tooltip-surface` |

## Behavior Contract

The primitive must render native `<input type="radio">` controls in one shared
name group. Selecting one enabled option clears the previous selection through
native radio behavior.

Consumers may provide a group label, optional group supporting text, options,
optional option supporting text, selected value, required state, disabled group,
disabled options, and error text.

Consumers may request `visible` or `visually-hidden` legend presentation. The
legend text must remain present for native radio-group semantics; visually
hidden presentation is allowed only when a parent governed field pattern already
owns the visible label.

The primitive may expose a `radio-simple-select:change` event after native
selection changes. Event detail may include `name`, `value`, and `id`.

## Accessibility Contract

The group must use `fieldset` and `legend` or equivalent native semantics. Each
option must keep one native radio input and one visible label relationship.

Required state must use the native `required` attribute. Disabled state must use
native disabled controls. Error state must expose `aria-invalid` and
`aria-describedby` so assistive technology can reach the error text.

Visible group labels, group supporting text, option labels, and option
supporting text may truncate only when constrained. Full text disclosure must be
available on pointer hover and keyboard focus only when rendered text is
actually truncated. Fitting text must not show a tooltip.

The primitive must not put a separate focusable text-disclosure primitive inside
the radio label. Radio-safe disclosure is owned by this primitive so the radio
option keeps one clear native input/label interaction.

## Allowed States

| State | Meaning |
| --- | --- |
| `default` | Enabled group with normal option frames. |
| `required` | Enabled group with native required radios. |
| `disabled-group` | All radios are disabled. |
| `disabled-option` | One or more options are disabled. |
| `error` | Radios expose invalid state and are described by error text. |

## Token Dependencies

`radio-simple-select` may consume only signed Layer 2 token seams:

- `choice-option-frame`
- `choice-group-layout`
- `label-text-style`
- `supporting-text-style`
- `error-text-style`
- `tooltip-surface`
- `tooltip-text-style`
- `focus-ring`
- `minimum-target-size`

No color, spacing, radius, typography, target-size, tooltip, or option-frame
value may be invented inside the primitive or a downstream pattern.

## Public Consumer Boundary

Consumers must call the Layer 3 runtime seam rather than reconstructing radio
markup, ARIA attributes, option CSS, responsive column logic, or text disclosure
locally.

Later form patterns may compose this primitive, but must not change radio
selection behavior, accessible names, native disabled behavior, required/error
wiring, or text disclosure rules.

## Required Evidence

Before later layers consume this primitive, the default-system proof must show:

- default, required, disabled, disabled-option, and error states
- option labels with and without supporting text
- group label with and without supporting text
- 1, 2, 3, and 4 requested columns with constrained-width collapse
- LTR and RTL rendering
- keyboard radio behavior
- tooltip disclosure for truncated text only
- no horizontal overflow on desktop or mobile
