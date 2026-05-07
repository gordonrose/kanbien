UPDATE design_system_canonical_references AS reference
SET
  display_label = 'Mobile horizontal scroll board',
  description = 'Mobile review keeps columns side by side with horizontal scrolling and non-drag movement controls available.',
  legacy_render_route_path = '/design-system/components/kanban-column?ref=KCR-009&width=390&state=mobile-scroll&theme=normal&dir=ltr&zoom=0',
  viewport = 'Mobile horizontal scroll lane',
  state_variant_key = 'mobile-scroll',
  specimen_payload = '{"state":"mobile-scroll"}'::jsonb,
  updated_at = NOW()
FROM design_system_canonical_families AS family
WHERE
  reference.design_system_canonical_family_id = family.design_system_canonical_family_id
  AND family.normalized_family_key = 'kanban-column'
  AND reference.normalized_reference_id = 'kcr-009';
