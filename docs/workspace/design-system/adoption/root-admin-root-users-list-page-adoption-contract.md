# Root Admin Root Users List Page Adoption Contract

## Scope

- Component or pattern family:
  `List Page` with signed-off child seams:
  `ListRecordCard`
  `ListDetailPanel`
  `ListDetailSplitLayout`
- Status:
  active first-consumer adoption contract
- First consumer surface:
  `rootAdminShell` `Users` route
- Route or shell owner:
  `/root-admin#users`
- Source template artifact:
  `docs/workspace/design-system/templates/list-page-template.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/list-page-reference-pack.md`
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/list-page-behavior-lock.md`
- Source child artifacts:
  `docs/workspace/design-system/components/list-record-card-component.md`
  `docs/workspace/design-system/components/list-detail-panel-component.md`
  `docs/workspace/design-system/components/list-detail-split-layout-component.md`

## Purpose

- What business or workflow need does this adoption serve?
  Replace the root-admin `Users` placeholder with a real protected operator
  list surface that follows the signed-off `List Page` baseline instead of
  inventing local list/detail chrome.
- Why is this the right first consumer?
  The route already owned truthful shell wayfinding, and `rootUsers` is the
  clearest real app capability with list, pagination, selection, and detail
  review pressure.
- Why is adoption happening now instead of remaining shell-only?
  The full upstream list-page chain is now signed off, so the next honest step
  is a real consumer parity pass rather than further design-system-only review.

## Capability And Workflow Mapping

- Capability source:
  protected `rootUsers` backend routes under `/v1/root-users*`
- Primary actor:
  authenticated root operator
- Permission or capability rules:
  preserve the existing cookie-backed root-admin shell boundary and current
  root-user route contracts; this adoption must not widen auth or data access
- Route ownership:
  `rootAdminShell` `Users` page
- Workflow states in scope:
  protected visible-directory load, desktop split selection, mobile overlay
  detail, footer previous/next traversal, paginated append loading, search
  invalidation, empty/no-results/error recovery, RTL, and magnification-safe
  reading pressure
- Workflow states explicitly deferred:
  create/edit/remove UI, deleted-only views, broad cross-field search,
  header action clusters, and any second fetch dedicated only to detail

## Consumer Contract

- List source:
  `GET /v1/root-users` visible paginated list
- Detail source:
  current list payload fields reused directly for the selected detail panel
- Search source:
  the adopted sub-nav `search-shell` becomes route-owned page search on
  `#users`
- Search semantics:
  exact email lookup when the query is email-shaped, otherwise visible-list
  filtering by supported `emailPrefix`
- Search guardrail:
  non-email prefix search requires at least 3 trimmed characters because the
  backend capability rejects shorter prefix filters
- Selection source:
  one selected visible root user at a time
- Detail content mapping:
  title uses durable root-user display identity, subtitle uses normalized
  email, meta uses lifecycle status, and body/tags map current durable fields
  such as identifiers and timestamps
- Append source:
  additional pages of `GET /v1/root-users` load through the list boundary and
  footer `Next`
- Footer navigation:
  `Previous` and `Next` only
- Mobile rules:
  selected detail becomes a full-sheet overlay beneath the governed bottom
  context-nav bar

## Parity Rules

- Must match reference pack:
  `LPR-001` through `LPR-010`, `LPR-012`, `LPR-013`, `LPR-015`, `LPR-017`,
  `LPR-018`, `LPR-020`, `LPR-022`, `LPR-024`, `LPR-025`, `LPR-027`,
  `LPR-028`, and `LPR-029` where the real capability applies
- May differ intentionally:
  route copy, title/body field mapping, and the real capability-specific
  search narrowing described above
- Must not drift:
  no local replacement layout, no shell-breaking overlay layer, no invented
  quick-action toolbar, no local list-page CSS fork, no fake broad search
  semantics, and no capability contract changes hidden inside the UI adoption
- Required parity evidence:
  `tests/visual/rootAdminShell/rootAdminRootUsersList.spec.ts`
  `tests/visual/rootAdminShell/rootAdminShellSubNav.spec.ts`

## Intentional Differences And Gaps

- The adopted search shell is real on `#users`, but it is intentionally
  narrower than the generic design-system placeholder search:
  exact email or supported `emailPrefix` only.
- The route consumes the shared canonical list-page stylesheet from
  `/design-system/assets/list-page-shared.css` rather than carrying any
  root-admin-only copy of the list-page styling contract.
- The detail panel does not ship extra header actions because the current
  capability slice does not yet expose approved quick actions for this route.
- The local detail error seam remains present in markup but is not exercised by
  a second backend detail fetch in this first consumer, because the visible
  list payload already contains the current route-approved root-user fields.
- The route currently adopts the visible directory only. Deleted-only,
  anonymized-only, or lifecycle mutation surfaces remain separate future work.

## Adoption Boundary

- What existing local UI is being replaced?
  the `Users` placeholder content inside `rootAdminShell`
- What backend seams or APIs must remain untouched?
  `rootAuth` browser session transport, `/v1/root-users*` contracts, and the
  adopted root-admin shell routing seams
- What page-local behavior is allowed in this first consumer?
  route-specific field mapping and capability-honest search validation
  messaging
- What is explicitly out of scope?
  redesigning the route, introducing local toolbar chrome, or widening search
  into unsupported name/status filters without an approved backend plan

## Verification

- Required rendered checks:
  desktop closed/open split, boundary next-load traversal, no-results
  invalidation, clear-search recovery, mobile overlay placement, and scoped
  initial-load retry
- Required executable tests:
  `tests/visual/rootAdminShell/rootAdminRootUsersList.spec.ts`
- Required manual sign-off steps:
  compare desktop, mobile, RTL, and magnified root-admin rendering against the
  signed-off list-page canonicals before treating parity as closed
- Known blockers or environment constraints:
  search remains intentionally limited by current backend capability semantics

## Promotion Decision

- Adoption result:
  approved to begin first-consumer implementation on `rootAdminShell`
- Follow-up work required before wider reuse:
  prove a second real consumer and decide whether the search-shell semantics
  should standardize across future list-page routes
- Follow-up work required before extraction into a shared primitive:
  second-consumer proof for the app-facing `List Page` contract and a decision
  on whether detail should continue to reuse list payloads or move to a shared
  detail-read seam
