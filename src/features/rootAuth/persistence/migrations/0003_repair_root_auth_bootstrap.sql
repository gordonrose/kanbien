INSERT INTO auth_principals (
  auth_principal_id,
  login_email,
  login_email_normalized,
  password_hash,
  password_changed_at,
  auth_status,
  created_at,
  updated_at
)
SELECT
  'ap_' || replace(gen_random_uuid()::text, '-', ''),
  ru.email,
  lower(trim(ru.email)),
  crypt('{{ROOT_AUTH_BOOTSTRAP_PASSWORD}}', gen_salt('bf', 12)),
  NOW(),
  'active',
  NOW(),
  NOW()
FROM root_users ru
LEFT JOIN auth_principals ap
  ON ap.login_email_normalized = lower(trim(ru.email))
WHERE ap.auth_principal_id IS NULL;

INSERT INTO auth_principal_root_user_links (
  link_id,
  auth_principal_id,
  root_user_id,
  created_at
)
SELECT
  'link_' || replace(gen_random_uuid()::text, '-', ''),
  ap.auth_principal_id,
  ru.root_user_id,
  NOW()
FROM root_users ru
JOIN auth_principals ap
  ON ap.login_email_normalized = lower(trim(ru.email))
LEFT JOIN auth_principal_root_user_links existing_by_root_user
  ON existing_by_root_user.root_user_id = ru.root_user_id
LEFT JOIN auth_principal_root_user_links existing_by_principal
  ON existing_by_principal.auth_principal_id = ap.auth_principal_id
WHERE existing_by_root_user.link_id IS NULL
  AND existing_by_principal.link_id IS NULL;

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
