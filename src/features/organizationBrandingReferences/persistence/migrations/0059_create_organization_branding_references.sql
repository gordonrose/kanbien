CREATE TABLE IF NOT EXISTS organization_logo_relationship (
  organization_logo_relationship_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  organization_id UUID NOT NULL REFERENCES organization(organization_id),
  asset_id UUID NOT NULL REFERENCES assets(asset_id),
  logo_type TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  public_readiness_status TEXT NOT NULL,
  published_at TIMESTAMPTZ NULL,
  replaced_at TIMESTAMPTZ NULL,
  cache_invalidation_status TEXT NOT NULL DEFAULT 'not_required',
  cache_invalidation_requested_at TIMESTAMPTZ NULL,
  cleanup_eligible_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT ck_organization_logo_type CHECK (logo_type IN ('primary')),
  CONSTRAINT ck_organization_logo_alt_text_not_empty CHECK (btrim(alt_text) <> ''),
  CONSTRAINT ck_organization_logo_readiness CHECK (public_readiness_status IN ('ready', 'removed', 'superseded')),
  CONSTRAINT ck_organization_logo_cache_status CHECK (
    cache_invalidation_status IN ('not_required', 'pending', 'recorded', 'failed_retryable')
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_organization_logo_current_primary
  ON organization_logo_relationship (organization_id, logo_type)
  WHERE public_readiness_status = 'ready' AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_logo_tenant_org
  ON organization_logo_relationship (tenant_id, organization_id, logo_type, updated_at DESC);

CREATE INDEX IF NOT EXISTS ix_organization_logo_cleanup
  ON organization_logo_relationship (cleanup_eligible_at, public_readiness_status)
  WHERE cleanup_eligible_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS organization_logo_audit_event (
  organization_logo_audit_event_id UUID PRIMARY KEY,
  organization_logo_relationship_id UUID NULL REFERENCES organization_logo_relationship(organization_logo_relationship_id),
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  organization_id UUID NOT NULL REFERENCES organization(organization_id),
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL,
  event_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_organization_logo_audit_tenant_occurred
  ON organization_logo_audit_event (tenant_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS ix_organization_logo_audit_relationship_occurred
  ON organization_logo_audit_event (organization_logo_relationship_id, occurred_at DESC)
  WHERE organization_logo_relationship_id IS NOT NULL;

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('organization.root.logo.manage', 'Manage Organization primary logo relationships for a selected tenant.', TRUE, TRUE, NOW(), NOW()),
  ('organization.tenant.logo.manage', 'Manage Organization primary logo relationships in the current tenant context.', TRUE, TRUE, NOW(), NOW())
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
WHERE c.capability_key IN ('organization.root.logo.manage', 'organization.tenant.logo.manage')
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();

