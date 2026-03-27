# Platform Security Hardening

## Purpose

Introduce shared platform-level hardening for all current and future features
by adding:

1. baseline HTTP security headers via `helmet`
2. class-based rate limiting with temporary lockdown rules
3. audit visibility for brute-force and suspicious access patterns

This change is intended to establish reusable security middleware at the
platform layer rather than solving abuse protection separately inside each
feature.

---

## Scope

This phase includes:

- shared `helmet` middleware in the platform app layer
- global rate limiting for public and authenticated routes
- endpoint-class-based rate limiting defaults
- durable/shared-store-backed limiter design
- temporary lockdown rules for abusive access patterns
- explicit user-facing throttling and lockdown responses
- summarized brute-force and suspicious-pattern audit events
- environment-configurable thresholds and durations
- future-ready limiter key design that can later incorporate tenant context

This phase does **not** include:

- tenant-specific rate policies
- a full SIEM or alerting platform
- browser-specific CSP hardening for rendered HTML
- broad CORS redesign
- per-feature bespoke abuse logic outside the shared platform model

---

## Design Goals

- make safe defaults global and reusable
- protect authentication and public endpoints from abuse
- keep denial behavior explicit, deterministic, and auditable
- support future tenant-aware controls without redesigning the middleware
- preserve platform consistency for all future features

---

## Shared Security Headers

### `helmet` baseline

The platform should apply a baseline `helmet` configuration globally in
`app.ts`.

Current decisions:

- use a standard baseline now, not a highly restrictive browser policy
- disable `X-Powered-By`
- apply common safe headers by default to every route
- defer strict browser-oriented CSP policy until this service actually serves
  browser HTML

### CSP decision

`Content-Security-Policy` is deferred in this phase.

Reason:

- the service is not yet serving browser-rendered HTML as a primary runtime
- CSP should be designed intentionally once actual browser content, asset
  loading, and frontend origins are known

When this service begins serving HTML, CSP becomes a required follow-up
hardening task.

---

## Rate Limiting Model

### Shared platform rule

Rate limiting is a shared platform concern and should be implemented through
global reusable middleware wherever possible.

### Storage model

Rate limiting should rely on a durable/shared backend rather than in-memory
process state.

Reason:

- limits must survive restarts
- limits should behave consistently across multiple instances
- the platform should be able to evolve toward tenant-aware enforcement later

### Endpoint classes

Different endpoint classes should have different default policies.

Initial classes:

- `public-read`
  - public low-risk read routes such as health or public metadata
- `public-auth`
  - authentication and account-recovery-adjacent routes such as login and
    future password reset start/complete routes
- `public-write`
  - unauthenticated write endpoints that may exist later
- `authenticated-general`
  - normal authenticated feature traffic
- `authenticated-sensitive`
  - authenticated routes that change credentials, sessions, keys, or other
    security-relevant state

### Keying rules

- unauthenticated requests are rate limited by IP
- authenticated requests are rate limited by IP + authenticated user UUID

The middleware should be written so that future key composition can include
tenant context such as:

- `tenantId`
- `tenantId + userId`
- `tenantId + endpointClass`

but tenant-specific policies are not implemented in this phase.

### Threshold rules

- all public endpoints receive rate limiting
- authenticated routes also receive rate limiting from day one, but with lighter
  defaults than auth-sensitive public routes
- thresholds and windows must be environment-configurable
- code should provide safe defaults
- limits apply to all attempts, not only failures

### Response behavior

At threshold, the platform should return:

- HTTP `429 Too Many Requests`
- a safe JSON error response
- explicit codes such as `RATE_LIMITED`, `AUTH_THROTTLED`, or
  `AUTH_LOCKED_DOWN` depending on the policy outcome

Users should be told they are temporarily throttled or locked due to too many
attempts. The response should not leak internal scoring or rule details beyond
that.

---

## Lockdown Rules

### Purpose

Lockdown rules are temporary intensified restrictions for suspicious patterns
beyond normal per-window rate limiting.

### Phase 1 behavior

The platform should implement temporary lockdown behavior using best-practice
defaults for:

- repeated failed password-stage attempts
- repeated failed SSH-stage attempts
- spray-like behavior from one IP across many identities where detectable
- repeated targeted abuse against one account identity where applicable

### Scope

Lockdowns may be scoped by:

- IP
- account identity
- IP + account identity

### User-facing behavior

- lockdowns are temporary, not permanent
- users receive explicit safe throttling/lockdown responses
- lockdown expiration should occur automatically after the configured duration

### Counter reset rule

Successful full authentication should clear relevant account-scoped auth failure
counters, but should **not** clear broader IP-scoped abuse history.

---

## Audit Visibility And Security Events

### Core rule

Brute-force and suspicious access behavior must be visible through durable audit
events.

### Event storage

This phase should continue to use the existing `auth_audit_events` model for
auth-related abuse visibility rather than introducing a separate platform
security event store.

### Event shape

Events should support both:

- raw security-relevant events
- summarized higher-level suspicious-pattern events

### Required raw events

- password-stage auth success and failure
- SSH-stage auth success and failure
- rate-limit threshold reached
- lockdown response served

### Required summarized events

- repeated password failures detected
- repeated SSH failures detected
- IP-level suspicious auth pattern detected
- account-level suspicious auth pattern detected
- lockdown started
- lockdown cleared where tracked in this phase

### Follow-up note on passive expiry

Passive `lockdown expired` events are deferred for a later phase.

Reason:

- the current design models expiry through `expires_at` on durable lockdown rows
- this phase does not introduce a background processing layer to observe expiry
  and emit one-time lifecycle events

Once a proper background processing layer exists, revisit passive expiry events
and add a durable `lockdown expired` event if the platform still needs that
operator visibility.

### Required metadata

Where applicable, events should include:

- acting auth principal
- affected user identity if known
- event type
- event outcome
- IP address
- user agent
- timestamp
- route or policy class where useful

Plaintext secrets, passwords, raw tokens, and raw signatures must never be
stored in audit events.

---

## Platform Architecture

### Middleware placement

- `helmet` belongs in the platform app layer
- generic rate-limiting primitives belong in shared platform/security middleware
- auth-specific throttling and lockdown rules should reuse shared middleware or
  shared security primitives rather than remain feature-local

### Future extensibility

This platform security layer should be reusable by:

- future root auth refinements
- tenant admin auth
- tenant user auth
- future public write endpoints
- future tenant-specific rate policies

---

## Operational Rules

- thresholds and durations are environment-configurable
- code must provide safe defaults
- local/dev behavior may be relaxed or toggled explicitly
- an operational kill switch should exist for emergency disablement of rate
  limiting if needed
- rollback and containment behavior must be documented

## Operational Note

### Owner

Platform maintainers own the shared security middleware, rate-limit policies,
and platform security persistence introduced by this change.

### Monitoring

Operational review should watch at least:

- frequency of `429 RATE_LIMITED`
- frequency of `AUTH_THROTTLED` and `AUTH_LOCKED_DOWN`
- growth in auth abuse audit events such as `auth_rate_limited` and lock-down
  start events
- unexpected drops in successful login volume after deployment

### Emergency Disablement

If the hardening layer causes unacceptable false positives or blocks legitimate
traffic, set `PLATFORM_SECURITY_ENABLED=false` and redeploy. This disables the
shared rate-limiting and lock-down layer while leaving authentication and
session validation in place.

### Rollback

If the release must be reverted fully, deploy the previous application version
or return to the pre-hardening checkpoint branch. The platform security tables
are additive and may remain in the database during rollback.

---

## Acceptance Criteria

This phase is complete when all of the following are true:

1. the platform applies baseline `helmet` protections globally
2. `X-Powered-By` is disabled
3. all public endpoints are rate limited
4. authenticated endpoints are also rate limited with lighter defaults where
   appropriate
5. endpoint classes have distinct policy defaults
6. rate limits use a durable/shared backend design
7. threshold breaches return explicit `429` JSON responses
8. temporary lockdown rules exist for abusive auth behavior
9. successful full authentication clears relevant account-scoped failure
   counters
10. brute-force and suspicious behavior generate durable audit events
11. higher-level summarized abuse events are recorded
12. the limiter design is extensible to future tenant-aware keys and policies

---

## Standards Gate Review

### NIST SSDF

- Status: Partial
- Notes:
  - Shared security-sensitive behavior is centralized in platform middleware
    and shared persistence rather than scattered across feature routers.
  - New configuration is environment-driven and the repo now includes an
    operational note covering owner, disablement, and rollback.
  - Remaining work includes deterministic automated tests for throttling,
    lock-down behavior, and abuse-audit branches.

### OWASP ASVS

- Status: Partial
- Notes:
  - The platform now applies baseline HTTP security headers, explicit `429`
    responses, server-side abuse controls on sensitive auth endpoints, and
    audit-visible auth abuse events.
  - Public auth routes and protected routes now enforce rate limiting through
    shared server-side middleware.
  - Remaining work is stronger deterministic security test coverage and later
    production monitoring maturity, not the absence of the controls themselves.

### NIST CSF 2.0

- Status: Partial
- Notes:
  - The change improves Protect and Detect through shared security headers,
    throttling, lock-down behavior, and durable abuse audit events.
  - The PRD now records owner, monitoring signals, emergency disablement, and
    rollback direction for the hardening layer.
  - Remaining work is a fuller production monitoring and response/runbook model
    rather than no operational plan at all.

### ISO 27001 / 27002

- Status: Partial
- Notes:
  - The change is now traceable through a PRD, ADR, updated architecture docs,
    and a documented operational note.
  - A new third-party dependency, `helmet`, has been introduced intentionally
    and is visible in the controlled dependency set.
  - Remaining work is fuller approval and test evidence if this were being
    prepared for a stricter audit trail.

### GDPR / Data Transfer

- Status: Partial
- Notes:
  - IP addresses and user agents are personal data and will appear in abuse
    visibility events.
  - The current implementation keeps the data use tied to security monitoring,
    but retention and operational handling expectations still need to be
    documented more fully before a stronger privacy pass.

### EU AI Act

- Status: Not applicable
- Notes:
  - This change introduces no AI capability.
