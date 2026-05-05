# Entity Definition

## Summary

- Description: Stable lineage record for one repo-facing entity-definition
  family.
- Owning feature: `entityBuilder`
- Primary source tables or records:
  `entity_definition`, `EntityDefinitionLineageRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `entity_definition`
- Related durable records:
  `entity_definition_version`
- Primary key: `entity_definition_id`
- Foreign key relationships:
  `current_version_id -> entity_definition_version.entity_definition_version_id`

## Fields

- `entity_definition_id`
  Type / Shape: `UUID`
  Description: Stable system-generated lineage identifier.
  Constraints / Notes: Primary key.
- `entity_key`
  Type / Shape: `TEXT`
  Description: Stable external machine key for the logical entity lineage.
  Constraints / Notes: Required and unique. Immutable by contract.
- `entity_name`
  Type / Shape: `TEXT`
  Description: Human-readable name for the entity lineage.
  Constraints / Notes: Required.
- `description`
  Type / Shape: `TEXT`
  Description: Durable repo-facing explanation of the entity lineage.
  Constraints / Notes: Required.
- `current_version_id`
  Type / Shape: `UUID | NULL`
  Description: Exact current active version for default reads and exports.
  Constraints / Notes: Nullable while a lineage only has draft versions.
- `status`
  Type / Shape: `'draft' | 'active' | 'superseded' | 'archived'`
  Description: Current lineage lifecycle posture.
  Constraints / Notes: Required.
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
  Description: Explicit archival time for historical-only lineages.
  Constraints / Notes: Nullable.

## Indexes And Constraints

- `entity_definition_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `entity_definition_id`.
- `uq_entity_definition_entity_key`
  Type: `unique`
  Definition / Rule: Unique on `entity_key`.
- `ix_entity_definition_status`
  Type: `other`
  Definition / Rule: Secondary index on `status`.
- `ix_entity_definition_updated_at`
  Type: `other`
  Definition / Rule: Secondary index on `updated_at DESC`.

## Lifecycle Semantics

- `entity_key` stays stable across versions.
- One lineage may have many immutable versions.
- `current_version_id` points to the active version used by default reads and
  default export scope.
- Archived lineages may still support explicit historical reads and exports.

## Cross-Feature Read Seams

- Exported seam: current read by `entityKey`, exact read by version id, and
  canonical export from `entityBuilder`
  Consumer: downstream planning artifacts and future data-dictionary sync
  Allowed read shape: stable lineage identity plus version and attribute truth

## Compliance Classification And Governance

- Data classification: internal platform metadata
- Privacy / PII relevance: yes: identity, contact, or profile-adjacent fields may identify a person
- Security relevance: moderate: internal platform metadata still requires integrity protection
- Audit relevance: yes: lifecycle, actor attribution, or operational evidence fields are present
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Entity Definition is documented as owned by `entityBuilder` with source record(s) `entity_definition`, `EntityDefinitionLineageRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify tenant-scoped or permission-sensitive behavior. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Related Errors

- `ENTITY_DEFINITION_NOT_FOUND`
  Message: We could not find that entity definition.
  Field: `entityKey`
  Reason: `not_found`
- `ENTITY_DEFINITION_DUPLICATE_KEY`
  Message: That entity key is already in use.
  Field: `entityKey`
  Reason: `duplicate_entity_key`
