CREATE TABLE IF NOT EXISTS root_authz_capabilities (
  capability_key TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  root_user_admin_default_mandatory BOOLEAN NOT NULL DEFAULT FALSE,
  root_user_admin_default_protected BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_root_roles (
  system_root_role_id UUID PRIMARY KEY,
  role_key TEXT NOT NULL,
  normalized_role_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  is_protected BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deactivated_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_system_root_roles_normalized_role_key_active
  ON system_root_roles (normalized_role_key)
  WHERE deactivated_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_system_root_roles_updated_at
  ON system_root_roles (updated_at DESC);

CREATE TABLE IF NOT EXISTS system_root_role_capability_grants (
  system_root_role_capability_grant_id UUID PRIMARY KEY,
  system_root_role_id UUID NOT NULL REFERENCES system_root_roles (system_root_role_id),
  capability_key TEXT NOT NULL REFERENCES root_authz_capabilities (capability_key),
  is_mandatory BOOLEAN NOT NULL DEFAULT FALSE,
  is_protected BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_system_root_role_capability_grants_role_capability
  ON system_root_role_capability_grants (system_root_role_id, capability_key);

CREATE INDEX IF NOT EXISTS ix_system_root_role_capability_grants_active_role
  ON system_root_role_capability_grants (system_root_role_id, capability_key)
  WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS root_user_role_assignments (
  root_user_role_assignment_id UUID PRIMARY KEY,
  root_user_id UUID NOT NULL REFERENCES root_users (root_user_id),
  system_root_role_id UUID NOT NULL REFERENCES system_root_roles (system_root_role_id),
  assigned_by_root_user_id UUID NULL REFERENCES root_users (root_user_id),
  assigned_reason TEXT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unassigned_at TIMESTAMPTZ NULL,
  unassigned_by_root_user_id UUID NULL REFERENCES root_users (root_user_id),
  unassigned_reason TEXT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_root_user_role_assignments_active_root_user_role
  ON root_user_role_assignments (root_user_id, system_root_role_id)
  WHERE unassigned_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_root_user_role_assignments_active_root_user
  ON root_user_role_assignments (root_user_id, assigned_at DESC)
  WHERE unassigned_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_root_user_role_assignments_active_role
  ON root_user_role_assignments (system_root_role_id, assigned_at DESC)
  WHERE unassigned_at IS NULL;

CREATE TABLE IF NOT EXISTS root_role_audit_events (
  root_role_audit_event_id UUID PRIMARY KEY,
  actor_root_user_id UUID NULL REFERENCES root_users (root_user_id),
  target_root_user_id UUID NULL REFERENCES root_users (root_user_id),
  system_root_role_id UUID NULL REFERENCES system_root_roles (system_root_role_id),
  root_user_role_assignment_id UUID NULL REFERENCES root_user_role_assignments (root_user_role_assignment_id),
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL CHECK (event_outcome IN ('success', 'failure')),
  reason TEXT NULL,
  before_state JSONB NULL,
  after_state JSONB NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_root_role_audit_events_occurred_at
  ON root_role_audit_events (occurred_at DESC);

CREATE INDEX IF NOT EXISTS ix_root_role_audit_events_target_root_user_id
  ON root_role_audit_events (target_root_user_id, occurred_at DESC);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('root-auth.principal.create', 'Create a root auth principal for a root user.', TRUE, TRUE, NOW(), NOW()),
  ('root-auth.password.change.own', 'Change the authenticated root user''s own password.', TRUE, TRUE, NOW(), NOW()),
  ('root-auth.ssh-key.create.own', 'Add an SSH public key to the authenticated root user''s own auth principal.', TRUE, TRUE, NOW(), NOW()),
  ('root-auth.ssh-key.read.own', 'List SSH public keys for the authenticated root user''s own auth principal.', TRUE, TRUE, NOW(), NOW()),
  ('root-auth.ssh-key.revoke.own', 'Revoke an SSH public key for the authenticated root user''s own auth principal.', TRUE, TRUE, NOW(), NOW()),
  ('root-auth.session.read.own', 'List sessions for the authenticated root user''s own auth principal.', TRUE, TRUE, NOW(), NOW()),
  ('root-auth.session.revoke.own', 'Revoke a session for the authenticated root user''s own auth principal.', TRUE, TRUE, NOW(), NOW()),
  ('root-auth.session.logout.own', 'Log out the authenticated root user''s own current session.', TRUE, TRUE, NOW(), NOW()),
  ('root-admin-shell.session.read.own', 'Read the authenticated root user''s own browser session summary.', TRUE, TRUE, NOW(), NOW()),
  ('root-admin-shell.session.logout.own', 'Log out the authenticated root user''s own browser session.', TRUE, TRUE, NOW(), NOW()),
  ('root-user.create', 'Create a root user.', TRUE, TRUE, NOW(), NOW()),
  ('root-user.read.visible', 'Read visible root users and exact visible root-user lookups.', TRUE, TRUE, NOW(), NOW()),
  ('root-user.read.active', 'List active root users only.', FALSE, FALSE, NOW(), NOW()),
  ('root-user.read.deleted', 'List deleted root users explicitly.', FALSE, TRUE, NOW(), NOW()),
  ('root-user.update', 'Update editable root-user metadata and lifecycle-safe fields.', TRUE, TRUE, NOW(), NOW()),
  ('root-user.delete', 'Soft-delete a root user.', FALSE, TRUE, NOW(), NOW()),
  ('root-user.remove', 'Irreversibly anonymize and remove a root user.', FALSE, TRUE, NOW(), NOW()),
  ('root-user.reactivate', 'Reactivate a previously deleted root user.', FALSE, TRUE, NOW(), NOW()),
  ('root-role.create', 'Create a system root role.', TRUE, TRUE, NOW(), NOW()),
  ('root-role.read', 'Read one system root role.', FALSE, TRUE, NOW(), NOW()),
  ('root-role.list', 'List system root roles.', FALSE, TRUE, NOW(), NOW()),
  ('root-role.update', 'Update editable system root-role metadata.', TRUE, TRUE, NOW(), NOW()),
  ('root-role.delete', 'Deactivate a system root role from future assignment.', TRUE, TRUE, NOW(), NOW()),
  ('root-role.reactivate', 'Reactivate a deactivated system root role.', TRUE, TRUE, NOW(), NOW()),
  ('root-role.capability-catalog.read', 'List eligible authz capabilities for root-role editing.', FALSE, TRUE, NOW(), NOW()),
  ('root-role.capability-assignment.read', 'Read assigned authz capabilities for a root role.', FALSE, TRUE, NOW(), NOW()),
  ('root-role.capability-assignment.update', 'Bulk update authz capability grants for a root role.', TRUE, TRUE, NOW(), NOW()),
  ('root-role.assignment.assign', 'Assign a root role to a root user.', TRUE, TRUE, NOW(), NOW()),
  ('root-role.assignment.unassign', 'Unassign a root role from a root user safely.', TRUE, TRUE, NOW(), NOW()),
  ('root-role.assignment.list', 'List root-role assignments for a root user.', FALSE, TRUE, NOW(), NOW()),
  ('root-role.assignment.replace', 'Atomically replace one root-role assignment with another.', TRUE, TRUE, NOW(), NOW()),
  ('root-role.effective-permissions.read', 'Read the effective permission set for a root user.', FALSE, TRUE, NOW(), NOW())
ON CONFLICT (capability_key)
DO UPDATE SET
  description = EXCLUDED.description,
  root_user_admin_default_mandatory = EXCLUDED.root_user_admin_default_mandatory,
  root_user_admin_default_protected = EXCLUDED.root_user_admin_default_protected,
  updated_at = NOW();

INSERT INTO system_root_roles (
  system_root_role_id,
  role_key,
  normalized_role_key,
  display_name,
  description,
  is_protected,
  created_at,
  updated_at,
  deactivated_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'RootUserAdmin',
  'rootuseradmin',
  'Root User Admin',
  'Protected bootstrap root operator role.',
  TRUE,
  NOW(),
  NOW(),
  NULL
)
ON CONFLICT (system_root_role_id)
DO UPDATE SET
  role_key = EXCLUDED.role_key,
  normalized_role_key = EXCLUDED.normalized_role_key,
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  is_protected = EXCLUDED.is_protected,
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
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();

INSERT INTO root_user_role_assignments (
  root_user_role_assignment_id,
  root_user_id,
  system_root_role_id,
  assigned_by_root_user_id,
  assigned_reason,
  assigned_at,
  updated_at,
  unassigned_at,
  unassigned_by_root_user_id,
  unassigned_reason
)
SELECT
  gen_random_uuid(),
  ru.root_user_id,
  '00000000-0000-0000-0000-000000000001',
  NULL,
  'bootstrap_root_user_admin_assignment',
  NOW(),
  NOW(),
  NULL,
  NULL,
  NULL
FROM root_users ru
LEFT JOIN root_user_role_assignments existing_assignment
  ON existing_assignment.root_user_id = ru.root_user_id
 AND existing_assignment.unassigned_at IS NULL
WHERE ru.anonymized = FALSE
  AND existing_assignment.root_user_role_assignment_id IS NULL;

CREATE OR REPLACE FUNCTION ensure_root_user_bootstrap_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.anonymized = TRUE THEN
    RETURN NEW;
  END IF;

  INSERT INTO root_user_role_assignments (
    root_user_role_assignment_id,
    root_user_id,
    system_root_role_id,
    assigned_by_root_user_id,
    assigned_reason,
    assigned_at,
    updated_at,
    unassigned_at,
    unassigned_by_root_user_id,
    unassigned_reason
  )
  SELECT
    gen_random_uuid(),
    NEW.root_user_id,
    role.system_root_role_id,
    NULL,
    'bootstrap_root_user_admin_assignment',
    NOW(),
    NOW(),
    NULL,
    NULL,
    NULL
  FROM system_root_roles role
  WHERE role.role_key = 'RootUserAdmin'
    AND role.deactivated_at IS NULL
    AND NOT EXISTS (
      SELECT 1
      FROM root_user_role_assignments existing_assignment
      WHERE existing_assignment.root_user_id = NEW.root_user_id
        AND existing_assignment.unassigned_at IS NULL
    );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_root_users_bootstrap_role_assignment ON root_users;

CREATE TRIGGER trg_root_users_bootstrap_role_assignment
AFTER INSERT ON root_users
FOR EACH ROW
EXECUTE FUNCTION ensure_root_user_bootstrap_role_assignment();
