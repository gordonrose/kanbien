INSERT INTO auth_ssh_public_keys (
  auth_ssh_public_key_id,
  auth_principal_id,
  label,
  algorithm,
  public_key_openssh,
  fingerprint,
  status,
  created_at,
  revoked_at
)
SELECT
  'key_' || replace(gen_random_uuid()::text, '-', ''),
  link.auth_principal_id,
  'bootstrap',
  'ssh-ed25519',
  '{{ROOT_AUTH_BOOTSTRAP_SSH_PUBLIC_KEY}}',
  '{{ROOT_AUTH_BOOTSTRAP_SSH_FINGERPRINT}}',
  'active',
  NOW(),
  NULL
FROM auth_principal_root_user_links link
LEFT JOIN auth_ssh_public_keys existing_key
  ON existing_key.auth_principal_id = link.auth_principal_id
 AND existing_key.fingerprint = '{{ROOT_AUTH_BOOTSTRAP_SSH_FINGERPRINT}}'
 AND existing_key.status = 'active'
 AND existing_key.revoked_at IS NULL
WHERE existing_key.auth_ssh_public_key_id IS NULL;

INSERT INTO auth_audit_events (
  event_id,
  auth_principal_id,
  root_user_id,
  event_type,
  event_outcome,
  ip_address,
  user_agent,
  occurred_at
)
SELECT
  'evt_' || replace(gen_random_uuid()::text, '-', ''),
  link.auth_principal_id,
  link.root_user_id,
  'bootstrap_migration_applied',
  'success',
  NULL,
  NULL,
  NOW()
FROM auth_principal_root_user_links link
LEFT JOIN auth_audit_events existing_event
  ON existing_event.auth_principal_id = link.auth_principal_id
 AND existing_event.root_user_id = link.root_user_id
 AND existing_event.event_type = 'bootstrap_migration_applied'
WHERE existing_event.event_id IS NULL;
