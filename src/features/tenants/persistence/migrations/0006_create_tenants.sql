CREATE TABLE IF NOT EXISTS tenant (
  tenant_id UUID PRIMARY KEY,
  biz_id TEXT NOT NULL,
  normalized_biz_id TEXT NOT NULL,
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('customer', 'demo', 'test')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'live', 'disabled', 'inactive')),
  pre_delete_status TEXT NULL CHECK (pre_delete_status IN ('draft', 'live', 'disabled', 'inactive')),
  created_by_root_admin_user_id UUID NOT NULL REFERENCES root_users (root_user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_tenant_normalized_biz_id_active
  ON tenant (normalized_biz_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_tenant_normalized_name
  ON tenant (normalized_name);

CREATE INDEX IF NOT EXISTS ix_tenant_category
  ON tenant (category);

CREATE INDEX IF NOT EXISTS ix_tenant_status
  ON tenant (status);

CREATE INDEX IF NOT EXISTS ix_tenant_deleted_at
  ON tenant (deleted_at);

CREATE INDEX IF NOT EXISTS ix_tenant_updated_at
  ON tenant (updated_at DESC);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('tenant.create', 'Create a tenant.', TRUE, TRUE, NOW(), NOW()),
  ('tenant.read', 'Read one visible tenant.', TRUE, TRUE, NOW(), NOW()),
  ('tenant.list', 'List visible tenants.', TRUE, TRUE, NOW(), NOW()),
  ('tenant.update', 'Update editable tenant metadata.', TRUE, TRUE, NOW(), NOW()),
  ('tenant.read.deleted', 'Read one deleted tenant explicitly.', FALSE, TRUE, NOW(), NOW()),
  ('tenant.list.deleted', 'List deleted tenants explicitly.', FALSE, TRUE, NOW(), NOW()),
  ('tenant.delete', 'Soft-delete a tenant.', FALSE, TRUE, NOW(), NOW()),
  ('tenant.reactivate', 'Reactivate a previously deleted tenant.', FALSE, TRUE, NOW(), NOW()),
  ('tenant.remove', 'Irreversibly remove a tenant while no dependent tenant-owned entities exist.', FALSE, TRUE, NOW(), NOW())
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
  'tenant.create',
  'tenant.read',
  'tenant.list',
  'tenant.update',
  'tenant.read.deleted',
  'tenant.list.deleted',
  'tenant.delete',
  'tenant.reactivate',
  'tenant.remove'
)
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
