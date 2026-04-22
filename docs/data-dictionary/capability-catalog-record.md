# Capability Catalog Record

## Summary

- Description: Durable normalized capability-registry row for one backend
  capability.
- Owning feature: `capabilityContractCatalog`
- Primary source tables or records:
  `capability_catalog_records`, `CapabilityRecordData`

## Storage Model

- Primary table or durable record: `capability_catalog_records`
- Related durable records:
  `capability_catalog_fields`, `capability_catalog_constraints`,
  `capability_catalog_source_references`
- Primary key: `capability_catalog_record_id`
- Foreign key relationships:
  referenced by child capability-field, constraint, and source-reference rows
  through `capability_id`

## Fields

- `capability_catalog_record_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one persisted catalog row.
- `capability_id`
  Type / Shape: `TEXT`
  Description: Stable feature-qualified logical capability identifier such as
  `notificationDelivery.resendEmail`.
  Constraints / Notes: Unique durable identity for materialization refreshes.
- `feature_name`
  Type / Shape: `TEXT`
  Description: Owning feature name for the cataloged capability.
- `display_label`
  Type / Shape: `TEXT`
  Description: User-facing label for picker and inspector views.
- `short_description`
  Type / Shape: `TEXT`
  Description: Picker-friendly summary of the capability.
- `full_description`, `user_facing_outcome`
  Type / Shape: `TEXT | NULL`
  Description: Longer human-facing meaning and expected operator-facing outcome
  when source truth can provide them honestly.
- `route_family`, `seam_type`, `capability_boundary`, `selection_group`
  Type / Shape: `TEXT`
  Description: Grouping and governance metadata for browse, filtering, and
  boundary-aware consumers.
- `http_method`, `route_path`
  Type / Shape: `TEXT | NULL`
  Description: Transport metadata for HTTP-backed capabilities.
- `governing_authz_capabilities`
  Type / Shape: `TEXT[]`
  Description: Canonical backend authz capability keys that govern use of this
  capability.
- `allowed_roles`
  Type / Shape: `TEXT[]`
  Description: Derived role view for frontend mirroring and operator browsing.
- `supports_request_body`, `supports_response_fields`, `supports_filters`
  Type / Shape: `BOOLEAN`
  Description: Capability-shape hints for picker and builder consumers.
- `lifecycle_status`
  Type / Shape: `TEXT`
  Description: Current catalog lifecycle posture such as `active`.
- `normalized_hash`
  Type / Shape: `TEXT`
  Description: Deterministic hash of the normalized capability truth used for
  drift comparison.
- `last_materialized_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful materialization timestamp for this row.
- `created_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Durable row lifecycle timestamps.

## Indexes And Constraints

- `capability_catalog_records_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `capability_catalog_record_id`.
- unique capability identity
  Type: `unique`
  Definition / Rule: Unique on `capability_id`.
  Why It Matters: Materialization refresh must preserve stable logical identity.
- `capability_catalog_records_feature_name_idx`
  Type: `other`
  Definition / Rule: Secondary index on `feature_name`, `capability_id`.
- `capability_catalog_records_route_family_idx`
  Type: `other`
  Definition / Rule: Secondary index on `route_family`.
- `capability_catalog_records_selection_group_idx`
  Type: `other`
  Definition / Rule: Secondary index on `selection_group`.

## Mutation Semantics

- Mutation rule: materialization inserts or replaces rows by stable
  `capability_id`.
  Effect on stored fields: persisted rows stay aligned to normalized source
  truth without changing logical capability identity.
- Mutation rule: drift audit is read-only.
  Effect on stored fields: drift posture is computed from current persisted and
  source truth rather than stored as a mutable write-back flag.

## Compatibility Notes

- The stable logical `capability_id` matters more than the surrogate UUID for
  downstream builder tooling and export compatibility.
- Governing authz capability keys are canonical; `allowed_roles` is a derived
  convenience view and may change as role mappings evolve.
