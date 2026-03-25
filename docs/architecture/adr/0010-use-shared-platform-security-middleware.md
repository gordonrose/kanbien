# ADR-0010: Use Shared Platform Security Middleware

- Status: Accepted
- Date: 2026-03-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform now has public authentication routes, protected operator routes,
and plans for broader tenant-aware features. Security controls such as response
headers, request throttling, temporary lock-down behavior, and brute-force
visibility should not be reimplemented independently inside each feature
router.

If these controls stay feature-local, the platform will drift in behavior,
leave uneven abuse protections across endpoints, and make future security
hardening harder to apply consistently. The platform also needs rate-limit and
lock-down state that survives process restarts and can remain consistent across
requests.

The service may later serve HTML, but today it is primarily an API. That means
the platform needs a secure default header baseline now without prematurely
locking in a strict browser-focused content security policy.

## Decision

Use shared platform security middleware and shared persistence for common
security controls.

Current rules:

- `src/app.ts` applies shared security headers globally using `helmet`
- `X-Powered-By` is disabled at the Express app layer
- strict browser-focused CSP is deferred until this service serves HTML and a
  separate decision defines the required policy
- route classes such as `public-read`, `public-auth`,
  `authenticated-general`, and `authenticated-sensitive` use shared rate-limit
  middleware rather than feature-local limiters
- rate limiting uses durable PostgreSQL-backed state rather than in-memory
  counters
- root-auth login flows may apply additional auth-specific abuse and temporary
  lock-down rules on top of general rate limiting
- platform security middleware returns consistent JSON `429` responses for
  throttling and temporary auth lock-down behavior
- suspicious auth patterns, throttling, and temporary lock-down behavior must
  be audit visible through durable events
- the shared platform security design should leave room for future
  tenant-aware limiter keys and policy selection

## Consequences

### Positive

- security hardening is applied consistently across features
- future features can inherit shared protections without re-implementing them
- throttling and lock-down behavior stay visible and auditable
- durable limiter state improves enforcement consistency across requests and
  restarts
- the current API gets safer defaults now without prematurely locking in a CSP
  that may not fit the eventual HTML-serving model

### Negative

- platform wiring becomes more complex than a purely feature-local model
- durable rate limiting adds persistence and migration overhead
- route registration must now carry security policy choices as well as feature
  mounting decisions
- future CSP work is deferred rather than solved immediately

### Neutral / Follow-up

- later ADRs may define tenant-aware rate-limit policies and plan-specific
  limits
- later ADRs should define CSP once this service serves browser-rendered HTML
- shared security middleware should continue to stay thin and cross-cutting
  rather than absorbing feature-specific business rules
