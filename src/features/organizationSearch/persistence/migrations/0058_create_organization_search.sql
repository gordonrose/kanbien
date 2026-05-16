CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS ix_organization_search_name_trgm
  ON organization USING gin (LOWER(name) gin_trgm_ops)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_legal_profile_search_trgm
  ON organization_legal_profile USING gin (LOWER(legal_name) gin_trgm_ops)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_location_search_trgm
  ON organization_location USING gin (LOWER(location_name) gin_trgm_ops)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_location_address_search_trgm
  ON organization_location USING gin (LOWER(address_summary) gin_trgm_ops)
  WHERE address_summary IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_business_unit_search_trgm
  ON organization_business_unit USING gin (LOWER(name) gin_trgm_ops)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_reference_value_search_trgm
  ON organization_reference_value USING gin (LOWER(label) gin_trgm_ops);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('organization.root.search', 'Run grouped Organization-domain search for a selected tenant.', TRUE, TRUE, NOW(), NOW()),
  ('organization.tenant.search', 'Run grouped Organization-domain search for the current tenant context.', TRUE, TRUE, NOW(), NOW())
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
WHERE c.capability_key IN ('organization.root.search', 'organization.tenant.search')
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();

