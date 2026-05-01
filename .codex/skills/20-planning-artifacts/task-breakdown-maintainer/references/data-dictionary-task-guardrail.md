# Data Dictionary Task Guardrail

Use for task type: `DOC:data-dictionary`

## Must Preserve

- durable entity facts, normalized fields, lifecycle fields, soft-delete
  posture, uniqueness, indexes, and retention behavior
- source-independent persistence truth stays aligned with migrations and code

## Approval Evidence

- entity or table affected
- source files and migrations reviewed
- field/index/lifecycle changes
- validation or docs-alignment proof

## Deep Delivery Standard

- one entity, durable fact group, lifecycle rule, or index/searchability
  decision per queued task
- split data dictionary refresh from migration or repository implementation
  when the source-truth review and code change have distinct proof
- name the exact entity docs, migrations, repositories, and validation proof

## Ownership Boundary

`DOC:data-dictionary` owns source-independent durable data truth. It may create
or update:

- entity data dictionary docs under `docs/data-dictionary/`
- field, normalized-value, index, uniqueness, lifecycle, retention, soft-delete,
  and searchable-storage notes when maintained as documentation artifacts
- compatibility notes for durable entity facts and schema-facing behavior
- task packet evidence that traces durable data expectations back to approved
  source truth

It does not implement persistence behavior. Schema changes, migrations,
repository/query behavior, domain normalization, API request/response wording,
permission mapping, and executable tests must split into the owning task type.

## Required Packet Evidence

Before queueing, the task packet should name:

- entity, table, projection, or durable fact group affected
- exact data dictionary artifact path and source files reviewed
- current migrations, live schema or schema snapshot, repositories, indexes, and
  domain/contract sources used as truth
- field semantics, normalized values, lifecycle fields, soft-delete posture,
  uniqueness, searchable-storage model, retention, and durable fact behavior
- compatibility posture: docs-only alignment, no schema change, additive,
  compatibility-sensitive, or blocked pending migration/approval
- validation command, docs-alignment review workflow, or explicit blocked reason

## Split Conditions

Split or block the task when:

- schema, migration, index, uniqueness, lifecycle, or live data repair work must
  change
- repository/query behavior, domain normalization, or persistence adapters must
  change
- API request/response, validation, pagination, sorting, or system-managed field
  wording must change
- permission mappings, grants, deny rules, or tenant-boundary behavior must
  change
- executable persistence, migration, API, or regression tests are missing or
  newly required
- live schema and source files disagree and the correct source of truth is not
  approved

## Related Task Boundaries

- Schema, migration, index, and live-data repair work belongs to
  `DEV:migration-persistence`.
- Repository, domain normalization, or feature persistence behavior belongs to
  `DEV:backend` or `DEV:vertical-slice`, depending on the approved seam.
- Route contract wording belongs to `DOC:api-contract` when the data shape is
  API-visible.
- Permission-sensitive entity access belongs to `DOC:permission-mapping` for
  mapping truth and the relevant implementation or test task for enforcement.
- Executable persistence, migration, or regression coverage belongs to
  `TEST:test-only` when no product behavior is changing.

## Required Check IDs

- `data-entity-table`
- `data-source-reviewed`
- `data-field-index-lifecycle`
- `data-durable-facts`
- `data-validation-proof`
