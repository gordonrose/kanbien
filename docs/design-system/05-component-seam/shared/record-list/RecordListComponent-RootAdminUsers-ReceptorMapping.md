# Record List Component Root Admin Users Receptor Mapping

Use this as a pressure-test mapping, not as app adoption approval.

## Scope

- Feature: `rootUsers`
- Capability: list root users
- App surface or route: `/root-admin/users`
- Governed component seam: `record-list-component`
- Component contract: `docs/design-system/05-component-seam/shared/record-list/RecordListComponent-Contract.md`
- Upstream pattern contract: `docs/design-system/04-pattern-contract/shared/record-list/RecordList-Contract.md`
- Status: review-ready

## Feature Projection Summary

- Domain behavior being projected: root-user list rows, selection/open detail state, and detail content.
- API or view-model source: `GET /v1/root-users` list response and feature-owned root-admin browser view model.
- Feature-owned adapter: future root-admin root-users list adapter.
- Unsupported component affordances: filter/query/result-count/status bar behavior is outside this component seam.
- Compatibility or migration notes: existing `/root-admin/users` must not adopt this component until the use-case page, canonical, app-adoption, and parity gates exist and pass.

## Receptor Mapping

Only receptors the feature actually uses or explicitly declares unsupported are
included.

| Feature Fact Or Action | Source Field Or Rule | Component Receptor | Adapter Responsibility | Required API/View-Model Field | Status |
| --- | --- | --- | --- | --- | --- |
| Root user id | `rootUser.rootUserId` | `items[].itemId` | Pass through durable id. | `rootUserId` | mapped |
| Display name | `firstName` plus `lastName`, falling back to email when both names are empty | `items[].title` | Derive display title without mutating the API payload. | `firstName`, `lastName`, `email` | mapped |
| Email | `rootUser.email` | `items[].subtitle` | Pass through normalized email as supporting text. | `email` | mapped |
| Lifecycle/status summary | `rootUser.status`, `deletedAt`, or `anonymized` | `items[].meta` | Derive compact human-readable status text. | `status`, `deletedAt`, `anonymized` | mapped |
| Disabled row state | feature permission/lifecycle decision | `items[].disabled` | Derive only if the feature decides a visible row cannot be opened. | lifecycle and permission view-model fields | blocked until feature-owned disabled semantics are documented. |
| Open root user | current route/page state | `openItemId` | Map current open detail id. | selected/open root user id in frontend state | mapped |
| Detail content | future governed detail/panel seam | `detailContentHtml` | Supply governed detail content for the open root user. | fields used by the root-user detail panel | blocked until later component/app adoption gates approve the detail seam. |
| Reorder root users | not a root-users workflow | `allowReorder` | Pass `false` so the governed pattern suppresses reorder affordances. | not applicable | mapped |

## Event Mapping

| Component Event | Feature Handler Or Rule | Backend/API Effect | UI-Local Effect | Status |
| --- | --- | --- | --- | --- |
| `record-list-component:open` | Open the root-user detail panel for `itemId`. | none | Updates selected/open detail state. | mapped |
| `record-list-component:close` | Close the root-user detail panel. | none | Clears selected/open detail state. | mapped |
| `record-list-component:reorder` | Not used for root users because `allowReorder` is false. | none | none | not-used |
| `record-list-component:resize-detail` | May remain UI-local if later adoption approves the resize affordance. | none | Updates detail width for the current view only. | blocked |

## Unsupported Affordances

| Component Affordance | Feature Decision | Required Safeguard |
| --- | --- | --- |
| Reorder | Root users are sorted/listed by API/query semantics, not by manual display order. | Pass `allowReorder: false` and add adoption tests that rows have no drag or keyboard reorder affordance. |
| Filter controls and active filters | Root-user search/filter behavior is API/query-owned and belongs to a future filter/status seam. | Do not put filter controls inside `RecordListComponent`. |
| Result count/status bar | Excluded from the first Layer 5 pilot. | Use a future status-bar or list-toolbar seam. |

## API/View-Model Sufficiency Check

| Component Need | Supplied By API/View Model? | Derivation Owner | Missing Field Decision |
| --- | --- | --- | --- |
| row id | yes | API | none |
| row title | derived | feature adapter | derive from `firstName`, `lastName`, and `email` |
| row subtitle | yes | feature adapter | pass through email |
| row metadata | derived | feature adapter | derive from lifecycle/status fields |
| disabled reason | no | feature adapter | blocked until feature disabled semantics are defined |
| detail content | partial | later governed detail/panel seam | blocked until later layers approve detail content seam |

## Accessibility And State Preservation

- Accessible names / labels supplied by: feature adapter must provide `listLabel: Root users` and `detailLabel: Root user detail`.
- Empty, loading, denied, disabled, and degraded states supplied by: feature-owned page/view model. Only empty visible copy maps to `emptyLabel` in this component.
- Live feedback copy supplied by: upstream `record-list` pattern for reorder-enabled features; root users pass `allowReorder: false`, so reorder feedback must not be exposed.
- Focus, keyboard, and controller behavior preserved by: `RecordListComponent` and upstream `record-list` pattern.
- Known accessibility blockers: none for this mapping; later app adoption must prove reorder affordances are absent.

## Verification

- Adapter/unit tests: required before app adoption.
- API/view-model contract tests: required before app adoption.
- Component receptor tests: covered by `tests/unit/designSystem/recordListComponent.test.ts` for generic seam behavior.
- Browser/rendered proof: Layer 5 component render proof exists for the generic seam; root-users app adoption remains blocked until use-case page, canonical, app-adoption, and parity evidence exists.
- Mock-honesty check: root-users fixtures must use the actual API response shape rather than component-convenience fields.
- Unsupported-affordance tests: required before any root-users adoption.

## Boundary Statement

Feature code owns domain meaning, authorization, route behavior, API calls, and
adapter derivation.

The governed component seam owns receptor validation, render structure,
component-level event translation, controller behavior, and accessibility
preservation.

App pages must not copy governed pattern markup, primitive wiring, local CSS,
controller behavior, or accessibility feedback.
