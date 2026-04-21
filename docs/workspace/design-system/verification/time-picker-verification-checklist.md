# Design System Verification Checklist

## Scope

- Artifact name:
  `Time Picker`
- Surface:
  `/design-system/canonicals/time-picker`
  `/design-system/components/time-picker`
- Status under review:
  signed-off child baseline
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/time-picker-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/time-picker-reference-pack.md`
- Related canonical launcher:
  `/design-system/canonicals/time-picker`
- Related canonical render surface:
  `/design-system/components/time-picker`
- Related parent behavior lock:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related parent reference pack:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A `Time Picker` child seam must preserve brisk two-column quick-pick
  behavior, minute-completion close semantics, explicit focus return on
  seam-owned dismissals, and the approved nested overlap inside
  `date range with time` without absorbing parent page or date-picker logic.
- Trigger for this review:
  Complete the child-seam loop for the signed-off `Form Template`
  time-picker family and freeze the approved child surface.
- What changed since the last review:
  The child seam now has a dedicated behavior lock, child reference pack, and
  dedicated canonical launcher plus dedicated canonical render surface, and
  route-level browser proof for standalone quick-pick completion, nested
  range-with-time overlap, composed outer-label sync, mobile overlay
  posture, and desktop RTL mirrored alignment.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/templates/form/index.html`
  `src/frontend/designSystem/assets/app.mjs`
  `src/frontend/designSystem/assets/styles.css`
- Implementation updated:
  no
  this pass codifies the child seam boundary and adds proof against the
  existing signed-off live surface
- Known source-level risks:
  explicit close-button dismissal is source-inspected but not yet covered by a
  dedicated child browser test

## Rendered Verification

- Required viewports checked:
  desktop parent route and mobile review route
- Required direction states checked:
  RTL mobile overlay state and desktop RTL mirrored alignment covered through
  direct canonical and route-level browser proof
- Required theme states checked:
  dark-theme standalone open-state review covered through the child canonical
  route
- Required magnification states checked:
  `TPR-009` deterministic canonical route browser-checked
- Real interactive states checked:
  standalone open state
  standalone hour selection remaining open
  standalone minute completion close and focus return
  nested overlap inside `date range with time`
  composed outer-label sync after nested time change
  mobile full-screen overlay geometry
  hidden closed-state guarantee before mobile open
- Overflow or clipping checks:
  mobile full-screen overlay geometry covered; dark-theme and magnified open
  panel stress now have dedicated child-route proof
- Layering or anchoring checks:
  nested time-picker overlap inside range-with-time covered; top-level peer
  overlay exclusivity remains parent-owned
- Attachment / shell-framing checks:
  parent-owned and intentionally excluded from this child seam
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`
  `tests/visual/designSystem/canonicals/forms/timePickerCanonical.spec.ts`
  `tests/visual/designSystem/canonicals/shell/canonicalShell.spec.ts`

## Accessibility Verification

- Keyboard entry and exit:
  covered for `Escape` and minute-completion close paths
- Focus order and return focus:
  covered for standalone minute completion, nested minute completion, and
  mobile `Escape` dismissal
- Semantic structure:
  source inspected
  trigger buttons use dialog semantics and picker panels keep labelled dialog
  shells inside the parent form
- Screen-reader naming and labeling:
  source inspected
  child seams rely on parent field labels plus panel titles for naming
- Contrast or motion considerations:
  dark-theme and magnification stress browser-checked on the child render
  surface
- Localization or long-content considerations:
  RTL mobile open-state proof exists and desktop RTL alignment is now directly
  browser-checked; longer-content stress is still parent-owned for now

## State Coverage

- Default:
  source inspected
- Hover / pressed / focus:
  source inspected
- Selected / active:
  covered through hour and minute quick-pick tests
- Disabled:
  parent-owned review mode only; no child-specific disabled state today
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
  verified on the dedicated child render surface plus the signed-off parent
  host route
- Human sign-off status:
  signed off by direct child review
- Promotion decision:
  promote to signed-off child baseline; not yet `system-ready`
- Open follow-ups:
  add direct rendered proof for explicit close-button dismissal
  decide later whether `TPR-009` should move into the priority set or remain
  a secondary stress-state reference

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/time-picker-verification-checklist.md`
- Design-system route update required:
  no
  `/design-system/canonicals/time-picker` now exists and targets deterministic
  dedicated child render states honestly
- Canonical render-ready / honest-width check required:
  completed for the dedicated child launcher and render surface
- Frontend gate manifest update required:
  not yet
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  no
