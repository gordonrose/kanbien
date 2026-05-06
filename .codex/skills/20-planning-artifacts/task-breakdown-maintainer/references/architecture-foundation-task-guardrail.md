# Architecture Foundation Task Guardrail

Use for task type: `DECISION:architecture-foundation`

## Must Preserve

- architecture decisions live in ADRs or architecture docs before implementation
- no Delivery work proceeds while the decision is unresolved
- compatibility and migration strategy for breaking decisions
- task output resolves one architecture blocker or routes it to the authority
  that can resolve it

## Concern Areas

Every queued task must name the architect concern area before naming the
specific trigger. The concern area explains what kind of architecture expertise
is needed; the trigger explains why Delivery must stop.

Approved concern areas:

- `ownership-boundary`: feature, platform, shared, or cross-feature ownership
- `integration-boundary`: internal/external service integration, API/event
  handoff, sync/async seams, or integration ownership
- `security-privacy-boundary`: sensitive data, threat model, privacy exposure,
  file/asset delivery, or security posture
- `authorization-boundary`: actor, tenant/root/shared, object-level,
  relationship-based, or configuration-based authorization
- `persistence-data-model`: storage shape, schema, indexes, lifecycle,
  durability, consistency, or data ownership
- `data-governance-compliance`: classification, retention, exportability,
  legal hold, minimization, auditability, or compliance evidence
- `frontend-architecture-boundary`: route/topology authority, state owner,
  replay/snapshot posture, app shell, or frontend materialization
- `design-system-architecture-boundary`: governed UI seam ownership,
  canonical/signoff authority, or app-vs-design-system boundary
- `scalability-performance`: load model, query scale, caching, batching,
  pagination, background processing, or performance envelope
- `resilience-consistency`: transactions, idempotency, retries, failure
  recovery, eventual consistency, or partial failure behavior
- `observability-operability`: audit events, logs, metrics, alerts, runbooks,
  support workflows, or operational ownership
- `deployment-runtime-topology`: process boundaries, runtime configuration,
  scheduler/job topology, environment assumptions, or deployment shape
- `dependency-selection`: build-vs-buy, library, package, service, or runtime
  dependency choice
- `migration-rollout-strategy`: rollout, fallback, backfill, dual-read/write,
  deprecation, or rollback strategy
- `testing-strategy-architecture`: proof-layer ownership when unit,
  integration, e2e, security, performance, or evidence boundaries are unclear

## Allowed Triggers

Use `DECISION:architecture-foundation` when Delivery would otherwise need to
guess durable system ownership, authority, compatibility, lifecycle, topology,
authz, persistence, or shared-seam policy.

Approved triggers:

- `owner-boundary`: feature, platform, shared, or cross-feature ownership is
  unresolved
- `platform-vs-feature`: work may belong in a platform seam rather than a
  feature-local implementation
- `authz-boundary`: actor, tenant/root/shared, object-level, or grant-source
  authority is unresolved
- `persistence-model`: schema, storage shape, indexing, lifecycle, or data
  durability posture is unresolved
- `topology-authority`: route, topology, state-owner, locator, or replay
  authority is unresolved
- `lifecycle-cleanup`: ownership of lifecycle transitions, cleanup, retry, or
  retention semantics is unresolved
- `shared-seam-authority`: a shared runtime, generated artifact, platform
  primitive, or cross-feature seam may need durable authority
- `compatibility-strategy`: migration, rollout, fallback, deprecation, or
  backwards-compatibility strategy is unresolved
- `architecture-source-gap`: existing architecture sources are missing,
  contradictory, or not specific enough to unblock implementation

Do not use this task type for applying an already-approved architecture answer;
route that work to the owning DEV, DOC, TEST, EVIDENCE, or GOV task type.

## Authority Routing

Every queued task must state where the architecture answer will become durable:

- `existing-architecture-source`: reviewed sources already answer the question
- `Layer-2-technical-steering`: decision must return to Technical Steering
- `ADR-required`: one ADR is the intended durable output
- `GOV:architecture-update`: architecture authority must be updated
- `GOV:standards-update`: standards authority must be updated
- `blocked-human-decision`: human architecture decision is required before
  any downstream queueing

If the decision changes durable architecture authority, downstream
implementation remains blocked until a `GOV:architecture-update` or equivalent
authority-owning task records the decision.

## Decision Provenance

Layer 4 may identify an architecture decision gap, but it must not approve the
architecture decision itself. Every queued task must classify the status of
the Layer 2 or durable-authority decision analysis.

Allowed decision analysis statuses:

- `approved-source-exists`: Layer 2, ADR, or architecture authority already
  contains enough option, trade-off, risk, cost, compatibility, operability,
  testability, reversibility, recommendation, and signoff analysis
- `missing-layer-2-analysis`: the architecture question must return to Layer 2
  because no sufficient decision-analysis record exists
- `incomplete-layer-2-analysis`: Layer 2 analysis exists but is missing
  required option, trade-off, risk, cost, compatibility, operability,
  testability, reversibility, recommendation, or signoff evidence
- `adr-required`: the approved decision requires an ADR before implementation
  proceeds
- `blocked-human-decision`: human architecture approval is required before any
  downstream queueing

When the status is not `approved-source-exists`, downstream implementation
must remain blocked. Layer 4 records missing analysis fields and the resolution
route; it does not fill in the architecture decision.

## Approval Evidence

- approved concern area
- approved trigger
- decision analysis status and provenance source
- missing decision-analysis fields when the source is absent or incomplete
- exact architecture question
- exact ADRs or architecture docs reviewed
- scriptable decision source inventory naming files, globs, or command output
- decision-analysis checklist covering reviewed or missing option, trade-off,
  risk, cost, compatibility, operability, testability, reversibility,
  recommendation, and signoff evidence
- decision needed and owner
- approved output path
- downstream tasks blocked until approval
- final authority route
- human-review boundary limited to architecture judgment, sufficiency, and
  authority routing

## Deep Delivery Standard

- one architecture decision, ADR gap, or compatibility strategy per queued task
- do not combine architecture decision work with dependent implementation
- name the downstream tasks blocked until the decision is recorded
- name exact decision sources and checklist evidence before queueing downstream
  work so scripts can inspect the source set before human architecture review
- do not update implementation, API behavior, persistence behavior, permission
  behavior, route behavior, or design-system seams inside this decision task

## Worked Examples

| Scenario | Concern / Trigger | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| A task needs tenant-scoped object-level authorization, but approved sources only define root and tenant context broadly. | `authorization-boundary` / `authz-boundary` | Record the exact authorization question, reviewed ADRs/steering docs, missing decision-analysis fields, owner, output route, blocked downstream tasks, and compatibility concerns. | Do not infer object-level rules or update permission mapping as current truth. |
| A generated frontend topology route might become durable product topology. | `frontend-architecture-boundary` / `topology-authority` | Inventory topology authority sources, classify missing route/state/replay decisions, and route to Layer 2 or `GOV:architecture-update`. | Do not materialize route files or edit generated routing in this task. |
| A cleanup lifecycle for abandoned uploads has no retry, quota, or ownership decision. | `resilience-consistency` / `lifecycle-cleanup` | Capture cleanup decision gap, required owner, retry/failure/quota questions, artifact target, and downstream implementation blockers. | Do not implement jobs, migrations, or retention docs until the decision is durable. |
| Existing architecture source already answers platform-vs-feature ownership. | `ownership-boundary` / `approved-source-exists` | Cite exact source paths, checklist evidence, and final authority route as existing source; unblock downstream with human-review boundary limited to sufficiency. | Do not rewrite architecture authority when the existing source is enough. |

## Required Check IDs

- `architecture-concern-area`
- `architecture-trigger`
- `architecture-question`
- `architecture-decision-provenance`
- `architecture-adrs-reviewed`
- `architecture-decision-source-inventory`
- `architecture-decision-analysis-checklist`
- `architecture-decision-owner`
- `architecture-output-path`
- `architecture-downstream-block`
- `architecture-compatibility`
- `architecture-final-authority-route`
- `architecture-human-review-boundary`
