# Entity

## Summary

- Description: Root-managed platform self-definition seed record. Later layers
  may attach deterministic route, relationship, attribute, compliance,
  reporting, and capability instructions to each Entity.
- Owning feature: `entity`
- Primary source tables or records:
  `entities`, `EntityData`
- Status: implemented in the backend MSP slice on 2026-05-24

## Storage Model

- Primary table or durable record: `entities`
- Related durable records: none in the first slice
- Primary key: `entity_id`
- Foreign key relationships: none in the first slice

## Fields

- `entity_id`
  Type / Shape: `UUID`
  Description: Stable system-generated Entity identifier.
  Constraints / Notes: Primary key. Client input is rejected.
- `name`
  Type / Shape: `TEXT`
  Description: Human-readable Entity name.
  Constraints / Notes: Required. Empty strings are rejected.
- `normalized_name`
  Type / Shape: `TEXT`
  Description: Lowercase trimmed value used for uniqueness and prefix search.
  Constraints / Notes: Required. System-maintained.
- `description`
  Type / Shape: `TEXT`
  Description: Durable explanation of what this Entity represents.
  Constraints / Notes: Required. Empty strings are rejected.
- `status`
  Type / Shape: `'draft' | 'active' | 'superseded' | 'archived'`
  Description: Current Entity lifecycle posture.
  Constraints / Notes: Required. Defaults to `draft`.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. System-managed.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time.
  Constraints / Notes: Required. Refreshed on successful mutation.
- `archived_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Archive time when the Entity is removed from normal current work.
  Constraints / Notes: Required to be non-null when `status='archived'` and
  null otherwise.

## Indexes And Constraints

- `entities_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `entity_id`.
- `uq_entities_normalized_name_current`
  Type: `unique`
  Definition / Rule: Unique on `normalized_name` where `archived_at IS NULL`.
- `ix_entities_status`
  Type: `other`
  Definition / Rule: Secondary index on `status`.
- `ix_entities_normalized_name_prefix`
  Type: `other`
  Definition / Rule: Prefix search support for `normalized_name`.
- `ix_entities_created_at`
  Type: `other`
  Definition / Rule: Secondary index on `created_at DESC`.
- `ix_entities_updated_at`
  Type: `other`
  Definition / Rule: Secondary index on `updated_at DESC`.
- `ix_entities_archived_at`
  Type: `other`
  Definition / Rule: Secondary index on `archived_at DESC`.

## Lifecycle Semantics

- `draft`: exists but is not current/default platform truth yet.
- `active`: current/default platform truth for future platform-building layers.
- `superseded`: replaced by a newer current Entity definition path.
- `archived`: retained but removed from ordinary current work.
- Normal exact reads and lists exclude archived records unless the caller asks
  for archived records explicitly.
- The first slice does not include hard delete, pending cleanup, cleanup
  failure, restore, or reactivation behavior.

## Cross-Feature Read Seams

- Exported seam: `createEntityFeature` for route integration only.
  Consumer: `src/routes/v1/index.ts`
  Allowed read shape: Entity API response and list response.

## Compliance Classification And Governance

- Data classification: internal platform metadata
- Privacy / PII relevance: no in the first slice
- Security relevance: high: records are future platform-building instructions
- Audit relevance: yes: create, update, and archive operations write platform
  security audit events
- Retention / cleanup posture: archived records are retained; hard delete and
  cleanup states are deferred until a governed lifecycle model exists
- Export / deletion posture: normal API delete archives only
- Legal hold posture: not explicitly defined in the current source truth
- Operational evidence requirements: migration/repository/API tests plus
  feature dependency graph checks
- Source: `src/features/entity`, `docs/api-contracts/entity.md`, and
  `AGENTS.md` durable data and lifecycle rules

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | runtime and migration | `tests/unit/entity/service.test.ts`; `tests/integration/entity/persistence.test.ts` | Entity is persisted as its own durable record. |
| System-managed identifiers and timestamps | yes | contract and migration | `tests/security/entity/security.test.ts`; `tests/unit/entity/service.test.ts` | Client system-field input is rejected. |
| Normalization, uniqueness, and searchable-storage rules | yes | migration and repository | `tests/integration/entity/persistence.test.ts` | `normalized_name` owns current uniqueness and prefix search. |
| Soft-delete and normal-read visibility | yes | service and repository | `tests/unit/entity/service.test.ts`; `tests/integration/entity/flow.test.ts` | Archive is the first-slice delete posture. |
| Tenant boundary / object-level authorization | yes | root-only route mounting and authz | `tests/security/entity/security.test.ts` | No tenant-scoped access exists in this slice. |
| Retention and cleanup posture | partial | documented deferral | API contract and this dictionary page | Pending cleanup and hard-delete states are out of scope. |
| Auditability and operational evidence | yes | route audit writes and security tests | `tests/security/entity/security.test.ts` | Mutation success events use platform security audit records. |

## Related Errors

- `ENTITY_NOT_FOUND`
  Message: We could not find an entity with that ID.
  Field: `entityId`
  Reason: `not_found`
- `ENTITY_NAME_ALREADY_EXISTS`
  Message: That entity name is already in use by another current entity.
  Field: `name`
  Reason: `duplicate_current_name`
- `ENTITY_ALREADY_ARCHIVED`
  Message: That entity has already been archived.
  Field: `entityId`
  Reason: `already_archived`
