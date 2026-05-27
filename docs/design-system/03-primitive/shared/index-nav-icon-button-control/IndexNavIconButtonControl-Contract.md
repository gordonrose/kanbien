# Index Nav Icon Button Control Primitive Contract

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `index-navigation` |
| Primitive name | `index-nav-icon-button-control` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/index-nav-icon-button-control/IndexNavIconButtonControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/index-nav-icon-button-control/IndexNavIconButtonControl-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/index-nav-icon-button-control/index.mjs#indexNavIconButtonControlPrimitive` |
| Rendered proof | `/design-system/default/primitives/index-nav-icon-button-control` |

## Purpose

`index-nav-icon-button-control` renders one native icon-only button for
index-navigation actions such as add.

It does not create records, choose an icon library, define menus, or own panel
layout.

## Token Dependencies

| Token | Runtime seam |
| --- | --- |
| `index-nav-panel-frame` | `src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs#indexNavPanelFrameTokenSpec` |
| `icon-size` | `src/frontend/designSystem/layers/02-token/icon-size/systems/default.mjs#iconSizeTokenSpec` |
| `focus-ring` | `src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec` |
| `minimum-target-size` | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec` |

## Behavior Contract

The primitive renders one native `button` and emits
`index-nav-icon-button-control:activate` with the configured value when
activated.

The SVG glyph is decorative. Consumers must provide an accessible label.

## Accessibility Contract

The button has a programmatic accessible name, visible focus ring, and governed
minimum target size. The icon is `aria-hidden`.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/primitives/index-nav-icon-button-control` |
| Rendered view status | `available` |

## Consumer Restrictions

Consumers must not recreate icon-button markup, SVG sizing, focus behavior, or
activation dispatch locally.
