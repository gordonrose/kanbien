CREATE TABLE IF NOT EXISTS organization_location (
  organization_location_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant (tenant_id),
  organization_id UUID NOT NULL REFERENCES organization (organization_id),
  location_name TEXT NOT NULL,
  address_summary TEXT NULL,
  latitude DOUBLE PRECISION NULL CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
  longitude DOUBLE PRECISION NULL CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180)),
  is_head_office BOOLEAN NOT NULL DEFAULT FALSE,
  is_registered_office BOOLEAN NOT NULL DEFAULT FALSE,
  lifecycle_status TEXT NOT NULL CHECK (lifecycle_status IN ('active', 'archived')),
  archived_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS ix_organization_location_tenant_lifecycle
  ON organization_location (tenant_id, lifecycle_status, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_location_organization
  ON organization_location (tenant_id, organization_id, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_location_descriptive_flags
  ON organization_location (tenant_id, organization_id, is_head_office, is_registered_office)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS organization_location_audit_event (
  organization_location_audit_event_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant (tenant_id),
  organization_id UUID NOT NULL REFERENCES organization (organization_id),
  organization_location_id UUID NULL REFERENCES organization_location (organization_location_id),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('root-user', 'tenant-admin')),
  actor_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL CHECK (event_outcome IN ('success', 'failure')),
  event_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_organization_location_audit_tenant_occurred_at
  ON organization_location_audit_event (tenant_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS ix_organization_location_audit_location_occurred_at
  ON organization_location_audit_event (organization_location_id, occurred_at DESC)
  WHERE organization_location_id IS NOT NULL;

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('organization.location.manage', 'Create and manage organization locations within a tenant.', TRUE, TRUE, NOW(), NOW()),
  ('organization.location.read', 'Read organization locations within a tenant.', TRUE, TRUE, NOW(), NOW())
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
  'organization.location.manage',
  'organization.location.read'
)
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
