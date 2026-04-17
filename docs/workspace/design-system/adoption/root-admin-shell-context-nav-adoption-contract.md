# Root Admin Shell Context-Nav Adoption Contract

## Scope

- Component or pattern family:
  `context-nav`
- Status:
  active first-consumer parity slice
- First consumer surface:
  `rootAdminShell` section navigation
- Route or shell owner:
  `/root-admin`
- Source pattern artifact:
  `docs/workspace/design-system/patterns/context-nav-pattern.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/context-nav-reference-pack.md`
- Source verification checklist:
  `docs/workspace/design-system/verification/context-nav-verification-checklist.md`

## Purpose

- What business or workflow need does this adoption serve?
  Provide governed section navigation inside the authenticated root admin shell
  so new root functions can be added without inventing local shell chrome.
- Why is this the right first consumer?
  `rootAdminShell` is the intended shell-level section-navigation consumer and
  was explicitly named during the design-system loop.
- Why is adoption happening now instead of remaining design-system-only?
  The full `context-nav` canonical set has been browser-reviewed and signed
  off, so the next honest step is parity against the real shell.

## Capability And Workflow Mapping

- Capability source:
  root-admin authenticated shell section navigation
- Primary actor:
  authenticated root operator
- Permission or capability rules:
  preserve the existing root-auth protected-shell seam and route-level
  capability checks; this adoption must not invent new authz behavior
- Route ownership:
  `rootAdminShell` and routed root-admin sections
- Workflow states in scope:
  desktop right-edge rail parity, mobile bottom-nav parity, RTL parity,
  truthful current-page shell routing through the adopted sub-nav and
  context-nav seams, and the first governed context-nav-drawer utility path
- Workflow states explicitly deferred:
  tenant-facing shells, route-local toolbar actions, broader preferences
  architecture, payload-specific display-settings IA, and any utility
  action beyond the context-nav drawer

## Pattern Mapping

- Signed-off pattern being adopted:
  `context-nav` family as captured by `CNR-001` through `CNR-010`
- Required behavior-lock IDs:
  `SV-000` through `SV-011`
- Required canonical reference states:
  `CNR-001`, `CNR-002`, `CNR-004`, `CNR-005`, `CNR-006`, `CNR-007`,
  `CNR-008`, `CNR-009`
- Which parts of the pattern are mandatory for parity?
  shell attachment, top-versus-bottom rail grammar, scroll-pressure behavior,
  mobile conversion, RTL right-edge rail, tooltip readiness, and truthful
  current-page visibility
- Which parts are intentionally deferred in this first consumer?
  exact business destinations and the final breadth of root-admin section
  information architecture may evolve, but the shell behavior and geometry may
  not drift

## Consumer Contract

- Primary destinations:
  `users`, `roles`, `tenants`, and `tenant-admins`
- Utility actions:
  `context-nav drawer` shell only; the display-settings payload remains
  a separate follow-on loop, and future governed shell utilities still
  require explicit review
- Profile or preference actions:
  remain owned by the adopted top-nav shell, not by `context-nav`
- App-versus-preview control scope:
  `/design-system` keeps theme, magnification, accent, and RTL/LTR preview
  tooling; the real `rootAdminShell` drawer intentionally exposes only theme
  and magnification while language selection continues to own direction
- Loading / empty / denied states:
  no invented destinations; current-page-only fallback remains allowed where
  larger IA is not yet approved
- Error or degraded states:
  route-local failures must not collapse the shell or turn the context-nav
  into a floating local toolbar
- Localization / long-label expectations:
  adoption must preserve RTL, truncation, tooltip reveal, and magnification
  parity from the signed-off canonicals

## Parity Rules

- Must match reference pack:
  rail width and attachment, top/bottom stack grammar, scroll pressure,
  current-state visibility, mobile bottom-bar conversion, RTL right-edge
  behavior, and long-label handling
- May differ intentionally:
  actual root-admin destinations and route names may reflect real shell
  business structure rather than design-system fixture labels
- Must not drift:
  no desktop collapse-menu branch, no narrow popover for mobile `More`, no
  floating mobile drawer gap, no browser-default close glyphs, and no RTL rail
  lane inversion
- Required parity evidence:
  browser-reviewed comparison against the signed-off `CNR-*` states plus real
  root-admin shell screenshots or visual tests

## Adoption Boundary

- What existing local UI is being replaced?
  route-local shell inventions for root-admin section navigation
- What backend seams or APIs must remain untouched?
  root-auth protected-shell session behavior, route capability checks, and
  root-admin route APIs
- What page-local behavior is allowed for the POC?
  route-specific destination labels, placeholder page bodies, and compatibility
  aliases from legacy hashes such as `#root-users` and `#root-roles`
- What is explicitly out of scope?
  redesigning top-nav, inventing tenant-facing shell behavior, or bundling
  unrelated preferences architecture changes

## Verification

- Required rendered checks:
  parity against the signed-off `CNR-*` set, especially `CNR-001`,
  `CNR-005`, `CNR-007`, and `CNR-008`
- Required executable tests:
  existing `contextNavCanonicalFrame.spec.ts` remains green; root-admin
  consumer parity is now covered by
  `tests/visual/rootAdminShell/rootAdminShellSubNav.spec.ts`, including
  desktop drawer launch, mobile `More` sheet launch, bottom attachment, close
  behavior, focus return, and app-scoped theme/magnification controls
- Required manual sign-off steps:
  review root-admin desktop, mobile, RTL, current-page parity, and
  context-nav-drawer runtime behavior against the design-system canonicals;
  do not treat payload-specific display-settings content as signed off
  from this contract alone
- Known blockers or environment constraints:
  no additional blocker inside this slice; broader utility-action IA remains
  deferred until a follow-on parity review

## Promotion Decision

- Adoption result:
  implemented first-consumer shell parity baseline plus the first governed
  utility-action parity slice
- Follow-up work required before adoption starts:
  none; the first route set is now live in the shell
- Follow-up work required before wider reuse:
  prove the same family in at least one more real shell consumer before wider
  reuse, and only add another utility action through explicit review
