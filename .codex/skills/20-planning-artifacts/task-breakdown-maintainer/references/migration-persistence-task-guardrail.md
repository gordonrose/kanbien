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

## Deep Delivery Standard

- one schema/index/query-semantic change per queued task unless the changes are
  inseparable in one migration invariant
- split live-schema inspection, corrective migration, repository behavior, and
  harness updates when they have different proof targets
- name the exact migration files, live-schema check, representative read/write
  paths, and persistence proof

## Migration / Persistence Approach

Queued migration/persistence tasks must apply the persistence and migration
rules to the specific change before Delivery starts:

- choose one primary change type: live-schema-inspection, new-migration,
  corrective-migration, repository-query-semantics, index-or-constraint,
  normalization-or-uniqueness, postgres-harness-update, or
  not-applicable-with-rationale
- name the live schema check or explain why the task is not live-schema-backed
- state whether applied migration files are untouched, whether a new sortable
  migration is added, or whether a corrective migration is required
- state the SQL execution semantics that must be verified, especially for
  bootstrap, backfill, multi-step visibility, indexes, normalization, and
  uniqueness behavior
- for any migration that transforms or backfills existing rows, state the
  source data shape validation that runs before mutation begins
- for any migration that transforms or backfills existing rows, state the
  per-row eligibility validation that runs before each row is transformed
- state rejected-row behavior: fail atomically, quarantine/report, skip only
  with approved audit posture, or route to a corrective/manual repair path
- name representative read and write paths to re-check after the migration or
  repository change
- state whether shared Postgres harness files or persistence scripts need
  updates, including `tests/harness/postgres/migrations.ts`,
  `tests/harness/postgres/testDatabase.ts`, and package persistence test
  scripts when relevant

Do not satisfy migration/persistence work by only editing migration files. The
task must also say how code, live schema, source data shape, per-row eligibility,
indexes, and representative reads and writes will agree after Delivery. Do not
silently migrate rows that do not match the approved starting shape; fail closed
unless an approved compatibility or manual repair strategy says otherwise.

## Required Check IDs

- `migration-live-schema`
- `migration-source-data-shape`
- `migration-per-row-eligibility`
- `migration-rejected-row-behavior`
- `migration-applied-file-safety`
- `migration-index-normalization`
- `migration-read-write-proof`
- `migration-postgres-harness`
