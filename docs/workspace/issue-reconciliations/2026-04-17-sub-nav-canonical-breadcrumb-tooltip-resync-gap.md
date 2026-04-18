# 2026-04-17 Sub-Nav Canonical Breadcrumb Tooltip And Render-Pressure Gap

## Summary

The sub-nav canonical render could show visibly truncated breadcrumb labels
inside the local preview frame without restoring breadcrumb tooltips, and under
enough local frame pressure the row could stay visibly crushed instead of
stepping down into its reduced or compact breadcrumb behavior. This was most
noticeable on the `SNR-001` render surface when the preview lane narrowed after
the initial state render.

## Root Cause

Two shared seams were working against each other:

- the shared `ResizeObserver` updated breadcrumb layout but did not rerun
  the sub-nav preview's responsive breadcrumb priority logic
- the original tooltip path depended too heavily on precomputed truncation
  state instead of the live rendered node
- the canonical render HTML also carried an inline width style that violated
  the page CSP, making the render-width contract less trustworthy than it
  looked in source

That meant the render surface could end up in a broken middle state:

- breadcrumb chips could become visibly tiny after local frame pressure changed
- tooltip state could lag behind the rendered geometry
- the row could continue rendering crushed breadcrumb chips because the collapse
  logic was never rerun for the changed local frame width

## Why The Loop Missed It

The existing sub-nav suite proved:

- tooltip behavior for dedicated truncation canonicals like `BCR-011`
- static screenshot truth for the baseline render states

But it did not prove that:

- tooltip state refreshed when a canonical render frame narrowed locally after
  the initial render pass
- the responsive breadcrumb collapse rules reran when the local canonical frame
  width changed after mount
- the render host stayed honest to the declared preview width contract without
  relying on CSP-blocked inline style

This was a shared-seam blind spot around resize/resync timing and render-host
ownership rather than a missing hover test on one fixed state.

## Reconciliation Changes

- updated the shared `ResizeObserver` in
  `src/frontend/designSystem/assets/app.mjs` to rerun
  both tooltip recovery and the sub-nav preview's responsive breadcrumb
  priority logic
- expanded the observer coverage to watch the sub-nav preview breadcrumb lane
  directly
- added a host-only fit-to-page treatment on the canonical render surface so
  the visible preview can scale down to the available page width while the
  inner sub-nav still retains its full canonical review width
- upgraded the shared tooltip system so breadcrumb hover can recover from the
  live rendered node instead of requiring already-correct `data-tooltip` state
- removed the CSP-violating inline width from
  `src/frontend/designSystem/components/sub-nav.html`
- added regressions in `tests/visual/designSystem/subNav.spec.ts` that verify:
  - `SNR-001` preserves the canonical render width instead of silently
    shrinking
  - a locally pressured full row collapses instead of leaving crushed
    breadcrumb chips visible
  - magnified reduced breadcrumb states still compact instead of pushing the
    search field off the row
  - `BCR-011` and `BCR-012` still preserve the locked truncation-with-tooltip
    behavior
- refreshed the `SSR-008` long-Latin canonical snapshot because the improved
  collapse behavior produces a cleaner, less crushed search-shell row under
  pressure
- refreshed the magnified `SNR-007` and `SSR-007` snapshots because the
  corrected reduced-state collapse behavior now yields to the compact
  breadcrumb signpost instead of preserving a broken in-between layout

## Coverage Lesson

For canonical render surfaces, it is not enough to prove tooltip behavior in a
single initial layout. Shared resize and frame-pressure seams also need:

- an explicit resync assertion when local render containers narrow after mount
- a business-rule assertion that the row collapses before it stays visibly
  crushed
- a check that canonical render-width ownership does not depend on CSP-blocked
  inline style
- a distinction between visual host fitting and intrinsic component width, so
  canonicals can stay review-honest without forcing horizontal page spill

## Follow-Up Watch Items

- apply the same mindset to other canonical families that use shared breadcrumb
  or truncation logic inside nested render frames
- keep browser-level inspection in the loop for future tooltip regressions,
  because static source inspection can miss geometry-timing issues like this one
