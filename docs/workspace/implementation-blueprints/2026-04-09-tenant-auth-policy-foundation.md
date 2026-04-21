# Tenant Auth Policy Foundation Implementation Blueprint

## Summary

- Feature:
  `tenantConfiguration` plus targeted `tenantAuth` integration
- Capability:
  tenant-scoped auth-policy storage, effective policy resolution, and
  remediation-aware tenant-auth workflow
- Scope:
  backend feature slice only
- Phase:
  implemented backend foundation slice

## Inputs

- Capability matrix reference:
  [2026-04-09-tenant-auth-policy-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-09-tenant-auth-policy-foundation-capability-matrix-first-draft.csv)
- PRD:
  [2026-04-09-0010-tenant-auth-policy-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-09-0010-tenant-auth-policy-foundation.md)
- ADR(s):
  - [0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md](/home/gordon/kanbien/docs/architecture/adr/0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md)
  - [0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md](/home/gordon/kanbien/docs/architecture/adr/0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md)
- PRD test-case doc:
  [2026-04-09-0010-tenant-auth-policy-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-09-0010-tenant-auth-policy-foundation-test-cases.md)
- Journey inventory:
  [2026-04-10-0010-tenant-auth-policy-foundation-journey-inventory.md](/home/gordon/kanbien/docs/prd/journey_inventories/2026-04-10-0010-tenant-auth-policy-foundation-journey-inventory.md)
- QA coverage matrix classification:
  auth/session, privileged root config, persistence-backed workflow, and
  remediation-aware end-to-end journey slice
- QA release-gate expectation:
  required

## Frontend Plan

- Route / surface:
  none in this slice
- UI states:
  root policy read/update and tenant remediation are frontend-ready only
- Permission visibility behavior:
  root routes are root-only; tenant policy read is current-tenant only;
  remediation is self-service only
- Session / expiry behavior:
  remediation uses the authenticated tenant bearer session; new tenant sessions
  now derive expiry from the effective tenant auth policy session TTL
- Browser security considerations:
  no browser-shell work in this slice

## Backend Plan

- Route(s):
  - `GET /v1/tenants/:tenantId/auth-policy`
  - `PATCH /v1/tenants/:tenantId/auth-policy`
  - `GET /v1/tenant/auth-policy`
  - `GET /v1/tenant-auth/remediation`
  - `POST /v1/tenant-auth/remediation/password`
- Request/response/error contract:
  - effective policy responses return effective values plus provenance summary
  - effective policy responses now include `sessionPolicy` and `hardLimits`
  - remediation returns explicit workflow state rather than fake login failure
  - policy update uses root-only exact-tenant mutation and now accepts
    `sessionTtlSeconds`
  - tenant self-read uses current tenant session only
- Feature-local files expected:
  - `src/features/tenantConfiguration/*`
  - `src/features/tenantAuth/*` updates
  - `src/features/rootRoles/domain/capabilityCatalog.ts`
  - `src/routes/v1/index.ts`
- Cross-feature seams:
  - `tenants` visible-tenant read
  - `tenantAuth` current tenant session and principal access contexts
  - root capability checker
- Authorization enforcement point:
  root capability middleware for root routes; tenant session plus current
  tenant self-scope for tenant/remediation routes

## Persistence Plan

- Entities / rows affected:
  - new `tenant_auth_policy` table
  - extended `tenant_session` remediation state
  - tenant auth policy refinement adds durable `session_ttl_seconds`
- Migration changes:
  - add `tenantConfiguration` migration for policy overrides
  - add corrective tenant-configuration migration for `session_ttl_seconds`
  - add corrective `tenantAuth` migration for remediation session fields
- Index or uniqueness changes:
  - unique one-row-per-tenant auth policy
  - remediation-state session index if needed for exact session lookups
- Search / filter implications:
  exact read only in phase one
- Compatibility notes:
  password policy resolution stays compatible with the current shared-principal
  credential model through strictest-compatible aggregate validation; session
  TTL stays compatible by taking the shortest effective tenant TTL when one
  shared-principal session is minted across multiple accessible tenants

## Verification Plan

- Journey tier / workflow scope:
  Tier 0 for remediation-required login/remediation flow and root policy write
- Unit:
  policy validation, default/override merge, aggregate password-policy
  resolution, and aggregate session TTL resolution
- Integration:
  root read/write, tenant self-read, remediation-aware login/session flow, and
  effective session-expiry propagation
- Security:
  root deny, tenant cross-context deny, remediation self-ownership
- Audit:
  policy update and remediation completion
- Edge:
  invalid policy combinations and no-current-tenant conflicts
- Frontend:
  none
- Persistence-backed:
  policy row read/write including session TTL and remediation-state session
  persistence
- End-to-end:
  remediation flow and multi-tenant selection interaction
- Concurrency / idempotency:
  remediation submit and conflicting session transitions
- Performance:
  extend tenant-auth local non-functional checks
- Resilience / failure-injection:
  not primary in this slice
- Compatibility / contract:
  source-independent API contract update required
- Accessibility:
  none
- Structured exploratory QA:
  required
- QA checklist:
  required
- Curated test-run summary:
  required
- Waiver / quarantine expectation:
  only if a blocking gate exception is needed

## Documentation Plan

- PRD updates:
  create and then mark implemented status where appropriate; refresh when the
  policy family expands
- PRD test-case updates:
  create and update status for password and session-policy refinements
- Feature docs:
  add or update `tenantAuth` and new `tenantConfiguration` docs as needed
- API contract docs:
  updated `docs/api-contracts/tenant-auth.md` and added tenant
  configuration contract coverage
- OpenAPI:
  update for the new routes and response shapes
- Postman:
  update maintained collections and add tenant-configuration collection
- Data dictionary:
  add `tenant_auth_policy` and extended `tenant_session` fields, then refresh
  them when new policy columns change stored truth
- Architecture map:
  review configuration and SSO layer notes
- Standards platform-status snapshots:
  review QA, OWASP ASVS, NIST SSDF, and auth-related wording if control truth
  changes materially
- Reconstruction questionnaire:
  likely no change
- Bootstrap and helper docs:
  none expected
- Maintained-artifacts sweep:
  refresh earlier planning docs that still say remediation/policy slice is
  future work and implementation is pending; also refresh any earlier slice
  artifacts that still describe tenant session TTL as global-only
- Runbook:
  not required in phase one
- Privacy note:
  review only
- Standards review:
  required
- Repo health review:
  recommended after implementation

## Completion Guardrails

- Blocking QA outcomes:
  required layers must pass with no blocking flaky suites
- Explicitly deferred verification layers and rationale:
  broader provider/SSO compatibility remains out of scope
- Expected release-gate residual risk statement:
  password-only tenant auth policy is shipped; auth-method modes and SSO policy
  remain future work
