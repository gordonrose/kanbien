ALTER TABLE design_system_canonical_families
  DROP CONSTRAINT IF EXISTS design_system_canonical_families_generated_root_route_path_key;

CREATE INDEX IF NOT EXISTS design_system_canonical_families_generated_root_route_path_idx
  ON design_system_canonical_families (generated_root_route_path);

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
  '8c334eb1-4a8d-4b86-90af-9664f5aa4f61',
  'top-nav',
  'top-nav',
  'Top Nav',
  'component',
  'Top Nav Canonical Renderings',
  'Persistence-backed launcher for the approved top-nav canonical renderings.',
  'navigation',
  '/design-system/canonical-renderings/top-nav',
  '/design-system/canonical-renderings',
  '/design-system/canonicals/top-nav',
  '/design-system/components/top-nav',
  'live',
  20,
  TRUE,
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

WITH top_nav_family AS (
  SELECT design_system_canonical_family_id
  FROM design_system_canonical_families
  WHERE normalized_family_key = 'top-nav'
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
    ('TRP-001', 'Desktop default', 'Desktop baseline with full primary navigation visible, profile controls closed, and no overflow pressure.', '/design-system/canonical-renderings/top-nav/TRP-001', '/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-001', 'Dedicated top-nav canonical render surface.', 1120, 'normal', 'ltr', 0, 'desktop-default', '{"fixture":"standard","open":"closed","accent":"#635bff"}'::jsonb, 10, TRUE),
    ('TRP-002', 'Desktop overflow', 'Desktop shell under width pressure where overflow activates before overlap or utility collision.', '/design-system/canonical-renderings/top-nav/TRP-002', '/design-system/components/top-nav?width=880&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-002', 'Dedicated top-nav canonical render surface.', 880, 'normal', 'ltr', 0, 'desktop-overflow', '{"fixture":"standard","open":"closed","accent":"#635bff"}'::jsonb, 20, TRUE),
    ('TRP-003', 'Desktop threshold before mobile', 'Desktop threshold state that must not degrade into the disallowed `1 item + More` layout.', '/design-system/canonical-renderings/top-nav/TRP-003', '/design-system/components/top-nav?width=760&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-003', 'Dedicated top-nav canonical render surface.', 760, 'normal', 'ltr', 0, 'desktop-threshold', '{"fixture":"standard","open":"closed","accent":"#635bff"}'::jsonb, 30, FALSE),
    ('TRP-004', 'Mobile shell closed', 'Mobile shell with the collapsed navigation chrome closed.', '/design-system/canonical-renderings/top-nav/TRP-004', '/design-system/components/top-nav?width=560&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-004', 'Dedicated top-nav canonical render surface.', 560, 'normal', 'ltr', 0, 'mobile-closed', '{"fixture":"standard","open":"closed","accent":"#635bff"}'::jsonb, 40, FALSE),
    ('TRP-005', 'Mobile shell open', 'Mobile shell with the primary navigation exposed as the full open mobile menu.', '/design-system/canonical-renderings/top-nav/TRP-005', '/design-system/components/top-nav?width=560&fixture=standard&open=mobile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-005', 'Dedicated top-nav canonical render surface.', 560, 'normal', 'ltr', 0, 'mobile-open', '{"fixture":"standard","open":"mobile","accent":"#635bff"}'::jsonb, 50, TRUE),
    ('TRP-006', 'Profile menu open', 'Desktop shell with the profile menu open and anchored to the utility region.', '/design-system/canonical-renderings/top-nav/TRP-006', '/design-system/components/top-nav?width=1120&fixture=standard&open=profile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-006', 'Dedicated top-nav canonical render surface.', 1120, 'normal', 'ltr', 0, 'profile-open', '{"fixture":"standard","open":"profile","accent":"#635bff"}'::jsonb, 60, FALSE),
    ('TRP-007', 'Overflow menu open', 'Desktop overflow state with the `More` menu open and derived from the hidden primary destinations.', '/design-system/canonical-renderings/top-nav/TRP-007', '/design-system/components/top-nav?width=880&fixture=standard&open=overflow&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-007', 'Dedicated top-nav canonical render surface.', 880, 'normal', 'ltr', 0, 'overflow-open', '{"fixture":"standard","open":"overflow","accent":"#635bff"}'::jsonb, 70, TRUE),
    ('TRP-008', 'RTL desktop', 'RTL desktop shell with native-feeling mirrored alignment and preserved utility separation.', '/design-system/canonical-renderings/top-nav/TRP-008', '/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=TRP-008', 'Dedicated top-nav canonical render surface.', 1120, 'normal', 'rtl', 0, 'rtl-desktop', '{"fixture":"standard","open":"closed","accent":"#635bff"}'::jsonb, 80, TRUE),
    ('TRP-009', 'RTL mobile', 'RTL mobile shell with the open mobile navigation and mirrored utility grammar.', '/design-system/canonical-renderings/top-nav/TRP-009', '/design-system/components/top-nav?width=560&fixture=standard&open=mobile&theme=normal&dir=rtl&zoom=0&accent=%23635bff&ref=TRP-009', 'Dedicated top-nav canonical render surface.', 560, 'normal', 'rtl', 0, 'rtl-mobile', '{"fixture":"standard","open":"mobile","accent":"#635bff"}'::jsonb, 90, FALSE),
    ('TRP-010', 'Magnified desktop', 'Magnified desktop shell with long labels, requiring overflow or mobile fallback before crowding.', '/design-system/canonical-renderings/top-nav/TRP-010', '/design-system/components/top-nav?width=880&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=100&accent=%23635bff&ref=TRP-010', 'Dedicated top-nav canonical render surface.', 880, 'normal', 'ltr', 100, 'magnified-desktop', '{"fixture":"long-labels","open":"closed","accent":"#635bff"}'::jsonb, 100, TRUE),
    ('TRP-011', 'Long brand label', 'Desktop shell with an intentionally long brand label that must yield without distorting the brand mark.', '/design-system/canonical-renderings/top-nav/TRP-011', '/design-system/components/top-nav?width=1120&fixture=long-labels&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-011', 'Dedicated top-nav canonical render surface.', 1120, 'normal', 'ltr', 0, 'long-brand-label', '{"fixture":"long-labels","open":"closed","accent":"#635bff"}'::jsonb, 110, FALSE),
    ('TRP-012', 'Long primary label', 'Desktop overflow state with long primary destination labels preserved through overflow rather than overlap.', '/design-system/canonical-renderings/top-nav/TRP-012', '/design-system/components/top-nav?width=880&fixture=long-labels&open=overflow&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-012', 'Dedicated top-nav canonical render surface.', 880, 'normal', 'ltr', 0, 'long-primary-label', '{"fixture":"long-labels","open":"overflow","accent":"#635bff"}'::jsonb, 120, FALSE),
    ('TRP-013', 'Long profile label', 'Desktop shell with long profile and menu labels open in the utility menu.', '/design-system/canonical-renderings/top-nav/TRP-013', '/design-system/components/top-nav?width=1120&fixture=long-labels&open=profile&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-013', 'Dedicated top-nav canonical render surface.', 1120, 'normal', 'ltr', 0, 'long-profile-label', '{"fixture":"long-labels","open":"profile","accent":"#635bff"}'::jsonb, 130, FALSE),
    ('TRP-014A', 'Theme normal', 'Normal theme baseline for top-nav readability and contrast.', '/design-system/canonical-renderings/top-nav/TRP-014A', '/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-014A', 'Dedicated top-nav canonical render surface.', 1120, 'normal', 'ltr', 0, 'theme-normal', '{"fixture":"standard","open":"closed","accent":"#635bff"}'::jsonb, 140, FALSE),
    ('TRP-014B', 'Theme dark', 'Dark theme top-nav state used for cross-theme readability review.', '/design-system/canonical-renderings/top-nav/TRP-014B', '/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=dark&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-014B', 'Dedicated top-nav canonical render surface.', 1120, 'dark', 'ltr', 0, 'theme-dark', '{"fixture":"standard","open":"closed","accent":"#635bff"}'::jsonb, 150, TRUE),
    ('TRP-014C', 'Theme desert', 'Desert theme top-nav state used for cross-theme readability review.', '/design-system/canonical-renderings/top-nav/TRP-014C', '/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=desert&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-014C', 'Dedicated top-nav canonical render surface.', 1120, 'desert', 'ltr', 0, 'theme-desert', '{"fixture":"standard","open":"closed","accent":"#635bff"}'::jsonb, 160, FALSE),
    ('TRP-015A', 'Accent indigo', 'Default indigo accent inheritance for the shell.', '/design-system/canonical-renderings/top-nav/TRP-015A', '/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%23635bff&ref=TRP-015A', 'Dedicated top-nav canonical render surface.', 1120, 'normal', 'ltr', 0, 'accent-indigo', '{"fixture":"standard","open":"closed","accent":"#635bff"}'::jsonb, 170, FALSE),
    ('TRP-015B', 'Accent violet', 'Alternate violet accent inheritance for the shell.', '/design-system/canonical-renderings/top-nav/TRP-015B', '/design-system/components/top-nav?width=1120&fixture=standard&open=closed&theme=normal&dir=ltr&zoom=0&accent=%237c3aed&ref=TRP-015B', 'Dedicated top-nav canonical render surface.', 1120, 'normal', 'ltr', 0, 'accent-violet', '{"fixture":"standard","open":"closed","accent":"#7c3aed"}'::jsonb, 180, FALSE)
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
  top_nav_family.design_system_canonical_family_id,
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
CROSS JOIN top_nav_family
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
