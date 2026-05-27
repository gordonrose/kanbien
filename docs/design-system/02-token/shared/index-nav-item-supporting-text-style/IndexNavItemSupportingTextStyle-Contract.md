# Index Nav Item Supporting Text Style Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `index-nav-item` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/index-nav-item-supporting-text-style` |
| Shared token contract path | `docs/design-system/02-token/shared/index-nav-item-supporting-text-style/IndexNavItemSupportingTextStyle-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/index-nav-item-supporting-text-style/IndexNavItemSupportingTextStyle-Implementation.md` |

## Purpose

This token governs the secondary supporting text row inside a rectangular
index-navigation item, such as `3 items` or `10 fields`.

It does not define the primary label, item surface, foreground colour, current
state, count calculation, or app data contract.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `index nav item supporting text` |
| `shared contract` | Overflow posture | Single-line truncation-ready text style |
| `shared contract` | Foreground rule | Inherit foreground from the consuming item context. |
| `system implementation` | Font family | Inter with system UI fallbacks |
| `system implementation` | Font size | `0.75rem` |
| `system implementation` | Font weight | `800` |
| `system implementation` | Line height | `1.2` |
| `system implementation` | Letter spacing | `0` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-supporting-text-style/systems/default.mjs#indexNavItemSupportingTextStyleTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/index-nav-item-supporting-text-style` |
| Rendered view status | `available` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for secondary text inside `index-nav-item-control`. |
| `04-pattern-contract` | May consume this token only through the primitive unless a future pattern owns direct supporting text. |
| `app pages` | Denied; app pages must consume later governed primitives or patterns. |

## Required Evidence

The proof route must render the text sample and show the fallback stack,
single-line overflow readiness, inherited foreground posture, and zoom/reflow
responsibility.

## Consumer Restrictions

Consumers must not locally style supporting text with font, weight, line-height,
letter-spacing, transform, colour, or opacity values.
