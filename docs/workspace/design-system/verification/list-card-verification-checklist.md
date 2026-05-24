# ListCard Verification Checklist

## Scope

- Artifact name: `ListCard`
- Surface: `/design-system/tokens/list-card`
- Status under review: `system-ready`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/list-card-behavior-lock.md`
- Related reference pack:
  `docs/workspace/design-system/reference-packs/list-card-reference-pack.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-card-component.md`
- Related adoption note:
  `docs/workspace/design-system/adoption/list-card-adoption-contract.md`

## Visual Contract

- One-sentence rule: ListCard is a full-row button with stacked title/subtitle
  copy and a trailing status, composed from signed-off colour, container,
  typography, tooltip, and semantic state primitives.
- Trigger for this review: user accepted the rendered `/design-system/tokens`
  ListCard token and requested design-system seam readiness.
- What changed since the last review: the former `list-container` demo was
  renamed and promoted to `list-card`; the compact count card remains
  `index-card`.

## Source Verification

- Source files inspected:
  - `src/frontend/designSystem/tokens/list-card/index.html`
  - `src/frontend/designSystem/tokens/index.html`
  - `src/frontend/designSystem/assets/listCard.mjs`
  - `src/frontend/designSystem/assets/styles.css`
  - `src/frontend/designSystem/assets/app.mjs`
  - `src/frontend/designSystem/assets/sourceDrawer.mjs`
  - `src/frontend/designSystem/router.ts`
- Implementation updated: yes.
- Known source-level risks: first real-app consumer still needs parity proof in
  its actual wrapper.

## Rendered Verification

- Required viewports checked: desktop token route and mobile specimen covered
  by focused Playwright test.
- Required direction states checked: RTL specimen covered by focused
  Playwright test.
- Required theme states checked: normal, dark, and desert specimens covered by
  focused Playwright test.
- Real interactive states checked: hover, selected, disabled, warning, and
  error states covered by focused Playwright test.
- Overflow or clipping checks: constrained title/subtitle/status overflow and
  tooltip data covered by focused Playwright test.
- Layering or anchoring checks: tooltip target data is covered at token route
  level; app wrappers require first-consumer parity.
- Attachment / shell-framing checks: route tests verify design-system shell and
  source drawer availability.
- Initial render performance check: route renders from lightweight static HTML
  and shared module hydration.
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/data-display/listCardToken.spec.ts`.

## Accessibility Verification

- Keyboard entry and exit: native button semantics remain available.
- Focus order and return focus: ListCard is a single focus target; parent
  surfaces own any focus-return behavior.
- Semantic structure: generated element is a button with an accessible name.
- Screen-reader naming and labeling: `aria-label` may be supplied; otherwise
  title/subtitle/status/state produce the accessible name.
- Contrast or motion considerations: colour and typography are inherited from
  signed-off primitives; no motion is introduced.
- Localization or long-content considerations: title, subtitle, and status text
  ellipsize and expose tooltip data.
- Browser-native affordance coexistence considerations: disabled state uses the
  native disabled button attribute.

## State Coverage

- Default: covered.
- Hover / focus: neutral primitive emphasis covered.
- Selected: covered, with `aria-pressed`.
- Disabled: covered.
- Loading: not part of this seam.
- Empty: parent surfaces own empty-state messaging.
- Warning: semantic warning state covered.
- Error: semantic error state covered.
- Denied / restricted: not part of this seam.
- Destructive: not part of this seam.

## Quality Gate Outcome

- Implementation status: system-ready.
- Rendered status: verified by focused route and Playwright coverage.
- Human sign-off status: accepted by user in-session.
- Promotion decision: promote to reusable design-system seam.
- Open follow-ups: first app consumer must prove parity in its real wrapper and
  must not add app-page CSS for this seam.

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/list-card-verification-checklist.md`
- Design-system route update required: complete.
- Canonical render-ready / honest-width check required: covered by token-route
  canonical exception until this becomes a generated canonical family.
- Frontend gate manifest update required: no.
- Architecture-map update required: no.
- Real-app adoption now allowed: yes, through the adoption contract and
  first-consumer parity proof.
