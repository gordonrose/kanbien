CREATE TABLE IF NOT EXISTS assets (
  asset_id UUID PRIMARY KEY,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('root', 'tenant')),
  tenant_id UUID NULL,
  kind TEXT NOT NULL CHECK (kind IN ('image', 'video', 'audio', 'document', 'other')),
  visibility TEXT NOT NULL CHECK (visibility IN ('private', 'public')),
  original_filename TEXT NULL,
  storage_provider TEXT NOT NULL,
  storage_key TEXT NOT NULL UNIQUE,
  claimed_content_type TEXT NOT NULL,
  verified_content_type TEXT NULL,
  byte_size BIGINT NOT NULL CHECK (byte_size > 0),
  expected_checksum_sha256 TEXT NULL,
  observed_checksum_sha256 TEXT NULL,
  checksum_verification_status TEXT NOT NULL CHECK (
    checksum_verification_status IN (
      'not_provided',
      'provider_verified',
      'backend_verified',
      'unavailable',
      'mismatched'
    )
  ),
  content_verification_status TEXT NOT NULL CHECK (
    content_verification_status IN (
      'claimed_only',
      'metadata_verified',
      'svg_sanitized',
      'failed'
    )
  ),
  lifecycle_status TEXT NOT NULL CHECK (
    lifecycle_status IN ('pending_upload', 'uploaded', 'ready', 'rejected', 'deleted')
  ),
  processing_status TEXT NOT NULL CHECK (
    processing_status IN ('not_required', 'pending', 'processing', 'ready', 'failed', 'rejected')
  ),
  pii_posture TEXT NOT NULL CHECK (pii_posture IN ('unknown', 'none', 'possible', 'contains')),
  cleanup_status TEXT NOT NULL CHECK (
    cleanup_status IN ('not_required', 'pending', 'deleted', 'object_missing', 'failed_retryable')
  ),
  cleanup_failure_reason TEXT NULL,
  cleanup_attempted_at TIMESTAMPTZ NULL,
  rejection_reason TEXT NULL,
  created_by_actor_type TEXT NOT NULL,
  created_by_actor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT assets_tenant_scope_check CHECK (
    (scope_type = 'tenant' AND tenant_id IS NOT NULL)
    OR (scope_type = 'root' AND tenant_id IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_assets_tenant_id ON assets (tenant_id);
CREATE INDEX IF NOT EXISTS idx_assets_lifecycle_deleted ON assets (lifecycle_status, deleted_at);
CREATE INDEX IF NOT EXISTS idx_assets_visibility ON assets (visibility);
CREATE INDEX IF NOT EXISTS idx_assets_kind ON assets (kind);
CREATE INDEX IF NOT EXISTS idx_assets_cleanup_status ON assets (cleanup_status);

CREATE TABLE IF NOT EXISTS asset_upload_intents (
  upload_intent_id UUID PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES assets(asset_id),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'expired', 'rejected')),
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('root', 'tenant')),
  tenant_id UUID NULL,
  storage_key TEXT NOT NULL,
  expected_content_type TEXT NOT NULL,
  max_byte_size BIGINT NOT NULL CHECK (max_byte_size > 0),
  expected_checksum_sha256 TEXT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT asset_upload_intents_tenant_scope_check CHECK (
    (scope_type = 'tenant' AND tenant_id IS NOT NULL)
    OR (scope_type = 'root' AND tenant_id IS NULL)
  ),
  CONSTRAINT asset_upload_intents_storage_key_unique UNIQUE (storage_key)
);

CREATE INDEX IF NOT EXISTS idx_asset_upload_intents_asset_id ON asset_upload_intents (asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_upload_intents_status_expiry ON asset_upload_intents (status, expires_at);
CREATE INDEX IF NOT EXISTS idx_asset_upload_intents_actor_pending ON asset_upload_intents (actor_type, actor_id, status, expires_at);
CREATE INDEX IF NOT EXISTS idx_asset_upload_intents_tenant_pending ON asset_upload_intents (tenant_id, status, expires_at);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('asset.create', 'Create asset upload intents and complete verified asset uploads.', TRUE, TRUE, NOW(), NOW()),
  ('asset.read', 'Read asset metadata through asset-native authorization.', FALSE, TRUE, NOW(), NOW()),
  ('asset.content.read', 'Read private asset bytes through same-origin asset delivery.', FALSE, TRUE, NOW(), NOW()),
  ('asset.delete', 'Soft-delete assets while preserving durable metadata.', TRUE, TRUE, NOW(), NOW()),
  ('asset.link', 'Validate assets for consuming feature relationships.', FALSE, TRUE, NOW(), NOW()),
  ('asset.cleanup', 'Run internal cleanup for expired asset upload intents and abandoned objects.', TRUE, TRUE, NOW(), NOW())
ON CONFLICT (capability_key)
DO UPDATE SET
  description = EXCLUDED.description,
  root_user_admin_default_mandatory = EXCLUDED.root_user_admin_default_mandatory,
  root_user_admin_default_protected = EXCLUDED.root_user_admin_default_protected,
  updated_at = NOW();

INSERT INTO system_root_role_capability_grants (
  system_root_role_capability_grant_id,
  system_root_role_id,
  capability_key,
  is_mandatory,
  is_protected,
  created_at,
  updated_at,
  revoked_at
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  c.capability_key,
  c.root_user_admin_default_mandatory,
  c.root_user_admin_default_protected,
  NOW(),
  NOW(),
  NULL
FROM root_authz_capabilities c
WHERE c.capability_key IN (
  'asset.create',
  'asset.read',
  'asset.content.read',
  'asset.delete',
  'asset.link',
  'asset.cleanup'
)
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
