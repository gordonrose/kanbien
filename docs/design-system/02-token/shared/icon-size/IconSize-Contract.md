# Icon Size Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `index-navigation` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/icon-size/IconSize-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/icon-size/IconSize-Implementation.md` |

## Purpose

This token governs visual glyph size for icon-button primitives.

It does not define the interactive target size, button frame, accessible name,
focus ring, icon path, or action behavior.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `icon button glyph` |
| `system implementation` | Glyph inline size | `1rem` |
| `system implementation` | Glyph block size | `1rem` |
| `system implementation` | ViewBox basis | `24` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/icon-size/systems/default.mjs#iconSizeTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/icon-size` |
| Rendered view status | `available` |

## Consumer Restrictions

Consumers must not hard-code SVG width or height inside governed icon-button
primitives.

Consumers must not treat icon size as the interactive hit-area size.
