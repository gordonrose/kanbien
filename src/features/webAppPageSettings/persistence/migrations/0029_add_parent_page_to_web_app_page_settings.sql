ALTER TABLE web_app_page_settings
ADD COLUMN IF NOT EXISTS parent_page_id UUID NULL REFERENCES web_app_pages (web_app_page_id) ON DELETE SET NULL;

UPDATE web_app_page_settings AS settings
SET parent_page_id = pages.parent_page_id
FROM web_app_pages AS pages
WHERE settings.web_app_page_id = pages.web_app_page_id
  AND settings.parent_page_id IS DISTINCT FROM pages.parent_page_id;

CREATE INDEX IF NOT EXISTS ix_web_app_page_settings_parent_page
  ON web_app_page_settings (parent_page_id)
  WHERE parent_page_id IS NOT NULL;
