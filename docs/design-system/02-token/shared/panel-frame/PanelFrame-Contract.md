# Panel Frame Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `panel` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/panel-frame/PanelFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/panel-frame/PanelFrame-Implementation.md` |

## Purpose

This token governs reusable panel shell values before primitives or patterns
compose panels.

It exists so entity body panels, index panels, and later panel-like structures
do not duplicate widths, surfaces, padding, border, radius, or scroll sizing
locally.

It does not define panel header geometry, panel action appearance, list
semantics, form controls, route selection, workflow behavior, body slot
anatomy, backend data loading, or app adoption.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `panel frame` |
| `shared contract` | Panel frame must include | background, foreground, border, radius, padding, gap, min/standard/double/max inline size, mobile inline size, mobile breakpoint, and desktop max block size |
| `shared contract` | Radius source | Panel shell radius must derive from `panel-corner-radius` |

## Consumer Restrictions

Consumers must not hard-code panel min width, standard width, double width,
max width, mobile width, breakpoint, padding, surface, radius, or scroll-height
values in primitives, patterns, components, templates, or app pages.

Consumers must use `panel-header-frame` for panel header geometry instead of
adding header variants to this token.

Consumers must not copy values from `index-nav-panel-frame` into a later
entity-body token. If a panel value is reusable, consume `panel-frame`; if a
value is genuinely index-specific, keep it in the index-navigation family.

Consumers must not treat proof-only diagnostic controls as new signed token
values.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/panel-frame` |
| Rendered view status | `available` |
