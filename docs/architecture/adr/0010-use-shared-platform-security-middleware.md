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

The service began as primarily an API, so the platform first adopted a secure
header baseline without prematurely locking in a strict browser-focused content
security policy. The later root-admin browser shell means CSP is no longer
fully deferred for every surface.

## Decision

Use shared platform security middleware and shared persistence for common
security controls.

Current rules:

- `src/app.ts` applies shared security headers globally using `helmet`
- `X-Powered-By` is disabled at the Express app layer
- shared platform security still owns the global header baseline, but browser
  CSP is now tightened for the root-admin HTML surface through a later
  same-origin browser-shell decision
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
- the current API gets safer defaults and the root-admin browser shell now has
  a least-privilege CSP without forcing every future HTML surface to share the
  exact same allowances

### Negative

- platform wiring becomes more complex than a purely feature-local model
- durable rate limiting adds persistence and migration overhead
- route registration must now carry security policy choices as well as feature
  mounting decisions
- browser CSP work now exists for the root-admin shell and must expand only
  when new browser capabilities require it

### Neutral / Follow-up

- later ADRs may define tenant-aware rate-limit policies and plan-specific
  limits
- ADR 0013 defines the first browser-shell CSP and auth-shell model
- shared security middleware should continue to stay thin and cross-cutting
  rather than absorbing feature-specific business rules
