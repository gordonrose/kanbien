CREATE TABLE IF NOT EXISTS root_users (
  root_user_id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  normalized_email TEXT NOT NULL,
  first_name TEXT NULL,
  normalized_first_name TEXT NULL,
  last_name TEXT NULL,
  normalized_last_name TEXT NULL,
  anonymized BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS root_users_active_normalized_email_uk
  ON root_users (normalized_email)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS root_users_normalized_first_name_idx
  ON root_users (normalized_first_name);

CREATE INDEX IF NOT EXISTS root_users_normalized_last_name_idx
  ON root_users (normalized_last_name);

CREATE INDEX IF NOT EXISTS root_users_created_at_idx
  ON root_users (created_at);

CREATE INDEX IF NOT EXISTS root_users_updated_at_idx
  ON root_users (updated_at);

CREATE INDEX IF NOT EXISTS root_users_deleted_at_idx
  ON root_users (deleted_at);

CREATE INDEX IF NOT EXISTS root_users_status_idx
  ON root_users (status);
