# Design System Topology Materialization V1 Blueprint

## Summary

- Feature:
  `webAppHierarchyBuilder` extended with a governed `design-system`
  materialization slice
- Capability:
  proposed-to-applied page-tree editing for `design-system` plus deterministic
  repo materialization for new pages and subpages
- Scope:
  first controlled frontend-topology materialization slice for one route family
- Phase:
  pre-implementation blueprint from settled architecture decisions; capability
  matrix and PRD still need to be written before implementation starts

## Inputs

- Capability matrix reference:
  none yet; this blueprint exists to shape the first matrix and PRD rather than
  to replace them
- PRD:
  none yet; required before implementation
- ADR(s):
  - [0022-add-a-web-app-surface-discovery-foundation-with-explicit-provider-seams-and-reconcile-links.md](/home/gordon/kanbien/docs/architecture/adr/0022-add-a-web-app-surface-discovery-foundation-with-explicit-provider-seams-and-reconcile-links.md)
  - [0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md](/home/gordon/kanbien/docs/architecture/adr/0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md)
  - [0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md](/home/gordon/kanbien/docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md)
  - [0025-adopt-a-security-first-page-state-replay-model.md](/home/gordon/kanbien/docs/architecture/adr/0025-adopt-a-security-first-page-state-replay-model.md)
- PRD test-case doc:
  none yet; required before implementation
- Journey inventory:
  none yet; create one if the first slice is treated as a meaningful operator
  workflow rather than a backend-only planning seam
- QA coverage matrix classification:
  privileged backend capability extension plus governed frontend topology
  materialization affecting a browser route family
- QA release-gate expectation:
  deterministic preview/apply behavior, no hidden repo mutations, honest page
  tree refresh, and explicit verification for create and route-affecting edits

## Scope Confirmation

This blueprint is for one coherent first slice:

- keep `design-system` as the first governed family
- let operators add new pages and subpages to the curated topology
- keep proposed topology and applied topology as separate states
- preview repo materialization before apply
- materialize newly applied pages into `src/frontend/designSystem/`
- refresh the page tree immediately after successful apply
- rely on shared system CSS rather than page-local stylesheet stubs by default
- create lightweight documentation/governance stubs for new pages

This blueprint does **not** include:

- `root-admin` materialization yet
- path/hash migration work
- folder moves or folder renames after initial creation
- promotion of journey-state into durable subroutes
- page-local CSS generation by default
- automatic folder/tree realignment beyond initial page creation
- rich replay/snapshot implementation
- silent background repo rewrites outside explicit preview/apply

## V1 Operation Matrix

### Allowed In V1

- create page
- create subpage
- rename display label
- update curated tree ordering when the change does not require folder moves
- confirm and apply deterministic repo materialization for newly created pages

### Allowed With Explicit Preview And Human Confirmation

- rename route segment
- logical move within the curated tree when the materialized folder location is
  left unchanged
- any repo rewrite that changes addressability, import wiring, or discovery
  output

### Blocked For V1

- moving or renaming page folders after creation
- root-family-to-root-family moves
- delete or retire semantics that remove real browser routes
- automatic promotion of journey-state into durable topology
- page-local stylesheet generation by default
- repo-structure cleanup refactors whose main purpose is folder/tree alignment

## Ownership Boundary

### Harness-Owned

For the `design-system` family, the first harness may create:

- the route entry as implied by governed `design-system` folder structure
- the page folder
- `index.html`
- no behavior module stub by default for the approved v1 template
  `static-html-page`
- lightweight documentation/governance stubs at
  `docs/workspace/design-system/generated-pages/<page-slug>.md` so the new
  page does not enter the repo without downstream visibility

The first harness may also update:

- curated topology records
- proposed/apply status fields
- any narrow materialization manifest or metadata file explicitly introduced for
  this slice

### Human-Owned

Humans remain authoritative for:

- actual page functionality after scaffold creation
- business logic and browser behavior beyond the scaffold
- non-trivial UI implementation inside created pages
- any page-local styling exception explicitly approved later

### Explicit Default

- do not create page-local stylesheet stubs by default
- rely on shared system CSS unless an explicit exception is approved
- do not treat folder layout as a mirror of every tree edit in v1

## Frontend Plan

- Route / surface:
  start with `src/frontend/designSystem/` only; the hierarchy tree UI remains
  the operator surface that drives proposed changes and apply confirmation
- UI states:
  - proposed page create
  - proposed subpage create
  - preview pending
  - preview summary visible
  - apply confirmed
  - apply failed
  - page tree refreshed from applied topology
  - compatibility-sensitive route-segment rename preview
  - blocked folder-move or blocked delete state
- Permission visibility behavior:
  this remains a privileged operator capability; only authorized root users may
  preview or apply topology changes
- Session / expiry behavior:
  inherit existing root-auth and root-admin browser session behavior; no new
  session model in this slice
- Browser security considerations:
  use approved backend capabilities, same-origin authenticated requests, and no
  client-side bypass of preview/apply gating; any future replay feature remains
  subject to ADR `0025`

### Design-System Materialization Posture

- `design-system` route entry is primarily implied by folder structure and
  `index.html`
- the first materialization slice should use that existing file-routed posture
  rather than introducing a second routing model for the family
- newly created pages should land in predictable family-local locations under
  `src/frontend/designSystem/`
- logical page-tree moves in v1 should not automatically move folders; the
  curated topology and folder layout may diverge temporarily under governed
  rules

### Suggested Materialized Repo Shape

For a newly created page under `design-system`, expected materialized outputs
are:

- one folder under the approved family path
- one `index.html`
- no behavior module stub by default for the approved v1 template
- one lightweight doc/governance stub at
  `docs/workspace/design-system/generated-pages/<page-slug>.md`

The first slice should not generate:

- page-local CSS files by default
- fake full test implementations for empty pages
- complex behavior scaffolds beyond what is needed to keep the page valid

## Backend Plan

- Route(s):
  extend the existing topology-owning feature rather than inventing a parallel
  backend feature; likely add capability-specific routes under
  `webAppHierarchyBuilder` or a narrow sibling owned by the same seam for:
  - preview design-system topology materialization
  - apply design-system topology materialization
  - create proposed page
  - create proposed subpage
  - update page metadata needed for label/segment edits
- Request/response/error contract:
  - proposed changes should be explicit, not inferred from raw repo diffs
  - preview response should classify changes as:
    - additive
    - compatibility-sensitive
    - blocked
    - invalid
  - apply must refuse blocked or invalid changes
  - route-segment rename must be treated as compatibility-sensitive
  - folder move requests should be rejected in v1 with an explicit blocked code
  - page create and subpage create must require the approved v1 template key
    `static-html-page`
- Feature-local files expected:
  likely extend:
  - `src/features/webAppHierarchyBuilder/contract/*`
  - `src/features/webAppHierarchyBuilder/domain/*`
  - `src/features/webAppHierarchyBuilder/persistence/*`
  - `src/features/webAppHierarchyBuilder/transport/router.ts`
  - `src/features/webAppHierarchyBuilder/integration.ts`
  - `src/features/webAppHierarchyBuilder/index.ts`
  likely add capability files such as:
  - `previewDesignSystemTopologyMaterialization.ts`
  - `applyDesignSystemTopologyMaterialization.ts`
  - `createProposedDesignSystemPage.ts`
  - `createProposedDesignSystemSubpage.ts`
  - `refreshAppliedTopologyTree.ts`
- Cross-feature seams:
  - continue consuming `webAppSurfaceDiscovery` as the source of discovered
    route truth
  - do not import frontend family implementation files directly into backend
    domain logic beyond an explicit materialization seam if one is introduced
  - keep folder/tree alignment cleanup out of this slice
- Authorization enforcement point:
  root-authenticated, root-capability-gated backend routes with deterministic
  validation and no client-side-only approval logic

### Exact Route And Capability Defaults

Use these workflow routes for the first slice:

- `POST /v1/web-app-hierarchy/design-system/pages`
- `POST /v1/web-app-hierarchy/design-system/subpages`
- `POST /v1/web-app-hierarchy/design-system/materialization/preview`
- `POST /v1/web-app-hierarchy/design-system/materialization/apply`
- `GET /v1/web-app-hierarchy/design-system/applied-tree`

The workflow-specific applied-tree read should stay separate from the broader
`GET /v1/web-app-hierarchy/tree` seam so proposed/applied behavior does not
silently change an existing general tree contract.

Use these exact new write capability keys:

- `web-app-hierarchy.create-design-system-page`
- `web-app-hierarchy.create-design-system-subpage`
- `web-app-hierarchy.preview-design-system-materialization`
- `web-app-hierarchy.apply-design-system-materialization`

The applied-tree read should reuse the existing
`web-app-hierarchy.read-tree` capability.

All four new write capabilities should be introduced through an additive
migration and granted to `RootUserAdmin` with mandatory/protected posture.

## Persistence Plan

- Entities / rows affected:
  extend the curated topology model rather than replacing it; likely add fields
  or child records needed for:
  - proposed versus applied posture
  - materialization preview status
  - materialization last-applied metadata
- Migration changes:
  likely one additive migration if current topology records do not yet support
  proposed/applied split or materialization tracking
- Index or uniqueness changes:
  preserve current uniqueness and normalized locator rules; add indexes only if
  preview/apply lookups need them
- Search/filter implications:
  no new broad search surface required in v1; exact and list reads should stay
  explicit
- Compatibility notes:
  create is additive
  display-label rename is low risk
  route-segment rename is compatibility-sensitive
  delete/retire remains deferred
  folder movement remains deferred even when tree movement is allowed logically

## Verification Plan

- Journey tier / workflow scope:
  privileged operator topology-management workflow for one governed frontend
  family
- Unit:
  add unit coverage for preview classification, blocked folder-move handling,
  route-segment rename classification, and materialization planning
- Integration:
  add API integration coverage for create, create-subpage, preview, apply, and
  immediate post-apply tree refresh
- Security:
  allow/deny coverage for privileged routes and explicit confirmation that
  unauthorized callers cannot preview or apply topology changes
- Audit:
  verify denied calls remain audit-visible through existing shared authz
  enforcement; add success-side audit only if the feature design requires it
- Edge:
  cover duplicate slugs, invalid parent placement, missing template selection,
  blocked folder move, and apply-after-stale-preview behavior
- Frontend:
  cover operator flow for create, preview, apply, error, and refreshed tree
- Persistence-backed:
  cover proposed/applied split and last-applied metadata if new persistence is
  introduced
- End-to-end:
  one focused operator journey once a browser surface exists and the slice is
  treated as a meaningful operator workflow
- Concurrency / idempotency:
  review stale-preview and repeated-apply handling
- Performance:
  no special load gate yet; preview/apply should remain deterministic and
  bounded for a single family
- Resilience / failure-injection:
  not primary in v1 beyond honest apply failure behavior
- Compatibility / contract:
  high importance because route-segment rename and future move semantics must
  not silently break existing route truth
- Accessibility:
  required for any browser UI that previews/applies changes through the
  hierarchy tree workflow
- Structured exploratory QA:
  recommended once the first browser-facing apply workflow exists
- QA checklist:
  create a focused checklist if the slice becomes release-gating
- Curated test-run summary:
  create one once executable coverage becomes a blocking gate for the slice
- Waiver / quarantine expectation:
  none by default

## Documentation Plan

- PRD updates:
  create a dedicated PRD for the `design-system` topology materialization v1
  slice
- PRD test-case updates:
  create a matching PRD-derived test-case doc before implementation
- Feature docs:
  update `webAppHierarchyBuilder` and `webAppSurfaceDiscovery` docs if their
  public truth changes
- API contract docs:
  required for any new preview/apply or proposed-topology routes
- OpenAPI:
  update if protected API routes are added
- Postman:
  update maintained collections if `webAppHierarchyBuilder` gains new routes
- Data dictionary:
  update if new topology/materialization entities or fields are introduced
- Architecture map:
  review if the topology-management layer status materially changes
- Standards platform-status snapshots:
  review at minimum:
  - [QA-RELEASE-STATUS.md](/home/gordon/kanbien/docs/standards/platform-status/QA-RELEASE-STATUS.md)
  - [OWASP-ASVS-STATUS.md](/home/gordon/kanbien/docs/standards/platform-status/OWASP-ASVS-STATUS.md)
  if the implementation materially changes current evidence or control posture
- Reconstruction questionnaire:
  review only if materialization changes deployer-local assumptions or helper
  requirements
- Bootstrap and helper docs:
  update if repo scripts or helper flows are added for materialization
- Maintained-artifacts sweep:
  review older hierarchy and topology planning docs plus any stale “not yet
  implemented” wording once the slice lands
- Runbook:
  consider adding a short operator note if preview/apply becomes a supported
  privileged workflow
- Privacy note:
  review only if topology-change metadata or replay-adjacent state starts
  storing user-sensitive data
- Standards review:
  required before the slice is treated as complete
- Repo health review:
  recommended once the first materialization flow lands

## Completion Guardrails

- Blocking QA outcomes:
  preview/apply must not silently mutate repo structure outside the approved
  scope; create and create-subpage must materialize deterministically
- Explicitly deferred verification layers and rationale:
  path/hash migration, folder/tree realignment refactors, delete/retire
  behavior, and replay-state implementation remain outside this slice
- Expected release-gate residual risk statement:
  the first slice should still treat route-segment rename and any future
  folder/tree alignment work as higher-risk follow-on concerns even if create
  flows are stable
