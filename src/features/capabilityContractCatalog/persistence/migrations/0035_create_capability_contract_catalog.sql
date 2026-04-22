CREATE TABLE capability_catalog_records (
  capability_catalog_record_id UUID PRIMARY KEY,
  capability_id TEXT NOT NULL UNIQUE,
  feature_name TEXT NOT NULL,
  display_label TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NULL,
  user_facing_outcome TEXT NULL,
  route_family TEXT NOT NULL,
  seam_type TEXT NOT NULL,
  capability_boundary TEXT NOT NULL,
  selection_group TEXT NOT NULL,
  http_method TEXT NULL,
  route_path TEXT NULL,
  governing_authz_capabilities TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  allowed_roles TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  supports_request_body BOOLEAN NOT NULL DEFAULT FALSE,
  supports_response_fields BOOLEAN NOT NULL DEFAULT FALSE,
  supports_filters BOOLEAN NOT NULL DEFAULT FALSE,
  lifecycle_status TEXT NOT NULL,
  normalized_hash TEXT NOT NULL,
  last_materialized_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX capability_catalog_records_feature_name_idx
  ON capability_catalog_records (feature_name, capability_id);

CREATE INDEX capability_catalog_records_route_family_idx
  ON capability_catalog_records (route_family);

CREATE INDEX capability_catalog_records_selection_group_idx
  ON capability_catalog_records (selection_group);

CREATE TABLE capability_catalog_fields (
  capability_catalog_field_id UUID PRIMARY KEY,
  capability_id TEXT NOT NULL REFERENCES capability_catalog_records (capability_id) ON DELETE CASCADE,
  contract_side TEXT NOT NULL,
  path TEXT NOT NULL,
  display_label TEXT NULL,
  description TEXT NULL,
  field_type TEXT NOT NULL,
  required BOOLEAN NOT NULL,
  nullable BOOLEAN NOT NULL DEFAULT FALSE,
  repeated BOOLEAN NOT NULL DEFAULT FALSE,
  format TEXT NULL,
  enum_values TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  system_managed BOOLEAN NOT NULL DEFAULT FALSE,
  normalization_steps TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  binding_hints TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  validation JSONB NULL,
  display_order INTEGER NOT NULL,
  UNIQUE (capability_id, contract_side, path)
);

CREATE TABLE capability_catalog_constraints (
  capability_catalog_constraint_id UUID PRIMARY KEY,
  capability_id TEXT NOT NULL REFERENCES capability_catalog_records (capability_id) ON DELETE CASCADE,
  constraint_kind TEXT NOT NULL,
  field_paths TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  message TEXT NOT NULL,
  display_order INTEGER NOT NULL
);

CREATE TABLE capability_catalog_source_references (
  capability_catalog_source_reference_id UUID PRIMARY KEY,
  capability_id TEXT NOT NULL REFERENCES capability_catalog_records (capability_id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_path TEXT NOT NULL,
  source_coverage TEXT NULL,
  UNIQUE (capability_id, source_type, source_path)
);

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('capability-contract-catalog.read', 'Read persisted capability contract catalog records.', FALSE, TRUE, NOW(), NOW()),
  ('capability-contract-catalog.export', 'Export deterministic capability contract catalog snapshots.', FALSE, TRUE, NOW(), NOW()),
  ('capability-contract-catalog.materialize', 'Materialize persisted capability contract catalog records from approved source truth.', FALSE, TRUE, NOW(), NOW()),
  ('capability-contract-catalog.audit-drift', 'Audit drift between persisted capability contract catalog truth and current approved sources.', FALSE, TRUE, NOW(), NOW())
ON CONFLICT (capability_key) DO NOTHING;

INSERT INTO system_root_role_capability_grants (
  system_root_role_capability_grant_id,
  system_root_role_id,
  capability_key,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  r.system_root_role_id,
  c.capability_key,
  NOW(),
  NOW()
FROM system_root_roles r
JOIN root_authz_capabilities c
  ON c.capability_key IN (
    'capability-contract-catalog.read',
    'capability-contract-catalog.export',
    'capability-contract-catalog.materialize',
    'capability-contract-catalog.audit-drift'
  )
WHERE r.role_key = 'RootUserAdmin'
ON CONFLICT (system_root_role_id, capability_key) DO NOTHING;
