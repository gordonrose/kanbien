ALTER TABLE web_app_discovery_runs
  ADD COLUMN IF NOT EXISTS structure_created_count INTEGER NOT NULL DEFAULT 0 CHECK (structure_created_count >= 0),
  ADD COLUMN IF NOT EXISTS structure_refreshed_count INTEGER NOT NULL DEFAULT 0 CHECK (structure_refreshed_count >= 0),
  ADD COLUMN IF NOT EXISTS structure_unchanged_count INTEGER NOT NULL DEFAULT 0 CHECK (structure_unchanged_count >= 0),
  ADD COLUMN IF NOT EXISTS structure_stale_count INTEGER NOT NULL DEFAULT 0 CHECK (structure_stale_count >= 0);

CREATE TABLE IF NOT EXISTS discovered_web_app_structure_nodes (
  discovered_web_app_structure_node_id UUID PRIMARY KEY,
  root_family_id TEXT NOT NULL CHECK (root_family_id IN ('root-admin', 'login', 'design-system')),
  structure_key TEXT NOT NULL,
  parent_structure_key TEXT NULL,
  parent_discovered_web_app_structure_node_id UUID NULL REFERENCES discovered_web_app_structure_nodes (discovered_web_app_structure_node_id),
  node_key TEXT NOT NULL,
  node_kind TEXT NOT NULL CHECK (
    node_kind IN (
      'root',
      'group',
      'page-surface',
      'shell-state-surface',
      'support-surface',
      'review-required-surface'
    )
  ),
  display_label TEXT NULL,
  depth INTEGER NOT NULL CHECK (depth >= 0),
  linked_discovered_web_app_surface_id UUID NULL REFERENCES discovered_web_app_surfaces (discovered_web_app_surface_id),
  provider_key TEXT NOT NULL,
  implementation_source_path TEXT NULL,
  first_discovered_run_id UUID NOT NULL REFERENCES web_app_discovery_runs (web_app_discovery_run_id),
  last_discovered_run_id UUID NOT NULL REFERENCES web_app_discovery_runs (web_app_discovery_run_id),
  first_discovered_at TIMESTAMPTZ NOT NULL,
  last_discovered_at TIMESTAMPTZ NOT NULL,
  stale_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_discovered_web_app_structure_nodes_structure_key UNIQUE (structure_key),
  CONSTRAINT ck_discovered_web_app_structure_nodes_root_consistency CHECK (
    (depth = 0 AND parent_structure_key IS NULL AND parent_discovered_web_app_structure_node_id IS NULL AND node_kind = 'root')
    OR (depth > 0 AND parent_structure_key IS NOT NULL)
  ),
  CONSTRAINT ck_discovered_web_app_structure_nodes_linked_surface_consistency CHECK (
    (node_kind IN ('root', 'group') AND linked_discovered_web_app_surface_id IS NULL)
    OR (node_kind NOT IN ('root', 'group') AND linked_discovered_web_app_surface_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS ix_discovered_web_app_structure_nodes_root_family_stale
  ON discovered_web_app_structure_nodes (root_family_id, stale_at, depth, structure_key);

CREATE INDEX IF NOT EXISTS ix_discovered_web_app_structure_nodes_parent
  ON discovered_web_app_structure_nodes (
    parent_discovered_web_app_structure_node_id,
    depth,
    structure_key
  );

CREATE INDEX IF NOT EXISTS ix_discovered_web_app_structure_nodes_linked_surface
  ON discovered_web_app_structure_nodes (linked_discovered_web_app_surface_id);

CREATE TABLE IF NOT EXISTS discovered_web_app_structure_observations (
  discovered_web_app_structure_observation_id UUID PRIMARY KEY,
  web_app_discovery_run_id UUID NOT NULL REFERENCES web_app_discovery_runs (web_app_discovery_run_id),
  discovered_web_app_structure_node_id UUID NOT NULL REFERENCES discovered_web_app_structure_nodes (discovered_web_app_structure_node_id),
  root_family_id TEXT NOT NULL CHECK (root_family_id IN ('root-admin', 'login', 'design-system')),
  structure_key TEXT NOT NULL,
  parent_structure_key TEXT NULL,
  parent_discovered_web_app_structure_node_id UUID NULL REFERENCES discovered_web_app_structure_nodes (discovered_web_app_structure_node_id),
  node_key TEXT NOT NULL,
  node_kind TEXT NOT NULL CHECK (
    node_kind IN (
      'root',
      'group',
      'page-surface',
      'shell-state-surface',
      'support-surface',
      'review-required-surface'
    )
  ),
  display_label TEXT NULL,
  depth INTEGER NOT NULL CHECK (depth >= 0),
  linked_discovered_web_app_surface_id UUID NULL REFERENCES discovered_web_app_surfaces (discovered_web_app_surface_id),
  provider_key TEXT NOT NULL,
  implementation_source_path TEXT NULL,
  observed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_discovered_web_app_structure_observations_run
  ON discovered_web_app_structure_observations (web_app_discovery_run_id, observed_at DESC);

CREATE INDEX IF NOT EXISTS ix_discovered_web_app_structure_observations_node
  ON discovered_web_app_structure_observations (
    discovered_web_app_structure_node_id,
    observed_at DESC
  );
