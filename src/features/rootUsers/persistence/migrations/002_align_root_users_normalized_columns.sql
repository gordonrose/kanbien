ALTER TABLE root_users
  ADD COLUMN IF NOT EXISTS normalized_email TEXT;

ALTER TABLE root_users
  ADD COLUMN IF NOT EXISTS normalized_first_name TEXT NULL;

ALTER TABLE root_users
  ADD COLUMN IF NOT EXISTS normalized_last_name TEXT NULL;

UPDATE root_users
SET
  normalized_email = LOWER(TRIM(email)),
  normalized_first_name = CASE
    WHEN first_name IS NULL THEN NULL
    ELSE LOWER(TRIM(first_name))
  END,
  normalized_last_name = CASE
    WHEN last_name IS NULL THEN NULL
    ELSE LOWER(TRIM(last_name))
  END
WHERE normalized_email IS NULL
   OR normalized_first_name IS NULL AND first_name IS NOT NULL
   OR normalized_last_name IS NULL AND last_name IS NOT NULL;

ALTER TABLE root_users
  ALTER COLUMN normalized_email SET NOT NULL;

DROP INDEX IF EXISTS uq_root_users_email_active;
CREATE UNIQUE INDEX IF NOT EXISTS uq_root_users_email_active
  ON root_users (normalized_email)
  WHERE deleted_at IS NULL;

DROP INDEX IF EXISTS ix_root_users_email_prefix;
CREATE INDEX IF NOT EXISTS ix_root_users_email_prefix
  ON root_users (normalized_email);

DROP INDEX IF EXISTS ix_root_users_first_name_prefix;
CREATE INDEX IF NOT EXISTS ix_root_users_first_name_prefix
  ON root_users (normalized_first_name);

DROP INDEX IF EXISTS ix_root_users_last_name_prefix;
CREATE INDEX IF NOT EXISTS ix_root_users_last_name_prefix
  ON root_users (normalized_last_name);

DROP INDEX IF EXISTS root_users_active_normalized_email_uk;
DROP INDEX IF EXISTS root_users_normalized_first_name_idx;
DROP INDEX IF EXISTS root_users_normalized_last_name_idx;
DROP INDEX IF EXISTS root_users_created_at_idx;
DROP INDEX IF EXISTS root_users_updated_at_idx;
DROP INDEX IF EXISTS root_users_deleted_at_idx;
DROP INDEX IF EXISTS root_users_status_idx;
