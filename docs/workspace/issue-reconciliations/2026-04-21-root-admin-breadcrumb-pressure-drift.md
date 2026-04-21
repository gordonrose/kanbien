## Summary

The authenticated `root-admin` shell still let breadcrumb chips crush into the search lane on desktop widths where the signed-off page-shell is supposed to truncate or collapse into the compact breadcrumb button.

## Root Cause

`rootAdminShell` was still rendering a local two-node breadcrumb host in `src/frontend/rootAdminShell/index.html` and only updating its labels in `src/frontend/rootAdminShell/assets/app.mjs`. That meant the real app never had the signed-off compact breadcrumb host (`#breadcrumb-compact`) or the shared responsive breadcrumb presentation logic that decides when the trail must collapse under width pressure.

## Why The Loop Missed It

The root-admin shell suite asserted breadcrumb labels and active context-nav state, but it did not include a desktop-width pressure scenario that described the user-visible failure mode: breadcrumb chips visibly overlapping the search lane.

## Reconciliation Changes Added

- moved root-admin breadcrumb host markup onto the shared design-system breadcrumb host seam
- added a shared page-shell breadcrumb controller in `src/frontend/designSystem/assets/pageShellController.mjs`
- switched `rootAdminShell` to render breadcrumb trails through that shared controller instead of local markup rules
- added a desktop-width browser regression in `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts` that requires compaction before overlap

## Coverage Lesson

Governed shell tests cannot stop at copy or active-state assertions when the real risk is layout pressure. The suite now includes a direct geometry-level assertion for this breadcrumb/search collision class.

## Follow-Up Watch Items

- keep moving remaining local root-admin shell host fragments into shared design-system render seams so future shell regressions fail in one place
- extend shell parity coverage when new breadcrumb depths or shell search variants are introduced
