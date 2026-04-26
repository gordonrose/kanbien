# Async Activity Drawer Reference Pack

## Scope

- Family:
  `async-activity-drawer`
- Status:
  draft reference pack for governed design-system review
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/async-activity-drawer-behavior-lock.md`
- Related pattern:
  `docs/workspace/design-system/patterns/async-activity-drawer-pattern.md`
- Related component seam:
  `docs/workspace/design-system/components/async-activity-drawer-component.md`
- Canonical launcher:
  `/design-system/canonical-renderings/async-activity-drawer`
- Canonical render route:
  `/design-system/canonical-renderings/async-activity-drawer/:ref`

## Reference Contract

- The drawer inherits shell attachment, layering, close behavior, focus return,
  and responsive posture from the signed-off `context-nav drawer` chassis.
- The shared design-system seam owns drawer structure, card rendering, status
  semantics, CSS, accessibility, and controller behavior.
- Workspace/app shell consumers own job feed data, retry/report callbacks, and
  navigation persistence.
- Backend capabilities own durable job lifecycle, progress truth,
  retry/dead-letter semantics, and report generation.
- Supported job states are exactly `running`, `waiting`, `error`, and
  `complete` for this slice.

## Required Reference States

| Ref ID | Canonical route | State | Why it exists | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |
| `AADR-001` | `/design-system/canonical-renderings/async-activity-drawer/AADR-001` | Mixed shell queue | Shows running, waiting, retryable error, and completed report states together | covered-by-test | Priority multi-job state |
| `AADR-002` | `/design-system/canonical-renderings/async-activity-drawer/AADR-002` | Running job | Confirms active progress presentation and status semantics | covered-by-test | Single-state proof now verifies progress label, progress fill, running status, and absence of retry/report actions |
| `AADR-003` | `/design-system/canonical-renderings/async-activity-drawer/AADR-003` | Waiting job | Confirms queued work remains visible without claiming completion | covered-by-test | Single-state proof now verifies progress label, progress fill, waiting status, and absence of completion results |
| `AADR-004` | `/design-system/canonical-renderings/async-activity-drawer/AADR-004` | Retryable error | Confirms stopped progress, error detail, and retry action | covered-by-test | Priority recovery state |
| `AADR-005` | `/design-system/canonical-renderings/async-activity-drawer/AADR-005` | Complete with report | Confirms success/failure counts and optional report download | covered-by-test | Priority reporting state |

## High-Risk Review Batch

- `AADR-001` because it proves multiple parallel jobs in one persistent shell
  drawer
- `AADR-004` because retry and error detail are the highest-risk recovery
  affordances
- `AADR-005` because partial-success reporting and downloadable reports are
  easy to under-specify in app adoption

## Exit Condition

This pack is operational for design-system review when audit coverage confirms
the artifact chain, the page-shell template consumes `asyncActivityDrawer.mjs`,
and Playwright coverage verifies the launcher plus the complete `AADR-001`
through `AADR-005` generated-route state set.
