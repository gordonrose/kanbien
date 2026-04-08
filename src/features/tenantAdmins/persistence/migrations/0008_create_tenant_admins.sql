CREATE TABLE IF NOT EXISTS tenant_admin (
  tenant_admin_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant (tenant_id),
  email TEXT NOT NULL,
  normalized_email TEXT NOT NULL,
  first_name TEXT NULL,
  last_name TEXT NULL,
  email_verification_status TEXT NOT NULL CHECK (email_verification_status IN ('pending', 'verified')),
  email_verified_at TIMESTAMPTZ NULL,
  last_verification_email_requested_at TIMESTAMPTZ NULL,
  created_by_root_admin_user_id UUID NOT NULL REFERENCES root_users (root_user_id),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_tenant_admin_active_email
  ON tenant_admin (tenant_id, normalized_email)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_tenant_admin_tenant_updated_at
  ON tenant_admin (tenant_id, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_tenant_admin_tenant_deleted_at
  ON tenant_admin (tenant_id, deleted_at DESC)
  WHERE deleted_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS tenant_admin_verification_token (
  tenant_admin_verification_token_id UUID PRIMARY KEY,
  tenant_admin_id UUID NOT NULL REFERENCES tenant_admin (tenant_admin_id),
  token_id UUID NOT NULL UNIQUE,
  purpose TEXT NOT NULL CHECK (purpose IN ('email_verification')),
  secret_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  invalidated_at TIMESTAMPTZ NULL,
  outbound_email_id UUID NULL REFERENCES outbound_email (email_id),
  requested_by_actor_type TEXT NOT NULL,
  requested_by_actor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_tenant_admin_verification_token_tenant_admin_active
  ON tenant_admin_verification_token (tenant_admin_id, created_at DESC)
  WHERE used_at IS NULL AND invalidated_at IS NULL;

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('tenant-admin.create', 'Create a tenant-admin actor record within a tenant.', TRUE, TRUE, NOW(), NOW()),
  ('tenant-admin.read', 'Read one visible tenant-admin actor record.', TRUE, TRUE, NOW(), NOW()),
  ('tenant-admin.list', 'List visible tenant-admin actor records.', TRUE, TRUE, NOW(), NOW()),
  ('tenant-admin.update', 'Update editable tenant-admin profile fields.', TRUE, TRUE, NOW(), NOW()),
  ('tenant-admin.verification.send', 'Send an email-verification message for a tenant admin.', TRUE, TRUE, NOW(), NOW()),
  ('tenant-admin.verification.resend', 'Resend an email-verification message for a tenant admin.', TRUE, TRUE, NOW(), NOW()),
  ('tenant-admin.delete', 'Soft-delete a tenant-admin actor record.', FALSE, TRUE, NOW(), NOW()),
  ('tenant-admin.reactivate', 'Reactivate a previously deleted tenant-admin actor record.', FALSE, TRUE, NOW(), NOW())
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
  'tenant-admin.create',
  'tenant-admin.read',
  'tenant-admin.list',
  'tenant-admin.update',
  'tenant-admin.verification.send',
  'tenant-admin.verification.resend',
  'tenant-admin.delete',
  'tenant-admin.reactivate'
)
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
