# List Page Template

## Scope

- Template name:
  `List Page`
- Status:
  signed-off
- Owner:
  Codex with user sign-off
- Current governed surface:
  `/design-system/templates/list-page`
- Parent behavior lock:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Parent reference pack:
  `docs/workspace/design-system/reference-packs/list-page-reference-pack.md`

## Intent

- What user or operator need does this template serve?
  Provide a reusable page shape for scanning a list of records and opening one
  selected record into a connected detail surface without leaving the current
  page context.
- Why should this remain a parent template rather than becoming one giant component?
  The page-level shell, list cadence, and detail choreography need to stay
  reusable across different domains, while child seams can be extracted
  independently as they stabilize.

## Parent Anatomy

- Required parts:
  page-shell chrome, list column, repeated selectable cards, detail surface
- Optional parts:
  future filter or summary regions, empty-state messaging, pagination or bulk
  controls
- Layout structure:
  single-column list by default, desktop split when a selection is open,
  mobile full-sheet detail overlay
  in RTL, the desktop split and drawer control zones mirror natively rather
  than preserving an LTR-only control order

## Parent State Model

- Default:
  list only, no selected card, detail closed
- Selected:
  one card active, detail populated from selected-card data
  focus moves into the detail surface when it opens
  a polite status message may announce the newly opened record
  footer navigation may stay as a simple previous/next pair
- Create or edit form drawer:
  the existing detail drawer shell may switch into a local form body for
  placeholder entity-entry creation or selected-record editing
  form mode keeps field labels, helper text, save, and cancel actions inside
  the drawer while preserving the parent split layout and close behavior
  preview saves may mutate browser-only placeholder records, while real
  persistence and domain validation remain feature-owned
- Dismissed:
  detail closed again, no active card
  focus returns to the originating list card on close
- Mobile selected:
  detail overlays the list region and remains beneath shared shell overlays
  keyboard focus stays contained within the overlay while it is open
- Loading:
  the list region may show a governed skeleton-card loading state during slow
  initial hydration or append expansion without implying that the whole shell
  is blocked
- Empty:
  the list region may render a dedicated empty-state surface with neutral
  recovery when no records exist yet
- No results:
  the list region may render a distinct no-results surface that preserves
  search context and offers clear-search recovery
  when search or filter changes remove the active record from the visible set,
  the detail surface closes and focus returns to search
- Missing attributes:
  cards and detail content may render with a neutral primary-title fallback
  and omission of missing secondary fields rather than noisy placeholder
  substitutions
- Long attributes:
  compact list fields and detail metadata may truncate with shared-tooltip
  recovery, while drawer title and body content remain wrapped for readable
  long-form detail review
  this state must remain readable under the shared magnification control
  without losing the close affordance, and the detail surface may become the
  recovery scroll lane if header/footer pressure exceeds the available panel
  height
- Extended list:
  the list column can seed additional neutral placeholder cards and then append
  more as the user scrolls downward
  in the closed desktop state this should follow browser/page scroll, while
  the open desktop split may move that responsibility into the list lane so
  list browsing stays independent from detail reading
  when no scroll affordance exists but more records remain, the existing
  lazy-load status line may act as a low-profile inline load-more link
  the drawer footer `Next` control may still trigger boundary loading, but the
  parent pattern does not need separate fallback chrome in the list region
  a polite status message may announce additional records loaded
- Error:
  the list region and detail surface may each render scoped error states with
  local retry, including initial-load error, append-load error, and local
  detail failure without collapsing the parent shell
- Search or filter:
  optional parent-level search may shape the visible list, persist its query in
  URL state, and must participate honestly in no-results, selection
  invalidation, and focus-return behavior when present

## Extraction Order

1. `ListRecordCard`
   This is the best first extraction because the same anatomy repeats multiple
   times inside the parent pattern and already carries the selection contract.
2. `ListDetailPanel`
   Extract after the card seam is documented and after we know more about
   parent-owned versus child-owned detail content regions.
3. `ListDetailSplitLayout`
   Extract only after a second governed consumer proves the parent split API
   is stable enough to share beyond this one page family.

## First Child Decision

- Recommended first child:
  `ListRecordCard`
- Why this seam first?
  It is repeated, already stable in anatomy, and lets us formalize list-item
  selection without freezing the full parent split-layout API too early.
- What stays parent-owned for now?
  desktop/mobile layout switching, detail-panel placement, shell stacking, and
  the overall parent open/close choreography

## Governed Child Artifacts Started In This Loop

- `docs/workspace/design-system/token-reviews/list-record-card-token-candidacy-review.md`
- `docs/workspace/design-system/behavior-locks/list-record-card-behavior-lock.md`
- `docs/workspace/design-system/reference-packs/list-record-card-reference-pack.md`
- `docs/workspace/design-system/patterns/list-record-card-pattern.md`
- `docs/workspace/design-system/components/list-record-card-component.md`
- `docs/workspace/design-system/verification/list-record-card-verification-checklist.md`
- `docs/workspace/design-system/behavior-locks/list-detail-panel-behavior-lock.md`
- `docs/workspace/design-system/reference-packs/list-detail-panel-reference-pack.md`
- `docs/workspace/design-system/patterns/list-detail-panel-pattern.md`
- `docs/workspace/design-system/components/list-detail-panel-component.md`
- `docs/workspace/design-system/verification/list-detail-panel-verification-checklist.md`
- `docs/workspace/design-system/behavior-locks/list-detail-split-layout-behavior-lock.md`
- `docs/workspace/design-system/reference-packs/list-detail-split-layout-reference-pack.md`
- `docs/workspace/design-system/patterns/list-detail-split-layout-pattern.md`
- `docs/workspace/design-system/components/list-detail-split-layout-component.md`
- `docs/workspace/design-system/verification/list-detail-split-layout-verification-checklist.md`

## Source Of Truth

- Parent implementation:
  `src/frontend/designSystem/templates/list-page/index.html`
- Parent interaction controller:
  `src/frontend/designSystem/assets/listPage.mjs`
- Parent regression coverage:
  `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`
- Drawer-form seam artifacts:
  `docs/workspace/design-system/behavior-locks/drawer-form-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/drawer-form-reference-pack.md`
  `docs/workspace/design-system/verification/drawer-form-verification-checklist.md`
- Drawer-form shared renderer:
  `src/frontend/designSystem/assets/drawerForm.mjs`
- Current composition note:
  the parent route now recomposes the signed-off `ListRecordCard`,
  `ListDetailPanel`, and `ListDetailSplitLayout` seam shapes while keeping
  parent-owned selection, search, loading, drawer-form host intent, announcement,
  and focus-return choreography in the parent controller
