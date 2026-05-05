# Entity Definition Attribute Source Link

## Summary

- Description: Ordered dependency row linking a computed attribute to one
  source attribute key in the same version.
- Owning feature: `entityBuilder`
- Primary source tables or records:
  `entity_definition_attribute_source_link`, `EntityDefinitionSourceLinkRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `entity_definition_attribute_source_link`
- Related durable records:
  `entity_definition_attribute`
- Primary key: `entity_definition_attribute_source_link_id`

## Fields

- `source_attribute_key`
  Type / Shape: `TEXT`
  Description: Stable attribute key that the computed attribute depends on.
- `display_order`
  Type / Shape: `INTEGER`
  Description: Ordered dependency position.

## Indexes And Constraints

- `uq_entity_definition_attribute_source_link_key`
  Type: `unique`
  Definition / Rule: Unique on
  `(entity_definition_attribute_id, source_attribute_key)`.
- `uq_entity_definition_attribute_source_link_order`
  Type: `unique`
  Definition / Rule: Unique on `(entity_definition_attribute_id, display_order)`.

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Entity Definition Attribute Source Link is documented as owned by `entityBuilder` with source record(s) `entity_definition_attribute_source_link`, `EntityDefinitionSourceLinkRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify tenant-scoped or permission-sensitive behavior. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify dedicated audit or operational-evidence semantics. |

## Notes

- v1 limits source dependencies to attributes inside the same entity-definition
  version.
- This row stores dependency truth, not a full expression language.
