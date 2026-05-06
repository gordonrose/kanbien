# Data Dictionary Task Guardrail

Use for task type: `DOC:data-dictionary`

## Must Preserve

- durable entity facts, normalized fields, lifecycle fields, soft-delete
  posture, uniqueness, indexes, and retention behavior
- source-independent persistence truth stays aligned with migrations and code
- compliance classification, privacy/security/audit relevance, and
  enforcement/test traceability are recorded honestly

## Approval Evidence

- entity or table affected
- source files and migrations reviewed
- field/index/lifecycle changes
- classification, retention, cleanup, and compliance trace posture
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
- compliance classification, privacy/security/audit relevance, retention,
  export/delete, legal-hold, operational-evidence, and enforcement trace rows
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
- data classification plus privacy, security, audit, retention, cleanup,
  export/delete, legal-hold, and operational-evidence posture
- applicable repo standards and adopted external controls, whether each is
  enforced in code, schema, tests, maintained artifacts, manual review, planned
  work, blocked work, or not-applicable with rationale, and which evidence or
  test case covers that posture
- enforcement evidence that points to concrete schema, migration, repository,
  domain, contract, maintained artifact, command, or test-case evidence instead
  of saying only that the data was reviewed
- test case IDs, executable test paths, migration/schema proof, validator/gate
  commands, review evidence, planned/blocked posture, or explicit
  missing/not-applicable markers
- `npm run data:compliance-health` output after the update, or an explicit
  rationale when the task is intentionally limited to a local draft
- when `npm run data:compliance-health` reports retention/export/delete,
  legal-hold, or `manual-review-required` rows, the debt health summary must
  say whether that review debt was resolved in scope, split to a follow-up
  task, accepted with a named data/standards/governance owner, or blocked
- compatibility posture: docs-only alignment, no schema change, additive,
  compatibility-sensitive, or blocked pending migration/approval
- validation command, docs-alignment review workflow, or explicit blocked reason

The task packet must also fill the `Data Dictionary Contract` table. Leave
runtime, schema, API, permission, and executable proof work out of the
`DOC:data-dictionary` task and route each to its owning task type.

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
- compliance/enforcement trace exposes missing runtime, schema, or test
  enforcement that must be fixed before delivery
- standards/control trace exposes a standards assessment or durable standards
  authority change that belongs to `DOC:standards-compliance` or
  `GOV:standards-update`
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

## Worked Examples

| Scenario | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- |
| A migration-backed field already exists and the dictionary lacks normalized value, index, and lifecycle truth. | Inventory migration, repository, domain/contract sources, live/schema evidence when available, exact dictionary target, compatibility posture, and `npm run data:compliance-health`. | Do not change schema, repository behavior, or API wording inside the dictionary task. |
| Retention/export/delete/legal-hold posture is missing for an entity that stores durable domain facts. | Record current known posture, standards/control trace, missing/blocked rows, evidence gaps, and follow-up owner. | If retention or legal-hold policy is undecided, route to architecture/standards before implementation. |
| Data compliance health reports retention/export/delete/legal-hold or `manual-review-required` rows after a docs-only alignment. | Use the health output as a summary row, record whether review debt was resolved in scope, split, accepted with a named data/standards/governance owner, or blocked, and keep validation evidence attached to the dictionary artifact. | Do not mark review debt as `none`; policy judgment remains human-reviewed until standards or governance authority approves it. |
| Data compliance health reports other debt after a docs-only alignment. | Use the health output as a summary row, record whether debt is accepted, blocked, or routed, and keep validation evidence attached to the dictionary artifact. | Do not add broad fail-on-debt behavior until current debt has approved cleanup or exception posture. |
| Live schema and migration files disagree. | Block dictionary promotion until the approved source of truth is identified; record source inventory and split to migration/persistence or architecture as needed. | Do not rewrite dictionary truth to match accidental live drift. |

## Required Check IDs

- `data-entity-table`
- `data-source-reviewed`
- `data-field-index-lifecycle`
- `data-durable-facts`
- `data-classification-compliance`
- `data-standards-control-trace`
- `data-enforcement-trace`
- `data-enforcement-evidence`
- `data-test-evidence-trace`
- `data-split-routing`
- `data-compliance-health`
- `data-retention-review-disposition`
- `data-validation-proof`
