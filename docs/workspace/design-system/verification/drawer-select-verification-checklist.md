# Drawer Select Verification Checklist

## Scope

- Artifact name:
  `drawer-select`
- Surface:
  `/design-system/canonical-renderings/drawer-select/:ref`
- Status under review:
  signed-off child-seam baseline under the signed-off `Form Template` parent
- Related parent host family:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/drawer-select-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/drawer-select-reference-pack.md`
- Related canonical launcher:
  `/design-system/canonical-renderings/drawer-select`
- Related canonical render surface:
  `/design-system/canonical-renderings/drawer-select/:ref`

## Visual Contract

- One-sentence rule:
  `Drawer Select` must remain a parent-hosted child seam that summarizes
  selections at rest, opens a search-first drawer with synchronized
  `Selected` and `Available` stacks, and keeps keyboard focus contained until
  exit.
- Trigger for this review:
  start the full design-system loop for the first signed-off child seam taken
  from `Form Template`
- What changed since the last review:
  the child seam now has a dedicated artifact chain, and the runtime was
  reconciled so each hosted variant owns an honest empty trigger-summary noun,
  and reopening the drawer now resets the previous search term; the
  `DSR-001` through `DSR-027` matrix now renders on a dedicated child route,
  including summary-boundary, toggle/remove, compact empty, long-label,
  localized, disabled, RTL, dark-theme, magnified, and mobile viewport review
  states; the user has visually approved the generated child matrix, and this
  pass makes the inherited `.form-field` tile host explicit for both drawer
  select variants

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/templates/form/index.html`
  `src/frontend/designSystem/assets/app.mjs`
  `src/frontend/designSystem/assets/drawerSelectCanonical.mjs`
  `src/frontend/designSystem/assets/styles.css`
  `tests/visual/designSystem/support/helpers/canonicalOverlayGuards.ts`
- Implementation updated:
  yes
  the child runtime now reads an instance-specific empty-summary fallback so
  the segment variant no longer falls back to `Choose collections`; the
  generated canonical suite now uses the shared overlay containment guard for
  representative desktop, RTL, dark/magnified, and mobile drawer postures
- Known source-level risks:
  no dedicated child-route drift found in this pass
  dark magnified parity remains intentionally separate from clean dark-only
  parity because there is not yet a one-to-one approved host magnified seam

## Rendered Verification

- Required viewports checked:
  dedicated child render route browser-checked for the desktop core batch and
  first mobile viewport pair
- Required direction states checked:
  first dedicated RTL child state browser-checked
- Required theme states checked:
  dedicated dark desktop and dark mobile child states browser-checked
- Required magnification states checked:
  first dedicated magnified child state browser-checked
- Real interactive states checked:
  open drawer, search filtering, option toggling, selected-chip removal,
  selected-empty state, search-empty state, trigger-summary synchronization,
  and search reset on reopen
- Overlay or layout-competition checks:
  representative open drawer overlays now use the shared canonical overlay
  containment guard against the render host and frame; drawer-select-to-drawer-
  select mutual exclusion is source-inspected; broader cross-overlay policy
  remains parent-owned
- Layering or anchoring checks:
  dedicated child drawer open states reviewed on the direct render surface,
  and the descriptive, compact, dark compact, and mobile open canonicals now
  compare overlay relationship back to the approved `form-template` host seam;
  direct render-frame containment now covers desktop, RTL, dark/magnified, and
  mobile drawer states through the shared helper
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/forms/drawerSelectCanonical.spec.ts`
  `docs/workspace/design-system/reference-packs/drawer-select-reference-pack.md`
  `src/frontend/designSystem/canonicals/drawer-select/index.html`
  `src/frontend/designSystem/components/drawer-select.html`
  `docs/workspace/issue-reconciliations/2026-04-18-drawer-select-approved-form-baseline-parity-gap.md`

## Accessibility Verification

- Keyboard entry and exit:
  directly browser-checked
  trigger opens the drawer, search receives focus, `Escape` closes the drawer,
  and focus returns to the trigger
- Focus order and containment:
  directly browser-checked for modal-like `Tab` / `Shift+Tab` containment
  while open
- Semantic structure:
  source inspected
  the drawer uses dialog semantics, labelled stack headings, and button-based
  selection controls
- Screen-reader naming and labeling:
  source inspected
  parent field labels and drawer titles are present on the dedicated child
  render route
- Contrast or motion considerations:
  dark-theme child review and compact-card contrast guard now exist
- Localization or long-content considerations:
  browser-checked through dedicated long-label and localized child renders

## State Coverage

- Default:
  runtime-probed through the parent route
- Hover / pressed / focus:
  partially covered
  focus containment is browser-checked; direct visual focus review still needs
  dedicated child canonicals
- Selected / active:
  browser-checked for option toggling and selected-chip removal
- Disabled:
  browser-checked through dedicated descriptive and compact disabled child
  canonicals
- Loading:
  not defined for this seam
- Empty:
  browser-checked for both no-selected and no-search-match states
- Error:
  parent field-shell error state exists, but no child-specific error mode is
  defined
- Denied / restricted:
  not applicable
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  aligned with the new child-seam artifact chain
- Rendered status:
  core dedicated child matrix browser-checked and launcher-linked correctly;
  approved-host screenshot parity now covers desktop descriptive, desktop
  compact, dark compact, mobile descriptive, mobile compact, and both dark
  mobile open states
- Human sign-off status:
  approved for the generated `DSR-*` child matrix
- Promotion decision:
  promote `Drawer Select` to signed-off; do not promote to `system-ready`
  without a second governed consumer and any required first-consumer adoption
  contract
- Open follow-ups:
  prove a second governed consumer before promotion to `system-ready`
  extend approved-host parity to additional states when clean one-to-one
  source seams exist, especially if a dedicated magnified host seam is later
  signed off

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/drawer-select-verification-checklist.md`
- Design-system route update required:
  yes:
  `/design-system/canonical-renderings/drawer-select`
  `/design-system/canonical-renderings/drawer-select/:ref`
- Frontend gate manifest update required:
  not yet
  wait until the expanded child matrix is approved
- Architecture-map update required:
  no
- Real-app adoption now allowed:
  no
  a first real-app consumer still needs an adoption contract that consumes the
  signed-off child seam without copying parent-hosted form behavior
