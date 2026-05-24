# Token Foundation Seams Verification Checklist

## Scope

- Artifact name: `TokenFoundationSeams`
- Surface: `/design-system/tokens/*`
- Status under review: `system-ready`
- Related behavior lock:
  `docs/workspace/design-system/behavior-locks/token-foundation-seams-behavior-lock.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/token-foundation-seams-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/token-foundation-seams-component.md`
- Related adoption note:
  `docs/workspace/design-system/adoption/token-foundation-seams-adoption-contract.md`

## Visual Contract

- One-sentence rule: signed-off token routes are reusable foundation seams only
  when future consumers preserve the route-approved visual token, structure,
  responsive, accessibility, and display-setting behavior.
- Trigger for this review: user sign-off for the listed token routes on
  `localhost:3000`.
- What changed since the last review: token routes are now promoted from
  demonstration surfaces into reusable design-system seam candidates.

## Source Verification

- Source files inspected:
  - `src/frontend/designSystem/tokens/*/index.html`
  - `src/frontend/designSystem/assets/styles.css`
  - `src/frontend/designSystem/assets/app.mjs`
  - `src/frontend/designSystem/assets/sourceDrawer.mjs`
  - `src/frontend/designSystem/assets/foundationStructure.mjs`
  - `src/frontend/designSystem/assets/entityRecordStructure.mjs`
  - `src/frontend/designSystem/assets/filterPanelStructure.mjs`
  - `src/frontend/designSystem/assets/tokenParagraphModel.mjs`
  - `src/frontend/designSystem/assets/tokenHeaderModel.mjs`
- Implementation updated: no source implementation change is required for this
  promotion pass.
- Known source-level risks: several token route files are still new in the
  current worktree; commit scope should keep them together with this promotion
  artifact set.

## Rendered Verification

- Required viewports checked: token routes are signed off by user review on the
  local browser; executable filter-panel checks cover desktop, mobile, and
  short viewport behavior.
- Required direction states checked: shell and supported structure direction
  are governed by shared design-system display controls; future consumers must
  run parity checks before adoption.
- Required theme states checked: token routes expose normal, dark, and desert
  states where supported by the family.
- Required magnification states checked: token routes inherit shared
  design-system magnification controls; future consumers must verify no
  production wrapper overlap.
- Real interactive states checked: filter panel card count, structure display
  settings, entity resize handles, icon-button hover/focus, and tooltip
  trigger states are represented by the route/test set.
- Overflow or clipping checks: filter panel scroll-stack behavior is covered by
  visual tests; other families require first-consumer parity when embedded in
  app wrappers.
- Layering or anchoring checks: tooltip and filter panel layering are approved
  at token-route level only.
- Attachment / shell-framing checks: route tests and page-shell visual tests
  cover design-system shell framing.
- Initial render performance check: routes render lightweight review surfaces;
  no hidden app workspaces are approved by this promotion.
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/data-display/filterPanelStructure.spec.ts`.

## Accessibility Verification

- Keyboard entry and exit: required for icon buttons, tooltip triggers,
  display controls, and resize handles where applicable.
- Focus order and return focus: governed at route level; first app consumers
  must verify wrapper-specific focus flow.
- Semantic structure: review regions use explicit labels without app domain
  semantics.
- Screen-reader naming and labeling: icon-only controls and resize handles must
  preserve accessible names.
- Contrast or motion considerations: semantic colour and typography routes are
  source of truth for tokenized contrast review; no motion seam is introduced.
- Localization or long-content considerations: typography and tooltip seams
  require truncation/overflow checks in first app consumers.
- Browser-native affordance coexistence considerations: not applicable to this
  token batch except future search or form consumers.

## State Coverage

- Default: covered.
- Hover / pressed / focus: covered for interactive token routes.
- Selected / active: covered for display setting options.
- Disabled: not a shared state in this token batch unless a future consumer
  introduces it.
- Loading: not applicable.
- Empty: structural routes intentionally use empty structural placeholders.
- Error: semantic colour and paragraph status variants covered where present.
- Denied / restricted: not applicable.
- Destructive: not applicable.

## Quality Gate Outcome

- Implementation status: unchanged.
- Rendered status: verified by user sign-off and targeted route/test coverage;
  additional generated canonical pages are deferred by explicit exception.
- Human sign-off status: approved for the listed token routes.
- Promotion decision: promote to `system-ready` as reusable token foundation
  seams.
- Open follow-ups: add generated canonical render pages for any token family
  that becomes a high-change component seam; capture first-consumer parity
  before app adoption is called complete.

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/token-foundation-seams-verification-checklist.md`
- Design-system route update required: no.
- Canonical render-ready / honest-width check required: deferred by
  `token-foundation-seams-canonical-rendering-exception.md`.
- Frontend gate manifest update required: no.
- Architecture-map update required: no.
- Real-app adoption now allowed: yes, only through the adoption contract and
  first-consumer parity proof.
