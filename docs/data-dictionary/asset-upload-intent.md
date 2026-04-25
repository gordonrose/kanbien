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
