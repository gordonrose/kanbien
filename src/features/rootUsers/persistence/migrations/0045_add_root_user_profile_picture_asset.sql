ALTER TABLE root_users
  ADD COLUMN IF NOT EXISTS profile_picture_asset_id UUID NULL REFERENCES assets(asset_id),
  ADD COLUMN IF NOT EXISTS profile_picture_alt_text TEXT NULL,
  ADD COLUMN IF NOT EXISTS profile_picture_decorative BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_root_users_profile_picture_asset_id
  ON root_users(profile_picture_asset_id)
  WHERE profile_picture_asset_id IS NOT NULL;
