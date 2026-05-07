WITH kanban_column_family AS (
  SELECT design_system_canonical_family_id
  FROM design_system_canonical_families
  WHERE normalized_family_key = 'kanban-column'
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
    ('KCR-010', 'Drawer visible-column manager', 'The drawer-select seam shows selected visible columns and available hidden columns without archive content.', '/design-system/canonical-renderings/kanban-column/KCR-010', '/design-system/components/kanban-column?ref=KCR-010&width=1180&state=drawer-manager&theme=normal&dir=ltr&zoom=0', 'Desktop drawer manager lane', 1180, 'normal', 'ltr', 0, 'drawer-manager', '{"state":"drawer-manager"}'::jsonb, 100, TRUE),
    ('KCR-011', 'Hidden column card preservation', 'Hidden columns leave the active board while cards remain attached for later restore through the drawer-select seam.', '/design-system/canonical-renderings/kanban-column/KCR-011', '/design-system/components/kanban-column?ref=KCR-011&width=1180&state=hidden-preservation&theme=normal&dir=ltr&zoom=0', 'Desktop hidden-column lane', 1180, 'normal', 'ltr', 0, 'hidden-preservation', '{"state":"hidden-preservation"}'::jsonb, 110, FALSE),
    ('KCR-012', 'Archive education callout', 'The first archive action shows a drawer-pointing explanation with a Don''t show again flag.', '/design-system/canonical-renderings/kanban-column/KCR-012', '/design-system/components/kanban-column?ref=KCR-012&width=1180&state=archive-callout&theme=normal&dir=ltr&zoom=0', 'Desktop archive-callout lane', 1180, 'normal', 'ltr', 0, 'archive-callout', '{"state":"archive-callout"}'::jsonb, 120, FALSE),
    ('KCR-013', 'Restored archived column', 'A restored archived column returns to the board with its preserved card count and card content.', '/design-system/canonical-renderings/kanban-column/KCR-013', '/design-system/components/kanban-column?ref=KCR-013&width=1180&state=restored-archive&theme=normal&dir=ltr&zoom=0', 'Desktop restored-column lane', 1180, 'normal', 'ltr', 0, 'restored-archive', '{"state":"restored-archive"}'::jsonb, 130, FALSE),
    ('KCR-014', 'Non-drag moved card result', 'Button-based movement can place a card in a new visible column without relying on drag.', '/design-system/canonical-renderings/kanban-column/KCR-014', '/design-system/components/kanban-column?ref=KCR-014&width=1180&state=button-move-result&theme=normal&dir=ltr&zoom=0', 'Desktop non-drag movement lane', 1180, 'normal', 'ltr', 0, 'button-move-result', '{"state":"button-move-result"}'::jsonb, 140, FALSE),
    ('KCR-015', 'RTL board review', 'RTL stays scoped to the specimen while columns, counts, and movement controls remain legible.', '/design-system/canonical-renderings/kanban-column/KCR-015', '/design-system/components/kanban-column?ref=KCR-015&width=1180&state=rtl&theme=normal&dir=rtl&zoom=0', 'Desktop RTL lane', 1180, 'normal', 'rtl', 0, 'rtl', '{"state":"rtl"}'::jsonb, 150, FALSE),
    ('KCR-016', 'Magnified board review', 'Magnified text keeps controls readable without overlapping within cards or column headers.', '/design-system/canonical-renderings/kanban-column/KCR-016', '/design-system/components/kanban-column?ref=KCR-016&width=1180&state=magnified&theme=normal&dir=ltr&zoom=100', 'Desktop magnified lane', 1180, 'normal', 'ltr', 100, 'magnified', '{"state":"magnified"}'::jsonb, 160, FALSE),
    ('KCR-017', 'Accent and long-copy strain', 'A non-default accent plus long-copy strain keeps add, archive, count, and movement controls bounded.', '/design-system/canonical-renderings/kanban-column/KCR-017', '/design-system/components/kanban-column?ref=KCR-017&width=1180&state=accent-long&theme=normal&dir=ltr&zoom=0', 'Desktop accent strain lane', 1180, 'normal', 'ltr', 0, 'accent-long', '{"state":"accent-long","accent":"#0f766e"}'::jsonb, 170, FALSE)
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
  kanban_column_family.design_system_canonical_family_id,
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
CROSS JOIN kanban_column_family
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
