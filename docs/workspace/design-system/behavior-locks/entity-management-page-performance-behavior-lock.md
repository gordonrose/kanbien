# Entity Management Page Performance Behavior Lock

## Purpose

Capture performance and rendering behavior for the `entity_management_page`
template before it becomes an app-consumable seam.

This lock exists because the page previously rendered a huge hidden DOM on
initial load, making the route feel slow even on localhost.

## Scope

- Family:
  `entity-management-page`
- Slice:
  performance contract
- Status:
  review-candidate

## Behavior Review

| ID | Behavior statement | Status | Current evidence / note |
| --- | --- | --- | --- |
| `EMP-PERF-001` | Initial render must create only the visible/default region and visible/default nested detail panel, plus lightweight shell/navigation structures. | `approved-input` | User approved this as a hard rule for patterns/page templates. Current visual test asserts one rendered region and one rendered nested panel. |
| `EMP-PERF-002` | Hidden regions, inactive nested panels, drawer bodies, large repeated controls, and fixture-heavy content must materialize on first use or through an explicit prefetch strategy. | `approved-input` | Design-system README and templates now encode this as a general rule. |
| `EMP-PERF-003` | Lazy materialization must not break behavior initialization for newly rendered controls. | `review-candidate` | `materializeEntityManagementLazyPanel` initializes form drawer selects and resyncs entity-management derived values after insertion. |
| `EMP-PERF-004` | Lazy materialization must not double-bind nested-list handlers after switching regions repeatedly. | `review-candidate` | Nested list initialization uses a dataset guard. Needs repeated-region-switch coverage. |
| `EMP-PERF-005` | Initial DOM and control counts must remain bounded enough to prevent hidden-DOM regressions. | `review-candidate` | Mobile visual test currently expects fewer than 5000 DOM nodes and fewer than 1000 controls at initial render. |
| `EMP-PERF-006` | The route must expose a render-ready signal that means the first useful view is present, not that every hidden workspace has been built. | `review-candidate` | Current smoke checks use `[data-record-management-region-panel='identity']` and entity page template selectors. This should become explicit in verification. |
| `EMP-PERF-007` | Region activation may increase DOM size, but only for regions the user has actually visited. | `review-candidate` | Browser smoke showed rendered region count increasing from 1 to 3 after visiting Workflows and Views. |
| `EMP-PERF-008` | Nested item activation may increase DOM size, but only for nested panels the user has actually opened. | `review-candidate` | Browser smoke showed rendered nested panels increasing as Workflows/Views panels were selected. |
| `EMP-PERF-009` | Demo fixture data must be split from reusable seam code before app adoption so apps do not pay parse/evaluation cost for unrelated demo content. | `blocked-for-adoption` | `entityManagementPage.mjs` still mixes demo entity data, render helpers, and behavior. |
| `EMP-PERF-010` | The extracted entity page module must not be eagerly imported by unrelated record-management drawer uses once the seam is app-consumable. | `blocked-for-adoption` | Current drawer imports the entity page module directly. A route/provider or dynamic seam may be needed before broader adoption. |
| `EMP-PERF-011` | Browser verification must report initial-load timing, DOM/control counts, and lazy-render counts for heavy page templates. | `review-candidate` | Manual browser measurement showed drop from about 173k nodes to 781 nodes and from about 29.6k controls to 145 controls. |
| `EMP-PERF-012` | Performance verification should distinguish network/module load from DOM construction. | `review-candidate` | Earlier measurement showed browser load event was relatively fast while useful appearance lag came from huge hidden DOM. |

## Current Measurement Snapshot

Recent browser smoke after lazy rendering:

- initial DOM nodes:
  `781`
- initial controls:
  `145`
- rendered regions:
  `1`
- rendered nested panels:
  `1`
- rendered HTML:
  about `88KB`

Earlier eager-rendering state:

- initial DOM nodes:
  about `173,000`
- initial controls:
  about `29,600`
- rendered HTML:
  about `19.4MB`

## Open Review Questions

- What exact DOM/control budgets should become hard thresholds for this family?
- Should the app seam use dynamic import for the entity-management module?
- Should nested panel content be evicted when leaving a region, or retained
  after first materialization for state preservation?

## Adoption Blockers

- Split demo data from reusable seam code.
- Avoid eager import of this module for unrelated drawer consumers.
- Add a dedicated verification checklist entry for the render-ready contract.

