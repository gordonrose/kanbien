# 2026-04-21 Design-System Shared Top-Nav Scaffold Gap

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/top-nav-shell/`
after the shared top-nav scaffold lesson was found in active top-nav shell
runtime, static fallback, component-inventory, and visual-test authority.

## Summary

- Symptom: `/design-system` pages did not expose the same top-nav options
  consistently; some routes showed a reduced or differently managed header than
  others.
- User-visible impact: the shared design-system shell felt unreliable because
  primary-nav behavior depended on which page family rendered the route instead
  of one governed shell contract.

## Root Cause

- The shared shell behavior in
  [app.mjs](/home/gordon/kanbien/src/frontend/designSystem/assets/app.mjs)
  assumes a common host-shell scaffold:
  `#primary-nav-links`, overflow controls, profile controls, and
  `#mobile-nav-menu`.
- Older detail routes such as
  `/design-system/patterns/list-detail-panel` and
  `/design-system/patterns/list-record-card` still shipped a reduced header
  skeleton with only bare classes and no shared overflow/mobile shell nodes.
- Because those routes were missing the full scaffold, the runtime could
  normalize labels but could not treat every route as the same governed shell
  surface.

## Why The Loop Missed It

- Existing shell coverage focused on canonical routes and already-modern shell
  pages that included the full scaffold markup.
- The suite did not include a regression for legacy detail routes that still
  depended on runtime normalization over incomplete shell HTML.
- That left a blind spot where shell parity could drift even though the core
  shell routes kept passing.

## Reconciliation Changes Added

- Updated
  [app.mjs](/home/gordon/kanbien/src/frontend/designSystem/assets/app.mjs) to
  repair legacy design-system host shells before binding:
  - assign the shared top-nav IDs when markup already exists
  - create missing overflow controls when a route only ships bare nav links
  - create missing mobile-nav and mobile-profile scaffolding when absent
  - preserve existing page-specific profile labels while upgrading the shared
    shell structure
- Added a browser regression in
  [canonicalShell.spec.ts](/home/gordon/kanbien/tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts)
  that verifies representative legacy pattern routes now mount the shared
  scaffold and keep the normalized primary-nav contract.

## Coverage Lesson

- For governed frontend shells, parity drift is not only about visible labels;
  the underlying scaffold has to be covered too.
- Testing only already-modern routes can miss legacy surfaces that appear
  visually close but are missing the shared DOM contract the runtime depends
  on.

## Watch Items

- This repair keeps legacy routes functional without requiring a broad
  file-by-file HTML rewrite.
- If more design-system pages are added outside the shared scaffold template,
  they should still be added to shell parity coverage so the runtime repair
  does not become the only line of defense.
