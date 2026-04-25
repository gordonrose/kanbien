# Async Activity Drawer Verification Checklist

## Required Proof

- Audit proof that the behavior lock, reference pack, pattern, component note,
  launcher, render route, and shared implementation seam exist.
- Audit proof that page-shell no longer owns local async job-card markup.
- Browser proof that `/design-system/canonical-renderings/async-activity-drawer` exposes
  the `AADR-*` state set with dedicated render links.
- Browser proof that `/design-system/canonical-renderings/async-activity-drawer/AADR-001`
  renders running, waiting, error, and complete cards from the shared seam.
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

## App Adoption Status

Real workspace/app shell adoption is intentionally deferred. Adoption remains
blocked until a consumer preflight names the signed-off source route, records
consumer parity expectations, and wires a real job feed without copying drawer
markup or controller behavior.
