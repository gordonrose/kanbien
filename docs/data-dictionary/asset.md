# Asset

## Summary

- Description: Durable domain record for one uploaded or managed asset.
- Owning feature: `assets`
- Primary source tables or records: `assets`, `Asset`

## Storage Model

- Primary table or durable record: `assets`
- Related durable records: `asset_upload_intents`
- Primary key: `asset_id`
- Foreign key relationships:
  `asset_upload_intents.asset_id` references `assets.asset_id`.

## Fields

- `asset_id`
  Type / Shape: `UUID`
  Description: Stable system-generated asset identifier.
- `scope_type`, `tenant_id`
  Type / Shape: `TEXT`, `UUID NULL`
  Description: Durable root or tenant ownership boundary. Tenant scope requires
  one tenant id; root scope forbids it.
- `kind`
  Type / Shape: `TEXT`
  Description: Shared asset kind. V1 route policy supports image uploads only.
- `visibility`
  Type / Shape: `TEXT`
  Description: Visibility posture. V1 implemented routes allow private assets
  only.
- `original_filename`
  Type / Shape: `TEXT NULL`
  Description: User-controlled metadata only; never storage path authority.
- `storage_provider`, `storage_key`
  Type / Shape: `TEXT`
  Description: Provider identifier and generated immutable object key.
- `claimed_content_type`, `verified_content_type`
  Type / Shape: `TEXT`, `TEXT NULL`
  Description: Client-claimed allowlist input and verified storage metadata.
- `byte_size`
  Type / Shape: `BIGINT`
  Description: Approved expected object byte size.
- `expected_checksum_sha256`, `observed_checksum_sha256`
  Type / Shape: `TEXT NULL`
  Description: Expected and observed checksum values when supplied or verified.
- `checksum_verification_status`
  Type / Shape: `TEXT`
  Description: `not_provided`, `provider_verified`, `backend_verified`,
  `unavailable`, or `mismatched`.
- `content_verification_status`
  Type / Shape: `TEXT`
  Description: `claimed_only`, `metadata_verified`, `svg_sanitized`, or
  `failed`.
- `lifecycle_status`
  Type / Shape: `TEXT`
  Description: `pending_upload`, `uploaded`, `ready`, `rejected`, or `deleted`.
- `processing_status`
  Type / Shape: `TEXT`
  Description: Future processor state. V1 mostly uses `not_required`.
- `pii_posture`
  Type / Shape: `TEXT`
  Description: Durable data-classification/PII posture. Tenant logos default to
  possible unless a more protective posture is supplied.
- `cleanup_status`, `cleanup_failure_reason`, `cleanup_attempted_at`
  Type / Shape: `TEXT`, `TEXT NULL`, `TIMESTAMPTZ NULL`
  Description: Cleanup lifecycle and retry state for abandoned external bytes.
- `rejection_reason`
  Type / Shape: `TEXT NULL`
  Description: Durable reason a pending upload or SVG verification was rejected.
- `created_by_actor_type`, `created_by_actor_id`
  Type / Shape: `TEXT`
  Description: Actor that created the asset record.
- `created_at`, `updated_at`, `deleted_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: System-managed lifecycle timestamps.

## Indexes And Constraints

- Primary key on `asset_id`.
- Unique immutable `storage_key`.
- Indexes on tenant id, lifecycle/deleted status, visibility, kind, and cleanup
  status.
- Check constraint enforces root versus tenant scope shape.

## Lifecycle Semantics

- Normal reads and content reads require `ready` lifecycle and no `deleted_at`.
- Soft delete preserves metadata and hides the asset from normal consumption.
- Cleanup may reject expired pending assets and remove abandoned object bytes
  without erasing durable metadata.

## Cross-Feature Read Seams

- Exported seam: `AssetsService.validateAssetForSubject`
  Consumer: future tenant branding, page settings, document library, and other
  asset-consuming features.
  Allowed read shape: tenant match, lifecycle readiness, visibility, kind,
  cleanup posture, and contextual accessibility requirements.

## Migration Compatibility Notes

- Rebuild-from-spec must preserve object-storage-backed metadata and must not
  make object metadata the only durable source of facts needed for authz,
  auditability, or compliance tooling.

## Compliance Classification And Governance

- Data classification: confidential security-sensitive data; may include authentication secret material or proof state
- Privacy / PII relevance: yes: identity, contact, or profile-adjacent fields may identify a person
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Asset is documented as owned by `assets` with source record(s) `assets`, `Asset`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | yes | enforced-in-code | Lifecycle and mutation sections in this page; repository/source references cited above | Normal read paths must exclude soft-deleted rows unless an explicit deleted/read capability is documented. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
