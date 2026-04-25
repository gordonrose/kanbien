# 2026-04-25 Context Nav Canonical Theme And RTL Cleanup

## Symptom

The context-nav canonical frame suite had two stable failures:

- dark and magnified canonicals rendered locally, but the surrounding canonical
  render layout did not retain the expected `data-theme-scope="dark"` marker
- RTL desktop context-nav canonicals placed the rail on the right while the
  content body still extended underneath that rail lane

The full suite also exposed a timing-sensitive mobile geometry miss where the
mobile frame could be measured while the canonical preview width transition was
still settling.

## Root Cause

Shared appearance state applied the theme to the preview shell or canvas but
cleared the canonical render-layout theme marker first. That left the visual
state mostly correct while the source-of-truth marker used by nav canonical
tests was absent.

The RTL preview shell mirrored the rail and drawers, but the content body did
not reserve the mirrored right-side rail lane. The canonical frame also kept
the exploration-page width transition, which allowed geometry tests to observe
intermediate mobile widths before the canonical frame reached its locked size.

## Why The Loop Missed It

Earlier coverage checked local shell state and drawer geometry, but it did not
keep the context-nav full-suite run green after the generated-route work. The
suite already contained the right tests; the miss was treating two red tests as
adjacent drift instead of clearing them before continuing canonical population.

## Prevention Added

- Canonical nav appearance now keeps the layout-level `data-theme-scope` marker
  while still applying theme variables to the local preview shell or canvas.
- RTL desktop context-nav preview bodies reserve the right rail lane.
- Context-nav canonical frames disable preview width/height transitions so
  automated geometry assertions measure the locked canonical state.
- Verified the full context-nav canonical frame suite and the adjacent top-nav
  and sub-nav theme-scope checks.

## Follow-Up Rule

Before adding more generated canonical families, the governing shell/navigation
specs should be green. Visual-contract failures in shared canonical chrome are
not harmless background noise because they reduce confidence in every generated
rendering route layered on top of that chrome.
