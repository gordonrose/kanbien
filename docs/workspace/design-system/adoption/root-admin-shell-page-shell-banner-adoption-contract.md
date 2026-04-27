# Root Admin Shell Page-Shell Banner Adoption Contract

## Scope

- Component or pattern family:
  `page-shell-banner`
- Status:
  adopted first-consumer runtime contract in `rootAdminShell`
- First consumer surface:
  `rootAdminShell` page-shell feedback zone
- Route or shell owner:
  `/root-admin`
- Source pattern artifact:
  `docs/workspace/design-system/patterns/page-shell-banner-pattern.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/page-shell-banner-reference-pack.md`
- Source verification checklist:
  `docs/workspace/design-system/verification/page-shell-banner-verification-checklist.md`
- Shared render / controller seam:
  `src/frontend/designSystem/assets/pageShellBanner.mjs`

## Purpose

- What business or workflow need does this adoption serve?
  Replace the stale single-line shell-status posture in `rootAdminShell` with
  the signed-off governed banner family so shell feedback becomes dismissible,
  visibly separated from page content, and consistent across routed pages.
- Why is this the right first consumer?
  `rootAdminShell` is the live governed shell that exposed the stale banner
  problem and was the intended downstream consumer during the banner loop.
- Why is adoption happening now instead of remaining design-system-only?
  The pattern, reference pack, dedicated canonicals, and shared design-system
  render/controller seam now exist, so the honest next step is an app adoption
  contract before runtime migration work begins.

## Capability And Workflow Mapping

- Capability source:
  authenticated root-admin shell feedback
- Primary actor:
  authenticated root operator
- Permission or capability rules:
  preserve the existing root-auth protected-shell seam and all route-level
  capability checks; banner adoption must not invent new authz behavior
- Route ownership:
  `rootAdminShell` routed pages such as `overview`, `users`,
  `web-app-hierarchy`, `roles`, and `tenant-admins`
- Workflow states in scope:
  session refresh feedback, shell-search feedback, root-user directory
  feedback, and governed web-app-hierarchy workspace feedback rendered through
  the shell-owned banner zone
- Workflow states explicitly deferred:
  queued notification centers, persistent preference-backed banner settings,
  arbitrary page-configured banners, secondary banner actions, and any
  multi-shell reuse beyond `rootAdminShell`

## Pattern Mapping

- Signed-off pattern being adopted:
  `page-shell-banner` family as captured by `PSBR-001` through `PSBR-005`
- Required behavior-lock IDs:
  `PSB-001` through `PSB-008`
- Required canonical reference states:
  `PSBR-001`, `PSBR-002`, `PSBR-003`, `PSBR-004`, `PSBR-005`
- Which parts of the pattern are mandatory for parity?
  shell-owned feedback placement above page content, visible breathing room
  beneath the banner zone, visible dismiss `X` on every banner, supported
  informational/success/warning/danger tones, and state-local dismissal
- Which parts are intentionally deferred in this first consumer?
  final runtime lifecycle tuning beyond the initial governed policy, optional
  secondary actions, and any broader notification architecture

## Consumer Contract

- Shared CSS entrypoint:
  `src/frontend/designSystem/assets/styles.css`
- Shared render or markup seam:
  `renderPageShellBannerStack(...)` via
  `src/frontend/designSystem/assets/pageShellBanner.mjs`
- Shared interaction or controller seam:
  `createPageShellBannerController(...)`,
  `createPageShellBannerRuntimeController(...)`, and
  `resolvePageShellBannerRuntimePolicy(...)` via
  `src/frontend/designSystem/assets/pageShellBanner.mjs`
- Allowed consumer inputs:
  runtime message copy, shared runtime policy name, visibility scope once
  finalized, and page-owned trigger events that route through the shared
  controller
- Runtime producers in scope:
  `handleRefreshSession(...)`, `handleShellSearchSubmit(...)`,
  `createRootUsersListWorkspaceController(...)`, and
  `createWebAppHierarchyWorkspaceController(...)`
- Required first-pass lifecycle posture:
  page-scoped by default, clear on navigation by default, every rendered
  banner dismissible, and no indefinite stale message carry-over
- Implemented first-pass lifecycle posture:
  `info` and `success` auto-dismiss after a short interval, `warning` and
  `danger` remain until dismissed or replaced, and page-scoped messages clear
  on navigation by default
- Implemented display policy:
  no banner for routine navigation, open, cancel, refresh-in-progress, or
  successful search-refresh events; warnings for blocked or corrective user
  actions; danger for errors; success reserved for real mutations
- Implemented policy buckets:
  `mutation-success`, `blocked-action`, and `error` from the shared runtime
  policy matrix; `informational` remains available in the shared seam but is
  intentionally not used by the current root-admin consumer
- Tone grammar allowed in app:
  `info`, `success`, `warning`, `danger`
- Message stacking posture:
  first-consumer adoption may use one governed banner at a time or an approved
  limited stack, but it must do so through the shared controller rather than
  app-local markup branching

## Parity Rules

- Must match reference pack:
  banner zone placement, spacing beneath the zone, dismiss-control grammar,
  approved tone styling, and partial-stack behavior after dismissing one state
- May differ intentionally:
  real root-admin copy and runtime triggers may replace design-system fixture
  copy, as long as governed banner anatomy and interaction stay intact
- Must not drift:
  no raw text-only status strip, no page-body banner reinvention, no missing
  `X`, no welded banner-to-content edge, no indefinite route-surviving stale
  state by default, and no app-local recreation of banner interaction logic
- Required parity evidence:
  design-system canonical parity plus root-admin browser proof on the real
  shell routes

## Adoption Boundary

- What existing local UI is being replaced?
  the current `#shell-message` status strip in
  `src/frontend/rootAdminShell/index.html` and the raw `setShellMessage(...)`
  path in `src/frontend/rootAdminShell/assets/app.mjs`
- What existing app-local writers must migrate?
  shell search and session refresh in
  `src/frontend/rootAdminShell/assets/app.mjs`, root-admin directory feedback in
  `src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs`, and governed
  workspace feedback that currently flows through
  `src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs`
- What backend seams or APIs must remain untouched?
  root-auth protected-shell session behavior, route capability checks, and all
  existing root-admin APIs
- What page-local behavior is allowed for the POC?
  route-specific copy and truthful runtime triggers, provided the shell owns
  the banner render and interaction behavior
- What is explicitly out of scope?
  redesigning top-nav, sub-nav, or context-nav; inventing DB-backed banner
  configuration; or coupling this adoption to unrelated page-body rebuilds

## Verification

- Required rendered checks:
  overview route spacing, users route message parity, web-app-hierarchy route
  message parity, dismiss behavior, navigation clear behavior, and the visible
  `X` on every rendered banner
- Required executable tests:
  keep root-admin consumer-level banner proof under
  `tests/visual/app/rootAdminShell/`, plus keep
  `tests/visual/designSystem/canonicals/shell/pageShellBannerDemo.spec.ts` and
  `tests/visual/designSystem/canonicals/shell/pageShellBannerCanonical.spec.ts`
  green; current consumer proof lives in
  `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts`,
  `tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts`, and
  `tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts`
- Required manual sign-off steps:
  review real root-admin banner behavior on desktop after adoption, especially
  the spacing below the banner zone and the absence of stale cross-page carry
  over
- Known blockers or environment constraints:
  final runtime lifecycle timing such as auto-dismiss duration still needs to
  be locked during implementation

## Promotion Decision

- Adoption result:
  adopted in `rootAdminShell`
- Follow-up work required before implementation starts:
  none
- Follow-up work required before the consumer is treated as adopted:
  none
- Follow-up work required before wider reuse:
  lock the runtime lifecycle policy with real app evidence, then prove the
  same banner family in at least one more governed shell consumer
