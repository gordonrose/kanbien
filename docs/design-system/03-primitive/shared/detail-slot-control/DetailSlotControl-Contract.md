# Detail Slot Control Primitive

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| Token dependency systems | `default` |
| UI family | `detail-slot` |
| Primitive name | `detail-slot-control` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/record-list-item/RecordListItem-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/detail-slot-control/DetailSlotControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/detail-slot-control/DetailSlotControl-Proof.md` |

## Purpose

`detail-slot-control` owns the reusable shell for a selected record detail slot:
aside semantics, accessible label, header/title posture, close-button
composition, tokenized surface values, body slot, and a primitive-level close
event.

It does not own product detail rendering, record selection, list layout,
reordering, persistence, focus-return routing, modal behavior, or app adoption.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Primitive Action |
| --- | --- | --- | --- | --- |
| Record-list rendered local `<aside>` detail markup. | `03-primitive` | None. | Missing detail-slot primitive. | Create `detail-slot-control`. |
| Pattern listened directly to close icon-button activation. | `03-primitive` | `icon-button-control` exists but not the detail-slot close abstraction. | Missing primitive close event. | Emit `detail-slot-control:close`. |
| Detail body content is pattern/product-specific. | `04-pattern-contract` or later | Not applicable. | None. | Primitive exposes body slot only. |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `detail-slot-frame` | `docs/design-system/02-token/shared/detail-slot-frame/DetailSlotFrame-Contract.md` | `default` | `docs/design-system/02-token/systems/default/detail-slot-frame/DetailSlotFrame-Implementation.md` | `src/frontend/designSystem/layers/02-token/detail-slot-frame/systems/default.mjs#detailSlotFrameTokenSpec` | themed surface, border, padding, sizing, scroll limit | `consumable` |
| `icon-button-control` | `docs/design-system/03-primitive/shared/icon-button-control/IconButtonControl-Contract.md` | `default` | `docs/design-system/03-primitive/systems/default/icon-button-control/IconButtonControl-Proof.md` | `src/frontend/designSystem/layers/03-primitive/icon-button-control/index.mjs#iconButtonControlPrimitive` | close action target and glyph behavior | `consumable` |

## Behavior Contract

The primitive renders a labelled detail slot as an `<aside>`.

The close action is rendered through `icon-button-control`. Activating that
button emits `detail-slot-control:close` from the slot root with the slot id.

Consumers provide the body HTML. The primitive must not inspect or mutate
product detail content.

## Accessibility Contract

The slot must have an accessible name. The close action must have an accessible
name and preserve `icon-button-control` keyboard behavior. The primitive must
not trap focus or hide body content from keyboard navigation.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Runtime seam status | `implemented` |
| Planned primitive module | `src/frontend/designSystem/layers/03-primitive/detail-slot-control/index.mjs` |
| Planned primitive export | `detailSlotControlPrimitive` |
| Allowed consumers | `04-pattern-contract` and later governed layers |
| Consumers must use | `renderDetailSlotControlPrimitive` and `attachDetailSlotControlPrimitiveController` |
| Consumers must not use | copied aside markup, local CSS values, screenshots, route-local proof markup, or direct icon-button close handling |

## Rendered View

`/design-system/default/primitives/detail-slot-control`
