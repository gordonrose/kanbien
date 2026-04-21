ALTER TABLE web_app_pages
  ADD COLUMN IF NOT EXISTS topology_state TEXT NOT NULL DEFAULT 'applied'
    CHECK (topology_state IN ('proposed', 'applied')),
  ADD COLUMN IF NOT EXISTS template_key TEXT NULL,
  ADD COLUMN IF NOT EXISTS materialized_at TIMESTAMPTZ NULL;

UPDATE web_app_pages
SET topology_state = 'applied'
WHERE topology_state IS DISTINCT FROM 'applied';

CREATE INDEX IF NOT EXISTS ix_web_app_pages_root_family_topology_state
  ON web_app_pages (root_family_id, topology_state, updated_at DESC);
