# System Root-Role CRUD Test Cases

## PRD Scope

- PRD:
  [2026-03-30-0004-system-root-role-crud.md](/home/gordon/kanbien/docs/prd/2026-03-30-0004-system-root-role-crud.md)
- Primary features involved:
  - `rootRoles`
- Cross-feature seams:
  - protected `rootRoles` routes depend on shared root-session authentication
  - protected `rootRoles` routes depend on shared authenticated-general rate
    limiting
  - `rootRoles` depends on a narrow `rootUsers` public seam for target
    root-user existence and lifecycle checks
  - `rootRoles` should enforce through a central or central-shaped authz seam
    rather than ad hoc feature checks
- Notes:
  - this file is the initial PRD-derived source of truth for backend
    `rootRoles`
  - this slice is privileged and permission-sensitive, so allow and deny
    expectations are first-class
  - Traceability Enforcement: enforced
  - Current executable traceability status: 32/32 documented root-role test
    cases traceable
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Existing Test Impact

- Existing executable tests likely affected:
  - route-mounting smoke coverage under `tests/platform/`
  - shared protected-route coverage patterns already used by `rootUsers`
  - existing protected `rootUsers` integration and security suites
  - existing protected `rootAuth` integration and security suites for routes
    that will later sit behind capability gates
  - existing audit suites for privileged protected-feature mutations and denials
  - future authz/policy seam tests once the seam becomes concrete in code
- Nature of impact:
  additive first, but expectation-changing for pre-existing protected-feature
  integration/security coverage once capability gates are actually enforced in
  code
- Discussion needed before changing existing tests:
  no immediate expectation-changing conflicts are obvious from the current repo;
  the first implementation should add new `rootRoles` coverage and then update
  protected `rootUsers` / `rootAuth` integration and security tests so they
  prove both:
  - authenticated session presence
  - required role/capability gate success or denial

## Unit Tests For Individual Capabilities

- Capability: `createSystemRootRole`
  Test Case ID: `TC-ROOT-ROLES-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - creates a role with stable normalized `roleKey`
  - rejects duplicate normalized active `roleKey`
  - rejects client-supplied system-managed fields
  - persists editable `displayName` and `description`
  Notes:
  - `RootUserAdmin` bootstrap safety metadata should not be creatable in a
    malformed way through normal input

- Capability: `getSystemRootRole`
  Test Case ID: `TC-ROOT-ROLES-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns one role by exact ID
  - includes lifecycle and assignable status
  - includes role grant summary
  Notes:
  - protected and mandatory grant metadata should be visible in the read model

- Capability: `listSystemRootRoles`
  Test Case ID: `TC-ROOT-ROLES-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns paginated role results
  - applies standard pagination defaults deterministically
  - excludes deactivated roles from the normal list by default
  - exposes assignable status in listed rows

- Capability: `updateSystemRootRole`
  Test Case ID: `TC-ROOT-ROLES-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - updates `displayName` and `description`
  - refreshes `updatedAt`
  - rejects attempts to mutate stable `roleKey`
  - rejects system-managed field overrides

- Capability: `deleteSystemRootRole`
  Test Case ID: `TC-ROOT-ROLES-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - deactivates a role instead of hard deleting it
  - marks the role non-assignable
  - preserves durable history
  - rejects deactivation that would violate protected platform safety rules

- Capability: `reactivateSystemRootRole`
  Test Case ID: `TC-ROOT-ROLES-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - reactivates a previously deactivated role
  - restores assignable status
  - rejects reactivation of an already active role
  - rejects reactivation when normalized active `roleKey` uniqueness would
    collide

- Capability: `listSystemRootRoleEligibleAuthzCapabilities`
  Test Case ID: `TC-ROOT-ROLES-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns eligible root authz capabilities for role editing
  - includes description and protected/mandatory indicators
  - supports deterministic pagination/filtering if the catalog grows

- Capability: `listSystemRootRoleCapabilityAssignments`
  Test Case ID: `TC-ROOT-ROLES-UNIT-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns currently assigned grants for one role
  - distinguishes protected and mandatory grants from editable grants
  - derives correctly against the eligible catalog

- Capability: `updateSystemRootRoleCapabilityGrants`
  Test Case ID: `TC-ROOT-ROLES-UNIT-009`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - replaces the current grant set in a bulk-first way
  - rejects unknown capability keys
  - preserves mandatory/protected grants
  - returns the updated assigned set deterministically

- Capability: `assignSystemRootRoleToRootUser`
  Test Case ID: `TC-ROOT-ROLES-UNIT-010`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - assigns an active role to a root user
  - rejects assignment of an inactive role
  - rejects duplicate active assignment of the same role to the same root user
  - makes the new grant effective immediately

- Capability: `unassignSystemRootRoleFromRootUser`
  Test Case ID: `TC-ROOT-ROLES-UNIT-011`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - deactivates one assignment while preserving durable history
  - rejects unassignment that would leave the target root user with zero roles
  - rejects unassignment that would leave the platform with zero
    `RootUserAdmin` assignments

- Capability: `listRootUserAssignedSystemRootRoles`
  Test Case ID: `TC-ROOT-ROLES-UNIT-012`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns active role assignments for the target root user
  - excludes inactive assignment rows by default
  - includes role metadata, including when an assigned role definition is now
    inactive

- Capability: `replaceRootUserSystemRootRole`
  Test Case ID: `TC-ROOT-ROLES-UNIT-013`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - atomically retires one assignment and creates the replacement assignment
  - rejects replacement to an inactive target role
  - rejects replacement that would violate last-role or last-admin safety
    constraints
  Notes:
  - this capability is important because the PRD intentionally avoids fragile
    multi-step role-migration flows

- Capability: `getEffectiveRootUserPermissions`
  Test Case ID: `TC-ROOT-ROLES-UNIT-014`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns assigned roles plus flattened effective grants
  - unions positive grants across active assignments
  - shows source-role attribution for each effective capability
  - continues to explain grants even when a source role has been retired from
    future assignment

## Integration Tests For Features Working Together

- Flow: authenticated root session can reach protected `rootRoles` routes
  Test Case ID: `TC-ROOT-ROLES-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootRoles/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  register created durable rows through the shared durable-test helper path if
  preserve-mode debugging is used
  Features:
  - `rootAuth`
  - shared auth middleware
  - `rootRoles`
  Coverage:
  - a valid root-auth session can access protected `rootRoles` endpoints
  - route protection remains aligned with the root operator trust boundary

- Flow: `rootRoles` uses the `rootUsers` seam rather than private persistence
  Test Case ID: `TC-ROOT-ROLES-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootRoles/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  durable test rows should be run-scoped and registered if shared test helpers
  are used
  Features:
  - `rootRoles`
  - `rootUsers`
  Coverage:
  - role assignment to an eligible root user succeeds
  - assignment to a missing or ineligible root user is rejected
  - the integration path does not depend on `rootUsers/persistence/*`

- Flow: role lifecycle affects later assignment and effective-permission
  behavior
  Test Case ID: `TC-ROOT-ROLES-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootRoles/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  durable rows should be created with shared helpers and cleaned through the
  existing test-data lifecycle
  Features:
  - `rootRoles`
  - `rootUsers`
  Coverage:
  - create role -> assign role -> deactivate role -> verify no new assignment
    but existing effective access remains inspectable
  Notes:
  - this is the key integration proof for the “retire from future assignment”
    lifecycle model

- Flow: atomic replacement migrates a user from one role to another safely
  Test Case ID: `TC-ROOT-ROLES-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootRoles/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  durable assignment rows should be run-scoped and cleaned through the shared
  lifecycle
  Features:
  - `rootRoles`
  - `rootUsers`
  Coverage:
  - replacement updates the target user’s effective access in one transaction
  - the user is never left without a role during the operation

- Flow: pre-existing protected feature routes remain reachable when the caller
  holds the required root authz capability
  Test Case ID: `TC-ROOT-ROLES-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootUsers/` and
  `tests/integration/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  any durable root-role or assignment fixtures used to establish gated access
  should be run-scoped and cleaned through the shared lifecycle
  Features:
  - `rootRoles`
  - `rootUsers`
  - `rootAuth`
  Coverage:
  - representative pre-existing protected `rootUsers` and protected `rootAuth`
    routes still succeed when the authenticated root user holds the required
    governing authz capability
  Notes:
  - this case exists to prevent coverage weakening when old tests only proved
    session presence before gates were introduced

## NFR Security Tests

- Scenario: `rootRoles` routes reject missing or invalid authenticated session
  Test Case ID: `TC-ROOT-ROLES-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - missing session rejected
  - invalid session rejected
  - representative privileged error payloads remain stable

- Scenario: `rootRoles` routes enforce current `RootUserAdmin` allow/deny
  expectations
  Test Case ID: `TC-ROOT-ROLES-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootRoles/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  if test data creates extra roles or assignments, register them for durable
  cleanup
  Coverage:
  - protected root-role actions are allowed for `RootUserAdmin`
  - representative denied cases are rejected when the governing capability is
    absent once narrower root roles are introduced
  Notes:
  - for the first implementation, the deny path may be partially scaffolded if
    only `RootUserAdmin` exists in code; keep the case documented because the
    PRD class requires allow/deny coverage

- Scenario: protected roles and grants cannot be hollowed out unsafely
  Test Case ID: `TC-ROOT-ROLES-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootRoles/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  use run-scoped durable records when mutating grant state
  Coverage:
  - required `RootUserAdmin` grants cannot be stripped
  - protected role deactivation rejects protected platform safety violations
  - inactive roles cannot be assigned

- Scenario: shared authenticated-general throttling protects root-role routes
  Test Case ID: `TC-ROOT-ROLES-SEC-004`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - representative protected route returns safe `429` JSON when the shared
    authenticated-general policy threshold is exceeded

- Scenario: pre-existing protected feature routes deny access when the caller
  lacks the required capability gate
  Test Case ID: `TC-ROOT-ROLES-SEC-005`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootUsers/` and
  `tests/security/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  any durable role/assignment fixtures used to create denied-path actors should
  be run-scoped and cleaned through the shared lifecycle
  Coverage:
  - representative protected `rootUsers` routes deny an authenticated caller
    who lacks the governing authz capability
  - representative protected `rootAuth` routes deny an authenticated caller who
    lacks the governing authz capability
  Notes:
  - this case should be implemented when narrower non-admin root roles become
    executable in code; until then it remains a required documented future
    deny-proof

## NFR Logging Or Audit Tests

- Scenario: root-role and assignment mutations emit durable audit evidence
  Test Case ID: `TC-ROOT-ROLES-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootRoles/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  audit-visible durable data should use run-scoped helpers where applicable
  Coverage:
  - create/update/deactivate/reactivate role actions are auditable
  - grant updates capture before/after values
  - assignment, unassignment, and replacement capture actor, target, and
    reason/comment where supplied

- Scenario: denied privileged actions remain operator-visible where the audit
  model requires it
  Test Case ID: `TC-ROOT-ROLES-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootRoles/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  align with the durable audit strategy chosen during implementation
  Coverage:
  - representative denied assignment/grant-management attempts leave the
    expected audit visibility
  Notes:
  - implementation may initially prove this through the surrounding platform
    audit surface if a dedicated root-role audit store is not yet isolated

- Scenario: gated denials and privileged mutations on pre-existing protected
  features remain audit-visible after authz gates are added
  Test Case ID: `TC-ROOT-ROLES-AUD-003`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootUsers/` and `tests/audit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  align with the durable audit strategy chosen during implementation
  Coverage:
  - representative newly gated denials on pre-existing protected features leave
    the expected audit visibility
  - representative privileged mutations on pre-existing protected features
    remain operator-visible after gate enforcement is added

## Edge Cases And Negative Tests

- Scenario: create rejects malformed or empty editable fields
  Test Case ID: `TC-ROOT-ROLES-EDGE-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - empty `roleKey`, `displayName`, or `description` rejected where required
  - unexpected fields rejected explicitly

- Scenario: repeated deactivate/reactivate operations are handled safely
  Test Case ID: `TC-ROOT-ROLES-EDGE-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - repeated deactivate is rejected or handled deterministically
  - repeated reactivate is rejected or handled deterministically

- Scenario: assignment list and effective-permission inspection remain coherent
  after lifecycle changes
  Test Case ID: `TC-ROOT-ROLES-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootRoles/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  run-scoped durable records should be cleaned through the shared lifecycle
  Coverage:
  - deactivated role definition remains explainable in effective-permission
    output where appropriate
  - inactive assignment rows remain hidden from the default assignment list

- Scenario: replacement rejects invalid source/target combinations
  Test Case ID: `TC-ROOT-ROLES-EDGE-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootRoles/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - missing source assignment rejected
  - missing target role rejected
  - replacement to same effective assignment shape handled deterministically

## End-To-End Root Admin Journeys

- Journey: root-role assignment operations update effective permissions while
  preserving safety guardrails
  Test Case ID: `TC-ROOT-ROLES-E2E-001`
  Journey ID: `JY-ROOT-ADMIN-008`
  Recommended Test Layer: `e2e`
  Suggested Test Folder: `tests/e2e/rootAdmin/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation:
  uses the mounted root-auth, root-users, and root-roles integration harness
  with deterministic in-memory durable seams; persistence-backed role and
  assignment behavior remains covered by `TC-ROOT-ROLES-INT-*`,
  `TC-ROOT-ROLES-SEC-*`, `TC-ROOT-ROLES-AUD-*`, and
  `TC-ROOT-ROLES-EDGE-*`
  Features:
  - `rootAuth`
  - `rootUsers`
  - `rootRoles`
  Coverage:
  - allowed root operator creates source and target roles
  - allowed root operator updates capability grants for both roles
  - allowed root operator assigns the source role to an active target root user
  - replacement atomically moves the target root user to the target role
  - effective-permission readback shows the replacement grants
  - assignment list readback excludes the replaced source assignment
  - inactive roles cannot be newly assigned
  - deleted target root users cannot receive role assignments
  - replacing the last `RootUserAdmin` assignment is denied
  - a limited role reader is denied capability-grant mutation

## Coverage Gaps Or Open Questions

- Item:
  the initial implementation will need to decide whether denied privileged
  audit cases are proven through a root-role-local audit store or through a
  surrounding platform audit surface first
- Item:
  once narrower root roles exist in code, the documented allow/deny security
  cases should move from partial scaffold to fully executable coverage
