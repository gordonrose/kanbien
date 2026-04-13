CREATE TABLE IF NOT EXISTS tenant_auth_policy (
  tenant_id UUID PRIMARY KEY REFERENCES tenant (tenant_id),
  min_length INTEGER NULL,
  max_length INTEGER NULL,
  min_uppercase INTEGER NULL,
  max_uppercase INTEGER NULL,
  min_lowercase INTEGER NULL,
  max_lowercase INTEGER NULL,
  min_numbers INTEGER NULL,
  max_numbers INTEGER NULL,
  min_symbols INTEGER NULL,
  max_symbols INTEGER NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE tenant_session
  ADD COLUMN IF NOT EXISTS remediation_required BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE tenant_session
  ADD COLUMN IF NOT EXISTS remediation_reason TEXT NULL CHECK (
    remediation_reason IN ('password_policy_upgrade_required')
  );

CREATE INDEX IF NOT EXISTS ix_tenant_session_remediation_active
  ON tenant_session (auth_principal_id, active_tenant_id, expires_at DESC)
  WHERE revoked_at IS NULL AND remediation_required = TRUE;
