# Project Instructions

This file is the repo constitution.

It should hold durable repo guardrails, not the full procedural change loop.

Follow the architecture guidance in:

- `docs/architecture/system-overview.md`
- `docs/architecture/priniciples.md`
- `docs/architecture/change-control.md`
- `docs/architecture/adr/`

For procedural change-loop requirements such as artifact completeness,
documentation sync, QA evidence, and maintained-artifact sweeps, use:

- `docs/standards/change-artifact-requirements.md`

## Default Change Posture

Assume backwards compatibility is required by default.

Do not make changes that:

- remove or stop persisting durable entity-linked data that may be needed later
- make the system depend on mutable related or external data when a durable
  domain fact is required
- break API, persistence, migration, routing, or feature integration contracts
  without a compatibility plan
- silently change shared platform seams or cross-cutting behavior

If a requested change would be breaking, do not implement it silently.
Instead:

1. explain what would break
2. propose a migration or compatibility strategy
3. wait for approval when the trade-off is non-trivial

## Durable Domain Data Rule

Do not make the system depend only on mutable external or related records for
facts that must remain stable over time.

If a fact about a user or any other domain entity may still matter later for
behavior, permissions, billing, reporting, auditability, compliance, or
historical correctness, persist that fact durably on the owning entity or in a
durable domain record.

If a related record can change, merge, disappear, or be reassigned, do not
replace the durable fact with a live lookup unless the prompt also includes an
approved migration or compatibility strategy.

## API And Entity Behavior Defaults

Unless a prompt explicitly states otherwise and includes an approved
compatibility strategy, follow these defaults for all features.

### Normalization And Validation

- email values must be trimmed and stored lowercase
- empty strings must be rejected, not silently converted to null
- timestamps must be ISO-8601 at the API boundary and UTC in storage
- exact route params must be required, never optional

### System-Managed Fields

Clients must not supply system-managed fields.

System-managed fields include identifiers, audit fields, and lifecycle fields
such as:

- `id` or `<entityName>Id`
- `createdAt`
- `updatedAt`
- `deletedAt`
- version fields
- internal audit metadata

The system must generate or maintain these fields itself.

### Visibility And Soft Delete

- normal read capabilities should exclude soft-deleted rows by default
- deleted rows should be exposed only through explicit capabilities
- soft-deleted rows must not be updated through normal update capabilities
  unless restore or reactivation is explicitly supported

### Mutation Semantics

- every successful update must refresh `updatedAt`
- soft delete must set `deletedAt` and refresh `updatedAt`
- create and update operations must not allow clients to override
  system-managed fields

### Uniqueness

- uniqueness rules must be enforced on normalized values where normalization is
  part of the domain contract
- if a feature declares unique active records, the uniqueness rule must be
  reflected consistently in validation, persistence logic, and storage indexes

### Pagination And Sorting

Default pagination and sorting rules:

- `page` default: `1`
- `pageSize` default: `25`
- `pageSize` minimum: `1`
- `pageSize` maximum: `100`
- default order direction: `desc`

List endpoints should return a consistent shape unless a documented platform
decision says otherwise.

## Tenant Boundary Defaults

Treat tenant context as a first-class security and data-isolation boundary.

Defaults:

- root-user platform capabilities remain distinct from tenant-scoped
  capabilities
- every new capability should be classified explicitly as:
  - `root`
  - `tenant`
  - `shared-cross-tenant` only with explicit approval
- any non-root capability that acts on tenant-scoped data must define:
  - actor type
  - current tenant context
  - governing authz capability
  - cross-tenant deny rule
  - object/entity-level rule when relevant
- authorization for tenant-scoped requests must be evaluated in exactly one
  current tenant context per request
- do not infer tenant context from mutable request bodies when route params,
  session context, or explicit selection state should own it
- cross-tenant access must deny by default unless an explicitly approved
  root/operator capability allows it

### Tenant Session And Token Guidance

- root-user sessions remain platform-operator sessions outside tenant authz
  unless a future design explicitly states otherwise
- tenant-scoped requests need a validated current tenant context in the
  server-side auth/session context
- in this repo, bearer tokens are opaque server-backed session identifiers, so
  tenant context does not need to be embedded directly in the token string
- if a future stateless token or claim model is adopted for tenant actors, any
  embedded tenant context must still be validated server-side and treated as
  exactly one current tenant context per request rather than as a broad
  implicit grant over all memberships

### Searchable Storage Rules

Before introducing a searchable field, define its storage model, supported
operators, and index strategy.

Defaults:

- single-value searchable attributes should be stored in scalar columns
- scalar searchable columns should use an index strategy appropriate to the
  approved operators
- multi-value searchable attributes must not use comma-separated strings
- multi-value searchable attributes that need reliable filtering at scale should
  use junction tables
- array or JSONB storage for searchable multi-value attributes requires
  explicit approval based on query patterns and scale

## Feature Architecture

Prefer feature-local changes inside `src/features/<featureName>`.

Follow the established feature structure:

- `contract/`
- `domain/`
- `persistence/`
- `transport/`
- `integration.ts`
- `index.ts`

For multi-capability features, follow the repo's capability-per-file domain
shape by default:

- `domain/<capabilityName>.ts` for each clear business capability
- `domain/service.ts` as the composition layer that delegates to those
  capability files

Do not collapse multiple distinct capabilities into one large
`domain/service.ts` implementation unless the prompt explicitly calls for an
exception or the feature truly has only one business capability.

Keep platform seams explicit:

- app
- v1 router
- feature router

A feature is not fully integrated until it is explicitly mounted in
`src/routes/v1/index.ts`.

## Anti-Drift Seams

Do not introduce cross-feature or platform/feature coupling casually.

Default rules:

- features must not import another feature's `persistence/*` files directly
- cross-feature reads must go through the owning feature's exported public seam
- `integration.ts` owns feature wiring; `transport/*` must not compose
  repositories, DB adapters, or platform infrastructure
- `domain/*` must not depend on DB-shaped persistence record types when a
  domain-safe shape can be returned by the repository seam
- shared `src/lib/*` modules must not depend on feature-specific contract or
  persistence types

If a change needs a new cross-feature seam:

1. expose a narrow public interface from the owning feature
2. keep the seam capability-specific rather than broad
3. update the architecture docs or ADRs in the same change if the seam is
   enduring

## Migration Safety

Treat applied migration file names and paths as stable.

- use sortable zero-padded prefixes such as `0001_description.sql`
- do not rename applied migrations in shared environments
- fix incorrect applied migrations with a new migration

Before treating a migration-backed change as complete:

- verify the SQL execution model matches the migration logic being used
- do not assume multi-step bootstrap or repair logic is safe inside one
  statement without checking DB visibility semantics
- verify code, live schema, and indexes agree on required columns, normalized
  fields, and uniqueness rules
- prefer adding a corrective migration over editing an already-applied
  migration when repairing existing environments
- re-check representative read and write paths against the live database after
  migration changes
- when a feature adds persistence-backed tests or migration-time dependencies,
  also review shared Postgres test harness files such as:
  `tests/harness/postgres/migrations.ts`,
  `tests/harness/postgres/testDatabase.ts`,
  and the shared persistence test scripts in `package.json`

## Artifact And Doc Sync

When implementation changes the truth of source-independent docs or materially
resets upstream planning artifacts, follow
`docs/standards/change-artifact-requirements.md`.

Do not continue implementation on top of knowingly stale downstream artifacts.
Do not leave source-independent docs describing the pre-change platform once
the implementation is otherwise considered delivered.

## Feature Loop Completion Gate

Do not stop a material feature loop at "code plus a few tests" when the
change-control artifact chain says more outputs are required.

Before treating a backend, frontend, vertical-slice, or permission-sensitive
change as complete:

- determine the required artifact set from
  `docs/standards/change-artifact-requirements.md`
- complete the required maintained-artifacts sweep
- update source-independent docs whose truth changed
- update permission-mapping artifacts when new authz capability keys or grants
  were introduced
- update API contract docs, OpenAPI, and maintained Postman artifacts when the
  route contract changed and those artifacts are maintained for the seam
- update feature docs, status snapshots, and earlier planning artifacts whose
  current-state wording became stale because the slice now exists

Do not present a slice as finished when any required artifact remains missing,
stale, or explicitly deferred without being called out as an incomplete loop.

If time or scope pressure means the implementation must stop before the full
artifact run is complete, say so plainly and classify the result as:

- implementation-only
- partially documented
- blocked on artifact completion

Do not use "done", "complete", or equivalent close-out language for that
state.

## Design-System Signoff Before App UI

For governed frontend families, do not implement new real-app UI until that UI
has been signed off through the `/design-system` loop, unless the user has
explicitly approved an exception for that surface.

Treat this as a hard default for:

- shell chrome
- navigation families
- drawers, dialogs, and menus
- shared page chrome
- reusable controls and settings surfaces
- any new app UI that is supposed to come from the design system rather than
  from a one-off exception

If the signed-off design-system chain is missing or incomplete, stop and do
the design-system governance work first. That means the relevant behavior lock,
canonicals/reference truth, verification artifact, and adoption artifact must
exist and be honest before real-app implementation is treated as allowed.

For first-consumer app adoption of a signed-off governed family:

- consume the shared signed-off source of truth rather than copying the family
  CSS or layout rules into the app
- shared CSS imports alone do not count as governed adoption
- consume the design-system-owned source of truth for:
  - visual styling
  - render structure and markup
  - interaction behavior
  - accessibility and state semantics
- first-consumer app adoption should prefer design-system-owned render and
  controller seams rather than app-local HTML or controller reconstruction
- preserve the signed-off outer page or shell framing, not just the inner
  component styling
- treat app-local copy, counters, spacing, helper text, or wrapper posture as
  drift unless an explicit exception is approved
- duplicating governed component markup in an app page is drift unless an
  explicit exception is approved
- duplicating governed interaction logic in an app page is drift unless an
  explicit exception is approved
- do not treat "close to the canonical" as sufficient parity when the rendered
  browser result still differs from the signed-off design-system truth

If a governed family does not yet expose a consumable shared render or
behavior seam:

- stop and raise the gap for human decision
- do not satisfy adoption by copying HTML structure, ARIA or state behavior, or
  page-local controller logic into the app
- do not treat CSS sharing alone as sufficient governed adoption

Allowed exception posture:

- the user explicitly approves a one-off or pre-signoff app implementation
- the exception is stated as intentional for that surface, such as the login
  page example

Do not infer a pre-signoff exception from urgency, apparent simplicity, or the
existence of partial design-system work.

### App-Page CSS Prohibition

For governed app pages, do not add or modify app-page CSS as part of a page
build.

This is an ironclad repo rule:

- CSS additions or CSS changes for governed page layout, spacing, columns,
  wrappers, shell posture, or page-specific presentation are allowed only as
  part of an explicit `/design-system` loop
- app implementation work must consume existing signed-off design-system CSS
  seams as-is rather than adding page-local CSS in `src/frontend/*/assets/*.css`
- if the page cannot be built cleanly from existing signed-off seams, stop
  rather than inventing app CSS

When the needed styling or layout seam does not already exist:

- do not add app-page CSS anyway
- do not unilaterally move the work into a design-system loop
- raise the blocker and require human intervention to decide whether to:
  - pause the app change
  - run a design-system loop
  - approve an explicit exception

Never treat "small", "temporary", "cleanup", "follow-up", "candidate fix", or
"just enough to make the page work" as justification for adding app-page CSS.

## Frontend Topology Governance

For governed app frontend families, distinguish explicitly between:

- durable frontend topology
- journey-local state
- UI-local state
- support-only routes

Defaults:

- the curated topology model owns only durable product places such as
  permanent pages and durable subroutes
- nested workflow steps, conditional journey branches, and transient screen
  posture must not be modeled as global topology by default
- feature-local state machines, query contracts, or equivalent feature-owned
  seams should own journey-local and UI-local state unless an explicit
  promotion decision is approved
- support-only and technical routes must remain explicitly classified and must
  not be silently treated as normal user-facing pages

Materialization and safety rules:

- curated frontend topology may be the primary source of truth for governed app
  structure, but repo changes must materialize only through explicit preview
  and apply seams
- do not silently hand-edit governed generated routing, import wiring, or repo
  structure when a topology materialization seam owns that surface
- deterministic code must classify topology changes as additive,
  compatibility-sensitive, blocked, or invalid before apply
- compatibility-sensitive changes such as route renames, route removals,
  locator-type changes, or path/hash migrations require an explicit
  compatibility strategy
- moving a journey from hash-backed addressing to path-backed addressing is a
  routing-model migration, not a normal edit

Promotion rule:

- promote a journey-local state into durable topology only when it becomes a
  stable product place with meaningful deep-linking, support, analytics,
  permission, or compatibility requirements

## Frontend State Replay Security

Treat page-state replay and troubleshooting-state capture as separate from
durable topology.

Defaults:

- only explicitly approved low-risk state may be serialized directly in a URL
- rich, sensitive, or unstable replay state must use explicit server-backed
  snapshots rather than direct URL encoding
- secrets, credentials, tokens, proof material, and internal security signals
  must never be serialized into URLs or replay payloads by default
- replay links and snapshots must not act as authority for tenant, role,
  permission, or entity access; current server-side authn and authz must still
  be enforced on replay
- do not treat troubleshooting convenience as justification to weaken privacy,
  auditability, or least-privilege handling of page state

## Pagination Test Robustness

When writing tests for paginated catalogs, collections, or searchable lists:

- do not assume a specific item remains on page 1 unless that is part of the
  documented contract
- prefer explicit filters or a large enough page size for the asserted fixture
  set
- separate pagination-contract tests from business-presence tests when both
  matter

## Root Cause Guardrails

When adding a new feature that depends on existing entities or tables:

- inspect the live schema, not just the current migration files
- inspect the active repository queries and writes for the existing feature
- confirm normalized fields, derived columns, and indexes are represented
  consistently in contract, persistence, and migrations
- treat bootstrap and backfill migrations as runtime logic that must be checked
  with the target database's statement-visibility behavior
- do not assume a feature seam is safe just because the folder structure is
  correct; verify the persistence seam against the real tables it depends on

## Escalate Before Changing

Pause and surface the trade-offs before changing:

- public API contracts
- persisted domain data semantics
- migration discovery or identity rules
- migration semantics or multi-step data backfill behavior
- global error handling behavior
- shared platform wiring or feature registration conventions

## Subagent Approval Rule

Before using multiple subagents for a single user task, pause and ask for user
approval.

Defaults:

- using zero or one subagent does not require advance approval
- using two or more subagents for the same task requires a brief approval check
- explain in one or two sentences why multiple subagents would help before
  asking
- if the user declines, continue with fewer or no subagents
- do not treat this rule as permission to skip needed user approval for other
  risky or breaking changes

## Issue Reconciliation Rule

When a user raises a bug, runtime defect, escaped regression, or asks why an
issue was not caught earlier, treat that as an issue-reconciliation workflow,
not only as a narrow fix request.

Default expectations:

- identify the concrete root cause
- inspect the current executable tests to explain why the issue escaped
- classify whether the gap was missing coverage, wrong-layer coverage, stale
  expectations, unrealistic harness assumptions, or a shared-seam blind spot
- add or repair the most honest tests or governed frontend scenarios that would
  catch the issue and nearby similar failures in future
- create or update a dated note under `docs/workspace/issue-reconciliations/`
  capturing the symptom, root cause, why the loop missed it, and what was added
  afterward

Do not treat an escaped issue as complete just because the implementation bug
was patched if the prevention-layer analysis and test reconciliation were
skipped.

## Skill Routing

This section is routing guidance, not additional repo policy.

Use repo-local skills when the task clearly matches one of these workflows:

- docs drift or docs-vs-code comparison:
  `docs-alignment-auditor`
- repo-wide drift, contradictions, or architectural health review:
  `repo-health-auditor`
- repo-wide standards or compliance audit:
  `repo-standards-compliance-auditor`
- data dictionary maintenance:
  `data-dictionary-maintainer`
- PRD-derived test-case planning:
  `prd-test-case-planner`
- PRD-derived test implementation:
  `prd-test-case-implementer`
- source-independent API contract maintenance:
  `api-contract-maintainer`
- build-ready implementation blueprint maintenance:
  `implementation-blueprint-maintainer`
- rebuild-readiness or bootstrap/helper documentation maintenance:
  `rebuild-readiness-maintainer`
- materially AI-assisted review-note creation:
  `ai-change-reviewer`
- PRD test-case lifecycle review:
  `test-case-lifecycle-reviewer`
- frontend verification architecture, visual regression scenario maintenance,
  screenshot/geometry helper work, frontend gate updates, or
  RTL/responsive/accessibility/geometry coverage for frontend atoms,
  molecules, components, page templates, or pages:
  `frontend-test-case-maintainer`
- screenshot-driven frontend design-system iteration, page-shell/component
  primitive evolution on `/design-system`, or tight visual-contract work for
  responsive/layout/overflow/layering/RTL/magnification behavior:
  `frontend-design-system-loop-maintainer`
- frontend architecture definition, current-state frontend runtime mapping,
  frontend architecture drift review, or ADR maintenance for browser/runtime
  seams: `frontend-architecture-maintainer`
- senior frontend implementation review across architecture, design-system
  adoption, topology/state hygiene, accessibility, performance, UX resilience,
  and frontend verification quality:
  `frontend-implementation-auditor`
- durable frontend topology governance, page versus journey-state
  classification, preview/apply materialization rules, compatibility handling
  for route moves, or repo-structure ownership boundaries for governed app
  routing: `frontend-topology-governor`
- full repo change-loop orchestration once scope is settled:
  `change-loop-orchestrator`
- bug / escaped-regression reconciliation, "why was this missed?", or
  prevention-oriented issue intake:
  `issue-reconciliation-maintainer`
