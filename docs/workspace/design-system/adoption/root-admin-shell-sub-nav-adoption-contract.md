# Root Admin Shell Sub-Nav Adoption Contract

## Scope

- Component or pattern family:
  `sub-nav` row with `breadcrumb` and `search-shell` child-family parity
- Status:
  active
- First consumer surface:
  `rootAdminShell` page chrome beneath the adopted top-nav shell
- Route or shell owner:
  `/root-admin`
- Source pattern artifact:
  `docs/workspace/design-system/patterns/sub-nav-row-pattern.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/sub-nav-row-reference-pack.md`
- Source verification checklist:
  `docs/workspace/design-system/verification/sub-nav-row-verification-checklist.md`

## Purpose

- What business or workflow need does this adoption serve?
  Provide governed page-level wayfinding and page-search chrome beneath the
  already adopted root-admin top-nav so routed screens stop inventing local
  headers and breadcrumb behavior.
- Why is this the right first consumer?
  `rootAdminShell` is the clearest real shell consumer of the signed-off
  secondary row and has immediate need for route orientation above page
  content.
- Why is adoption happening now instead of remaining design-system-only?
  The row, breadcrumb, and search-shell canonicals are now fully captured and
  Playwright-locked, so the next honest step is a real shell consumer rather
  than more design-system-only iteration.

## Capability And Workflow Mapping

- Capability source:
  root-admin authenticated shell and route-local page-chrome workflows
- Primary actor:
  authenticated root operator
- Permission or capability rules:
  preserve the existing root-auth protected-shell seam and route-level
  capability checks; this adoption must not invent new permission rules
- Route ownership:
  `/root-admin` shell routes such as `overview`, `root-users`, and
  `root-roles`
- Workflow states in scope:
  shallow home breadcrumb, normal route breadcrumb, reduced breadcrumb under
  width pressure, RTL row behavior, mobile fallback
- Workflow states explicitly deferred:
  broad cross-route search execution semantics, tenant-facing shells, and any
  route-local toolbar actions unrelated to wayfinding or search

## Pattern Mapping

- Signed-off pattern being adopted:
  `sub-nav` row plus breadcrumb and search-shell child-family behavior inside
  root-admin page chrome
- Required behavior-lock IDs:
  `SN-000` through `SN-012`
  `BC-000` through `BC-012` where breadcrumb appears in the adopted row
  `SS-000` through `SS-010` where search-shell appears in the adopted row
- Required canonical reference states:
  `SNR-001`, `SNR-002`, `SNR-004`, `SNR-005`, `SNR-008`
  `BCR-001`, `BCR-002`, `BCR-003`, `BCR-005`, `BCR-006`, `BCR-008`,
  `BCR-009`, `BCR-010`, `BCR-011`, `BCR-012`
- Which parts of the pattern are mandatory for parity?
  shared row coexistence, breadcrumb reduction order, honest RTL ordering,
  compact recovery behavior, centered bounded search behavior, mobile
  breadcrumb removal, and top-overlay tooltip behavior
- Which parts are intentionally deferred in this first consumer?
  broader cross-route search execution may land later, but the row geometry and
  child-family parity must not drift

## Consumer Contract

- Primary destinations:
  root-admin routed pages such as `Overview`, `Root Users`, and
  `System Root Roles`
- Utility actions:
  none in the row itself; utility chrome remains owned by the adopted top-nav
- Profile or preference actions:
  out of scope for this row and remain owned by top-nav
- Loading / empty / denied states:
  shallow routes may use the approved home-only breadcrumb state; denied or
  unavailable page search behavior must not collapse the row into an unrelated
  local toolbar
- Error or degraded states:
  if broader search execution is unavailable, the shell may keep the bounded
  search affordance operating as route-level navigation, but must keep row
  layout parity
- Current first exception:
  the `rootAdminShell` `Users` route now owns capability-backed page search
  through the same adopted search shell as part of the signed-off `List Page`
  adoption, while other root-admin routes may still keep route-navigation
  search behavior
- Localization / long-label expectations:
  adoption must preserve RTL ordering, compact recovery, truncation, and
  tooltip reveal parity from the signed-off canonicals

## Parity Rules

- Must match reference pack:
  row composition, breadcrumb reduction order, compact signpost behavior, RTL
  ordering, centered bounded search behavior, active hint behavior, tooltip
  layering, and mobile fallback
- May differ intentionally:
  actual breadcrumb labels and route naming may reflect real root-admin routes
  rather than design-system fixture labels
- Must not drift:
  no page-local breakpoints, no multi-line breadcrumb wrapping, no search
  overlap, and no browser-default tooltip fallback
- Required parity evidence:
  canonical parity review against the signed-off `SNR-*`, `BCR-*`, and
  `SSR-*` states where relevant, plus root-admin visual evidence

## Adoption Boundary

- What existing local UI is being replaced?
  route-local page-header and breadcrumb inventions beneath the adopted
  top-nav shell inside `rootAdminShell`
- What backend seams or APIs must remain untouched?
  root-auth protected-shell session behavior, route capability checks, and any
  existing root-user or root-role APIs
- What page-local behavior is allowed for the POC?
  route-specific breadcrumb labels and placeholder or capability-backed search
  handling, as long as row parity is preserved and unsupported search semantics
  are not faked
- What is explicitly out of scope?
  redesigning top-nav, introducing tenant-scoped shell behavior, or coupling
  the adoption to unrelated drawer/dialog/preferences work

## Verification

- Required rendered checks:
  parity against the captured row, breadcrumb, and search-shell canonicals,
  including RTL and truncation states
- Required executable tests:
  existing `subNav.spec.ts` canonicals remain green; root-admin visual parity
  now begins in `tests/visual/rootAdminShell/rootAdminShellSubNav.spec.ts`
- Required manual sign-off steps:
  review root-admin desktop, reduced, RTL, mobile, and long-label states
  against the design-system canonicals
- Known blockers or environment constraints:
  broader cross-route search semantics are still intentionally deferred and
  must not be faked as part of the chrome adoption

## Promotion Decision

- Adoption result:
  adopted
- Follow-up work required before wider reuse:
  add future real-content long-label parity states inside `rootAdminShell` and
  confirm tooltip/truncation behavior once routed content produces authentic
  pressure
- Follow-up work required before extraction into a shared primitive:
  prove the same row seam in at least one more real shell consumer
