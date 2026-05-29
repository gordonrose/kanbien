# Panel Header Frame Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `panel` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/panel-header-frame/PanelHeaderFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/panel-header-frame/PanelHeaderFrame-Implementation.md` |

## Purpose

This token governs reusable panel header geometry: fixed height, min and max
height, separator, title/action gap, background inheritance, and sticky inset.

It exists separately from `panel-frame` because a panel shell and a panel
header are consumed by different downstream seams and can change independently.

It does not define panel shell width, panel body scrolling, action button
appearance, navigation semantics, form controls, route selection, workflow
behavior, or app adoption.

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| `shared contract` | Required role | `panel header` |
| `shared contract` | Required geometry | block size, min block size, max block size, sticky inset, gap, separator, background, and foreground |
| `shared contract` | Action appearance | Not owned here; use governed button primitives and button tokens. |

## Consumer Restrictions

Consumers must not hard-code panel header height, min height, max height,
separator, sticky inset, title/action gap, or inherited surface behavior in
primitives, patterns, components, templates, or app pages.

Consumers must not use `panel-frame` as a substitute for this token.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/panel-header-frame` |
| Rendered view status | `available` |
