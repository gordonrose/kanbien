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

## Compliance Classification And Governance

- Data classification: confidential platform metadata with access-control or actor-context relevance
- Privacy / PII relevance: low: no direct personal data identified in the current dictionary page
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Capability Catalog Source Reference is documented as owned by `capabilityContractCatalog` with source record(s) `capability_catalog_source_references`, `CapabilitySourceReferenceData`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify dedicated audit or operational-evidence semantics. |

## Notes

- These rows support drift explanation, provenance review, and future
  frontend-tooling trust decisions.
- Blocked normalization posture is still computed from current source truth; it
  is not stored as a separate durable source-reference row.
