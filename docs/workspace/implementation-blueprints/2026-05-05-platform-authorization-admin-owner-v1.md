# Platform Authorization `adminOwner` V1 Implementation Blueprint

## Summary

- Feature:
  platform authorization foundation, centered on `src/lib/authz/` and existing
  tenant seams rather than a new broad feature bundle in the first slice
- Capability:
  v1 tenant-scoped `adminOwner` authorization foundation with central evaluator
  posture, tenant context/lifecycle gates, grant resolution, safe denial
  mapping, and audit/proof recommendations
- Scope:
  backend/platform foundation planning only; no UI and no tenant account/export
  route implementation in this blueprint
- Phase:
  pre-Task-Breakdown implementation blueprint
- Implementation readiness:
  blocked from runtime task breakdown until PRD-derived test cases exist and
  the first route family is selected

## Inputs

- Capability matrix reference:
  `docs/workspace/capability-matrices/2026-05-05-platform-authorization-admin-owner-v1-capability-matrix-first-draft.csv`
- Capability notes:
  `docs/workspace/capability-matrices/2026-05-05-platform-authorization-admin-owner-v1-capability-matrix-first-draft-notes.md`
- PRD:
  `docs/prd/2026-05-05-0023-platform-authorization-admin-owner-v1.md`
- Story Breakdown:
  `docs/workspace/story-breakdown/2026-05-05-platform-authorization-admin-owner-story-breakdown.md`
- Technical Steering:
  `docs/workspace/technical-steering/2026-05-04-platform-authorization-model-steering.md`
- Product Discovery:
  `docs/workspace/product-discovery/2026-05-03-platform-authorization-model.md`
- PRD test-case doc:
  not created yet; required before Layer 4 task breakdown for runtime work
- Journey inventory:
  not applicable for the first backend/platform foundation slice; required later
  if tenant-admin UI or end-to-end tenant account/export journeys enter scope
- QA coverage matrix classification:
  permission-sensitive backend/platform foundation with tenant-boundary,
  persistence, audit, compatibility, and security coverage requirements
- QA release-gate expectation:
  no runtime implementation may be called complete without unit, integration,
  security, audit, persistence-backed, compatibility, and artifact-sweep proof

### Exact ADR Discovery

- ADR files reviewed:
  - `docs/architecture/adr/0006-standardize-feature-internal-module-conventions.md`
  - `docs/architecture/adr/0007-standardize-cross-feature-api-and-entity-behavior-defaults.md`
  - `docs/architecture/adr/0009-separate-authentication-from-business-features.md`
  - `docs/architecture/adr/0011-adopt-prd-driven-traceable-test-coverage.md`
  - `docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`
  - `docs/architecture/adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`
  - `docs/architecture/adr/0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md`
  - `docs/architecture/adr/0030-enforce-feature-public-seams-with-a-generated-dependency-graph.md`
  - `docs/architecture/adr/0031-add-feature-manifests-for-declared-seams-and-dependencies.md`
  - `docs/architecture/adr/0033-add-a-capability-contract-catalog-foundation-with-hybrid-materialization-and-drift-audit.md`
  - `docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md`
  - `docs/architecture/adr/0036-adopt-layered-platform-authorization-evaluation.md`
  - `docs/architecture/adr/0037-separate-tenant-operational-lifecycle-from-deletion-posture.md`
- Change areas reviewed:
  auth/session separation, tenant-session current context, tenant access grants,
  tenant-scoped configuration, central authorization evaluation, lifecycle and
  deletion gates, capability catalog materialization, feature public seams,
  audit/proof, job authority, generated dependency graph, and artifact sync
- Enduring decision areas with no existing ADR found:
  no accepted ADR yet for concrete authz proof storage schema; no accepted ADR
  yet for tenant role template versioning/upgrade policy; no accepted ADR yet
  for broad observability/alerting architecture
- New ADR required:
  not required before the first foundation slice if this blueprint follows
  ADR-0036/0037. A new ADR is required before broad ABAC/ReBAC runtime,
  role-template versioning, or a new dedicated authz proof store becomes the
  durable platform standard.
- ADR conflict / stale guidance:
  ADR-0016 allowed future tenant role divergence through root-user action.
  ADR-0036 deliberately narrows v1 to no tenant-specific `adminOwner`
  divergence. Use ADR-0036 for v1.

## Scope Confirmation

This blueprint covers one coherent first implementation foundation:

- define the central authorization evaluator seam under `src/lib/authz/`
- adapt tenant-session context from `src/lib/auth/middleware.ts`
- resolve `adminOwner` authority from the existing `tenantAuth`
  `tenant_access_grant` model, extended conservatively for role/provenance
  posture
- consume tenant lifecycle facts through the `tenants` public seam rather than
  private tenant persistence imports
- map decisions to the shared denial contract in
  `docs/api-contracts/platform-authorization-denials.md`
- write or recommend audit/proof events through a platform authz audit adapter
- prove that ABAC/ReBAC/object inputs are typed extension points only in v1

This blueprint does **not** include:

- tenant account management routes
- tenant export/reporting routes
- tenant-admin UI
- root-admin UI changes
- tenant-created custom roles
- tenant self-service tenant-admin management
- root impersonation
- broad ABAC/ReBAC runtime
- broad observability/alerting implementation

## Frontend Plan

- Route / surface:
  no frontend implementation in the first foundation slice
- UI states:
  not applicable
- Permission visibility behavior:
  all new matrix rows remain not exposed or blocked until route-level runtime
  enforcement proves the capability. Future UI must consume runtime-enforced
  capability/catalog posture and must not treat documentation-only or
  architecture-target rows as usable.
- Session / expiry behavior:
  future tenant UI must follow tenant session expiry and explicit tenant
  switching behavior; no frontend session change in this slice
- Browser security considerations:
  no browser route or rendered surface in this slice. Future UI requires
  design-system/adoption governance and permission rendering evidence.

## Backend Plan

- Route(s):
  no new product route in the first foundation slice. The evaluator should be
  exercised through dedicated tests and then adopted by the first selected
  tenant-admin route family in a later Task Breakdown.
- Request/response/error contract:
  - evaluator input should be a typed `AuthorizationRequest`
  - evaluator output should be a typed `AuthorizationDecision`
  - public route errors should map through
    `docs/api-contracts/platform-authorization-denials.md`
  - existing root and tenant-auth route families keep current error behavior
    unless their API contract records a compatibility migration
- Feature-local files expected:
  - `src/lib/authz/evaluator.ts`
  - `src/lib/authz/types.ts`
  - `src/lib/authz/denials.ts`
  - `src/lib/authz/audit.ts`
  - `src/lib/authz/tenantContext.ts`
  - `src/lib/authz/tenantRoleResolver.ts`
  - `src/lib/authz/tenantLifecycleGate.ts`
  - `src/lib/authz/featureGate.ts`
  - focused unit tests under `tests/unit/authz/`
  - integration/security/audit tests under existing `tests/integration/`,
    `tests/security/`, and `tests/audit/` families once a route family adopts
    the evaluator
- Cross-feature seams:
  - `tenantAuth` public seam for tenant-session lookup and future grant
    resolution
  - `tenants` public seam for visible/lifecycle tenant facts
  - future `tenantConfiguration` or commercial entitlement seam for
    feature/configuration gates
  - platform security/audit repository for first audit sink adapter
  - capability catalog/source registry only after runtime-enforced posture is
    ready to materialize
- Feature manifests to update:
  - if `tenantAuth` exports a grant resolver, update
    `src/features/tenantAuth/feature.manifest.json`
  - if `tenants` exports a lifecycle/deletion authz fact resolver, update
    `src/features/tenants/feature.manifest.json`
  - if `tenantConfiguration` or a future entitlement feature exports a feature
    gate resolver, update that owning manifest
  - regenerate `docs/architecture/generated/feature-dependency-graph.*` when
    manifests or cross-feature imports change
- Authorization enforcement point:
  central evaluator in `src/lib/authz/` for tenant-scoped routes. Feature
  services must receive already-authorized inputs or call a narrow route/domain
  authorization wrapper; they must not re-implement role logic privately.

## Recommended First-Slice Decisions

### Grant Storage

Use the existing `tenantAuth` access-grant model as the first storage home.

Recommended migration posture:

- extend `tenant_access_grant` with explicit v1 role/provenance fields rather
  than adding a separate broad authz feature immediately:
  - `tenant_role_key TEXT NOT NULL DEFAULT 'adminOwner'`
  - `grant_source_posture TEXT NOT NULL DEFAULT 'runtime-enforced'`
  - `granted_by_actor_type TEXT NULL`
  - `granted_by_actor_id TEXT NULL`
  - `grant_reason_reference TEXT NULL`
- add a check constraint for v1:
  `tenant_role_key IN ('adminOwner')`
- backfill existing active `tenant_admin` subject grants to `adminOwner`
- keep `revoked_at` as the immediate authority removal field
- keep all reads behind a `tenantAuth` exported resolver so a future dedicated
  tenant authz store can replace the storage without changing feature callers

Rationale:

- ADR-0019 already defines `tenantAccessGrant` as the durable linkage between
  principal, tenant, and tenant-scoped subject.
- V1 has one global tenant role and no tenant-specific divergence.
- This avoids a premature second grant model while preserving a future seam
  migration path.

### Tenant Lifecycle Compatibility

Do not migrate tenant lifecycle/deletion storage in the same first evaluator
slice.

Recommended first-slice posture:

- add a `tenants` public authz fact resolver that returns current `status`,
  `deletedAt`, and a derived deletion posture:
  - `deleted_at IS NULL` -> `active`
  - `deleted_at IS NOT NULL` -> `softDeleted`
- explicitly mark `hardDeletePending`, `hardDeleted`, legal hold, retention,
  and inactive reason fields as not yet represented in runtime storage
- route tests should prove the first slice denies or restricts based only on
  currently represented facts and that missing future facts are not invented

Rationale:

- ADR-0037 requires a fuller model, but changing tenant storage is broader than
  the first evaluator foundation.
- The resolver prevents feature code from deriving lifecycle posture ad hoc.

### Audit / Proof Sink

Use an adapter over existing platform security audit storage for the first
slice only when the required proof fields fit. Otherwise create a narrow
`authz_audit_events` table in the same runtime slice that first needs durable
proof beyond current `auth_audit_events`.

Current constraint:

- `auth_audit_events` is rooted in root-auth principal storage and does not
  carry tenant id, capability, denial category, policy source, grant posture,
  visibility class, severity, request id, or job id.

Blueprint decision:

- evaluator should emit typed audit recommendations and proof objects from day
  one
- the first route-adoption slice must choose either:
  - a compatibility adapter that writes the subset possible to
    `auth_audit_events`, plus tests proving omitted proof is not claimed, or
  - a new `authz_audit_events` storage shape with data dictionary and migration
    coverage
- support/emergency powers should not ship until the selected sink can store
  reason/reference and high-severity internal audit posture

### First Route Family

Do not start with tenant account settings or export.

Recommended first runtime adoption route family:

- a narrow read-only tenant authorization probe or existing tenant-scoped
  read route that can prove tenant context, lifecycle, `adminOwner`, denial
  mapping, and audit behavior without payment/export/provider side effects.

If a probe route is considered too artificial, the next best first adoption is
`GET /v1/tenant/auth-policy`, because it already has tenant-session/current
tenant behavior and no destructive mutation.

Do not make payment details, billing contacts, usage choices, or exports the
first runtime consumer. Those need additional API, data dictionary, provider,
job/cleanup, runbook, privacy, and cost decisions.

## Async Job Processing Decision Gate

- Does the first foundation slice need background work, bulk actions,
  retryable external calls, cleanup, delayed execution, long-running
  processing, imports/exports, asset processing, or operator-triggered batch
  workflows?
  No for the evaluator/grant/lifecycle foundation itself.
- Why is synchronous execution acceptable?
  The first evaluator path is request-local decision logic over current session,
  tenant, grant, lifecycle, and feature facts. It should not perform bulk work
  or provider calls.
- If async work is needed later:
  tenant data/log export likely needs a durable export request entity and
  tenant-scoped job authority. Support/emergency action review may need
  operational workflows later.
- Forbidden job payload posture for later export jobs:
  do not enqueue raw permissions, mutable live claims, sensitive proof blobs,
  full export filters that act as authority, or secrets. Persist the export
  request first and enqueue only a stable request id.
- Revalidation when later jobs run:
  revalidate tenant context, deletion/lifecycle posture, export eligibility,
  object/reporting-layer rules, and initiating actor/system authority from
  durable facts.

## Persistence Plan

- Entities / rows affected:
  - `tenant_access_grant` extension recommended for `adminOwner` role/provenance
  - optional future `authz_audit_events` table if proof exceeds existing audit
    storage
  - no tenant lifecycle table migration in the first evaluator foundation
- Migration changes:
  - add a new sortable migration under `src/features/tenantAuth/persistence/migrations/`
    for role/provenance fields if grant storage is in scope
  - do not edit already-applied migrations
  - add corrective/backfill SQL for existing grants
- Index or uniqueness changes:
  - preserve active grant uniqueness
  - consider index on `(auth_principal_id, tenant_id, tenant_role_key)` where
    `revoked_at IS NULL`
- Search/filter implications:
  no searchable product list in the first foundation slice
- Lifecycle / cleanup rules:
  revocation is immediate through `revoked_at`; historical grants remain for
  proof and action history
- Expiry / abandoned-state behavior:
  no new expiring grant state in the first foundation slice
- Orphaned external resource handling:
  not applicable
- Scheduled maintenance or job dependency:
  not applicable for first foundation slice
- Cleanup retry and failure recording:
  not applicable for first foundation slice
- Compatibility notes:
  existing tenant auth sessions and grants must keep working. Existing active
  tenant-admin access grants become `adminOwner` grants by compatibility
  backfill, reflecting the approved v1 policy that tenant admins share equal
  ownership.

## Verification Plan

- Journey tier / workflow scope:
  backend/platform foundation; no rendered journey in the first slice
- Unit:
  evaluator ordering, denial mapping, typed extension skip behavior, grant
  resolver behavior, lifecycle gate mapping, feature gate no-op/blocked states
- Integration:
  route adoption tests for the first selected tenant route family only after
  Task Breakdown selects that family
- Security:
  missing tenant context, selection required, wrong tenant, inactive/deleted
  tenant, pending admin, revoked grant, root/tenant authority mix-up, root-owned
  deny, sensitive fallback
- Audit:
  denied decisions, grant-source denial, lifecycle denial, support/emergency
  blocked until reason/reference sink exists, proof-field honesty
- Edge:
  multiple tenant grants, one selected tenant, stale session after grant
  revocation, missing lifecycle facts, unsupported ABAC/ReBAC facts
- Frontend:
  none in first foundation slice; future UI requires design-system/adoption
  and permission-rendering evidence
- Persistence-backed:
  grant role/provenance migration, backfill, active grant uniqueness, revoked
  grant deny, optional authz audit sink writes
- End-to-end:
  only after a real tenant route family adopts the evaluator
- Concurrency / idempotency:
  migration/backfill idempotency; repeated grant resolver reads; audit write
  failure posture
- Performance:
  evaluator should avoid N+1 private feature reads; if route-adopted on a hot
  path, add focused non-functional tests for grant/lifecycle lookup count
- Resilience / failure-injection:
  resolver unavailable, tenant facts missing, audit sink failure, malformed
  policy source
- Compatibility / contract:
  existing root authz middleware and tenant-auth denial behavior remain stable
  unless a route-family API contract records migration
- Accessibility:
  not applicable until UI
- Structured exploratory QA:
  required when a real tenant-admin UI or end-to-end route family ships
- QA checklist:
  required for first runtime route adoption
- Curated test-run summary:
  required for first runtime route adoption
- Waiver / quarantine expectation:
  no waiver for tenant-boundary, cross-tenant deny, grant revocation, or
  lifecycle-denial proof

## Documentation Plan

- PRD updates:
  update `docs/prd/2026-05-05-0023-platform-authorization-admin-owner-v1.md`
  if the first route family or storage posture changes from this blueprint
- PRD test-case updates:
  create `docs/prd/test_cases/2026-05-05-platform-authorization-admin-owner-v1-test-cases.md`
  before Layer 4 runtime task breakdown
- Feature docs:
  update `src/features/tenantAuth/README.md`, `src/features/tenants/README.md`,
  and any first adopted route feature README when runtime seams change
- API contract docs:
  update `docs/api-contracts/tenant-auth.md` or the first selected route-family
  API contract if evaluator behavior changes public denial behavior
- OpenAPI:
  update maintained OpenAPI only when route contracts change
- Postman:
  update maintained Postman collections only when route contracts change
- Data dictionary:
  add or update entries for tenant access grant role/provenance fields,
  lifecycle authz facts, and authz audit proof storage if implemented
- Feature manifests:
  update `tenantAuth`, `tenants`, `tenantConfiguration`, or adopted route
  feature manifests when public seams or dependencies change
- Dependency graph artifacts:
  regenerate `docs/architecture/generated/feature-dependency-graph.*` when
  manifests or feature dependencies change
- Architecture map:
  review if platform authz foundation status moves from planning to runtime
- Standards platform-status snapshots:
  review security, QA, and AI-assisted development status snapshots if runtime
  implementation changes standards evidence posture
- Reconstruction questionnaire:
  update only if new bootstrap/migration/runtime assumptions are introduced
- Bootstrap and helper docs:
  update only if authz setup, migration, or local helper expectations change
- Maintained-artifacts sweep:
  permission mappings, capability catalog source registry/materialization,
  API contracts, data dictionaries, feature manifests, generated graph, PRD
  test cases, and relevant README files
- Runbook:
  required before support/emergency, recovery, or export workflows ship
- Privacy note:
  required before tenant data/log export or payment-adjacent account settings
  ship
- Standards review:
  required because this is permission-sensitive tenant-boundary work
- Repo health review:
  recommended after the first runtime route family adopts the evaluator

## Completion Guardrails

- Blocking QA outcomes:
  any failure in tenant boundary, cross-tenant deny, root/tenant separation,
  pending/revoked admin deny, lifecycle/deletion deny, safe denial mapping, or
  grant migration/backfill
- Explicitly deferred verification layers and rationale:
  frontend, accessibility, export-job, payment-provider, support/emergency, and
  broad ABAC/ReBAC tests are deferred because those runtime surfaces are not in
  the first foundation slice
- Expected release-gate residual risk statement:
  first foundation runtime work may ship only as backend/platform evaluator and
  one narrow route adoption. Broader tenant account management, export,
  support, emergency, ABAC, ReBAC, and UI capabilities remain blocked until
  their own API/data/job/runbook/frontend planning and tests exist.
