# 2026-04-19 Hierarchy Tree CSP Inline Assets

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/hierarchy-tree/`
after the hierarchy-tree CSP mount lesson was found in active hierarchy-tree
design-system artifacts and browser coverage.

## Symptom

The first `hierarchy-tree` design-system demo page loaded its shell framing but
did not render the tree itself. The detail pane stayed at `Loading...` and the
tree surface remained empty.

## Root Cause

The page introduced its demo-specific CSS and JavaScript through inline
`<style>` and inline `<script type="module">` blocks inside
`src/frontend/designSystem/patterns/hierarchy-tree/index.html`.

The app serves browser pages with a CSP that allows only same-origin scripts
and styles, so both inline blocks were rejected at runtime. The shell HTML
still rendered because the blocked assets were only the new page-local demo
logic and styles.

## Why The Loop Missed It

- The first implementation was validated from source shape and screenshot
  capture intent, not from the actual CSP-governed browser runtime.
- The repo already uses external asset files for design-system behavior, but
  this new page did not reuse that pattern and no automated check asserted that
  the new route mounted without browser console or page errors.

## Prevention Added

- moved the demo-specific CSS into
  `src/frontend/designSystem/assets/hierarchyTree.css`
- moved the interactive demo logic into
  `src/frontend/designSystem/assets/hierarchyTree.mjs`
- updated the pattern page to load those assets through same-origin URLs
- added `tests/visual/designSystem/canonicals/data-display/hierarchyTree.spec.ts` to assert the page
  mounts, renders rows, and finishes without console or page errors

## Follow-Up

When adding new design-system routes, treat CSP compatibility as part of the
first render contract rather than as a later hardening step.
