# Panel Corner Radius Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `panel` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/panel-corner-radius/PanelCornerRadius-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/panel-corner-radius/PanelCornerRadius-Implementation.md` |

## Purpose

This token governs the corner radius for panel containers that need to sit
flush with sibling panels, page regions, or nested containers.

It does not define button, item, tooltip, chip, badge, select-card, or
decorative-card radius.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `flush panel corner radius` |
| `shared contract` | Corner scope | All outer panel corners use the same radius unless a later behavior rule explicitly requires asymmetry. |
| `system implementation` | Default radius | `0` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/panel-corner-radius/systems/default.mjs#panelCornerRadiusTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/panel-corner-radius` |
| Rendered view status | `available` |

## Consumer Restrictions

Consumers must not hard-code panel `border-radius` values in primitives,
patterns, components, templates, or app pages.

Consumers must not use this token for controls or item-like elements. Buttons,
icon buttons, index items, tooltips, and cards must keep their own governed
corner decisions.
