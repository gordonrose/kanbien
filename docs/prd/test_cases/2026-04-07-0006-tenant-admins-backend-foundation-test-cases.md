# Tenant Admins Auth-Ready Foundation Test Cases

## PRD Scope

- PRD:
  [2026-04-07-0006-tenant-admins-backend-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-07-0006-tenant-admins-backend-foundation.md)
- Primary features involved:
  - `tenantAdmins`
- Cross-feature seams:
  - protected tenant-admin operator routes depend on shared root-session
    authentication
  - protected tenant-admin operator routes depend on shared authenticated-general
    or authenticated-sensitive rate limiting, depending on the route class
  - protected tenant-admin operator routes depend on shared root-capability
    middleware
  - tenant-admin verification workflows depend on the shared one-time token seam
  - tenant-admin verification delivery depends on the `notificationDelivery`
    feature seam
  - tenant-admin routes depend on visible tenant existence through the `tenants`
    public seam
  - root capability catalog and permission mappings will extend via `rootRoles`
- Notes:
  - this file is the initial PRD-derived source of truth for backend
    `tenantAdmins`
  - this slice is privileged and permission-sensitive, so allow and deny
    expectations are first-class
  - this slice introduces a new durable tenant-owned actor record and a public
    verification-token redemption flow
  - this slice should prove clean ownership boundaries between:
    - `tenantAdmins`
    - shared token mechanics
    - `notificationDelivery`
  - Traceability Enforcement: enforced
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Existing Test Impact

- Existing executable tests likely affected:
  - shared protected-route coverage patterns already used by `rootUsers`,
    `rootRoles`, and `tenants`
  - shared root-auth integration harness setup under `tests/harness/rootAuth/`
  - capability-catalog and permission-mapping verification that currently does
    not include `tenantAdmins`
  - `notificationDelivery` and token-library integration coverage once
    tenant-admin verification workflows are added
  - shared public-route security coverage once a public verification-redemption
    route is mounted
- Nature of impact:
  additive first, but not purely additive forever
  because this PRD adds:
  - new privileged root-only route family
  - a public token-redemption route
  - new capability-gated privileged mutations
  - cross-feature workflow use of token and email-delivery seams
- Discussion needed before changing existing tests:
  no immediate blocker is obvious because `tenantAdmins` does not yet exist in
  code, but the eventual implementation will likely require updates to:
  - shared protected-route smoke coverage
  - capability-catalog assertions
  - public-route security coverage

## Unit Tests For Individual Capabilities

- Capability: `createTenantAdmin`
  Test Case ID: `TC-TENANT-ADMINS-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAdmins/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - creates a tenant-admin with normalized lowercase email
  - defaults `emailVerificationStatus` to `pending`
  - defaults `emailVerifiedAt` to `null`
  - defaults `lastVerificationEmailRequestedAt` to `null`
  - stamps `createdByRootAdminUserId` from the authenticated root session
  - rejects duplicate active normalized email within the same tenant
  - allows the same normalized email in different tenants
  - rejects client-supplied system-managed and auth-owned fields

- Capability: `getTenantAdmin`
  Test Case ID: `TC-TENANT-ADMINS-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAdmins/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns one visible tenant-admin by exact ID
  - includes verification-state fields in the response
  - rejects invalid `tenantAdminId`
  - hides soft-deleted rows from the normal read path
  - rejects cross-tenant exact reads when a valid `tenantAdminId` belongs to a
    different tenant

- Capability: `listTenantAdmins`
  Test Case ID: `TC-TENANT-ADMINS-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAdmins/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns paginated tenant-admin results
  - applies repo-default pagination and sort behavior deterministically
  - excludes soft-deleted rows by default
  - filters by `emailPrefix`, `firstNamePrefix`, `lastNamePrefix`, and
    `emailVerificationStatus`
  - keeps results tenant-scoped only

- Capability: `updateTenantAdminProfile`
  Test Case ID: `TC-TENANT-ADMINS-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAdmins/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - updates editable profile fields only
  - refreshes `updatedAt`
  - rejects attempts to mutate tenant ownership or system-managed fields
  - rejects updates to soft-deleted rows
  - does not let profile update set `lastVerificationEmailRequestedAt`
  - when normalized email changes, resets:
    - `emailVerificationStatus` to `pending`
    - `emailVerifiedAt` to `null`
  - rejects duplicate active normalized email within the same tenant

- Capability: `sendTenantAdminVerificationEmail`
  Test Case ID: `TC-TENANT-ADMINS-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAdmins/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - allows verification send for a visible unverified tenant-admin
  - creates a feature-owned verification token record with purpose
    `email_verification`
  - calls the shared token seam to create token material
  - calls the `notificationDelivery` seam to send the verification email
  - persists operator-visible verification-send metadata
  - stamps `lastVerificationEmailRequestedAt`
  - rejects send for an already verified tenant-admin
  - rejects send for a deleted tenant-admin
  - maps provider misconfiguration and provider unavailability cleanly
  Notes:
  - this case should prove that transport and token mechanics are delegated to
    shared seams while workflow meaning remains feature-owned

- Capability: `resendTenantAdminVerificationEmail`
  Test Case ID: `TC-TENANT-ADMINS-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAdmins/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - mints fresh verification token material for resend
  - supersedes or invalidates prior active verification token records for the
    same tenant-admin
  - calls `notificationDelivery` with fresh content rather than replaying old
    secret-bearing content
  - refreshes `lastVerificationEmailRequestedAt`
  - rejects resend for an already verified tenant-admin
  - rejects resend for a deleted tenant-admin

- Capability: `redeemTenantAdminVerificationToken`
  Test Case ID: `TC-TENANT-ADMINS-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAdmins/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - accepts a valid verification token for the correct tenant-admin subject
  - marks the token used
  - sets `emailVerificationStatus` to `verified`
  - stamps `emailVerifiedAt`
  - rejects malformed tokens
  - rejects expired tokens
  - rejects used tokens
  - rejects superseded tokens
  - rejects purpose mismatch or subject mismatch
  - does not create a tenant-auth session as a side effect

- Capability: `softDeleteTenantAdmin`
  Test Case ID: `TC-TENANT-ADMINS-UNIT-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAdmins/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - sets `deletedAt`
  - refreshes `updatedAt`
  - preserves durable history
  - invalidates future verification eligibility
  - rejects deletion of an already deleted row

- Capability: `reactivateTenantAdmin`
  Test Case ID: `TC-TENANT-ADMINS-UNIT-009`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAdmins/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - clears `deletedAt`
  - refreshes `updatedAt`
  - restores visible lifecycle state
  - restores verification state to:
    - `pending`
    - `emailVerifiedAt = null`
  - rejects reactivation of a visible row
  - rejects reactivation when normalized active email uniqueness would collide
  - returns explicit and truthful verification-state fields after restore

## Integration Tests For Features Working Together

- Flow: authenticated root session can reach protected tenant-admin routes
  Test Case ID: `TC-TENANT-ADMINS-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant-admin rows and any durable token rows if preserve-mode
  debugging is used
  Features:
  - `rootAuth`
  - shared auth middleware
  - `tenantAdmins`
  - `tenants`
  Coverage:
  - a valid root-auth session can access protected tenant-admin operator
    endpoints
  - tenant-admin routes stay mounted under the tenant-scoped route family
  - verification send and resend use the authenticated-sensitive route posture

- Flow: tenant-admin lifecycle operations round-trip through router, service,
  and persistence
  Test Case ID: `TC-TENANT-ADMINS-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant-admin rows and token rows if preserve-mode debugging
  is used
  Features:
  - `tenantAdmins`
  - persistence layer
  Coverage:
  - create, read, list, update, soft delete, and reactivate behave coherently
    across the full stack
  - exact reads include verification-state fields
  - list responses include verification-state fields needed for operator follow-up

- Flow: verification send integrates tenant-admin workflow, token seam, and
  notification delivery correctly
  Test Case ID: `TC-TENANT-ADMINS-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant-admin rows token rows and outbound-email rows if
  preserve-mode debugging is used
  Features:
  - `tenantAdmins`
  - shared token seam
  - `notificationDelivery`
  Coverage:
  - verification send creates a durable verification token record
  - verification send creates durable outbound-email metadata and attempt history
  - operator-visible response includes latest verification-send truth
  - raw token secret is not stored in the outbound email content snapshot

- Flow: verification resend preserves fresh token semantics and truthful
  delivery history
  Test Case ID: `TC-TENANT-ADMINS-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant-admin rows token rows and outbound-email rows if
  preserve-mode debugging is used
  Features:
  - `tenantAdmins`
  - shared token seam
  - `notificationDelivery`
  Coverage:
  - resend produces a fresh token
  - prior active token is superseded or invalidated according to the feature
    rule
  - resend leaves durable outbound attempt history that remains operator-visible
  - resend does not replay old secret-bearing content blindly

- Flow: public verification redemption round-trips through router, token
  validation, and persistence without creating tenant auth
  Test Case ID: `TC-TENANT-ADMINS-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant-admin rows token rows and outbound-email rows if
  preserve-mode debugging is used
  Features:
  - `tenantAdmins`
  - shared token seam
  Coverage:
  - public redemption succeeds for a valid token
  - tenant-admin verification state is updated durably
  - token is consumed
  - no tenant session or principal/session side effect is created

## NFR Security Tests

- Scenario: unauthenticated callers are denied across the protected tenant-admin
  operator route family
  Test Case ID: `TC-TENANT-ADMINS-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - unauthenticated requests to protected operator routes return the shared auth
    denial response
  - no tenant-admin row, token row, or outbound-email row is created

- Scenario: authenticated root users without the required capability are denied
  for privileged tenant-admin mutations
  Test Case ID: `TC-TENANT-ADMINS-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - create, update, verification send, verification resend, delete, and
    reactivate are denied without the mapped capability grant
  - denied requests do not mutate tenant-admin rows or related token/email state

- Scenario: cross-tenant access is denied even when identifiers are valid
  Test Case ID: `TC-TENANT-ADMINS-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - exact read, update, delete, reactivate, and verification-send routes do not
    leak or mutate tenant-admin rows that belong to a different tenant

- Scenario: public verification redemption rejects invalid tokens safely
  Test Case ID: `TC-TENANT-ADMINS-SEC-004`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - malformed tokens are rejected
  - expired tokens are rejected
  - used tokens are rejected
  - superseded tokens are rejected
  - token mismatch does not create verification side effects

- Scenario: auth-sensitive content is redacted in durable outbound email records
  Test Case ID: `TC-TENANT-ADMINS-SEC-005`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created outbound-email rows if preserve-mode debugging is used
  Coverage:
  - verification emails redact raw verification links in durable content storage
  - token history remains feature-owned and separate from durable outbound-email
    snapshots

## NFR Audit / Logging Tests

- Scenario: privileged operator lifecycle and verification-send actions emit
  durable audit evidence
  Test Case ID: `TC-TENANT-ADMINS-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant-admin rows audit rows token rows and outbound-email
  rows if preserve-mode debugging is used
  Coverage:
  - create, update, verification send, verification resend, delete, and
    reactivate emit operator-visible durable audit records
  - audit payload includes actor rootUserId tenantId and tenantAdminId when
    known

- Scenario: denied protected-route attempts remain audit-visible through shared
  authz middleware
  Test Case ID: `TC-TENANT-ADMINS-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - denied create and verification-send attempts emit durable denial evidence
  - audit behavior remains aligned with the shared capability-gating model

- Scenario: public verification redemption outcomes are durably visible
  Test Case ID: `TC-TENANT-ADMINS-AUD-003`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant-admin rows token rows and audit rows if preserve-mode
  debugging is used
  Coverage:
  - successful redemption emits durable verification-complete evidence
  - invalid or expired redemption attempts remain durably visible with safe
    outcome classification

## Edge Cases And Negative Tests

- Scenario: verification state resets correctly when email changes after earlier
  verification
  Test Case ID: `TC-TENANT-ADMINS-EDGE-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant-admin rows and token rows if preserve-mode debugging
  is used
  Coverage:
  - verified tenant-admin changes email
  - verification state returns to pending
  - old verification evidence is no longer trusted

- Scenario: soft delete invalidates future verification eligibility safely
  Test Case ID: `TC-TENANT-ADMINS-EDGE-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant-admin rows and token rows if preserve-mode debugging
  is used
  Coverage:
  - a tenant-admin is soft-deleted after verification send
  - any later redemption attempt fails safely according to the final feature rule

- Scenario: reactivation preserves explicit verification-state truth
  Test Case ID: `TC-TENANT-ADMINS-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created tenant-admin rows if preserve-mode debugging is used
  Coverage:
  - reactivated tenant-admin returns explicit verification-state fields
  - reactivation restores verification state to pending
  - the response does not imply re-verification silently

- Scenario: duplicate-send guardrails interact safely with tenant-admin
  verification resend
  Test Case ID: `TC-TENANT-ADMINS-EDGE-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created outbound-email rows if preserve-mode debugging is used
  Coverage:
  - repeated operator resend requests within the duplicate window fail safely or
    are otherwise governed by the approved resend rule
  - feature behavior remains truthful and operator-visible

- Scenario: tenant-admin verification workflows remain isolated from later
  tenant-auth concerns
  Test Case ID: `TC-TENANT-ADMINS-EDGE-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - verification redemption does not create a tenant principal
  - verification redemption does not create a tenant session
  - verification workflows remain compatible with the future shared tenant-auth
    loop rather than pre-empting it

## Summary Of Planned Coverage

- Unit:
  `9`
- Integration:
  `5`
- Security:
  `5`
- Audit:
  `3`
- Edge:
  `5`

Total planned cases: `27`

## Initial Coverage Gaps To Revisit Later

- initial password set is intentionally deferred to the later shared
  tenant-auth loop
- forgot-password reset is intentionally deferred to the later shared
  tenant-auth loop
- tenant selection and current-tenant resolution are intentionally deferred
- richer deleted-row operator surfaces may be added later if the next slice
  requires them
