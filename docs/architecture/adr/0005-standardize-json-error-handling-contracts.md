# ADR-0005: Standardize JSON Error Handling Contracts

- Status: Accepted
- Date: 2026-03-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform serves JSON APIs and needs predictable error behavior for clients.
Feature code also needs a safe way to express known domain failures without
forcing all unexpected failures to be handled locally.

## Decision

Use a two-level JSON error handling model:

- features may translate known feature errors into structured JSON responses
- unexpected errors should propagate to app-level fallback middleware

The app-level fallback middleware must return a generic JSON internal error
response rather than Express's default HTML error page.

## Consequences

### Positive

- clients receive consistent JSON responses for both known and unknown failures
- features retain local control over domain-specific error mapping
- the platform preserves a safe fallback for unexpected failures

### Negative

- error handling logic exists in more than one layer
- inconsistent feature-local contracts could still emerge if not reviewed

### Neutral / Follow-up

- the longer-term goal should be to keep error payload shape consistent across
  features
- a future ADR may consolidate more of the error contract into shared platform
  middleware or helpers
