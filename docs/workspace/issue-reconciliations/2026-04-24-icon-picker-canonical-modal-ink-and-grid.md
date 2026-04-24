# Icon Picker Canonical Modal Ink And Grid

## Summary

The `icon-grid` canonical modal had two escaped browser-visible issues:

- the dark mobile modal title inherited light-page ink and became nearly unreadable
- the full desktop catalog could present as a clipped matrix instead of a clean reviewable modal
- the modal overlay escaped the canonical render area and covered the full design-system page

Affected routes included:

- `/design-system/canonical-renderings/icon-grid/IGR-002`
- `/design-system/canonical-renderings/icon-grid/IGR-006`

## Root Cause

The modal inherited the page body's `color` while only the preview frame owned the dark theme variables. In dark scoped renders, `--ink` changed but the title did not use it directly.

The modal also used the global `.search-shell` inside a local grid surface. The global search shell's `grid-column: 2` created an implicit second column in the modal, which allowed overlap and made the matrix layout less stable. The full icon matrix relied on panel-level overflow, which made the canonical review posture look clipped.

The modal overlay used viewport-fixed positioning, so an open child picker was anchored to the whole browser viewport instead of the parent form shell that represents the canonical render area.

## Why The Loop Missed It

The existing icon-grid suite proved route loading, catalog count, filtering, and selection sync, but did not assert:

- dark scoped modal heading ink
- local search-shell column placement inside the icon picker
- matrix containment against the panel boundary
- modal overlay containment inside the canonical render area

Classification: missing visual assertions for theme-scoped ink and shared search-shell reuse inside a child modal.

## Reconciliation Changes

- `src/frontend/designSystem/assets/styles.css` now gives the icon-grid panel its own scoped `color: var(--ink)`.
- The icon-grid panel now uses a one-column bounded grid layout.
- The icon-grid search shell is explicitly scoped to column 1 inside the modal.
- The icon matrix has its own bounded overflow area.
- The icon-grid modal is now contained by the parent `form-page-shell` instead of the viewport.
- The shared `formControls.css` entrypoint received matching rules for app adoption surfaces that consume the shared form controls CSS.
- `tests/visual/designSystem/canonicals/forms/iconGridCanonical.spec.ts` now asserts:
  - dark scoped modal title color
  - matrix containment inside the panel
  - matrix overflow behavior without relying on panel-level scrolling
  - modal overlay containment inside the canonical render area
- `tests/visual/designSystem/support/helpers/canonicalOverlayGuards.ts` now
  exposes `expectCanonicalOverlayContainedInRenderSurface(...)` so future
  canonical render pages can reuse the same overlay containment contract.

## Coverage Lesson

When a governed control reuses global shell primitives inside a local modal, visual coverage must verify the inherited layout contract, not only the component's own state data. Theme-scoped child surfaces also need direct ink assertions for headings and high-priority copy.

Child-seam modals in canonical render pages must be checked against their intended host surface. A correct modal can still be architecturally wrong if its backdrop anchors to the full browser page instead of the review frame.

This is now a reusable harness rule, not an icon-grid-only test pattern.

## Follow-Up Watch Items

- Keep `formControls.css` and the design-system `styles.css` icon-grid control rules synchronized until that shared CSS entrypoint is retired or generated.
- Add similarly direct dark-ink checks for any other child modal that depends on scoped theme variables rather than document-level theme.
