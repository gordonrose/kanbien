INSERT INTO design_system_canonical_families (
  design_system_canonical_family_id,
  family_key,
  normalized_family_key,
  display_label,
  family_kind,
  launcher_title,
  launcher_description,
  launcher_category,
  generated_launcher_route_path,
  generated_root_route_path,
  legacy_launcher_route_path,
  source_surface_route_path,
  status,
  sort_order,
  featured,
  created_at,
  updated_at
)
VALUES (
  '26719c76-e26a-46c4-8c39-d1d3de6880ca',
  'simple-select',
  'simple-select',
  'Simple Select',
  'component',
  'Simple Select Canonical Renderings',
  'Persistence-backed launcher for the approved simple-select canonical renderings.',
  'forms',
  '/design-system/canonical-renderings/simple-select',
  '/design-system/canonical-renderings',
  '/design-system/canonicals/simple-select',
  '/design-system/components/simple-select',
  'live',
  40,
  FALSE,
  NOW(),
  NOW()
)
ON CONFLICT (normalized_family_key)
DO UPDATE SET
  display_label = EXCLUDED.display_label,
  family_kind = EXCLUDED.family_kind,
  launcher_title = EXCLUDED.launcher_title,
  launcher_description = EXCLUDED.launcher_description,
  launcher_category = EXCLUDED.launcher_category,
  generated_launcher_route_path = EXCLUDED.generated_launcher_route_path,
  generated_root_route_path = EXCLUDED.generated_root_route_path,
  legacy_launcher_route_path = EXCLUDED.legacy_launcher_route_path,
  source_surface_route_path = EXCLUDED.source_surface_route_path,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  featured = EXCLUDED.featured,
  updated_at = NOW();

WITH simple_select_family AS (
  SELECT design_system_canonical_family_id
  FROM design_system_canonical_families
  WHERE normalized_family_key = 'simple-select'
),
reference_rows (
  reference_id,
  display_label,
  description,
  render_route_path,
  legacy_render_route_path,
  viewport,
  width,
  theme,
  direction,
  zoom,
  state_variant_key,
  specimen_payload,
  sort_order,
  featured
) AS (
  VALUES
    ('SSR-001', 'Default closed baseline', 'Resting child seam with parent-owned framing still visible around it.', '/design-system/canonical-renderings/simple-select/SSR-001', '/design-system/components/simple-select?ref=SSR-001&width=420&state=baseline&theme=normal&dir=ltr&zoom=0', 'Component field lane', 420, 'normal', 'ltr', 0, 'baseline', '{"state":"baseline","selectedValue":"all-active-tenants","disabled":false}'::jsonb, 10, FALSE),
    ('SSR-002', 'Open anchored listbox with option-focus handoff', 'The open seam keeps focus in the option stack instead of leaving it parked on the trigger.', '/design-system/canonical-renderings/simple-select/SSR-002', '/design-system/components/simple-select?ref=SSR-002&width=420&state=open&theme=normal&dir=ltr&zoom=0', 'Component field lane', 420, 'normal', 'ltr', 0, 'open', '{"state":"open","selectedValue":"all-active-tenants","disabled":false}'::jsonb, 20, TRUE),
    ('SSR-003', 'Selected-option reflection after choice', 'Trigger label, hidden value, and selected option stay synchronized after a choice.', '/design-system/canonical-renderings/simple-select/SSR-003', '/design-system/components/simple-select?ref=SSR-003&width=420&state=selected&theme=normal&dir=ltr&zoom=0', 'Component field lane', 420, 'normal', 'ltr', 0, 'selected', '{"state":"selected","selectedValue":"trial-tenants","disabled":false}'::jsonb, 30, TRUE),
    ('SSR-004', 'Disabled inherited state', 'Disabled posture is inherited from parent review state instead of a child-specific API.', '/design-system/canonical-renderings/simple-select/SSR-004', '/design-system/components/simple-select?ref=SSR-004&width=420&state=disabled&theme=normal&dir=ltr&zoom=0', 'Component field lane', 420, 'normal', 'ltr', 0, 'disabled', '{"state":"disabled","selectedValue":"all-active-tenants","disabled":true}'::jsonb, 40, TRUE),
    ('SSR-005', 'RTL open state', 'The anchored listbox keeps the same behavior while directionality mirrors within the local child seam.', '/design-system/canonical-renderings/simple-select/SSR-005', '/design-system/components/simple-select?ref=SSR-005&width=420&state=open&theme=normal&dir=rtl&zoom=0', 'Component field lane', 420, 'normal', 'rtl', 0, 'open-rtl', '{"state":"open","selectedValue":"all-active-tenants","disabled":false}'::jsonb, 50, TRUE),
    ('SSR-006', 'Theme-stress open state', 'The same lightweight listbox behavior stays readable under the non-default dark theme.', '/design-system/canonical-renderings/simple-select/SSR-006', '/design-system/components/simple-select?ref=SSR-006&width=420&state=open&theme=dark&dir=ltr&zoom=0', 'Component field lane', 420, 'dark', 'ltr', 0, 'open-dark', '{"state":"open","selectedValue":"all-active-tenants","disabled":false}'::jsonb, 60, TRUE)
)
INSERT INTO design_system_canonical_references (
  design_system_canonical_reference_id,
  design_system_canonical_family_id,
  reference_id,
  normalized_reference_id,
  display_label,
  description,
  render_route_path,
  legacy_render_route_path,
  viewport,
  width,
  height,
  theme,
  direction,
  zoom,
  locale_fixture,
  label_density_fixture,
  state_variant_key,
  specimen_payload,
  status,
  sort_order,
  featured,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  simple_select_family.design_system_canonical_family_id,
  reference_rows.reference_id,
  lower(reference_rows.reference_id),
  reference_rows.display_label,
  reference_rows.description,
  reference_rows.render_route_path,
  reference_rows.legacy_render_route_path,
  reference_rows.viewport,
  reference_rows.width,
  NULL,
  reference_rows.theme,
  reference_rows.direction,
  reference_rows.zoom,
  NULL,
  NULL,
  reference_rows.state_variant_key,
  reference_rows.specimen_payload,
  'live',
  reference_rows.sort_order,
  reference_rows.featured,
  NOW(),
  NOW()
FROM reference_rows
CROSS JOIN simple_select_family
ON CONFLICT (design_system_canonical_family_id, normalized_reference_id)
DO UPDATE SET
  display_label = EXCLUDED.display_label,
  description = EXCLUDED.description,
  render_route_path = EXCLUDED.render_route_path,
  legacy_render_route_path = EXCLUDED.legacy_render_route_path,
  viewport = EXCLUDED.viewport,
  width = EXCLUDED.width,
  height = EXCLUDED.height,
  theme = EXCLUDED.theme,
  direction = EXCLUDED.direction,
  zoom = EXCLUDED.zoom,
  locale_fixture = EXCLUDED.locale_fixture,
  label_density_fixture = EXCLUDED.label_density_fixture,
  state_variant_key = EXCLUDED.state_variant_key,
  specimen_payload = EXCLUDED.specimen_payload,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  featured = EXCLUDED.featured,
  updated_at = NOW();
