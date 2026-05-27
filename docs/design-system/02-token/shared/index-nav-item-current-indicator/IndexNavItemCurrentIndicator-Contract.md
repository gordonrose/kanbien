# Index Nav Item Current Indicator Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `index-nav-item` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/index-nav-item-current-indicator` |
| Shared token contract path | `docs/design-system/02-token/shared/index-nav-item-current-indicator/IndexNavItemCurrentIndicator-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/index-nav-item-current-indicator/IndexNavItemCurrentIndicator-Implementation.md` |

## Purpose

This token governs the non-color visual indicator used when an index-navigation
item is current.

It exists because current state must not rely on surface color alone, and Layer
3 primitives must not invent marker shape, size, placement, radius, or color
source locally.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `index nav item current indicator` |
| `shared contract` | Placement | Logical inline-start inside the item control |
| `shared contract` | Color source | Current text color unless a design system signs a stronger semantic source |
| `system implementation` | Width | `0.25rem` |
| `system implementation` | Minimum block size | `1.5rem` |
| `system implementation` | Block-size behavior | Stretch to the item content stack. |
| `system implementation` | Radius | `999px` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-current-indicator/systems/default.mjs#indexNavItemCurrentIndicatorTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/index-nav-item-current-indicator` |
| Rendered view status | `available` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for current-state non-color indication in `index-nav-item-control`. |
| `04-pattern-contract` | May consume this token only through the primitive unless a future pattern explicitly owns a direct indicator. |
| `app pages` | Denied; app pages must consume later governed primitives or patterns. |

## Required Evidence

The proof route must show the indicator as a non-color state affordance and
must state that semantics remain owned by the primitive.

## Consumer Restrictions

Consumers must not invent current bars, dots, icons, underlines, or badges
locally to satisfy color-independent state meaning.
