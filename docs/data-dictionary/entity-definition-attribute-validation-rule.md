# Entity Definition Attribute Validation Rule

## Summary

- Description: Typed validation-rule row owned by one entity-definition
  attribute.
- Owning feature: `entityBuilder`
- Primary source tables or records:
  `entity_definition_attribute_validation_rule`,
  `EntityDefinitionValidationRuleRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record:
  `entity_definition_attribute_validation_rule`
- Related durable records:
  `entity_definition_attribute`
- Primary key: `entity_definition_attribute_validation_rule_id`

## Fields

- `rule_key`
  Type / Shape:
  `'required' | 'min_length' | 'max_length' | 'pattern' | 'enum_membership' | 'type_format'`
  Description: Approved validation-rule key.
- `rule_argument_type`
  Type / Shape: `'none' | 'string' | 'integer' | 'decimal' | 'boolean'`
  Description: Declared argument type for the rule.
- `rule_argument_string`, `rule_argument_integer`, `rule_argument_decimal`, `rule_argument_boolean`
  Type / Shape: typed nullable columns
  Description: Explicit typed argument storage.
- `error_message`
  Type / Shape: `TEXT | NULL`
  Description: Optional override message.
- `display_order`
  Type / Shape: `INTEGER`
  Description: Stable ordering among validation rules for one attribute.

## Indexes And Constraints

- `uq_entity_definition_attribute_rule_order`
  Type: `unique`
  Definition / Rule: Unique on
  `(entity_definition_attribute_id, rule_key, display_order)`.

## Compliance Classification And Governance

- Data classification: internal platform metadata
- Privacy / PII relevance: low: no direct personal data identified in the current dictionary page
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Entity Definition Attribute Validation Rule is documented as owned by `entityBuilder` with source record(s) `entity_definition_attribute_validation_rule`, `EntityDefinitionValidationRuleRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify tenant-scoped or permission-sensitive behavior. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify dedicated audit or operational-evidence semantics. |

## Notes

- The feature intentionally uses explicit typed columns rather than a generic
  JSON metadata blob for validation-rule arguments.
