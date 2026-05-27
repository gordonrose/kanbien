# Index Nav Item Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Primitive | `index-nav-item-control` |
| Harness layer | `03-primitive` |
| Status | `review-ready` |
| Shared contract path | `docs/design-system/03-primitive/shared/index-nav-item-control/IndexNavItemControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/index-nav-item-control/IndexNavItemControl-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/index-nav-item-control/index.mjs#indexNavItemControlPrimitive` |
| Rendered proof | `/design-system/default/primitives/index-nav-item-control` |

## Responsibility

`index-nav-item-control` owns one interactive rectangular item used by later
index-navigation patterns.

It owns native button activation, one focus target, disabled activation denial,
programmatic current state, visible truncation, full-text tooltip disclosure,
and signed token consumption.

It does not own a list, tablist, page route, product workflow, backend data
loading, item ordering, or app adoption.

## Token Dependencies

| Token | Runtime seam |
| --- | --- |
| `index-nav-item-surface` | `src/frontend/designSystem/layers/02-token/index-nav-item-surface/systems/default.mjs#indexNavItemSurfaceTokenSpec` |
| `index-nav-item-current-indicator` | `src/frontend/designSystem/layers/02-token/index-nav-item-current-indicator/systems/default.mjs#indexNavItemCurrentIndicatorTokenSpec` |
| `index-nav-item-radius` | `src/frontend/designSystem/layers/02-token/index-nav-item-radius/systems/default.mjs#indexNavItemRadiusTokenSpec` |
| `index-nav-item-padding` | `src/frontend/designSystem/layers/02-token/index-nav-item-padding/systems/default.mjs#indexNavItemPaddingTokenSpec` |
| `index-nav-item-gap` | `src/frontend/designSystem/layers/02-token/index-nav-item-gap/systems/default.mjs#indexNavItemGapTokenSpec` |
| `label-text-style` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` |
| `supporting-text-style` | `src/frontend/designSystem/layers/02-token/supporting-text-style/systems/default.mjs#supportingTextStyleTokenSpec` |
| `tooltip-surface` | `src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs#tooltipSurfaceTokenSpec` |
| `tooltip-text-style` | `src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs#tooltipTextStyleTokenSpec` |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` |

## Behavior Contract

The primitive renders a native `button type="button"` and emits a DOM
`index-nav-item-control:activate` event only when enabled.

The `current` state sets `aria-current="true"` and must also render a visible
non-color marker from the signed `index-nav-item-current-indicator` token.

The `disabled` state sets the native `disabled` attribute and must not emit the
activation event.

Hover visuals, when used, must come from the signed `index-nav-item-surface`
hover variant. The primitive must not use local filters, brightness changes,
opacity, or ad hoc colour mixes for pointer hover.

The visible label truncates with ellipsis inside the button while the full text
remains available through `aria-label` and the tooltip disclosure.

The supporting-text row is optional data but not optional geometry. When no
supporting text is provided, the primitive reserves the supporting-text row as
`aria-hidden` empty visual space so index items keep a stable height across
visible and hidden supporting-text variants.

## Accessibility Contract

The primitive has exactly one focusable element.

Keyboard users can focus the item with Tab and activate it with native button
keyboard behavior.

Focus uses the signed focus-ring token. Current and disabled meaning must not
depend on color alone.

The empty reserved supporting-text row must not create an accessible name,
description, or fake metadata value.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/primitives/index-nav-item-control` |
| Rendered view status | `available` |

## Consumer Restrictions

Consumers must not nest a focusable truncating-label primitive inside this
button.

Consumers must not copy the rendered proof markup, recreate the ARIA rules, or
replace signed token values with local CSS literals.
