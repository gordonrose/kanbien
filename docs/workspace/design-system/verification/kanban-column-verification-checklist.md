# Design System Verification Checklist

## Scope

- Artifact name:
  `KanbanColumn`
- Surface:
  `/design-system/patterns/kanban-column`
  `/design-system/canonical-renderings/kanban-column`
  `/design-system/canonical-renderings/kanban-column/:ref`
- Status under review:
  signed-off pattern seam
- Related pattern artifact:
  `docs/workspace/design-system/patterns/kanban-column-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/kanban-column-component.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/kanban-column-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/kanban-column-reference-pack.md`
- Related inherited behavior:
  `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md`
- Related adoption contract:
  `docs/workspace/design-system/adoption/kanban-column-shared-seam-adoption-contract.md`

## Visual Contract

- One-sentence rule:
  A `KanbanColumn` board must let users manage visible columns, create columns
  spatially between columns, add cards inline within a lane, archive and restore
  columns without losing cards, and move cards through both drag and non-drag
  controls across desktop and mobile.
- Trigger for this review:
  User sign-off after iterative design-system review of add-column, add-card,
  archive drawer, drag/drop, and strained-display behavior.
- What changed since the last review:
  The signed-off pattern now has a behavior lock, reference pack, component
  seam artifact, inventory row, checklist, persistence-backed generated
  canonical launcher, and dedicated `KCR-*` render states.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/patterns/kanban-column/index.html`
  `src/frontend/designSystem/assets/kanbanColumnSeam.mjs`
  `src/frontend/designSystem/assets/kanbanColumn.mjs`
  `src/frontend/designSystem/assets/kanbanColumn.css`
  `src/frontend/designSystem/components/kanban-column.html`
  `src/frontend/designSystem/assets/kanbanColumnCanonical.mjs`
  `src/features/designSystemCanonicals/persistence/migrations/0047_seed_kanban_column_canonicals.sql`
  `src/features/designSystemCanonicals/persistence/migrations/0048_update_kanban_column_mobile_scroll_canonical.sql`
  `src/features/designSystemCanonicals/persistence/migrations/0049_expand_kanban_column_canonical_scenarios.sql`
  `src/features/designSystemCanonicals/persistence/migrations/0050_update_kanban_column_magnified_canonical.sql`
  `tests/visual/designSystem/patterns/kanbanColumn.spec.ts`
  `tests/visual/designSystem/canonicals/data-display/kanbanColumn.spec.ts`
- Implementation updated:
  yes
- Known source-level risks:
  the shared render/controller API now exists and is consumed by the pattern
  and canonical routes; app adoption remains blocked until a first-consumer
  adoption contract names a real app surface and product integration plan.

## Rendered Verification

- Required viewports checked:
  desktop and mobile-horizontal-scroll through Playwright pattern and canonical
  coverage
- Required direction states checked:
  RTL exercised through display settings in the pattern route and `KCR-015`
- Required theme states checked:
  dark theme exercised with count-badge contrast assertion
- Required magnification states checked:
  display settings magnification control exercised by the pattern route and
  `KCR-016`; `KCR-016` uses specimen zoom at a narrower review width so the
  magnified behavior is visually obvious
- Real interactive states checked:
  drawer open/search focus, visible-column hide/restore, create-column mode,
  draft-column focus, add-card draft focus, archive/restore, archive callout,
  non-drag movement, drag/drop, landing marker
- Overflow or clipping checks:
  archived drawer section spacing now has a rendered geometry regression;
  add-card plus icon and label centering now has rendered geometry proof;
  magnified card overflow has canonical regression coverage
- Layering or anchoring checks:
  drawer route state and archive section are checked in the live drawer panel
- Attachment / shell-framing checks:
  pattern page remains the host; dedicated canonical render framing is still
  required before canonical sign-off
- Alignment or shared-gutter checks:
  plus-glyph centering in add-card button is checked with browser geometry
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/patterns/kanbanColumn.spec.ts`
  `tests/visual/designSystem/canonicals/data-display/kanbanColumn.spec.ts`

## Accessibility Verification

- Keyboard entry and exit:
  source and rendered proof cover button-based controls, draft input focus, and
  Escape cancellation for drafts
- Focus order and return focus:
  drawer close returns focus through inherited drawer-select behavior; draft
  column and draft card inputs receive focus after creation
- Semantic structure:
  columns are sections; cards are articles; controls are buttons; forms use
  labels
- Screen-reader naming and labeling:
  add-column rails and add-card controls include destination-specific labels
- Contrast or motion considerations:
  dark count-badge contrast has a rendered assertion; drag feedback is visual
  but does not rely on decorative animation
- Localization or long-content considerations:
  long-copy and RTL strain exist; broader localization is not yet modeled
- Browser-native affordance coexistence considerations:
  drag is desktop-only in practice, with button fallback retained

## State Coverage

- Default:
  covered
- Hover / pressed / focus:
  create-mode pressed state and draft focus covered; hover remains
  source-inspected
- Selected / active:
  create mode, active drawer state, and drag/drop active column covered
- Disabled:
  card move buttons disable at board edges
- Loading:
  not modeled yet
- Empty:
  empty visible column/drop target state covered indirectly
- Error:
  validation messages for empty draft names/titles are source-inspected
- Denied / restricted:
  not modeled yet
- Destructive:
  destructive hard-delete is intentionally not supported; remove archives

## Quality Gate Outcome

- Implementation status:
  changed
- Rendered status:
  verified for signed-off pattern route
- Human sign-off status:
  approved for component seam lock
- Promotion decision:
  promote to `signed-off` pattern seam with generated canonical render states
- Open follow-ups:
  write first-consumer adoption contract and product integration plan before
  app use

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/kanban-column-verification-checklist.md`
- Design-system route update required:
  complete:
  `/design-system/canonical-renderings/kanban-column`
  `/design-system/canonical-renderings/kanban-column/:ref`
- Canonical render-ready / honest-width check required:
  completed for `KCR-001` through `KCR-017`
- Frontend gate manifest update required:
  not yet
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  no
