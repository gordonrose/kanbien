# Drawer Form Canonical Contract Drift

Archive note, 2026-05-27:

This promoted lesson was moved to
`docs/workspace-buckets/archive-history/issue-reconciliations/form-template-drawer-form/`
after the drawer-form generated render-page contract lesson was found in
active canonical render-page, drawer-form reference-pack, verification, and
visual-test authority.

## Summary

The `drawer-form` generated render page drifted from the established generated
canonical render-page contract. The user reported several symptoms:

- top-page descriptions did not match other generated render pages
- the RTL state affected the whole page instead of only the render area
- several reference states did not make their review purpose clear

## Root Cause

The drawer-form page started as a component preview and was later routed
through `/design-system/canonical-renderings`. That conversion was incomplete:
the page kept component-preview metadata, applied `dir` to
`document.documentElement`, and relied on terse summary text instead of the
canonical metadata rows used by adjacent generated render pages.

## Why It Escaped

The design-system loop checked route truth, state rendering, and some geometry,
but did not force a direct parity comparison with an established generated
render page such as `list-detail-panel`, `list-detail-split-layout`, or
`simple-select`.

Gap classification:

- shared render-page contract blind spot
- local-vs-global scope regression
- incomplete human-review wording

## Reconciliation Changes

- Updated the drawer-form render page intro to use the established
  `Canonical Render` posture.
- Replaced component-preview metadata with generated-render metadata:
  matched canonical, viewing circumstances, form state, viewport contract, and
  review note.
- Scoped RTL to the drawer-form render surface instead of the whole document.
- Updated drawer-form tests to assert the document shell stays LTR while the
  specimen surface is RTL.
- Updated the frontend design-system loop skill with a generated canonical
  render-page parity gate.

## Coverage Lesson

Generated canonical render-page work needs a contract comparison against an
adjacent signed-off render page before implementation. Route and state checks
are not enough; the page needs to communicate review intent and preserve local
state scope.

## Follow-Up Watch Items

- Consider extracting a shared generated-render metadata and stepper helper so
  future component seams do not hand-roll the page contract.
- Audit recently added generated render pages for document-level direction,
  theme, or zoom mutations when their state should be local.
