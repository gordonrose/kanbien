CREATE TABLE IF NOT EXISTS organization_business_unit_membership (
  organization_business_unit_membership_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  organization_id UUID NOT NULL REFERENCES organization(organization_id),
  business_unit_id UUID NOT NULL REFERENCES organization_business_unit(organization_business_unit_id),
  member_type TEXT NOT NULL,
  individual_user_id UUID NULL,
  member_business_unit_id UUID NULL REFERENCES organization_business_unit(organization_business_unit_id),
  membership_role TEXT NOT NULL,
  lifecycle_status TEXT NOT NULL DEFAULT 'active',
  archived_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT ck_organization_business_unit_membership_lifecycle
    CHECK (lifecycle_status IN ('active', 'archived')),
  CONSTRAINT ck_organization_business_unit_membership_type
    CHECK (member_type IN ('individual', 'business_unit')),
  CONSTRAINT ck_organization_business_unit_membership_role
    CHECK (membership_role IN ('owner', 'manager', 'member', 'viewer')),
  CONSTRAINT ck_organization_business_unit_membership_target
    CHECK (
      (member_type = 'individual' AND individual_user_id IS NOT NULL AND member_business_unit_id IS NULL)
      OR
      (member_type = 'business_unit' AND individual_user_id IS NULL AND member_business_unit_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS ix_organization_business_unit_membership_unit
  ON organization_business_unit_membership (tenant_id, organization_id, business_unit_id, lifecycle_status, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_business_unit_membership_member_unit
  ON organization_business_unit_membership (tenant_id, organization_id, member_business_unit_id)
  WHERE deleted_at IS NULL AND member_business_unit_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS organization_business_unit_membership_audit_event (
  organization_business_unit_membership_audit_event_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  organization_id UUID NOT NULL REFERENCES organization(organization_id),
  business_unit_id UUID NOT NULL REFERENCES organization_business_unit(organization_business_unit_id),
  organization_business_unit_membership_id UUID NOT NULL REFERENCES organization_business_unit_membership(organization_business_unit_membership_id),
  actor_type TEXT NOT NULL,
  actor_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL,
  event_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_organization_business_unit_membership_audit_target
  ON organization_business_unit_membership_audit_event (organization_business_unit_membership_id, occurred_at DESC);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('organization.business-unit-membership.manage', 'Create and manage organization business-unit memberships within a tenant.', TRUE, TRUE, NOW(), NOW()),
  ('organization.business-unit-membership.read', 'Read organization business-unit memberships within a tenant.', TRUE, TRUE, NOW(), NOW())
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
WHERE c.capability_key IN ('organization.business-unit-membership.manage', 'organization.business-unit-membership.read')
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
