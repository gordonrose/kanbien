# Index Nav Item Gap Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `index-nav-item` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/index-nav-item-gap` |
| Shared token contract path | `docs/design-system/02-token/shared/index-nav-item-gap/IndexNavItemGap-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/index-nav-item-gap/IndexNavItemGap-Implementation.md` |

## Purpose

This token governs the internal vertical gap between label-like text rows inside
a rectangular index-navigation item.

It does not define typography, truncation behavior, surface states, padding, or
the number of rows a later primitive or pattern may expose.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `index nav item content gap` |
| `shared contract` | Layout context | Vertical item content stack |
| `system implementation` | Default value | `0.25rem` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-gap/systems/default.mjs#indexNavItemGapTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/index-nav-item-gap` |
| Rendered view status | `available` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for governed index item content stacking. |
| `04-pattern-contract` | May consume this token through the accepted primitive or as a direct frame dependency if named by the pattern contract. |
| `app pages` | Denied; app pages must consume later governed primitives or patterns. |

## Required Evidence

The proof route must show the gap between stacked sample rows at desktop and
mobile widths without horizontal overflow.

## Consumer Restrictions

Consumers must not hard-code local row-gap values for governed index-navigation
item rectangles.
