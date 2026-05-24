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
- `docs/standards/git-workflow-guardrails.md`

## No Fake Determinism

Do not create fake determinism.

Structured artifacts, tables, status values, layer splits, and required fields
must earn their existence by changing allowed behavior, improving evaluation,
or preventing a real drift or failure mode.

Do not add structure that only appears rigorous.

Prefer the smallest structure that creates an enforceable boundary.

Before adding a table, enum, matrix, checklist, or new artifact field, verify:

- what real failure it prevents
- whether different values change allowed behavior
- whether a future maintainer can evaluate it sentence by sentence
- whether it could be replaced by one clearer sentence

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

## Lifecycle And Cleanup Defaults

Before adding durable state that can expire, be abandoned, fail midway, create
external resources, or require retryable cleanup, define the cleanup model in
the relevant PRD, capability matrix, API contract, implementation blueprint, or
vertical-slice artifact.

The cleanup model must state:

- which feature owns the cleanup semantics
- which platform scheduler, support command, job queue, storage lifecycle, or
  manual operational process triggers cleanup
- what happens to expired, abandoned, partial, orphaned, rejected, or failed
  states
- how cleanup failures are recorded and retried
- whether pending or failed-cleanup records continue to count against quota,
  cost, or abuse limits
- which audit, privacy, and runbook notes are required

Default ownership rule:

- platform scheduler or job seams own execution timing and retry mechanics
- the feature that owns the durable entity owns lifecycle transitions,
  cleanup decisions, and external-resource deletion semantics

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

## Asset Upload And Read Decision Gate

Treat asset upload, asset read, asset linking, and user-managed file delivery
as security, privacy, cost, and business-decision boundaries.

Before adding or materially changing any feature, route, job, or UI surface
that uploads, reads, links, displays, downloads, replaces, deletes, or
publishes user-managed assets, create or update an asset consumer decision
record using:

- `docs/templates/asset-consumer-decision-record-template.md`

The decision record must answer:

- which entity owns the asset relationship
- whether the asset is root-owned, tenant-scoped, private, customer-shareable,
  or public
- who may upload, replace, read, download, delete, or publish it
- exact allowed asset kinds, MIME types, maximum size, count, and storage
  footprint
- whether inline rendering, attachment-only delivery, same-origin streaming,
  signed URLs, or public CDN delivery is approved
- which feature owns entity-relationship authorization
- which `assets` capability and consuming-feature capability govern the action
- current tenant context and cross-tenant deny rules
- checksum, actual-byte verification, processing, and malware-scanning
  requirements
- accessibility metadata requirements, including whether alt text, captions,
  transcripts, subtitles, audio descriptions, or decorative posture are
  intrinsic to the asset or contextual to the consuming entity relationship
- rate limits, quotas, cleanup rules, audit events, privacy notes, and
  operational alerts
- lifecycle and retention behavior, including replacement, soft delete,
  hard-delete eligibility, and legal-hold or export requirements

Default posture:

- upload intents must be short-lived, single-use, actor-bound, scope-bound, and
  storage-key-bound
- raw filenames must not become storage paths or authority
- client-supplied MIME type is only an allowlist input, not proof of safety
- SVG is not treated as a normal raster image; uploaded SVG requires approved
  sanitizer verification before readiness and must not be injected directly
  into app DOM
- private assets must not expose permanent raw bucket URLs
- public asset delivery is denied by default unless explicitly approved
- generic asset-library or public file-hosting behavior requires explicit
  approval
- documents, audio, video, customer-shareable files, and public user-uploaded
  files require an approved scanning, processing, quota, retention, and
  operational-alerting posture before production use
- entity-specific authorization belongs to the consuming feature; the `assets`
  feature enforces asset invariants and storage-policy rules

Stop and ask for approval before implementation if the change:

- introduces a new asset kind
- allows public visibility or public delivery
- allows documents, audio, or video
- renders user-uploaded content inline
- skips checksum or actual-byte verification for sensitive assets
- skips malware scanning for customer-shareable files
- adds generic asset-library or file-hosting behavior
- changes object-storage provider assumptions
- introduces shared-cross-tenant asset behavior
- makes entity access depend only on asset ownership rather than the owning
  feature's authorization rule

## Feature Architecture

Prefer feature-local changes inside `src/features/<featureName>`.

Follow the established feature structure:

- `contract/`
- `domain/`
- `persistence/`
- `transport/`
- `integration.ts`
- `index.ts`
- `feature.manifest.json`

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

Each feature must maintain `src/features/<featureName>/feature.manifest.json`
as the declared source of truth for:

- the feature's public seams exported through `index.ts`
- the feature's current cross-feature dependencies
- feature-specific breaking-change risk notes

Treat `docs/architecture/generated/feature-dependency-graph.json` and
`docs/architecture/generated/feature-dependency-graph.md` as maintained repo
artifacts, not optional local diagnostics.

## Anti-Drift Seams

Do not introduce cross-feature or platform/feature coupling casually.

Default rules:

- features must not import another feature's `persistence/*` files directly
- cross-feature reads must go through the owning feature's exported public seam
- cross-feature dependencies must be declared in each affected
  `feature.manifest.json`
- `integration.ts` owns feature wiring; `transport/*` must not compose
  repositories, DB adapters, or platform infrastructure
- `domain/*` must not depend on DB-shaped persistence record types when a
  domain-safe shape can be returned by the repository seam
- shared `src/lib/*` modules must not depend on feature-specific contract or
  persistence types

If a change needs a new cross-feature seam:

1. expose a narrow public interface from the owning feature
2. keep the seam capability-specific rather than broad
3. update the owning feature's `feature.manifest.json`
4. regenerate `docs/architecture/generated/feature-dependency-graph.*`
5. update the architecture docs or ADRs in the same change if the seam is
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

## Product Discovery Conversation And Fast Path

Product Discovery conversation is not a material repo edit. When a user asks to
use Layer 1, Product Discovery, product discovery, or discovery to define,
shape, explore, or clarify a requirement, start with the Product Discovery
interview instead of the material-change git loop.

The following chat openers are Product Discovery shortcuts:

- `new feature`
- `change needed`
- `feature idea`
- `product idea`
- `new request`
- `discovery needed`

When a chat starts with one of these phrases or a close plain-language
equivalent, treat it as a request to launch the Layer 1 discovery conversation
immediately.

The first response in that mode must be a user-facing plain-language summary
and exactly one next question in the requester's everyday language. Do not call
tools, create a packet, draft files, or inspect the repo before that first
response. Target an immediate first response, normally under 30 seconds.

The first response should also prepare the requester for the conversation in
plain language, for example: "I'll walk through this one step at a time so we
get the everyday version clear before we worry about awkward cases."

For that conversation-only mode, do not begin by running `npm run
git:preflight`, checking branch/worktree state, inspecting broad repo docs,
searching for PRD/design-system implementation templates, or reporting repo
state to the user. Start with a plain-language summary and one warm,
business-facing question. Run repo guardrails only if the user later asks for a
governed artifact, reusable harness change, implementation work, or another
material repo edit.

Do not create or fill a Product Discovery packet until the requester has seen
the summary and has answered, corrected, or explicitly deferred the first
question.

Once the interview has enough confidence for the chosen scope, do not ask
whether to turn the conversation into a Product Discovery packet. Move into the
next step with a clear expectation-setting message. State what you will do,
roughly how long it may take, and what the requester should expect next.
Only pause for confirmation if a real unresolved business decision, scope cut,
explicit deferral signoff, or repo-write permission boundary remains.

Do not use a "first-pass draft, then questions" pattern for Product Discovery
conversation mode. If important product questions are already known, ask the
next single most useful question before creating, filling, or assigning
confidence/status to a packet.

Do not present a grouped list of follow-up questions in the first response.
Do not preface the response with process narration such as "Using Product
Discovery mode". The user should experience the first reply as a helpful
person summarizing their request and asking one clear next question.

The first question must be a gentle orientation question about the normal thing
the requester wants to happen, such as who this is for, what the person should
be able to do, where they expect to do it, or what a successful first version
looks like. Do not start with edge cases, failure handling, session revocation,
ownership conflicts, pending work, audit history, billing, permissions
internals, or technical mechanism choices unless the requester explicitly made
that the main concern.

After each answer, summarize what you heard in plain language, offer a simple
best-practice recommendation when helpful, and confirm whether that summary
should be treated as the rule, a usual case, an exception, out of scope, or
deferred until later before asking the next question.

For UX questions, ask about the value the person needs from the experience, not
which widget or component should be used. Do not ask the requester to choose
between controls such as dropdown, picker, drawer, table, modal, or
multi-select unless they already framed the decision that way. Ask about real
needs such as list size, search, comparison, confidence before saving, mistake
recovery, and whether the list may grow. Then make the UX recommendation in
plain language.

When a choice list could grow large, such as choosing tenants for a tenant
admin, assume a searchable selection drawer or equivalent governed picker is
the likely best-practice recommendation. Ask to confirm the value it must
provide rather than asking the requester to pick the control.

Baseline non-functional and compliance requirements are not optional business
choices in Layer 1. Do not ask the business owner whether baseline audit,
history, security, privacy, accessibility, tenant-boundary protection,
operational evidence, or abuse-prevention behavior is needed for the first
version. Assume those are required when the feature touches access, roles,
permissions, customer data, billing, compliance, user-managed assets, or other
sensitive business records.

Record those assumptions as baseline requirements for the next planning step,
then package technical details for technical stakeholders. Ask the requester
only when there is a business-visible policy decision, such as who should see
history, how long it should remain visible to business users, whether customers
should see it, or whether an unusual exception is explicitly requested.

Use the requester's world, not platform vocabulary. Avoid words such as
`tenant`, `authz`, `capability`, `entity`, `persistence`, `API`, `migration`,
`route`, `contract`, `state matrix`, `taxonomy`, `artifact`, `governed`,
`implementation-ready`, and `Technical Steering` in the interview unless the
requester used them first. When the domain itself uses a term such as tenant,
use it only as the business noun and avoid turning it into platform jargon.

When the user explicitly asks for a draft Product Discovery packet, draft
discovery packet, discovery pack, or product discovery packet, the assistant
may create only that draft packet through the Product Discovery fast path
without running the normal material-change start gates.

This exception applies only to draft planning artifacts. The assistant must say:

"Created as a draft discovery artifact; full repo guardrails and artifact
sweeps were intentionally skipped."

Do not use the fast path for validated, governed, complete,
implementation-ready, artifact-complete, promotion-ready, source-code,
migration, contract, feature-manifest, generated-artifact, or implementation
work.

## Feature Loop Completion Gate

Do not stop a material feature loop at "code plus a few tests" when the
change-control artifact chain says more outputs are required.

Before treating a backend, frontend, vertical-slice, or permission-sensitive
change as complete:

- determine the required artifact set from
  `docs/standards/change-artifact-requirements.md`
- complete the required maintained-artifacts sweep
- update affected `feature.manifest.json` files when a feature gained, lost, or
  changed a public seam, a cross-feature dependency, or a breaking-change-risk
  note
- regenerate and verify
  `docs/architecture/generated/feature-dependency-graph.*` when feature
  manifests or cross-feature dependencies changed
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

## Runtime Bug Fix Evidence Gate

When a user reports a visible runtime defect, do not treat source edits,
static inspection, or mocked tests as sufficient evidence that the issue is
fixed or visible.

Before claiming a user-visible runtime issue is fixed, visible, working, done,
complete, or ready for the user to check, complete and report evidence for:

- the live data shape involved in the failing screen, preferably from the
  actual persistence rows or API/projection payload the UI consumes
- the active runtime process serving the user-facing port, including whether it
  was started before the relevant backend/runtime code changed
- whether backend, routing, transport, migration, or server-side projection
  code changes require a process restart
- the frontend assets or modules actually served by the running app, when the
  issue is browser-visible
- at least one regression test or governed browser scenario that matches the
  observed live-data shape rather than only a simplified mock shape
- a mock-honesty check showing that test fixtures do not encode rejected,
  invented, or convenience fallback behavior that production does not have
- the scoped test/gate commands rerun after the final code change
- a dev-server restart and served/live verification when backend/runtime code
  changed

If any item cannot be completed, say exactly which item is missing and classify
the state as `implementation-only`, `partially verified`, or
`blocked on runtime verification`. Do not imply the user should see the fix
until the relevant runtime evidence exists.

## User-Visible Regression Rule

When a user says they are not seeing a claimed fix, immediately switch from
source-edit mode to runtime reconciliation before making more speculative
changes.

Required order:

1. confirm the active server process, port binding, and process start time
2. confirm served frontend assets contain the expected change when frontend
   code is involved
3. inspect the live API response, projection payload, or database rows behind
   the failing screen
4. compare the live shape against the regression fixture and identify any
   mismatch
5. only then patch source, tests, or data-handling behavior

Do not continue making frontend-only or backend-only guesses while these checks
remain unperformed.

## Mock Honesty Gate

When fixing a runtime bug, compare test mocks and browser fixtures against the
live persistence/API shape before trusting the test result.

Mocks must not contain fallback behavior, inferred behavior, route aliases,
default values, or convenience data that production does not provide unless
that behavior is explicitly part of the contract under test.

If the user rejects an interpretation, remove that interpretation from source,
tests, mocks, and docs before continuing. Do not leave rejected behavior in a
test harness where it can make a regression look covered.

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
- before doing further material work on an existing governed durable app page,
  refresh a page implementation audit that states:
  - whether the page still owns local render or controller behavior
  - which design-system seams it actually consumes today
  - the remediation path before more page work if local implementation still
    remains

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

### Design-System Token Source Of Truth

For governed frontend surfaces, signed-off token routes under
`/design-system/tokens` are the only approved source of truth for the primitive
visual and structural decisions they define.

This applies to token families such as:

- background and environmental page layers
- colours and semantic state colours
- typography tokens such as paragraph and header scales
- container and container-section surfaces
- icon-button and tooltip primitives
- structural token seams such as entity page, nested entity record, list page,
  and filter panel structures

Every governed page, component, pattern, template, or app surface that needs a
decision already defined by a signed-off token must be built from that token
source of truth.

Do not redefine, approximate, fork, or locally recreate a signed-off token
decision in page CSS, component CSS, inline styles, duplicated markup, copied
controller logic, fixture-only classes, or one-off app helpers.

If a needed primitive visual or structural decision is not yet defined under
`/design-system/tokens`, stop and raise the design-system gap before building
the downstream page or component. Do not invent the missing token locally in
the consumer.

If a downstream surface needs to vary from a signed-off token, treat that as a
new design-system decision:

1. return to the `/design-system/tokens` loop
2. create or update the relevant token route and governance artifacts
3. verify the rendered token behavior
4. only then consume the updated token in downstream pages or components

Token-route HTML is review truth, not a license to copy route-local markup into
apps. Downstream consumers must use the shared token, render seam, controller
seam, CSS variable, or documented adapter named by the design-system artifact
chain.

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

Current root-admin migration posture:

- selected root-admin suites now use path-backed canonical routes:
  - `/root-admin`
  - `/root-admin/web-app-hierarchy`
  - `/root-admin/users`
  - `/root-admin/tenants`
  - `/root-admin/tenant-admins`
  - `/root-admin/roles`
  - `/root-admin/build/backlog`
- legacy hash URLs such as `/root-admin#users` and
  `/root-admin#web-app-hierarchy` are compatibility aliases during migration,
  not canonical route truth
- do not introduce new hash-backed root-admin suite destinations when the
  surface is intended to be a durable product place

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

## Git Hygiene And Branching

Default to a branch-per-task workflow for material repo changes.

Before any material repo edit begins, and before any promotion or merge work,
use the repo's executable git guardrails.

Material repo edit means any non-trivial add, remove, or change to code,
tests, docs, migrations, maintained artifacts, workflow files, or committed
repo configuration.

For this repo, the guardrail order is:

- `npm run git:preflight`
- `npm run git:promote -- --source <branch-or-commit>`

When parallel chats or sibling worktrees are active, also run:

- `npm run git:worktree-audit`

For material chats with a bootstrap artifact, run preflight against that
artifact:

- `npm run git:preflight -- --bootstrap <bootstrap-path> --require-base`

This is a start gate, not a later cleanup step.

If `npm run git:preflight` reports a blocking state:

- do not begin the edit
- do not defer the check until commit time
- repair or isolate the repo state first

For repo-local Codex sessions, prefer launching through:

- `/home/gordon/kanbien/src/scripts/launchGuardedCodex.sh`

That launcher runs `npm run git:preflight` before Codex starts so blocked repo
states fail before any edit loop begins.

Defaults:

- for non-trivial code, test, docs, migration, or artifact changes, create a
  dedicated task branch before editing when practical
- use a short branch name derived from the task, preferably
  `codex/<scope>-<slug>`
- read-only investigation, tiny local inspection, or trivial one-line edits do
  not require a new branch by default
- if the current branch is already a clean, dedicated branch for the scoped
  task, continue on it rather than creating another branch
- if the worktree already contains unrelated changes, do not silently create a
  new branch and pile new work on top; pause, surface the state, and ask how to
  proceed when separation is non-obvious
- do not auto-commit immediately after implementation just because the task is
  technically working
- wait for explicit user approval such as "looks good", "commit this", or
  equivalent before creating commits
- when approved to commit, prefer one or more scoped commits rather than one
  large mixed commit
- do not push by default after committing unless the user asks for a push
- in this repo, after a scoped task branch is committed and
  `npm run git:promote -- --source <branch-or-commit>` reports
  `SAFE_FAST_FORWARD`, user requests such as "promote and push", "push",
  "ship", or equivalent mean fast-forward/promote the task to `main` and push
  the promoted `main` to `origin/main`
- do not stop at branch-only publishing after a successful promotion guardrail
  unless the user explicitly asks to publish only the task branch
- treat GitHub or remote-host suggestions to open a pull request as generic
  output, not as this repo's workflow, unless the user explicitly asks for a PR
- do not treat local `main` as promotion truth when it differs from
  `origin/main`; promotion decisions must use the GitHub baseline
- if `npm run git:preflight` reports a blocking state, do not continue with
  material work until the repo state is repaired
- if `npm run git:promote` reports `TARGET_STALE_BLOCK`,
  `CHERRY_PICK_REQUIRED`, or `DIRTY_BLOCK`, do not continue with merge or
  promotion work until that state is resolved

## Decision Evidence Gate

For every material Codex chat in this repo, decision capture is part of the
work, not a separate optional follow-up.

Material decision means any choice, approval, deferral, model shape, field
classification, capability behavior, design-system signoff, root-admin
adoption posture, provenance rule, migration posture, or implementation
constraint that later work may need to explain, execute, audit, or reverse.

During the chat:

- record decisions as they are made when they affect durable product,
  design-system, entity, capability, evidence, API, persistence, routing,
  security, testing, or artifact truth
- use `npm run decision-evidence -- quick-decision` for simple live capture
  when an evidence packet already exists
- use `npm run decision-evidence -- record-decision --input <json>` for richer
  rows
- attach relevant decisions to evidence packets with
  `npm run decision-evidence -- attach-decision`

At material closeout:

- run `npm run decision-evidence -- validate`
- summarize decisions recorded in the chat
- summarize decisions still marked `needs_review`
- state explicitly if no material decisions were made

Source refs must be real resolver values. For LLM conversations, use the
actual rollout transcript path, stable `llmChatId`, cloud transcript ID, or
future persisted conversation record when available. Do not invent
chat-looking source keys. Workspace chat records may be supplemental summaries,
but they are not the primary source when the real transcript or persistent
conversation source is available.

Accountability defaults:

- use `gordon.rose` only for choices, reviews, approvals, or signoffs Gordon
  explicitly made
- use `codex_5_5` for Codex-authored, inferred, source-backed, or
  needs-review rows
- use `approvedByActorKey: "not_approved"` unless explicit human approval
  exists

### Chat Bootstrap Gate

For any material multi-file chat, branch-per-task is no longer sufficient on
its own. Use an explicit chat bootstrap before editing.

Required bootstrap outputs:

- an explicit base commit, not just the current checked-out branch name
- an explicit base ref, normally `origin/main`
- a dedicated worktree for the chat when parallel chats are active or likely
- a dedicated task branch created from that explicit base commit
- a short bootstrap record capturing the branch, worktree path, and intended
  write scope

Default bootstrap rules:

- do not start a new material chat from ambient `HEAD` when other chats may
  still be in flight
- do not assume the currently checked-out branch is a safe starting point just
  because its name looks related
- if another chat may commit while this chat is in progress, prefer a separate
  worktree rather than only a separate branch
- if the bootstrap record is missing, treat the chat as not yet isolated

Preferred bootstrap artifact:

- create a short record under `docs/workspace/chat-bootstraps/` using
  `docs/templates/chat-branch-bootstrap-template.md`

Minimum record fields:

- chat scope or slug
- base commit
- source branch at bootstrap time
- base ref used for the start gate
- dedicated branch name
- worktree path
- intended write set
- known shared seams

When the bootstrap exists, it must match the current branch and worktree path.
Treat a bootstrap mismatch as an isolation failure, not as harmless paperwork.

Do not treat this record as optional process garnish. Its purpose is to stop a
later commit in one chat from silently becoming the effective base for another.

## Multi-Chat Parallel Work

When multiple chats are active against the same repo, treat them like separate
engineers working concurrently rather than like one shared scratchpad.

Defaults:

- each material chat should have one scoped task branch of its own; do not use
  one branch for multiple unrelated chats
- do not silently continue a chat on a branch that already contains unrelated
  work from another chat; pause, surface the overlap, and ask how to proceed
  when separation is non-obvious
- prefer parallel chats only when their intended write sets are disjoint or
  overlap only in an explicitly planned integration seam
- if two chats need to edit the same files or the same durable seam, either:
  - designate one chat as the integration owner
  - or serialize the work instead of pretending the changes are independent
- shared-seam work must be called out early when multiple chats are active
- treat the following as shared seams by default:
  - platform routing and feature registration
  - shared auth, authz, and security middleware
  - migrations and persistence harnesses
  - exported feature public seams in `src/features/<feature>/index.ts`
  - governed generated or materialized outputs
  - architecture docs, ADRs, and maintained source-independent contracts
- when starting a new material chat while another is active, create the new
  branch from an explicit recorded base commit rather than from whatever `HEAD`
  currently points to
- if a chat needs to be rebased onto a newer commit from another chat, record
  that rebase decision explicitly in the bootstrap artifact or handoff
- if `npm run git:worktree-audit` reports a dirty worktree whose `HEAD` does
  not descend from `origin/main`, pause new material work until that worktree is
  promoted, rebased, or explicitly preserved as a recovery case
- before merging or handing work off, each chat should state its blast radius:
  changed features, changed shared seams, changed maintained artifacts, and any
  known downstream dependents
- when a change depends on another in-flight chat, record that dependency
  explicitly in the handoff or PR summary rather than assuming merge order will
  be obvious later

Do not treat multi-chat concurrency as justification for weakening the repo's
normal expectations around branch isolation, narrow public seams, compatibility
planning, or artifact honesty.

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
- for browser-visible or runtime defects, complete the Runtime Bug Fix Evidence
  Gate before claiming the user should see the fix

Do not treat an escaped issue as complete just because the implementation bug
was patched if the prevention-layer analysis and test reconciliation were
skipped.

## Skill Routing

This section is routing guidance, not additional repo policy.

Repo-local skills are organized by category under `.codex/skills/`; see
`.codex/skills/README.md` for the current map. Use the stable skill names
below for routing rather than depending on the category folder path.

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
- branch-per-task workflow setup, worktree hygiene rules, or approval-gated
  commit/push workflow maintenance:
  `branch-and-commit-governor`
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
