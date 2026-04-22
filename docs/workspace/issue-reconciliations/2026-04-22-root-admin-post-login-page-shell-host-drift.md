# Root Admin Post-Login Page-Shell Host Drift

## Summary

The authenticated `rootAdminShell` frontend had a governed shell-level drift:
not every post-login routed surface was declaring the signed-off page-shell
host posture consistently.

The most visible escaped symptom was on `/root-admin/users`, where the real
consumer list route did not use the same signed-off page header structure as
`/design-system/templates/list-page`. That allowed the route to look different
even while it consumed the shared list-page stylesheet.

## Root Cause

- The `Users` route imported shared `list-page` styling but still used a local
  page-host header block inside `src/frontend/rootAdminShell/index.html`
  instead of the literal signed-off `component-catalog-section-header`,
  `component-catalog-section-title`, and `component-catalog-meta` posture from
  the governed list-page route.
- The top-level routed page sections inside `rootAdminShell` were also
  inconsistent:
  - `overview`, `roles`, `tenants`, and `tenant-admins` already declared
    `component-catalog-section`
  - `users` and `web-app-hierarchy` did not declare the same top-level page
    shell class consistently
- Because the route host remained partially app-owned, the same shared
  design-system assets could still render with visibly different consumer
  framing.

## Why The Loop Missed It

- Existing shell parity coverage focused on shell chrome, navigation, and
  shared stylesheet entrypoints.
- Existing list-page coverage focused on list and detail behavior, selection,
  loading, and local route correctness.
- The suite did not yet assert the governed page-host posture across every
  authenticated routed page.
- The suite also did not compare the real `Users` page header styling directly
  against the signed-off `/design-system/templates/list-page` host route.

Gap classification:

- wrong-layer coverage
- missing regression scenario
- governed host-surface blind spot

## Reconciliation Changes Added

- Updated `src/frontend/rootAdminShell/index.html` so:
  - `#page-users` now declares `component-catalog-section`
  - the `Users` page now uses the signed-off list-page host header classes:
    `component-catalog-section-header`,
    `component-catalog-section-title`, and
    `component-catalog-meta`
  - `#page-web-app-hierarchy` now also declares the governed
    `component-catalog-section` top-level posture
- Added a route-wide browser guard in
  `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts` that checks
  every authenticated routed surface uses the governed page-shell section class
  and exposes a visible `component-catalog-section-header`
- Added a direct browser parity check in
  `tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts` that compares
  the real `Users` page header styles against the signed-off
  `/design-system/templates/list-page` route

## Coverage Lesson

For governed frontend adoption, shared CSS reuse is not enough.

The suite also needs to prove:

- the real consumer declares the same governed host section posture
- the consumer header and intro block use the same signed-off host classes
- real routed pages cannot silently mix governed shell chrome with app-local
  page-host framing

## Follow-Up Watch Items

- If additional authenticated app shells are added beyond `rootAdminShell`,
  carry the same route-wide host-posture checks into those shells rather than
  assuming the shared shell chrome alone is sufficient.
- Continue moving governed app consumers away from app-owned markup when a
  design-system-owned render/controller seam exists, especially for
  `list-page`, `form-template`, and other full-route families.
