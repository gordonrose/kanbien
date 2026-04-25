WITH canonical_family AS (
  SELECT design_system_canonical_family_id
  FROM design_system_canonical_families
  WHERE normalized_family_key = 'form-template'
),
reference_rows (
  reference_id,
  display_label,
  description,
  render_route_path,
  legacy_render_route_path,
  viewport,
  theme,
  direction,
  zoom,
  state_variant_key,
  specimen_payload,
  sort_order,
  featured
) AS (
  VALUES
    ('FTR-020', 'Upload in-progress review', 'Upload review shows the drag-and-click file field with deterministic in-progress status and progress affordance.', '/design-system/canonical-renderings/form-template/FTR-020', '/design-system/templates/form?ref=FTR-020&theme=normal&dir=ltr&zoom=0&upload=uploading', 'Desktop form template', 'normal', 'ltr', 0, 'uploading', '{"errors":false,"disabled":false,"mobile":false,"upload":"uploading"}'::jsonb, 120, TRUE),
    ('FTR-021', 'Upload error review', 'Upload error review keeps the failed upload state local to the field while the broader form error posture stays readable.', '/design-system/canonical-renderings/form-template/FTR-021', '/design-system/templates/form?ref=FTR-021&theme=normal&dir=ltr&zoom=0&errors=true&upload=error', 'Desktop form template', 'normal', 'ltr', 0, 'upload-error', '{"errors":true,"disabled":false,"mobile":false,"upload":"error"}'::jsonb, 130, TRUE)
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
  canonical_family.design_system_canonical_family_id,
  reference_rows.reference_id,
  lower(reference_rows.reference_id),
  reference_rows.display_label,
  reference_rows.description,
  reference_rows.render_route_path,
  reference_rows.legacy_render_route_path,
  reference_rows.viewport,
  NULL,
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
FROM canonical_family
CROSS JOIN reference_rows
ON CONFLICT (design_system_canonical_family_id, normalized_reference_id)
DO UPDATE SET
  display_label = EXCLUDED.display_label,
  description = EXCLUDED.description,
  render_route_path = EXCLUDED.render_route_path,
  legacy_render_route_path = EXCLUDED.legacy_render_route_path,
  viewport = EXCLUDED.viewport,
  theme = EXCLUDED.theme,
  direction = EXCLUDED.direction,
  zoom = EXCLUDED.zoom,
  state_variant_key = EXCLUDED.state_variant_key,
  specimen_payload = EXCLUDED.specimen_payload,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order,
  featured = EXCLUDED.featured,
  updated_at = NOW();
