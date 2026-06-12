# Record List Form Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `record-list-form` |
| Pattern name | `record-list-form` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/record-list-form/RecordListForm-Behaviour.md`; child behavior rules `docs/design-system/01-behavior-rule/shared/record-list-item/RecordListItem-Behaviour.md` and `docs/design-system/01-behavior-rule/shared/entity-panel/EntityPanel-Behaviour.md` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/record-list-form/RecordListForm-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/default/record-list-form/RecordListForm-Proof.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/record-list-form/index.mjs#recordListFormPattern` |
| Rendered proof | `/design-system/default/patterns/record-list-form` |

## Purpose

`record-list-form` composes one governed `record-list` with governed
`entity-panel` instances inside the record-list detail slot.

It does not own row behavior, drag/reorder persistence, detail close behavior,
entity-panel header behavior, primary-index behavior, secondary-index behavior,
body scrolling, form-field schemas, backend data loading, component props,
canonical scenarios, or app adoption.

## Upstream Gates

| Gate | Status |
| --- | --- |
| Behavior rule | `review-ready`; `docs/design-system/01-behavior-rule/shared/record-list-form/RecordListForm-Behaviour.md` |
| Pattern dependency | `record-list` and `entity-panel` are `review-ready` for `default` |
| Direct token dependency | `not-applicable`; child patterns own tokens |
| Direct primitive dependency | `not-applicable`; child patterns own primitives |

## Composition Contract

The pattern renders one governed `record-list`. The record-list detail slot
receives governed `entity-panel` content through the record-list custom detail
body slot.

The pattern may render one entity-panel body per selectable record and switch
which panel is visible when the record-list emits `record-list:open`. Disabled
records must not become visible hosted entity panels.

Closing, manual detail resizing, mobile detail overlay posture, row movement,
and record-list empty state remain owned by `record-list` and its child
primitives. Entity-panel header, primary index, secondary index, body region,
mobile internal region, and body scrolling remain owned by `entity-panel` and
its child patterns.

The hosted custom detail body is owned by `record-list-form`. The child
`record-list` owns the detail slot shell, open/close state, resize behavior,
and emitted events, but it must preserve the hosted custom detail body while
opening, switching, or closing records.

The hosted primary index must be passed into the hosted `entity-panel` seam.
This pattern must not render a parent-owned primary-index wrapper around or
beside the hosted entity panel.

Hosted entity-panel body content must already be governed by its own primitive
or pattern seam before later layers treat it as real form UI.

## Data Or Event Contract

Each record item accepts the `record-list` item shape: `itemId`, `title`,
optional `subtitle`, optional `meta`, and optional `disabled`.

The pattern also accepts optional hosted entity-panel controls:
`primaryItems`, `primaryCurrent`, `showPrimaryIndex`, `primaryResizable`,
`secondaryItems`, `secondaryCurrent`, `showSecondaryIndex`,
`showSecondaryHeader`, `secondaryResizable`, `mobileActiveRegion`,
`entityBodyHtml`, and `entityBodyHtmlByItemId`.

The pattern consumes `record-list:open` and `record-list:close`. It emits
`record-list-form:open` with `{ itemId }` and `record-list-form:close` with an
empty detail object. Record reorder and resize events remain owned and emitted
by `record-list`.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/patterns/record-list-form` |
| Rendered view status | `available` |

The rendered proof must expose controls for theme, direction, width pressure,
list/detail ratio, fixture count, selected record, hosted primary-index
presence, hosted secondary-index presence, hosted secondary header, hosted
secondary resize, hosted secondary fixture count, hosted mobile active region,
and hosted body content pressure.

## Consumer Restrictions

Consumers must not copy proof-route markup, recreate record-list row behavior,
replace detail-slot behavior with local drawer markup, recreate entity-panel
header/index/body behavior, or invent local mobile overlay CSS.

Consumers must not put ungoverned form controls into the hosted entity-panel
body and then claim this pattern governs them.
