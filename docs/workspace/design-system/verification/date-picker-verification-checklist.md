# Design System Verification Checklist

## Scope

- Artifact name:
  `Date Picker`
- Surface:
  `/design-system/canonicals/date-picker`
  `/design-system/components/date-picker`
- Status under review:
  signed-off child reference baseline
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/date-picker-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/date-picker-reference-pack.md`
- Related canonical launcher:
  `/design-system/canonicals/date-picker`
- Related canonical render surface:
  `/design-system/components/date-picker`
- Related parent behavior lock:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related parent reference pack:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A `Date Picker` child seam must preserve fast single-date picking, deliberate
  staged range authoring, truthful range-with-time summaries, and a mobile
  full-screen overlay posture without absorbing parent page framing.
- Trigger for this review:
  Start the child-seam loop for the signed-off `Form Template` date-picker
  family.
- What changed since the last review:
  The child seam now has a dedicated behavior lock, child reference pack, and
  dedicated canonical launcher and dedicated child render surface plus route-level browser proof for staged range
  selection, reverse normalization, nested range-with-time summary sync,
  mobile RTL overlay behavior, anchored jump controls, and dark-theme
  magnification stress.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/components/date-picker.html`
  `src/frontend/designSystem/assets/datePickerCanonical.mjs`
  `src/frontend/designSystem/templates/form/index.html`
  `src/frontend/designSystem/assets/app.mjs`
  `src/frontend/designSystem/assets/styles.css`
- Implementation updated:
  yes
  the child seam now has a dedicated canonical render surface, and the shared
  form runtime now passively closes unrelated open form surfaces so the locked
  overlay exclusivity rule is enforced by code rather than only by
  documentation
- Known source-level risks:
  the dedicated render surface still depends on copied hosted framing and will
  need careful sync if the parent field shell evolves materially

## Rendered Verification

- Required viewports checked:
  desktop dedicated child render surface and mobile dedicated child render surface
- Required direction states checked:
  RTL mobile overlay state covered through route-level browser proof
- Required theme states checked:
  dark-theme range review covered through route-level browser proof
- Required magnification states checked:
  magnified dark-theme range review covered through route-level browser proof
- Real interactive states checked:
  single-date quick close
  range staged selection with `Done` gating
  reverse-order range normalization
  range-with-time outer-label sync after nested time change
  anchored month-jump and end-anchor reanchoring behavior
  mobile full-screen overlay geometry
  hidden sibling panel guarantee under mobile overlay rules
  RTL mobile nav-glyph mirroring
  cross-family passive closure of unrelated open form surfaces
- Overflow or clipping checks:
  mobile full-screen overlay geometry covered; jump controls, summary, and
  `Done` footer now have dark/magnified route-level visibility proof
- Layering or anchoring checks:
  nested time-picker overlap inside range-with-time covered; anchored month and
  year jump controls now have direct route-level proof on the dedicated child
  render surface
- Attachment / shell-framing checks:
  parent-owned framing remains visible on the dedicated render surface and is
  intentionally hosted rather than redefined
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/datePicker.spec.ts`
  `tests/visual/designSystem/datePickerCanonical.spec.ts`

## Accessibility Verification

- Keyboard entry and exit:
  covered for owned close paths through `Escape`, `Done`, and single-date close
- Focus order and return focus:
  covered for single-date close, range `Done`, and mobile `Escape` dismissal
- Semantic structure:
  source inspected
  trigger buttons use dialog semantics and picker panels keep labelled dialog
  shells inside the parent form
- Screen-reader naming and labeling:
  source inspected
  child seams rely on parent field labels plus panel titles for naming
- Contrast or motion considerations:
  dark-theme and magnification stress now have direct route-level proof
- Localization or long-content considerations:
  RTL mobile nav mirroring verified; jump-control and summary stress are now
  browser-proved on the dedicated canonical render surface

## State Coverage

- Default:
  source inspected
- Hover / pressed / focus:
  source inspected
- Selected / active:
  covered through staged and completed range tests
- Disabled:
  covered through `Done` gating during incomplete range authoring
- Loading:
  not applicable
- Empty:
  not applicable
- Error:
  parent-owned field error copy only; no child-specific local error state today
- Denied / restricted:
  not applicable
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  unchanged
- Rendered status:
  partially verified
- Human sign-off status:
  child behavior lock, child reference pack, dedicated canonical launcher, and
  dedicated child render surface now exist; direct sign-off on the `DTPR-*`
  set is still pending
- Promotion decision:
  keep as `signed-off child reference baseline`, not yet `system-ready`
- Open follow-ups:
  review the dedicated `DTPR-*` launcher set directly for sign-off
  continue the active `time-picker` child loop while keeping the nested
  boundary explicit as date-picker canonicals mature

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/date-picker-verification-checklist.md`
- Design-system route update required:
  yes:
  `/design-system/canonicals/date-picker`
  `/design-system/components/date-picker`
- Canonical render-ready / honest-width check required:
  completed for both the launcher and the dedicated child render surface
- Frontend gate manifest update required:
  not yet
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  no
