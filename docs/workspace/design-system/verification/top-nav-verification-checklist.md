# Design System Verification Checklist

## Scope

- Artifact name:
  Navigation shell / top-nav family
- Surface:
  `/design-system`
- Status under review:
  signed-off
- Related principle artifact:
  None yet
- Related pattern artifact:
  `docs/workspace/design-system/patterns/navigation-shell-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/top-nav-shell-component.md`
- Related adoption note:
  `docs/workspace/design-system/adoption/root-admin-shell-top-nav-adoption-note.md`

## Visual Contract

- One-sentence rule:
  The application header must preserve orientation and access to primary
  destinations, account actions, and responsive navigation states without
  overlap, clipping, or ambiguous current-route feedback.
- Trigger for this review:
  Promote the signed-off `/design-system` top-nav family toward governed app
  adoption.
- What changed since the last review:
  The full canonical `top-nav` state set has now been human-reviewed, captured,
  and Playwright-locked through the dedicated preview route and canonical
  launcher.

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/index.html`
  `src/frontend/designSystem/assets/styles.css`
  `src/frontend/designSystem/assets/app.mjs`
- Implementation updated:
  no
- Known source-level risks:
  rendered verification is still required for longer labels, mobile utility
  transitions, and utility-region fit under real consumer content

## Rendered Verification

- Required viewports checked:
  covered by the canonical launcher review and Playwright visual suite
- Required direction states checked:
  covered by the canonical launcher review and Playwright visual suite
- Required theme states checked:
  covered by the canonical launcher review and Playwright visual suite
- Required magnification states checked:
  covered by the canonical launcher review and Playwright visual suite
- Overflow or clipping checks:
  covered by the canonical states and Playwright visual suite
- Layering or anchoring checks:
  covered by the canonical states and Playwright visual suite
- Screenshot or rendered evidence reference:
  human sign-off completed through `/design-system/canonicals/top-nav`; the
  full canonical snapshot set is stored under
  `tests/visual/__snapshots__/designSystem/topNav.spec.ts/`

## Prevention-Derived Checks

- Brand geometry preserved:
  must verify the brand mark keeps its proportions and that the adjacent brand
  name can yield first without distorting the mark
- Header-region separation preserved:
  must verify brand, primary navigation, and utility regions remain visually
  distinct and do not intrude on one another
- Approved mobile-threshold preserved:
  must verify desktop mode does not continue into the `1 item + More` state
- Overflow derivation preserved:
  must verify overflow contents match the runtime-hidden primary destinations
- Visual-overlap guard preserved:
  must verify the `More` control and utility region do not visually intrude on
  the remaining visible primary destinations
- Layering contract preserved:
  must verify profile and overflow menus sit above the sub-nav row
- Transient-shell contract preserved:
  must verify outside click, `Escape`, and focus-return behavior for shell
  menus
- RTL-native presentation preserved:
  must verify the shell feels native for RTL reading direction, not merely
  mirrored
- Magnification fallback preserved:
  must verify magnification prefers overflow or mobile collapse over crowding
- Long-label handling preserved:
  must verify long words in the brand name, primary destinations, profile
  trigger, and profile-menu items do not break shell geometry
- Long-label reveal preserved:
  must verify truncated shell labels use ellipses where appropriate and expose
  the full value through tooltips or equivalent lightweight reveal
- Theme compatibility preserved:
  must verify the shell remains visually correct and readable across the
  approved theme set
- Primary-colour inheritance preserved:
  must verify accent-driven shell states stay in sync with the shared primary
  colour selection
- Deterministic preview-entry preserved:
  must verify the isolated preview route can reopen signed-off states directly
  from query parameters so humans and Playwright evaluate the same conditions

## Accessibility Verification

- Keyboard entry and exit:
  source behavior inspected; rendered keyboard pass still required
- Focus order and return focus:
  source behavior inspected for transient surfaces; rendered verification still
  required
- Semantic structure:
  source structure inspected
- Screen-reader naming and labeling:
  source labels inspected
- Contrast or motion considerations:
  theme-aware source styling exists; rendered contrast review still required
- Localization or long-content considerations:
  overflow path exists; rendered long-label review still required

## State Coverage

- Default:
  source inspected
- Hover / pressed / focus:
  source inspected, rendered evidence pending
- Selected / active:
  source inspected
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
  unchanged
- Rendered status:
  fully captured and Playwright-locked for the canonical `TRP-*` set
- Human sign-off status:
  approved for `/design-system` demonstrated surface and canonical `top-nav`
  state set
- Promotion decision:
  remain signed-off
- Open follow-ups:
  run token candidacy review, then confirm utility-slot API during first real
  extraction

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/top-nav-verification-checklist.md`
- Design-system route update required:
  no
- Frontend gate manifest update required:
  not yet
- Architecture-map update required:
  not yet
- Real-app adoption now allowed:
  no

## Related Prevention Note

- `docs/workspace/design-system/top-nav-prevention-note.md`
