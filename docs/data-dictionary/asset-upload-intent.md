# Asset Upload Intent

## Summary

- Description: Short-lived durable authorization record for uploading one
  object under one approved constraint set.
- Owning feature: `assets`
- Primary source tables or records: `asset_upload_intents`,
  `AssetUploadIntent`

## Storage Model

- Primary table or durable record: `asset_upload_intents`
- Related durable records: `assets`
- Primary key: `upload_intent_id`
- Foreign key relationships:
  `asset_upload_intents.asset_id` references `assets.asset_id`.

## Fields

- `upload_intent_id`
  Type / Shape: `UUID`
  Description: Stable system-generated upload-intent identifier.
- `asset_id`
  Type / Shape: `UUID`
  Description: Pending asset created with this intent.
- `status`
  Type / Shape: `TEXT`
  Description: `pending`, `completed`, `expired`, or `rejected`.
- `actor_type`, `actor_id`
  Type / Shape: `TEXT`
  Description: Actor binding for single-use completion.
- `scope_type`, `tenant_id`
  Type / Shape: `TEXT`, `UUID NULL`
  Description: Root or tenant boundary captured at intent creation.
- `storage_key`
  Type / Shape: `TEXT`
  Description: Exact generated immutable storage key approved for this upload.
- `expected_content_type`
  Type / Shape: `TEXT`
  Description: Allowlisted MIME metadata expected at completion.
- `max_byte_size`
  Type / Shape: `BIGINT`
  Description: Approved per-kind maximum byte size for the upload.
- `expected_checksum_sha256`
  Type / Shape: `TEXT NULL`
  Description: Optional checksum expected at completion.
- `expires_at`, `completed_at`, `created_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: System-managed lifecycle timestamps.

## Indexes And Constraints

- Primary key on `upload_intent_id`.
- Unique `storage_key`.
- Indexes on asset id, status/expiry, actor pending lookup, and tenant pending
  lookup.
- Check constraint enforces root versus tenant scope shape.

## Lifecycle Semantics

- Intent TTL is 15 minutes.
- Pending intents are single-use and actor-bound.
- Expired intents cannot become ready later.
- Retry creates a new upload intent and storage key.

## Migration Compatibility Notes

- Applied migration identity is stable at
  `src/features/assets/persistence/migrations/0040_create_assets.sql`.

## Compliance Classification And Governance

- Data classification: confidential asset metadata; asset bytes and visibility posture are governed by the assets feature
- Privacy / PII relevance: yes: sensitive operational metadata may reveal actor or access context
- Security relevance: yes: access control, tenant boundary, authentication, or security-sensitive metadata is present
- Audit relevance: yes: lifecycle, actor attribution, or operational evidence fields are present
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Asset Upload Intent is documented as owned by `assets` with source record(s) `asset_upload_intents`, `AssetUploadIntent`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
