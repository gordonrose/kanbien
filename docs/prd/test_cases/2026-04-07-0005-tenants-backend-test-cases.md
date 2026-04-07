# Tenants Backend Test Cases

## PRD Scope

- PRD:
  [2026-04-07-0005-tenants-backend.md](/home/gordon/kanbien/docs/prd/2026-04-07-0005-tenants-backend.md)
- Primary features involved:
  - `tenants`
- Cross-feature seams:
  - protected `tenants` routes depend on shared root-session authentication
  - protected `tenants` routes depend on shared authenticated-general rate
    limiting
  - protected `tenants` routes depend on the shared root-capability middleware
  - `tenants` will extend the capability catalog owned by `rootRoles`
  - future cross-feature tenant reads should use a narrow `tenants` public seam
    rather than `tenants/persistence/*`
- Notes:
  - this file is the initial PRD-derived source of truth for backend
    `tenants`
  - this slice is privileged and permission-sensitive, so allow and deny
    expectations are first-class
  - this slice introduces a new durable business root entity and should keep
    persistence-backed verification in scope for lifecycle and uniqueness rules
  - Traceability Enforcement: enforced
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Existing Test Impact

- Existing executable tests likely affected:
  - route-mounting smoke coverage under `tests/platform/`
  - shared protected-route coverage patterns already used by `rootUsers` and
    `rootRoles`
  - shared root-auth integration harness setup under `tests/harness/rootAuth/`
  - future capability-catalog tests once tenant capabilities are added to
    `rootRoles`
  - future privileged audit suites if tenant mutations and denials emit durable
    audit evidence
- Nature of impact:
  additive first; no direct expectation-changing conflicts are obvious yet
  because the tenant feature and tenant routes do not exist in code today
- Discussion needed before changing existing tests:
  no immediate discussion blocker is obvious; the first implementation should
  add new tenant-specific unit, integration, security, and audit coverage, then
  update any shared protected-route smoke coverage that assumes only the current
  mounted feature set

## Unit Tests For Individual Capabilities

- Capability: `createTenant`
  Test Case ID: `TC-TENANTS-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenants/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - creates a tenant with normalized `bizId`
  - defaults `status` to `draft` when omitted
  - stamps `createdByRootAdminUserId` from the authenticated root session
  - rejects duplicate normalized active `bizId`
  - rejects client-supplied system-managed fields
  Notes:
  - `bizId` is a durable tenant fact and should not be derived from related
    records

- Capability: `getTenant`
  Test Case ID: `TC-TENANTS-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenants/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns one visible tenant by exact ID
  - includes `createdByRootAdminUserId` in exact reads
  - rejects invalid `tenantId`
  - hides soft-deleted tenants from the visible read path

- Capability: `listTenants`
  Test Case ID: `TC-TENANTS-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenants/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns paginated tenant results
  - applies repo-default pagination and sort behavior deterministically
  - excludes soft-deleted tenants by default
  - filters by `bizIdPrefix`, `namePrefix`, `category`, and `status`
  - omits `createdByRootAdminUserId` from list rows in the first slice

- Capability: `updateTenant`
  Test Case ID: `TC-TENANTS-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenants/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - updates `name`, `category`, and `status`
  - refreshes `updatedAt`
  - rejects attempts to mutate immutable `bizId`
  - rejects system-managed field overrides
  - rejects updates to soft-deleted tenants
  Notes:
  - this case should keep the current PRD choice that status changes remain
    inside `updateTenant`

- Capability: `getDeletedTenant`
  Test Case ID: `TC-TENANTS-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenants/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns one deleted tenant by exact ID
  - excludes active tenants from the deleted-only read path
  - rejects invalid `tenantId`

- Capability: `listDeletedTenants`
  Test Case ID: `TC-TENANTS-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenants/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns paginated deleted-tenant results only
  - supports the same approved filters as the active list
  - excludes active tenants from the deleted list surface

- Capability: `softDeleteTenant`
  Test Case ID: `TC-TENANTS-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenants/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - sets `deletedAt`
  - refreshes `updatedAt`
  - forces exposed `status` to `inactive`
  - preserves `preDeleteStatus` for later reactivation
  - rejects deletion of an already deleted tenant

- Capability: `reactivateTenant`
  Test Case ID: `TC-TENANTS-UNIT-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenants/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - clears `deletedAt`
  - refreshes `updatedAt`
  - restores `preDeleteStatus` automatically
  - rejects reactivation of a visible tenant
  - rejects reactivation when normalized active `bizId` uniqueness would
    collide

- Capability: `removeTenant`
  Test Case ID: `TC-TENANTS-UNIT-009`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenants/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - irreversibly removes a tenant in the tenant-only world allowed by the PRD
  - requires explicit confirmation
  - requires a non-empty reason
  - rejects repeat remove of a missing tenant
  Notes:
  - this capability is the highest-risk part of the slice and should stay
    tightly scoped to the current no-dependent-entities assumption

## Integration Tests For Features Working Together

- Flow: authenticated root session can reach protected tenant routes
  Test Case ID: `TC-TENANTS-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant rows through the shared durable-test helper path if
  preserve-mode debugging is used
  Features:
  - `rootAuth`
  - shared auth middleware
  - `tenants`
  Coverage:
  - a valid root-auth session can access protected tenant endpoints
  - route protection remains aligned with the root operator trust boundary

- Flow: tenant routes stay mounted behind shared rate limiting and root-session
  middleware in `/v1`
  Test Case ID: `TC-TENANTS-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Features:
  - shared `/v1` router
  - `rootAuth`
  - `tenants`
  Coverage:
  - the feature mounts at `/v1/tenants`
  - protected requests require an authenticated root session
  - the route family passes through the authenticated-general rate limit seam

- Flow: tenant lifecycle operations round-trip through router, service, and
  persistence
  Test Case ID: `TC-TENANTS-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant rows and any durable audit rows if preserve-mode
  debugging is used
  Features:
  - `tenants`
  - persistence layer
  Coverage:
  - create, read, update, soft delete, deleted read, reactivate, and remove
    behave coherently across the full stack
  - exact reads include `createdByRootAdminUserId`
  - list responses omit `createdByRootAdminUserId`

- Flow: tenant listing and deleted-list separation remain consistent with the
  filter contract
  Test Case ID: `TC-TENANTS-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant rows through the shared durable-test helper path if
  preserve-mode debugging is used
  Features:
  - `tenants`
  Coverage:
  - active list returns only visible tenants
  - deleted list returns only deleted tenants
  - `category` and `status` filters behave consistently across both surfaces
  - prefix filters remain scoped to the correct visibility set

## NFR Security Tests

- Scenario: unauthenticated callers are denied across the tenant route family
  Test Case ID: `TC-TENANTS-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - unauthenticated requests to create, read, list, delete, reactivate, and
    remove routes are denied
  - denial payloads stay within the repo-standard protected-route error shape

- Scenario: authenticated root users without the required tenant capability are
  denied per route
  Test Case ID: `TC-TENANTS-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created setup rows through the shared durable-test helper path if
  preserve-mode debugging is used
  Coverage:
  - each tenant route enforces its mapped capability gate
  - holding one tenant capability does not imply access to sibling capabilities
  - deleted-read and remove remain explicit privileged capabilities
  Notes:
  - this case should also prove the new capability catalog entries are actually
    wired into enforcement

- Scenario: request validation rejects malformed identifiers, illegal enum
  values, and system-managed fields without mutating storage
  Test Case ID: `TC-TENANTS-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register any setup rows through the shared durable-test helper path if
  preserve-mode debugging is used
  Coverage:
  - invalid UUID route params are rejected
  - invalid `category` or `status` values are rejected
  - create and update reject system-managed fields
  - rejected requests do not create or mutate tenant rows

## NFR Logging Or Audit Tests

- Scenario: successful privileged tenant mutations produce durable audit
  evidence
  Test Case ID: `TC-TENANTS-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant rows and durable audit rows through the shared
  durable-test helper path if preserve-mode debugging is used
  Coverage:
  - create, update, soft delete, reactivate, and remove each emit structured
    audit evidence when the shared audit posture requires it
  - create audit correlates actor root user with stored
    `createdByRootAdminUserId`
  Notes:
  - if the first implementation reuses an existing audit sink rather than a
    tenant-local table, the case should still assert durable operator-visible
    evidence

- Scenario: denied privileged tenant actions remain operator-visible through
  the audit posture used by protected features
  Test Case ID: `TC-TENANTS-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register any durable audit rows through the shared durable-test helper path
  if preserve-mode debugging is used
  Coverage:
  - denied capability-gated tenant actions remain visible where the platform
    currently keeps denied privileged attempts
  - audit visibility does not leak disallowed payload details beyond the
    approved posture

## Edge Cases And Negative Tests

- Scenario: active uniqueness applies only to normalized active `bizId`
  Test Case ID: `TC-TENANTS-EDGE-001`
  Recommended Test Layer: `persistence-integration`
  Suggested Test Folder: `tests/integration/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant rows through the shared durable-test helper path if
  preserve-mode debugging is used
  Coverage:
  - duplicate normalized `bizId` is rejected for active tenants
  - a soft-deleted tenant does not by itself prove reactivation is safe if a
    new active tenant now owns the same normalized `bizId`
  Notes:
  - this case should be proven against Postgres, not only mocked repositories

- Scenario: soft delete and reactivation preserve the right lifecycle history
  Test Case ID: `TC-TENANTS-EDGE-002`
  Recommended Test Layer: `persistence-integration`
  Suggested Test Folder: `tests/integration/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant rows through the shared durable-test helper path if
  preserve-mode debugging is used
  Coverage:
  - `preDeleteStatus` stores the prior status durably
  - soft delete forces visible `inactive`
  - reactivation restores the original status instead of leaving the tenant
    `inactive`

- Scenario: remove remains distinct from soft delete
  Test Case ID: `TC-TENANTS-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register setup rows through the shared durable-test helper path if
  preserve-mode debugging is used
  Coverage:
  - remove makes the tenant unavailable to both active and deleted reads
  - soft-deleted tenants remain recoverable through deleted routes until
    explicitly reactivated or removed

- Scenario: pagination and filter behavior remain stable at repo defaults
  Test Case ID: `TC-TENANTS-EDGE-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenants/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant rows through the shared durable-test helper path if
  preserve-mode debugging is used
  Coverage:
  - default `page = 1` and `pageSize = 25` apply
  - minimum and maximum page-size bounds are enforced
  - default order direction remains `desc`

## Coverage Gaps Or Open Questions

- Item:
  the PRD keeps status changes inside `updateTenant` for now; if that decision
  changes before implementation, several unit, integration, security, and audit
  cases in this file will need to be split or renumbered rather than silently
  stretched
- Item:
  the implementation must make an explicit storage choice for durable
  `preDeleteStatus`; the persistence-backed cases above assume a real column or
  equally durable mechanism, not audit-log reconstruction
- Item:
  the PRD and blueprint expect audit visibility for privileged tenant actions,
  but the concrete audit sink and event taxonomy do not yet exist in code; the
  executable audit suite should pin that seam explicitly when implemented
