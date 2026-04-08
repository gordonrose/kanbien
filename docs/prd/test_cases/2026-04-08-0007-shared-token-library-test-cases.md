# Shared Token Library Test Cases

## PRD Scope

- PRD:
  [2026-04-08-0007-shared-token-library.md](/home/gordon/kanbien/docs/prd/2026-04-08-0007-shared-token-library.md)
- Primary features involved:
  - shared platform seam under `src/lib/tokens/`
- Cross-feature seams:
  - future auth, invitation, and recovery features will depend on this seam
  - the seam must not depend on feature-local contract, domain, or persistence
    types
  - caller features own persistence, link generation, delivery, mark-used
    mutation, and post-redemption business behavior
- Notes:
  - this file is the initial PRD-derived source of truth for the shared token
    library
  - this slice is security-sensitive even though it has no route surface
  - this slice is a shared platform seam and should remain small, deterministic,
    and side-effect free
  - Traceability Enforcement: enforced
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Existing Test Impact

- Existing executable tests likely affected:
  - `tests/unit/tokens/oneTimeToken.test.ts`
  - `tests/integration/tokens/flow.test.ts`
  - future auth or invitation features may later add expectation-coupled tests
    that rely on this seam
- Nature of impact:
  additive first; now implemented with focused executable coverage and no
  expectation-changing conflicts obvious at the current repo state
- Discussion needed before changing existing tests:
  no current blocker is obvious; future changes should treat the live token
  seam and its executable tests as the baseline

## Unit Tests For Individual Capabilities

- Capability: `createOneTimeTokenMaterial`
  Test Case ID: `TC-TOKENS-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - creates opaque raw token material for `email_verification`
  - returns `tokenId`, `rawToken`, `secretHash`, `createdAt`, and `expiresAt`
  - uses deterministic `now` input when supplied for stable testability
  - computes `expiresAt` from a positive integer TTL
  - does not expose the raw secret separately from the opaque raw token

- Capability: `createOneTimeTokenMaterial`
  Test Case ID: `TC-TOKENS-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - creates token material for `password_reset`
  - supports multiple reviewed purpose values without changing the wire format
  - produces hashed storage material that can be persisted without storing the
    raw secret

- Capability: `parseOneTimeToken`
  Test Case ID: `TC-TOKENS-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - parses the approved `<tokenId>.<secret>` token format
  - returns lookup-ready `tokenId` and secret parts
  - accepts opaque secrets without imposing feature-specific semantics

- Capability: `verifyOneTimeTokenAgainstRecord`
  Test Case ID: `TC-TOKENS-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - verifies a valid presented token against a caller-supplied stored record
  - accepts a matching `tokenId`
  - accepts a matching reviewed purpose
  - accepts an unused and unexpired record
  - returns stable success metadata without mutating caller-owned state

## Integration Tests For Features Working Together

- Flow: token seam stays platform-owned and feature-agnostic when consumed by
  a future caller feature
  Test Case ID: `TC-TOKENS-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Features:
  - shared `tokens` seam
  - a minimal caller-owned fixture or adapter
  Coverage:
  - caller feature can create token material, persist only hashed metadata, and
    later verify a presented token against that stored metadata
  - token mechanics stay reusable without importing feature-local persistence
    or contract types into the shared seam
  Notes:
  - this can be implemented with a minimal fake caller in tests rather than a
    full product feature because the PRD intentionally keeps workflow ownership
    outside the library

## NFR Security Tests

- Scenario: token creation rejects invalid TTL input before emitting token
  material
  Test Case ID: `TC-TOKENS-SEC-001`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - zero TTL is rejected
  - negative TTL is rejected
  - non-integer TTL is rejected
  - invalid input does not produce partial token material

- Scenario: parsing rejects malformed token shapes deterministically
  Test Case ID: `TC-TOKENS-SEC-002`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - missing delimiter is rejected
  - empty tokenId is rejected
  - empty secret is rejected
  - multiply-delimited values are rejected
  - malformed input is rejected before any secret comparison path

- Scenario: verification rejects purpose mismatch, used state, expiry, and
  secret mismatch deterministically
  Test Case ID: `TC-TOKENS-SEC-003`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - purpose mismatch is rejected
  - already-used record is rejected
  - expired record is rejected
  - secret mismatch is rejected
  - token-ID mismatch is rejected

- Scenario: verification remains side-effect free
  Test Case ID: `TC-TOKENS-SEC-004`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - verification does not mark caller-owned records used
  - verification does not mutate expiry, purpose, or stored hash fields
  - caller-owned mark-used semantics remain outside the library

## NFR Logging Or Audit Tests

- Scenario: token seam does not require direct audit ownership in the library
  Test Case ID: `TC-TOKENS-AUD-001`
  Recommended Test Layer: `architecture-audit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - the shared seam remains side-effect free and does not try to write audit
    events directly
  - caller workflow responsibility for issuance and redemption audit remains
    explicit in implementation shape and tests
  Notes:
  - this is less about durable audit rows and more about preserving the
    intended architecture boundary

## Edge Cases And Negative Tests

- Scenario: creation output remains storage-safe and opaque
  Test Case ID: `TC-TOKENS-EDGE-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - `secretHash` is suitable for durable storage
  - raw token output does not contain a separately exposed raw-secret field
  - the stored hash does not equal the presented raw token string

- Scenario: verification works with deterministic time injection at the expiry
  boundary
  Test Case ID: `TC-TOKENS-EDGE-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - a token is valid strictly before expiry
  - a token is rejected at or after the configured expiry boundary
  - deterministic `now` injection makes the boundary test stable

- Scenario: future caller features can add new subject metadata without
  changing the token wire format
  Test Case ID: `TC-TOKENS-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/tokens/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - caller-owned stored metadata beyond the minimum token record shape does not
    need to change the token wire format
  - the shared seam stays purpose-aware but workflow-agnostic

## Coverage Gaps Or Open Questions

- Item:
  the PRD intentionally leaves persistence ownership outside the shared seam,
  so later features will still need their own token-record storage and mark-used
  behavior; those flows will require separate PRDs and test inventories
- Item:
  the PRD assumes constant-time secret comparison but does not prescribe a
  specific implementation primitive; executable tests should prove the
  deterministic behavior while code review confirms the concrete primitive
- Item:
  `TC-TOKENS-AUD-001` is an architecture-boundary case rather than a durable
  audit-row case because the library deliberately has no direct persistence or
  audit sink
