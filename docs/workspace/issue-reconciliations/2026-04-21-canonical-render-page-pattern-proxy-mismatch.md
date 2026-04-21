# Canonical Render Page Pattern Proxy Mismatch

## Summary

The render-drawer pattern selector changed labels and explanatory copy on
`/design-system/templates/canonical-render-page`, but selecting `breadcrumb`
did not show the actual governed breadcrumb pattern in the render lane.

## Root Cause

The initial implementation treated pattern selection as a copy swap. It
reused the canonical-render-page specimen shell and rewrote text content
instead of mounting the established design-system pattern markup and behavior
owned by the relevant upstream surfaces.

## Why The Loop Missed It

- The test asserted that the selected pattern changed titles and metadata, not
  that the actual governed pattern appeared in the render area.
- This was the wrong assertion target for a visual-design-system contract.
- The lane had a descriptive proxy, not the pattern truth the user expected.

## Reconciliation Changes Added

- Added actual pattern hosts to the render lane for:
  - shared `sub-nav-row` / `breadcrumb` / `search-shell`
  - `list-record-card`
  - `list-detail-panel`
- Reused the shared breadcrumb controller so the breadcrumb host renders the
  established collapse and compact behavior instead of a text-only stand-in.
- Updated the Playwright regression to assert the real breadcrumb surface is
  visible when selected and that the search shell is hidden for breadcrumb-only
  review.

## Coverage Lesson

When a selector is supposed to swap governed design-system patterns, the
regression should assert rendered pattern truth, not just surrounding prose or
metadata changes.

## Follow-Up Watch Items

- Review other newly added template-driven render selectors for copy-only proxy
  behavior where the user expectation is "mount the real governed surface."
