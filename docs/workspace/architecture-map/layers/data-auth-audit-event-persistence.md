# Auth Audit-Event Persistence

## Current Status

- `present`

## What This Layer Should Do

- retain durable security-visible auth history
- support incident review, compliance, and sensitive operational tracing
- record both success and failure paths where security meaning exists

## Implemented To Date

- `auth_audit_events` entity
- auth principal, login, SSH, key, session, logout, and bootstrap audit writes
- audit-event data dictionary coverage

## Still Missing / Next Steps

- expand the concept into a generalized platform audit layer
- define broader business and operator audit event strategy
