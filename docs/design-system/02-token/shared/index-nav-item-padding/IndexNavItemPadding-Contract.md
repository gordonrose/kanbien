# Index Nav Item Padding Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `index-nav-item` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/index-nav-item-padding` |
| Shared token contract path | `docs/design-system/02-token/shared/index-nav-item-padding/IndexNavItemPadding-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/index-nav-item-padding/IndexNavItemPadding-Implementation.md` |

## Purpose

This token governs the block and inline padding inside a rectangular
index-navigation item.

It does not guarantee the interactive hit area by itself; later primitives must
also consume `minimum-target-size`.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required roles | `block padding`; `inline padding` |
| `shared contract` | Direction rule | Inline padding must be logical so RTL does not require a second value. |
| `system implementation` | Block value | `0.625rem` |
| `system implementation` | Inline value | `0.75rem` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-padding/systems/default.mjs#indexNavItemPaddingTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/index-nav-item-padding` |
| Rendered view status | `available` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for governed index item controls. |
| `04-pattern-contract` | May consume this token through the accepted primitive or as a direct frame dependency if named by the pattern contract. |
| `app pages` | Denied; app pages must consume later governed primitives or patterns. |

## Required Evidence

The proof route must show block and inline padding separately and verify mobile
readability without horizontal overflow.

## Consumer Restrictions

Consumers must not hard-code local item padding values for governed
index-navigation item rectangles.
