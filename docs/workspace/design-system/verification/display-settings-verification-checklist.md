# Display Settings Verification Checklist

## Scope

- Artifact name:
  `display settings`
- Surface:
  `/design-system`
- Status under review:
  payload verification baseline; shell verification remains owned by
  `context-nav drawer`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/display-settings-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/display-settings-reference-pack.md`
- Related canonical launcher:
  `/design-system/canonicals/display-settings`

## Visual Contract

- One-sentence rule:
  The display-settings payload must expose real grouped display controls inside
  the signed-off `context-nav drawer`, remain readable across theme and
  magnification states, mirror natively in RTL, and preserve the approved
  `/design-system` payload density on desktop and mobile.
- Trigger for this review:
  start the payload loop after signing off the shared `context-nav drawer`
  chassis
- What changed since the last review:
  the canonical route now renders the real grouped payload instead of drawer
  placeholder copy, and the payload has its own `DSR-*` state set

## Source Verification

- Source files inspected:
  `src/frontend/designSystem/index.html`
  `src/frontend/designSystem/components/context-nav.html`
  `src/frontend/designSystem/exploration/context-nav/index.html`
  `src/frontend/designSystem/assets/app.mjs`
  `src/frontend/designSystem/assets/styles.css`
  `src/frontend/designSystem/canonicals/display-settings/index.html`
- Implementation updated:
  yes, to move the real grouped payload into the governed drawer surface and
  register `DSR-001` through `DSR-005` as first-class canonical refs
- Known source-level risks:
  persistence is still intentionally absent; the app subset is still narrower
  than the design-system review payload

## Rendered Verification

- Required viewports checked:
  desktop and mobile direct payload states
- Required direction states checked:
  LTR and RTL direct payload states
- Required theme states checked:
  base theme, dark theme, and a non-default accent state
- Required magnification states checked:
  enlarged and reduced magnification states now browser-checked directly
- Real interactive states checked:
  drawer open with grouped controls, active option changes, and mirrored RTL
  copy
- Payload-density checks:
  required; the current `/design-system` group density is the approved
  starting reference
- Screenshot or rendered evidence reference:
  executable browser checks now live in
  `tests/visual/designSystem/canonicals/shell/contextNavCanonicalFrame.spec.ts` for the
  `DSR-*` states

## Accessibility Verification

- Keyboard flow:
  browser-checked across every control group in the current payload batch
- Programmatic selected state:
  each active chip and swatch must expose state through `aria-pressed`
- Screen-reader naming and labeling:
  payload title, close control, grouped labels, and swatch labels must remain
  named
- RTL localization:
  `DSR-003` now verifies Arabic-facing payload copy and mirrored alignment
- Contrast and readability:
  `DSR-002` and `DSR-005` now verify readable controls under dark theme and
  magnification extremes

## State Coverage

- Default:
  `DSR-001`
- Hover / pressed / focus:
  required in browser review
- Selected / active:
  `DSR-001` through `DSR-005`
- Disabled:
  not applicable in the current prototype
- Loading:
  not applicable in the current prototype
- Empty:
  not applicable
- Error:
  not yet defined
- Destructive:
  not applicable

## Quality Gate Outcome

- Implementation status:
  payload route now reflects the real grouped controls rather than placeholder
  copy
- Rendered status:
  browser-checked for `DSR-001` through `DSR-005`
- Human sign-off status:
  approved
- Promotion decision:
  signed off for app adoption through the approved first-consumer subset
- Open follow-ups:
  reconcile the first app subset against this broader review payload in the
  downstream adoption contract

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/display-settings-verification-checklist.md`
- Design-system route update required:
  no
- Canonical render-ready / honest-width check required:
  satisfied through the shared hardened canonical renderer; continue using the
  dedicated `DSR-*` refs instead of falling back to drawer-shell refs
- Frontend gate manifest update required:
  not yet
- Real-app adoption now allowed:
  yes, through the approved first-consumer subset recorded in the downstream
  adoption contract
