ALTER TABLE tenant_auth_policy
  ADD COLUMN IF NOT EXISTS session_ttl_seconds INTEGER NULL;
