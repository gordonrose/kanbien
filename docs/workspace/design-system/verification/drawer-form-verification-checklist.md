# Drawer Form Verification Checklist

## Scope

- Artifact name:
  `DrawerForm`
- Generated canonical launcher:
  `/design-system/canonical-renderings/drawer-form`
- Generated canonical render surface:
  `/design-system/canonical-renderings/drawer-form/:ref`
- Source component surface:
  `/design-system/components/drawer-form`
- First host surfaces:
  `/design-system/templates/list-page?drawerMode=form&formIntent=create`
  `/design-system/templates/list-page?drawerMode=form&formIntent=edit`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/drawer-form-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/drawer-form-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A drawer form must provide a reusable, internally scrolling create/edit form
  body that composes approved form controls inside an existing drawer host.
- Trigger for this review:
  Promote the list-page form drawer variation into a shared design-system seam
  named `drawer-form`.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/assets/drawerForm.mjs`
  `src/frontend/designSystem/assets/listDrawerShell.mjs`
  `src/frontend/designSystem/assets/drawerFormCanonical.mjs`
  `src/frontend/designSystem/components/drawer-form.html`
  `src/frontend/designSystem/router.ts`
  `src/features/designSystemCanonicals/persistence/migrations/0045_seed_drawer_form_canonicals.sql`
  `src/frontend/designSystem/templates/list-page/index.html`
  `src/frontend/designSystem/assets/listPage.mjs`
  `src/frontend/designSystem/assets/list-page-shared.css`
  `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`
  `tests/visual/designSystem/canonicals/data-display/drawerForm.spec.ts`
- Implementation updated:
  yes
- Known source-level risks:
  the first shared seam now separates the list drawer shell from the
  drawer-form body; a future app adoption pass may still need a narrower
  controller contract for validation and action wiring

## Rendered Verification

- Required viewports checked:
  desktop component surface, mobile-width component surface, and list-page host
  through Playwright
- Required direction states checked:
  LTR and RTL component states
- Required theme states checked:
  normal, dark, and desert theme states; dark theme also verifies nested
  drawer-select foreground contrast
- Required magnification states checked:
  default and 100 percent magnified component states
- Real interactive states checked:
  component select mix, date picker open state, time picker open state,
  drawer-select open state, disabled state, error state, list-page create,
  list-page edit, list-page save
- Overflow or clipping checks:
  list-page edit form asserts document scrollbar containment while preserving
  drawer internal overflow; mobile-width component state asserts no horizontal
  overflow in the drawer-form lane; date, time, and drawer-select open states
  assert their overlays remain contained in the canonical render frame, with
  drawer-select also contained by the actual list detail drawer lane
- Harness/adoption checks:
  drawer-form render-page source is asserted not to own local list drawer
  anatomy, and both the list-page host and drawer-form canonical assert
  `data-list-drawer-shell-source="list-drawer-shell"` at runtime
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/data-display/drawerForm.spec.ts`
  `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`

## Quality Gate Outcome

- Implementation status:
  shared drawer shell and shared form body extracted with persistence-backed
  canonical-renderings routes and URL fallback state controller
- Rendered status:
  desktop, mobile, RTL, magnified, disabled, error, and open-control paths
  verified by focused Playwright coverage
- Human sign-off status:
  visually accepted on 2026-04-27 after the nested drawer-select containment
  repair
- Promotion decision:
  shared seam candidate ready for commit and downstream adoption planning
