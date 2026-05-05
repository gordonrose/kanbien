# Entity Definition Attribute

## Summary

- Description: Version-owned attribute truth for one entity-definition version.
- Owning feature: `entityBuilder`
- Primary source tables or records:
  `entity_definition_attribute`, `EntityDefinitionAttributeRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `entity_definition_attribute`
- Related durable records:
  `entity_definition_version`,
  `entity_definition_attribute_validation_rule`,
  `entity_definition_attribute_option`,
  `entity_definition_attribute_source_link`
- Primary key: `entity_definition_attribute_id`
- Foreign key relationships:
  `entity_definition_version_id -> entity_definition_version.entity_definition_version_id`

## Fields

- `attribute_key`
  Type / Shape: `TEXT`
  Description: Stable external attribute identity within the entity lineage.
  Constraints / Notes: Required and unique within a version.
- `attribute_kind`
  Type / Shape: `'persisted' | 'computed'`
  Description: Whether the value is directly persisted or derived.
- `attribute_type`
  Type / Shape:
  `'string' | 'text' | 'boolean' | 'integer' | 'decimal' | 'uuid' | 'email' | 'url' | 'date' | 'datetime' | 'enum' | 'coordinates'`
  Description: Declared logical value type.
- `value_cardinality`
  Type / Shape: `'single' | 'multiple'`
  Description: Whether one or many values are allowed.
- `label`, `description`
  Type / Shape: `TEXT`
  Description: Required durable attribute meaning and display identity.
- `help_text`, `placeholder_text`
  Type / Shape: `TEXT | NULL`
  Description: Optional form-facing guidance fields.
- `form_facing`
  Type / Shape: `BOOLEAN`
  Description: Whether the attribute may surface in governed forms.
- `default_form_pattern_key`
  Type / Shape: `TEXT | NULL`
  Description: Approved design-system pattern key for default form treatment.
- `options_mode`
  Type / Shape: `'none' | 'inline' | 'catalog_reference'`
  Description: Bounded option-truth posture for enum or select-like fields.
- `options_catalog_key`
  Type / Shape: `TEXT | NULL`
  Description: Stable reference to a separately maintained options catalog.
- `derivation_note`
  Type / Shape: `TEXT | NULL`
  Description: Human-readable explanation of computed derivation.
- `display_order`
  Type / Shape: `INTEGER`
  Description: Stable attribute ordering inside one version.

## Indexes And Constraints

- `uq_entity_definition_attribute_version_key`
  Type: `unique`
  Definition / Rule: Unique on `(entity_definition_version_id, attribute_key)`.
- `uq_entity_definition_attribute_version_display_order`
  Type: `unique`
  Definition / Rule: Unique on `(entity_definition_version_id, display_order)`.
- `ck_entity_definition_attribute_form_pattern_required`
  Type: `check`
  Definition / Rule: Form-facing attributes require a default form pattern;
  non-form-facing attributes may not carry one.
- `ck_entity_definition_attribute_computed_derivation`
  Type: `check`
  Definition / Rule: Computed attributes require `derivation_note`.

## Mutation Semantics

- Attributes belong to one immutable version snapshot.
- Changing attribute truth in practice means creating a new version or updating
- a draft version before activation.
- Form-facing truth is stored as part of the attribute contract rather than in
  a detached metadata blob.

## Compliance Classification And Governance

- Data classification: confidential business and identity data; may include personal data or operator/customer contact data
- Privacy / PII relevance: yes: identity, contact, or profile-adjacent fields may identify a person
- Security relevance: moderate: internal platform metadata still requires integrity protection
- Audit relevance: limited: no dedicated audit semantics identified beyond normal maintained artifact review
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Entity Definition Attribute is documented as owned by `entityBuilder` with source record(s) `entity_definition_attribute`, `EntityDefinitionAttributeRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify tenant-scoped or permission-sensitive behavior. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify dedicated audit or operational-evidence semantics. |

## Related Errors

- `ENTITY_ATTRIBUTE_DUPLICATE_KEY`
  Message: That attribute key is already in use in this version.
  Field: `attributeKey`
  Reason: `duplicate_attribute_key`
- `ENTITY_ATTRIBUTE_INVALID_SHAPE`
  Message: That attribute shape is not valid for the declared entity-definition contract.
  Field: shape-specific
  Reason: validation specific
