ALTER TABLE web_app_modules
ADD COLUMN IF NOT EXISTS landing_page_web_app_page_id UUID NULL REFERENCES web_app_pages (web_app_page_id);

CREATE INDEX IF NOT EXISTS ix_web_app_modules_landing_page
  ON web_app_modules (landing_page_web_app_page_id)
  WHERE landing_page_web_app_page_id IS NOT NULL;
