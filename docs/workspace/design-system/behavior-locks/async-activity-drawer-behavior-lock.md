# Async Activity Drawer Behavior Lock

## Scope

- Family:
  `async-activity-drawer`
- Parent shell family:
  `context-nav drawer`
- Current source surfaces:
  `/design-system/templates/page-shell`
  `/design-system/canonical-renderings/async-activity-drawer`
  `/design-system/canonical-renderings/async-activity-drawer/:ref`
- Shared implementation seam:
  `src/frontend/designSystem/assets/asyncActivityDrawer.mjs`

## Behavior Review

| ID | Behavior statement | Why it matters | Current implementation note | Status | User feedback |
| --- | --- | --- | --- | --- | --- |
| `AAD-001` | The async activity drawer must be launched from persistent shell chrome and remain available across navigation-capable workspace/app shells. | Background work can outlive one page view, so per-page progress widgets would hide important state. | The page-shell template mounts the shared seam in the context-nav bottom stack; app adoption is still deferred. | `approved` | The drawer is shell chrome, not page content. |
| `AAD-002` | The design system owns drawer structure, card rendering, status semantics, CSS, accessibility, and controller behavior. | Prevents future app shells from copying local markup or inventing separate retry/report card grammar. | `asyncActivityDrawer.mjs` renders the drawer and exposes `createAsyncActivityDrawerController(...)`. | `approved` | Promote the drawer into a governed shared seam. |
| `AAD-003` | Consumers own job data feed, retry callbacks, report callbacks, and navigation persistence. | Keeps product-specific lifecycle and side effects out of the visual seam. | The shared controller accepts `jobs`, `onRetry`, and `onReport`; no backend polling is implemented here. | `approved` | Workspace/app shell owns the feed and callbacks. |
| `AAD-004` | Backend capabilities own durable job lifecycle, progress, retry/dead-letter semantics, and generated reports. | Frontend status cards must not become the source of truth for background processing. | The current design-system seam uses demo data only and records backend ownership as an adoption boundary. | `approved` | Backend owns lifecycle truth. |
| `AAD-005` | Supported states are `running`, `waiting`, `error`, and `complete`. | Locks the minimum job-state contract before app shells consume the component. | The shared renderer normalizes every job to one of the four supported states. | `approved` | Keep the first state set small and explicit. |
| `AAD-006` | Error jobs must show stopped progress, an error detail, and a retry action when retry is available. | Operators need both failure context and a clear recovery affordance. | `error` cards render `async-job-progress-error`, `async-job-error-detail`, and `data-async-activity-retry`. | `approved` | Retryable errors must be obvious and keyboard reachable. |
| `AAD-007` | Completed jobs must show successful and failed counts and may expose a report download action. | Bulk work often finishes partially; counts and report access prevent false success readings. | `complete` cards render successful/failed count tiles and optional `data-async-activity-report` links. | `approved` | Completed does not mean every row succeeded. |
| `AAD-008` | The drawer must support multiple parallel jobs without forcing a blocking modal workflow. | Bulk imports, exports, syncs, and generated reports can overlap. | The shared renderer accepts an ordered job array and renders it as a list. | `approved` | Parallel jobs are a first-class state. |
| `AAD-009` | Opening, closing, outside-click close, Escape close, and focus return inherit the context-nav drawer shell contract. | The async payload should not create a second drawer accessibility model. | The page-shell consumer delegates open state to the shared controller while the host shell handles outside-click and Escape closure. | `approved` | Reuse the governed drawer interaction grammar. |

## Exit Criteria

This behavior lock is ready for reference review when the dedicated canonical
launcher and render route cover all `AAD-*` states and the page-shell template
consumes the shared seam rather than owning local job-card markup.
