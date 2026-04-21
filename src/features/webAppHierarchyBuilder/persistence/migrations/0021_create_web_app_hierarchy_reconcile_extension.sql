CREATE TABLE IF NOT EXISTS web_app_page_locators (
  web_app_page_locator_id UUID PRIMARY KEY,
  web_app_page_id UUID NOT NULL REFERENCES web_app_pages (web_app_page_id),
  root_family_id TEXT NOT NULL REFERENCES web_app_root_families (root_family_id),
  locator_type TEXT NOT NULL CHECK (locator_type IN ('path', 'hash-state')),
  canonical_locator TEXT NOT NULL,
  route_path TEXT NOT NULL,
  route_hash TEXT NULL,
  normalized_locator_key TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by_root_admin_user_id UUID NULL REFERENCES root_users (root_user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (locator_type = 'path' AND route_hash IS NULL)
    OR (locator_type = 'hash-state' AND route_hash IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_web_app_page_locators_normalized_locator_key
  ON web_app_page_locators (normalized_locator_key);

CREATE UNIQUE INDEX IF NOT EXISTS uq_web_app_page_locators_active_page
  ON web_app_page_locators (web_app_page_id)
  WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS ix_web_app_page_locators_root_family
  ON web_app_page_locators (root_family_id, is_active, updated_at DESC);

INSERT INTO web_app_page_locators (
  web_app_page_locator_id,
  web_app_page_id,
  root_family_id,
  locator_type,
  canonical_locator,
  route_path,
  route_hash,
  normalized_locator_key,
  is_active,
  created_by_root_admin_user_id,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  p.web_app_page_id,
  p.root_family_id,
  'path',
  p.resolved_full_route_path,
  p.resolved_full_route_path,
  NULL,
  lower(p.resolved_full_route_path),
  TRUE,
  p.created_by_root_admin_user_id,
  NOW(),
  NOW()
FROM web_app_pages p
WHERE p.resolved_full_route_path IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM web_app_page_locators l
    WHERE l.web_app_page_id = p.web_app_page_id
      AND l.is_active = TRUE
  );

CREATE TABLE IF NOT EXISTS web_app_discovery_links (
  web_app_discovery_link_id UUID PRIMARY KEY,
  discovered_web_app_structure_node_id UUID NOT NULL UNIQUE
    REFERENCES discovered_web_app_structure_nodes (discovered_web_app_structure_node_id),
  discovered_web_app_surface_id UUID NULL
    REFERENCES discovered_web_app_surfaces (discovered_web_app_surface_id),
  root_family_id TEXT NOT NULL REFERENCES web_app_root_families (root_family_id),
  curated_target_type TEXT NOT NULL CHECK (curated_target_type IN ('module', 'page')),
  curated_web_app_module_id UUID NULL REFERENCES web_app_modules (web_app_module_id),
  curated_web_app_page_id UUID NULL REFERENCES web_app_pages (web_app_page_id),
  link_status TEXT NOT NULL CHECK (link_status IN ('matched', 'blocked', 'stale-discovered')),
  drift_status TEXT NOT NULL CHECK (
    drift_status IN (
      'none',
      'locator-drift',
      'placement-drift',
      'metadata-drift',
      'stale-discovered',
      'blocked-locator',
      'blocked-ambiguity'
    )
  ),
  drift_summary TEXT NULL,
  last_compared_web_app_discovery_run_id UUID NULL
    REFERENCES web_app_discovery_runs (web_app_discovery_run_id),
  last_matched_web_app_discovery_run_id UUID NULL
    REFERENCES web_app_discovery_runs (web_app_discovery_run_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (curated_target_type = 'module' AND curated_web_app_module_id IS NOT NULL AND curated_web_app_page_id IS NULL)
    OR (curated_target_type = 'page' AND curated_web_app_page_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS ix_web_app_discovery_links_root_family_status
  ON web_app_discovery_links (root_family_id, link_status, drift_status, updated_at DESC);

CREATE INDEX IF NOT EXISTS ix_web_app_discovery_links_target_module
  ON web_app_discovery_links (curated_web_app_module_id)
  WHERE curated_web_app_module_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_web_app_discovery_links_target_page
  ON web_app_discovery_links (curated_web_app_page_id)
  WHERE curated_web_app_page_id IS NOT NULL;
