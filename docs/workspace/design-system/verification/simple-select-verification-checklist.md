# Design System Verification Checklist

## Scope

- Artifact name:
  `Simple Select`
- Surface:
  `/design-system/components/simple-select`
- Status under review:
  signed-off child baseline
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/simple-select-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/simple-select-reference-pack.md`
- Related canonical launcher:
  `/design-system/canonicals/simple-select`
- Related canonical render surface:
  `/design-system/components/simple-select`
- Related parent behavior lock:
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
- Related parent reference pack:
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`

## Visual Contract

- One-sentence rule:
  A `Simple Select` must stay a lightweight anchored listbox that opens from
  its trigger, moves focus into the option list, supports up/down arrow
  traversal, closes honestly, and returns focus to the trigger only on owned
  close paths.
- Trigger for this review:
  start the child-seam loop for the simple dropdown extracted from the
  signed-off `Form Template` parent family
- What changed since the last review:
  the parent form-template docs no longer carry this seam only implicitly;
  the child seam now has its own behavior lock, reference pack, dedicated
  canonical launcher, and focused Playwright proof against the live host route

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/components/simple-select.html`
  `src/frontend/designSystem/assets/simpleSelectCanonical.mjs`
  `src/frontend/designSystem/templates/form/index.html`
  `src/frontend/designSystem/assets/app.mjs`
  `src/frontend/designSystem/assets/styles.css`
  `tests/visual/designSystem/simpleSelect.spec.ts`
  `tests/visual/designSystem/simpleSelectCanonical.spec.ts`
- Implementation updated:
  yes
  the current pass now aligns the seam to the locked keyboard model by moving
  focus into the open option list and supporting up/down arrow traversal
- Known source-level risks:
  the child seam now has a dedicated launcher and render surface; host-route
  parity still matters because the canonical render inherits behavior from the
  same shared select runtime used by the parent form

## Rendered Verification

- Required viewports checked:
  dedicated child render surface reviewed at a stable component lane width,
  with host-route behavior proof still retained
- Required direction states checked:
  RTL host-route proof added for open/close behavior
- Required theme states checked:
  dark-theme host-route proof added for open/close behavior
- Required magnification states checked:
  not yet required
  the current child seam has no unique magnification-specific geometry beyond
  the parent field row, so this remains parent-owned for now
- Overflow or clipping checks:
  anchored open-state geometry is now checked against the live trigger/listbox
  boxes on the host route
- Layering or anchoring checks:
  child seam verified as an anchored listbox only; scrim, drawer, and modal
  layering remain intentionally out of scope
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/simpleSelect.spec.ts`
  `tests/visual/designSystem/simpleSelectCanonical.spec.ts`

## Accessibility Verification

- Keyboard entry and exit:
  covered by executable proof for trigger open, focus handoff into the option
  list, up/down arrow traversal, `Escape` dismissal, and owned selection close
- Focus order and return focus:
  covered by executable proof for open-state option focus, owned close
  returning to the trigger, and outside-click dismissal preserving focus on
  the outside target
- Semantic structure:
  source inspected
  trigger uses `aria-haspopup="listbox"` and list options expose
  `role="option"` plus `aria-selected`
- Screen-reader naming and labeling:
  source inspected
  the parent field label names both trigger and listbox via `aria-labelledby`
- Contrast or motion considerations:
  dark-theme behavior was runtime-probed; no child-specific motion behavior
  applies
- Localization or long-content considerations:
  RTL behavior was runtime-probed; long-content handling remains minimal
  because current option labels are short and the parent field width owns
  broader wrapping pressure

## State Coverage

- Default:
  covered through host-route proof
- Hover / pressed / focus:
  partially covered
  focus handoff, arrow traversal, and focus return are proved; hover visuals
  remain source-inspected
- Selected / active:
  covered through host-route proof
- Disabled:
  covered through host-route proof
- Loading:
  not applicable
- Empty:
  not applicable
- Error:
  not child-owned
  error visibility belongs to the parent field framing, not the listbox
- Denied / restricted:
  not applicable
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  unchanged
- Rendered status:
  verified on the live host route for the child seam’s highest-risk states
- Human sign-off status:
  ready for direct child canonical review
- Promotion decision:
  promote to signed-off child baseline with dedicated launcher and dedicated
  canonical render surface
- Open follow-ups:
  review the dedicated `SSR-*` launcher set directly for sign-off
  decide later whether this seam also needs a broader catalog/documentation
  surface under `/design-system/components`
  keep drawer-select, date-picker, and time-picker extraction boundaries
  separate so this seam does not absorb broader overlay behavior

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/simple-select-verification-checklist.md`
- Design-system route update required:
  no
  `/design-system/canonicals/simple-select` and
  `/design-system/components/simple-select` now exist and target deterministic
  child states honestly
- Canonical render-ready / honest-width check required:
  completed for the dedicated child render surface
- Frontend gate manifest update required:
  no
- Architecture-map update required:
  no
- Real-app adoption now allowed:
  no
