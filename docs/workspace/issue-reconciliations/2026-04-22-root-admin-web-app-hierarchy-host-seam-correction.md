# Root Admin Web App Hierarchy Host Seam Correction

## Summary

`/root-admin/web-app-hierarchy` was still failing the stronger governed-adoption
rule even after earlier parity work. The route reused shared CSS and a
design-system-owned controller, but the page-body host and hierarchy drawer host
markup still lived in `rootAdminShell/index.html`. That meant the app was still
reconstructing governed render structure locally.

## Root Cause

- I treated shared controller usage plus good browser parity as sufficient
  evidence that the route had crossed the design-system adoption line.
- The missing host render seam was already isolated conceptually in
  `webAppHierarchyWorkspace.mjs`, but I left the actual shell markup in the app
  HTML instead of promoting it into the DS-owned seam.
- The prevention layer guarded broad shell drift, but it did not explicitly
  block reintroduction of the hierarchy workspace host IDs inside
  `rootAdminShell/index.html`.

## Why The Loop Missed It

- Browser tests proved visible parity and route behavior, not render ownership.
- The docs honestly described the route as partial adoption, but the code path
  still allowed that partial posture to persist after the real seam extraction
  opportunity existed.
- The static governed-root-admin guard hashed files, but it did not yet contain
  explicit ownership bans for the hierarchy workspace host IDs in the app HTML.

Gap classification:

- missing design-system render seam extraction
- wrong stopping point after parity improvement
- source-ownership blind spot in the static guard

## Reconciliation Changes Added

- Added `renderWebAppHierarchyWorkspaceShell()` to
  `src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs` so the
  DS-owned workspace module now owns the governed host markup for the route
  body and hierarchy drawer.
- Updated `src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs` to
  render that shared workspace shell before mounting the existing DS-owned
  controller.
- Removed the governed hierarchy workspace host markup from
  `src/frontend/rootAdminShell/index.html`.
- Strengthened `src/scripts/checkGovernedRootAdminUi.ts` so it now blocks
  reintroduction of the hierarchy workspace form host, drawer host, and page
  title shell IDs directly inside `rootAdminShell/index.html`.

## Coverage Lesson

For governed app adoption, parity tests and shared controller usage are still
not enough if the render host remains app-owned. Once a DS-owned render seam
exists, the static guard should explicitly ban the old local host markup from
the app entry HTML.

## Verification

- `npx playwright test tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts`
- `npx playwright test tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts`
- `npx playwright test tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts`
- `npm run check:governed-root-admin-ui`
