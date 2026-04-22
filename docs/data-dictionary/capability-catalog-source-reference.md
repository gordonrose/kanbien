# Capability Catalog Source Reference

## Summary

- Description: Durable source-of-truth linkage row showing which approved
  artifact contributed to one capability-catalog record.
- Owning feature: `capabilityContractCatalog`
- Primary source tables or records:
  `capability_catalog_source_references`, `CapabilitySourceReferenceData`

## Storage Model

- Primary table or durable record: `capability_catalog_source_references`
- Related durable records: `capability_catalog_records`
- Primary key: `capability_catalog_source_reference_id`
- Foreign key relationships:
  `capability_catalog_source_references.capability_id` references
  `capability_catalog_records.capability_id`

## Fields

- `capability_catalog_source_reference_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one source-reference row.
- `capability_id`
  Type / Shape: `TEXT`
  Description: Owning capability logical identifier.
- `source_type`
  Type / Shape: `TEXT`
  Description: Source family such as `feature-contract`, `api-contract-doc`,
  `permission-mapping`, or `feature-manifest`.
- `source_path`
  Type / Shape: `TEXT`
  Description: Repo-relative source artifact path used during normalization.
- `source_coverage`
  Type / Shape: `TEXT | NULL`
  Description: Optional coverage detail when the source contributes only part
  of the normalized truth.

## Indexes And Constraints

- `capability_catalog_source_references_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `capability_catalog_source_reference_id`.
- unique source reference per capability
  Type: `unique`
  Definition / Rule: Unique on `capability_id`, `source_type`, `source_path`.
  Why It Matters: Prevents duplicate provenance rows after repeated
  materialization.
- `capability_catalog_source_references.capability_id -> capability_catalog_records.capability_id`
  Type: `foreign key`
  Definition / Rule: Source-reference rows belong only to existing capability
  records.

## Notes

- These rows support drift explanation, provenance review, and future
  frontend-tooling trust decisions.
- Blocked normalization posture is still computed from current source truth; it
  is not stored as a separate durable source-reference row.
