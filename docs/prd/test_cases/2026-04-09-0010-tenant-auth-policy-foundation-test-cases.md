# PRD Test Cases

## PRD Scope

- PRD:
  [2026-04-09-0010-tenant-auth-policy-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-09-0010-tenant-auth-policy-foundation.md)
- Primary features involved:
  `tenantConfiguration`, `tenantAuth`, `rootRoles`, `tenants`
- Cross-feature seams:
  root capability checks, visible tenant lookup, current tenant session context
- QA coverage-matrix classification:
  auth/session and persistence-sensitive workflow with privileged root config
- Journey inventory required:
  yes
- Required human QA artifacts:
  QA checklist; exploratory QA note; curated test-run summary
- Notes:
  explicit planning should consider remediation state, race/conflicting session
  writes, policy-aware password validation, and shared-principal session TTL
  aggregation

## Existing Test Impact

- Existing executable tests likely affected:
  `tests/unit/tenantAuth/service.test.ts`
  `tests/integration/tenantAuth/flow.test.ts`
  `tests/integration/tenantAuth/persistence.test.ts`
  `tests/e2e/tenantAuth/*`
- Nature of impact:
  additive plus expectation-changing for tenant-auth login/session behavior
- Discussion needed before changing existing tests:
  no; the feature loop intentionally extends tenant-auth workflow behavior

## Unit Tests For Individual Capabilities

- Capability:
  effective tenant policy resolution with defaults plus overrides
  Test Case ID: `TC-TENANT-AUTH-POLICY-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantConfiguration/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - default policy when no override exists
  - override merge when some fields are null
  - `policySource` and `hasTenantOverride` truthfulness
  - effective session-policy defaults and hard-limit metadata
  Notes:
  include tenant category compatibility notes if defaults later diverge

- Capability:
  password-policy validation
  Test Case ID: `TC-TENANT-AUTH-POLICY-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantConfiguration/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - hard platform floors
  - `min <= max`
  - aggregate mins not exceeding `maxLength`
  - session TTL floor and ceiling validation
  - empty strings rejected by contract layer
  Notes:
  explicit reasons should be stable for corrective UX

- Capability:
  aggregate shared-principal password-policy resolution
  Test Case ID: `TC-TENANT-AUTH-POLICY-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - one tenant
  - multiple tenants with stricter aggregate mins
  - no active contexts error path where relevant
  Notes:
  aggregate policy should remain compatible with the shared-principal model

- Capability:
  aggregate shared-principal session TTL resolution
  Test Case ID: `TC-TENANT-AUTH-POLICY-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - one tenant inherits its effective TTL
  - multiple tenants resolve to the shortest allowed TTL
  - no active contexts falls back to the system default TTL
  Notes:
  shared-principal sessions must not outlive a stricter tenant's configured
  expiry posture

## Integration Tests For Features Working Together

- Flow:
  root read and update of tenant auth policy
  Test Case ID: `TC-TENANT-AUTH-POLICY-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantConfiguration/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Features:
  `tenantConfiguration`, `tenants`, `rootRoles`
  Coverage:
  - exact-tenant read
  - valid update
  - immediate effective-policy read-after-write
  - session TTL override read-after-write
  Notes:
  include deleted-tenant not-found behavior

- Flow:
  tenant current-tenant self-read of policy
  Test Case ID: `TC-TENANT-AUTH-POLICY-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantConfiguration/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Features:
  `tenantConfiguration`, `tenantAuth`
  Coverage:
  - current tenant session read success
  - no current tenant context conflict
  Notes:
  current tenant is server-side only

- Flow:
  login creates remediation-gated session when valid password no longer meets current policy
  Test Case ID: `TC-TENANT-AUTH-POLICY-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Features:
  `tenantAuth`, `tenantConfiguration`
  Coverage:
  - valid credentials accepted
  - remediationRequired returned
  - session remains authenticated but blocked
  - session expiry comes from the effective shared-principal tenant TTL policy
  Notes:
  must not masquerade as invalid credentials

- Flow:
  remediation completion clears gated state
  Test Case ID: `TC-TENANT-AUTH-POLICY-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Features:
  `tenantAuth`, `tenantConfiguration`
  Coverage:
  - policy-compliant password accepted
  - session transitions out of remediation
  - subsequent session read shows remediation cleared
  Notes:
  no bypass path

## End-To-End Journey Tests

- Flow:
  root changes tenant password policy and tenant principal is forced through remediation after successful login
  Test Case ID: `TC-TENANT-AUTH-POLICY-E2E-001`
  Related Journey ID:
  `JY-TENANT-AUTH-POLICY-001`
  Recommended Test Layer: `end-to-end-journey`
  Suggested Test Folder: `tests/e2e/tenantAuthPolicy/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Coverage:
  - root update
  - valid login
  - remediation read
  - remediation password change
  - session unblocked
  Notes:
  this is the foundational happy path

- Flow:
  multi-tenant principal selects tenant before remediation guidance is available
  Test Case ID: `TC-TENANT-AUTH-POLICY-E2E-002`
  Related Journey ID:
  `JY-TENANT-AUTH-POLICY-002`
  Recommended Test Layer: `end-to-end-journey`
  Suggested Test Folder: `tests/e2e/tenantAuthPolicy/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Coverage:
  - login returns selection-required state
  - tenant selection remains allowed while remediation-gated
  - remediation becomes readable after current tenant is established
  Notes:
  keeps tenant selection and remediation state machine truthful

## NFR Security Tests

- Scenario:
  unauthorized root or tenant actor is denied policy access or update
  Test Case ID: `TC-TENANT-AUTH-POLICY-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantConfiguration/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Coverage:
  - missing root capability denied
  - tenant cross-context read denied
  - remediation self-ownership enforced
  Notes:
  include unauthenticated access

## NFR Logging Or Audit Tests

- Scenario:
  policy writes and remediation completion are auditable
  Test Case ID: `TC-TENANT-AUTH-POLICY-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/tenantConfiguration/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Coverage:
  - successful policy update
  - successful remediation completion
  - denied privileged update where auditable
  Notes:
  align with current platform security audit conventions

## NFR Concurrency And Idempotency Tests

- Scenario:
  remediation completion and session-state mutation remain truthful under concurrent calls
  Test Case ID: `TC-TENANT-AUTH-POLICY-CONC-001`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Coverage:
  - repeated remediation submit does not create inconsistent session state
  - conflicting selection/remediation transitions remain truthful
  Notes:
  persistence-backed extension may be required if durable atomicity is the claim

## NFR Performance, Stress, And Soak Tests

- Scenario:
  policy-aware login and session read remain within conservative local budgets
  Test Case ID: `TC-TENANT-AUTH-POLICY-PERF-001`
  Recommended Test Layer: `performance`
  Suggested Test Folder: `tests/performance/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: ordinary test cleanup
  Coverage:
  - login with policy resolution
  - remediation-aware session reads
  - session TTL resolution stays inside the same local budget envelope
  Notes:
  can extend the existing tenant-auth non-functional package

## Edge Cases And Negative Tests

- Scenario:
  invalid bounds or impossible policy combinations are rejected
  Test Case ID: `TC-TENANT-AUTH-POLICY-EDGE-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantConfiguration/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - aggregate mins exceed max
  - maximum below minimum
  - tenant not found
  Notes:
  use stable corrective reasons

## Coverage Gaps Or Open Questions

- Item:
  auth-method modes beyond password-only remain future work

## Required QA Evidence

- QA checklist required:
  yes
- Exploratory QA note required:
  yes
- Curated test-run summary required:
  yes
- Waiver or quarantine record expected:
  only if a blocking gate exception is required
