# Context-Nav Drawer Verification Checklist

## Scope

- Artifact name:
  `context-nav drawer`
- Surface:
  `/design-system`
- Status under review:
  signed-off shell-family verification baseline
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/context-nav-drawer-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/context-nav-drawer-reference-pack.md`
- Related canonical launcher:
  `/design-system/canonicals/context-nav-drawer`

## Visual Contract

- One-sentence rule:
  The context-nav drawer must launch from governed `context-nav`, overlay
  page content as a shell-attached drawer on desktop and a bottom-attached
  sheet on mobile, and remain keyboard-accessible and WCAG 2.2 AA-readable
  across the approved review states.
- Trigger for this review:
  continue the design-system loop after approving the dedicated
  context-nav-drawer behavior lock and canonical set
- What changed since the last review:
  the `CDR-*` states were wired into the context-nav canonical renderer, and
  the full `CDR-001` through `CDR-006` drawer-family set now has direct
  browser-backed checks instead of relying only on inherited `context-nav`
  references

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/components/context-nav.html`
  `src/frontend/designSystem/assets/app.mjs`
  `src/frontend/designSystem/assets/styles.css`
  `src/frontend/designSystem/canonicals/context-nav-drawer/index.html`
- Implementation updated:
  yes, to register `CDR-001` through `CDR-006` as first-class canonical
  states in the shared renderer
- Known source-level risks:
  no additional source-only risks discovered in this pass; remaining risks are
  primarily human sign-off and keyboard/focus-flow depth

## Rendered Verification

- Required viewports checked:
  desktop and mobile direct drawer states covered
- Required direction states checked:
  LTR and RTL direct drawer states covered for the highest-risk review set
- Required theme states checked:
  base theme, dark theme, and alternate-theme drawer states covered directly
- Required magnification states checked:
  targeted magnification states are now directly browser-checked
- Real interactive states checked:
  open drawer on desktop, mirrored open drawer in RTL, and mobile open drawer
  attached above the bottom bar
- Overlay or layout-competition checks:
  desktop `CDR-001` now proves the drawer opens as an overlay side panel that
  intrudes into the content area instead of reflowing the page width
- Layering or anchoring checks:
  RTL right-edge attachment and mobile bottom-bar attachment are covered
- Attachment / shell-framing checks:
  direct drawer-family checks now confirm attachment to the governed shell
  seam rather than a detached panel treatment
- Alignment or shared-gutter checks:
  desktop overlay and mobile lane attachment covered in direct browser checks
- Screenshot or rendered evidence reference:
  executable browser checks now live in
  `tests/visual/designSystem/contextNavCanonicalFrame.spec.ts` for
  `CDR-001` through `CDR-006`

## Accessibility Verification

- Keyboard entry and exit:
  directly browser-checked: keyboard launcher entry moves focus to the drawer
  close control, and `Escape` closes the drawer and returns focus to the
  launcher
- Focus order and return focus:
  directly browser-checked for `Escape` close and outside-click close return
  to the launcher
- Semantic structure:
  labelled drawer region, title, and named close control inspected in source
- Screen-reader naming and labeling:
  source labels inspected
- Contrast or motion considerations:
  WCAG-sensitive theme and magnification states are now directly browser
  checked through `CDR-005` and `CDR-006`; this pass also tightened the drawer
  surface to an opaque panel so underlying content no longer ghosts through
- Localization or long-content considerations:
  RTL attachment is now directly browser-checked through `CDR-002`; longer
  labels are now directly verified through `CDR-006`
- Browser-native affordance coexistence considerations:
  no native affordance should obscure the close control or governed focus
  states; still needs direct drawer-family review under the WCAG-sensitive
  states

## State Coverage

- Default:
  covered indirectly by the broader `context-nav` baseline but not a primary
  drawer-family sign-off state
- Hover / pressed / focus:
  close-control grammar is covered; direct focus-visibility review remains
  pending
- Selected / active:
  open launcher and open drawer states covered directly by `CDR-001`,
  `CDR-002`, and `CDR-003`
- Disabled:
  not applicable in the current prototype
- Loading:
  not applicable in the current prototype
- Empty:
  guidance-only drawer content covered
- Error:
  not yet defined
- Denied / restricted:
  not yet defined
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  aligned with the dedicated `CDR-*` canonical state system for the first
  direct drawer-family review batch
- Rendered status:
  browser-checked for `CDR-001` through `CDR-006`
- Human sign-off status:
  approved for the shared drawer chassis
- Promotion decision:
  complete for the shared `context-nav drawer` shell family; start any future
  display-settings or filters work as separate payload loops on top of this
  chassis
- Open follow-ups:
  run payload-specific loops for display settings and future sibling
  drawers without reopening the signed-off shell contract unless a real
  behavior change is proposed

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/context-nav-drawer-verification-checklist.md`
- Design-system route update required:
  no
- Canonical render-ready / honest-width check required:
  satisfied for the current `CDR-*` renderer seam; continue using dedicated
  `CDR-*` refs instead of falling back to indirect `CNR-*` matches
- Frontend gate manifest update required:
  not yet
- Architecture-map update required:
  no
- Real-app adoption now allowed:
  the shell family is signed off, but each payload-specific consumer still
  needs its own honest downstream loop
