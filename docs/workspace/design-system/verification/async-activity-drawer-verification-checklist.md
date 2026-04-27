# Async Activity Drawer Verification Checklist

## Required Proof

- Audit proof that the behavior lock, reference pack, pattern, component note,
  launcher, render route, and shared implementation seam exist.
- Audit proof that page-shell no longer owns local async job-card markup.
- Browser proof that `/design-system/canonical-renderings/async-activity-drawer` exposes
  the `AADR-*` state set with dedicated render links.
- Browser proof that `/design-system/canonical-renderings/async-activity-drawer/AADR-001`
  renders running, waiting, error, and complete cards from the shared seam.
- Browser proof that `AADR-002` exposes a single running job with active
  progress, running status semantics, and no retry/report actions.
- Browser proof that `AADR-003` exposes a single waiting job with not-started
  progress geometry, waiting status semantics, and no completion result
  presentation.
- Browser proof that `AADR-004` exposes stopped progress, error detail, and a
  retry button.
- Browser proof that `AADR-005` exposes success/failure counts and report
  download.
- Page-shell proof that opening the background jobs launcher mounts the shared
  seam and preserves focusable close behavior.

## Current Evidence

- Focused audit coverage:
  `tests/audit/designSystem/pageShellAsyncActivityDrawer.test.ts`
- Focused browser coverage:
  `tests/visual/designSystem/canonicals/shell/asyncActivityDrawer.spec.ts`
- `AADR-001` through `AADR-005` generated render routes are covered by the
  focused browser suite. `AADR-002` and `AADR-003` include state-specific
  assertions for progress labels, rendered progress geometry, status semantics,
  and excluded actions/results so the single-state canonicals are not only
  smoke-tested.
- Human sign-off:
  approved for the `AADR-*` generated canonical state set.
- Promotion decision:
  promote to signed-off design-system baseline; do not promote to app-adopted
  or `system-ready` until a workspace/app shell adoption contract names the
  real job feed, retry/report ownership, and consumer parity expectations.

## App Adoption Status

Real workspace/app shell adoption is intentionally deferred. Adoption remains
blocked until a consumer preflight names the signed-off source route, records
consumer parity expectations, and wires a real job feed without copying drawer
markup or controller behavior.
