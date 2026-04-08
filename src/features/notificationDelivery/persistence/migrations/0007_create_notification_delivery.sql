CREATE TABLE IF NOT EXISTS outbound_email (
  email_id UUID PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('email')),
  notification_type TEXT NOT NULL,
  template_key TEXT NULL,
  tenant_id UUID NULL REFERENCES tenant (tenant_id),
  related_entity_type TEXT NULL,
  related_entity_id TEXT NULL,
  recipient_email TEXT NOT NULL,
  normalized_recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  normalized_subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  provider TEXT NOT NULL,
  created_by_actor_type TEXT NOT NULL,
  created_by_actor_id TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ NULL,
  last_attempt_at TIMESTAMPTZ NULL,
  last_error_code TEXT NULL,
  last_error_summary TEXT NULL,
  duplicate_guard_fingerprint TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_outbound_email_requested_at
  ON outbound_email (requested_at DESC);

CREATE INDEX IF NOT EXISTS ix_outbound_email_sent_at
  ON outbound_email (sent_at DESC);

CREATE INDEX IF NOT EXISTS ix_outbound_email_status
  ON outbound_email (status, requested_at DESC);

CREATE INDEX IF NOT EXISTS ix_outbound_email_recipient
  ON outbound_email (normalized_recipient_email, requested_at DESC);

CREATE INDEX IF NOT EXISTS ix_outbound_email_subject
  ON outbound_email (normalized_subject, requested_at DESC);

CREATE INDEX IF NOT EXISTS ix_outbound_email_tenant
  ON outbound_email (tenant_id, requested_at DESC);

CREATE INDEX IF NOT EXISTS ix_outbound_email_related_entity
  ON outbound_email (related_entity_type, related_entity_id, requested_at DESC);

CREATE INDEX IF NOT EXISTS ix_outbound_email_provider
  ON outbound_email (provider, requested_at DESC);

CREATE INDEX IF NOT EXISTS ix_outbound_email_duplicate_guard
  ON outbound_email (normalized_recipient_email, duplicate_guard_fingerprint, requested_at DESC);

CREATE TABLE IF NOT EXISTS outbound_email_content (
  content_snapshot_id UUID PRIMARY KEY,
  email_id UUID NOT NULL REFERENCES outbound_email (email_id) ON DELETE CASCADE,
  content_version_number INTEGER NOT NULL CHECK (content_version_number >= 1),
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  contains_redacted_verification_link BOOLEAN NOT NULL DEFAULT FALSE,
  contains_redacted_reset_link BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_outbound_email_content_email_version
  ON outbound_email_content (email_id, content_version_number);

CREATE TABLE IF NOT EXISTS outbound_email_attempt (
  attempt_id UUID PRIMARY KEY,
  email_id UUID NOT NULL REFERENCES outbound_email (email_id) ON DELETE CASCADE,
  content_snapshot_id UUID NOT NULL REFERENCES outbound_email_content (content_snapshot_id) ON DELETE RESTRICT,
  attempt_number INTEGER NOT NULL CHECK (attempt_number >= 1),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  provider_message_id TEXT NULL,
  provider_response_code TEXT NULL,
  provider_error_summary TEXT NULL,
  attempted_at TIMESTAMPTZ NOT NULL,
  resent_by_actor_type TEXT NULL,
  resent_by_actor_id TEXT NULL,
  resend_reason TEXT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_outbound_email_attempt_email_attempt_number
  ON outbound_email_attempt (email_id, attempt_number);

CREATE INDEX IF NOT EXISTS ix_outbound_email_attempt_provider_message_id
  ON outbound_email_attempt (provider_message_id);

CREATE INDEX IF NOT EXISTS ix_outbound_email_attempt_email_attempted_at
  ON outbound_email_attempt (email_id, attempted_at DESC);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('notification.email.send', 'Send outbound emails through the shared notification-delivery feature.', TRUE, TRUE, NOW(), NOW()),
  ('notification.email.resend', 'Resend an outbound email through the shared notification-delivery feature.', TRUE, TRUE, NOW(), NOW()),
  ('notification.email.read', 'List and inspect outbound-email metadata through the shared notification-delivery feature.', TRUE, TRUE, NOW(), NOW())
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
  'notification.email.send',
  'notification.email.resend',
  'notification.email.read'
)
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
