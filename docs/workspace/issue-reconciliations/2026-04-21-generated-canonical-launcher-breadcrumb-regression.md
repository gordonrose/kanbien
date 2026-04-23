## Symptom

Generated launcher navigation regressed after the persisted design-system canonicals
foundation commit. Users reported two visible symptoms:

- launcher cards no longer behaved like trustworthy render-entry links
- breadcrumbs on generated launcher and render routes did not populate the
  generated canonical trail
- top-nav generated render routes either fell back to the overview page or
  rendered stale preview behavior that no longer matched the signed-off
  canonical states

## Root Cause

The generated canonical launcher work restored the persistence-backed family and
render routes but did not fully restore the browser seams that the dedicated
component canonicals had already evolved.

Specifically:

- launcher cards were rebuilt with generated family/reference metadata, but the
  top-nav generated render route still depended on the older overview shell
  fallback instead of the dedicated top-nav component render page
- the shared breadcrumb resolver had no dynamic chain builder for generated
  canonical launcher/render routes
- `src/frontend/designSystem/router.ts` only resolved generated render HTML for
  `page-shell-banner`, so `/design-system/canonical-renderings/top-nav/*`
  silently fell back to `index.html`
- `src/frontend/designSystem/assets/app.mjs` restored the older top-nav preview
  seams, which still:
  - normalized navigation markup inside the render frame
  - used a four-link standard fixture that could not honestly exercise desktop
    overflow states
  - used LTR-only overlap checks for desktop overflow decisions
- the recovered tests only asserted generated launcher `href` patterns, not
  actual click-through navigation or the resulting breadcrumb trail

## Why The Existing Loop Missed It

- route coverage confirmed the launcher pages were reachable, but it did not
  assert that generated render routes landed on the correct dedicated render
  page for top-nav
- visual top-nav coverage stayed focused on dedicated component routes and did
  not replay the same states through generated canonical routes
- the issue appeared after recovered persisted-canonical functionality looked
  structurally complete, so the browser-experience regression remained hidden
  behind a route that returned a `200`

## What Was Added Or Changed

- Added generated launcher click-through and breadcrumb assertions for:
  - `page-shell-banner`
  - `top-nav`
- Restored generated top-nav render routing to the dedicated top-nav component
  page instead of the design-system overview fallback
- Re-applied the top-nav preview parity fixes needed for governed render states:
  - skip global nav normalization inside `#top-nav-preview-frame`
  - restore six-destination standard and long-label fixtures
  - use direction-safe overlap checks for desktop overflow decisions
  - restore direct regression coverage for desktop overflow, mobile shell open,
    overflow menu open, RTL desktop, and dark-theme profile readability
- Expanded top-nav screenshot coverage so generated render routes share the same
  screenshot contract as the legacy canonical component route

## Prevention Follow-Up

- treat generated canonical routes as a first-class browser surface, not just a
  transport concern
- when a governed canonical family gains generated launcher/render routes,
  replay at least one signed-off visual contract through the generated route in
  addition to the legacy dedicated render route
- keep issue reconciliation notes attached to the generated launcher work so the
  next routing change preserves the same browser guarantees
