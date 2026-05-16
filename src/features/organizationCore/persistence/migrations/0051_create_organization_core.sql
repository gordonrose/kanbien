CREATE TABLE IF NOT EXISTS organization (
  organization_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant (tenant_id),
  parent_organization_id UUID NULL REFERENCES organization (organization_id),
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  organization_type_reference_value_id UUID NULL,
  lifecycle_status TEXT NOT NULL CHECK (lifecycle_status IN ('active', 'archived')),
  archived_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CHECK (parent_organization_id IS NULL OR parent_organization_id <> organization_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_organization_tenant_active_normalized_name
  ON organization (tenant_id, normalized_name)
  WHERE lifecycle_status = 'active' AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_tenant_parent
  ON organization (tenant_id, parent_organization_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_tenant_lifecycle
  ON organization (tenant_id, lifecycle_status, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_tenant_deleted
  ON organization (tenant_id, deleted_at DESC)
  WHERE deleted_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS organization_audit_event (
  organization_audit_event_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant (tenant_id),
  organization_id UUID NULL REFERENCES organization (organization_id),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('root-user', 'tenant-admin')),
  actor_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL CHECK (event_outcome IN ('success', 'failure')),
  event_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_organization_audit_event_tenant_occurred_at
  ON organization_audit_event (tenant_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS ix_organization_audit_event_organization_occurred_at
  ON organization_audit_event (organization_id, occurred_at DESC)
  WHERE organization_id IS NOT NULL;

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('organization.create', 'Create an organization within a tenant.', TRUE, TRUE, NOW(), NOW()),
  ('organization.read', 'Read active organization records within a tenant.', TRUE, TRUE, NOW(), NOW()),
  ('organization.list', 'List active organization records within a tenant.', TRUE, TRUE, NOW(), NOW()),
  ('organization.update', 'Update editable organization fields within a tenant.', TRUE, TRUE, NOW(), NOW()),
  ('organization.move', 'Move an organization within an approved tenant hierarchy.', TRUE, TRUE, NOW(), NOW()),
  ('organization.archive', 'Archive an organization branch or archive while reparenting children.', TRUE, TRUE, NOW(), NOW()),
  ('organization.restore', 'Restore an archived organization record when hierarchy rules allow it.', TRUE, TRUE, NOW(), NOW()),
  ('organization.delete', 'Soft-delete an organization record with no active children.', FALSE, TRUE, NOW(), NOW())
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
  'organization.create',
  'organization.read',
  'organization.list',
  'organization.update',
  'organization.move',
  'organization.archive',
  'organization.restore',
  'organization.delete'
)
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
