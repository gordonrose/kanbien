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

## Related Errors

- `ENTITY_DEFINITION_VERSION_NOT_FOUND`
  Message: We could not find that entity-definition version.
  Field: `entityDefinitionVersionId`
  Reason: `not_found`
- `ENTITY_DEFINITION_VERSION_NOT_DRAFT`
  Message: Only draft entity-definition versions may be updated.
  Field: `status`
  Reason: `non_draft_version`
