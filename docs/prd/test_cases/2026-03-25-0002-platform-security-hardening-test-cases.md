# PRD Test Cases

## PRD Scope

- PRD: [`2026-03-25-0002-platform-security-hardening.md`](/home/gordon/kanbien/docs/prd/2026-03-25-0002-platform-security-hardening.md)
- Primary features involved:
  - platform app and router
  - shared platform security middleware
  - `rootAuth`
  - `rootUsers`
- Cross-feature seams:
  - shared route-class rate limiting applied from [`index.ts`](/home/gordon/kanbien/src/routes/v1/index.ts)
  - shared auth abuse and lockdown behavior reused by `rootAuth`
  - durable platform-security state persisted through [`postgresRepository.ts`](/home/gordon/kanbien/src/lib/security/postgresRepository.ts)
- Notes:
  - this PRD is primarily platform-owned rather than feature-owned
  - the current implementation already covers much of the PRD baseline through shared middleware, durable counters, lockdown tables, and auth-visible events
  - the main unresolved areas are summarized suspicious-pattern events and lockdown expiry or clear events, which are described by the PRD but not clearly implemented in current code
  - cleanup expectations in this file refer to preserved durable-test workflows;
    the routine `npm run test:persistence` suite now remains reset-first unless
    `npm run test:persistence:preserve` is used intentionally

## Existing Test Impact

- Existing executable tests likely affected:
  - [`app.smoke.test.ts`](/home/gordon/kanbien/tests/platform/app.smoke.test.ts)
  - [`flow.test.ts`](/home/gordon/kanbien/tests/integration/rootAuth/flow.test.ts)
  - [`security.test.ts`](/home/gordon/kanbien/tests/security/rootAuth/security.test.ts)
  - [`audit.test.ts`](/home/gordon/kanbien/tests/audit/rootAuth/audit.test.ts)
  - Postgres-backed platform-security-adjacent coverage in [`persistence.security.test.ts`](/home/gordon/kanbien/tests/security/rootAuth/persistence.security.test.ts) and [`persistence.audit.test.ts`](/home/gordon/kanbien/tests/audit/rootAuth/persistence.audit.test.ts)
- Nature of impact:
  - mostly additive new platform-security tests
  - some current root-auth security and audit tests will likely be extended rather than replaced
  - summarized-event and lockdown-expiry expectations would be expectation-changing relative to current code if implemented exactly as written in the PRD
- Discussion needed before changing existing tests:
  - yes for PRD cases that assume summarized suspicious-pattern events already exist
  - yes for PRD cases that assume lockdown expiry or clear events are emitted today
  - no for the baseline hardening, route-class limiter, safe `429`, kill-switch, and durable-backend coverage, which appear additive to the current suite

## Current Status

- Overall traceability status:
  - `29/30` platform-security PRD test cases are traceable in executable test code
- Overall execution status:
  - the `UNIT`, `INT`, `SEC`, runtime-facing `AUD`, and runtime-facing `EDGE` slices implemented so far are exercised by `npm test`
  - the storage-sensitive platform-security durability and audit proofs are exercised by `npm run test:persistence`
- Layer summary:
  - `UNIT`: traceable and runtime-tested
  - `INT`: traceable and runtime-tested
  - `SEC`: traceable, runtime-tested, and persistence-tested where required
  - `AUD`: partially traceable, runtime-tested, and persistence-tested where required
  - `EDGE`: traceable and runtime-tested, with persistence-backed durability coverage traced through the shared Postgres-backed proof
- Implemented `TC-*` IDs:
  - `TC-PLATFORM-SEC-UNIT-001`
  - `TC-PLATFORM-SEC-UNIT-002`
  - `TC-PLATFORM-SEC-UNIT-003`
  - `TC-PLATFORM-SEC-UNIT-004`
  - `TC-PLATFORM-SEC-UNIT-005`
  - `TC-PLATFORM-SEC-UNIT-006`
  - `TC-PLATFORM-SEC-INT-001`
  - `TC-PLATFORM-SEC-INT-002`
  - `TC-PLATFORM-SEC-INT-003`
  - `TC-PLATFORM-SEC-INT-004`
  - `TC-PLATFORM-SEC-INT-005`
  - `TC-PLATFORM-SEC-INT-006`
  - `TC-PLATFORM-SEC-SEC-001`
  - `TC-PLATFORM-SEC-SEC-002`
  - `TC-PLATFORM-SEC-SEC-003`
  - `TC-PLATFORM-SEC-SEC-004`
  - `TC-PLATFORM-SEC-SEC-005`
  - `TC-PLATFORM-SEC-SEC-006`
  - `TC-PLATFORM-SEC-AUD-001`
  - `TC-PLATFORM-SEC-AUD-002`
  - `TC-PLATFORM-SEC-AUD-003`
  - `TC-PLATFORM-SEC-AUD-004`
  - `TC-PLATFORM-SEC-AUD-005`
  - `TC-PLATFORM-SEC-AUD-006`
  - `TC-PLATFORM-SEC-EDGE-001`
  - `TC-PLATFORM-SEC-EDGE-002`
  - `TC-PLATFORM-SEC-EDGE-003`
  - `TC-PLATFORM-SEC-EDGE-004`
  - `TC-PLATFORM-SEC-EDGE-005`
- Persistence-backed platform-security cases:
  - `TC-PLATFORM-SEC-SEC-005`
  - `TC-PLATFORM-SEC-AUD-005`
  - `TC-PLATFORM-SEC-EDGE-005`
- Intentionally deferred platform-security audit cases:
  - `TC-PLATFORM-SEC-AUD-007`
- Verification commands:
  - `npx vitest run tests/platform/app.smoke.test.ts tests/unit/platformSecurity/rateLimit.test.ts tests/unit/platformSecurity/rootAuthAbuse.test.ts`
  - `npx vitest run tests/integration/platformSecurity/flow.test.ts`
  - `npx vitest run tests/security/platformSecurity/security.test.ts`
  - `npx vitest run tests/audit/platformSecurity/audit.test.ts`
  - `npx vitest run tests/unit/platformSecurity/rateLimit.test.ts tests/unit/platformSecurity/rootAuthAbuse.test.ts tests/security/platformSecurity/persistence.security.test.ts`
  - `npm run test:traceability`
  - `npm test`
  - `npm run test:persistence`
  - `npm run test:persistence:preserve`
  - `npm run build`

## Unit Tests For Individual Capabilities

- Capability: baseline app security setup applies shared hardening at the platform entry point
  Test Case ID: `TC-PLATFORM-SEC-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/platform/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - `helmet` middleware is applied globally
  - `X-Powered-By` is disabled
  - CSP remains intentionally disabled for this API-only phase
  Notes:
  - should use the real app factory from [`app.ts`](/home/gordon/kanbien/src/app.ts)

- Capability: shared rate-limit middleware allows requests while attempts remain at or below threshold
  Test Case ID: `TC-PLATFORM-SEC-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - increments the configured durable counter
  - calls `next()` while below or exactly at threshold
  - does not emit a `429` before the threshold is exceeded
  Notes:
  - should exercise the shared middleware from [`rateLimit.ts`](/home/gordon/kanbien/src/lib/security/rateLimit.ts)

- Capability: shared rate-limit middleware returns explicit `429` JSON after threshold breach
  Test Case ID: `TC-PLATFORM-SEC-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - returns HTTP `429`
  - returns the configured safe response code and message
  - does not leak internal scoring, threshold, or policy details
  Notes:
  - this should be assertion-heavy around response shape

- Capability: shared rate-limit middleware writes an audit event when configured for threshold-breach visibility
  Test Case ID: `TC-PLATFORM-SEC-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - calls the platform-security repository to create a security audit event
  - includes event type, outcome, IP, and user agent when provided
  - still returns a safe throttled response
  Notes:
  - aligns with the PRD requirement for audit visibility on threshold breach

- Capability: root-auth abuse protection creates scoped lockdowns and avoids duplicate active lockdowns
  Test Case ID: `TC-PLATFORM-SEC-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - creates IP, account, and IP+account-scoped lockdowns when thresholds are crossed
  - does not create a duplicate active lockdown for the same active scope
  - emits the expected lockdown-start event type for password and SSH abuse paths
  Notes:
  - should target [`rootAuthAbuse.ts`](/home/gordon/kanbien/src/lib/security/rootAuthAbuse.ts)

- Capability: successful full authentication clears account-scoped counters but preserves broader IP-scoped history
  Test Case ID: `TC-PLATFORM-SEC-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - clears account-scoped and IP+account-scoped auth-failure counters
  - leaves broader IP-scoped history intact
  - reflects the PRD rule that success should not erase broader abuse evidence
  Notes:
  - this one should use PRD intent as the authority if current behavior diverges

## Integration Tests For Features Working Together

- Flow: `GET /v1/health` is protected by the shared `public-read` limiter and eventually returns `429 RATE_LIMITED`
  Test Case ID: `TC-PLATFORM-SEC-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Features:
  - platform router
  - shared rate-limit middleware
  Coverage:
  - repeated requests to `/v1/health` eventually produce `429 RATE_LIMITED`
  - response remains structured JSON
  - route remains otherwise public and simple
  Notes:
  - should verify the `public-read` route class specifically

- Flow: `rootUsers` routes remain auth-protected and also enforce shared `authenticated-general` throttling
  Test Case ID: `TC-PLATFORM-SEC-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: durable auth and security records should remain available until separate cleanup runs
  Features:
  - `rootUsers`
  - shared bearer-session middleware
  - shared authenticated-general rate limiting
  Coverage:
  - unauthenticated requests are still rejected by auth
  - authenticated requests are subject to shared throttling
  - throttled responses use `RATE_LIMITED`
  Notes:
  - should reuse the durable test-data helpers when a real session is created

- Flow: public `rootAuth` login routes enforce shared `public-auth` throttling with `AUTH_THROTTLED`
  Test Case ID: `TC-PLATFORM-SEC-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: auth abuse and audit evidence should survive until separate cleanup
  Features:
  - `rootAuth`
  - shared public-auth rate limiting
  - shared auth abuse and lockdown controls
  Coverage:
  - repeated public auth attempts can trigger `AUTH_THROTTLED`
  - temporary lockdown can escalate to `AUTH_LOCKED_DOWN`
  - threshold and lockdown branches remain audit-visible
  Notes:
  - current root-auth integration coverage already overlaps this flow

- Flow: protected `rootAuth` credential and session routes enforce shared `authenticated-sensitive` throttling
  Test Case ID: `TC-PLATFORM-SEC-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: durable auth and security records should remain available until separate cleanup runs
  Features:
  - `rootAuth`
  - shared authenticated-sensitive rate limiting
  Coverage:
  - protected credential, session, or SSH-key mutation routes eventually return `429 RATE_LIMITED`
  - valid bearer auth is still required before throttling applies
  Notes:
  - should explicitly distinguish this from `public-auth`

- Flow: `PLATFORM_SECURITY_ENABLED=false` disables shared rate limiting while leaving auth/session validation intact
  Test Case ID: `TC-PLATFORM-SEC-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Features:
  - platform env-driven configuration
  - shared middleware wiring
  Coverage:
  - repeated requests no longer trigger shared throttling
  - protected routes still require auth
  - auth/session validation remains intact
  Notes:
  - aligns with the PRD emergency disablement rule

- Flow: endpoint classes use distinct default policies rather than one uniform limit
  Test Case ID: `TC-PLATFORM-SEC-INT-006`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Features:
  - platform env configuration
  - route-class middleware
  Coverage:
  - `public-read`, `public-auth`, `authenticated-general`, and `authenticated-sensitive` use distinct limits or response behavior
  - platform policy is route-class-specific, not feature-local duplication
  Notes:
  - should help protect against policy drift in future features

## NFR Security Tests

- Scenario: all `429` responses use safe JSON shapes without leaking scoring or internal rule details
  Test Case ID: `TC-PLATFORM-SEC-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - `RATE_LIMITED`, `AUTH_THROTTLED`, and `AUTH_LOCKED_DOWN` responses remain intentionally generic
  - no internal thresholds, counters, or rule reasons are returned
  Notes:
  - should validate the externally safe behavior the PRD requires

- Scenario: authenticated rate limiting keys on IP + authenticated root user so one user does not throttle another user incorrectly
  Test Case ID: `TC-PLATFORM-SEC-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: durable test auth data should be left for inspection until the cleanup command runs
  Coverage:
  - authenticated-general counters are scoped to IP + root user
  - one user does not incorrectly consume another user’s authenticated budget
  Notes:
  - should use real session-bearing requests

- Scenario: lockdown behavior applies to repeated abusive auth patterns and blocks further attempts until expiry
  Test Case ID: `TC-PLATFORM-SEC-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: auth abuse counters, lockdowns, and audit events should survive until cleanup
  Coverage:
  - repeated password-stage failures can trigger lockdown
  - repeated SSH-stage failures can trigger lockdown
  - locked requests receive explicit safe responses
  Notes:
  - current code supports password and SSH lockdown starts

- Scenario: successful full authentication clears relevant account-scoped auth failure state only
  Test Case ID: `TC-PLATFORM-SEC-SEC-004`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: counters and security records should survive until separate cleanup
  Coverage:
  - success clears account and IP+account state relevant to that identity
  - broader IP-scoped abuse history remains
  Notes:
  - use PRD intent if the current implementation needs adjustment

- Scenario: durable backend behavior survives new repository or middleware instances rather than depending on process memory
  Test Case ID: `TC-PLATFORM-SEC-SEC-005`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: durable counters and lockdown rows should remain available until cleanup
  Coverage:
  - counters remain enforceable across new repository instances
  - lockdown state remains enforceable across new middleware instances
  - behavior is backed by Postgres state, not in-memory counters
  Notes:
  - likely persistence-backed

- Scenario: emergency kill switch disables throttling and lockdown without disabling authentication and session checks
  Test Case ID: `TC-PLATFORM-SEC-SEC-006`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - `PLATFORM_SECURITY_ENABLED=false` disables shared rate limiting
  - session auth and protected-route requirements still apply
  Notes:
  - this is the security-focused version of the integration flow

## NFR Logging Or Audit Tests

- Scenario: raw rate-limit threshold breaches generate durable audit-visible events
  Test Case ID: `TC-PLATFORM-SEC-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: security audit rows should survive until cleanup
  Coverage:
  - threshold breaches write durable audit-visible events
  - event type and outcome are populated
  Notes:
  - current code already emits `auth_rate_limited` for public-auth throttling

- Scenario: raw lockdown start events are recorded for repeated password-stage abuse
  Test Case ID: `TC-PLATFORM-SEC-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: security audit rows should survive until cleanup
  Coverage:
  - repeated password failures emit `login_password_lockdown_started`
  - event remains durable and inspectable
  Notes:
  - current code appears aligned here

- Scenario: raw lockdown start events are recorded for repeated SSH-stage abuse
  Test Case ID: `TC-PLATFORM-SEC-AUD-003`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: security audit rows should survive until cleanup
  Coverage:
  - repeated SSH failures emit `login_ssh_lockdown_started`
  - event remains durable and inspectable
  Notes:
  - current code appears aligned here

- Scenario: security audit events include required metadata such as event type, outcome, IP, user agent, and timestamp
  Test Case ID: `TC-PLATFORM-SEC-AUD-004`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: security audit rows should survive until cleanup
  Coverage:
  - event metadata includes the fields the PRD requires where applicable
  - timestamps are durable and queryable
  Notes:
  - principal and root-user linkage should be asserted where known

- Scenario: plaintext passwords, raw tokens, and raw signatures are never stored in security audit events
  Test Case ID: `TC-PLATFORM-SEC-AUD-005`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: durable audit rows should remain available until cleanup for inspection
  Coverage:
  - audit events exclude plaintext passwords
  - audit events exclude raw bearer tokens
  - audit events exclude raw SSH signatures
  Notes:
  - likely strongest as a persistence-backed audit case

- Scenario: summarized suspicious-pattern events are recorded for repeated abuse patterns
  Test Case ID: `TC-PLATFORM-SEC-AUD-006`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: durable audit rows should remain available until cleanup for inspection
  Coverage:
  - repeated password failures generate summarized higher-level suspicious-pattern events
  - repeated SSH failures generate summarized higher-level suspicious-pattern events
  - IP-level and account-level suspicious patterns are represented durably
  Notes:
  - PRD intent currently appears ahead of implementation
  - treat as expectation-changing if we later implement it exactly as written

- Scenario: lockdown expiry or clear events are recorded where the platform tracks that state
  Test Case ID: `TC-PLATFORM-SEC-AUD-007`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: durable audit rows should remain available until cleanup for inspection
  Coverage:
  - clear-on-success behavior is auditable where implemented
  - passive expiry remains a future follow-up once a background processing layer exists
  Notes:
  - this case is intentionally narrowed to clear events for the current phase
  - revisit passive expiry when the repo has a proper background processing layer

## Edge Cases And Negative Tests

- Scenario: a request at the exact threshold is still allowed and the next request is rejected
  Test Case ID: `TC-PLATFORM-SEC-EDGE-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - threshold boundary is deterministic
  - first over-limit request is the one rejected
  Notes:
  - protects against off-by-one drift

- Scenario: missing limiter subject key fails open safely rather than crashing the request
  Test Case ID: `TC-PLATFORM-SEC-EDGE-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - null subject key skips limiter enforcement safely
  - middleware still calls `next()` without crashing
  Notes:
  - relevant for routes that only become authenticated after earlier middleware

- Scenario: active lockdown creation is idempotent and does not duplicate rows for the same active scope
  Test Case ID: `TC-PLATFORM-SEC-EDGE-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - repeated create attempts while an active lockdown exists do not duplicate state
  - only the first applicable active lockdown is created
  Notes:
  - current repository logic appears aligned

- Scenario: `public-write` policy remains configurable and testable even before the first route uses it
  Test Case ID: `TC-PLATFORM-SEC-EDGE-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage:
  - `public-write` remains part of the supported route-class model
  - policy configuration can be exercised without a live route yet
  Notes:
  - this protects future extensibility without requiring a current endpoint

- Scenario: shared counters and lockdown records persist across a new app or middleware instance in the same DB
  Test Case ID: `TC-PLATFORM-SEC-EDGE-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/platformSecurity/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: durable security rows should survive until cleanup
  Coverage:
  - recreated repository or middleware instances still observe existing counter and lockdown state
  - enforcement remains durable across process-local recreation
  Notes:
  - likely persistence-backed

## Coverage Gaps Or Open Questions

- Item: Passive `lockdown expired` events are intentionally deferred until a background processing layer exists.
- Item: `public-write` is part of the shared route-class model, but there is no current route using it.
- Item: Some platform-security expectations are already covered indirectly through existing `rootAuth` tests; implementation work should decide whether to centralize those assertions into platform-security-focused test files or keep some overlap intentionally.
