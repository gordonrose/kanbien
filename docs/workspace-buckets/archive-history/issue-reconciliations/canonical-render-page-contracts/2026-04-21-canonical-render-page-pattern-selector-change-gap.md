# Canonical Render Page Pattern Selector Change Gap

> Archived on 2026-05-27 during the workspace QA and issue-reconciliation
> cleanup. The prevention lesson is now promoted into canonical-render-page
> template/reference-pack authority, generated canonical route behavior, and
> visual/integration coverage.

## Summary

The new pattern dropdown on `/design-system/templates/canonical-render-page`
appeared in the render drawer, but selecting a different option in the browser
did not repopulate the specimen lane.

## Root Cause

`src/frontend/designSystem/assets/canonicalRenderPageTemplate.mjs` listened
only for the native select element's `input` event. The render-state update
logic never ran for browser interactions that surfaced `change` without a
matching `input`, so the selected value changed visually while the specimen
copy and metadata stayed on the previous pattern.

## Why The Loop Missed It

- The initial regression test used Playwright's `selectOption`, which exercised
  a path that still updated the specimen under automation.
- Coverage existed at the right visual layer, but it asserted the wrong browser
  truth because it did not specifically guard the native `change` event
  contract.
- This was an unrealistic harness assumption rather than a missing test layer.

## Reconciliation Changes Added

- Added a shared `syncSelectedPattern()` handler and wired the pattern select to
  both `input` and `change`.
- Updated
  `tests/visual/designSystem/templates/canonicalRenderPage.spec.ts`
  to dispatch real bubbling `change` events and assert that the specimen lane
  repopulates for multiple pattern swaps.

## Coverage Lesson

For governed UI that uses native form controls, the regression guard should hit
the browser event contract that a human interaction depends on, not just a
tooling helper that may fire extra events.

## Follow-Up Watch Items

- Watch other recently added native selects on `/design-system` surfaces for
  input-only event wiring.
