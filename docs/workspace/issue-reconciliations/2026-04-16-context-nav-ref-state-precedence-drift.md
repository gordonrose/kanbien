# Context-Nav Ref State Precedence Drift

Date: 2026-04-16

## Symptom

On the `context-nav` canonical render page, the short-height collapse state would not behave honestly when the URL combined a canonical `ref` with explicit state parameters. In practice, `ref=CNR-004` could force the page back into the canonical open state even when the URL explicitly requested `open=closed`, which made the `More sections` interaction look broken.

## Root Cause

`getContextNavPreviewStateFromUrl()` treated the requested canonical `ref` as fully authoritative and ignored the explicit query parameters for `width`, `height`, `stack`, `labels`, `open`, `theme`, `dir`, and `zoom`.

That meant the page loader could silently override the visible runtime state requested by the URL, which is especially misleading on canonical review pages where we need render-ready truth.

## Why The Loop Missed It

- Existing browser coverage proved that the `top-overflow` canonical could render when already open.
- Existing route coverage only checked page structure.
- We did not have an interaction test proving that the short-height collapse trigger opens its menu from the closed state while still carrying the canonical `ref`.

## Prevention Added

- Updated `getContextNavPreviewStateFromUrl()` so the canonical `ref` provides the baseline state, but explicit URL parameters still override it.
- Added a Playwright regression in `tests/visual/designSystem/contextNavCanonicalFrame.spec.ts` that:
  - loads the short-height collapse state with `ref=CNR-004` and `open=closed`
  - clicks the `More sections` trigger
  - proves the menu becomes visible

## Follow-On Rule

Canonical render pages must keep `ref` and runtime state truth aligned:

- `ref` may supply canonical metadata and defaults
- explicit URL state must win when present
- interaction tests should cover closed-to-open transitions for governed overlay states, not only pre-opened canonical views
