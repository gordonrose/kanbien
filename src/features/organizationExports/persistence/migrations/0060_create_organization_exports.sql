CREATE TABLE IF NOT EXISTS organization_export (
  organization_export_id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  source_organization_id UUID NOT NULL REFERENCES organization(organization_id),
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  auth_principal_id UUID NULL,
  authority_world TEXT NOT NULL,
  selected_sections TEXT[] NOT NULL,
  visibility_scope TEXT NOT NULL,
  organization_scope TEXT NOT NULL,
  status TEXT NOT NULL,
  job_id UUID NULL,
  storage_key TEXT NULL,
  pin_secret_encrypted TEXT NULL,
  pin_viewed_at TIMESTAMPTZ NULL,
  download_attempt_count INTEGER NOT NULL DEFAULT 0,
  notification_status TEXT NOT NULL DEFAULT 'pending',
  size_bytes INTEGER NULL,
  checksum_sha256 TEXT NULL,
  failure_category TEXT NULL,
  generated_at TIMESTAMPTZ NULL,
  expires_at TIMESTAMPTZ NULL,
  cleanup_eligible_at TIMESTAMPTZ NULL,
  cleanup_failure_category TEXT NULL,
  cleanup_attempt_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL,
  CONSTRAINT ck_organization_export_actor_type CHECK (actor_type IN ('root-user', 'tenant-admin', 'system')),
  CONSTRAINT ck_organization_export_authority_world CHECK (authority_world IN ('root', 'tenant')),
  CONSTRAINT ck_organization_export_visibility_scope CHECK (visibility_scope IN ('current_only', 'include_retained')),
  CONSTRAINT ck_organization_export_organization_scope CHECK (organization_scope IN ('selected_organization_only', 'include_child_branch')),
  CONSTRAINT ck_organization_export_status CHECK (
    status IN (
      'queued', 'running', 'cancel_requested', 'cancelled', 'ready', 'failed',
      'retrying', 'expired', 'delete_requested', 'deleted', 'cleanup_failed'
    )
  ),
  CONSTRAINT ck_organization_export_notification_status CHECK (notification_status IN ('pending', 'sent', 'failed', 'not_applicable')),
  CONSTRAINT ck_organization_export_sections_not_empty CHECK (array_length(selected_sections, 1) > 0),
  CONSTRAINT ck_organization_export_checksum_shape CHECK (checksum_sha256 IS NULL OR checksum_sha256 ~ '^[a-f0-9]{64}$'),
  CONSTRAINT ck_organization_export_ready_fields CHECK (
    status <> 'ready'
    OR (storage_key IS NOT NULL AND pin_secret_encrypted IS NOT NULL AND size_bytes IS NOT NULL AND checksum_sha256 IS NOT NULL AND generated_at IS NOT NULL AND expires_at IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS ix_organization_export_tenant_status
  ON organization_export (tenant_id, status, expires_at, created_at DESC);

CREATE INDEX IF NOT EXISTS ix_organization_export_actor_status
  ON organization_export (tenant_id, actor_id, status, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_organization_export_source
  ON organization_export (tenant_id, source_organization_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS ix_organization_export_cleanup
  ON organization_export (cleanup_eligible_at, status)
  WHERE cleanup_eligible_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS organization_export_attempt (
  organization_export_attempt_id UUID PRIMARY KEY,
  organization_export_id UUID NOT NULL REFERENCES organization_export(organization_export_id),
  job_id UUID NULL,
  status TEXT NOT NULL,
  failure_category TEXT NULL,
  failure_summary TEXT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ NULL,
  CONSTRAINT ck_organization_export_attempt_status CHECK (status IN ('running', 'succeeded', 'failed'))
);

CREATE INDEX IF NOT EXISTS ix_organization_export_attempt_export
  ON organization_export_attempt (organization_export_id, started_at DESC);

CREATE TABLE IF NOT EXISTS organization_export_audit_event (
  organization_export_audit_event_id UUID PRIMARY KEY,
  organization_export_id UUID NULL REFERENCES organization_export(organization_export_id),
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  actor_type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL,
  event_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_organization_export_audit_tenant_occurred
  ON organization_export_audit_event (tenant_id, occurred_at DESC);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('organization.root.export.manage', 'Manage private Organization export bundles for a selected tenant.', TRUE, TRUE, NOW(), NOW()),
  ('organization.tenant.export.manage', 'Manage private Organization export bundles in the current tenant context.', TRUE, TRUE, NOW(), NOW())
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
WHERE c.capability_key IN ('organization.root.export.manage', 'organization.tenant.export.manage')
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
