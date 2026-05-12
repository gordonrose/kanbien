# Root Admin Root Users List Page Adoption Contract

## Scope

- Component or pattern family:
  `List Page` with signed-off child seams:
  `ListRecordCard`
  `ListDetailPanel`
  `ListDetailSplitLayout`
  `ListDetailSectionIndex`
  `FormImageCard`
- Status:
  active first-consumer adoption contract
- First consumer surface:
  `rootAdminShell` `Users` route
- Route or shell owner:
  `/root-admin/users`
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
  `docs/workspace/design-system/components/list-detail-section-index-component.md`
  `docs/workspace/design-system/behavior-locks/list-detail-section-index-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/list-detail-section-index-reference-pack.md`
  `docs/workspace/design-system/behavior-locks/form-image-card-behavior-lock.md`
  `docs/workspace/design-system/reference-packs/form-image-card-reference-pack.md`

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
  `/root-admin/users`
- Search semantics:
  exact email lookup when the query is email-shaped, otherwise visible-list
  filtering by supported `emailPrefix`
- Search guardrail:
  non-email prefix search requires at least 3 trimmed characters because the
  backend capability rejects shorter prefix filters
- Selection source:
  one selected visible root user at a time
- Detail content mapping:
  the drawer header uses the signed-off `FormImageCard` seam for selected
  root-user identity: first and last name in the top row, normalized email in
  the second row, lifecycle status in the third row, and the linked profile
  image when available. The hidden detail title remains the accessible panel
  label and focus target. Body content now uses the signed-off
  `ListDetailSectionIndex` seam with `Profile` and `Session information`
  sections. `Profile` maps current durable fields such as identifiers and
  timestamps. `Session information` shows current browser session details only
  when available for the selected user, otherwise it states that selected-user
  session records are not loaded in this list view.
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
  `tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts`
  `tests/visual/app/rootAdminShell/rootAdminShellSubNav.spec.ts`

## Intentional Differences And Gaps

- The adopted search shell is real on `#users`, but it is intentionally
  narrower than the generic design-system placeholder search:
  exact email or supported `emailPrefix` only.
- The route now consumes the DS-owned workspace seam at
  `/design-system/assets/rootAdminDirectoryWorkspace.mjs` for render
  structure, list behavior, and drawer-form create/edit behavior instead of
  recreating the list-page shell or interaction grammar locally in
  `rootAdminShell`.
- The route consumes the shared canonical list-page stylesheet from
  `/design-system/assets/list-page-shared.css` rather than carrying any
  root-admin-only copy of the list-page styling contract.
- The detail panel now exposes the approved edit action and create path through
  the shared directory drawer-form behavior.
- The local detail error seam remains present in markup but is not exercised by
  a second backend detail fetch in this first consumer, because the visible
  list payload already contains the current route-approved root-user fields.
- The route currently adopts visible-directory create and edit only.
  Deleted-only, anonymized-only, or destructive lifecycle mutation surfaces
  remain separate future work.
- The root-user edit drawer places the profile-picture field before scalar
  identity fields so the header image-card edit affordance opens the form at
  the image relationship first.
- The root-user detail drawer adopts the shared `ListDetailSectionIndex` seam
  for `Profile` and `Session information` rather than adding local section-nav
  markup in the app route.

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
  invalidation, clear-search recovery, mobile overlay placement, scoped
  initial-load retry, and create/edit drawer-form submission
- Required executable tests:
  `tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts`
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
