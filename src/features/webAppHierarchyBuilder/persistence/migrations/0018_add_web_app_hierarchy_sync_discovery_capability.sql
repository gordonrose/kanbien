INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES (
  'web-app-hierarchy.sync-discovery',
  'Run discovery-backed web-app hierarchy sync and return the updated tree.',
  TRUE,
  TRUE,
  NOW(),
  NOW()
)
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
  'web-app-hierarchy.sync-discovery',
  TRUE,
  TRUE,
  NOW(),
  NOW(),
  NULL
WHERE NOT EXISTS (
  SELECT 1
  FROM system_root_role_capability_grants
  WHERE system_root_role_id = '00000000-0000-0000-0000-000000000001'
    AND capability_key = 'web-app-hierarchy.sync-discovery'
);
