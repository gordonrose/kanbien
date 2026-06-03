# Toggle Control Primitive Contract

## Purpose

`toggle-control` is the governed boolean on/off control primitive.

It renders one native checkbox input with switch semantics and a token-backed
track/thumb visual. It does not own field-row labels, helper text, error copy,
product validation, persistence, or form submission.

## Upstream Gates

- Behavior rule: `docs/design-system/01-behavior-rule/shared/toggle-control/ToggleControl-Behaviour.md`
- Tokens: `toggle-frame`, `focus-ring`, `minimum-target-size`

## Behavior Contract

The primitive renders one `<input type="checkbox" role="switch">`.

It supports `default`, `required`, `read-only`, `disabled`, and `error` states.

It supports `checked` and `unchecked` boolean values in every state. The
semantic state is exposed through the native checked value; the visual thumb
position must consume the signed on/off offset from `toggle-frame`.

Enabled toggles change value through native pointer, touch, and keyboard
checkbox behavior. Space toggles the focused control. Enter behavior remains
native browser behavior and must not be locally reimplemented.

Read-only toggles remain focusable and perceivable, but the primitive controller
must prevent value changes. Disabled toggles use the native `disabled`
attribute.

The primitive emits a bubbling `toggle-control:change` event after an enabled
value change with `{ name, checked, value }` detail. Product saving and
persistence are not part of this primitive.

## Accessibility Contract

The primitive must expose exactly one programmatic name through `aria-label` or
an external `aria-labelledby` value supplied by a later field pattern.

The primitive must expose invalid state with `aria-invalid="true"` when in
`error` state and may receive `aria-describedby` IDs from a later field
pattern.

Focus must remain on the native input and must use the signed `focus-ring`
token. Hit target sizing must use `minimum-target-size`.

Color must not be the only state cue: the checked state is also communicated by
the native checked value and thumb position.

## Consumer Boundary

Consumers may provide `id`, `name`, `checked`, `value`, `accessibleName`,
`labelledBy`, `describedBy`, `state`, `theme`, and `systemKey`.

Consumers must not recreate toggle markup, ARIA semantics, checked state,
read-only blocking, focus behavior, target size, track/thumb styling, or event
dispatch locally.

Consumers must not use this primitive for checkbox lists, radio groups,
multi-select cards, dropdowns, workflow builders, or product persistence.

## Rendered View

Review the default system proof at:

`/design-system/default/primitives/toggle-control`
