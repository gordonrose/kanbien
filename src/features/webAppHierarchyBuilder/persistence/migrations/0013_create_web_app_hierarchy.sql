CREATE TABLE IF NOT EXISTS web_app_root_families (
  root_family_id TEXT PRIMARY KEY,
  display_label TEXT NOT NULL,
  route_prefix TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_web_app_root_families_route_prefix
  ON web_app_root_families (route_prefix);

CREATE TABLE IF NOT EXISTS web_app_modules (
  web_app_module_id UUID PRIMARY KEY,
  root_family_id TEXT NOT NULL REFERENCES web_app_root_families (root_family_id),
  module_key TEXT NOT NULL,
  normalized_module_key TEXT NOT NULL,
  display_label TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'review', 'live', 'inactive')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_web_app_modules_normalized_module_key
  ON web_app_modules (normalized_module_key);

CREATE INDEX IF NOT EXISTS ix_web_app_modules_root_family_sort
  ON web_app_modules (root_family_id, sort_order ASC, normalized_module_key ASC);

CREATE TABLE IF NOT EXISTS web_app_pages (
  web_app_page_id UUID PRIMARY KEY,
  root_family_id TEXT NOT NULL REFERENCES web_app_root_families (root_family_id),
  web_app_module_id UUID NOT NULL REFERENCES web_app_modules (web_app_module_id),
  parent_page_id UUID NULL REFERENCES web_app_pages (web_app_page_id),
  placement_type TEXT NOT NULL CHECK (placement_type IN ('module-root', 'child-page', 'orphaned')),
  page_key TEXT NOT NULL,
  normalized_page_key TEXT NOT NULL,
  display_label TEXT NOT NULL,
  route_segment TEXT NOT NULL,
  normalized_route_segment TEXT NOT NULL,
  resolved_full_route_path TEXT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'review', 'live', 'inactive')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_by_root_admin_user_id UUID NOT NULL REFERENCES root_users (root_user_id),
  bootstrap_source TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (placement_type = 'child-page' AND parent_page_id IS NOT NULL)
    OR (placement_type IN ('module-root', 'orphaned') AND parent_page_id IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_web_app_pages_normalized_page_key
  ON web_app_pages (normalized_page_key);

CREATE UNIQUE INDEX IF NOT EXISTS uq_web_app_pages_module_root_route_segment
  ON web_app_pages (web_app_module_id, normalized_route_segment)
  WHERE placement_type = 'module-root' AND parent_page_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_web_app_pages_child_route_segment
  ON web_app_pages (parent_page_id, normalized_route_segment)
  WHERE placement_type = 'child-page' AND parent_page_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_web_app_pages_module_parent_sort
  ON web_app_pages (web_app_module_id, parent_page_id, sort_order ASC, normalized_page_key ASC);

CREATE INDEX IF NOT EXISTS ix_web_app_pages_root_family_status
  ON web_app_pages (root_family_id, status, updated_at DESC);

INSERT INTO web_app_root_families (
  root_family_id,
  display_label,
  route_prefix,
  sort_order,
  created_at,
  updated_at
)
VALUES
  ('root-admin', 'Root Admin', '/root-admin', 0, NOW(), NOW()),
  ('login', 'Login', '/login', 1, NOW(), NOW()),
  ('design-system', 'Design System', '/design-system', 2, NOW(), NOW())
ON CONFLICT (root_family_id)
DO UPDATE SET
  display_label = EXCLUDED.display_label,
  route_prefix = EXCLUDED.route_prefix,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO root_authz_capabilities (
  capability_key,
  description,
  root_user_admin_default_mandatory,
  root_user_admin_default_protected,
  created_at,
  updated_at
)
VALUES
  ('web-app-hierarchy.create-module', 'Create a web-app module within a root family.', TRUE, TRUE, NOW(), NOW()),
  ('web-app-hierarchy.update-module', 'Update editable web-app module metadata.', TRUE, TRUE, NOW(), NOW()),
  ('web-app-hierarchy.create-page', 'Create a durable web-app page node.', TRUE, TRUE, NOW(), NOW()),
  ('web-app-hierarchy.update-page', 'Update editable web-app page metadata.', TRUE, TRUE, NOW(), NOW()),
  ('web-app-hierarchy.move-page', 'Move or orphan a web-app page node safely.', TRUE, TRUE, NOW(), NOW()),
  ('web-app-hierarchy.read-tree', 'Read the resolved web-app hierarchy tree.', TRUE, TRUE, NOW(), NOW()),
  ('web-app-hierarchy.read-planner-options', 'Read planner-selectable hierarchy nodes.', TRUE, TRUE, NOW(), NOW()),
  ('web-app-hierarchy.list-orphans', 'List orphaned web-app pages for recovery workflows.', TRUE, TRUE, NOW(), NOW()),
  ('web-app-hierarchy.bootstrap', 'Bootstrap the web-app hierarchy from real navigable pages.', TRUE, TRUE, NOW(), NOW())
ON CONFLICT (capability_key)
DO UPDATE SET
  description = EXCLUDED.description,
  root_user_admin_default_mandatory = EXCLUDED.root_user_admin_default_mandatory,
  root_user_admin_default_protected = EXCLUDED.root_user_admin_default_protected,
  updated_at = NOW();

INSERT INTO system_root_role_capability_grants (
  system_root_role_capability_grant_id,
  system_root_role_id,
  capability_key,
  is_mandatory,
  is_protected,
  created_at,
  updated_at,
  revoked_at
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  c.capability_key,
  c.root_user_admin_default_mandatory,
  c.root_user_admin_default_protected,
  NOW(),
  NOW(),
  NULL
FROM root_authz_capabilities c
WHERE c.capability_key LIKE 'web-app-hierarchy.%'
ON CONFLICT (system_root_role_id, capability_key)
DO UPDATE SET
  is_mandatory = EXCLUDED.is_mandatory,
  is_protected = EXCLUDED.is_protected,
  revoked_at = NULL,
  updated_at = NOW();
