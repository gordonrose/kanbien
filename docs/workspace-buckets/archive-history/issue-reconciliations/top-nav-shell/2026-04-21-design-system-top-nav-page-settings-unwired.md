# 2026-04-21 Design-System Top-Nav Page Settings Unwired

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/top-nav-shell/`
after the design-system governed top-nav hydration lesson was found in active
runtime, route, service, and visual-test authority.

## Summary

- Symptom: after enabling `Show in top nav` for the curated `/design-system/canonicals` page in root-admin hierarchy settings, the `Canonicals` link still did not appear in the `/design-system` host shell.
- User-visible impact: the governed page-setting looked saved, but the design-system shell kept rendering the old static primary-nav set.

## Root Cause

- The design-system host shell in [app.mjs](/home/gordon/kanbien/src/frontend/designSystem/assets/app.mjs) normalized primary nav from a hardcoded `designSystemPrimaryNavItems` array.
- The shell never read the applied design-system hierarchy or the durable `web-app-page-settings.showInTopNav` values.
- Because of that, hierarchy/page-settings truth could be edited successfully in root-admin while `/design-system` continued to render a fixed menu.

## Why The Loop Missed It

- Existing coverage around `showInTopNav` only exercised the root-admin shell hydration path and the page-settings save flow.
- The design-system shell had no browser-level regression proving that governed top-nav hydration occurred from applied hierarchy plus page settings.
- The nearest design-system shell tests asserted static labels only, so they would not catch the missing runtime connection between saved settings and the host shell.

## Reconciliation Changes Added

- Updated the design-system host shell runtime to:
  - read `/v1/web-app-hierarchy/design-system/applied-tree`
  - overlay `/v1/web-app-page-settings/pages/:webAppPageId`
  - render host-shell primary-nav links from governed applied pages with `showInTopNav = true`
  - keep the preview top-nav primitive isolated from host-shell hydration
- Tightened the Overview fallback so `/design-system` is only auto-included before it has stored page settings; an explicit saved `showInTopNav = false` now wins.
- Added a browser regression at [governedTopNav.spec.ts](/home/gordon/kanbien/tests/visual/designSystem/canonicals/shell/governedTopNav.spec.ts) that verifies:
  - `Canonicals` appears in the host shell when the governed APIs expose it
  - the top-nav preview surface does not inherit the host-shell hydration
  - explicitly disabling Overview removes it from the governed host shell

## Coverage Lesson

- When a governed UI shell depends on runtime topology plus page settings, prevention must live at the browser layer.
- Static route tests and save-form tests are not enough when the escaped failure is “the saved setting never changed what the user sees.”

## Watch Items

- The design-system host shell now hydrates top nav opportunistically; if the user is unauthenticated or the governed APIs fail, it falls back to the existing static nav.
- If future work expects governed top-nav behavior for anonymous design-system sessions, that needs an explicit product decision and a public projection seam rather than relying on root-only endpoints.
