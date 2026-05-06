# Root Admin Build Work Panel Adoption Contract

## Scope

- Component or pattern family:
  `build-work-panel`
- Status:
  app adoption blocked; upstream pattern signed off
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
  Adoption is still not approved. This contract records the conditions
  root-admin must satisfy after the signed-off pattern is converted into shared
  render/controller/style seams and canonical proof.

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
  `BWP-R-001` through `BWP-R-012`, or approved replacements.
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
  provisional: `/design-system/assets/buildWorkPanelDemo.css`; harden the
  app-consumable entrypoint name before root-admin adoption.
- Shared render seam:
  `/design-system/assets/buildWorkPanel.mjs`.
- Shared controller seam:
  `/design-system/assets/buildWorkPanel.mjs`.
- Family-owned visible regions:
  launcher, panel surface, action list, Build chat anatomy, conversation
  history, transcript, composer, packet status/action, close control.
- Host-owned visible regions:
  root-admin page content behind the panel, route/module labels supplied as
  context, authenticated user/role display source.
- Approved intentional deviations before implementation:
  none.
- Shared-entrypoint parity expectation:
  not yet decided.
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
  none in MVP; new root-admin adoption is blocked.
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
  design-system visual/browser checks, root-admin adoption source guard, and
  root-admin browser scenarios after implementation.
- Required manual sign-off steps:
  full canonical review, app-consumable style-entrypoint decision, verification
  checklist refresh, and first-consumer parity review.
- Required consumer-level route proof:
  root-admin shell after implementation only.
- Required shared-entrypoint parity proof:
  required before marking adoption complete.
- Known blockers or environment constraints:
  no shared render seam, controller seam, style seam, or canonical states exist
  yet.

## Canonical And Consumer Truth

- Canonical states this consumer depends on:
  `BWP-R-001` through `BWP-R-012`, or approved replacements.
- Consumer-specific states not fully proven by canonicals alone:
  live root-admin page/module/role context, API denied states, real generated
  packet availability, permission mapping.
- Render-ready or parity constraints for screenshots:
  no text overlap, no page reflow, no mobile launcher overlap with shell chrome,
  honest denied/failure states, no public or inline PDF treatment.

## Promotion Decision

- Adoption result:
  blocked until shared seams and canonical proof exist
- Follow-up work required before wider reuse:
  create shared seams and prove a first root-admin consumer.
- Follow-up work required before extraction into a shared primitive:
  prove a second governed consumer or active Reporting/Support payload.
