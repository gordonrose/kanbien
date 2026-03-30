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

## Still Missing / Next Steps

- prove the pattern across more features and more complex schema evolution
- add stronger recovery and disaster tooling around persistence
