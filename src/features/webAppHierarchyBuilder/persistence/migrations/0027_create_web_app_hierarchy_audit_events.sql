CREATE TABLE IF NOT EXISTS web_app_hierarchy_audit_events (
  web_app_hierarchy_audit_event_id UUID PRIMARY KEY,
  actor_root_user_id UUID NULL REFERENCES root_users (root_user_id),
  root_family_id TEXT NULL REFERENCES web_app_root_families (root_family_id),
  web_app_module_id UUID NULL REFERENCES web_app_modules (web_app_module_id),
  web_app_page_id UUID NULL REFERENCES web_app_pages (web_app_page_id),
  event_type TEXT NOT NULL,
  event_outcome TEXT NOT NULL CHECK (event_outcome IN ('success', 'failure')),
  reason TEXT NULL,
  before_state JSONB NULL,
  after_state JSONB NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_web_app_hierarchy_audit_events_occurred
  ON web_app_hierarchy_audit_events (occurred_at DESC);

CREATE INDEX IF NOT EXISTS ix_web_app_hierarchy_audit_events_root_family_occurred
  ON web_app_hierarchy_audit_events (root_family_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS ix_web_app_hierarchy_audit_events_module_occurred
  ON web_app_hierarchy_audit_events (web_app_module_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS ix_web_app_hierarchy_audit_events_page_occurred
  ON web_app_hierarchy_audit_events (web_app_page_id, occurred_at DESC);
