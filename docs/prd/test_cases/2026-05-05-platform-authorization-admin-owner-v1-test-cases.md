# PRD Test Cases: Platform Authorization `adminOwner` V1

## PRD Scope

- PRD:
  [2026-05-05-0023-platform-authorization-admin-owner-v1.md](/home/gordon/kanbien/docs/prd/2026-05-05-0023-platform-authorization-admin-owner-v1.md)
- Primary features involved:
  - `tenantAuth`
  - `tenants`
  - platform `authz` library under `src/lib/authz/`
  - platform security/audit repository
- Cross-feature seams:
  - `tenantAuth` session and tenant access grant seams
  - `tenantAdmins` subject lifecycle evidence consumed through `tenantAuth`
  - `tenants` lifecycle/deletion authz facts
  - future `tenantConfiguration` or entitlement feature/configuration gates
  - API denial contract in
    `docs/api-contracts/platform-authorization-denials.md`
  - capability catalog and permission mappings after runtime enforcement exists
- QA coverage-matrix classification:
  authorization, tenant isolation, shared platform seam, persistence/migration,
  audit/proof, compatibility/contract, and future frontend permission-rendering
  gate
- Journey inventory required:
  not for the evaluator foundation alone. Required later when a concrete
  tenant-admin route family or UI workflow ships.
- Required human QA artifacts:
  QA checklist, structured exploratory QA note, and curated test-run summary
  are required before the first runtime route adoption is considered complete.
- Notes:
  - this is a PRD-derived planning artifact, not executable tests
  - the first foundation slice should avoid account settings, payment, billing,
    and export routes until their own API/data/job/runbook decisions exist
  - trace executable tests by including these `TC-*` IDs in test names or
    nearby comments

## Existing Test Impact

- Existing executable tests likely affected:
  - `tests/unit/tenantAuth/`
  - `tests/integration/tenantAuth/`
  - `tests/security/tenantAuth/`
  - `tests/audit/tenantAuth/`
  - `tests/integration/tenants/`
  - `tests/security/tenants/`
  - future tests for the first selected tenant route family
- Nature of impact:
  additive for planning. Runtime implementation will add new evaluator,
  grant-role, lifecycle-gate, denial-contract, and audit/proof cases. Existing
  tenant-auth tests should not be rewritten unless they encode the older
  assumption that authenticated tenant session alone is sufficient for protected
  tenant authorization.
- Discussion needed before changing existing tests:
  yes before any expectation-changing edits. In particular, discuss changes if
  current tests assert access with only a valid tenant session and no explicit
  `adminOwner` grant proof.

## Unit Tests For Individual Capabilities

- Capability: central evaluator applies v1 layer order
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-UNIT-001`
  Related Story / AC: S-004 / AC-S004-01, AC-S004-02
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/authz/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - evaluates auth/session before tenant boundary
  - evaluates tenant context before lifecycle
  - evaluates lifecycle before feature/configuration
  - evaluates feature/configuration before RBAC
  - evaluates RBAC before typed ABAC/ReBAC/object extension points
  - returns proof showing the layer that allowed or denied the request
  Notes:
  - inferred from ADR-0036 and the implementation blueprint

- Capability: tenant context resolver requires exactly one current tenant
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-UNIT-002`
  Related Story / AC: S-004 / AC-S004-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/authz/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - denies when tenant selection is required
  - denies when current tenant context is unavailable
  - denies when route/object tenant differs from session tenant
  - refuses to trust mutable body tenant ids as authority
  - allows evaluation to continue when exactly one tenant context is validated

- Capability: `adminOwner` grant resolver reads v1 tenant role truth
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-UNIT-003`
  Related Story / AC: S-003 / AC-S003-01, AC-S003-02
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/authz/` or `tests/unit/tenantAuth/`
  Requires Shared Test Helper: yes; tenant principal/grant fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a for pure unit tests
  Coverage:
  - resolves active `adminOwner` grants for the current tenant
  - denies missing grants
  - denies revoked grants
  - denies grants for another tenant
  - denies pending/setup-incomplete tenant admins
  - keeps root roles out of tenant grant resolution

- Capability: lifecycle gate maps current tenant facts honestly
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-UNIT-004`
  Related Story / AC: S-005 / AC-S005-01, AC-S005-02
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/authz/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - maps current `tenant.status` values to authz posture
  - maps `deletedAt` to derived deletion posture without inventing future
    storage facts
  - denies `inactive` normal login/use where required
  - denies `softDeleted` normal tenant access
  - records future `hardDeletePending` and `hardDeleted` as unsupported until
    storage exists

- Capability: denial mapper returns safe public codes
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-UNIT-005`
  Related Story / AC: S-002 / AC-S002-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/authz/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - maps unauthenticated and invalid session to 401 categories
  - maps tenant selection/configuration required to recoverable 409 categories
  - maps safe forbidden decisions to 403
  - maps sensitive/cross-tenant existence cases to safe fallback behavior
  - keeps internal reasons more precise than public messages

- Capability: ABAC/ReBAC/object rules are typed extension points only in v1
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-UNIT-006`
  Related Story / AC: S-004 / AC-S004-03
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/authz/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - skips absent ABAC/ReBAC facts explicitly
  - fails closed when a route declares required object facts but none are
    supplied
  - prevents generic attribute strings from becoming authority
  - proves future resolvers are feature-owned inputs, not evaluator-invented
    policy

## Integration Tests For Features Working Together

- Flow: tenant session plus active `adminOwner` grant allows first protected
  route adoption
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-INT-001`
  Related Story / AC: S-004, S-006 / AC-S004-01, AC-S006-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/authz/` or first adopted route
    family folder
  Requires Shared Test Helper: yes; tenant auth/session/grant helper
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register tenant, tenant admin, principal, grant, session, and audit/proof
  records created by the test
  Features:
  - `tenantAuth`
  - `tenants`
  - first adopted tenant route family
  Coverage:
  - authenticated tenant session resolves one current tenant
  - active `adminOwner` grant allows the route
  - response contract remains route-specific and does not expose authz internals

- Flow: revoked grant immediately denies previously authorized tenant actor
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-INT-002`
  Related Story / AC: S-003 / AC-S003-02
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register durable grant/session/audit rows
  Features:
  - `tenantAuth`
  - first adopted tenant route family
  Coverage:
  - existing session does not continue authorizing after grant revocation
  - denial uses missing capability or revoked grant category
  - historical action/grant records remain queryable for audit proof

- Flow: lifecycle gate denies before feature-specific business logic
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-INT-003`
  Related Story / AC: S-005 / AC-S005-02
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/authz/`
  Requires Shared Test Helper: yes; tenant lifecycle fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register tenant lifecycle state changes and dependent records
  Features:
  - `tenants`
  - `tenantAuth`
  - first adopted tenant route family
  Coverage:
  - `disabled` behavior follows the selected route policy
  - `inactive` denies normal tenant access
  - soft-deleted tenant denies normal tenant access
  - feature service mutation/read path is not reached after lifecycle denial

- Flow: feature/configuration gate denies before RBAC when unavailable
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-INT-004`
  Related Story / AC: S-006 / AC-S006-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/authz/`
  Requires Shared Test Helper: yes; feature gate resolver fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register tenant/session/grant and feature gate state
  Features:
  - platform authz evaluator
  - future feature/configuration or entitlement resolver
  Coverage:
  - root-unavailable feature denies even with `adminOwner`
  - tenant-disabled option denies when route requires activation
  - denial category distinguishes feature unavailable from missing role

## End-To-End Journey Tests

- Flow: first real tenant-admin route adoption proves login-to-protected-read
  journey
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-E2E-001`
  Related Story / AC: S-004, S-006
  Related Journey ID: future first route-family journey
  Recommended Test Layer: `end-to-end-journey`
  Suggested Test Folder: `tests/e2e/authz/` or first adopted route family
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  run-scoped durable test data cleanup for tenant auth/session/grant records
  Coverage:
  - tenant admin completes authentication
  - current tenant is selected explicitly when needed
  - protected route allows only after current tenant and `adminOwner` authority
  - route denies after grant revocation or lifecycle restriction
  Notes:
  - not required for evaluator-only unit work, required for first runtime route
    adoption

## NFR Security Tests

- Scenario: cross-tenant access denies by default
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-SEC-001`
  Related Story / AC: S-004 / AC-S004-01
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register both tenants, grants, sessions, and attempted target records
  Coverage:
  - actor with tenant A context cannot access tenant B object
  - actor with grants in multiple tenants must still select exactly one context
  - mutable body tenant id cannot override server-side context
  - sensitive fallback does not reveal hidden tenant/object existence

- Scenario: root authority and tenant authority do not collapse
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-SEC-002`
  Related Story / AC: S-006 / AC-S006-02
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register root and tenant auth records separately
  Coverage:
  - root role does not pass tenant `adminOwner` checks through tenant routes
  - tenant `adminOwner` does not pass root-owned route capability checks
  - support/emergency capability paths remain root-only and explicit

- Scenario: pending/setup-incomplete tenant admin cannot authorize
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-SEC-003`
  Related Story / AC: S-003 / AC-S003-02
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register tenant admin, invite/setup state, principal/grant where applicable
  Coverage:
  - pending invite has no protected-route authority
  - setup incomplete has no protected-route authority unless a route explicitly
    allows onboarding-only behavior
  - accepted/setup-complete actor may authorize with active grant

- Scenario: UI eligibility remains blocked without runtime enforcement proof
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-SEC-004`
  Related Story / AC: S-009 / AC-S009-02
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/capabilityContractCatalog/`
  Requires Shared Test Helper: yes when catalog materialization is implemented
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register catalog/materialization records if durable
  Coverage:
  - documentation-only rows are not exposed as usable UI actions
  - seed-backed rows are not treated as UI-eligible without route proof
  - runtime-enforced posture requires matching server-side tests

## NFR Logging Or Audit Tests

- Scenario: denied decisions emit required audit/proof posture
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-AUD-001`
  Related Story / AC: S-008 / AC-S008-01, AC-S008-02
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register authz audit/proof rows or existing audit rows written by the test
  Coverage:
  - missing capability denial is audit-visible where required
  - cross-tenant denial is audit-visible where required
  - lifecycle denial is audit-visible where required
  - proof includes actor, authority world, tenant, capability, decision, reason,
    policy source, visibility, severity, and occurredAt when the selected sink
    supports those fields

- Scenario: proof-field honesty for existing audit adapter
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-AUD-002`
  Related Story / AC: S-008 / AC-S008-01
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register audit rows
  Coverage:
  - if using existing `auth_audit_events`, tests prove which required authz
    fields are not stored there
  - implementation does not claim durable proof fields that the sink discards
  - support/emergency remains blocked until reason/reference and severity can
    be stored

- Scenario: grant source posture changes are audit-visible
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-AUD-003`
  Related Story / AC: S-003, S-008
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register grant and audit rows
  Coverage:
  - grant creation/backfill posture is visible
  - revocation is visible
  - corrective migration or seed posture does not silently masquerade as
    runtime enforcement

## NFR Concurrency And Idempotency Tests

- Scenario: grant backfill migration is idempotent
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-CONC-001`
  Recommended Test Layer: `persistence-backed`
  Suggested Test Folder: `tests/integration/tenantAuth/` or `tests/persistence/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  database migration test schema cleanup through existing harness
  Coverage:
  - applying migration/backfill twice does not duplicate active grants
  - existing active grants receive `adminOwner` role posture once
  - revoked grants remain revoked

- Scenario: concurrent grant revocation and route authorization fail closed
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-CONC-002`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register grant/session/audit rows
  Coverage:
  - route authorization after committed revocation denies
  - evaluator does not cache stale grant allow across requests
  - audit/proof reflects the committed decision state

## NFR Performance, Stress, And Soak Tests

- Scenario: evaluator avoids excessive cross-feature reads on protected route
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-PERF-001`
  Recommended Test Layer: `performance`
  Suggested Test Folder: `tests/performance/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes if durable fixtures are created
  Cleanup Expectation:
  cleanup tenant/session/grant fixtures
  Coverage:
  - repeated allow decisions stay within a conservative lookup budget
  - denied decisions do not perform unnecessary feature-object reads after an
    earlier layer denies
  - route-adoption performance is measured only after a real route family is
    selected

## NFR Resilience And Compatibility Tests

- Scenario: resolver failure maps to safe denial or service error posture
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-RES-001`
  Recommended Test Layer: `resilience`
  Suggested Test Folder: `tests/integration/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register durable fixtures if route-backed
  Coverage:
  - tenant lifecycle resolver failure does not allow access
  - grant resolver failure does not allow access
  - audit sink failure behavior follows the implementation blueprint decision
  - public response remains safe and does not leak internal failure detail

- Scenario: existing root and tenant-auth API denial behavior remains compatible
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-RES-002`
  Recommended Test Layer: `compatibility-contract`
  Suggested Test Folder: `tests/compatibility/authz/` or existing route-family
    integration folders
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes if durable data is created
  Cleanup Expectation:
  register route-family fixtures
  Coverage:
  - existing root routes preserve current `UNAUTHORIZED`, `INVALID_SESSION`,
    and `FORBIDDEN` behavior unless migrated
  - existing tenant-auth routes preserve current session/selection behavior
  - new shared denial categories apply only to route families that adopt them

## Edge Cases And Negative Tests

- Scenario: malformed or unknown capability keys deny safely
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-EDGE-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/authz/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - blank capability key is rejected
  - unknown capability key denies
  - malformed authority world denies
  - denial proof is still well-formed

- Scenario: tenant lifecycle future states are not guessed from missing fields
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-EDGE-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/authz/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - hard-delete posture is not inferred unless storage exposes it
  - legal hold and retention blockers are not silently assumed false
  - unsupported future lifecycle facts produce explicit unsupported/deferred
    proof posture where relevant

- Scenario: multiple active tenant grants still require one selected context
  Test Case ID: `TC-AUTHZ-ADMIN-OWNER-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/authz/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register multiple tenant grants and tenant session rows
  Coverage:
  - multi-tenant principal without selected tenant receives selection-required
    denial
  - selecting tenant A does not permit tenant B access
  - switching tenant context requires explicit action outside the protected
    route request body

## Coverage Gaps Or Open Questions

- First route family:
  test cases name route-adoption obligations, but executable route tests depend
  on selecting the first concrete route family.
- Audit sink:
  proof-field tests depend on whether runtime uses existing `auth_audit_events`
  as a compatibility adapter or introduces a new authz audit sink.
- Lifecycle storage:
  ADR-0037 full storage and hard-delete/legal-hold behavior require a later
  data dictionary and migration plan.
- Tenant account management and exports:
  not covered as first runtime route implementation. They need separate API,
  data, job/cleanup, runbook, privacy, and cost-gating test cases when scoped.
- Frontend:
  no rendered tests are planned until a UI surface is approved through
  design-system/adoption governance and runtime-enforced capability proof.

## Required QA Evidence

- QA checklist required:
  yes for first runtime route adoption
- Exploratory QA note required:
  yes for first runtime route adoption because this is authorization and
  tenant-isolation sensitive
- Curated test-run summary required:
  yes for first runtime route adoption
- Waiver or quarantine record expected:
  not expected. Any waiver for tenant boundary, cross-tenant deny, grant
  revocation, or lifecycle-denial proof should be treated as blocking unless
  explicitly approved with owner and expiry.
