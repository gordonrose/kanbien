# Tenant Auth Foundation Test Cases

## PRD Scope

- PRD:
  [2026-04-09-0009-tenant-auth-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-09-0009-tenant-auth-foundation.md)
- Primary features involved:
  - `tenantAuth`
- Cross-feature seams:
  - public onboarding/bootstrap flows depend on verified source-actor evidence
    from `tenantAdmins`
  - tenant-side authentication must remain separate from tenant-scoped actor
    lifecycle per ADR-0009
  - authenticated tenant-session behavior must remain compatible with the
    single-current-tenant authorization direction in ADR-0016
  - password policy and hashing rules should align with platform auth
    standards without copying root-only SSH mechanics from `rootAuth`
  - shared platform auth middleware, public-sensitive throttling, and
    authenticated session middleware will extend to this route family
- Notes:
  - this file is the initial PRD-derived source of truth for backend
    `tenantAuth`
  - this slice is identity-bearing, credential-bearing, session-bearing, and
    multi-tenant-context-sensitive
  - this slice must prove that tenant-side authentication is reusable beyond
    `tenantAdmins`
  - Traceability Enforcement: enforced
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Existing Test Impact

- Existing executable tests likely affected:
  - shared public-auth and protected-session coverage patterns already used by
    `rootAuth`
  - shared middleware and protected-route smoke coverage once
    `tenantAuth` routes are mounted
  - `tenantAdmins` integration coverage once verified tenant-admin bootstrap
    is wired into shared principal onboarding
  - future authorization-context coverage that assumes authenticated tenant
    requests resolve to exactly one active tenant context
- Nature of impact:
  additive first, but not purely additive forever
  because this PRD adds:
  - a new public tenant-auth route family
  - durable non-root principals, credentials, grants, and sessions
  - frontend-ready tenant-selection states
  - cross-feature bootstrap dependency on verified tenant-admin evidence
- Discussion needed before changing existing tests:
  no immediate blocker is obvious because `tenantAuth` does not yet exist in
  code, but the eventual implementation will likely require updates to:
  - shared protected-route smoke coverage
  - shared public-route security coverage
  - tenant-session and current-tenant context assumptions in later features

## Unit Tests For Individual Capabilities

- Capability: `createSharedTenantAuthPrincipalFromVerifiedTenantAdmin`
  Test Case ID: `TC-TENANT-AUTH-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: yes; verified-tenant-admin fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - creates one shared principal from one verified active `tenantAdmin`
  - normalizes and stores globally unique login email
  - creates one durable `tenantAccessGrant`
  - rejects bootstrap from unverified, deleted, or missing tenant-admin source
  - rejects bootstrap when one active principal already exists for the source
  - rejects login-email uniqueness collisions across different tenants
  Notes:
  - this case should prove that `tenantAuth` consumes source-actor evidence
    without turning the source actor into the login identity itself

- Capability: `setInitialTenantPassword`
  Test Case ID: `TC-TENANT-AUTH-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: yes; bootstrap-proof fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - accepts valid single-use onboarding/bootstrap proof
  - writes durable password credential state for the principal
  - enforces password policy server-side
  - rejects expired, missing, invalid, or reused onboarding proof
  - rejects repeated setup when a password is already present
  - does not create a tenant session as a side effect

- Capability: `restartTenantAdminOnboarding`
  Test Case ID: `TC-TENANT-AUTH-UNIT-009`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAdmins/`
  Requires Shared Test Helper: yes; verified-tenant-admin fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - allows a root-triggered recovery path for a visible verified tenant-admin
  - reuses the shared tenant-auth provisioning seam rather than re-verifying
    the email
  - returns a fresh password-setup bootstrap token when password setup is still
    required
  - returns `LOGIN_REQUIRED` when the principal already has an active password
  - rejects restart for pending, deleted, or missing tenant-admin rows

- Capability: `loginTenantPrincipalWithPassword`
  Test Case ID: `TC-TENANT-AUTH-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: yes; principal-and-grant fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - normalizes login email
  - verifies stored password hash
  - rejects invalid credentials with stable safe auth failure semantics
  - returns `ONBOARDING_REQUIRED` when principal exists but password setup is
    incomplete
  - creates one server-backed session on successful login
  - auto-selects tenant when exactly one tenant context is available
  - returns selection-required state when multiple tenant contexts are
    available
  - rejects login when no active tenant access grant exists

- Capability: `readCurrentTenantSession`
  Test Case ID: `TC-TENANT-AUTH-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: yes; authenticated-session fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns principal summary
  - returns available tenant contexts
  - returns active tenant context when selected
  - returns `selectionRequired` truthfully
  - rejects invalid, expired, or revoked sessions

- Capability: `listAvailableTenantContexts`
  Test Case ID: `TC-TENANT-AUTH-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: yes; grant-list fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - lists only contexts reachable by the authenticated principal
  - orders the contexts deterministically
  - includes tenant display summary plus subject summary fields needed for
    future chooser UX
  - remains compatible with future non-admin tenant subject types by returning
    `subjectType` and `subjectId` explicitly

- Capability: `selectActiveTenantContext`
  Test Case ID: `TC-TENANT-AUTH-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: yes; multi-tenant-session fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - validates session before selection
  - validates that the requested tenant is reachable by the authenticated
    principal
  - updates active tenant selection on the session
  - behaves idempotently when the requested tenant is already active
  - rejects inaccessible tenant selections truthfully

- Capability: `logoutTenantSession`
  Test Case ID: `TC-TENANT-AUTH-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: yes; authenticated-session fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - revokes the current session durably
  - clears active tenant context by ending the session
  - rejects invalid or already revoked sessions truthfully
  - does not mutate principal ownership or tenant-admin profile state

## Integration Tests For Features Working Together

- Flow: verified tenant-admin bootstrap creates a reusable shared principal and
  initial tenant access grant
  Test Case ID: `TC-TENANT-AUTH-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created principals, credentials, grants, and sessions if preserve-
  mode debugging is used
  Features:
  - `tenantAdmins`
  - `tenantAuth`
  Coverage:
  - only a verified active tenant-admin can bootstrap into tenant auth
  - bootstrap creates principal plus grant coherently across router, service,
    and persistence
  - source actor remains a tenant-admin record rather than becoming the auth
    record itself

- Flow: initial password setup and explicit login round-trip through the full
  tenant-auth stack
  Test Case ID: `TC-TENANT-AUTH-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created principals, credentials, grants, and sessions if preserve-
  mode debugging is used
  Features:
  - `tenantAuth`
  Coverage:
  - password setup succeeds with valid bootstrap proof
  - password setup does not create a session
  - subsequent login creates the tenant session
  - route contracts return frontend-ready state payloads

- Flow: single-tenant login auto-selects active tenant context
  Test Case ID: `TC-TENANT-AUTH-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created durable principal, grant, and session rows when preserve-
  mode debugging is used
  Features:
  - `tenantAuth`
  - `tenantAdmins`
  - `tenants`
  Coverage:
  - login returns `AUTHENTICATED_SINGLE_TENANT`
  - active tenant is present immediately
  - session read returns that tenant as active
  - available-tenant list remains truthful

- Flow: multi-tenant login requires explicit tenant selection
  Test Case ID: `TC-TENANT-AUTH-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created durable principal, grant, and session rows when preserve-
  mode debugging is used
  Features:
  - `tenantAuth`
  - `tenantAdmins`
  - `tenants`
  Coverage:
  - login returns `AUTHENTICATED_SELECTION_REQUIRED`
  - no active tenant is present immediately after login
  - tenant-context list route matches the login/session payload
  - tenant selection route persists the chosen active tenant

- Flow: logout revokes the current tenant session across the full stack
  Test Case ID: `TC-TENANT-AUTH-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created session rows when preserve-mode debugging is used
  Features:
  - `tenantAuth`
  Coverage:
  - authenticated logout succeeds
  - subsequent session read fails truthfully
  - revoked session cannot be used to select tenant context

- Flow: root operator restarts onboarding for a previously verified tenant
  admin who still needs password setup
  Test Case ID: `TC-TENANT-AUTH-INT-006`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAdmins/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created principals, grants, and setup proofs if preserve-mode
  debugging is used
  Features:
  - `tenantAdmins`
  - `tenantAuth`
  Coverage:
  - verified tenant-admin onboarding can be restarted by a protected root
    operator route
  - restart returns tenant-auth onboarding payload without requiring a new
    verification token
  - returned next step is truthful for the principal password state

## NFR Security Tests

- Scenario: login, bootstrap, and password-setup routes enforce safe public
  auth behavior
  Test Case ID: `TC-TENANT-AUTH-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a if requests are rejected before durable writes
  Coverage:
  - invalid credentials return stable safe failure responses
  - invalid bootstrap or onboarding proof is denied
  - login and password-setup flows do not leak password hashes or internal
    credential state
  - public-sensitive throttling posture applies to login and onboarding routes

- Scenario: authenticated session and tenant-selection routes enforce session
  ownership and tenant-access boundaries
  Test Case ID: `TC-TENANT-AUTH-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a if requests are rejected before durable mutation
  Coverage:
  - unauthenticated session read is denied
  - unauthenticated tenant-context listing is denied
  - unauthenticated tenant selection is denied
  - authenticated principal cannot select an inaccessible tenant
  - revoked or expired sessions are denied consistently across the route family

- Scenario: tenant-side auth remains separate from root-only auth mechanics and
  privileged exceptions
  Test Case ID: `TC-TENANT-AUTH-SEC-003`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - tenant login does not require or accept root-only SSH challenge flows
  - tenant auth does not inherit root-only cross-user credential-management
    exceptions by default
  - tenant principal/session contracts stay distinct from root-auth contracts

## NFR Logging Or Audit Tests

- Scenario: principal bootstrap, password setup, login, tenant selection, and
  logout remain durably auditable
  Test Case ID: `TC-TENANT-AUTH-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register durable principals, grants, and sessions if preserve-mode debugging
  is used
  Coverage:
  - successful principal bootstrap is auditable
  - successful password setup is auditable
  - successful login is auditable
  - successful tenant selection is auditable
  - successful logout is auditable

- Scenario: denied bootstrap, login, and tenant-selection attempts remain
  audit-visible where current standards require
  Test Case ID: `TC-TENANT-AUTH-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a if requests are rejected before durable creation
  Coverage:
  - denied bootstrap is auditable with source actor and outcome reason when
    safely known
  - denied login is auditable without leaking sensitive credential details
  - denied tenant selection is auditable with requested tenant and outcome
    reason

## Edge Cases And Negative Tests

- Scenario: one principal can access multiple tenants without duplicating
  principal identity
  Test Case ID: `TC-TENANT-AUTH-EDGE-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register durable principals, grants, and sessions when preserve-mode
  debugging is used
  Coverage:
  - one shared principal can hold more than one tenant access grant
  - principal uniqueness is still global by normalized login email
  - the same principal can move between tenant contexts through selection
    rather than duplicate identities

- Scenario: session read and tenant-context list stay frontend-ready without
  coupling to tenant-admin-only fields
  Test Case ID: `TC-TENANT-AUTH-EDGE-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tenantAuth/`
  Requires Shared Test Helper: yes; generic-subject fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - responses expose generic `subjectType` and `subjectId`
  - responses do not require tenant-admin-only field names to remain truthful
  - the contract remains reusable for future tenant-user actors

- Scenario: source-actor lifecycle changes do not silently create invalid auth
  state
  Test Case ID: `TC-TENANT-AUTH-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tenantAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register durable principals, grants, and sessions when preserve-mode
  debugging is used
  Coverage:
  - deleted or reactivated source tenant-admin behavior remains truthful for
    sign-in eligibility
  - revoked or inactive tenant access grants stop future tenant selection
    cleanly
  - session state does not silently retain inaccessible tenant context once
    the underlying access grant is no longer valid
