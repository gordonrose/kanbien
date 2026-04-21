INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  (
    'web-app-page-settings.read',
    'Read durable page settings for one curated web-app page.',
    TRUE,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'web-app-page-settings.update',
    'Create or update durable page settings for one curated web-app page.',
    TRUE,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'web-app-page-settings.read-options',
    'Read approved page-settings options for one curated web-app page.',
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
  c.capability_key,
  c.root_user_admin_default_mandatory,
  c.root_user_admin_default_protected,
  NOW(),
  NOW(),
  NULL
FROM root_authz_capabilities c
WHERE c.capability_key IN (
  'web-app-page-settings.read',
  'web-app-page-settings.update',
  'web-app-page-settings.read-options'
)
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
