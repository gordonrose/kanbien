# Async Activity Drawer Pattern

## Scope

- Pattern name:
  `async-activity-drawer`
- Status:
  draft governed seam for design-system review
- Parent pattern:
  `context-nav drawer`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/async-activity-drawer-behavior-lock.md`
- Related component artifact:
  `docs/workspace/design-system/components/async-activity-drawer-component.md`
- Related routes:
  `/design-system/templates/page-shell`
  `/design-system/canonical-renderings/async-activity-drawer`
  `/design-system/canonical-renderings/async-activity-drawer/:ref`

## Intent

Provide a persistent shell drawer for background jobs that can continue while
the user navigates or works elsewhere. The pattern is for job visibility and
recovery, not for blocking modal progress.

## Anatomy

- Required parts:
  shell drawer host, activity title, job list, job card, status icon, progress
  or result body, and close control
- Optional parts:
  retry action on error jobs and report download on completed jobs
- Host-owned inputs:
  job collection, retry callback, report callback, and persistence policy
- Backend-owned inputs:
  durable lifecycle state, progress, retry/dead-letter state, and report
  availability

## States

- `running`:
  shows active progress and a running status icon
- `waiting`:
  shows queued or waiting progress and a waiting status icon
- `error`:
  shows stopped progress, error detail, and retry affordance when retry is
  available
- `complete`:
  shows successful and failed counts plus an optional report download action

## Accessibility

- The drawer inherits context-nav drawer close and focus-return behavior.
- The job list uses list/listitem semantics.
- Status icons expose short accessible labels and tooltip text.
- Retry and report controls are keyboard focusable and have action-specific
  accessible labels.
- Result count tiles expose success and failure labels without relying on
  color alone.

## Adoption Boundary

- Design system owns drawer structure, card rendering, status semantics, CSS,
  accessibility, and controller behavior.
- Workspace/app shell owns job data feed, retry/report callbacks, and
  navigation persistence.
- Backend owns durable job lifecycle, progress, retry/dead-letter semantics,
  and reports.

## Anti-Patterns

- Do not copy job-card markup into a real app page.
- Do not make the drawer depend on a single page route for persistence.
- Do not treat `complete` as all-success when failed counts are present.
- Do not make frontend demo data the source of truth for backend job state.
