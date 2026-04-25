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
