# Capability Catalog Field

## Summary

- Description: Durable normalized request or response field row owned by one
  capability-catalog record.
- Owning feature: `capabilityContractCatalog`
- Primary source tables or records:
  `capability_catalog_fields`, `CapabilityFieldData`

## Storage Model

- Primary table or durable record: `capability_catalog_fields`
- Related durable records: `capability_catalog_records`
- Primary key: `capability_catalog_field_id`
- Foreign key relationships:
  `capability_catalog_fields.capability_id` references
  `capability_catalog_records.capability_id`

## Fields

- `capability_catalog_field_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one normalized field row.
- `capability_id`
  Type / Shape: `TEXT`
  Description: Owning capability logical identifier.
- `contract_side`
  Type / Shape: `TEXT`
  Description: Partition of the field within the contract.
  Constraints / Notes: Current values are `request-param`, `request-query`,
  `request-body`, and `response-body`.
- `path`
  Type / Shape: `TEXT`
  Description: Stable normalized field path such as `params.emailId` or
  `response.items[].status`.
- `display_label`, `description`
  Type / Shape: `TEXT | NULL`
  Description: Human-facing field metadata when source truth provides it.
- `field_type`
  Type / Shape: `TEXT`
  Description: Normalized type such as `string`, `number`, `enum`, or `object`.
- `required`, `nullable`, `repeated`, `system_managed`
  Type / Shape: `BOOLEAN`
  Description: Structural contract posture for the field.
- `format`
  Type / Shape: `TEXT | NULL`
  Description: Optional wire-level format such as `uuid` or `date-time`.
- `enum_values`
  Type / Shape: `TEXT[]`
  Description: Bounded enum members when derivable.
- `normalization_steps`
  Type / Shape: `TEXT[]`
  Description: Frontend-visible normalization hints such as `trim` or
  `trim-lowercase`.
- `binding_hints`
  Type / Shape: `TEXT[]`
  Description: Suggested frontend binding roles such as `input`, `display`,
  `filter`, or `identifier`.
- `validation`
  Type / Shape: `JSONB | NULL`
  Description: Field-level validation metadata when the source normalizer can
  represent it honestly.
- `display_order`
  Type / Shape: `INTEGER`
  Description: Deterministic ordering within the owning contract side.

## Indexes And Constraints

- `capability_catalog_fields_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `capability_catalog_field_id`.
- unique field identity within one capability side
  Type: `unique`
  Definition / Rule: Unique on `capability_id`, `contract_side`, `path`.
  Why It Matters: Prevents duplicate normalized field rows during
  rematerialization.
- `capability_catalog_fields.capability_id -> capability_catalog_records.capability_id`
  Type: `foreign key`
  Definition / Rule: Field rows belong only to existing capability records.

## Mutation Semantics

- Field rows are rewritten during materialization from normalized source truth.
- Unsupported or non-normalizable field-validation shapes remain explicitly
  absent rather than being fabricated into misleading frontend rules.

## Compliance Classification And Governance

- Data classification: confidential business and identity data; may include personal data or operator/customer contact data
- Privacy / PII relevance: yes: identity, contact, or profile-adjacent fields may identify a person
- Security relevance: yes: access control, tenant boundary, authentication, or security-sensitive metadata is present
- Audit relevance: limited: no dedicated audit semantics identified beyond normal maintained artifact review
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Capability Catalog Field is documented as owned by `capabilityContractCatalog` with source record(s) `capability_catalog_fields`, `CapabilityFieldData`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify dedicated audit or operational-evidence semantics. |
