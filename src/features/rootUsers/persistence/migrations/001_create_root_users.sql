CREATE TABLE IF NOT EXISTS root_users (
  root_user_id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NULL,
  last_name TEXT NULL,
  anonymized BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_root_users_email_active
  ON root_users (LOWER(email))
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_root_users_created_at ON root_users (created_at);
CREATE INDEX IF NOT EXISTS ix_root_users_updated_at ON root_users (updated_at);
CREATE INDEX IF NOT EXISTS ix_root_users_deleted_at ON root_users (deleted_at);
CREATE INDEX IF NOT EXISTS ix_root_users_status ON root_users (status);
CREATE INDEX IF NOT EXISTS ix_root_users_email_prefix ON root_users (LOWER(email));
CREATE INDEX IF NOT EXISTS ix_root_users_first_name_prefix ON root_users (LOWER(first_name));
CREATE INDEX IF NOT EXISTS ix_root_users_last_name_prefix ON root_users (LOWER(last_name));
CREATE INDEX IF NOT EXISTS ix_root_users_anonymized ON root_users (anonymized);
