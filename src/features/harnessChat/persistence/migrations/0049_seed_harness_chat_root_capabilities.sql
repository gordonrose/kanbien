INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('harness-chat.root.conversation.create', 'Create root-admin Build chat conversations.', TRUE, TRUE, NOW(), NOW()),
  ('harness-chat.root.conversation.read', 'Read root-admin Build chat conversations and packet history.', TRUE, TRUE, NOW(), NOW()),
  ('harness-chat.root.message.append', 'Append messages to root-admin Build chat conversations.', TRUE, TRUE, NOW(), NOW()),
  ('harness-chat.root.packet.generate', 'Generate Product Discovery packet revisions from root-admin Build chat.', TRUE, TRUE, NOW(), NOW()),
  ('harness-chat.root.packet.downloadPdf', 'Download authorized Product Discovery packet PDFs from root-admin Build chat.', TRUE, TRUE, NOW(), NOW())
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
  'harness-chat.root.conversation.create',
  'harness-chat.root.conversation.read',
  'harness-chat.root.message.append',
  'harness-chat.root.packet.generate',
  'harness-chat.root.packet.downloadPdf'
)
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
