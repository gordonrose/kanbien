WITH upload_file_family AS (
  SELECT design_system_canonical_family_id
  FROM design_system_canonical_families
  WHERE normalized_family_key = 'upload-file'
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
    ('UFR-009', 'Image preview thumbnail', 'Selected raster images replace the generic upload glyph with a thumbnail preview inside the dropzone.', '/design-system/canonical-renderings/upload-file/UFR-009', '/design-system/components/upload-file?ref=UFR-009&width=560&state=complete&preview=image&file=venue-hero.png&theme=normal&dir=ltr&zoom=0', 'Image preview lane', 560, 'normal', 'ltr', 0, 'preview-image', '{"state":"complete","previewKind":"image","fileName":"venue-hero.png"}'::jsonb, 90, TRUE),
    ('UFR-010', 'Document type thumbnail', 'Selected documents use a compact document-type thumbnail instead of pretending a live page preview exists.', '/design-system/canonical-renderings/upload-file/UFR-010', '/design-system/components/upload-file?ref=UFR-010&width=560&state=complete&preview=document&file=campaign-brief.pdf&theme=normal&dir=ltr&zoom=0', 'Document preview lane', 560, 'normal', 'ltr', 0, 'preview-document', '{"state":"complete","previewKind":"document","fileName":"campaign-brief.pdf"}'::jsonb, 100, TRUE),
    ('UFR-011', 'Video preview thumbnail', 'Selected videos use the same preview slot as images, with a video thumbnail posture when a browser object URL is available.', '/design-system/canonical-renderings/upload-file/UFR-011', '/design-system/components/upload-file?ref=UFR-011&width=560&state=complete&preview=video&file=launch-cut.mp4&theme=normal&dir=ltr&zoom=0', 'Video preview lane', 560, 'normal', 'ltr', 0, 'preview-video', '{"state":"complete","previewKind":"video","fileName":"launch-cut.mp4"}'::jsonb, 110, TRUE),
    ('UFR-012', 'Audio preview icon', 'Selected audio uses the preview slot for a clear audio icon while keeping transport and playback behavior feature-owned.', '/design-system/canonical-renderings/upload-file/UFR-012', '/design-system/components/upload-file?ref=UFR-012&width=560&state=complete&preview=audio&file=voiceover.mp3&theme=normal&dir=ltr&zoom=0', 'Audio preview lane', 560, 'normal', 'ltr', 0, 'preview-audio', '{"state":"complete","previewKind":"audio","fileName":"voiceover.mp3"}'::jsonb, 120, TRUE)
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
  upload_file_family.design_system_canonical_family_id,
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
CROSS JOIN upload_file_family
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
