# Index Nav List Gap Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `index-nav-list` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/index-nav-list-gap` |
| Shared token contract path | `docs/design-system/02-token/shared/index-nav-list-gap/IndexNavListGap-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/index-nav-list-gap/IndexNavListGap-Implementation.md` |

## Purpose

This token governs the vertical spacing between rectangular `index-nav-item`
entries inside a governed index navigation list.

It does not define internal item spacing, item padding, list padding, scroll
behavior, selected state, route behavior, or app adoption.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `index nav list item gap` |
| `shared contract` | Layout context | Vertical stack of governed index-nav-item patterns |
| `system implementation` | Default value | `0.5rem` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-list-gap/systems/default.mjs#indexNavListGapTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/index-nav-list-gap` |
| Rendered view status | `available` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `04-pattern-contract` | May consume this token for spacing between `index-nav-item` entries. |
| `03-primitive` | Denied; this is list composition spacing, not primitive internals. |
| `app pages` | Denied; app pages must consume later governed patterns. |

## Consumer Restrictions

Consumers must not hard-code local row-gap values between governed index nav
items.
