# Design System Verification Checklist

Superseded by `docs/workspace/design-system/verification/drawer-form-verification-checklist.md`
after the seam was renamed to `drawer-form` and promoted out of the list-page
host preview.

## Scope

- Artifact name:
  `ListFormDrawer`
- Surface:
  `/design-system/templates/list-page?drawerMode=form&formIntent=create`
  `/design-system/templates/list-page?drawerMode=form&formIntent=edit`
- Status under review:
  first governed preview
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-form-drawer-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/list-form-drawer-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A list form drawer must preserve the existing list-detail drawer shell while
  swapping the drawer body into local create/edit form work with clear
  save/cancel actions.
- Trigger for this review:
  Create a repeatable frontend pattern for editing and creating entity entries
  from list surfaces.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/templates/list-page/index.html`
  `src/frontend/designSystem/assets/listPage.mjs`
  `src/frontend/designSystem/assets/list-page-shared.css`
  `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`
- Implementation updated:
  yes
- Known source-level risks:
  this is still parent-preview behavior, not a promoted shared render API for
  app adoption

## Rendered Verification

- Required viewports checked:
  desktop through Playwright interaction tests
- Required direction states checked:
  not yet captured for RTL
- Required theme states checked:
  source-compatible with existing theme variables; not separately captured
- Required magnification states checked:
  not yet captured
- Real interactive states checked:
  create form open, create save, edit form open, edit save
- Overflow or clipping checks:
  source-level only for this first preview
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/data-display/listPage.spec.ts`

## Accessibility Verification

- Keyboard entry and exit:
  opening form mode focuses the title field; close/cancel use existing drawer
  focus return behavior
- Focus order and return focus:
  covered at source level and through existing parent drawer behavior
- Semantic structure:
  fields are native labelled inputs/textarea with local helper text
- Screen-reader naming and labeling:
  drawer title switches between create and edit intent
- Localization or long-content considerations:
  RTL and magnified references remain open follow-ups before sign-off

## State Coverage

- Create:
  covered
- Edit:
  covered
- Save:
  covered through deterministic placeholder-state mutation
- Cancel:
  source-inspected
- Error:
  not yet modeled for the form variation
- Disabled:
  not yet modeled for the form variation

## Quality Gate Outcome

- Implementation status:
  changed
- Rendered status:
  partially verified
- Human sign-off status:
  pending
- Promotion decision:
  keep as first governed preview, not app-adoption-ready
- Open follow-ups:
  add RTL, magnified, error, disabled, and mobile captures before promoting
  this from preview to signed-off component seam
