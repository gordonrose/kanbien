# Record List Component Demo Page Artifact

## Demo Metadata

| Field | Value |
| --- | --- |
| Demo scope | `design-system rendered review surface` |
| UI family | `record-list` |
| Demo page name | `record-list-component-demo` |
| Harness layer | `06-demo-page` |
| Demo status | `draft` |
| Upstream component contract | `docs/design-system/05-component-seam/shared/record-list/RecordListComponent-Contract.md` |
| Shared demo artifact path | `docs/design-system/06-demo-page/shared/record-list-component/RecordListComponent-Demo.md` |
| Planned demo route or surface | `/design-system/default/demos/record-list-component` |
| Files affected now | `docs/design-system/06-demo-page/shared/record-list-component/RecordListComponent-Demo.md` |

## Purpose

| Field | Value |
| --- | --- |
| Component seam consumed | The Layer 5 `record-list-component` exposes the governed record-list pattern through public receptors, render structure, controller attachment, and component-level events. |
| Demo job | Prove, in a rendered design-system surface, that representative feature-style fixture data can consume the component seam without copying pattern markup or controller behavior. |
| Expected reviewers | `design-system`; `accessibility`; `feature adapter` |
| Non-goals | Canonical scenarios, app adoption, backend workflow, persisted sorting, root-admin route topology, filter controls, result-count status bars, and real root-user page implementation. |

## Layer Boundary

This DemoPageArtifact defines demo fixtures, proof-only controls, rendered
states, route/review-surface responsibility, browser evidence, and demo import
boundaries only.

It does not define token values, primitive behavior, pattern composition,
component receptors, canonical scenarios, app wrappers, backend query
semantics, persistence behavior, authorization rules, or route topology.

## Preflight Decision Ledger

Not applicable. This demo artifact is motivated by the accepted next layer for
the governed `record-list-component`, not by a rendered route, screenshot,
template, canonical, app-like review surface, or visible defect.

## Upstream Gates

| Field | Value |
| --- | --- |
| Component seam status | `review-ready` |
| Component readiness source checked | `docs/design-system/05-component-seam/component-readiness-index.md` |
| Component runtime seam status | `implemented` |
| Required component consumable by selected systems | `yes` |
| Consumer contexts known | `partial`; this demo records representative design-system and root-users pressure states, while canonical and app-adoption layers remain scaffold-only. |

## Component Dependency

| Component | Shared Contract | Runtime Seam | Demo Decision Supported | Status |
| --- | --- | --- | --- | --- |
| `record-list-component` | `docs/design-system/05-component-seam/shared/record-list/RecordListComponent-Contract.md` | `src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs#renderRecordListComponent`; `#attachRecordListComponentController`; `#recordListComponentContract` | The demo must import the Layer 5 render/controller seam and prove populated, empty, reorder-enabled, and reorder-disabled postures without rebuilding the pattern. | `consumable` |

## Demo Surface

| Field | Value |
| --- | --- |
| Route or rendered surface | `/design-system/default/demos/record-list-component` |
| Public construction source | `renderRecordListComponent`; `attachRecordListComponentController` |
| Controller attachment | `attachRecordListComponentController` attaches the upstream pattern controller and translates component events. |
| Allowed proof-only controls | `fixture-state`; `detail-ratio`; `resize-enabled`; `reorder-enabled`; `theme`; `direction`; `viewport pressure` |
| Consumers must not use | `demo route markup, demo CSS, proof-only controls, fixture helpers, screenshots, or chat history` |

## Fixture And State Coverage

Only fixtures and states that prove component behavior, accessibility,
responsive posture, or consumer boundary are included.

| Fixture Or State | Component Receptors Used | Review Purpose | Source Honesty Requirement | Required Evidence |
| --- | --- | --- | --- | --- |
| populated reorder-enabled records | `listLabel`; `detailLabel`; `items`; `openItemId`; `detailContentHtml`; `allowReorder: true`; `allowResize: true` | Prove the default component consumes the governed pattern, renders rows and detail content, exposes reorder affordances, and keeps resize available. | Representative design-system records using the component item shape, not backend records. | Browser proof and unit/source proof that the demo imports the component seam. |
| populated non-reorder root-users pressure state | `listLabel`; `detailLabel`; `items`; `openItemId`; `detailContentHtml`; `allowReorder: false`; `allowResize: true` | Prove a non-reorder feature can consume the same component without drag, reorder shortcuts, or move feedback affordances. | Derived from `RecordListComponent-RootAdminUsers-ReceptorMapping.md`; fixtures must use root-user-shaped adapter output, not invented component-only fields. | Browser proof that rows are not draggable and reorder shortcuts/hints are absent. |
| empty records | `listLabel`; `detailLabel`; `emptyLabel`; `items: []`; `allowReorder: false` | Prove the governed empty state remains visible and does not masquerade as a disabled row. | Component contract default plus explicit demo empty copy. | Browser proof of visible empty copy and no fake row controls. |
| disabled row pressure | `items[].disabled`; `detailContentHtml` | Prove disabled row semantics from the upstream pattern survive component rendering. | Representative fixture only; not a root-users feature decision until disabled semantics are documented. | Browser or unit proof of disabled row attributes and unavailable open behavior. |

## Proof Controls

| Control | Changes What Evidence | Contract Requirement Exercised | Not A Consumer API Because |
| --- | --- | --- | --- |
| `fixture-state` | Switches between populated, non-reorder, empty, and disabled pressure fixtures. | Receptor and state coverage required by the component contract. | Fixture selection is a review tool; features supply adapter values directly. |
| `detail-ratio` | Changes initial list-detail ratio among `1:5`, `1:4`, and `1:2`. | `initialDetailRatio` receptor and upstream pattern ratio variants. | The control only rewrites the demo fixture receptor value. |
| `resize-enabled` | Shows or hides the governed resize handle. | `allowResize` receptor and resize controller evidence. | The control toggles an existing component receptor for proof only. |
| `reorder-enabled` | Shows reorder-enabled and reorder-disabled postures. | `allowReorder` receptor and configurable pattern affordance rule. | The control toggles an existing component receptor for proof only. |
| `theme` | Exercises selected design-system theme rendering. | Component forwards theme to the upstream pattern. | Theme selection is a design-system proof context, not feature workflow. |
| `direction` | Exercises left-to-right and right-to-left reading direction. | Accessibility and reflow preservation across direction contexts. | Direction pressure is a review context, not an app route decision. |
| `viewport pressure` | Constrains the review surface to desktop and reduced-width evidence. | Rendered proof requirements for responsive and overflow behavior. | The constraint is proof-only and must not become app wrapper layout. |

## Interaction And Controller Evidence

| Interaction | Component Event Or Controller | Expected Rendered Result | Accessibility Feedback | Required Evidence |
| --- | --- | --- | --- | --- |
| open row | `record-list-component:open` | The selected row opens in the governed detail slot. | Focus and selected/open state remain exposed by the upstream pattern. | Browser proof after demo route implementation. |
| close detail | `record-list-component:close` | The detail slot closes without removing list rows. | Close control remains named by the upstream detail-slot primitive. | Browser proof after demo route implementation. |
| reorder enabled row move | `record-list-component:reorder` | The moved row changes DOM position only in reorder-enabled posture. | Polite live feedback includes item label, position, total count, and neighbor context when available. | Browser proof after demo route implementation. |
| reorder disabled move attempt | no component reorder event expected | Reorder controls and shortcuts are absent, so no move can be initiated through governed UI. | No misleading move hint or live feedback is exposed. | Browser proof after demo route implementation. |
| resize detail | `record-list-component:resize-detail` | The detail slot width changes within the governed resize constraints. | Separator remains operable and stateful per upstream primitive/pattern contract. | Browser proof after demo route implementation. |

## Responsive And Environment Coverage

| Context | Required Because | Expected Result | Required Evidence |
| --- | --- | --- | --- |
| desktop wide | Proves default two-pane list-detail review. | List and detail slot render side by side without local demo layout reconstruction. | Browser screenshot and geometry assertion after route implementation. |
| reduced-width mobile pressure | Proves reflow/overflow posture for app-like constraints. | Content remains reachable, readable, and non-overlapping. | Browser screenshot and overflow assertion after route implementation. |
| 150% zoom or equivalent magnification pressure | WCAG 2.2 AA reflow and text overlap risk. | Controls and text remain usable without incoherent overlap. | Browser evidence after route implementation. |
| right-to-left direction | Direction can affect row order, detail slot placement, and resize perception. | Reading order, keyboard operation, and labels remain meaningful. | Browser evidence after route implementation. |
| reduced motion | Resize and open/close evidence must not depend on motion. | Demo remains usable with reduced motion preferences. | Browser evidence or recorded not-applicable proof after route implementation. |
| default, dark, and desert themes | Component forwards theme to the upstream pattern. | Theme changes appearance while preserving behavior and accessibility semantics. | Browser evidence after route implementation. |

## Accessibility Preservation

The demo must preserve the shared WCAG 2.2 AA default in rendered evidence.

The fixtures must provide non-empty `listLabel` and `detailLabel` values for
each state. Empty and disabled states must remain visible and not rely on
color alone. The demo must prove keyboard operation, focus behavior,
state exposure, and live feedback inherited from the component, pattern, and
primitives.

When the non-reorder fixture is active, reorder controls, shortcuts, hints, and
move feedback must be absent rather than inert.

## Import And Dependency Boundary

| Field | Value |
| --- | --- |
| Allowed imports | `src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs`; shared design-system route helpers if already governed |
| Forbidden imports | `feature persistence, backend transport, app page modules, route-local proof modules from lower layers, legacy design-system route markup` |
| Cross-feature dependency posture | `representative fixture only`; root-users pressure data may mirror adapter output but must not import rootUsers feature code. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| component consumption | Route/source proof must show the demo imports `renderRecordListComponent` and `attachRecordListComponentController` instead of rebuilding pattern markup. |
| fixture honesty | Fixtures must map to the component contract and the root-users receptor mapping where that pressure state is used. |
| state coverage | Rendered proof must cover populated, non-reorder, empty, and disabled pressure states. |
| interaction | Browser proof must cover open, close, resize, reorder-enabled move, and reorder-disabled absence of move affordance. |
| accessibility | Browser proof must cover labels, keyboard operation, focus, live feedback, absent disabled affordances, and no text overlap at magnification pressure. |
| responsive/environment | Browser proof must cover desktop, reduced-width, direction, theme, and reduced-motion or record why reduced-motion is not applicable. |
| consumer boundary | Source proof must show later consumers can consume the component seam and are not asked to copy demo markup or CSS. |

## Consumer Restrictions

Later layers must use the governed `record-list-component` seam instead of
copying demo route markup, local CSS, fixture helpers, proof controls,
controller setup, or screenshots.

Demo fixtures must not become product workflow, backend query, authorization,
persistence, or route-state truth.

Demo-only controls must not be treated as component receptors unless Layer 5
has approved the receptor.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared demo artifact at | `docs/design-system/06-demo-page/shared/record-list-component/RecordListComponent-Demo.md` |
| Store demo route at | `src/frontend/designSystem/systems/default/demos/record-list-component/` |
| Stable lookup key | `shared/record-list/record-list-component-demo/06-demo-page` |
| How later layers consume it | Canonical and app-adoption layers use this as rendered evidence while still importing the Layer 5 component seam. |
| What later layers must preserve | Component seam import, fixture honesty, accessibility evidence, responsive evidence, controller behavior, and consumer restrictions unless a demo revision is approved. |
| What must not consume it | Backend code, persistence code, and app pages must not import demo route modules as construction APIs. |
| What must not be used instead | Chat history, screenshots, copied demo markup, local CSS, or fixture helper internals. |
| Required next eval | `06-demo-page/EVAL.md` |
| Required accessibility eval | `06-demo-page/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `06-demo-page` | Keep this artifact as `draft` until the demo route and browser proof exist. | Rendered route and evidence are not implemented yet. |
| 2 | `06-demo-page` | Implement `/design-system/default/demos/record-list-component` using the Layer 5 runtime seam. | none |
| 3 | `07-canonical-scenarios` | Activate the canonical-scenarios harness after the demo page passes. | `07-canonical-scenarios` is scaffold-only. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `06-demo-page` |
| Next layer status | `blocked` |
| Reason | The draft artifact is ready to guide implementation, but the demo route and rendered browser evidence are still missing. |
