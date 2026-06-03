# Record List Component Seam Contract

## Component Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems and app consumers` |
| UI family | `record-list` |
| Component seam name | `record-list-component` |
| Harness layer | `05-component-seam` |
| Component status | `review-ready` |
| Upstream pattern contract | `docs/design-system/04-pattern-contract/shared/record-list/RecordList-Contract.md` |
| Shared component contract path | `docs/design-system/05-component-seam/shared/record-list/RecordListComponent-Contract.md` |
| Planned runtime seam | `src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs` |
| Files affected now | `docs/design-system/05-component-seam/shared/record-list/RecordListComponent-Contract.md`; `src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs`; `tests/unit/designSystem/recordListComponent.test.ts`; `docs/design-system/05-component-seam/component-readiness-index.md`; `docs/design-system/05-component-seam/shared/record-list/RecordListComponent-RootAdminUsers-ReceptorMapping.md` |

## Purpose

| Field | Value |
| --- | --- |
| Pattern job consumed | The Layer 4 `record-list` pattern renders a governed list-detail structure with row open, close, reorder, resize, empty-state, and live-feedback behavior. |
| Component seam job | Expose that pattern through one public component boundary with named receptors, component-level events, controller attachment, and feature-adapter rules. |
| Expected consumers | Later demo, canonical, and app-adoption layers after their gates are active; feature-owned adapters may use this contract to map domain/API data into receptors. |
| Non-goals | Status bars, filter panels, backend query construction, persisted sorting, root-admin route state, app adoption, demo fixtures, and canonical scenarios. |

## Layer Boundary

This ComponentSeamArtifact defines public receptors, event translation,
controller ownership, import boundaries, and feature-adapter boundaries only.

It does not define token values, primitive behavior, pattern composition, demo
fixtures, canonical scenarios, app wrappers, backend query semantics,
persistence behavior, authorization rules, or route topology.

## Preflight Decision Ledger

Not applicable. This component seam was created from the governed Layer 4
`record-list` contract and runtime seam, not from a rendered route, screenshot,
template, canonical, app-like review surface, or visible defect.

## Upstream Gates

| Field | Value |
| --- | --- |
| Pattern contract status | `review-ready` |
| Pattern readiness source checked | `docs/design-system/04-pattern-contract/pattern-readiness-index.md` |
| Required pattern consumable by selected systems | `yes` |
| Pattern runtime seam status | `implemented` |
| Consumer contexts known | `partial`; design-system demo is now active for next-layer work, canonical/app-adoption layers are still expected but scaffold-only, and root-admin users is recorded only as a pressure-test mapping. |

## Pattern Dependency

| Pattern | Shared Contract | Runtime Seam | Component Decision Supported | Status |
| --- | --- | --- | --- | --- |
| `record-list` | `docs/design-system/04-pattern-contract/shared/record-list/RecordList-Contract.md` | `src/frontend/designSystem/layers/04-pattern-contract/record-list/index.mjs#recordListPattern`; `#renderRecordListPattern`; `#attachRecordListPatternController` | The component consumes the governed pattern instead of rebuilding row, detail-slot, resize, reorder, close, empty, or live-region behavior. | `consumable` |

## Public Seam

| Field | Value |
| --- | --- |
| Runtime module | `src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs` |
| Public export | `recordListComponent`; `renderRecordListComponent`; `attachRecordListComponentController`; `recordListComponentContract` |
| Seam shape | `combined render function and controller` |
| Allowed consumers | Later Layer 6/7/8/9 artifacts when active; feature-owned adapters may prepare receptor values but app pages must wait for first-adoption gates. |
| Consumers must not use | `pattern proof markup, copied app markup, local CSS values, primitive event listeners, DOM selectors, screenshots, or chat history` |

## Receptor Contract

Only receptors that change observable behavior, semantics, content, event
handling, or consumer obligations are included.

| Receptor | Category | Shape | Required Or Optional | Owner Of Meaning | Component Responsibility | Invalid Or Missing Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `identity` | non-empty string | optional | component | Use as the stable component boundary id and derive a pattern id. | Generate a stable local id when missing; reject empty strings. |
| `systemKey` | `identity` | `default` | optional | component | Forward to the upstream pattern. | Reject unsupported systems through the pattern. |
| `theme` | `identity` | `original`, `dark`, or `desert` | optional | component | Forward to the upstream pattern. | Reject unsupported themes through the pattern. |
| `listLabel` | `accessibility` | non-empty string | required | feature | Provide the accessible name for the list region. | Reject missing or empty labels. |
| `detailLabel` | `accessibility` | non-empty string | required | feature | Provide the accessible name and title for the detail slot. | Reject missing or empty labels. |
| `emptyLabel` | `content` | non-empty string | optional | feature | Forward visible empty-state copy to the pattern. | Default to `No records`; reject empty strings when supplied. |
| `items` | `data` | array of `{ itemId, title, subtitle?, meta?, disabled? }` | required | feature | Normalize and forward row data to the pattern. | Reject non-arrays, empty item ids, empty titles, and duplicate item ids through the pattern. |
| `selectedItemId` | `state` | string or empty string | optional | feature | Forward current selection to the pattern. | Unknown ids result in the pattern selecting the first enabled item. |
| `openItemId` | `state` | string or empty string | optional | feature | Forward open detail state to the pattern. | Unknown ids result in the pattern selecting the first enabled item. |
| `detailContentHtml` | `content` | governed HTML string for the open detail body | optional | feature adapter | Replace only the upstream pattern's proof placeholder detail body. | Default to pattern placeholder; non-string values are rejected. |
| `initialDetailRatio` | `state` | `1:5`, `1:4`, or `1:2` | optional | feature | Forward the initial desktop list-detail ratio to the pattern as `ratio`. | Default to `1:2`; unsupported values are rejected through the pattern. |
| `allowResize` | `state` | boolean | optional | feature | Forward whether the governed resize handle is rendered. | Default to `true`. |
| `allowReorder` | `state` | boolean | optional | feature | Forward whether row reorder affordances are exposed by the governed pattern. | Default to `true`; `false` renders non-draggable rows and suppresses reorder affordances. |

## Unsupported Receptors And Affordances

| Affordance Or Input | Unsupported In This Seam Because | Required Consumer Behavior |
| --- | --- | --- |
| Filter controls, active-filter chips, query state, result counts, and status bars | They are separate UI families and were intentionally excluded from this first list component pilot. | Use a future filter/status component seam; do not add local status bar or filter markup inside this component. |
| Backend request builders or persistence flags | Backend semantics belong to the feature/API layer, not the component. | Map API data through a feature-owned adapter and handle persistence in feature code. |
| Arbitrary classes, DOM selectors, and primitive event listeners | They would let consumers bypass the governed pattern and controller. | Consume the public render/controller seam and component-level events. |

## Feature Projection Boundary

| Feature Fact Or Action | Feature-Owned Source | Component Receptor | Adapter Responsibility | Backend/API Field Required | Unsupported Or Missing Decision |
| --- | --- | --- | --- | --- | --- |
| Record identity | API/view model | `items[].itemId` | Pass through durable entity id. | entity id field such as `rootUserId` | none |
| Row title | API/view model | `items[].title` | Derive display title from durable feature fields. | feature-specific display fields | none |
| Row subtitle | API/view model | `items[].subtitle` | Derive supporting row text. | feature-specific supporting fields | optional |
| Row metadata | API/view model | `items[].meta` | Derive compact metadata. | feature-specific status or timestamp fields | optional |
| Disabled state | API/view model | `items[].disabled` | Derive only from feature-owned disabled semantics. | feature-specific lifecycle/permission state | optional |
| Detail body | Feature adapter or later governed panel seam | `detailContentHtml` | Supply governed body content for the open item. | fields required by the detail panel | blocked for app adoption until later gates define the first consumer. |
| Reorder action | Feature workflow | `allowReorder` and component reorder event | Enable only for features where reordering is a valid workflow. | persistence endpoint if reorder must be durable | none; non-reorder features pass `allowReorder: false`. |

## Event Translation

| Source Event | Source Owner | Component Event | Payload Shape | Consumer Obligation |
| --- | --- | --- | --- | --- |
| `record-list:open` | `record-list` pattern | `record-list-component:open` | `{ itemId }` | Handle feature selection/open state when the feature consumes this event. |
| `record-list:close` | `record-list` pattern | `record-list-component:close` | `{}` | Clear feature open state when the feature consumes this event. |
| `record-list:reorder` | `record-list` pattern | `record-list-component:reorder` | `{ itemId, targetItemId, position, input }` | Persist only if the feature has an approved reorder workflow. |
| `record-list:resize-detail` | `record-list` pattern | `record-list-component:resize-detail` | `{ inlineSize }` | Treat as UI-local unless a later feature explicitly persists panel sizing. |

## Controller Ownership

The component controller attaches the upstream `record-list` pattern
controller and translates pattern events into component-level events from the
component boundary.

The upstream pattern continues to own row open/close coordination, DOM reorder
application, focus retention after reorder, live-region movement feedback,
detail close behavior, and resize application.

The component owns no backend side effects and no app route state.

## Accessibility Preservation

The seam preserves the shared WCAG 2.2 AA default.

The feature must supply non-empty `listLabel` and `detailLabel` receptors so
the list region and detail slot remain named. The upstream pattern preserves
row semantics, detail-slot semantics, resize separator semantics, focus
behavior, keyboard behavior, and reorder live feedback.

When `detailContentHtml` is supplied, the feature adapter or later governed
panel seam owns the accessibility of that content. The component must not hide
or remove the pattern's polite atomic live region.

## Import And Dependency Boundary

| Field | Value |
| --- | --- |
| Allowed imports | `src/frontend/designSystem/layers/04-pattern-contract/record-list/index.mjs` |
| Forbidden imports | `feature persistence, backend transport, app page modules, route-local proof modules, legacy design-system route markup` |
| Cross-feature dependency posture | `not-applicable`; feature adapters depend on the component contract, but the component seam does not import features. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| pattern preservation | Unit tests prove `renderRecordListComponent` renders `data-record-list-pattern`, governed row controls, detail-slot control, resize handle, non-reorder posture, and the live region instead of rebuilding them. |
| receptor validation | Unit tests prove required labels and `allowReorder: false` are guarded. |
| event translation | Unit/source tests prove the controller consumes pattern events and emits component-level events. |
| feature projection | `RecordListComponent-RootAdminUsers-ReceptorMapping.md` records the first pressure-test mapping and blocker. |
| accessibility | Unit tests and this contract prove required labels are non-empty and live feedback remains present. |
| consumer boundary | Contract and runtime module forbid local markup/CSS/primitive event reconstruction. |

## Consumer Restrictions

Consumers must use this seam instead of copying pattern proof markup, primitive
markup, controller logic, local CSS, or event translation.

Consumers must map feature/domain/API behavior into receptors through a
feature-owned adapter or view model.

Consumers must not make backend, persistence, authorization, or route decisions
inside component receptor values.

Consumers must not weaken accessibility requirements recorded here.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared component contract at | `docs/design-system/05-component-seam/shared/record-list/RecordListComponent-Contract.md` |
| Store runtime seam at | `src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs` |
| Stable lookup key | `shared/record-list/record-list-component/05-component-seam` |
| How later layers consume it | Demo, canonical, and app-adoption layers import the runtime seam and consult this contract before creating review surfaces or app consumers. |
| What later layers must preserve | Receptor meanings, event translation, controller ownership, accessibility preservation, import boundary, and consumer restrictions unless a component revision is approved. |
| What must not consume it | Backend code and persistence code must not import frontend component seams. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, pattern proof markup, or copied fragments. |
| Required next eval | `05-component-seam/EVAL.md` |
| Required accessibility eval | `05-component-seam/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `05-component-seam` | Accept this `RecordListComponent` seam as `review-ready`. | none |
| 2 | `06-demo-page` | Create a rendered component demo artifact and proof surface that consumes this seam. | none |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `06-demo-page` |
| Next layer status | `allowed` |
| Reason | The demo-page harness is active and can now govern rendered evidence that consumes this component seam. |
