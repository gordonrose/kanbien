# Design System Verification Checklist

## Scope

- Artifact name:
  `Choice Group`
- Surface:
  persistence-backed child render surface at
  `/design-system/canonical-renderings/choice-group/:ref`
- Status under review:
  signed-off child-seam baseline with parent-owned stress proof
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/choice-group-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/choice-group-reference-pack.md`
- Related parent behavior lock:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related parent reference pack:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Current executable verification:
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
  `tests/visual/designSystem/canonicals/forms/choiceGroupCanonical.spec.ts`

## Visual Contract

- One-sentence rule:
  `Choice Group` must remain a parent-hosted grouped selection seam that keeps
  fieldset semantics, stacked row anatomy, inline group errors, and the
  distinct shared-statement checkbox pattern honest without absorbing parent
  page composition.
- Trigger for this review:
  continue the `Choice Group` child-seam loop after parent-level grouped-choice
  proof was added to the signed-off `Form Template` route
- What changed since the last review:
  the seam now has a persistence-backed generated child canonical launcher and
  dedicated child render surface for `CGR-001`, `CGR-002`, `CGR-003`,
  `CGR-004`, `CGR-006`, `CGR-007`, `CGR-010`, and `CGR-011`
  the remaining `CGR-005`, `CGR-008`, and `CGR-009` states are intentionally
  retained as parent-owned proof from the signed-off `Form Template` route
  the user has now visually approved the child canonical batch and parent-owned
  stress boundary as the signed-off baseline; this pass makes the tile-like
  `.form-choice-group` host explicit for radio, checkbox, and shared-statement
  variants

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/canonicals/choice-group/index.html`
  `src/frontend/designSystem/components/choice-group.html`
  `src/frontend/designSystem/assets/choiceGroupCanonical.mjs`
  `src/frontend/designSystem/templates/form/index.html`
  `src/frontend/designSystem/assets/styles.css`
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
  `tests/visual/designSystem/canonicals/forms/choiceGroupCanonical.spec.ts`
- Implementation updated:
  yes
  this pass promotes the first child launcher/render slice onto the
  persistence-backed generated canonical seam while keeping the live parent
  grouped-choice implementation unchanged; the generated render surface now
  publishes ready only after a settled-frame boundary
- Known source-level risks:
  no second governed consumer exists yet
  the shared-statement variant still carries parent-specific release-checklist
  copy in the parent route even though the child render now avoids freezing
  full-width host placement into the child API

## Rendered Verification

- Required viewports checked:
  child-owned proof now covers single-field desktop, multi-group desktop, and
  narrow mobile stress through `CGR-001` through `CGR-004`, `CGR-006`,
  `CGR-007`, `CGR-010`, and `CGR-011`
- Required direction states checked:
  child-owned RTL proof now exists through `CGR-007` and `CGR-011`
  inherited disabled mobile RTL proof still remains parent-hosted through
  `CGR-005`
- Required theme states checked:
  child-owned dark-theme readability proof now exists through `CGR-006`
- Required magnification states checked:
  not yet isolated for the child seam
- Overflow or clipping checks:
  no child-specific overflow or clipping risk found in the direct child render
  states reviewed so far, including `CGR-010` and `CGR-011`
- Layering or anchoring checks:
  not applicable
  this seam does not currently own an overlay, popover, drawer, or sheet
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
  `docs/workspace/design-system/reference-packs/choice-group-reference-pack.md`

## Accessibility Verification

- Keyboard entry and exit:
  currently inherited from native radio and checkbox controls; no seam-owned
  overlay or focus choreography exists
- Focus order and return focus:
  inherited from standard document flow and native control semantics
- Semantic structure:
  covered by source inspection and parent-hosted proof
  all current variants use fieldset/legend grouping with native radios or
  checkboxes
- Interaction target size:
  source inspected
  current rows are label-wrapped, so the copy stack and not just the control
  glyph remains clickable
- Focus visibility:
  covered through parent-hosted executable proof
  current grouped-choice rows still rely on parent-hosted proof for row-level
  focus emphasis through `CGR-009`
- Screen-reader naming and labeling:
  source inspected
  legends, row labels, and the shared lead statement are present in the
  current markup
- Contrast or motion considerations:
  no child-specific motion behavior applies
  theme-specific grouped-choice readability now has direct child-owned proof
  through `CGR-006`
- Localization or long-content considerations:
  covered through child-owned executable proof for `CGR-010` and `CGR-011`
  while the parent route still remains the fallback source of truth for
  non-canonical stress review

## State Coverage

- Default:
  covered through child-owned executable proof
- Hover / pressed / focus:
  partially covered
  current row-level focus visibility still has direct parent-hosted proof
  through `CGR-009`, but hover visuals remain source-inspected
- Selected / active:
  covered through child-owned executable proof
- Disabled:
  covered through parent-hosted executable proof, including combined-state
  review with local errors visible
- Loading:
  not applicable
- Empty:
  not applicable
- Error:
  covered through child-owned executable proof for `CGR-004`
  combined-state review with inherited disabled posture still remains
  parent-hosted through `CGR-008`
- Denied / restricted:
  not applicable
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  child launcher and render surface created
- Rendered status:
  verified through the approved mixed child-owned and parent-hosted proof set
- Human sign-off status:
  approved for the child canonical batch and parent-owned stress boundary
- Promotion decision:
  promote `Choice Group` to signed-off; do not promote to `system-ready`
  without a second governed consumer
- Open follow-ups:
  prove a second governed consumer before promotion to `system-ready`
  if a future consumer needs child-owned disabled or focus stress states,
  add those as an approved expansion rather than treating them as missing from
  the signed-off baseline

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/choice-group-verification-checklist.md`
- Design-system route update required:
  yes
  `/design-system/canonical-renderings/choice-group`
  `/design-system/canonical-renderings/choice-group/:ref`
- Canonical render-ready / honest-width check required:
  completed for the first child review batch; readiness now waits for settled
  browser geometry before assertions run
- Frontend gate manifest update required:
  no
- Architecture-map update required:
  no
- Real-app adoption now allowed:
  no
  a first real-app consumer still needs an adoption contract that consumes the
  signed-off child seam without copying parent-hosted form behavior
