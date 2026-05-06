# Migration Persistence Task Guardrail

Use for task type: `DEV:migration-persistence`

## Must Preserve

- applied migration file names and paths remain stable
- live schema, code, indexes, normalization, and uniqueness agree
- corrective migrations are preferred over editing applied migrations
- representative read/write paths are rechecked after migration changes
- durable storage shape is authorized by approved source artifacts, not invented
  inside the migration task
- tenant boundary, authz, audit/proof, lifecycle/deletion, retention, cleanup,
  and compliance expectations remain aligned when storage is sensitive

## Approval Evidence

- source authority: PRD, capability row, Technical Steering, ADR, data
  dictionary, permission mapping, API contract, implementation blueprint, or
  standard that approves the storage or persistence change
- live schema or migration inspection
- storage-model decision boundary: whether the task consumes an approved storage
  model or must split the decision before implementation
- migration and rollback/repair posture
- index and normalization proof
- compatibility posture for existing environments, including additive,
  corrective, backfill, compatibility-sensitive, or blocked classification
- tenant/authz/audit/lifecycle proof posture when persisted data is
  permission-sensitive or compliance-relevant
- persistence test command
- shared Postgres harness impact

## Deep Delivery Standard

- one schema/index/query-semantic change per queued task unless the changes are
  inseparable in one migration invariant
- split live-schema inspection, corrective migration, repository behavior, and
  harness updates when they have different proof targets
- name the exact migration files, live-schema check, representative read/write
  paths, and persistence proof
- do not queue a migration task that must choose a durable storage model,
  retention posture, audit sink, grant store, lifecycle/deletion schema, or
  compatibility strategy without an approved source artifact
- do not hide permission mapping, data dictionary, API contract, backend runtime
  consumption, or evidence sweep work inside the migration task

## Migration / Persistence Approach

Queued DEV:migration-persistence tasks must apply the persistence and migration
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
- state compatibility and repair posture for existing environments, including
  how unexpected live data, partially applied state, duplicate or non-normalized
  values, missing tenant context, revoked/expired grants, or lifecycle/deletion
  contradictions are detected before mutation
- name representative read and write paths to re-check after the migration or
  repository change
- for tenant-scoped, root-scoped, permission, grant, audit/proof, support,
  emergency, export/job, lifecycle/deletion, billing, asset, or compliance data,
  state tenant-boundary, cross-tenant denial, revocation/read-after-write,
  retention, and audit/proof verification where applicable
- state whether shared Postgres harness files or persistence scripts need
  updates, including `tests/harness/postgres/migrations.ts`,
  `tests/harness/postgres/testDatabase.ts`, and package persistence test
  scripts when relevant
- fill the `Migration / Persistence Class Contract` with class-specific proof,
  required data/schema coverage, required read/write or harness coverage, and
  split/blocker routing for any documentation or executable-proof debt

Do not satisfy DEV:migration-persistence work by only editing migration files. The
task must also say how code, live schema, source data shape, per-row eligibility,
indexes, and representative reads and writes will agree after Delivery. Do not
silently migrate rows that do not match the approved starting shape; fail closed
unless an approved compatibility or manual repair strategy says otherwise.

Class-specific expectations:

- `live-schema-inspection` must prove current live schema, indexes, and code
  expectations agree or route drift before implementation.
- `new-migration` must prove sortable migration identity, live start-state,
  SQL execution semantics, source data shape, per-row eligibility, rejected-row
  behavior, and representative read/write paths.
- `corrective-migration` must prove the defect or drift source, live
  start-state, eligibility/rejected-row handling, repair compatibility, and
  representative read/write paths after correction.
- `repository-query-semantics` must prove query/filter/sort/tenant or
  lifecycle semantics without hiding schema/index work.
- `index-or-constraint` must prove index or constraint behavior, uniqueness or
  lookup semantics, representative read/write paths, and compatibility with
  existing data.
- `normalization-or-uniqueness` must prove normalization rules, unique
  normalized values, duplicate/corrupt data handling, and representative
  create/update/read behavior.
- `postgres-harness-update` must prove the shared Postgres harness/script
  change and the representative persistence tests that consume it.
- `not-applicable-with-rationale` must explain why a non-migration task carries
  no migration/persistence implementation proof.

## Storage Decision And Split Rules

DEV:migration-persistence implements an approved persistence change. It must
not decide the durable storage model itself.

Split or block when:

- the task must choose whether to extend an existing table, create a new table,
  create a new audit/proof sink, reuse `auth_audit_events`, model tenant grants,
  split lifecycle from deletion posture, or introduce searchable storage; route
  the decision to `GOV:architecture-update`, `DOC:data-dictionary`, or the
  owning planning artifact first
- new or changed entity fields, durable facts, lifecycle states, retention,
  cleanup, PII posture, data classification, or compliance-friendly dictionary
  rows are needed; create `DOC:data-dictionary`
- capability keys, grants, permission rows, authority world, grant-source
  posture, UI eligibility, denial categories, or audit/proof visibility are
  needed; create `DOC:permission-mapping`
- route contract behavior, request/response/error shape, OpenAPI, or Postman
  truth changes; create `DOC:api-contract`
- runtime behavior must consume the new storage; create the owning
  `DEV:backend`, `DEV:platform-seam`, or `DEV:vertical-slice` task
- evidence capture or post-implementation sweep is the main work; create
  `EVIDENCE:qa-evidence`

## Sensitive Storage Proof

For grants, role assignments, tenant context, lifecycle/deletion posture,
audit/proof events, support/emergency actions, exports/jobs, billing, assets, or
other sensitive persisted data, the task must name focused proof for:

- tenant scoping and cross-tenant denial at the repository or route path that
  consumes the storage
- revocation, expiration, soft-delete, lifecycle, or deletion-posture behavior
  when those fields affect authorization or visibility
- normalized uniqueness and index behavior on the durable facts actually used
  by the domain
- audit/proof retention and visibility posture when writing security or
  compliance evidence
- representative read-after-write and denied-read paths after migration
- safe handling of manually corrupted, duplicate, orphaned, or non-compliant
  live data before mutation

## Worked Examples

| Scenario | Change Class | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| A new nullable column is approved and existing rows require no backfill. | `new-migration` | Name sortable migration, live start-state check, SQL semantics, representative read/write path, index posture, and persistence test command. | API/data dictionary/backend consumption split unless already approved and in scope. |
| Existing environments may contain duplicate normalized values before adding a uniqueness constraint. | `normalization-or-uniqueness` plus `index-or-constraint` | Inspect source data shape, per-row eligibility, duplicate/rejected-row behavior, compatibility repair path, and create/update/read proof. | Do not silently pick skip/quarantine behavior without approved repair posture. |
| Repository filtering must exclude soft-deleted rows without schema changes. | `repository-query-semantics` | Inventory repository query, lifecycle source truth, representative read paths, tenant/security proof, and no-migration rationale. | Data dictionary lifecycle wording and API list contract updates split to `DOC:*` tasks. |
| Shared Postgres test harness migration loading needs a compatibility fix. | `postgres-harness-update` | Name harness files, affected persistence scripts, representative consuming tests, and expected harness output. | Production migrations or repository behavior remain out of scope unless separately approved. |

## Required Check IDs

- `migration-source-authority`
- `migration-change-class`
- `migration-live-schema`
- `migration-storage-decision-boundary`
- `migration-source-data-shape`
- `migration-per-row-eligibility`
- `migration-rejected-row-behavior`
- `migration-compatibility-repair`
- `migration-applied-file-safety`
- `migration-index-normalization-uniqueness`
- `migration-security-tenant-proof`
- `migration-read-write-proof`
- `migration-postgres-harness`
