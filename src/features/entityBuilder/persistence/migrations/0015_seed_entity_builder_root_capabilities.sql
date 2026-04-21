INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('entity-builder.create', 'Create an entity-definition lineage or replacement version.', TRUE, TRUE, NOW(), NOW()),
  ('entity-builder.update', 'Update a draft entity-definition version.', TRUE, TRUE, NOW(), NOW()),
  ('entity-builder.read', 'Read current and exact entity-definition versions.', TRUE, TRUE, NOW(), NOW()),
  ('entity-builder.catalog.read', 'Read approved entity-builder catalogs.', TRUE, TRUE, NOW(), NOW()),
  ('entity-builder.validate', 'Validate entity-definition versions for activation and export.', TRUE, TRUE, NOW(), NOW()),
  ('entity-builder.export', 'Export derived entity-definition snapshots.', TRUE, TRUE, NOW(), NOW())
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
  'entity-builder.create',
  'entity-builder.update',
  'entity-builder.read',
  'entity-builder.catalog.read',
  'entity-builder.validate',
  'entity-builder.export'
)
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
