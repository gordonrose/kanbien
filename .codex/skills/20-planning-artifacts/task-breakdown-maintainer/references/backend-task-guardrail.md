# Backend Task Guardrail

Use for task type: `DEV:backend`

## Must Preserve

- feature-local ownership under `src/features/<featureName>`
- established `contract/`, `domain/`, `persistence/`, `transport/`,
  `integration.ts`, `index.ts`, and `feature.manifest.json` seams
- no direct imports from another feature's `persistence/*`
- API/entity defaults from `AGENTS.md`
- tenant/authz, audit, migration, and soft-delete defaults when relevant
- approved product, story, capability, API, permission, lifecycle, cleanup, and
  architecture decisions from upstream artifacts
- separation between runtime implementation and source-independent artifact
  definition

## Approval Evidence

- source authority: Story Breakdown, PRD/capability row, Technical Steering,
  ADR, API contract, permission mapping, data dictionary, or standard that
  governs the backend behavior
- owning feature and allowed write set
- scriptable backend source inventory naming exact source, test, contract,
  manifest, generated-artifact, or command-output targets to inspect
- one backend behavior or seam and the exact feature-local layers it touches
- public seams used or changed, including feature manifest and dependency graph
  impact when a public seam or cross-feature dependency changes
- authz, tenant-boundary, lifecycle/deletion, grant-source, denial, and
  audit/proof posture when the behavior is protected or permission-sensitive
- API contract boundary: whether route/request/response/error behavior is
  already approved or must split to `DOC:api-contract`
- persistence and migration boundary: whether the backend task only consumes
  existing storage or must split schema, migration, live data, index, or query
  semantics to `DEV:migration-persistence`
- data dictionary, permission mapping, feature docs, generated artifact, and
  maintained-artifact obligations carried from the source artifact ledger
- expected backend output or behavior target
- human-review boundary for backend behavior sufficiency and split routing
- proof layers and commands tied to the behavior being implemented

## Deep Delivery Standard

- one DEV:backend behavior or DEV:backend seam per queued task
- split DEV:migration-persistence, DOC:api-contract, DOC:permission-mapping, and
  DOC:data-dictionary work into separate tasks when they have distinct proof or
  write sets
- do not combine implementation with evidence sweep or source-independent
  artifact audit work unless the task is explicitly DOC:docs-artifact or
  EVIDENCE:qa-evidence
- name the exact repository, service, route, migration, and test context to
  inspect before editing
- name exact source inventory and expected backend output for common change
  classes such as transport routes, domain behavior, repository consumers,
  authz enforcement, lifecycle behavior, audit events, and manifest public
  seams
- do not queue a backend task that requires product, architecture, authz,
  lifecycle, cleanup, API, migration, or artifact decisions the source artifacts
  have not made
- do not treat a seeded, documented, or architecture-target permission as
  runtime enforcement without route-level proof

## Backend Implementation Approach

Queued DEV:backend tasks must specify the feature-local implementation approach
before Delivery starts:

- classify the backend change as one of:
  `domain-behavior`, `contract-schema`, `transport-route`,
  `repository-consumer`, `persistence-adapter`, `feature-wiring`,
  `integration-dependency`, `manifest-public-seam`, `authz-enforcement`,
  `lifecycle-behavior`, `audit-event`, `error-resilience`,
  `transaction-consistency`, `projection-read-model`,
  `background-job-handler`, or `observability-event`
- name approved source authority, exact write envelope, split routing, scaffold
  or script command posture, and focused proof commands
- prefer the established feature structure:
  `contract/`, `domain/`, `persistence/`, `transport/`, `integration.ts`,
  `index.ts`, and `feature.manifest.json`
- use capability-per-file domain shape by default:
  `domain/<capabilityName>.ts` owns one clear business capability, while
  `domain/service.ts` composes and delegates
- transport parses, validates, authorizes, and routes; it does not compose
  repositories or platform infrastructure
- domain owns business rules, lifecycle decisions, and durable entity behavior
- persistence owns DB-shaped records, SQL/query behavior, indexes, and
  repository contracts
- contract owns public request/response schemas, types, and errors
- integration owns feature wiring
- feature manifests and generated dependency graph artifacts must be updated
  when public seams or cross-feature dependencies change

The task packet should name exact expected files/layers, the capability file
strategy, contract/API posture, authz/tenant/lifecycle posture,
persistence/migration posture, public seam or manifest impact, artifact
obligations, scaffold/script posture, split routing, proof commands, and
formatting/generated-artifact expectations. Do not copy this whole section into
each packet; apply it through the `Backend Implementation Approach` row.

## Source Authority And Split Rules

DEV:backend consumes approved planning truth. It may implement the approved
runtime behavior, but it must not define the missing envelope itself.

Split or block when:

- route paths, request schemas, response shape, error codes, denial mapping, or
  maintained OpenAPI/Postman artifacts are missing or changing; create
  `DOC:api-contract`
- capability keys, role/grant rows, authority world, tenant context,
  grant-source posture, UI eligibility, allow/deny posture, safe denial, or
  audit/proof visibility are missing or changing; create
  `DOC:permission-mapping`
- entity fields, durable facts, lifecycle states, retention, audit fields, PII
  posture, data classification, or compliance-friendly dictionary rows are
  missing or changing; create `DOC:data-dictionary`
- SQL schema, live schema inspection, indexes, uniqueness, data migration,
  repository query semantics, persistence harness behavior, or per-row data
  validation is required; create `DEV:migration-persistence`
- shared platform behavior, evaluator order, middleware architecture, route
  mounting, scheduler/job authority, or cross-feature public seam ownership is
  the primary change; use `DEV:platform-seam` or `GOV:architecture-update`
- executable proof is the only missing work; create `TEST:test-only`
- evidence capture, artifact sweep, or post-implementation proof collation is
  the main work; create `EVIDENCE:qa-evidence`

DEV:backend may carry artifact obligations as required follow-through, but it
must not hide a distinct source-truth or proof task inside the implementation
scope.

## Authz-Sensitive Backend Work

For protected, tenant-scoped, root-scoped, support/emergency, lifecycle,
asset, billing, export, audit, or otherwise sensitive backend behavior, the
task must copy the approved posture from source artifacts before queueing:

- authority world
- actor boundary
- current tenant context source or not-applicable rationale
- cross-tenant posture
- lifecycle/deletion gate
- feature/configuration/entitlement gate
- governing capability key or explicit not-applicable rationale
- grant source posture and UI eligibility
- safe public denial category
- internal audit/proof expectation
- allowed, denied, unauthorized/expired, and cross-tenant proof story when
  applicable

If any required posture is absent or contradictory, block the backend task and
route the missing decision to the owning task type. Do not let Delivery infer
the rule from existing middleware shape, fixture convenience, UI visibility, or
role names.

## Proof Expectations

Queued DEV:backend tasks must name focused proof for the implemented behavior:

- unit/domain tests for business rules, normalization, lifecycle decisions, and
  durable entity behavior
- transport/integration tests for route parsing, authn/authz placement,
  request/response/error behavior, and API compatibility
- persistence-backed tests when storage reads/writes, repository behavior,
  uniqueness, soft delete, or query semantics are touched
- security tests for root/tenant separation, cross-tenant denial, permission
  denial, lifecycle denial, sensitive fallback, and grant revocation when
  relevant
- manifest/dependency-graph, API contract, permission mapping, data dictionary,
  standards, or artifact-sweep commands when those obligations are in scope

Broad commands such as `npm test` may be supporting evidence, but they are not
enough unless the task also names the focused proof command for the behavior.

## Required Check IDs

- `backend-source-authority`
- `backend-change-class`
- `backend-owning-feature`
- `backend-source-inventory`
- `backend-exact-write-envelope`
- `backend-layer-responsibilities`
- `backend-cross-feature-seams`
- `backend-authz-tenant-lifecycle`
- `backend-api-contract-boundary`
- `backend-persistence-migration-boundary`
- `backend-scripted-scaffold-posture`
- `backend-artifact-obligations`
- `backend-expected-output`
- `backend-split-routing`
- `backend-proof-commands`
- `backend-human-review-boundary`
