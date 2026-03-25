# ADR-0009: Separate Authentication From Business Features

- Status: Accepted
- Date: 2026-03-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform needs authentication for `rootUsers` now, but the longer-term
direction includes broader platform authentication and authorization across
tenants, organizations, teams, and entity-scoped permissions. If root-user
authentication is folded directly into `rootUsers`, the platform risks coupling
identity, session, and proof-of-possession logic to one business feature.

## Decision

Implement root-user authentication in a separate `rootAuth` feature.

Current rules:

- `rootUsers` remains the business/domain feature for root-user lifecycle and
  management
- `rootAuth` owns auth principals, password verification, SSH proof,
  challenges, sessions, and auth audit events
- `rootAuth` may read root-user lifecycle state through an explicit narrow seam
  needed for sign-in eligibility
- route protection uses shared session-backed authentication middleware
- authentication context is established separately from later authorization or
  scope evaluation
- authenticated root users may perform explicitly defined root-only
  administrative credential-management actions for other root users
- that root-only administrative exception does not generalize to tenant admins,
  tenant users, or future lower-privilege actors without a separate decision

## Consequences

### Positive

- authentication can be reused as a platform seam for future features
- `rootUsers` does not become responsible for credentials and sessions
- future authorization layers can build on request auth context instead of
  rewriting login flows
- privileged root-user credential recovery and break-glass administration remain
  possible without folding auth ownership into the business feature

### Negative

- there is more initial plumbing between auth and business features
- root-user lifecycle checks must remain coordinated across feature boundaries
- privileged root-only administrative exceptions must be documented clearly so
  future features do not copy them casually

### Neutral / Follow-up

- future ADRs may define role, tenant, and scope authorization on top of the
  authenticated request context
- authentication and authorization remain intentionally separate concerns
- root-only credential-management capabilities require explicit audit events and
  should remain privileged operator behavior rather than normal self-service
  account management
