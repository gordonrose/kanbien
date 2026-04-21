CREATE TABLE IF NOT EXISTS web_app_discovery_runs (
  web_app_discovery_run_id UUID PRIMARY KEY,
  scope_key TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'partial')),
  trigger_kind TEXT NOT NULL CHECK (trigger_kind IN ('manual', 'scheduled', 'bootstrap', 'startup-sync', 'topic-event')),
  provider_version TEXT NOT NULL,
  created_by_root_admin_user_id UUID NULL REFERENCES root_users (root_user_id),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NULL,
  failure_summary TEXT NULL,
  created_count INTEGER NOT NULL DEFAULT 0 CHECK (created_count >= 0),
  refreshed_count INTEGER NOT NULL DEFAULT 0 CHECK (refreshed_count >= 0),
  unchanged_count INTEGER NOT NULL DEFAULT 0 CHECK (unchanged_count >= 0),
  stale_count INTEGER NOT NULL DEFAULT 0 CHECK (stale_count >= 0),
  support_only_count INTEGER NOT NULL DEFAULT 0 CHECK (support_only_count >= 0),
  review_required_count INTEGER NOT NULL DEFAULT 0 CHECK (review_required_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_web_app_discovery_runs_status_started_at
  ON web_app_discovery_runs (status, started_at DESC);

CREATE INDEX IF NOT EXISTS ix_web_app_discovery_runs_scope_started_at
  ON web_app_discovery_runs (scope_key, started_at DESC);

CREATE TABLE IF NOT EXISTS discovered_web_app_surfaces (
  discovered_web_app_surface_id UUID PRIMARY KEY,
  root_family_id TEXT NOT NULL CHECK (root_family_id IN ('root-admin', 'login', 'design-system')),
  discovery_key TEXT NOT NULL,
  surface_kind TEXT NOT NULL CHECK (surface_kind IN ('page-route', 'shell-state', 'support-route', 'review-required')),
  locator_type TEXT NOT NULL CHECK (locator_type IN ('path', 'path-with-query-template', 'hash-state')),
  route_path TEXT NULL,
  route_hash TEXT NULL,
  canonical_locator TEXT NOT NULL,
  display_label TEXT NULL,
  user_facing_disposition TEXT NOT NULL CHECK (user_facing_disposition IN ('user-facing', 'support-only', 'review-required')),
  provider_key TEXT NOT NULL,
  implementation_source_path TEXT NULL,
  first_discovered_run_id UUID NOT NULL REFERENCES web_app_discovery_runs (web_app_discovery_run_id),
  last_discovered_run_id UUID NOT NULL REFERENCES web_app_discovery_runs (web_app_discovery_run_id),
  first_discovered_at TIMESTAMPTZ NOT NULL,
  last_discovered_at TIMESTAMPTZ NOT NULL,
  stale_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ck_discovered_web_app_surface_locator_consistency
    CHECK (
      (locator_type = 'hash-state' AND route_path IS NOT NULL AND route_hash IS NOT NULL)
      OR (locator_type IN ('path', 'path-with-query-template') AND route_path IS NOT NULL AND route_hash IS NULL)
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_discovered_web_app_surfaces_discovery_key
  ON discovered_web_app_surfaces (discovery_key);

CREATE UNIQUE INDEX IF NOT EXISTS uq_discovered_web_app_surfaces_canonical_locator
  ON discovered_web_app_surfaces (canonical_locator);

CREATE INDEX IF NOT EXISTS ix_discovered_web_app_surfaces_root_family_stale
  ON discovered_web_app_surfaces (root_family_id, user_facing_disposition, stale_at, last_discovered_at DESC);

CREATE INDEX IF NOT EXISTS ix_discovered_web_app_surfaces_provider_kind
  ON discovered_web_app_surfaces (provider_key, surface_kind, last_discovered_at DESC);

CREATE TABLE IF NOT EXISTS discovered_web_app_surface_observations (
  discovered_web_app_surface_observation_id UUID PRIMARY KEY,
  web_app_discovery_run_id UUID NOT NULL REFERENCES web_app_discovery_runs (web_app_discovery_run_id),
  discovered_web_app_surface_id UUID NOT NULL REFERENCES discovered_web_app_surfaces (discovered_web_app_surface_id),
  root_family_id TEXT NOT NULL CHECK (root_family_id IN ('root-admin', 'login', 'design-system')),
  surface_kind TEXT NOT NULL CHECK (surface_kind IN ('page-route', 'shell-state', 'support-route', 'review-required')),
  locator_type TEXT NOT NULL CHECK (locator_type IN ('path', 'path-with-query-template', 'hash-state')),
  route_path TEXT NULL,
  route_hash TEXT NULL,
  canonical_locator TEXT NOT NULL,
  display_label TEXT NULL,
  user_facing_disposition TEXT NOT NULL CHECK (user_facing_disposition IN ('user-facing', 'support-only', 'review-required')),
  provider_key TEXT NOT NULL,
  implementation_source_path TEXT NULL,
  observed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_discovered_web_app_surface_observations_run
  ON discovered_web_app_surface_observations (web_app_discovery_run_id, observed_at DESC);

CREATE INDEX IF NOT EXISTS ix_discovered_web_app_surface_observations_surface
  ON discovered_web_app_surface_observations (discovered_web_app_surface_id, observed_at DESC);
