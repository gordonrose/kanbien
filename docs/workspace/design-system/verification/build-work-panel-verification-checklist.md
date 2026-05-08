# Build Work Panel Verification Checklist

## Scope

- Artifact name:
  `build-work-panel`
- Surface:
  signed-off `/design-system/patterns/build-work-panel-demo` pattern surface
  and `/design-system/canonical-renderings/build-work-panel/*` canonical states
- Status under review:
  canonical-created; Playwright canonical coverage added
- Related principle artifact:
  `docs/workspace/design-system/behavior-locks/build-work-panel-behavior-lock.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/build-work-panel-pattern.md`
- Related component artifact:
  not created
- Related adoption note:
  `docs/workspace/design-system/adoption/root-admin-build-work-panel-adoption-contract.md`

## Visual Contract

- One-sentence rule:
  The Build work panel is a governed shell-attached work surface that stays
  reachable across pages, collapses to a mobile floating action, opens only the
  Build chat for MVP, and treats page/module/role context as helpful prompt
  text rather than authority.
- Trigger for this review:
  Chat interface for Layer 1 Product Discovery needs design-system signoff
  before root-admin app UI implementation.
- What changed since the last review:
  The review surface now exists, has user signoff for the MVP direction, and
  has rendered smoke evidence for dark theme, RTL controls, high
  magnification, the right-side icon toolbar, conversation history, composer
  menu, message actions, and packet download journey.

## Source Verification

- Source files inspected:
  Product Discovery, Technical Steering, Story Breakdown, generated PDF asset
  decision, drawer behavior lock, drawer pattern.
- Implementation updated:
  yes, inside `/design-system` review-only source.
- Known source-level risks:
  Shared `conversationPanel` render/controller/style seams, canonical
  launcher, and generated canonical render routes now exist. App adoption still
  needs first-consumer parity proof.

## Rendered Verification

- Required viewports checked:
  desktop review surface, mobile collapsed/open behavior during iteration,
  responsive CSS breakpoints, and dedicated mobile canonical states
  `BWP-R-008`, `BWP-R-009`, `BWP-R-019`, and `BWP-R-020`.
- Required direction states checked:
  LTR and RTL through the review surface display settings drawer and
  `BWP-R-010` Playwright coverage.
- Required theme states checked:
  normal and dark through rendered smoke checks and Playwright coverage for
  dark stress states `BWP-R-011` and `BWP-R-020`; desert preview state exists.
- Required magnification states checked:
  baseline, 115%, and 135% through the review surface display settings drawer.
- Real interactive states checked:
  open panel, close panel, Build toggle collapse/open, right-side icon toolbar,
  conversation-history expand/collapse, conversation selection, typed message,
  expandable composer tools menu, copy/edit/reply message actions, packet
  available, packet preparing, completed packet history event, repeat-download
  action, and mobile floating action.
- Overflow or clipping checks:
  transcript scroll, long conversation titles, long page/module/role names,
  long packet title, composer reachability.
- Layering or anchoring checks:
  right-side desktop attachment, mobile floating launcher, mobile panel,
  top-nav/context-nav/bottom-nav overlap.
- Attachment / shell-framing checks:
  must prove shell-owned attachment rather than page-local panel placement.
- Alignment or shared-gutter checks:
  align to shell gutters and avoid content reflow.
- Screenshot or rendered evidence reference:
  `tests/visual/designSystem/canonicals/shell/buildWorkPanel.spec.ts`
  verifies launcher links, `BWP-R-001` through `BWP-R-020`, geometry,
  horizontal overflow, mobile framing, target sizes, accessible names, visible
  text contrast, tools-menu close/focus behavior, composer growth, completed
  download history, RTL, dark mobile preparing state, edit state, and reply
  state.

## Accessibility Verification

- Keyboard entry and exit:
  Playwright verifies the composer tools menu closes on `Escape`, returns focus
  to the trigger, reopens, and closes on outside click.
- Focus order and return focus:
  verified for the tools menu transient surface; full end-to-end keyboard walk
  remains a later app-adoption proof.
- Semantic structure:
  partially verified through named regions, button names, textbox labels, menu
  role, and menuitem names.
- Screen-reader naming and labeling:
  Playwright verifies visible controls expose accessible names and no visible
  control falls below the 24px minimum target-size smoke threshold.
- Contrast or motion considerations:
  visible text contrast smoke passes across `BWP-R-001` through `BWP-R-020`.
  Formal WCAG audit and axe automation remain pending.
- Localization or long-content considerations:
  RTL, high-magnification, long typed input, long mobile content, and dark
  mobile preparing states are covered by canonicals and Playwright checks.
- Browser-native affordance coexistence considerations:
  not verified.

## State Coverage

- Default:
  review surface verified.
- Hover / pressed / focus:
  planned; not verified.
- Selected / active:
  Build active verified in review surface.
- Disabled:
  Reporting and Support inactive icon toolbar actions verified in review
  surface.
- Loading:
  packet preparation journey verified; chat response loading state still
  pending.
- Empty:
  quiet harness opening message verified in review surface.
- Error:
  failed response and failed generation pending canonical state proof.
- Denied / restricted:
  pending canonical state proof.
- Destructive:
  not applicable for MVP.

## Quality Gate Outcome

- Implementation status:
  review surface and canonical render seam implemented
- Rendered status:
  Playwright verified for current signed-off canonical set
- Human sign-off status:
  signed off for the current design-system pattern direction
- Promotion decision:
  promote to canonical-created design-system family; root-admin adoption now
  consumes the shared seam with protected harness chat APIs
- Open follow-ups:
  Add formal axe/WCAG automation if the repo adopts an accessibility scanner;
  keep Reporting and Support inactive until product flows are approved.

## Traceability And Sync

- Workspace artifact location:
  `docs/workspace/design-system/verification/build-work-panel-verification-checklist.md`
- Design-system route update required:
  yes
- Canonical render-ready / honest-width check required:
  yes
- Frontend gate manifest update required:
  no separate manifest exists for this family yet; Playwright coverage now
  lives in `tests/visual/designSystem/canonicals/shell/buildWorkPanel.spec.ts`.
- Architecture-map update required:
  yes, when the family is promoted beyond draft.
- Real-app adoption now allowed:
  root-admin adoption: yes; real harness/API behavior: yes

## Consumable Seam Guard

- Shared render/controller API:
  `renderConversationPanel`, `createConversationPanelController`, and
  `createBuildConversationPanelConfig`.
- Required app-adoption posture:
  root-admin must pass Build mode as configuration and handlers, not copy
  markup, data hooks, classes, controller behavior, or app-local CSS.
- Root-admin parity coverage:
  `tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts` verifies
  desktop shared-seam adoption, local send/download handler behavior, no page
  reflow, and mobile close/floating-action recovery.
- Required handler coverage before app parity signoff:
  send message, mode select, panel/history/tools open changes, packet download,
  copy message, edit message, reply to message, and composer tool actions.
