# Record List Form Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `shared` |
| UI family | `record-list-form` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/default/patterns/record-list-form` |
| Proposed design-system URL | `/design-system/default/patterns/record-list-form` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/record-list-form/RecordListForm-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A person reviewing or editing records from a dense record-management surface. |
| Normal job | The user opens a record from a list and stays oriented to the matching detail panel without losing the list context. |
| Success outcome | The visible detail content clearly belongs to the opened record, and the user can close or continue navigating without encountering a mismatched or clipped panel. |
| Non-goals | This rule does not govern row visuals, drag/reorder persistence, detail-slot anatomy, entity-panel internals, hosted form schemas, backend loading, component props, canonical scenarios, or app adoption. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs,
demo routes, canonical files, app imports, or app wrappers.

## Behavior States

| State | Observable Behavior |
| --- | --- |
| no-records | The list communicates that no records are available, and no stale detail panel is presented as current. |
| record-selected | One selectable record is associated with the visible detail content. |
| record-changed | Opening a different selectable record changes the visible detail content to match that record. |
| detail-closed | The record list remains available after detail is closed; the user is not left with orphaned detail content. |
| disabled-record | A disabled record does not become the visible editable or reviewable detail. |
| constrained-detail | The visible detail remains understandable and operable when its available inline space is reduced. |
| hosted-content-blocked | Ungoverned hosted body content is identified as blocked rather than presented as governed record form UI. |

## Required Interactions

| Interaction | Observable Behavior |
| --- | --- |
| open selectable record | The detail content updates to the opened record. |
| open different selectable record | The previous detail content is hidden or replaced so only the current record appears current. |
| close detail | The detail content closes while the list context remains available. |
| resize or constrain detail | The detail content remains reachable and does not rely on page width alone to choose its posture. |
| navigate hosted panel content | Hosted panel interactions remain owned by the hosted panel and must not change which record is current unless a later layer defines that behavior. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Opening records, closing detail, and navigating hosted panel controls must remain keyboard reachable through governed child behavior. |
| Focus | Focus must not remain in hidden previous detail content after record changes, and close behavior must preserve a recoverable list context. |
| Names and semantics | The list and hosted detail must have names or relationships that let the user understand which record is current. |
| Error and status communication | Empty records, disabled records, blocked hosted content, and later hosted errors must be communicated in visible text and programmatically by the owning later layer. |
| Color-independent meaning | Current, disabled, blocked, and error meaning must not rely on color alone. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper
markup.

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `04-pattern-contract` |
| Next layer status | `allowed` |
| Reason | The pattern composes existing governed child patterns and has no direct token or primitive decision to make at Layer 1. |
