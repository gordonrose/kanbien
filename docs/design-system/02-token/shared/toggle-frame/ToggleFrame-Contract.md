# Toggle Frame Token Contract

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `toggle-control` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/toggle-control/ToggleControl-Behaviour.md` |
| Existing design-system URL | `/design-system/templates/form` |
| Proposed design-system URL | `/design-system/default/tokens/toggle-frame` |
| Shared token contract path | `docs/design-system/02-token/shared/toggle-frame/ToggleFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/toggle-frame/ToggleFrame-Implementation.md` |
| Files affected now | `docs/design-system/02-token/shared/toggle-frame/ToggleFrame-Contract.md`; `docs/design-system/02-token/systems/default/toggle-frame/ToggleFrame-Implementation.md` |

## Purpose

`toggle-frame` governs the reusable visual, sizing, and motion values for a toggle track and thumb.

It exists so the later `toggle-control` primitive can consume signed values instead of inventing switch colors, track geometry, thumb geometry, or motion locally.

## Layer Boundary

This token may define token decisions only.

It must not define toggle semantics, keyboard behavior, accessible names, validation copy, field-row composition, product persistence, primitive markup, pattern structure, demo routes, canonical files, app imports, or app wrappers.

## Shared Contract

Every implementation must preserve:

- theme-aware `off`, `on`, `read-only`, `disabled`, and `error` variants
- track background and border values
- track border width
- thumb background and foreground values
- track and thumb dimensions
- thumb offset for stateful rendering
- track padding, track radius, thumb radius, and thumb shadow values
- motion duration and easing values
- pairing with `minimum-target-size` for the primitive hit target
- non-text contrast evidence for thumb versus track in every approved theme

## Consumer Rules

Consumers must import the governed runtime seam instead of hard-coding toggle track, thumb, state, or motion values.

Consumers must not use this token as proof of semantic toggle behavior, keyboard behavior, accessible naming, field labelling, validation behavior, or persistence.

Toggle primitives must pair this token with `focus-ring`, `minimum-target-size`, and a governed semantic control strategy.

## Rendered View

Review the default system implementation at:

`/design-system/default/tokens/toggle-frame`
