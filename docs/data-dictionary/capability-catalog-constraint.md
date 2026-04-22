# Capability Catalog Constraint

## Summary

- Description: Durable normalized cross-field or capability-level constraint row
  owned by one capability-catalog record.
- Owning feature: `capabilityContractCatalog`
- Primary source tables or records:
  `capability_catalog_constraints`, `CapabilityConstraintData`

## Storage Model

- Primary table or durable record: `capability_catalog_constraints`
- Related durable records: `capability_catalog_records`
- Primary key: `capability_catalog_constraint_id`
- Foreign key relationships:
  `capability_catalog_constraints.capability_id` references
  `capability_catalog_records.capability_id`

## Fields

- `capability_catalog_constraint_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one normalized
  capability-level constraint row.
- `capability_id`
  Type / Shape: `TEXT`
  Description: Owning capability logical identifier.
- `constraint_kind`
  Type / Shape: `TEXT`
  Description: Normalized rule family such as `at-least-one`.
- `field_paths`
  Type / Shape: `TEXT[]`
  Description: Related normalized field paths involved in the rule.
- `message`
  Type / Shape: `TEXT`
  Description: Human-facing explanation of the rule.
- `display_order`
  Type / Shape: `INTEGER`
  Description: Deterministic ordering within the owning capability.

## Indexes And Constraints

- `capability_catalog_constraints_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `capability_catalog_constraint_id`.
- `capability_catalog_constraints.capability_id -> capability_catalog_records.capability_id`
  Type: `foreign key`
  Definition / Rule: Constraint rows belong only to existing capability
  records.

## Mutation Semantics

- Constraint rows are materialized from approved normalized source truth rather
  than hand-authored independently.
- Stable export hashing ignores randomized constraint UUIDs and instead relies
  on deterministic constraint content.
