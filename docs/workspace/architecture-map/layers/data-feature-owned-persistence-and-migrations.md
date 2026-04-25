# Feature-Owned Persistence And Migrations

## Current Status

- `present`

## What This Layer Should Do

- let features own their durable schema and migration history
- keep persistence change boundaries explicit
- support controlled schema evolution and rebuild from spec

## Implemented To Date

- feature-scoped migrations under `src/features/*/persistence/migrations/`
- shared migration runner
- repository seams and PostgreSQL adapters
- documented migration path-identity rules
- asset foundation v1 adds `assets` and `asset_upload_intents` as
  feature-owned durable tables with storage metadata, lifecycle, cleanup, and
  PII posture recorded in Postgres rather than object metadata alone

## Still Missing / Next Steps

- prove the pattern across more features and more complex schema evolution
- add stronger recovery and disaster tooling around persistence
- complete persistence-backed asset tests against the shared Postgres harness
