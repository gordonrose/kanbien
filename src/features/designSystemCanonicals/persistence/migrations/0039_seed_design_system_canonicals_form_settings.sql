WITH family_rows (
  design_system_canonical_family_id,
  family_key,
  normalized_family_key,
  display_label,
  family_kind,
  launcher_title,
  launcher_description,
  launcher_category,
  generated_launcher_route_path,
  legacy_launcher_route_path,
  source_surface_route_path,
  sort_order,
  featured
) AS (
  VALUES
    ('8fe182de-7f28-4d60-bc27-1fb723f83901'::uuid, 'display-settings', 'display-settings', 'Display Settings', 'pattern', 'Display Settings Canonical Renderings', 'Persistence-backed launcher for the signed-off display-settings payload canonical renderings.', 'navigation', '/design-system/canonical-renderings/display-settings', '/design-system/canonicals/display-settings', '/design-system/components/context-nav', 60, FALSE),
    ('8fe182de-7f28-4d60-bc27-1fb723f83902'::uuid, 'form-template', 'form-template', 'Form Template', 'template', 'Form Template Canonical Renderings', 'Persistence-backed launcher for the signed-off form-template canonical renderings.', 'templates', '/design-system/canonical-renderings/form-template', '/design-system/canonicals/form-template', '/design-system/templates/form', 100, FALSE),
    ('8fe182de-7f28-4d60-bc27-1fb723f83903'::uuid, 'icon-grid', 'icon-grid', 'Icon Grid', 'component', 'Icon Grid Canonical Renderings', 'Persistence-backed launcher for the signed-off icon-grid canonical renderings.', 'forms', '/design-system/canonical-renderings/icon-grid', '/design-system/canonicals/icon-grid', '/design-system/components/icon-grid', 110, FALSE)
)
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
SELECT
  family_rows.design_system_canonical_family_id,
  family_rows.family_key,
  family_rows.normalized_family_key,
  family_rows.display_label,
  family_rows.family_kind,
  family_rows.launcher_title,
  family_rows.launcher_description,
  family_rows.launcher_category,
  family_rows.generated_launcher_route_path,
  '/design-system/canonical-renderings',
  family_rows.legacy_launcher_route_path,
  family_rows.source_surface_route_path,
  'live',
  family_rows.sort_order,
  family_rows.featured,
  NOW(),
  NOW()
FROM family_rows
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

WITH reference_rows (
  normalized_family_key,
  reference_id,
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
  label_density_fixture,
  state_variant_key,
  specimen_payload,
  sort_order,
  featured
) AS (
  VALUES
    ('display-settings', 'DSR-001', 'Desktop grouped payload baseline', 'Display-settings payload baseline where grouped runtime controls are reviewed inside the signed-off desktop drawer shell.', '/design-system/canonical-renderings/display-settings/DSR-001', '/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=DSR-001', 'Desktop context-nav drawer payload', 1120, 760, 'normal', 'ltr', 0, 'standard', 'accessibility', '{"stack":"standard","labels":"standard","open":"accessibility","accent":"#635bff"}'::jsonb, 10, TRUE),
    ('display-settings', 'DSR-002', 'Dark theme and enlarged payload', 'Dark-theme magnified display-settings review keeps grouped controls readable inside the shared drawer shell.', '/design-system/canonical-renderings/display-settings/DSR-002', '/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=long&open=accessibility&theme=dark&dir=ltr&zoom=100&accent=%237c3aed&ref=DSR-002', 'Desktop dark magnified drawer payload', 1120, 760, 'dark', 'ltr', 100, 'long', 'accessibility-dark', '{"stack":"standard","labels":"long","open":"accessibility","accent":"#7c3aed"}'::jsonb, 20, TRUE),
    ('display-settings', 'DSR-003', 'RTL mirrored payload', 'RTL display-settings review mirrors the grouped body copy and control placement inside the drawer shell.', '/design-system/canonical-renderings/display-settings/DSR-003', '/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=DSR-003', 'Desktop RTL drawer payload', 1120, 760, 'normal', 'rtl', 0, 'standard', 'accessibility-rtl', '{"stack":"standard","labels":"standard","open":"accessibility","accent":"#635bff"}'::jsonb, 30, TRUE),
    ('display-settings', 'DSR-004', 'Mobile bottom-sheet payload', 'Mobile display-settings review keeps the full grouped payload usable inside the bottom-attached sheet.', '/design-system/canonical-renderings/display-settings/DSR-004', '/design-system/components/context-nav?width=560&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=DSR-004', 'Mobile bottom-sheet drawer payload', 560, 760, 'normal', 'ltr', 0, 'standard', 'accessibility-mobile', '{"stack":"standard","labels":"standard","open":"accessibility","accent":"#635bff"}'::jsonb, 40, TRUE),
    ('display-settings', 'DSR-005', 'Reduced magnification and accent sweep', 'Reduced-magnification display-settings review keeps the low-end scale and non-default accent reload-safe.', '/design-system/canonical-renderings/display-settings/DSR-005', '/design-system/components/context-nav?width=1120&height=760&stack=standard&labels=standard&open=accessibility&theme=normal&dir=ltr&zoom=-100&accent=%232563eb&ref=DSR-005', 'Desktop reduced magnification drawer payload', 1120, 760, 'normal', 'ltr', -100, 'standard', 'accessibility-reduced', '{"stack":"standard","labels":"standard","open":"accessibility","accent":"#2563eb"}'::jsonb, 50, FALSE),

    ('form-template', 'FTR-001', 'Desktop no-sidebar baseline', 'Desktop form-template baseline keeps the signed-off page shell, section cadence, and action rail visible.', '/design-system/canonical-renderings/form-template/FTR-001', '/design-system/templates/form?ref=FTR-001&theme=normal&dir=ltr&zoom=0', 'Desktop form template', NULL, NULL, 'normal', 'ltr', 0, NULL, 'baseline', '{"errors":false,"disabled":false,"mobile":false}'::jsonb, 10, TRUE),
    ('form-template', 'FTR-010', 'Normal-theme error review', 'Normal-theme error review exposes validation copy without changing the page rhythm.', '/design-system/canonical-renderings/form-template/FTR-010', '/design-system/templates/form?ref=FTR-010&theme=normal&dir=ltr&zoom=0&errors=true', 'Desktop form template', NULL, NULL, 'normal', 'ltr', 0, NULL, 'errors', '{"errors":true,"disabled":false,"mobile":false}'::jsonb, 20, FALSE),
    ('form-template', 'FTR-011', 'Dark-theme error review', 'Dark-theme error review keeps validation, section, and field copy readable.', '/design-system/canonical-renderings/form-template/FTR-011', '/design-system/templates/form?ref=FTR-011&theme=dark&dir=ltr&zoom=0&errors=true', 'Desktop dark form template', NULL, NULL, 'dark', 'ltr', 0, NULL, 'errors-dark', '{"errors":true,"disabled":false,"mobile":false}'::jsonb, 30, TRUE),
    ('form-template', 'FTR-012', 'Normal-theme disabled review', 'Normal-theme disabled review keeps form controls non-interactive without losing field affordance.', '/design-system/canonical-renderings/form-template/FTR-012', '/design-system/templates/form?ref=FTR-012&theme=normal&dir=ltr&zoom=0&disabled=true', 'Desktop form template', NULL, NULL, 'normal', 'ltr', 0, NULL, 'disabled', '{"errors":false,"disabled":true,"mobile":false}'::jsonb, 40, FALSE),
    ('form-template', 'FTR-013', 'Dark-theme disabled review', 'Dark-theme disabled review keeps inactive controls readable under the signed-off page shell.', '/design-system/canonical-renderings/form-template/FTR-013', '/design-system/templates/form?ref=FTR-013&theme=dark&dir=ltr&zoom=0&disabled=true', 'Desktop dark form template', NULL, NULL, 'dark', 'ltr', 0, NULL, 'disabled-dark', '{"errors":false,"disabled":true,"mobile":false}'::jsonb, 50, TRUE),
    ('form-template', 'FTR-014', 'Error plus disabled review', 'Combined error and disabled review keeps validation visible while preserving inactive control semantics.', '/design-system/canonical-renderings/form-template/FTR-014', '/design-system/templates/form?ref=FTR-014&theme=normal&dir=ltr&zoom=0&errors=true&disabled=true', 'Desktop form template', NULL, NULL, 'normal', 'ltr', 0, NULL, 'errors-disabled', '{"errors":true,"disabled":true,"mobile":false}'::jsonb, 60, FALSE),
    ('form-template', 'FTR-015', 'Mobile error review', 'Mobile error review keeps the single-column form stack readable with validation copy visible.', '/design-system/canonical-renderings/form-template/FTR-015', '/design-system/templates/form?ref=FTR-015&theme=normal&dir=ltr&zoom=0&errors=true&mobile=true', 'Mobile form template', NULL, NULL, 'normal', 'ltr', 0, NULL, 'mobile-errors', '{"errors":true,"disabled":false,"mobile":true}'::jsonb, 70, TRUE),
    ('form-template', 'FTR-016', 'Mobile disabled review', 'Mobile disabled review keeps the stacked form non-interactive without collapsing controls.', '/design-system/canonical-renderings/form-template/FTR-016', '/design-system/templates/form?ref=FTR-016&theme=normal&dir=ltr&zoom=0&disabled=true&mobile=true', 'Mobile form template', NULL, NULL, 'normal', 'ltr', 0, NULL, 'mobile-disabled', '{"errors":false,"disabled":true,"mobile":true}'::jsonb, 80, FALSE),
    ('form-template', 'FTR-017', 'RTL desktop review', 'RTL desktop review mirrors the form page while preserving section and action-zone rhythm.', '/design-system/canonical-renderings/form-template/FTR-017', '/design-system/templates/form?ref=FTR-017&theme=normal&dir=rtl&zoom=0', 'Desktop RTL form template', NULL, NULL, 'normal', 'rtl', 0, NULL, 'rtl', '{"errors":false,"disabled":false,"mobile":false}'::jsonb, 90, FALSE),
    ('form-template', 'FTR-018', 'RTL mobile review', 'RTL mobile review keeps the single-column form stack coherent under mirrored direction.', '/design-system/canonical-renderings/form-template/FTR-018', '/design-system/templates/form?ref=FTR-018&theme=normal&dir=rtl&zoom=0&mobile=true', 'Mobile RTL form template', NULL, NULL, 'normal', 'rtl', 0, NULL, 'rtl-mobile', '{"errors":false,"disabled":false,"mobile":true}'::jsonb, 100, TRUE),
    ('form-template', 'FTR-019', 'RTL magnified review', 'RTL magnified review keeps form sections readable under local scale pressure.', '/design-system/canonical-renderings/form-template/FTR-019', '/design-system/templates/form?ref=FTR-019&theme=normal&dir=rtl&zoom=100', 'Desktop RTL magnified form template', NULL, NULL, 'normal', 'rtl', 100, NULL, 'rtl-magnified', '{"errors":false,"disabled":false,"mobile":false}'::jsonb, 110, FALSE),

    ('icon-grid', 'IGR-001', 'Resting trigger with default governed selection', 'Closed icon-grid baseline keeps one governed icon selected inside the parent field shell.', '/design-system/canonical-renderings/icon-grid/IGR-001', '/design-system/components/icon-grid?ref=IGR-001&width=720&state=resting-default&theme=normal&dir=ltr&zoom=0', 'Single-field review lane', 720, NULL, 'normal', 'ltr', 0, NULL, 'resting-default', '{"state":"resting-default"}'::jsonb, 10, FALSE),
    ('icon-grid', 'IGR-002', 'Open modal with the full approved icon catalog', 'Open icon-grid review shows the full in-repo icon catalog inside the compact modal.', '/design-system/canonical-renderings/icon-grid/IGR-002', '/design-system/components/icon-grid?ref=IGR-002&width=720&state=open-full&theme=normal&dir=ltr&zoom=0', 'Single-field review lane', 720, NULL, 'normal', 'ltr', 0, NULL, 'open-full', '{"state":"open-full"}'::jsonb, 20, TRUE),
    ('icon-grid', 'IGR-003', 'Open modal narrowed to one search match', 'Search narrowing review keeps the icon-grid modal stable while only one icon matches.', '/design-system/canonical-renderings/icon-grid/IGR-003', '/design-system/components/icon-grid?ref=IGR-003&width=720&state=open-filtered&theme=normal&dir=ltr&zoom=0', 'Single-field review lane', 720, NULL, 'normal', 'ltr', 0, NULL, 'open-filtered', '{"state":"open-filtered"}'::jsonb, 30, TRUE),
    ('icon-grid', 'IGR-004', 'Trigger after choosing a different icon', 'Post-selection review keeps trigger glyph, label, and hidden value synchronized.', '/design-system/canonical-renderings/icon-grid/IGR-004', '/design-system/components/icon-grid?ref=IGR-004&width=720&state=selected-administrator&theme=normal&dir=ltr&zoom=0', 'Single-field review lane', 720, NULL, 'normal', 'ltr', 0, NULL, 'selected-administrator', '{"state":"selected-administrator"}'::jsonb, 40, FALSE),
    ('icon-grid', 'IGR-005', 'RTL open review with the same dense tooltip-first catalog', 'RTL open review keeps the dense tooltip-first icon catalog mirrored without changing the seam.', '/design-system/canonical-renderings/icon-grid/IGR-005', '/design-system/components/icon-grid?ref=IGR-005&width=720&state=open-full&theme=normal&dir=rtl&zoom=0', 'Single-field review lane', 720, NULL, 'normal', 'rtl', 0, NULL, 'open-full-rtl', '{"state":"open-full"}'::jsonb, 50, TRUE),
    ('icon-grid', 'IGR-006', 'Dark mobile open review with user-role search narrowing', 'Dark mobile review narrows the icon catalog to user-role matches under magnified compact pressure.', '/design-system/canonical-renderings/icon-grid/IGR-006', '/design-system/components/icon-grid?ref=IGR-006&width=390&state=open-user-search&theme=dark&dir=ltr&zoom=100', 'Mobile modal lane', 390, NULL, 'dark', 'ltr', 100, NULL, 'open-user-search', '{"state":"open-user-search"}'::jsonb, 60, TRUE)
),
canonical_families AS (
  SELECT design_system_canonical_family_id, normalized_family_key
  FROM design_system_canonical_families
  WHERE normalized_family_key IN ('display-settings', 'form-template', 'icon-grid')
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
  canonical_families.design_system_canonical_family_id,
  reference_rows.reference_id,
  lower(reference_rows.reference_id),
  reference_rows.display_label,
  reference_rows.description,
  reference_rows.render_route_path,
  reference_rows.legacy_render_route_path,
  reference_rows.viewport,
  reference_rows.width,
  reference_rows.height,
  reference_rows.theme,
  reference_rows.direction,
  reference_rows.zoom,
  NULL,
  reference_rows.label_density_fixture,
  reference_rows.state_variant_key,
  reference_rows.specimen_payload,
  'live',
  reference_rows.sort_order,
  reference_rows.featured,
  NOW(),
  NOW()
FROM reference_rows
JOIN canonical_families
  ON canonical_families.normalized_family_key = reference_rows.normalized_family_key
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
