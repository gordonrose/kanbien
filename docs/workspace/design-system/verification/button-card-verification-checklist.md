# ButtonCard Verification Checklist

## Scope

- Artifact name: `ButtonCard`
- Surface: `/design-system/tokens/button-card`
- Status under review: `system-ready`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/button-card-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/button-card-reference-pack.md`
- Related component artifact:
  `docs/workspace/design-system/components/button-card-component.md`
- Related adoption note:
  `docs/workspace/design-system/adoption/button-card-adoption-contract.md`

## Visual Contract

- One-sentence rule: ButtonCard is a compact full-surface button with a
  centered icon circle and label, composed from signed-off container, section,
  typography, tooltip, and semantic state tokens.
- Trigger for this review: creation of the icon/label sibling seam to
  IndexCard.
- What changed since the last review: `/design-system/tokens/button-card` is
  promoted into the reusable `buttonCard.mjs` render/hydrate seam with route
  coverage, direct seam coverage, focused visual coverage, and artifact chain.

## Source Verification

- Source files inspected:
  - `src/frontend/designSystem/tokens/button-card/index.html`
  - `src/frontend/designSystem/tokens/index.html`
  - `src/frontend/designSystem/assets/buttonCard.mjs`
  - `src/frontend/designSystem/assets/styles.css`
  - `src/frontend/designSystem/assets/app.mjs`
  - `src/frontend/designSystem/assets/sourceDrawer.mjs`
  - `src/frontend/designSystem/router.ts`
  - `tests/unit/designSystem/buttonCardSeam.test.ts`
- Implementation updated: yes.
- Known source-level risks: none beyond first-consumer parity requirements.

## Rendered Verification

- Required viewports checked: desktop route test and focused Playwright
  canonical tests cover the token route; mobile specimen is covered by the
  focused visual test.
- Required direction states checked: RTL specimen covered by focused visual
  test.
- Required theme states checked: normal, dark, and desert specimens covered by
  focused visual test.
- Required magnification states checked: -50%, 0%, and +100% specimens covered
  by focused visual test.
- Real interactive states checked: hover, active, selected, disabled, warning,
  and error states covered by focused visual test.
- Overflow or clipping checks: constrained label overflow and tooltip data
  covered by focused visual test.
- Layering or anchoring checks: tooltip target data is covered at token route
  level; app wrappers require first-consumer parity.
- Attachment / shell-framing checks: route tests verify design-system shell and
  source drawer availability.
- Initial render performance check: route renders from lightweight static HTML
  and shared module hydration.
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/data-display/buttonCardToken.spec.ts`.
- Direct reusable seam evidence reference:
  `tests/unit/designSystem/buttonCardSeam.test.ts`.

## Accessibility Verification

- Keyboard entry and exit: native button semantics remain available.
- Focus order and return focus: ButtonCard is a single focus target; parent
  surfaces own any focus-return behavior.
- Semantic structure: generated element is a button with an accessible name.
- Screen-reader naming and labeling: `aria-label` may be supplied; otherwise
  label/state produce the accessible name.
- Contrast or motion considerations: colour and typography are inherited from
  signed-off primitive tokens; no motion is introduced.
- Localization or long-content considerations: label text ellipsizes and
  exposes tooltip data.
- Browser-native affordance coexistence considerations: disabled state uses the
  native disabled button attribute.

## State Coverage

- Default: covered.
- Hover / pressed / focus: hover/focus-compatible emphasis and active state
  covered.
- Selected / active: covered.
- Disabled: covered.
- Loading: not part of this seam.
- Empty: parent surfaces own empty-state messaging.
- Error: semantic error state covered.
- Denied / restricted: not part of this seam.
- Destructive: not part of this seam.

## Quality Gate Outcome

- Implementation status: system-ready.
- Rendered status: verified by focused route and Playwright coverage.
- Human sign-off status: approved for reusable design-system seam promotion in
  the current ButtonCard iteration.
- Promotion decision: promote to reusable design-system seam.
- Open follow-ups: first app consumer must prove parity in its real wrapper and
  must not add app-page CSS for this seam.

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/button-card-verification-checklist.md`
- Design-system route update required: complete.
- Canonical render-ready / honest-width check required: covered by token-route
  canonical exception until this becomes a generated canonical family.
- Frontend gate manifest update required: no.
- Architecture-map update required: no.
- Real-app adoption now allowed: yes, through the adoption contract and
  first-consumer parity proof.
