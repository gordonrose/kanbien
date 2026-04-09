CREATE TABLE IF NOT EXISTS tenant_auth_principal (
  auth_principal_id UUID PRIMARY KEY,
  login_email TEXT NOT NULL,
  normalized_login_email TEXT NOT NULL,
  password_state TEXT NOT NULL CHECK (password_state IN ('setup_required', 'active')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  disabled_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_tenant_auth_principal_active_login_email
  ON tenant_auth_principal (normalized_login_email)
  WHERE disabled_at IS NULL;

CREATE TABLE IF NOT EXISTS tenant_password_credential (
  tenant_password_credential_id UUID PRIMARY KEY,
  auth_principal_id UUID NOT NULL UNIQUE REFERENCES tenant_auth_principal (auth_principal_id),
  password_hash TEXT NOT NULL,
  password_set_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS tenant_access_grant (
  tenant_access_grant_id UUID PRIMARY KEY,
  auth_principal_id UUID NOT NULL REFERENCES tenant_auth_principal (auth_principal_id),
  tenant_id UUID NOT NULL REFERENCES tenant (tenant_id),
  subject_type TEXT NOT NULL CHECK (subject_type IN ('tenant_admin')),
  subject_id UUID NOT NULL REFERENCES tenant_admin (tenant_admin_id),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_tenant_access_grant_active_subject
  ON tenant_access_grant (auth_principal_id, tenant_id, subject_type, subject_id)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_tenant_access_grant_auth_principal
  ON tenant_access_grant (auth_principal_id, created_at ASC)
  WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS tenant_password_setup_token (
  tenant_password_setup_token_id UUID PRIMARY KEY,
  auth_principal_id UUID NOT NULL REFERENCES tenant_auth_principal (auth_principal_id),
  source_tenant_admin_id UUID NOT NULL REFERENCES tenant_admin (tenant_admin_id),
  token_id UUID NOT NULL UNIQUE,
  purpose TEXT NOT NULL CHECK (purpose IN ('password_setup')),
  secret_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  invalidated_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_tenant_password_setup_token_active
  ON tenant_password_setup_token (auth_principal_id, created_at DESC)
  WHERE used_at IS NULL AND invalidated_at IS NULL;

CREATE TABLE IF NOT EXISTS tenant_session (
  session_id UUID PRIMARY KEY,
  auth_principal_id UUID NOT NULL REFERENCES tenant_auth_principal (auth_principal_id),
  active_tenant_id UUID NULL REFERENCES tenant (tenant_id),
  selection_required BOOLEAN NOT NULL,
  authenticated_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_tenant_session_auth_principal_active
  ON tenant_session (auth_principal_id, expires_at DESC)
  WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_tenant_session_expiry
  ON tenant_session (expires_at DESC);
