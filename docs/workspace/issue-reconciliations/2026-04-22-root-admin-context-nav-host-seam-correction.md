# Root Admin Context-Nav Host Seam Correction

## Symptom

- `rootAdminShell` was using shared `context-nav` behavior for mobile overflow,
  but it still hardcoded the broader context-nav host markup in
  `src/frontend/rootAdminShell/index.html` and locally rendered destination
  links in `src/frontend/rootAdminShell/assets/app.mjs`.

## Root Cause

- The design-system seam stopped at item partitioning and overflow-menu
  rendering.
- That left the app as the effective owner of the root-admin context-nav host
  chassis and destination-link markup even after the family was described as a
  governed adoption.

## Why The Loop Missed It

- Earlier fixes reconciled specific behavior defects, especially mobile `More`,
  without finishing the host/render ownership migration.
- The guard script blocked some shell drift, but it did not explicitly reject
  the root-admin context-nav host IDs inside app HTML.

## Correction

- Extended `src/frontend/designSystem/assets/contextNav.mjs` with:
  - `renderRootAdminContextNavShell(...)`
  - `renderContextNavItems(...)`
- Replaced the app-local context-nav host block in
  `src/frontend/rootAdminShell/index.html` with a mount point.
- Updated `src/frontend/rootAdminShell/assets/app.mjs` to mount the shared
  context-nav shell and use the shared item renderer for destination links.
- Tightened `src/scripts/checkGovernedRootAdminUi.ts` so reintroducing local
  context-nav host IDs in app HTML is blocked.

## Prevention

- Treat host markup and item-render markup as part of governed family
  ownership, not just interaction behavior.
- When a family is recorded as a DS adoption, require the app to consume the
  render seam as well as the behavior seam.

## Verification

- `npx playwright test tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts`
- `npm run check:governed-root-admin-ui`
