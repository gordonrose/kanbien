CREATE TABLE IF NOT EXISTS design_system_canonical_families (
  design_system_canonical_family_id UUID PRIMARY KEY,
  family_key TEXT NOT NULL,
  normalized_family_key TEXT NOT NULL UNIQUE,
  display_label TEXT NOT NULL,
  family_kind TEXT NOT NULL,
  launcher_title TEXT NOT NULL,
  launcher_description TEXT NOT NULL,
  launcher_category TEXT NULL,
  generated_launcher_route_path TEXT NOT NULL UNIQUE,
  generated_root_route_path TEXT NOT NULL UNIQUE,
  legacy_launcher_route_path TEXT NULL,
  source_surface_route_path TEXT NULL,
  status TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT design_system_canonical_families_family_kind_check
    CHECK (family_kind IN ('component', 'pattern', 'template')),
  CONSTRAINT design_system_canonical_families_status_check
    CHECK (status IN ('draft', 'review', 'live', 'inactive'))
);

CREATE TABLE IF NOT EXISTS design_system_canonical_references (
  design_system_canonical_reference_id UUID PRIMARY KEY,
  design_system_canonical_family_id UUID NOT NULL REFERENCES design_system_canonical_families (design_system_canonical_family_id) ON DELETE CASCADE,
  reference_id TEXT NOT NULL,
  normalized_reference_id TEXT NOT NULL,
  display_label TEXT NOT NULL,
  description TEXT NOT NULL,
  render_route_path TEXT NOT NULL UNIQUE,
  legacy_render_route_path TEXT NULL,
  viewport TEXT NULL,
  width INTEGER NULL,
  height INTEGER NULL,
  theme TEXT NOT NULL,
  direction TEXT NOT NULL,
  zoom INTEGER NOT NULL DEFAULT 0,
  locale_fixture TEXT NULL,
  label_density_fixture TEXT NULL,
  state_variant_key TEXT NULL,
  specimen_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT design_system_canonical_references_status_check
    CHECK (status IN ('draft', 'review', 'live', 'inactive')),
  CONSTRAINT design_system_canonical_references_zoom_check
    CHECK (zoom >= -100 AND zoom <= 100),
  CONSTRAINT design_system_canonical_references_family_reference_unique
    UNIQUE (design_system_canonical_family_id, normalized_reference_id)
);

CREATE INDEX IF NOT EXISTS design_system_canonical_references_family_sort_idx
  ON design_system_canonical_references (design_system_canonical_family_id, sort_order, normalized_reference_id);

