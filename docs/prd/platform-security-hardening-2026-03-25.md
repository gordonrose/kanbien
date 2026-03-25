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
- lockdown expired or cleared where tracked

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

- Status: Planned
- Notes:
  - This change directly addresses secure design, protected implementation, and
    abuse-case handling for the platform.
  - Implementation must include rollback and operational control notes.

### OWASP ASVS

- Status: Planned
- Notes:
  - This change targets ASVS concerns around HTTP security headers, session and
    authentication abuse controls, logging, and safe API behavior.
  - Sensitive endpoints must receive explicit abuse protections.

### NIST CSF 2.0

- Status: Planned
- Notes:
  - This change improves protection, detection, and response readiness for the
    platform.
  - Observability and operational disablement paths must be included in the
    implementation.

### GDPR / Data Transfer

- Status: Partial
- Notes:
  - IP addresses and user agents are personal data and will appear in abuse
    visibility events.
  - Implementation should avoid unnecessary duplication and should document
    retention expectations for security events.

### EU AI Act

- Status: Not applicable
- Notes:
  - This change introduces no AI capability.
