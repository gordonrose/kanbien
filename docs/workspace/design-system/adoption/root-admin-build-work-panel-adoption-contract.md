# Root Admin Build Work Panel Adoption Contract

## Scope

- Component or pattern family:
  `build-work-panel`
- Status:
  UI-only app adoption proved with temporary local handlers; real harness/API
  integration deferred
- First consumer surface:
  root-admin shell
- Route or shell owner:
  root-admin
- Source pattern artifact:
  `docs/workspace/design-system/patterns/build-work-panel-pattern.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/build-work-panel-reference-pack.md`
- Source verification checklist:
  `docs/workspace/design-system/verification/build-work-panel-verification-checklist.md`

## Purpose

- What business or workflow need is this adoption serving?
  Root builders need to start Layer 1 Product Discovery from inside root admin,
  preserve discovery history, and download a Product Discovery packet PDF.
- Why is this the right first consumer?
  The MVP is explicitly root-admin only.
- Why is adoption happening now instead of remaining design-system-only?
  Root-admin now proves the first governed consumer can use the shared
  `conversationPanel` seam without copied markup, copied CSS, or local panel
  behavior. Real Layer 1/harness integration remains a separate slice.

## Capability And Workflow Mapping

- Capability source:
  feature loop
- Primary actor:
  root builder
- Permission or capability rules:
  to be named in the PRD, capability matrix, API contract, and permission
  mapping. UI context does not grant authority.
- Route ownership:
  root-admin shell; exact route integration deferred.
- Workflow states in scope:
  panel launcher, inactive Reporting/Support actions, active Build chat,
  contextual starters, visible history, packet generated/download available,
  failed generation, denied access.
- Workflow states explicitly deferred:
  active Reporting flow, active Support flow, tenant-builder rollout, in-app
  build task creation, public packet delivery, inline PDF preview.

## Pattern Mapping

- Signed-off pattern being adopted:
  `build-work-panel` pattern direction signed off on
  `/design-system/patterns/build-work-panel-demo`.
- Required behavior-lock IDs:
  `BWP-*`
- Required canonical reference states:
  `BWP-R-001` through `BWP-R-020`, or approved replacements.
- Which parts of the pattern are mandatory for parity?
  launcher, panel attachment, action list, inactive actions, Build chat,
  visible history, composer tools menu, message copy/edit/reply actions, packet
  status/download affordance, denied state, mobile launcher, close/focus
  behavior, RTL and magnification support.
- Which parts are intentionally deferred in this first consumer?
  active Reporting/Support payloads, tenant-builder UI, stored rendered PDF
  assets, public delivery, inline PDF preview.

## Governed Adoption Preflight

- Exact signed-off source route or render surface:
  `/design-system/patterns/build-work-panel-demo` and
  `/design-system/canonical-renderings/build-work-panel/BWP-R-002`.
- Exact reference pack or canonical source:
  signed-off reference direction and generated canonical routes exist.
- Shared CSS seam:
  `/design-system/assets/conversationPanel.css`.
- Shared render seam:
  `/design-system/assets/conversationPanel.mjs`.
- Shared controller seam:
  `/design-system/assets/conversationPanel.mjs`.
- Shared configuration seam:
  `createBuildConversationPanelConfig(overrides)`.
- Required handler seam:
  `createConversationPanelController(root, { config, handlers })`, with
  handlers for send, mode selection, open-state changes, packet download,
  copy/edit/reply message actions, and composer tool actions.
- Family-owned visible regions:
  launcher, panel surface, action list, Build chat anatomy, conversation
  history, transcript, composer, packet status/action, close control.
- Host-owned visible regions:
  root-admin page content behind the panel, route/module labels supplied as
  context, authenticated user/role display source.
- Approved intentional deviations before implementation:
  none.
- Shared-entrypoint parity expectation:
  root-admin must consume the neutral `/design-system/assets/conversationPanel.mjs`
  render/controller seam directly, not the Build-specific compatibility
  wrapper. The Build configuration may be supplied as consumer data, but
  renderer structure, ARIA/data hooks, class names, and interaction behavior
  remain design-system-owned.
- Stop condition if a required seam is missing:
  Do not implement root-admin app UI by copying design-system markup, controller
  behavior, or CSS. Return to the design-system loop or seek an explicit
  exception.

## Consumer Contract

- Primary destinations:
  root-admin shell panel, no new durable route required for MVP.
- Utility actions:
  Reporting inactive, Support inactive, Build active.
- Profile or preference actions:
  not applicable.
- Loading / empty / denied states:
  must match signed-off design-system states once they exist.
- Error or degraded states:
  failed chat response, failed packet generation, unavailable harness, denied
  history/download.
- Localization / long-label expectations:
  long page/module/role names and long packet titles must wrap without overlap.

## Consumer Framing

- Is this shell chrome or page content?
  shell chrome.
- Attached to adjacent chrome or intentionally floating?
  desktop shell-attached; mobile floating launcher opening governed panel.
- Full-width or intentionally contained?
  contained on desktop; mobile panel may be full-width or lane-based after
  rendered review.
- Shared gutter / alignment expectations:
  align to shell gutters and avoid page reflow.
- Elements that must align across rows:
  action list controls, history rows, message rows, composer, packet action
  row.
- Browser-native controls or affordances that must coexist with custom UI:
  chat textarea/input editing affordances, focus outlines, browser text
  selection.

## Parity Rules

- Must match reference pack:
  all signed-off `BWP-R-*` states once created.
- May differ intentionally:
  root-admin may omit design-system preview controls.
- Must not drift:
  action availability, inactive-action posture, starter optionality, context
  not authority, packet download posture, close/focus behavior, mobile launcher.
- What would count as false confidence here?
  shared CSS only, copied markup, happy-path chat state only, missing denied
  state, mock packet download that does not match the asset decision.
- Required parity evidence:
  browser screenshots and source checks proving root-admin consumes shared
  render/controller/style seams.
- Required real interactive parity states:
  open/close, focus return, starter selection, typed chat, generated packet,
  failed generation, denied state, mobile launch.
- Required consumer-level shell-parity evidence:
  root-admin desktop and mobile browser scenarios after app adoption.
- Required human-visible regression guards:
  visual or browser tests for the high-risk `BWP-R-*` state set.

## Adoption Boundary

- What existing local UI is being replaced?
  none in MVP; root-admin adds a new UI-only governed shell consumer.
- What backend seams or APIs must remain untouched?
  design-system adoption must not invent backend API contracts or permissions.
- What page-local behavior is allowed for the POC?
  none until an explicit exception is approved.
- What is explicitly out of scope?
  active Reporting/Support flows, tenant-builder active UI, public packet
  delivery, stored rendered PDFs, app-page CSS, copied controller logic.

## Verification

- Required rendered checks:
  signed-off design-system states plus root-admin parity states.
- Required executable tests:
  design-system visual/browser checks, `check:governed-ui-adoption`,
  `check:governed-root-admin-ui`, root-admin adoption source guard, and
  root-admin browser scenarios after implementation.
- Required manual sign-off steps:
  first-consumer UI parity review using the neutral `conversationPanel` seams;
  real harness integration requires a later review.
- Required consumer-level route proof:
  root-admin shell after implementation only.
- Required shared-entrypoint parity proof:
  root-admin source must import `/design-system/assets/conversationPanel.mjs`
  and use `renderConversationPanel` plus
  `createConversationPanelController` with a Build config and explicit
  handlers; app-local Build panel classes, data hooks, controller copies, and
  `/design-system/assets/buildWorkPanel.mjs` imports are drift.
- Known blockers or environment constraints:
  shared render/controller/style seams and canonical states now exist;
  root-admin UI-only parity proof now exists; real harness/API integration,
  server-backed history, and permission-backed packet download remain
  unresolved.

## Canonical And Consumer Truth

- Canonical states this consumer depends on:
  `BWP-R-001` through `BWP-R-020`, or approved replacements.
- Consumer-specific states not fully proven by canonicals alone:
  live root-admin page/module/role context, API denied states, real generated
  packet availability, permission mapping.
- Render-ready or parity constraints for screenshots:
  no text overlap, no page reflow, no mobile launcher overlap with shell chrome,
  honest denied/failure states, no public or inline PDF treatment.

## Promotion Decision

- Adoption result:
  UI-only root-admin consumer adopted; real harness/API integration blocked
- Follow-up work required before wider reuse:
  connect the first root-admin consumer to real Layer 1/harness behavior and
  prove server-backed history plus permission-backed packet generation/download.
- Follow-up work required before extraction into a shared primitive:
  prove a second governed consumer or active Reporting/Support payload.
