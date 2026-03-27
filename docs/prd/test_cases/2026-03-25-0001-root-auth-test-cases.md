# Root Auth Phase 1 Test Cases

## PRD Scope

- PRD: [`docs/prd/2026-03-25-0001-root-auth.md`](/home/gordon/kanbien/docs/prd/2026-03-25-0001-root-auth.md)
- Primary features involved: `rootAuth`, `rootUsers`
- Cross-feature seams:
  - `rootAuth` reads root-user sign-in eligibility from `rootUsers`
  - shared bearer-session middleware protects protected routes
  - shared platform auth abuse controls affect public login endpoints
- Notes:
  - this file covers test cases, not executable test implementation
  - logging expectations are expressed as durable audit event coverage where the
    repo uses auth audit events instead of generic logs
  - cleanup expectations in this file refer to preserved durable-test workflows;
    the routine `npm run test:persistence` suite now remains reset-first unless
    `npm run test:persistence:preserve` is used intentionally

## Current Status

- Overall traceability status:
  - all `40/40` root-auth PRD test cases are traceable in executable test code
- Overall execution status:
  - `UNIT`, `INT`, and the runtime-facing parts of `SEC`, `AUD`, and `EDGE`
    are exercised by `npm test`
  - the storage-sensitive and migration-sensitive persistence-backed proofs are
    exercised by `npm run test:persistence`
- Layer summary:
  - `UNIT`: traceable and runtime-tested
  - `INT`: traceable and runtime-tested
  - `SEC`: traceable, runtime-tested, and persistence-tested where required
  - `AUD`: traceable, runtime-tested, and persistence-tested where required
  - `EDGE`: traceable, runtime-tested, and persistence-tested where required
- Persistence-backed root-auth cases:
  - `TC-ROOT-AUTH-SEC-007`
  - `TC-ROOT-AUTH-AUD-008`
  - `TC-ROOT-AUTH-EDGE-008`
- Verification commands:
  - `npm run test:traceability`
  - `npm test`
  - `npm run test:persistence`
  - `npm run test:persistence:preserve`

## Unit Tests For Individual Capabilities

- Capability: `createRootUserAuthPrincipal`
  Test Case ID: `TC-ROOT-AUTH-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes if the test persists durable records
  Cleanup Expectation: created principals, links, and audit events should be attributable to a `testRunId` and removable through the separate cleanup flow
  Coverage:
  - creates auth principal, root-user link, and audit event on success
  - normalizes login email before uniqueness checks and storage
  - rejects duplicate normalized login email
  - rejects missing linked root user
  - rejects password that fails policy
  Notes:
  - verify no partial principal or link persists on rejected create

- Capability: `loginRootUserWithPassword`
  Test Case ID: `TC-ROOT-AUTH-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes when durable principals, links, or root users are created for the test
  Requires Manifest Tracking: yes when durable setup data is created
  Cleanup Expectation: test-created principals, challenges, and audit events should be left available for troubleshooting until cleanup is run separately
  Coverage:
  - success returns `SSH_CHALLENGE_REQUIRED`
  - success creates challenge only and does not create session
  - unknown email returns generic invalid credentials
  - wrong password returns generic invalid credentials
  - inactive linked root user is blocked
  - soft-deleted linked root user is blocked
  - anonymized linked root user is blocked
  - success writes success audit event
  - failure writes failure audit event
  - repeated failures trigger throttled or lockdown path
  Notes:
  - verify external response stays generic where required

- Capability: `completeRootUserSshChallenge`
  Test Case ID: `TC-ROOT-AUTH-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: test-created challenges, sessions, keys, and audit events should be tracked for later cleanup
  Coverage:
  - valid signature against active key marks challenge used and creates session
  - missing challenge rejected
  - expired challenge rejected
  - already-used challenge rejected
  - wrong fingerprint rejected
  - wrong signature rejected
  - revoked key rejected
  - success writes success audit event
  - failure writes failure audit event
  Notes:
  - verify session is created only after successful SSH proof

- Capability: `changeRootUserPassword`
  Test Case ID: `TC-ROOT-AUTH-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes when using durable principals and sessions
  Requires Manifest Tracking: yes
  Cleanup Expectation: changed principals, surviving sessions, revoked sessions, and audit events must remain inspectable until cleanup is invoked
  Coverage:
  - valid current password changes password hash
  - invalid current password rejected
  - weak new password rejected
  - other sessions are revoked after successful change
  - success writes audit event
  - rejected change writes failure audit event
  Notes:
  - verify current session remains valid if that is the intended behavior

- Capability: `addRootUserSshPublicKey`
  Test Case ID: `TC-ROOT-AUTH-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: added keys and related audit events should be cleanup-managed separately from test execution
  Coverage:
  - valid `ssh-ed25519` key stored successfully
  - malformed public key rejected
  - unsupported algorithm rejected
  - duplicate active key rejected by fingerprint
  - success writes audit event
  Notes:
  - verify only public key material is stored

- Capability: `revokeRootUserSshPublicKey`
  Test Case ID: `TC-ROOT-AUTH-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: revoked key state and audit history should remain available for debugging until cleanup runs
  Coverage:
  - active key revoked successfully
  - missing key rejected
  - revoked key no longer appears as active for auth
  - success writes audit event
  Notes:
  - clarify expected behavior for repeated revoke attempts if needed

- Capability: `logoutRootUserSession`
  Test Case ID: `TC-ROOT-AUTH-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes when durable sessions are created
  Requires Manifest Tracking: yes
  Cleanup Expectation: revoked session rows and audit events should be tracked and cleaned up separately
  Coverage:
  - active current session revoked successfully
  - missing or already-revoked session behavior is handled deterministically
  - success writes audit event
  Notes:
  - verify revoked session cannot authenticate afterwards

- Capability: `revokeRootUserSession`
  Test Case ID: `TC-ROOT-AUTH-UNIT-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes when durable sessions are created
  Requires Manifest Tracking: yes
  Cleanup Expectation: session lifecycle records should remain inspectable until manual cleanup by `testRunId`
  Coverage:
  - own session can be revoked successfully
  - missing session rejected
  - non-owned session rejected if ownership is required
  - success writes audit event
  Notes:
  - phase-1 semantics currently align with owned-session management

- Capability: `listRootUserSshPublicKeys`
  Test Case ID: `TC-ROOT-AUTH-UNIT-009`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes if durable keys are created
  Cleanup Expectation: list fixtures should be created through helpers so all durable key rows are cleanup-addressable
  Coverage:
  - returns active keys
  - returns revoked keys with safe summary fields only
  - does not expose private material
  Notes:
  - empty list path should be covered

- Capability: `listRootUserSessions`
  Test Case ID: `TC-ROOT-AUTH-UNIT-010`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes if durable sessions are created
  Cleanup Expectation: list fixtures should be created through helpers so all durable session rows are cleanup-addressable
  Coverage:
  - returns owned sessions with minimal safe metadata
  - empty list path should be covered
  Notes:
  - verify no unsafe internal fields are surfaced

## Integration Tests For Features Working Together

- Flow: full root login unlocks protected root-user routes
  Test Case ID: `TC-ROOT-AUTH-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: root users, principals, keys, challenges, sessions, and audit events created for the flow must be tied to one `testRunId` and removed only by the separate cleanup command
  Features: `rootAuth` + `rootUsers`
  Coverage:
  - complete password stage, SSH stage, receive bearer session
  - use resulting session to access protected `rootUsers` route successfully
  Notes:
  - proves auth/session seam integration

- Flow: root-user lifecycle state blocks login
  Test Case ID: `TC-ROOT-AUTH-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: lifecycle-state fixtures and resulting challenges or audit events must remain available until post-run cleanup
  Features: `rootUsers` + `rootAuth`
  Coverage:
  - inactive `rootUser` cannot complete password stage
  - soft-deleted `rootUser` cannot complete password stage
  - anonymized `rootUser` cannot complete password stage
  Notes:
  - verify lifecycle state is enforced before challenge issuance

- Flow: revoked session loses access across features
  Test Case ID: `TC-ROOT-AUTH-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: session records and access-denial evidence should be cleanup-managed separately after debugging
  Features: `rootAuth` + shared auth middleware + `rootUsers`
  Coverage:
  - revoke or logout current session
  - confirm protected `rootAuth` routes reject it
  - confirm protected `rootUsers` routes reject it
  Notes:
  - proves middleware uses durable session state

- Flow: password change revokes other sessions
  Test Case ID: `TC-ROOT-AUTH-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: multi-session fixtures, revocation effects, and audit events must remain inspectable before cleanup
  Features: `rootAuth` + shared auth middleware
  Coverage:
  - establish multiple sessions for one principal
  - change password from one active session
  - confirm other sessions are rejected afterwards
  Notes:
  - confirm intended handling of current session

- Flow: revoked SSH key no longer works for login
  Test Case ID: `TC-ROOT-AUTH-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: created keys, revocation state, challenges, and audit events should be tracked for later run-scoped cleanup
  Features: `rootAuth`
  Coverage:
  - add SSH key
  - revoke SSH key
  - attempt SSH completion using revoked key and confirm failure
  Notes:
  - proves key lifecycle affects authentication

- Flow: bootstrap auth artifacts support existing root users
  Test Case ID: `TC-ROOT-AUTH-INT-006`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAuth/`
  Requires Shared Test Helper: yes for non-migration durable setup
  Requires Manifest Tracking: yes
  Cleanup Expectation: bootstrap-created durable records should be attributable to the run and removable without fuzzy matching
  Features: `rootUsers` + `rootAuth`
  Coverage:
  - existing `rootUsers` receive bootstrap auth principal, link, password hash,
    and bootstrap public key
  - bootstrapped root user can authenticate end to end
  Notes:
  - should include rerun safety or idempotent bootstrap behavior

- Flow: shared public-auth hardening affects login endpoints
  Test Case ID: `TC-ROOT-AUTH-INT-007`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAuth/`
  Requires Shared Test Helper: yes when durable identities are needed for the flow
  Requires Manifest Tracking: yes
  Cleanup Expectation: abuse-path records and audit-visible events should remain available until explicit cleanup
  Features: `rootAuth` + shared platform security
  Coverage:
  - repeated failed login attempts trigger throttling
  - repeated abuse can trigger temporary lockdown
  Notes:
  - verify audit visibility for these events

## NFR Security Tests

- Scenario: generic auth failure handling
  Test Case ID: `TC-ROOT-AUTH-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAuth/`
  Requires Shared Test Helper: yes when durable setup identities are needed
  Requires Manifest Tracking: yes
  Cleanup Expectation: failed-attempt fixtures and audit evidence must be attributable to the run
  Coverage:
  - unknown email and wrong password do not expose account existence through a
    more specific external response
  Notes:
  - internal audit detail may still differ

- Scenario: no session before full multi-step authentication
  Test Case ID: `TC-ROOT-AUTH-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: created principals and challenges should remain available for troubleshooting before cleanup
  Coverage:
  - successful password stage alone never creates authenticated session state
  Notes:
  - critical trust-boundary rule

- Scenario: challenge security
  Test Case ID: `TC-ROOT-AUTH-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: challenge rows and failure evidence should be tracked by manifest for later deletion
  Coverage:
  - challenge is single-use
  - challenge expires
  - challenge is bound to principal and purpose
  Notes:
  - verify replay rejection

- Scenario: SSH key security
  Test Case ID: `TC-ROOT-AUTH-SEC-004`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: test-created key rows and audit events should be separately cleanup-managed
  Coverage:
  - only supported algorithms accepted
  - revoked keys fail authentication
  - private key material is never stored or returned
  Notes:
  - use malformed and unsupported key samples

- Scenario: protected-route enforcement
  Test Case ID: `TC-ROOT-AUTH-SEC-005`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAuth/`
  Requires Shared Test Helper: yes when durable sessions or principals are needed
  Requires Manifest Tracking: yes
  Cleanup Expectation: invalid or revoked session fixtures should be attributable to the run for later cleanup
  Coverage:
  - protected `rootAuth` routes reject missing bearer token
  - protected `rootUsers` routes reject missing bearer token
  - invalid or revoked session is rejected
  Notes:
  - exercise shared auth middleware, not just feature handlers

- Scenario: lifecycle-based sign-in blocking
  Test Case ID: `TC-ROOT-AUTH-SEC-006`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: blocked-state root users and resulting auth artifacts should be cleanup-managed after inspection
  Coverage:
  - inactive, deleted, and anonymized root users remain blocked even with valid
    principal credentials and matching SSH proof
  Notes:
  - ensure checks are not bypassed on stage two

- Scenario: sensitive secret handling
  Test Case ID: `TC-ROOT-AUTH-SEC-007`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAuth/`
  Requires Shared Test Helper: yes if durable setup uses generated secrets or bootstrap-like fixtures
  Requires Manifest Tracking: yes when durable records are created
  Cleanup Expectation: cleanup must remain separate so secret-handling failures can be investigated before data removal
  Coverage:
  - plaintext password is never persisted
  - bootstrap password is not logged
  Notes:
  - security-sensitive implementation verification

## NFR Logging Or Audit Tests

- Scenario: auth principal creation is audit-visible
  Test Case ID: `TC-ROOT-AUTH-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: audit rows must remain queryable until cleanup is run manually
  Coverage:
  - successful principal creation writes structured audit event
  Notes:
  - include actor and affected root-user linkage where applicable

- Scenario: password-stage login attempts are audit-visible
  Test Case ID: `TC-ROOT-AUTH-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: success and failure audit rows should be tied to the same `testRunId`
  Coverage:
  - success writes audit event
  - failure writes audit event
  Notes:
  - exact external response should remain generic where appropriate

- Scenario: SSH-stage login attempts are audit-visible
  Test Case ID: `TC-ROOT-AUTH-AUD-003`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: challenge, session, and audit artifacts should remain available until explicit cleanup
  Coverage:
  - success writes audit event
  - failure writes audit event
  Notes:
  - include revoked key or invalid signature path

- Scenario: password lifecycle changes are audit-visible
  Test Case ID: `TC-ROOT-AUTH-AUD-004`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: changed principals, session revocations, and audit events should be manifest-tracked
  Coverage:
  - successful password change writes audit event
  - invalid current password writes failure audit event
  Notes:
  - verify affected principal and root user are present when applicable

- Scenario: SSH key lifecycle changes are audit-visible
  Test Case ID: `TC-ROOT-AUTH-AUD-005`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: key rows and audit events should be cleaned up separately from execution
  Coverage:
  - adding key writes audit event
  - revoking key writes audit event
  Notes:
  - verify event type and outcome are structured correctly

- Scenario: session lifecycle changes are audit-visible
  Test Case ID: `TC-ROOT-AUTH-AUD-006`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: session lifecycle rows and audit rows must remain available for post-failure inspection
  Coverage:
  - logout writes audit event
  - explicit session revoke writes audit event
  Notes:
  - verify durable record creation

- Scenario: abuse controls are audit-visible
  Test Case ID: `TC-ROOT-AUTH-AUD-007`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootAuth/`
  Requires Shared Test Helper: yes when durable identities are needed
  Requires Manifest Tracking: yes
  Cleanup Expectation: throttle and lockdown evidence should survive until the separate cleanup command is invoked
  Coverage:
  - throttling writes visible security event
  - temporary lockdown writes visible security event
  Notes:
  - aligns with shared platform hardening expectations

- Scenario: bootstrap application is audit-visible
  Test Case ID: `TC-ROOT-AUTH-AUD-008`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/rootAuth/`
  Requires Shared Test Helper: yes where bootstrap fixtures are created outside migrations
  Requires Manifest Tracking: yes
  Cleanup Expectation: bootstrap-created audit artifacts should be attributable to the run and removable through cleanup
  Coverage:
  - bootstrap migration creates durable bootstrap audit event
  Notes:
  - include idempotent rerun behavior

## Edge Cases And Negative Tests

- Scenario: duplicate login email differs only by case or whitespace
  Test Case ID: `TC-ROOT-AUTH-EDGE-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes if durable principals are created
  Requires Manifest Tracking: yes when durable records are created
  Cleanup Expectation: duplicate-email fixtures should still be tied to the run for later cleanup
  Coverage:
  - normalize and reject duplicate active auth principal email
  Notes:
  - ensures normalized uniqueness contract

- Scenario: challenge replay
  Test Case ID: `TC-ROOT-AUTH-EDGE-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: challenge, session, and audit artifacts should remain available until manual cleanup
  Coverage:
  - complete SSH challenge once successfully
  - second use of same challenge is rejected
  Notes:
  - verify no second session is created

- Scenario: challenge expiry boundary
  Test Case ID: `TC-ROOT-AUTH-EDGE-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: expiry-boundary artifacts should be manifest-tracked for later deletion
  Coverage:
  - challenge just before expiry succeeds if still valid
  - challenge at or after expiry fails
  Notes:
  - time-boundary regression guard

- Scenario: linked root user missing after principal lookup
  Test Case ID: `TC-ROOT-AUTH-EDGE-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: partial cross-feature fixtures should remain inspectable until cleanup is run
  Coverage:
  - principal exists but linked root-user auth state cannot be resolved
  - login fails safely
  Notes:
  - protects cross-feature seam assumptions

- Scenario: duplicate SSH public key registration
  Test Case ID: `TC-ROOT-AUTH-EDGE-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: duplicate-key fixtures should still be cleanup-addressable
  Coverage:
  - re-adding same active key is rejected
  - fingerprint-based duplicate detection is enforced
  Notes:
  - use equivalent fingerprint cases where relevant

- Scenario: revoke missing key or session
  Test Case ID: `TC-ROOT-AUTH-EDGE-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes when durable key or session setup exists
  Requires Manifest Tracking: yes
  Cleanup Expectation: missing-target fixtures and any created durable rows should remain available until separate cleanup
  Coverage:
  - missing SSH key returns deterministic not-found behavior
  - missing session returns deterministic not-found behavior
  Notes:
  - clarify repeated revoke semantics if future policy changes

- Scenario: empty lists
  Test Case ID: `TC-ROOT-AUTH-EDGE-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/rootAuth/`
  Requires Shared Test Helper: yes if durable principals are created
  Requires Manifest Tracking: yes when durable rows are created
  Cleanup Expectation: list fixtures should still follow run-scoped cleanup rules
  Coverage:
  - listing sessions can return empty list
  - listing SSH keys can return empty list
  Notes:
  - useful for newly bootstrapped or freshly cleaned state

- Scenario: bootstrap rerun idempotency
  Test Case ID: `TC-ROOT-AUTH-EDGE-008`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/rootAuth/`
  Requires Shared Test Helper: yes where durable setup is created outside migration SQL
  Requires Manifest Tracking: yes
  Cleanup Expectation: bootstrap-related rows and audit events should be removable by `testRunId` without fuzzy matching
  Coverage:
  - rerunning bootstrap does not duplicate principal, link, key, or event
  - partial-existing state is repaired safely
  Notes:
  - especially important for migration safety

## Coverage Gaps Or Open Questions

- Item:
  The PRD mentions migration result summaries such as migrated, skipped, or
  failed, but the current implementation is migration-SQL-driven rather than a
  runtime summary capability. If explicit reporting is still desired, test cases
  may need to be split between migration verification and runtime feature tests.

- Item:
  The PRD says `revokeRootUserSshPublicKey` should be idempotent, while the
  current runtime behavior appears closer to not-found on missing or non-owned
  keys. If product intent remains idempotency, this should be clarified and
  aligned before executable tests are written.

- Item:
  The PRD leaves room for administrative management of other root users, but
  current code primarily reflects authenticated root-user access without a
  finer-grained authorization layer. Cross-user credential-management tests
  should stay limited to behavior actually implemented in phase 1.

- Item:
  Under the newer test-data lifecycle framework, durable records created for
  these tests should be generated through shared helpers, tagged by
  `testRunId`, and registered in a manifest so cleanup remains separate,
  explicit, and safe.
