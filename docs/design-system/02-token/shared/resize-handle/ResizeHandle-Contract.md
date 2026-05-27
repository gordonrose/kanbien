# Resize Handle Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `resize-handle` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/resize-handle` |

## Purpose

This token governs the visual and input affordance for inline resize handles:
hit area width, visible rail width, visible rail radius, cursor,
touch-action, placement, and visual rail colour.

It does not define panel min width, max width, current width, pointer behavior,
keyboard behavior, ARIA value attributes, or emitted events.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `inline resize handle` |
| `shared contract` | Placement | `inline-end` |
| `shared contract` | Width authority | Panel min and max widths must come from the consuming frame token or pattern, not from this token. |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/resize-handle/systems/default.mjs#resizeHandleTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/resize-handle` |
| Rendered view status | `available` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for resize-handle affordance values. |
| `04-pattern-contract` | May consume resize behavior only through a governed primitive. |
| `app pages` | Denied; app pages must consume later governed patterns or component seams. |

## Consumer Restrictions

Consumers must not locally define resize handle hit area, visible rail width,
visible rail radius, cursor, touch-action, placement, or visual rail colour
when this token applies.

Consumers must not use this token as panel width authority. Min and max
constraints belong to the owning frame token or containing pattern.
