# 2026-04-24 Canonical Renderings Shell And Theme Scope Gap

## Symptom

During localhost review of the generated `ListRecordCard` render route, the
dark-theme state colored the render-page intro card instead of staying scoped
to the reviewed specimen. The generated launcher and render pages also exposed
stale static top-nav markup that did not match the normalized `/design-system`
top-nav shell.

Example route:

- `/design-system/canonical-renderings/list-record-card/LRC-010`

## Root Cause

The List Page child canonical controllers set `data-theme-scope` on the outer
`.canonical-render-layout`. That layout contains both the render-page chrome
and the actual preview frame, so dark and desert review states could leak into
the page-level intro card.

The launcher/render HTML also carried copied top-nav markup with stale primary
items such as `Foundations`, `Pages`, and `Resources`. Runtime normalization
could repair the shell after JavaScript loaded, but the source fallback still
contradicted the approved top-nav structure.

## Why The Existing Loop Missed It

The earlier generated-route proof focused on route resolution, launcher
click-through, body surface attributes, and local specimen state. The theme
tests accidentally blessed `data-theme-scope` on the outer layout, which was
the bug. The generated-index coverage also did not assert normalized shell
top-nav structure or absence of stale static primary items.

## Reconciliation Changes

- Moved data-display theme scope back down to each preview frame:
  - `#list-record-card-preview-frame`
  - `#list-detail-panel-preview-frame`
  - `#list-detail-split-layout-preview-frame`
- Removed the stale static `Foundations`, `Pages`, and `Resources` fallback
  labels from the affected generated launcher/render pages.
- Updated data-display visual tests so the outer render layout must remain
  unthemed while the local preview frame carries the requested theme.
- Added generated launcher/render shell assertions that require the normalized
  design-system top-nav IDs and reject stale primary labels.

## Coverage Lesson

For generated canonical render routes, theme assertions must distinguish page
chrome from the reviewed specimen. Shell parity tests must assert the rendered
top-nav contract, not only that a `.top-nav` element exists.

## Follow-Up Watch Items

- Extend the same shell/static-fallback audit to the older generated
  form-control render pages before claiming all canonical renderings are
  shell-parity complete.
- Keep user confirmation open for the exact localhost visual symptom.

## 2026-04-25 Follow-Up

- Added a registered-render static shell fallback audit so generated render
  page outer top-nav chrome must stay aligned with the normalized primary nav
  contract before runtime JavaScript normalization runs.
- Extended the theme-scope source audit to cover the `IconGrid` and
  `UploadFile` generated render controllers.
- Added `UploadFile` to the generated canonical-renderings index
  click-through browser proof so the persisted family launcher route now proves
  a dedicated render surface.
- Normalized stale outer top-nav fallback labels on the affected generated
  render pages while leaving inner top-nav/context-nav specimen fixtures
  unchanged.
