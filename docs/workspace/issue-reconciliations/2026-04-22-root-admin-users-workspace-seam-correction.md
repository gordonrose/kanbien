# Root Admin Users Workspace Seam Correction

## Symptom

- `/root-admin/users` was presented as a governed `List Page` adoption even
  though `rootAdminShell` still owned the page host markup in
  `src/frontend/rootAdminShell/index.html` and the route-local list/detail
  controller behavior in `src/frontend/rootAdminShell/assets/rootUsersList.mjs`.

## Root Cause

- The route adopted shared list-page CSS but never consumed a design-system
  render/controller seam for the page family.
- That left the app as the effective source of truth for the list-page shell,
  selection behavior, loading states, detail overlay behavior, and footer
  traversal on the first real consumer.

## Why The Loop Missed It

- The original parity checks focused on rendered behavior and shared styling,
  which let a close-looking app-local implementation pass as “adopted.”
- Static governance only blocked hierarchy host drift, not root-users
  list-page host drift.

## Correction

- Added a DS-owned root-users workspace seam in
  `src/frontend/designSystem/assets/rootUsersListWorkspace.mjs`.
- Moved the root-users render structure and controller behavior into that
  shared seam.
- Reduced `src/frontend/rootAdminShell/index.html` to a plain `#page-users`
  mount point.
- Swapped `src/frontend/rootAdminShell/assets/app.mjs` to consume the shared
  DS workspace controller.
- Deleted the old app-local `src/frontend/rootAdminShell/assets/rootUsersList.mjs`
  implementation.
- Extended `src/scripts/checkGovernedRootAdminUi.ts` to block reintroducing
  root-users host markup in the app shell.

## Prevention

- Keep governed list-page render and behavior ownership inside the design
  system, even for first-consumer routes.
- Treat shared CSS alone as insufficient evidence of adoption.
- Require the guard script to reject app-local reintroduction of root-users
  list-page shell markup once the DS seam exists.

## Verification

- `npx playwright test tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts`
- `npx playwright test tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts`
- `npm run check:governed-root-admin-ui`
