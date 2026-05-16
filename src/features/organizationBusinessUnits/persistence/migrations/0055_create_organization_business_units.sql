CREATE TABLE IF NOT EXISTS organization_business_unit (
  organization_business_unit_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  organization_id UUID NOT NULL REFERENCES organization(organization_id),
  parent_business_unit_id UUID NULL REFERENCES organization_business_unit(organization_business_unit_id),
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  lifecycle_status TEXT NOT NULL DEFAULT 'active',
  archived_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT ck_organization_business_unit_lifecycle
    CHECK (lifecycle_status IN ('active', 'archived')),
  CONSTRAINT ck_organization_business_unit_not_empty_name
    CHECK (length(trim(name)) > 0)
);

CREATE INDEX IF NOT EXISTS ix_organization_business_unit_org_parent
  ON organization_business_unit (tenant_id, organization_id, parent_business_unit_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_business_unit_org_status
  ON organization_business_unit (tenant_id, organization_id, lifecycle_status, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS organization_business_unit_audit_event (
  organization_business_unit_audit_event_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  organization_id UUID NOT NULL REFERENCES organization(organization_id),
  organization_business_unit_id UUID NOT NULL REFERENCES organization_business_unit(organization_business_unit_id),
  actor_type TEXT NOT NULL,
  actor_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL,
  event_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_organization_business_unit_audit_target
  ON organization_business_unit_audit_event (organization_business_unit_id, occurred_at DESC);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('organization.business-unit.manage', 'Create and manage organization business units within a tenant.', TRUE, TRUE, NOW(), NOW()),
  ('organization.business-unit.read', 'Read organization business units within a tenant.', TRUE, TRUE, NOW(), NOW())
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
WHERE c.capability_key IN ('organization.business-unit.manage', 'organization.business-unit.read')
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
