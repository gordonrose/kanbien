# Migration Persistence Task Guardrail

Use for task type: `migration/persistence`

## Must Preserve

- applied migration file names and paths remain stable
- live schema, code, indexes, normalization, and uniqueness agree
- corrective migrations are preferred over editing applied migrations
- representative read/write paths are rechecked after migration changes

## Approval Evidence

- live schema or migration inspection
- migration and rollback/repair posture
- index and normalization proof
- persistence test command
- shared Postgres harness impact

## Required Check IDs

- `migration-live-schema`
- `migration-applied-file-safety`
- `migration-index-normalization`
- `migration-read-write-proof`
- `migration-postgres-harness`
