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
