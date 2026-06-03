# Capability Matrix v5 Template

Use one row per capability in the matrix.

V5 extends the v4 capability matrix with explicit architecture, authorization,
lifecycle, audit, compatibility, frontend topology, testing/evidence, and
source-traceability fields. Use v5 for new permission-sensitive,
platform-scope, tenant-boundary, asset, billing, compliance, frontend, or
background-job capabilities.

V4 matrices remain legacy-compatible. Do not mass-migrate older matrices unless
the feature is already being materially refreshed.

## Capability Identity

- Feature
- Capability
- Capability type
- Phase
- Status

## Business Intent

- Business goal
- Primary actor
- Capability boundary
- Tenant context rule
- Authorization summary
- Governing authz capability

## Architecture And Authorization Envelope

- Authority world
  - `root`
  - `tenant`
  - `system`
  - `public`
  - `shared-cross-tenant`
  - `shared-platform`
- Actor boundary
  - root actor, tenant actor, system job, public caller, platform seam, or
    governance harness
- Tenant context required
  - `yes`, `no`, or `conditional`
- Tenant context source
  - session, explicit selection, route param, job payload, not applicable, or
    another approved source
- Cross-tenant posture
  - `denied-by-default`
  - `root-approved`
  - `shared-cross-tenant-approved`
  - `not-applicable`
- Grant source posture
  - `documentation-only`
  - `seed-backed`
  - `corrective-migration-backed`
  - `runtime-enforced`
  - `blocked`
- UI eligibility
  - `not-exposed`
  - `read-only`
  - `usable-when-runtime-enforced`
  - `blocked`
- Runtime enforcement required
  - `yes` or `no`
- Lifecycle gate required
  - `yes`, `no`, or `conditional`
- Denial category
  - platform authorization denial category or `not-applicable`
- Authz audit posture
  - `none`
  - `deny-only`
  - `sensitive-allow-and-deny`
  - `all-decisions`
  - `support-emergency`
- Evaluator layers
  - ordered list such as
    `authn; tenant-boundary; lifecycle; feature-config; rbac; proof`
- Object rule required
  - `none`
  - `current-tenant-entity`
  - `entity-owner`
  - `feature-owned-rule`
  - `future`
- ABAC/ReBAC extension
  - `none`
  - `typed-extension-only`
  - `implemented`
  - `blocked`
- Source artifact
  - PRD, ADR, Technical Steering, Story Breakdown, API contract, or other
    stable artifact path
- Compatibility posture
  - `backwards-compatible`
  - `migration-required`
  - `breaking-blocked`
  - `new-capability`
- Background job authority
  - `not-applicable`
  - `system-job`
  - `delegated-user`
  - `tenant-scoped-job`

## Frontend Architecture Envelope

Use the same vocabulary as Technical Steering and Story Breakdown frontend
architecture snapshots. For backend-only rows, fill these fields with
`not-applicable` or the specific blocking posture rather than leaving them
blank.

- Frontend required
  - `yes`, `no`, `conditional`, or `blocked`
- Route family
- Product module
- Journey group
- Route visibility
- Actor scope
- Runtime shape
- Surface class
- Topology class
- Locator type
- Canonical locator
- Compatibility locators
- Topology authority
- State owner
- Shell governance
- Design-system prerequisite
- Governed component seam
- Component receptor mapping required
- Materialization model
- Source placement
- Frontend implementation readiness
- Frontend evidence

## Harness Gates

Use these compact gate fields to identify which downstream maintained
artifacts or governance checks are required. The matrix should point to the
required artifact or decision, not replace it.

- Data dictionary required
- API contract required
- Permission mapping required
- Asset decision required
- Job/cleanup decision required
- Compliance gate required
- Feature manifest required
- Runbook required
- Generated artifact update required
- Harness gate notes

## Backend Slice

- API required?
- Route(s)
- Request contract
- Response contract
- Error contract
- Feature seam(s)
- Cross-feature seams

## Persistence And Platform

- Persistence impact
- Migration required?
- Indexes / uniqueness
- Search / filter model
- Lifecycle / cleanup rules
- Expiry / abandoned-state behavior
- Orphaned external resource handling
- Scheduled maintenance or job dependency
- Cleanup retry and failure recording

When a capability may involve background work, bulk operations, retryable
external calls, delayed execution, imports/exports, cleanup, or long-running
processing, record the durable work entity, safe payload, job type, retry and
dead-letter posture, tenant/root context revalidation, idempotency, and
operator metadata here.

## Security / Privacy / Audit

- Authentication requirement
- Authorization enforcement layer
- Audit requirement
- Privacy / personal data impact
- Data classification / PII posture

## Delivery And Anti-Drift

- PRD required?
- ADR required?
- Test-case doc required?
- Feature docs update required?
- Standards review required?
- Traceability status
- Lifecycle version/status

## Verification

- Primary proof layer
- Required test families
- Required TC obligation
- Integration required
- Persistence-backed proof required
- Runtime verification required
- Browser/rendered proof required
- Mock honesty required
- Security test posture
- Audit test posture
- Compatibility test posture
- Performance/NFR posture
- QA artifact required
- Evidence gate
- Unit tests
- Integration tests
- Security tests
- Persistence-backed tests
- Acceptance notes
