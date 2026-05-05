# Entity Definition Version

## Summary

- Description: Immutable version snapshot under one stable entity-definition
  lineage.
- Owning feature: `entityBuilder`
- Primary source tables or records:
  `entity_definition_version`, `EntityDefinitionVersionRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `entity_definition_version`
- Related durable records:
  `entity_definition`, `entity_definition_attribute`
- Primary key: `entity_definition_version_id`
- Foreign key relationships:
  `entity_definition_id -> entity_definition.entity_definition_id`
  `supersedes_version_id -> entity_definition_version.entity_definition_version_id`

## Fields

- `entity_definition_version_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one version snapshot.
  Constraints / Notes: Primary key.
- `entity_definition_id`
  Type / Shape: `UUID`
  Description: Owning entity-definition lineage id.
  Constraints / Notes: Required foreign key.
- `version_number`
  Type / Shape: `INTEGER`
  Description: Monotonic version number within one lineage.
  Constraints / Notes: Required and positive.
- `status`
  Type / Shape: `'draft' | 'active' | 'superseded' | 'archived'`
  Description: Exact lifecycle state for this version snapshot.
  Constraints / Notes: Required.
- `supersedes_version_id`
  Type / Shape: `UUID | NULL`
  Description: Optional exact version id that this snapshot replaces.
  Constraints / Notes: Nullable for first version in a lineage.
- `created_at`, `updated_at`, `activated_at`, `superseded_at`, `archived_at`
  Type / Shape: `TIMESTAMPTZ` variants
  Description: Version lifecycle timestamps.
  Constraints / Notes: `created_at` and `updated_at` required.

## Indexes And Constraints

- `entity_definition_version_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `entity_definition_version_id`.
- `uq_entity_definition_version_lineage_version`
  Type: `unique`
  Definition / Rule: Unique on `(entity_definition_id, version_number)`.
- `uq_entity_definition_active_version_per_lineage`
  Type: `unique partial`
  Definition / Rule: One active version per lineage.

## Lifecycle Semantics

- New content lands as a new version rather than mutating stable keys.
- Draft versions may be updated.
- Active versions become the lineage’s default exportable truth.
- Superseded and archived versions remain historically readable by exact id.

## Compliance Classification And Governance

- Data classification: internal platform metadata
- Privacy / PII relevance: low: no direct personal data identified in the current dictionary page
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Entity Definition Version is documented as owned by `entityBuilder` with source record(s) `entity_definition_version`, `EntityDefinitionVersionRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify tenant-scoped or permission-sensitive behavior. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Related Errors

- `ENTITY_DEFINITION_VERSION_NOT_FOUND`
  Message: We could not find that entity-definition version.
  Field: `entityDefinitionVersionId`
  Reason: `not_found`
- `ENTITY_DEFINITION_VERSION_NOT_DRAFT`
  Message: Only draft entity-definition versions may be updated.
  Field: `status`
  Reason: `non_draft_version`
