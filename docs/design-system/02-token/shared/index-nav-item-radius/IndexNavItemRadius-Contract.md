# Index Nav Item Radius Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `index-nav-item` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Proposed design-system URL | `/design-system/default/tokens/index-nav-item-radius` |
| Shared token contract path | `docs/design-system/02-token/shared/index-nav-item-radius/IndexNavItemRadius-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/index-nav-item-radius/IndexNavItemRadius-Implementation.md` |

## Purpose

This token governs the corner radius for rectangular index-navigation items.

It does not define item behavior, selected semantics, padding, gap, borders,
surface colors, or app adoption.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `index nav item corner radius` |
| `shared contract` | Corner scope | All item corners use the same radius unless a later behavior rule explicitly requires asymmetry. |
| `system implementation` | Default value | `0.375rem` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-item-radius/systems/default.mjs#indexNavItemRadiusTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/index-nav-item-radius` |
| Rendered view status | `available` |
| Dependency chain visible | `not-applicable` |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `03-primitive` | May consume this token for governed rectangular index item controls. |
| `04-pattern-contract` | May consume this token through the accepted primitive or as a direct frame dependency if named by the pattern contract. |
| `app pages` | Denied; app pages must consume later governed primitives or patterns. |

## Required Evidence

The proof route must show the radius value on a visible box at desktop and
mobile widths without horizontal overflow.

## Consumer Restrictions

Consumers must not hard-code local border-radius values for governed
index-navigation item rectangles.
