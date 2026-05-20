# Entity Management Region Index Compression

Date: 2026-05-20

## Visible Issue

The entity management template primary region index showed the expanded
Action Models entry as a single-line ellipsis, making the index look squeezed
instead of letting the longer item label take the space it needed and allowing
the index to scroll.

## Root Cause

The shared region trigger label rule forced all primary index labels to
`white-space: nowrap` with ellipsis. After the entity-structure action model
placeholder list grew to 94 items, the label "Action Models - Entity Structure"
became the first obvious case where the primary index needed wrapping rather
than single-line compression.

## Why Existing Coverage Missed It

The entity page visual spec asserted region order and content counts, but it
did not assert the primary index overflow contract or label wrapping behavior.
That allowed the list to grow while the single-line label rule remained
undetected.

## Reconciliation

- Scoped entity-page primary index labels now wrap naturally while count text
  remains compact.
- The primary index still owns vertical overflow with `overflow-y: auto`.
- The entity-page visual spec now asserts that the primary index is scrollable
  and that the long entity action-model label uses wrapping rather than nowrap
  ellipsis.

## Verification

- Live served page check on `http://localhost:3000/design-system/templates/entity_management_page`
  at `1440x1000` showed the primary index with `overflow-y: auto`, a
  scrollable height, and the entity action-model title using normal wrapping.
- `npx playwright test tests/visual/designSystem/templates/recordManagementListCentric.spec.ts --grep "entity page"`
  passed with 2 tests.
