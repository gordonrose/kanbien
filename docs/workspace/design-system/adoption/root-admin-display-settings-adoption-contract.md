# Root Admin Display Settings Adoption Contract

## Scope

- Component or pattern family:
  `display settings` payload inside the governed `context-nav drawer`
- Status:
  active first-consumer adoption contract; payload family signed off upstream
- First consumer surface:
  `rootAdminShell`
- Route or shell owner:
  `/root-admin`
- Source pattern artifact:
  `docs/workspace/design-system/patterns/drawer-pattern.md`
- Source controls artifact:
  `docs/workspace/design-system/patterns/display-settings-pattern.md`
- Source payload reference pack:
  `docs/workspace/design-system/reference-packs/display-settings-reference-pack.md`
- Source payload verification checklist:
  `docs/workspace/design-system/verification/display-settings-verification-checklist.md`
- Source drawer family reference pack:
  `docs/workspace/design-system/reference-packs/context-nav-drawer-reference-pack.md`
- Source drawer family verification checklist:
  `docs/workspace/design-system/verification/context-nav-drawer-verification-checklist.md`

## Purpose

- What business or workflow need does this adoption serve?
  Provide the first real-app consumer of the signed-off `display settings`
  payload without letting app implementation widen beyond the approved subset.
- Why is this the right first consumer?
  `rootAdminShell` was the intended first real consumer throughout the
  drawer-shell and payload loops, and the upstream `display settings` chain is
  now signed off.
- Why is adoption happening now instead of remaining design-system-only?
  The payload-specific loop is now complete, so the next honest step is parity
  implementation in the real shell rather than more provisional design-system
  notes.

## Capability And Workflow Mapping

- Capability source:
  root-admin shell display preferences
- Primary actor:
  authenticated root operator
- Permission or capability rules:
  preserve the existing protected-shell seam; this slice must not invent new
  authz rules
- Route ownership:
  `rootAdminShell`
- Workflow states in scope:
  future desktop launcher, mobile `More` launcher, bottom attachment, close
  behavior, focus return, app theme controls, and app magnification controls
- Workflow states explicitly deferred:
  persistence, user profile storage, accent controls, direction controls, and
  any utility action beyond display settings

## Consumer Contract

- Launcher owner:
  adopted `context-nav`
- In-app controls allowed:
  theme and magnification only
- Preview-only controls kept out of app:
  accent and direction
- Payload title:
  `Display Settings`
- Required grouped controls:
  `Theme`
  `Magnification`
- Close rules:
  outside click and `Escape` close the drawer and return focus to the launcher
- Mobile rules:
  launch through `More`, then attach the drawer to the top edge of the bottom
  bar
- RTL rules:
  preserve the signed-off drawer-shell RTL behavior; do not ship the
  design-system-only direction control inside the app payload
- Persistence posture:
  do not imply durable saved preferences yet; app behavior may remain
  runtime/session-scoped until a later persistence loop is approved

## Parity Rules

- Must match reference pack:
  the adopted settings payload must inherit launcher ownership, desktop
  attachment, mobile bottom attachment, close grammar, focus return, and
  layered runtime behavior from the signed-off `context-nav drawer` family,
  while matching the payload-specific `DSR-*` evidence for grouped controls,
  active state, and mobile/RTL behavior
- May differ intentionally:
  the real app exposes only its approved `theme` and `magnification` subset
  rather than the fuller design-system review set
- Must not drift:
  no floating mobile gap, no browser-default close glyph, no direction control
  shipped inside app, no accent control shipped inside app, and no invented
  utility action siblings
- Required parity evidence:
  `CNR-007`, `CDR-*` drawer-shell states, `DSR-*` payload states, and
  `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts`

## Adoption Boundary

- What existing local UI is being replaced?
  no previous governed utility action existed in `rootAdminShell`
- What backend seams or APIs must remain untouched?
  auth shell, session behavior, and routed root-admin APIs
- What page-local behavior is allowed for the POC?
  route-local copy and non-persistent display controls, as long as the
  approved app subset and shell parity are preserved
- What is explicitly out of scope?
  broader preferences architecture, durable persistence, accent or direction
  app controls, or extra utility actions

## Verification

- Required rendered checks:
  desktop open, mobile `More` launch, mobile bottom attachment, close-button
  grammar, `Escape`, focus return, theme control behavior, and magnification
  control behavior against the signed-off `CDR-*` and `DSR-*` states
- Required executable tests:
  `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts`
- Required manual sign-off steps:
  review root-admin desktop, mobile, and RTL parity against the signed-off
  drawer-shell and payload canonicals before treating the app consumer as
  complete
- Known blockers or environment constraints:
  persistence is intentionally deferred

## Promotion Decision

- Adoption result:
  approved to begin first-consumer implementation in `rootAdminShell`
- Follow-up work required before adoption starts:
  implement the approved `theme` and `magnification` subset in the real shell
- Follow-up work required before wider reuse:
  complete app-vs-canonical parity verification and then prove a second real
  consumer before extracting a broader shared primitive
- Follow-up work required before extraction into a shared primitive:
  second-consumer confirmation for both the drawer shell and the settings set
