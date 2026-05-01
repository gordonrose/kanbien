# Root Users Backend Test Cases

## PRD Scope

- PRD: [`docs/prd/2026-03-29-0002-root-users-backend.md`](/home/gordon/kanbien/docs/prd/2026-03-29-0002-root-users-backend.md)
- Primary features involved: `rootUsers`
- Cross-feature seams:
  - protected `rootUsers` routes depend on shared root-session authentication
  - protected `rootUsers` routes depend on shared authenticated-general rate
    limiting
  - `rootAuth` depends on the exported `rootUsers` auth-state seam
- Notes:
  - this file is the initial PRD-derived source of truth for backend
    `rootUsers`
  - the anti-drift pilot will later version lifecycle state inside documents
    like this one
  - Traceability Enforcement: enforced
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - all `24/24` `rootUsers` backend PRD test cases are now traceable in
    executable test code
- Overall execution status:
  - dedicated direct runtime coverage now exists for:
    - `TC-ROOT-USERS-UNIT-001`
    - `TC-ROOT-USERS-UNIT-002`
    - `TC-ROOT-USERS-UNIT-003`
    - `TC-ROOT-USERS-UNIT-004`
    - `TC-ROOT-USERS-UNIT-005`
    - `TC-ROOT-USERS-UNIT-006`
    - `TC-ROOT-USERS-UNIT-007`
    - `TC-ROOT-USERS-UNIT-008`
    - `TC-ROOT-USERS-UNIT-009`
    - `TC-ROOT-USERS-UNIT-010`
    - `TC-ROOT-USERS-UNIT-011`
    - `TC-ROOT-USERS-INT-001`
    - `TC-ROOT-USERS-INT-002`
    - `TC-ROOT-USERS-INT-003`
    - `TC-ROOT-USERS-SEC-001`
    - `TC-ROOT-USERS-SEC-002`
    - `TC-ROOT-USERS-SEC-003`
    - `TC-ROOT-USERS-E2E-001`
    - `TC-ROOT-USERS-E2E-002`
    - `TC-ROOT-USERS-AUD-001`
    - `TC-ROOT-USERS-EDGE-001`
    - `TC-ROOT-USERS-EDGE-002`
    - `TC-ROOT-USERS-EDGE-003`
  - the current direct suite now also proves:
    - explicit rejection of client-supplied system-managed fields through the
      HTTP contract
    - route-level `/active` filtering and `/deleted?excludeAnonymized=true`
      behavior
    - representative exact `code` / `message` / `details` payloads for invalid
      request and duplicate-email failures
- Verification commands for the current repo baseline:
  - `npm test`
  - `npm run test:persistence`
  - `npm run test:traceability`
  - `npx vitest run tests/unit/rootUsers/contracts.test.ts tests/unit/rootUsers/service.test.ts tests/unit/rootUsers/schemas.test.ts tests/integration/rootUsers/flow.test.ts tests/security/rootUsers/security.test.ts tests/audit/rootUsers/audit.test.ts`

## Unit Tests For Individual Capabilities

- Capability: `createRootUser`
  Test Case ID: `TC-ROOT-USERS-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - creates a root user with a generated ID
  - normalizes email before uniqueness checks and storage
  - rejects duplicate normalized email for a non-deleted row
  - rejects unexpected or system-managed client fields explicitly
  Notes:
  - representative duplicate-email error payloads should remain stable

- Capability: `getRootUser`
  Test Case ID: `TC-ROOT-USERS-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - returns a visible row by exact ID
  - rejects deleted row lookup through the normal visible lookup path
  - rejects anonymized row lookup through the normal visible lookup path

- Capability: `getRootUserByEmail`
  Test Case ID: `TC-ROOT-USERS-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - normalizes email lookup
  - returns a visible row
  - rejects deleted or anonymized rows through the normal lookup path

- Capability: `listRootUsers`
  Test Case ID: `TC-ROOT-USERS-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - returns paginated visible results
  - applies filters and sorting deterministically
  - excludes deleted and anonymized rows from the normal list
  - representative duplicate-email and invalid-request route payloads remain
    stable where applicable

- Capability: `listActiveRootUsers`
  Test Case ID: `TC-ROOT-USERS-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - returns only active visible rows
  - applies active-list filters and sorting deterministically
  - route-level `/active` behavior remains aligned with the filtered active-only
    contract

- Capability: `updateRootUser`
  Test Case ID: `TC-ROOT-USERS-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - updates editable fields on a visible row
  - enforces duplicate-email rejection on normalized non-deleted email
  - refreshes `updatedAt`

- Capability: `deleteRootUser`
  Test Case ID: `TC-ROOT-USERS-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - soft deletes a visible row
  - rejects repeat delete on an already deleted row
  - rejects delete on an already anonymized row

- Capability: `listDeletedRootUsers`
  Test Case ID: `TC-ROOT-USERS-UNIT-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - returns deleted rows only
  - supports `excludeAnonymized`
  - applies deleted-list filters and sorting deterministically
  - route-level `/deleted` behavior honors `excludeAnonymized`

- Capability: `reActivateRootUser`
  Test Case ID: `TC-ROOT-USERS-UNIT-009`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - reactivates a deleted non-anonymized row
  - rejects reactivation of a visible row
  - rejects reactivation of an anonymized row
  - rejects reactivation when email uniqueness would collide

- Capability: `removeRootUser`
  Test Case ID: `TC-ROOT-USERS-UNIT-010`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - anonymizes the row irreversibly
  - generates replacement values server-side
  - makes later reactivation impossible

- Capability: `readRootUserAuthState`
  Test Case ID: `TC-ROOT-USERS-UNIT-011`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - returns active/inactive/deleted/anonymized lifecycle state safely
  - remains a narrow seam rather than exposing repository internals

## Integration Tests For Features Working Together

- Flow: authenticated root session can reach protected `rootUsers` routes
  Test Case ID: `TC-ROOT-USERS-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootUsers/`
  Features:
  - `rootAuth`
  - shared auth middleware
  - `rootUsers`
  Coverage:
  - a valid root-auth session can access `/v1/root-users`
  - response includes the authenticated root user in the visible results
  Notes:
  - currently exercised indirectly by existing `rootAuth` integration coverage

- Flow: `rootAuth` consumes the `rootUsers` auth-state seam without direct
  persistence coupling
  Test Case ID: `TC-ROOT-USERS-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootUsers/`
  Features:
  - `rootUsers`
  - `rootAuth`
  Coverage:
  - inactive, deleted, and anonymized root users are surfaced through the seam
  - sign-in eligibility behavior reflects the seam result

- Flow: root-user lifecycle mutations affect subsequent visible list behavior
  Test Case ID: `TC-ROOT-USERS-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootUsers/`
  Features:
  - `rootUsers`
  Coverage:
  - create -> soft delete -> deleted list -> reactivate -> visible list
  - remove/anonymize prevents later reactivation

## End-To-End Journey Tests

- Journey: root-admin operator proves root-users lifecycle readback and denied
  capability states
  Test Case ID: `TC-ROOT-USERS-E2E-001`
  Journey ID: `JY-ROOT-ADMIN-003`
  Recommended Test Layer: `e2e`
  Suggested Test Folder: `tests/e2e/rootAdmin/`
  Features:
  - `rootAuth`
  - shared auth middleware
  - root capability middleware
  - `rootUsers`
  Coverage:
  - allowed root operator creates a root user
  - update is persisted and exact read returns updated data
  - normal visible list includes the active user
  - soft delete hides the user from normal exact read
  - deleted list exposes the deleted user
  - reactivation restores normal state
  - remove/anonymize prevents later reactivation
  - limited root actor with read-only capability is denied update access
  Notes:
  - this case intentionally proves root-admin API journey behavior; browser
    rendering remains a separate root-admin browser journey task.

- Journey: root-admin browser renders the root-users active create/edit journey
  Test Case ID: `TC-ROOT-USERS-E2E-002`
  Journey ID: `JY-ROOT-ADMIN-005`
  Recommended Test Layer: `browser-e2e`
  Suggested Test Folder: `tests/visual/app/rootAdminShell/`
  Features:
  - `rootAuth` browser session bootstrap
  - root-admin shell
  - `rootUsers`
  Coverage:
  - direct `/root-admin/users` entry restores the browser session
  - governed root-users drawer creates a root user
  - visible list refresh includes the created root user
  - governed edit flow persists a changed first name
  - reload proof shows the edited root user remains listed
  Notes:
  - destructive lifecycle states and denied update capability are intentionally
    covered by `TC-ROOT-USERS-E2E-001` through the API journey until a governed
    browser control exists for those lifecycle transitions.

## NFR Security Tests

- Scenario: `rootUsers` routes reject missing or invalid authenticated session
  Test Case ID: `TC-ROOT-USERS-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootUsers/`
  Coverage:
  - missing bearer rejected
  - invalid bearer rejected
  - representative invalid-request responses retain stable `message` and
    `details` payloads
  Notes:
  - currently exercised indirectly by existing root-auth security coverage

- Scenario: `rootUsers` routes enforce shared authenticated-general throttling
  Test Case ID: `TC-ROOT-USERS-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootUsers/`
  Coverage:
  - route class returns safe `429` JSON when the shared policy threshold is hit
  Notes:
  - currently exercised indirectly by existing platform-security coverage

- Scenario: lifecycle operations preserve uniqueness and visibility rules
  Test Case ID: `TC-ROOT-USERS-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootUsers/`
  Coverage:
  - deleted rows do not bypass normalized-email uniqueness incorrectly
  - anonymized rows remain excluded from normal visibility
  - route-level error payloads for representative invalid requests remain
    explicit and deterministic

## NFR Logging Or Audit Tests

- Scenario: root-user lifecycle changes remain operator-visible through the
  surrounding authenticated platform behavior
  Test Case ID: `TC-ROOT-USERS-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootUsers/`
  Coverage:
  - create/update/delete/remove/reactivate flows remain observable through the
    relevant authenticated or security surface where the platform records them
  Notes:
  - this area likely needs later refinement if `rootUsers` gains its own
    dedicated durable audit model

## Edge Cases And Negative Tests

- Scenario: update with no fields is rejected
  Test Case ID: `TC-ROOT-USERS-EDGE-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - empty update body fails validation
  - unexpected or system-managed fields are rejected explicitly

- Scenario: exact route params remain required
  Test Case ID: `TC-ROOT-USERS-EDGE-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootUsers/`
  Coverage:
  - invalid or missing `rootUserId` params are rejected deterministically
  - representative invalid-request payloads retain exact `details.field` and
    `details.reason`

- Scenario: counts remain stable when totals exceed presentation threshold
  Test Case ID: `TC-ROOT-USERS-EDGE-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - list totals clamp to the documented `10000+` threshold deterministically

- Scenario: root-user profile-picture links validate asset readiness and root scope
  Test Case ID: `TC-ROOT-USERS-ASSET-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootUsers/`
  Coverage:
  - create/update calls the public `assets.validateAssetForSubject` seam before
    persisting a linked profile-picture asset
  - linked asset must be root-scoped, private, ready image content
  - response includes `profilePictureAssetId` and same-origin
    `profilePictureUrl`
  - clearing the asset clears contextual accessibility metadata
  - link and clear mutations emit explicit profile-picture security audit
    events through the protected route
