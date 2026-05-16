CREATE TABLE IF NOT EXISTS organization_reference_value (
  organization_reference_value_id UUID PRIMARY KEY,
  reference_type TEXT NOT NULL,
  reference_value_key TEXT NOT NULL,
  label TEXT NOT NULL,
  replacement_reference_value_id UUID NULL REFERENCES organization_reference_value(organization_reference_value_id),
  lifecycle_status TEXT NOT NULL DEFAULT 'active',
  archived_at TIMESTAMPTZ NULL,
  deprecated_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_organization_reference_value_type_not_empty
    CHECK (btrim(reference_type) <> ''),
  CONSTRAINT ck_organization_reference_value_key_not_empty
    CHECK (btrim(reference_value_key) <> ''),
  CONSTRAINT ck_organization_reference_value_label_not_empty
    CHECK (btrim(label) <> ''),
  CONSTRAINT ck_organization_reference_value_lifecycle
    CHECK (lifecycle_status IN ('active', 'archived', 'deprecated', 'replaced')),
  CONSTRAINT ck_organization_reference_value_replacement_not_self
    CHECK (replacement_reference_value_id IS NULL OR replacement_reference_value_id <> organization_reference_value_id),
  CONSTRAINT ck_organization_reference_value_replaced_target
    CHECK (
      (lifecycle_status = 'replaced' AND replacement_reference_value_id IS NOT NULL)
      OR
      (lifecycle_status <> 'replaced' AND replacement_reference_value_id IS NULL)
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_organization_reference_value_type_key
  ON organization_reference_value (reference_type, reference_value_key);

CREATE INDEX IF NOT EXISTS ix_organization_reference_value_status
  ON organization_reference_value (reference_type, lifecycle_status, label);

CREATE INDEX IF NOT EXISTS ix_organization_reference_value_label
  ON organization_reference_value (label);

CREATE TABLE IF NOT EXISTS organization_reference_value_audit_event (
  organization_reference_value_audit_event_id UUID PRIMARY KEY,
  organization_reference_value_id UUID NOT NULL REFERENCES organization_reference_value(organization_reference_value_id),
  actor_type TEXT NOT NULL,
  actor_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL,
  event_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_organization_reference_value_audit_target
  ON organization_reference_value_audit_event (organization_reference_value_id, occurred_at DESC);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('organization.reference-value.manage', 'Create and manage system-owned Organization reference values.', TRUE, TRUE, NOW(), NOW()),
  ('organization.reference-value.read', 'Read system-owned Organization reference values.', TRUE, TRUE, NOW(), NOW())
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
WHERE c.capability_key IN ('organization.reference-value.manage', 'organization.reference-value.read')
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
