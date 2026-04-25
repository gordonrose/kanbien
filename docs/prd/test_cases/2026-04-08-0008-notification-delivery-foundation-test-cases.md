# Notification Delivery Foundation Test Cases

## PRD Scope

- PRD:
  [2026-04-08-0008-notification-delivery-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-08-0008-notification-delivery-foundation.md)
- Primary features involved:
  - `notificationDelivery`
  - shared token seam as a future consumer dependency boundary, not as a
    direct workflow owner in this slice
- Cross-feature seams:
  - provider-agnostic email delivery seam inside `notificationDelivery`
  - `notificationDelivery` registers `notification.email.send` with
    `jobProcessing` for provider-safe stored email delivery
  - future consuming features such as tenant auth, invite delivery, and
    recovery flows must call `notificationDelivery` rather than bypassing it
  - `notificationDelivery` may consume platform env/config and root authz
    middleware, but must not embed auth workflow or token workflow ownership
- Notes:
  - this slice is route-bearing, persistence-bearing, provider-integrating, and
    auth-sensitive
  - Traceability Enforcement: enforced
  - Lifecycle metadata defaults currently apply:
    - `Version: v1`
    - `Lifecycle Status: active`

## Existing Test Impact

- Existing executable tests likely affected:
  - `tests/unit/notificationDelivery/`
  - `tests/integration/notificationDelivery/`
  - `tests/security/notificationDelivery/`
  - `tests/audit/notificationDelivery/`
  - `tests/integration/notificationDelivery/persistence.test.ts`
  - shared persistence entrypoints in `package.json` and
    `src/scripts/runTestSuite.ts`
- Nature of impact:
  additive first; now implemented and integrated into both focused and shared
  test runs
- Discussion needed before changing existing tests:
  no current blocker is obvious; future updates should treat the existing
  `notificationDelivery` executable suite as the baseline rather than assuming
  the feature is still pre-implementation

- Job-processing adoption impact:
  additive. Existing synchronous route and resend tests remain the baseline,
  while provider-safe async delivery is covered with unit-level job handler
  tests.

## Unit Tests For Individual Capabilities

- Capability: `sendEmail`
  Test Case ID: `TC-NOTIFICATION-DELIVERY-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/notificationDelivery/`
  Requires Shared Test Helper: yes; provider adapter stub
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - creates one logical outbound-email record shape for a new send
  - creates one attempt record shape for the first send
  - normalizes provider success into stable platform status
  - returns logical email metadata plus latest-attempt metadata
  Notes:
  - this should stay provider-agnostic at the feature seam

- Capability: `sendEmail`
  Test Case ID: `TC-NOTIFICATION-DELIVERY-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/notificationDelivery/`
  Requires Shared Test Helper: yes; provider adapter stub
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - normalizes provider failure into stable platform error and status
  - records failure metadata without leaking provider-only raw internals
  - preserves actor and related-entity metadata on failure

- Capability: `resendEmail`
  Test Case ID: `TC-NOTIFICATION-DELIVERY-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/notificationDelivery/`
  Requires Shared Test Helper: yes; provider adapter stub
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - resend creates a new attempt for an existing logical email
  - resend does not create a second logical email row by default
  - latest-attempt metadata reflects the resend result
  - resend history remains visible

- Capability: `getOutboundEmail`
  Test Case ID: `TC-NOTIFICATION-DELIVERY-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/notificationDelivery/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - returns one logical outbound-email record
  - returns associated attempt history
  - exposes content-version visibility per attempt
  - keeps retrieval metadata-first

- Capability: `listOutboundEmails`
  Test Case ID: `TC-NOTIFICATION-DELIVERY-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/notificationDelivery/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - applies repo-standard pagination and sorting defaults
  - supports the approved filter set:
    - tenant
    - notification type
    - recipient
    - related entity
    - status
    - date range
    - subject
  - returns list summaries without requiring exact read

## Integration Tests For Features Working Together

- Flow: root-admin operator sends a real test email through the proof route and
  receives normalized logical-email plus attempt metadata
  Test Case ID: `TC-NOTIFICATION-DELIVERY-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/notificationDelivery/`
  Requires Shared Test Helper: yes; root-auth harness and provider adapter seam
  Requires Manifest Tracking: no
  Cleanup Expectation: route-level or service-level integration only unless the
  test uses persistence-backed storage
  Features:
  - `notificationDelivery`
  - root-authenticated root-admin session
  Coverage:
  - authenticated root-admin can call the proof-of-working send route
  - send succeeds through the feature boundary
  - one logical email and one attempt are returned in normalized form
  - route-level contract shape is stable
  Notes:
  - initial runtime integration may use a fake provider adapter in non-
    persistence tests, with real-provider proof covered separately if needed

- Flow: root-admin operator lists and reads outbound-email metadata through the
  new route family
  Test Case ID: `TC-NOTIFICATION-DELIVERY-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/notificationDelivery/`
  Requires Shared Test Helper: yes; root-auth harness
  Requires Manifest Tracking: no
  Cleanup Expectation: depends on whether durable test data is created in the
  runtime harness or in Postgres-backed tests
  Features:
  - `notificationDelivery`
  - root-authenticated root-admin session
  Coverage:
  - list route returns paginated metadata-first results
  - exact read returns one logical email plus attempt history
  - filter behavior works for the approved search model

- Flow: resend creates a new attempt and preserves truthful attempt-level
  history
  Test Case ID: `TC-NOTIFICATION-DELIVERY-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/notificationDelivery/`
  Requires Shared Test Helper: yes; root-auth harness and provider adapter seam
  Requires Manifest Tracking: no
  Cleanup Expectation: depends on runtime versus persistence-backed substrate
  Features:
  - `notificationDelivery`
  - root-authenticated root-admin session
  Coverage:
  - resend route creates a second attempt
  - exact read shows both attempts
  - attempt-level content-version visibility remains truthful when resend uses
    changed content metadata

## NFR Security Tests

- Scenario: root-only access is enforced for proof send, list, exact read, and
  resend routes
  Test Case ID: `TC-NOTIFICATION-DELIVERY-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/notificationDelivery/`
  Requires Shared Test Helper: yes; root-auth harness
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a if requests are rejected before durable writes
  Coverage:
  - unauthenticated requests are denied
  - authenticated non-admin or missing-capability requests are denied
  - only the approved root capability boundary may send or retrieve

- Scenario: duplicate-send guardrail blocks obvious rapid accidental duplicates
  Test Case ID: `TC-NOTIFICATION-DELIVERY-SEC-002`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/unit/notificationDelivery/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - identical payload plus recipient inside the guard window is rejected
  - allowed sends outside the guard window still work
  - the guardrail does not require a full future idempotency platform to be
    useful

- Scenario: durable records and retrieval do not expose raw secret-bearing links
  Test Case ID: `TC-NOTIFICATION-DELIVERY-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/notificationDelivery/`
  Requires Shared Test Helper: yes; sanitized content fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: depends on runtime versus persistence-backed substrate
  Coverage:
  - verification or reset links are not stored durably in readable form
  - sanitized placeholders are used when content snapshots are present
  - retrieval responses do not leak raw token-bearing content

- Scenario: resend does not blindly replay unsafe secret-bearing content
  Test Case ID: `TC-NOTIFICATION-DELIVERY-SEC-004`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/unit/notificationDelivery/`
  Requires Shared Test Helper: yes; workflow-aware resend fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - platform resend path preserves room for caller-owned regeneration policy
  - the feature does not require reading raw secret links back from durable
    storage to resend an email

## NFR Logging Or Audit Tests

- Scenario: send and resend remain operator-visible through durable audit and
  actor attribution
  Test Case ID: `TC-NOTIFICATION-DELIVERY-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/notificationDelivery/`
  Requires Shared Test Helper: yes; root-auth harness
  Requires Manifest Tracking: no
  Cleanup Expectation: depends on runtime versus persistence-backed substrate
  Coverage:
  - successful send is auditable
  - successful resend is auditable
  - audit correlates actor, logical email, and attempt metadata

- Scenario: privileged metadata retrieval remains operator-visible where the
  repo's audit posture requires it
  Test Case ID: `TC-NOTIFICATION-DELIVERY-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/notificationDelivery/`
  Requires Shared Test Helper: yes; root-auth harness
  Requires Manifest Tracking: no
  Cleanup Expectation: depends on runtime versus persistence-backed substrate
  Coverage:
  - exact read and list access can be traced to the requesting root actor when
    current operator-audit policy says those reads are sensitive
  Notes:
  - if implementation intentionally keeps metadata reads out of durable audit,
    this case should be revisited explicitly rather than silently dropped

## Edge Cases And Negative Tests

- Scenario: provider-specific statuses and errors normalize into stable platform
  semantics
  Test Case ID: `TC-NOTIFICATION-DELIVERY-EDGE-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/notificationDelivery/`
  Requires Shared Test Helper: yes; provider adapter fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - provider success maps to stable send status
  - transient provider failure maps to stable failure metadata
  - provider-specific raw details do not become the public contract

- Scenario: exact read distinguishes repeated delivery tries of the same content
  from resend attempts with changed content
  Test Case ID: `TC-NOTIFICATION-DELIVERY-EDGE-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/notificationDelivery/`
  Requires Shared Test Helper: yes; content-version fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: depends on runtime versus persistence-backed substrate
  Coverage:
  - two attempts may point to the same content version
  - later resend may point to a different content version
  - exact read makes the distinction visible

- Scenario: persistence-backed retrieval honors the approved search fields and
  durable attempt history
  Test Case ID: `TC-NOTIFICATION-DELIVERY-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/notificationDelivery/`
  Requires Shared Test Helper: yes; Postgres-backed harness later
  Requires Manifest Tracking: no
  Cleanup Expectation: shared Postgres reset helper must cover the new tables
  Coverage:
  - tenant, type, recipient, date, status, subject, and related-entity filters
    work against durable rows
  - exact read returns stable attempt ordering
  Notes:
  - this is likely persistence-backed once the feature exists

- Scenario: async job handler delivers provider-safe stored email content
  Test Case ID: `TC-NOTIFICATION-DELIVERY-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/notificationDelivery/`
  Requires Shared Test Helper: yes; fake provider and in-memory repository
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - creates a pending durable outbound email
  - invokes the `notification.email.send` job handler with
    `{ outboundEmailId }`
  - sends the stored provider-safe content through the provider seam
  - records a normal outbound-email attempt

- Scenario: async job handler refuses redacted security-sensitive snapshots
  Test Case ID: `TC-NOTIFICATION-DELIVERY-SEC-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/notificationDelivery/`
  Requires Shared Test Helper: yes; fake provider and in-memory repository
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Coverage:
  - creates a pending durable outbound email whose stored content contains a
    redacted verification or reset marker
  - verifies the async job handler rejects the record before provider send
  - preserves the rule that durable placeholders are not sent as email content

## Coverage Gaps Or Open Questions

- Item:
  bounce/complaint webhooks, suppression handling, scheduled sending, and
  async owner-regenerated security-sensitive content remain out of scope here
  and will need their own later PRD/test inventory rather than being smuggled
  into v1 tests
- Item:
  a later real-provider proof may need a dedicated manually run integration
  path or operator checklist if the normal automated suite should not depend on
  live email delivery every run
