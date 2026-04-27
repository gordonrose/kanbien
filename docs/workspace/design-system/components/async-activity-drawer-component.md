# Async Activity Drawer Component

## Scope

- Component name:
  `AsyncActivityDrawer`
- Status:
  signed-off
- Source pattern:
  `docs/workspace/design-system/patterns/async-activity-drawer-pattern.md`
- Shared implementation seam:
  `src/frontend/designSystem/assets/asyncActivityDrawer.mjs`
- Current design-system consumers:
  `/design-system/templates/page-shell`
  `/design-system/canonical-renderings/async-activity-drawer/:ref`

## Public API

- `renderAsyncActivityDrawer(root, { jobs, title })`
- `createAsyncActivityDrawerController(root, { launcher, jobs, title, initiallyOpen, onRetry, onReport })`
- `asyncActivityDrawerDemoJobs`
- `asyncActivityDrawerCanonicalRefs`
- `getAsyncActivityDrawerCanonicalRef(refId)`

## Job Data Contract

Required fields:

- `id`
- `state`: `running`, `waiting`, `error`, or `complete`
- `title`

Optional fields:

- `kicker`
- `progress` for `running`, `waiting`, and `error`
- `errorDetail` and `retry.label` for `error`
- `result.successful`, `result.failed`, and `report` for `complete`
- `report.href`, `report.download`, and `report.label`

## Ownership Boundary

- Design system owns drawer structure, card rendering, status semantics, CSS,
  accessibility, and controller behavior.
- Workspace/app shell owns job data feed, retry/report callbacks, and
  navigation persistence.
- Backend owns durable job lifecycle, progress, retry/dead-letter semantics,
  and reports.

## Unsupported Variants

- page-local app markup forks
- extra job states without a behavior-lock update
- blocking modal progress overlays using this component name
- frontend-only lifecycle truth for durable background jobs
