# Root Admin Web App Hierarchy Governed Adoption Preflight

## Scope

- Governed family or families:
  `hierarchy-tree`
  `form-template`
  `icon-grid`
  `drawer-select`
- Consumer surface:
  `rootAdminShell` `web-app-hierarchy`
- Route or shell owner:
  `/root-admin/web-app-hierarchy`
- Date:
  `2026-04-20`
- Status:
  active

## Purpose

- What app change is being attempted?
  Keep `/root-admin/web-app-hierarchy` honest under the stronger governed
  adoption rule so the route is reviewed as a composition of approved
  design-system families instead of as a page-local approximation.
- Why is this the right consumer and the right time?
  This route is the first real app consumer with meaningful pressure across
  hierarchy structure, page settings, shell-attached drawer posture, and
  design-system child controls.
- Why is the work governed adoption rather than a one-off exception?
  The route is supposed to inherit governed design-system truth and should not
  become a special-case app shell with private layout or interaction rules.

## Signed-Off Source Truth

- Exact source route:
  `src/frontend/designSystem/patterns/hierarchy-tree/index.html`
  and the signed-off form-template canonical chain
- Exact reference pack:
  `docs/workspace/design-system/reference-packs/hierarchy-tree-reference-pack.md`
  `docs/workspace/design-system/reference-packs/form-template-reference-pack.md`
- Exact verification checklist:
  `docs/workspace/design-system/verification/hierarchy-tree-verification-checklist.md`
  `docs/workspace/design-system/verification/form-template-verification-checklist.md`
- Exact behavior-lock artifact:
  `docs/workspace/design-system/behavior-locks/hierarchy-tree-behavior-lock.md`
  `docs/workspace/design-system/behavior-locks/form-template-behavior-lock.md`
  plus the shell host locks for context-nav and context-nav drawer
- If the source truth is split across multiple artifacts, list them explicitly:
  yes; this route composes shell-owned `context-nav drawer`, page-body
  `form-template`, and child controls from `icon-grid` and `drawer-select`

## Seam Readiness

- Shared CSS seam:
  present through:
  `/design-system/assets/hierarchy-tree-shared.css`
  `/design-system/assets/form-template-shared.css`
- Shared render seam:
  present through:
  `/design-system/assets/webAppHierarchyWorkspace.mjs`
  which now owns the governed route workspace shell, hosted form surface, and
  hierarchy drawer host markup
- Shared controller seam:
  present through:
  `createWebAppHierarchyWorkspaceController(...)` in
  `/design-system/assets/webAppHierarchyWorkspace.mjs`
- Explicit allowed consumer inputs:
  hierarchy tree data, capability-driven action visibility, selected-node
  structure data, page-settings values, approved callbacks for route-owned
  business actions
- Which required seams are still missing?
  - no route-body host seam blocker remains for this route
- If a seam is missing, what is the stop condition?
  if future work would require new app-local reconstruction of the workspace
  host, stop and extend the shared design-system workspace seam instead

## Ownership Boundary

- Family-owned visible regions:
  - hierarchy drawer row grammar and hierarchy interactions
  - form-template page-shell treatment and section cadence
  - icon-grid modal and field interaction
  - drawer-select trigger, drawer, and option interaction
- Host-owned visible regions:
  - root-admin shell chrome around the route
  - page title, route-specific status messaging, and route-owned top actions
  - structure-specific explanatory copy and business save actions
- Family-owned interaction semantics:
  row affordances, rename posture, drawer behaviors, form child-control
  behaviors, and accessibility semantics owned by the governed families
- Host-owned workflow or route behavior:
  API wiring, permission-driven visibility, page-settings submission, landing
  page submission, preview/apply workflow, and route-level shell messaging
- Approved consumer-specific copy or payload differences:
  route-specific business copy, root-admin actor wording, and capability-honest
  empty/error/save messages
- Explicitly forbidden local reconstruction:
  copied hierarchy-tree row anatomy, copied child-control markup, copied
  family-owned ARIA/state semantics, or new app-page CSS to approximate the
  governed families

## Literal Parity Target

- What exact browser result is the consumer supposed to match?
  the route should read as one shell-attached hierarchy drawer plus one
  governed form editing surface, not as a stack of app-local cards or modal
  takeovers
- Which states are mandatory for parity?
  hierarchy drawer attached posture, bottom-group hierarchy launcher, single
  primary form card, no nested visible form shells, honest desktop form
  posture, real child-control rendering, and saved action footer presence
- Which states are intentionally deferred?
  broader root-admin shell host render adoption beyond the workspace seam
- Which visible differences are approved in advance?
  route-specific copy, route-level action labels, backend-driven field values,
  and page-specific business submission actions
- Which visible differences would count as drift?
  app-local shell reconstruction, nested independent form hosts, extra card
  walls, route-owned replacement markup for child controls, or a hierarchy
  launcher that leaves the approved context-nav bottom stack

## False-Confidence Checks

- Why would shared CSS alone be insufficient here?
  because the route still composes multiple governed families and can remain
  visibly wrong even if the shared styles are imported correctly
- Why would reused classes or child controls alone be insufficient here?
  because host posture, section cadence, and drawer attachment can still drift
  even while inner controls are technically shared
- Which happy-path tests could still pass while the visible route is wrong?
  load, save, and child-control interaction tests could all pass while the
  route still used extra cards, nested shells, or a misplaced launcher
- Which likely browser-visible failures need direct guards?
  nested shell reintroduction, extra primary form cards, lost bottom-stack
  launcher placement, false modal perception from drawer composition, and
  future shared-entrypoint visual drift

## Verification Plan

- Required consumer-level executable tests:
  `tests/visual/app/rootAdminShell/rootAdminWebAppHierarchy.spec.ts`
- Required host or shell-parity checks:
  hierarchy launcher in `context-nav-bottom-group`, attached hierarchy drawer,
  and route body using one visible `form-page-shell` with one primary
  `form-page-card`
- Required real interactive parity states:
  hierarchy loading, row actions, drag or menu move, page settings save,
  landing-page save, icon-grid open/select, drawer-select open/select, mobile
  drawer posture, desktop resize, and RTL
- Required human-visible regression guards:
  no nested visible form shells, no extra card stack replacing the primary form
  surface, and no loss of bottom-group hierarchy launcher placement
- Required shared-entrypoint parity checks:
  keep the existing drawer-select selected-state guard and continue auditing
  app-consumption entrypoints against the canonical route when DS styles change
- Required manual or screenshot review:
  compare the real route against the hierarchy-tree and form-template source
  truths before calling parity closed after any major composition change

## Escalation Rules

- When should implementation stop and ask for direction?
  when a needed family seam is missing and the only obvious next step would be
  local reconstruction, or when the visible route still feels compositionally
  wrong after one corrective pass
- What visible ambiguity would be too risky to patch locally?
  shell-versus-page ownership, whether a section belongs to `form-template` or
  route-local composition, and whether a drawer behavior change would alter the
  signed-off context-nav host posture
- What would force the work back into the design-system loop first?
  extracting the hierarchy drawer host render seam, extracting a reusable
  form-template hosted-section seam, or any change that alters the signed-off
  shell/page ownership model

## Outcome

- Proceed now / blocked on missing seam / needs signoff clarification:
  proceed; the route now consumes a DS-owned workspace render/controller seam
  and should be treated as governed adoption for the page body and hierarchy
  drawer host
- Follow-up artifacts required:
  refresh the hierarchy adoption contract, refresh the form parity checklist,
  and keep the route-level browser suite aligned with these parity rules
