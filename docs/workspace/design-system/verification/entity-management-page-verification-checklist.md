# Entity Management Page Verification Checklist

## Scope

- Artifact name:
  `EntityManagementPage`
- Surface:
  `/design-system/templates/entity_management_page`
- Status under review:
  needs-review
- Related behavior lock index:
  `docs/workspace/design-system/behavior-locks/entity-management-page-behavior-lock-index.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/entity-management-page-reference-pack.md`
- Related WCAG checklist:
  `docs/workspace/design-system/verification/entity-management-page-wcag-2-2-aa-checklist.md`
- Current executable coverage:
  - `tests/visual/designSystem/templates/recordManagementListCentric.spec.ts`
  - `tests/visual/designSystem/canonicals/data-display/entityManagementPageCanonical.spec.ts`

## Visual Contract

- One-sentence rule:
  The Entity Management Page must behave as one governed page-template seam
  with shared region/nested navigation, lazy-rendered details, page-level
  mobile scroll, accessible generated controls, and evidence/AI modes that do
  not distort the active detail panel.
- Trigger for this review:
  Prepare the current design-system demo for behavior-lock review, reference
  evidence, and eventual app-consumable seam extraction.
- What changed since the last review:
  The entity-management renderer was extracted from the drawer file, inactive
  regions/nested panels were made lazy, Identity was moved onto the shared
  nested-list picker, mobile carousel behavior was applied across sections,
  mobile vertical scroll was moved to the whole page, and review-candidate
  behavior-lock slices were created. The entity-management page drawer now has
  shared design-system render and hydrate entrypoints consumed by both the
  template host and child canonical renderer.

## Source Verification

- Source files to inspect:
  - `src/frontend/designSystem/assets/entityManagementPage.mjs`
  - `src/frontend/designSystem/assets/chatWorkspaceRowDrawer.mjs`
  - `src/frontend/designSystem/assets/chatWorkspacePattern.css`
  - `src/frontend/designSystem/assets/recordManagementListCentricTemplate.mjs`
  - `src/frontend/designSystem/assets/entityManagementPageCanonical.mjs`
  - `tests/visual/designSystem/templates/recordManagementListCentric.spec.ts`
  - `tests/visual/designSystem/canonicals/data-display/entityManagementPageCanonical.spec.ts`
- Implementation updated:
  yes
- Known source-level risks:
  - demo fixture data is still mixed into the render/behavior module
  - the full entity-management module is still eagerly imported by the current
    drawer path, though drawer render/hydrate ownership is no longer duplicated
  - many generated detail-panel behaviors have source support but only partial
    rendered verification
  - canonical child refs still need one-by-one screenshot review before human
    sign-off

## Rendered Verification

- Required viewports checked:
  - desktop full width
  - desktop constrained height
  - tablet/narrow transitional width
  - mobile 390px width
  - mobile short-height viewport where top menus consume significant space
- Required direction states checked:
  - LTR desktop
  - LTR mobile
  - RTL desktop
  - RTL mobile
- Required theme states checked:
  - normal
  - dark
  - desert or any currently supported alternate theme
- Required magnification states checked:
  - default zoom
  - 200% zoom or equivalent browser magnification
  - text spacing override:
    line-height, letter spacing, word spacing, and paragraph spacing consistent
    with WCAG text-spacing review
- Real interactive states checked:
  - filled inputs
  - readonly inputs
  - disabled controls
  - open region selector
  - open drawer-select
  - open collapsible section
  - workflow add/copy/delete
  - catalog add/copy/delete
  - permission role add/copy/delete
  - validation rule add/remove
  - workflow status add/remove/move
  - evidence mode open
  - AI mode open
  - edit mode open
- Overflow or clipping checks:
  - desktop region index scrolls without truncating long labels
  - desktop nested drawer scrolls where desktop height is constrained
  - mobile vertical scroll belongs to the page
  - mobile nested detail drawer does not trap vertical scroll
  - horizontal carousel scroll stays local to the nested card rail
  - no horizontal page overflow at mobile width
  - long labels wrap or truncate with recovery instead of overlapping controls
  - long unbroken tokens do not escape cards, fields, panels, or buttons
- Layering or anchoring checks:
  - region selector menu layers above page content
  - drawer-select panels layer predictably
  - evidence/AI desktop panel sits beside the active detail panel
  - mobile evidence/AI overlay covers the current body without breaking bottom
    navigation reachability
  - bottom nav remains reachable on mobile
- Attachment / shell-framing checks:
  - page remains inside the governed design-system shell
  - drawer close and record active-group summary remain hidden for this page
  - app-consumable seam preserves outer page framing, not only field styling
- Alignment or shared-gutter checks:
  - desktop evidence/AI split gives the details and evidence/AI panel equal
    usable widths
  - nested desktop layout preserves card column, resizer, and detail column
  - mobile page content aligns to the shell gutter while the carousel can scroll
    horizontally
- Initial render performance check:
  - first useful view appears with one rendered top-level region
  - first useful view appears with one rendered nested detail panel
  - inactive heavy regions are represented by lightweight placeholders
  - inactive heavy nested panels are represented by lightweight placeholders
- Initial DOM/control count:
  - record observed count for the reviewed run
  - fail review if initial DOM/control count regresses toward eager hidden-DOM
    behavior
- Large module or fixture-load note:
  - record current module size and whether demo data is still bundled with the
    reusable behavior seam
- Screenshot or rendered evidence reference:
  - capture each required `EMPR-*` state from the reference pack once canonical
    or deterministic render routes exist

## Slice Verification

| Slice | Required checks |
| --- | --- |
| Outer page | Shell chrome, drawer-as-page-body, desktop internal scroll, mobile page-level scroll, bottom nav reachability, app-consumable boundary. |
| Navigation | Region order, mobile selector, long labels, nested cards, active states, carousel across sections, desktop resizer, lazy region activation. |
| Detail panel | Field anatomy, readonly/disabled states, derived fields, validation rules, workflow builder, catalog builder, permissions, action models. |
| Collection item | Add/copy/delete workflows, catalogs, permissions; card sync; panel sync; no duplicate ids after repeated operations. |
| Evidence/AI | Mode toggles, target affordances, mutual exclusion, desktop split, mobile overlay, close/return/focus behavior. |
| Performance | Initial lazy footprint, visited-region growth, handler initialization, module/fixture separation, render-ready signal. |

## Accessibility Verification

- Keyboard entry and exit:
  all page controls must be reachable without pointer use, including region
  picker, nested cards, resizer, add/copy/delete controls, collapsible
  sections, drawer-selects, evidence/AI controls, and bottom nav.
- Focus order and return focus:
  focus must follow visual/task order; opening/closing overlays must not strand
  focus; focus must not be hidden behind sticky/fixed chrome.
- Semantic structure:
  region tabs, tabpanels, buttons, form labels, grouped controls, drawers, and
  overlays must expose appropriate semantics and names.
- Screen-reader naming and labeling:
  icon buttons, add cards, destructive actions, evidence/AI buttons, field
  groups, and generated controls must have accessible names that remain clear
  outside visual context.
- Contrast or motion considerations:
  normal/dark/alternate themes must preserve WCAG 2.2 AA contrast, focus
  indication, non-text contrast, and reduced-motion compatibility.
- Localization or long-content considerations:
  long labels, long values, long unbroken strings, translated labels, and RTL
  direction must not cause overlap, clipping, inaccessible truncation, or
  horizontal page overflow.
- Browser-native affordance coexistence considerations:
  native input, textarea, select, details/summary, and browser zoom behavior
  must remain usable and visible.

## State Coverage

- Default:
  `EMPR-001`, `EMPR-011`, `EMPR-023`
- Hover / pressed / focus:
  nested cards, add cards, icon buttons, evidence/AI targets, drawer-selects,
  section toggles, bottom nav
- Selected / active:
  region trigger, mobile selector, nested card, active evidence/AI/edit mode
- Disabled:
  readonly/system-managed fields, fixed workflow create status controls,
  disabled model fields
- Loading:
  not yet represented; needs future app-consumable state
- Empty:
  add-created blank workflow, no selected drawer-select states, future empty
  entity region states
- Error:
  validation rule panels, generated action model error cards, future form
  validation state
- Denied / restricted:
  permission/action availability states need app-data contract before sign-off
- Destructive:
  workflow/catalog/permission delete controls and action model destructive
  surfaces

## Quality Gate Outcome

- Implementation status:
  changed
- Rendered status:
  partially verified; shell viewport, shared drawer render/hydrate, and
  representative child-region routing are now executable checks
- Human sign-off status:
  pending
- Promotion decision:
  remain needs-review until reference states, child canonical screenshot
  review, and WCAG checklist are completed
- Open follow-ups:
  - complete deterministic child canonical screenshot review by matrix
  - split demo data and fixture catalog from reusable behavior/render module
  - broaden the app adoption API beyond the current drawer render/hydrate
    entrypoints only after the child matrices are signed off
  - add high-count and long-label fixtures
  - add keyboard-only and WCAG 2.2 AA browser checks

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/entity-management-page-verification-checklist.md`
- Design-system route update required:
  yes, if reference states become dedicated render/canonical routes
- Canonical render-ready / honest-width check required:
  yes
- Frontend gate manifest update required:
  yes, once the reference pack moves beyond review-candidate
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  no; a first shared render/hydrate boundary exists, but app adoption remains
  blocked until behavior/reference/canonical/WCAG evidence is signed off
