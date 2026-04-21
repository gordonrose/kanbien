CREATE TABLE IF NOT EXISTS web_app_page_settings (
  web_app_page_settings_id UUID PRIMARY KEY,
  web_app_page_id UUID NOT NULL REFERENCES web_app_pages (web_app_page_id) ON DELETE CASCADE,
  icon_key TEXT NULL,
  show_in_top_nav BOOLEAN NOT NULL DEFAULT FALSE,
  top_nav_order INTEGER NULL,
  page_template_key TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_web_app_page_settings_page UNIQUE (web_app_page_id)
);

CREATE INDEX IF NOT EXISTS ix_web_app_page_settings_top_nav
  ON web_app_page_settings (show_in_top_nav, top_nav_order ASC, web_app_page_id ASC);

CREATE TABLE IF NOT EXISTS web_app_page_context_nav_items (
  web_app_page_context_nav_item_id UUID PRIMARY KEY,
  owner_web_app_page_id UUID NOT NULL REFERENCES web_app_pages (web_app_page_id) ON DELETE CASCADE,
  target_web_app_page_id UUID NOT NULL REFERENCES web_app_pages (web_app_page_id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_web_app_page_context_nav_owner_target UNIQUE (
    owner_web_app_page_id,
    target_web_app_page_id
  )
);

CREATE INDEX IF NOT EXISTS ix_web_app_page_context_nav_owner_sort
  ON web_app_page_context_nav_items (owner_web_app_page_id, sort_order ASC, target_web_app_page_id ASC);
