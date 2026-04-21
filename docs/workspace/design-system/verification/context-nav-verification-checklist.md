# Design System Verification Checklist

## Scope

- Artifact name:
  `context-nav` family
- Surface:
  `/design-system`
- Status under review:
  signed-off
- Related pattern artifact:
  `docs/workspace/design-system/patterns/context-nav-pattern.md`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/context-nav-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/context-nav-reference-pack.md`
- Related adoption contract:
  `docs/workspace/design-system/adoption/root-admin-shell-context-nav-adoption-contract.md`

## Visual Contract

- One-sentence rule:
  Section navigation must stay shell-attached, preserve distinct top and bottom
  action zones, and remain readable and governed across desktop rail, mobile
  bottom-nav, overflow, drawer, RTL, and magnification states.
- Trigger for this review:
  Promote the signed-off `/design-system` `context-nav` family toward
  system-ready adoption.
- What changed since the last review:
  The full `CNR-*` canonical set has now been browser-reviewed, user-approved,
  and reinforced with Playwright geometry and interaction checks. The same
  canonical hardening pass is now recorded across the shared design-system
  shell families, and the first real `rootAdminShell` utility-action parity
  slice now uses the signed-off context-nav drawer behavior while keeping app
  controls narrower than the design-system preview tooling.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/components/context-nav.html`
  `src/frontend/designSystem/exploration/context-nav/index.html`
  `src/frontend/designSystem/canonicals/context-nav/index.html`
  `src/frontend/designSystem/assets/styles.css`
  `src/frontend/designSystem/assets/app.mjs`
- Implementation updated:
  yes, during the canonical review loop
- Known source-level risks:
  first-consumer parity in the real root admin shell remains the next honest
  drift risk

## Rendered Verification

- Required viewports checked:
  desktop and mobile canonical widths reviewed and covered
- Required direction states checked:
  LTR and RTL reviewed and covered
- Required theme states checked:
  normal and dark-theme canonical states reviewed
- Required magnification states checked:
  magnified long-label canonical reviewed
- Overflow or clipping checks:
  tall-scroll, short-height scroll pressure, mobile `More`, and drawer lane
  anchoring reviewed
- Layering or anchoring checks:
  tooltip, `More`, and drawer geometry reviewed and covered
- Screenshot or rendered evidence reference:
  human sign-off completed through `/design-system/canonicals/context-nav`; the
  executable geometry and interaction checks live in
  `tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts`
  and the cross-family isolation posture is tracked in
  `docs/workspace/design-system/verification/canonical-host-surface-isolation-audit.md`

## Prevention-Derived Checks

- Two-zone rail grammar preserved:
  top actions remain top-growing; bottom actions remain bottom-pinned
- Scroll pressure preserved:
  tall and short-height desktop states stay in the approved scroll model
- Scrollbar alignment preserved:
  scroll-state icon sizing, divider, and alignment remain consistent
- Mobile conversion preserved:
  mobile stays a bottom bar rather than a squeezed desktop rail
- Mobile overflow preserved:
  utility actions move into a wide `More` sheet
- Drawer attachment preserved:
  mobile drawer stays attached to the bottom-bar lane
- Close-control grammar preserved:
  drawer close buttons stay square and use the governed diagonal close glyph
- Header anchoring preserved:
  rail and drawer surfaces attach to the true bottom of the combined header
  stack
- RTL desktop parity preserved:
  RTL keeps a narrow right-edge rail and desktop shell mode when width fits
- Deterministic preview-entry preserved:
  canonical URLs reopen signed-off states directly without ref-vs-state drift
- Canonical host/surface isolation preserved:
  the family now keeps theme, magnification, direction, layout width, and
  attachment math scoped to the rendered canonical surface rather than letting
  the host review page silently drive those states

## Accessibility Verification

- Keyboard entry and exit:
  covered for `More` and drawer close behavior in runtime review
- Focus order and return focus:
  covered by runtime behavior and browser checks
- Semantic structure:
  source structure inspected
- Screen-reader naming and labeling:
  source labels inspected
- Contrast or motion considerations:
  theme-aware source styling and signed-off theme review complete
- Localization or long-content considerations:
  RTL, truncation, and magnification states reviewed

## State Coverage

- Default:
  covered by `CNR-001`
- Hover / pressed / focus:
  hover tooltip covered by `CNR-003`; active and open-state controls reviewed
- Selected / active:
  covered across rail and bottom-nav states
- Disabled:
  not applicable in current prototype
- Loading:
  not applicable in current prototype
- Empty:
  not applicable in current prototype
- Error:
  not yet defined for real consumer data
- Denied / restricted:
  not yet defined for real consumer permissions
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  aligned with the signed-off canonical family
- Rendered status:
  browser-reviewed and Playwright-locked for the key geometry and interaction
  seams
- Human sign-off status:
  approved for the `/design-system` demonstrated surface and canonical `CNR-*`
  set
- Promotion decision:
  ready for `system-ready`
- Open follow-ups:
  extend the same governed family into another real shell consumer once this
  root-admin utility slice has user sign-off

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/context-nav-verification-checklist.md`
- Design-system route update required:
  no
- Frontend gate manifest update required:
  not yet
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  only through the governed first-consumer adoption contract
