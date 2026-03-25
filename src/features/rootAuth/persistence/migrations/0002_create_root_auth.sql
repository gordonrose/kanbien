CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS auth_principals (
  auth_principal_id TEXT PRIMARY KEY,
  login_email TEXT NOT NULL,
  login_email_normalized TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  password_changed_at TIMESTAMPTZ NULL,
  auth_status TEXT NOT NULL CHECK (auth_status IN ('active', 'disabled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_auth_principals_login_email_normalized
  ON auth_principals (login_email_normalized);

CREATE TABLE IF NOT EXISTS auth_principal_root_user_links (
  link_id TEXT PRIMARY KEY,
  auth_principal_id TEXT NOT NULL REFERENCES auth_principals (auth_principal_id),
  root_user_id UUID NOT NULL REFERENCES root_users (root_user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_auth_links_auth_principal
  ON auth_principal_root_user_links (auth_principal_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_auth_links_root_user
  ON auth_principal_root_user_links (root_user_id);

CREATE TABLE IF NOT EXISTS auth_ssh_public_keys (
  auth_ssh_public_key_id TEXT PRIMARY KEY,
  auth_principal_id TEXT NOT NULL REFERENCES auth_principals (auth_principal_id),
  label TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  public_key_openssh TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_auth_ssh_public_keys_active_fingerprint_per_principal
  ON auth_ssh_public_keys (auth_principal_id, fingerprint)
  WHERE status = 'active' AND revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS auth_login_challenges (
  challenge_id TEXT PRIMARY KEY,
  auth_principal_id TEXT NOT NULL REFERENCES auth_principals (auth_principal_id),
  purpose TEXT NOT NULL,
  challenge_text TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_auth_login_challenges_auth_principal_id
  ON auth_login_challenges (auth_principal_id);

CREATE INDEX IF NOT EXISTS ix_auth_login_challenges_expires_at
  ON auth_login_challenges (expires_at);

CREATE TABLE IF NOT EXISTS auth_sessions (
  session_id TEXT PRIMARY KEY,
  auth_principal_id TEXT NOT NULL REFERENCES auth_principals (auth_principal_id),
  root_user_id UUID NOT NULL REFERENCES root_users (root_user_id),
  authenticated_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_auth_sessions_auth_principal_id
  ON auth_sessions (auth_principal_id);

CREATE INDEX IF NOT EXISTS ix_auth_sessions_root_user_id
  ON auth_sessions (root_user_id);

CREATE INDEX IF NOT EXISTS ix_auth_sessions_expires_at
  ON auth_sessions (expires_at);

CREATE TABLE IF NOT EXISTS auth_audit_events (
  event_id TEXT PRIMARY KEY,
  auth_principal_id TEXT NULL REFERENCES auth_principals (auth_principal_id),
  root_user_id UUID NULL REFERENCES root_users (root_user_id),
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL CHECK (event_outcome IN ('success', 'failure')),
  ip_address TEXT NULL,
  user_agent TEXT NULL,
  occurred_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_auth_audit_events_auth_principal_id
  ON auth_audit_events (auth_principal_id);

CREATE INDEX IF NOT EXISTS ix_auth_audit_events_root_user_id
  ON auth_audit_events (root_user_id);

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
LEFT JOIN auth_principal_root_user_links existing_link
  ON existing_link.root_user_id = ru.root_user_id
LEFT JOIN auth_principal_root_user_links principal_link
  ON principal_link.auth_principal_id = ap.auth_principal_id
WHERE existing_link.link_id IS NULL
  AND principal_link.link_id IS NULL;

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
