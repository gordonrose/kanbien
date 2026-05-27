# Index Nav Panel Frame Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `index-nav` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/index-navigation/IndexNavigation-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/index-nav-panel-frame/IndexNavPanelFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/index-nav-panel-frame/IndexNavPanelFrame-Implementation.md` |

## Purpose

This token governs the reusable frame values needed before an index-nav panel
can own container width, surface, padding, scroll height, mobile width, or add
breakpoint, or add action frame styling.

Panel frame corner radius must come from the signed `panel-corner-radius`
token. This keeps flush panel corner decisions reusable instead of trapping
them inside the index-navigation family.

It does not define list semantics, item behavior, route selection, nested index
relationships, or app adoption.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required roles | `panel frame`; `panel action` |
| `system implementation` | Minimum desktop panel width | `10rem` |
| `system implementation` | Standard panel width | `13rem` |
| `system implementation` | Double panel width | `26rem` |
| `system implementation` | Maximum desktop panel width | `32rem` |
| `system implementation` | Mobile panel width | `100vw` |
| `system implementation` | Mobile breakpoint | `44rem` |
| `system implementation` | Desktop scroll max block size | `32rem` |
| `system implementation` | Panel frame radius source | `panel-corner-radius-flush` |
| `system implementation` | Runtime seam | `src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs#indexNavPanelFrameTokenSpec` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/index-nav-panel-frame` |
| Rendered view status | `available` |

## Consumer Restrictions

Consumers must not hard-code index-nav panel min width, max width, standard
width, double width, breakpoint, padding, surface, radius, or scroll-height
values in primitives, patterns, components, templates, or app pages.

Consumers must not treat proof-only width controls as new signed token values.
