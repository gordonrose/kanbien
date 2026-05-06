# Change Artifact Requirements

## Purpose

Define which artifacts must exist for a change to be considered sufficiently
specified, documented, and verifiable.

This document is intentionally procedural.
It complements ADRs and architecture guides rather than replacing them.

## Product Discovery Gate

### Product Discovery Conversation

When the user asks to use Layer 1, Product Discovery, product discovery, or
discovery to define, shape, explore, or clarify a requirement, begin with the
Product Discovery interview.

This is not yet a material repo edit. The assistant should not start by running
git preflight, checking branch/worktree state, inspecting broad repo docs,
searching for PRD/design-system implementation templates, or reporting repo
state to the user.

The first response should summarize the request in plain language and ask
exactly one next product question needed to improve confidence.

The first response must happen before tool use, repo inspection, packet
drafting, or file creation. Do not create or fill a Product Discovery packet
until the requester has seen the summary and has answered, corrected, or
explicitly deferred the first question.

Do not use a first-pass-draft-then-questions pattern for Product Discovery
conversation mode. If important product questions are known, ask the next
single most useful question before packet creation, confidence assignment, or
ready-status handoff.

Do not present a grouped list of follow-up questions in the first response.
The requester should experience the first reply as a plain-language summary
and one warm, business-facing question.

### Draft Fast Path

When a user explicitly asks for a draft Product Discovery packet, draft
discovery packet, discovery pack, or product discovery packet, the assistant
may use the fast path.

Fast path mode:

- creates a draft planning artifact only
- skips repo guardrails and broad sweeps, not discovery judgment
- does not run `npm run git:preflight` by default
- does not run branch, bootstrap, worktree, promotion, or maintained-artifact
  sweep checks by default
- does not inspect broad architecture docs unless explicitly requested
- inspects only directly relevant Product Discovery README/template files
- writes exactly the requested packet file and avoids unrelated edits
- stops and asks if a required template cannot be found quickly

Fast path output must say:

> Created as a draft discovery artifact; full repo guardrails and artifact
> sweeps were intentionally skipped.

Do not treat a fast-path draft as validated, governed, complete,
implementation-ready, artifact-complete, or promotion-ready.

If important product questions are already known and the user has not
explicitly asked to bypass the interview, ask before filling the packet.

Preferred command:

```sh
npm run product-discovery:draft -- --slug <slug> --title "<title>"
```

Validation remains separate:

```sh
npm run product-discovery:validate -- <packet-path>
```

### Governed Product Discovery

If the user asks for validated, governed, complete, implementation-ready,
artifact-complete, promotion-ready, or similar Product Discovery output, use
the existing full guardrails. Governed mode runs the normal repo start gates
and artifact requirements.

Preserve current safety behavior for source code, migrations, contracts,
feature manifests, generated artifacts, and implementation work.

### Required Governed Gate

Before Technical Steering, PRD, capability matrix, or implementation planning,
create or update a Product Discovery packet using
`docs/templates/product-discovery-packet-template.md` when a change is:

This gate does not override the Product Discovery conversation gate above. If
the user is still at the discovery-conversation stage, ask the first single
focused question before creating or filling the packet.

- a new feature family
- a material vertical slice
- a governed frontend family or first-consumer adoption
- a permission-sensitive product change
- asset-backed product behavior
- reporting or read-model behavior
- workflow builder or workflow execution behavior
- post-iteration feedback that changes product intent

Gate checks:

- packet exists, or an explicit exemption is recorded
- initial request summary and discovery interview confidence are recorded
- taxonomy classification is filled
- product template or generic template reference is recorded
- multi-actor job-to-be-done bridge is filled when the request implies
  configuration, governance, support, root/operator, system, or external
  provider actors
- use cases trace to the product capability breakdown
- meaningful context variations and unhappy paths are captured or explicitly
  marked out of scope/deferred
- high-impact business questions are answered or marked blocking/deferred
- handoff status is valid
- Technical Steering risk flags are marked

For login or authentication requests, use
`docs/product-discovery/templates/authentication-access-template.md` and record
the relevant answers or deferrals in the Product Discovery packet. Do not move
auth-specific checklist content into the universal packet template.

If no existing family or product template fits, the packet must include a New
Family Candidate section. If a new UX pattern or governed design-system
extension may be needed, the packet must include a UX / Design-System Extension
Signal section.

Implementation planning must not proceed from `blocked-new-family-steering`
without a Technical Steering or design-system governance decision.

Do not duplicate Layer 1 stop-condition prose in other standards files; the
Product Discovery packet template is canonical for Product Discovery statuses
and stop conditions.

## Product Discovery Taxonomy Governance Gate

When the Product Discovery taxonomy or product templates change, review
`docs/product-discovery/taxonomy.md` and record:

- change type
- reason and motivating examples
- affected packets or product templates reviewed
- compatibility or deprecation note when relevant
- replacement value when a value is deprecated or renamed
- product template taxonomy version or review field updates where relevant

Adding or deprecating a taxonomy axis requires explicit approval because axes
change the shape and cognitive cost of future Product Discovery packets.

## Technical Steering Gate

For material work that has passed Product Discovery and may affect
architecture, seams, shared code, platform behavior, governed frontend,
permissions, persistence, assets, runtime evidence, or source-independent
artifacts, create or update a Technical Steering packet before Story Breakdown.

Use:

- `docs/templates/technical-steering-packet-template.md`

Gate checks:

- scope elements are classified as feature-local, feature-public-seam,
  platform-seam, shared-lib-candidate, design-system-seam,
  architecture-foundation-required, or blocked
- deterministic signal checks are completed for platform seams, API contracts,
  persistence, permissions, governed frontend, frontend surfaces, shared code,
  data dictionary, QA/runtime evidence, and docs artifacts
- shared versus feature-specific ownership is decided before Story Breakdown
- risk flags name the required Layer 3 signal and Layer 4 task type
- steering decisions include compatibility or migration strategy when relevant
- blocked architecture decisions do not proceed as implementation tasks

Canonical Technical Steering field definitions live in the template.

### Layer 2 To Layer 3 Blocker-Resolution Loop

Before moving from Technical Steering into Story Breakdown, the harness must
proactively inspect the Technical Steering packet's Blockers, Artifact
Obligations, Architecture Decision Analysis rows, Browser Security Posture, and
Layer 3 Handoff rows.

When any blocker, blocking artifact obligation, blocked handoff row,
incomplete architecture decision, or required security/design artifact remains,
the harness must not merely report the list and wait. It must start a guided
blocker-resolution conversation before creating the Story Breakdown packet.

The conversation should:

- classify each item as requester-answerable product policy,
  architecture/security/design-system decision, required planning artifact,
  implementation prerequisite, future-scope deferral, or non-blocking
  technical follow-up
- pick the next smallest requester-answerable blocker first
- ask one plain-language question at a time
- update the owning artifact after each answer
- re-run the relevant validator after changes
- after recording and validating an answer, immediately ask the next smallest
  unresolved question for the same blocker when one remains
- continue without waiting for the requester to ask "what next" until no
  requester-answerable blocker remains, the blocker is explicitly deferred to a
  named owner/layer, or the requester asks to pause

Creating a draft artifact is not the same as resolving a blocker. For
architecture/security/asset or design-system blockers, the harness must ask for
human review before changing the blocker to answered, resolved, approved,
ready-for-task-breakdown, or non-blocking. A proposed record may be created only
as review material, and its status must stay proposed, draft, needs-review, or
blocked until feedback is recorded.

For asset/download blockers, the review question must name the business-visible
posture being proposed, such as transient download, stored generated file,
inline rendering, public delivery, retention, access, or audit behavior.

For architecture-foundation decisions, the harness must run a structured
Architecture Decision Interview before marking the decision answered. The
interview is not a checklist dump; ask one question at a time, but do not mark
the decision resolved until the owning artifact records the answers or explicit
deferrals for:

- future consumers and reuse expectations
- expected volume, size, concurrency, and burst behavior
- expected response time, timeout, synchronous versus asynchronous posture, and
  user-visible waiting states
- deterministic output requirements, idempotency, versioning, and regeneration
  compatibility
- source data contract, schema ownership, validation, and rendering boundary
- dependency or provider choice, including local/server runtime constraints and
  upgrade/patch posture
- failure modes, partial output rules, retry behavior, cancellation, and
  recovery
- security, privacy, tenant/scope isolation, logging redaction, and permission
  boundaries
- audit events, operational metrics, alerting, runbook expectations, and
  support diagnostics
- accessibility, localization, long-content handling, and user-visible quality
  bar
- cost limits, quota/rate limits, abuse controls, and cleanup/retention
- migration, reversibility, compatibility with future broader rollout, and
  explicitly deferred behavior

If any answer is unknown, record it as a named blocker, assumption, or deferred
owner/layer. Do not convert the architecture decision to approved, answered, or
ready-for-task-breakdown while these dimensions are blank or silently assumed.
After each architecture interview answer, update the owning artifact and then
ask the next unanswered interview dimension immediately. Do not require a
separate "next?" prompt from the requester.

For new visual or interaction design-system blockers, start with a labeled
demo rendering in the `/design-system` proving ground so visual feedback and
behavior can be checked immediately. The demo is review material only. It must
not be treated as signed off, approved, resolved, or app-consumable.

After demo feedback, the required governance order is behavior-lock review,
then reference-pack or canonical review, then verification checklist refresh,
then adoption contract refresh. Do not generate downstream design-system
artifacts as if they are signed off before the earlier review gate is complete.
If draft downstream artifacts are created as scaffolding, mark them explicitly
as draft review material and keep the blocker open.

The harness may create a first-pass blocked Story Breakdown map only when:

- all requester-answerable blockers are answered, cut from scope, or explicitly
  deferred with owner and layer
- architecture/security/design-system blockers are represented as named Layer 3
  unblock stories or blocking artifact obligations
- blocked Layer 3 handoff rows are either removed from the active Story
  Breakdown scope or represented in a Layer 3 unblock queue
- the Technical Steering packet validates, or the remaining validation blocker
  is explicitly accepted by the requester with a named owner and next artifact

When structural questions remain, the Story Breakdown packet is a map of the
work and unblock queue, not permission to continue toward Task Breakdown,
implementation blueprinting, or Delivery. The harness must describe it as a
first pass and immediately move to the named architecture, security,
design-system, or artifact questions that unblock the work.

This loop is conversational by default. Do not dump a checklist of all blockers
when one focused question can resolve the next useful item.

## Story Breakdown Gate

For material work that has an approved Technical Steering packet, create or
update a Story Breakdown packet before Task Breakdown or Delivery begins.

Use:

- `docs/templates/story-breakdown-packet-template.md`

Gate checks:

- story ID, value type, delivery shape, job to be done, actor or system
  perspective, outcome, and acceptance criteria are recorded
- acceptance criteria map to proof layers and required test families
- dependency and feature-seam obligations are recorded
- capability-matrix posture is recorded for each acceptance criterion
- artifact obligations are recorded before implementation work starts
- refactor-first and architecture-foundation blockers are represented as
  stories or blockers rather than hidden inside implementation work
- architecture invention outside Technical Steering is blocked
- Layer 2 architecture classification rows are preserved and converted into
  task-type signals for Layer 4 reconciliation
- blocked packets include a Layer 3 Unblock Queue that maps unresolved required
  decision questions and blocking artifact ledger rows to the smallest human
  decision or artifact workflow needed next

Validation:

```sh
npm run story-breakdown:validate -- <packet-path>
```

Do not mark a story ready for Task Breakdown while validation is blocked unless
the requester explicitly accepts the named blocker.

Canonical Story Breakdown field definitions and stop conditions live in the
template. Do not duplicate the full stop-condition list here.

## Task Breakdown Gate

For material work that has a Story Breakdown packet, create or update a Task
Breakdown packet before Layer 5 Delivery begins.

Use:

- `docs/templates/task-breakdown-packet-template.md`

Gate checks:

- selected story scope comes from a story marked `ready-for-task-breakdown`
- story acceptance criteria, capability rows, proof obligations, dependencies,
  artifact ledger, and blockers are preserved
- every task has a stable ID, parent story, acceptance-criterion coverage,
  capability coverage, allowed write set, non-goals, dependencies, shared
  seams, proof plan, artifact obligations, and branch/worktree/bootstrap
  strategy
- every task routes to the matching task-type guardrail reference and records
  approval evidence before queueing
- every queued task records structured task guardrail evidence using the exact
  required check IDs from its task-type reference
- every queued implementation task records code placement and extraction
  posture so feature-local, platform-seam, shared-lib, and stay-put decisions
  are explicit
- shared-code placement and extraction decisions route through the shared-code
  placement guardrail when code may move to `src/lib`, stay behind an owning
  feature seam, or require extraction before implementation work
- every queued task classifies its allowed write set and records forbidden
  work so Delivery can later compare the actual diff against the approved
  implementation envelope
- refactor-first and architecture-foundation work is split into separate tasks
- only unblocked tasks are handed to Delivery

Validation:

```sh
npm run task-breakdown:validate -- <packet-path> --story <story-packet-path>
```

Do not hand a task to Delivery while validation is blocked unless the requester
explicitly accepts the named blocker.

## Minimum Required Artifacts By Change Type

### Feature-local backend capability

Required:

- capability matrix rows
- PRD or PRD refinement
- PRD-derived test-case doc
- end-to-end journey scenario inventory when the slice changes a meaningful
  customer or operator workflow, state-transition path, tenant or role
  variation, remediation or recovery flow, or another multi-step journey
- executable tests at the required layers
- QA release-gate review when the change is material enough to affect blocking
  workflow or release confidence
- QA coverage-matrix classification naming the required verification layers
- feature docs update when behavior is user-facing or operator-relevant
- traceability-clean mapping between active PRD-derived `TC-*` IDs and
  executable tests, unless an explicit deferred or pending-review posture is
  recorded in the PRD test-case doc
- downstream blueprint refresh when the PRD, source-independent contracts, or
  verification inventory changed after the current blueprint draft was written
- source-independent doc and status sync for affected API contracts, data
  dictionary entries, feature docs, OpenAPI, architecture summaries, and
  platform-status snapshots where the implemented slice changed their truth
- feature manifest and dependency-graph sync when the slice adds, removes, or
  changes a feature public seam or cross-feature dependency
- maintained-artifacts sweep covering status snapshots, registry or index docs,
  and earlier planning artifacts whose wording became stale because the slice
  now exists or materially changed current platform posture
- async job-processing decision gate recorded in the PRD, capability matrix,
  implementation blueprint, or equivalent planning artifact for every backend
  or backend-adjacent slice. If the slice does not need background work, record
  why synchronous execution is acceptable. If it does, define the durable
  owning entity, job type, payload version, smallest safe payload, retry and
  dead-letter posture, idempotency rule, tenant/root context revalidation,
  progress/audit metadata, cleanup semantics, feature-manifest dependency, and
  executable coverage for enqueue and handler behavior.

Consider:

- ADR if a new enduring pattern or shared seam is introduced
- runbook/privacy note if security, operator flow, or personal data changes
- reconstruction questionnaire or bootstrap-guide update if runtime
  dependencies, interchangeable tools, or required local helpers changed
- structured exploratory QA note for high-risk changes when deterministic
  automation alone is not sufficient
- QA checklist, defect-feedback review, or waiver/quarantine record when the
  slice needs those controls to satisfy the QA release gate
- curated source-controlled test-run summary when the slice is used as a
  blocking-gate, standards-evidence, or reusable QA example

### Full vertical slice

Required:

- capability matrix rows
- PRD
- PRD-derived test-case doc
- end-to-end journey scenario inventory
- frontend description
- frontend route and screen-state definition
- backend contract description
- persistence impact description
- permission expectations
- accessibility considerations
- design-system impact note
- performance review
- degraded-state UX note
- telemetry and operational review
- docs update plan
- standards gate review

Consider:

- ADR if browser architecture, auth/session model, permission model, or other
  enduring patterns change

### Shared platform or cross-feature seam change

Required:

- ADR
- system-overview update
- principles update if guardrails change
- affected `src/features/<featureName>/feature.manifest.json` updates
- regenerated `docs/architecture/generated/feature-dependency-graph.*`
- PRD or design record if the change is feature-driven
- standards gate review

### Privileged or permission-sensitive capability

Required:

- capability boundary classification:
  `root`, `tenant`, or explicitly approved shared-cross-tenant
- authentication requirement
- authorization expectation
- permission-mapping updates when the slice introduces new authz capability
  keys or changes role grants
- allow and deny test cases
- audit expectation
- standards gate review

If the capability is tenant-scoped, also require:

- current tenant context rule
- explicit cross-tenant deny rule
- object/entity-level rule when relevant
- source-independent note of whether the current tenant context is held in
  server-side session state, validated token claims, or another approved auth
  context mechanism
- frontend visibility, disablement, or denied-state expectations when a
  frontend surface exists

If the permission model itself changes, add:

- dedicated PRD
- ADR if the enforcement pattern is enduring

### Asset upload, read, or delivery capability

Required before adding or materially changing any feature, route, job, or UI
surface that uploads, reads, links, displays, downloads, replaces, deletes, or
publishes user-managed assets:

- completed asset consumer decision record using
  `docs/templates/asset-consumer-decision-record-template.md`
- owning feature and entity-relationship authorization rule
- `assets` feature capability expectation and consuming-feature capability
  expectation
- asset kind, exact MIME allowlist, size limit, count or storage footprint, and
  delivery mode
- tenant context rule and cross-tenant deny rule
- upload-intent expiry, single-use, actor binding, scope binding, and generated
  storage-key binding
- checksum, actual-byte verification, processing, and malware-scanning posture
- accessibility metadata posture, including whether alt text, captions,
  transcripts, subtitles, audio descriptions, or decorative decisions are
  asset-level or contextual to the consuming feature
- public visibility decision, with explicit approval when public delivery is
  allowed
- rate limit, quota, cleanup, retention, audit, privacy, and operational alert
  expectations

Stop for explicit approval before implementation if the change introduces a
new asset kind, public visibility, documents, audio, video, inline rendering of
user-uploaded content, generic asset-library behavior, shared-cross-tenant
asset behavior, or any skipped verification/scanning posture for sensitive or
customer-shareable files.

### Materially AI-assisted change

Required:

- AI-assistance/provenance note for accepted output
- independent verification note naming the repo source of truth used
- deterministic test or verification evidence for behavior-changing output

Also required when generated code, snippets, or dependencies are adopted:

- dependency/license/provenance review note

Also required for high-risk AI-assisted changes such as auth, crypto, secrets,
security controls, compliance logic, migrations, or incident/monitoring logic:

- model/tool/version traceability
- expert-review note

### User-visible runtime defect fix

Required before calling a browser-visible or otherwise runtime-observed defect
fixed, complete, working, or ready for user verification:

- issue-reconciliation note under
  `docs/workspace/issue-reconciliations/` when the defect escaped prior
  verification or the user reports that a claimed fix is not visible
- live data/API evidence naming the concrete persistence rows, projection
  payload, or route response shape behind the failing screen
- active runtime process evidence naming the user-facing port, process start
  time or process identity, and whether a restart was required
- served-asset evidence for browser defects, confirming the running app serves
  the edited frontend module or static asset
- restart evidence when backend, transport, route, migration, server-side
  projection, or other runtime-loaded code changed
- mock-honesty evidence showing relevant fixtures do not encode rejected,
  invented, or production-absent fallback behavior
- executable regression coverage that matches the observed live-data shape
- scoped command results after the final source change
- final response checklist covering:
  - live process checked
  - backend restarted if needed
  - served asset checked when frontend-visible
  - live data/API inspected
  - mock honesty checked
  - regression added or repaired
  - scoped tests run

Recommended template:

- [`runtime-bug-fix-evidence-template.md`](/home/gordon/kanbien/docs/templates/runtime-bug-fix-evidence-template.md)

If any required evidence is unavailable, classify the result as
`implementation-only`, `partially verified`, or `blocked on runtime
verification`. Do not present the change as user-visible until runtime
verification is complete.

## Required Documentation Dimensions For Build-From-Spec Work

To make a capability reconstructable from docs and templates, document:

- business intent
- capability boundary:
  `root`, `tenant`, or explicitly approved shared-cross-tenant
- actor and permission model
- tenant context rule when relevant
- frontend surface and states if applicable
- owning frontend module and journey when a frontend surface exists
- route family and launch surface when a frontend surface exists
- backend route and contract
- persistence impact
- lifecycle and cleanup rules for expired, abandoned, orphaned, failed, or
  externally stored resources
- async/background job posture, including the owning durable entity, safe
  payload shape, enqueue seam, handler seam, retry/dead-letter model,
  idempotency model, tenant/root execution context, progress/audit metadata,
  and cleanup behavior when the capability involves background work, bulk
  actions, external calls, delayed execution, or retryable processing
- security, privacy, and audit expectations
- performance expectations and degraded-state behavior when a frontend surface
  exists
- analytics, logging, monitoring, and alerting expectations when a frontend
  surface exists
- verification layers
- end-to-end journey requirements and tier when applicable
- QA coverage-matrix classification and required human QA artifacts when
  applicable
- docs and operational artifacts required

## Frontend Slice Gate

For a material frontend slice, do not treat "frontend description" as
sufficiently specific on its own.

Recommended starting templates:

- [`frontend-slice-template.md`](/home/gordon/kanbien/docs/templates/frontend-slice-template.md)
- [`frontend-telemetry-review-template.md`](/home/gordon/kanbien/docs/templates/frontend-telemetry-review-template.md)

At minimum, define or update:

- frontend module or feature description
- route and screen-state definition
- backend dependency map
- permission expectations
- accessibility considerations
- design-system impact note
- performance review
- degraded-state UX note
- test coverage plan
- docs update plan

If the slice is also security-, privacy-, performance-, or observability-
sensitive, add:

- security implications
- analytics event expectations and forbidden analytics data
- logging and monitoring expectations
- alerting expectations and severity classification

For material frontend and design-system work, also require:

- machine-readable frontend quality-gate state manifest for the changed surface
- frontend gate execution evidence, or an explicit environment blocker note
- visual verification coverage for required viewport and direction states

For first-consumer governed app adoption or materially changed governed
adoption, also require:

- a governed app-adoption preflight artifact or equivalent note naming:
  - the exact signed-off source route or reference truth
  - the family-owned versus host-owned boundary
  - the required shared CSS, render, and controller seams
  - any explicitly approved intentional deviations
- an adoption contract or parity checklist that records:
  - literal route-parity expectations
  - required consumer-level shell or host-parity proof
  - required real interactive parity states
- consumer-level executable proof on the real app route, not only on
  `/design-system`
- at least one direct human-visible regression guard when the surface is
  visually sensitive or has already had an escaped visual issue
- explicit review of whether app-consumption entrypoints and canonical
  `/design-system` entrypoints are expected to stay visually identical or are
  intentionally scoped differently
- a governed page implementation audit for each touched durable app page that
  records:
  - whether the page still owns local render or controller behavior
  - which design-system seams are actually being consumed today
  - the required remediation path before further page work if local
    implementation still remains

For public route or signed-off route-shell work, also require:

- explicit human review using a public-route checklist or equivalent artifact
- recorded qualitative findings when the route still has visible design issues
  that automation did not classify as failures

Treat the frontend loop as incomplete when:

- the UI surface changed but route/screen states were not documented
- degraded-performance behavior was left implicit
- permission-aware rendering expectations were left implicit
- accessibility expectations were omitted for a materially changed frontend
  surface
- the loading strategy and performance posture were not reviewed
- telemetry implications were silently deferred even though the slice changes
  a meaningful user journey, high-risk workflow, or production-critical module
- the frontend quality gate manifest is missing or stale for a materially
  changed governed surface
- a governed first-consumer adoption was treated as complete without a preflight
  artifact, adoption boundary declaration, or consumer-parity proof
- the real app route still owns governed markup or interaction behavior locally
  even though the family is being presented as governed adoption
- a durable governed app page changed without refreshing the implementation
  audit that says whether the page is still locally implemented and what fix is
  required before more page work
- the only proof for governed adoption is canonical or design-system coverage
  with no consumer-level executable evidence
- the frontend gate failed, was not run, or was treated as optional
- a public route was presented as complete without an explicit qualitative
  route review

## Documentation Update Rule

When a change lands, update the affected combination of:

- PRD
- PRD-derived test-case doc
- end-to-end journey scenario inventory when required by the testing policy
- QA checklist, exploratory note, waiver/quarantine record, and curated test
  summary when required by the QA release gate or coverage matrix
- relevant feature docs
- affected feature manifests and generated dependency graph artifacts when
  feature seams or cross-feature dependencies changed
- architecture guides or ADRs
- runbook
- privacy note
- standards review notes
- AI-assisted review notes when the change materially relied on generative AI
- maintained status snapshots, registry docs, and earlier planning artifacts
  whose current-state wording changed because the implementation now exists
- frontend module or journey docs when a frontend surface now exists or
  materially changed
- reconstruction questionnaire when the slice changes interchangeable tools,
  providers, or deployer-local choices
- bootstrap and helper docs when the slice changes startup order, required
  local helpers, or runnable env assumptions
- harness-internals docs when the slice changes reusable test harness seams or
  persistence-test infrastructure
- script/helper behavior docs when the slice changes repo scripts, helper
  tooling, or script side effects in a meaningful way

## Feature Loop Stop Rule

Do not stop a material feature loop early just because implementation and a
small validating test run exist.

If the change introduced or changed any of these, the loop remains incomplete
until the maintained artifacts are updated or an explicit blocker/deferred
posture is recorded:

- backend routes or request/response/error contracts
- new authz capability keys or role-grant baseline changes
- source-independent feature behavior
- maintained OpenAPI or Postman artifacts for the affected seam
- platform-status or standards-relevant snapshots whose truth changed
- planning artifacts whose current-state wording became stale because the slice
  now exists

For backend capability work, the default close-out check must explicitly review:

- PRD and PRD-derived test-case doc
- implementation blueprint when it exists for the slice
- feature docs
- API contract docs
- OpenAPI
- maintained Postman artifacts
- permission-mapping artifacts when authz changed
- standards/platform-status snapshots when standards-relevant truth changed
- earlier PRD, blueprint, or note files whose "not implemented yet" wording is
  now stale

If any required artifact is not updated, the loop must be reported as one of:

- blocked on artifact completion
- partially documented
- implementation-only by explicit pause

Do not treat that state as feature-complete.

Do not leave the implementation as the only place that knows the intended
behavior.

Before a slice is considered complete, perform a maintained-artifacts sweep.

At minimum, check:

- older PRD, PRD-derived test-case, or blueprint files for stale "not yet
  implemented" wording
- `docs/standards/platform-status/` files whose truth changed because of a new
  vendor, service, processor, dependency, review workflow, or
  standards-relevant control improvement
- `docs/standards/platform-status/` files whose wording became stale because a
  slice materially changed the implemented control posture for authentication,
  authorization, session management, auditability, privacy handling, or other
  standards-gated behavior even when the headline status remains the same
- affected `src/features/<featureName>/feature.manifest.json` entries for
  changed seams or cross-feature dependencies
- `docs/architecture/generated/feature-dependency-graph.json`
- `docs/architecture/generated/feature-dependency-graph.md`
- README, index, inventory, and registry docs that summarize current platform
  capabilities, artifact sets, or entity inventories

If a surface is reviewed and intentionally left unchanged, record the reason in
the same loop rather than silently skipping it.

When an upstream planning artifact is materially reset or rewritten during the
same loop, revalidate downstream artifacts before continuing.

Typical examples:

- if the PRD is recreated or materially narrowed, refresh the implementation
  blueprint before proceeding to implementation
- if source-independent contracts materially change, refresh the blueprint and
  PRD-derived test-case assumptions that depend on them
- if verification scope changes, refresh the blueprint and test-case artifact
  before treating implementation as current

Treat stale downstream artifacts after an upstream reset as drift.

## End-To-End Journey Gate

For every feature loop, explicitly determine whether end-to-end journey testing
is required.

In this repo, the default posture is:

- all features have end-to-end testing expectations
- the depth and tier may vary, but the requirement itself is not optional

Required for every feature loop:

- identify affected journeys
- classify journey tier where relevant
- identify workflow state dimensions that can change outcome
- classify each dimension as behavior-changing, non-behavior-changing, or
  pending-review
- define equivalence classes for each behavior-changing dimension
- review lifecycle, deletion/disablement, revocation, expiry, and credible
  operator-induced state changes for inclusion rather than exclusion
- define meaningful permutations, including tenant and role variation when the
  feature can behave differently across them
- include frontend state classes such as loading, delayed, denied, expired,
  degraded, and recovery states when a frontend surface exists
- define default pairwise coverage across behavior-changing dimensions and any
  required higher-order interactions
- include legacy/pre-change and post-change data states when behavior can differ
- record known-pitfall research and add missing journey coverage where needed
- ensure executable end-to-end tests or explicitly reviewed deferred posture
  exist before considering the loop complete
- identify required non-E2E layers from the QA coverage matrix when the change
  class triggers them
- identify required human QA artifacts such as checklist, exploratory note,
  run summary, or waiver record when the gate requires them

Default durable locations:

- journey inventories:
  `docs/prd/journey_inventories/`
- executable end-to-end tests:
  `tests/e2e/`
- curated source-controlled run summaries:
  `docs/workspace/test-run-summaries/`

A feature loop is incomplete when:

- the journey inventory changed but the end-to-end scenarios were not updated
- the journey inventory does not explain the threshold for omitted permutations
- lifecycle or credible operator-induced journey classes were silently excluded
  rather than explicitly covered or deferred
- required end-to-end traces are missing from the planned artifact chain
- required end-to-end tests are flaky and unresolved without approved exception
- the QA coverage-matrix classification was not recorded
- required non-functional or human-QA artifacts were silently omitted even
  though the change class triggered them
- required maintained Postman, OpenAPI, permission-mapping, feature-doc, or
  status-snapshot updates were skipped even though the implemented slice
  changed their truth

## End-To-End Traceability Rule

When end-to-end journey coverage is required, traceability must link:

- capability matrix rows
- PRD or PRD refinement
- PRD-derived test cases where applicable
- journey scenario inventory
- executable end-to-end tests
- curated run summaries when those runs are part of the reviewed gate or audit

## Feature Loop Default

For a material change, do not fall back to an older thin loop that stops at
PRD, PRD-derived test cases, and a small hand-picked test run.

The default feature loop should explicitly determine and document:

- the QA coverage-matrix classification
- the journey inventory requirement and journey tier
- the required executable layer set
- the required human QA artifacts
- the required curated gate evidence
- the required frontend artifact set when a frontend surface exists
- the required telemetry/accountability artifact set when the change affects
  production workflows, user trust, or operational visibility

If the recorded change-class classification says a broader QA layer or artifact
is not required, record that decision explicitly rather than silently omitting
it.

Do not treat end-to-end tests as disposable implementation details when they
are part of the reviewed verification plan.

## QA Release-Gate Rule

When a change affects blocking workflows, high-risk domains, or production
confidence materially, the repo also requires review against:

- [QA Release Gate](/home/gordon/kanbien/docs/standards/QA-RELEASE-GATE.md)

And supporting layer selection from:

- [QA Coverage Matrix Guide](/home/gordon/kanbien/docs/architecture/guides/qa-coverage-matrix-guide.md)

## PRD Test-Case Override Gate

Reviewed PRD-derived test cases are part of the change-control surface, not a
disposable planning note.

Implementation must not silently supersede them.

Before implementation is considered complete, pause for an explicit PRD
test-case update and review when executable-test work would:

- introduce a new `TC-*` ID that is not already present in the PRD-derived
  test-case doc
- remove executable coverage for an active documented `TC-*` ID
- merge multiple planned `TC-*` cases into one executable test in a way that
  obscures which reviewed cases are covered
- split one planned `TC-*` case into materially different executable cases with
  changed intent
- change the expected behavior, scope, or meaning of a reviewed `TC-*` case
- convert a previously active planned case to deferred, superseded, archived,
  or pending-review status

Allowed without a separate gate:

- adding executable coverage for an existing documented `TC-*`
- improving assertions without changing the planned case meaning
- splitting or consolidating executable tests while preserving the same
  documented `TC-*` IDs and auditability
- adding nearby comments that improve traceability without changing intent

Rule of thumb:

- undocumented executable `TC-*` IDs are drift
- documented `TC-*` IDs missing from executable coverage are drift unless the
  PRD test-case doc explicitly records the reason

## Permission-Mapping Gate

When a change introduces new authorization capability keys or changes the role
grant baseline, the source-independent permission-mapping artifacts are
required change outputs, not optional follow-up docs.

At minimum, update the relevant combination of:

- `docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md`
- `docs/architecture/permission-mappings/role-to-authz-capability-mapping.md`

Treat missing permission-mapping updates as drift when:

- runtime capability catalogs or seeded authz rows change
- protected routes gain new governing capability keys
- role defaults or protected or mandatory grant posture changes

Do not treat runtime capability registration alone as sufficient evidence for a
permission-sensitive feature change.

## Persistence Harness Update Gate

When a change adds or materially changes persistence-owned tables, migration
dependencies, or persistence-backed verification, update the shared
persistence-test harness in the same change where relevant.

At minimum, review and refresh the relevant combination of:

- persistence test scripts in `package.json`
- `tests/harness/postgres/migrations.ts`
- `tests/harness/postgres/testDatabase.ts`
- persistence-backed fixtures and actor/entity seeding in affected tests

Treat missing harness updates as drift when:

- a new persistence-backed feature test exists but is not included in the
  shared persistence run commands
- a new migration depends on another feature's schema but the shared migration
  harness does not reflect that dependency
- reset helpers no longer clear the tables owned by the active persistence
  suite
- persistence tests rely on implicit bootstrap state instead of seeding their
  required fixtures explicitly

## Pagination-Test Robustness Rule

Tests for paginated catalogs, lists, and searchable collections must not make
accidental assumptions about first-page contents unless first-page ordering is
part of the documented contract.

Preferred patterns:

- request a page size large enough to cover the asserted fixture set
- assert against explicit filters or exact known fixtures
- separate pagination-contract tests from business-presence tests

Treat brittle pagination assumptions as drift when a feature change only grows
the catalog or list surface but unexpectedly breaks unrelated tests.
