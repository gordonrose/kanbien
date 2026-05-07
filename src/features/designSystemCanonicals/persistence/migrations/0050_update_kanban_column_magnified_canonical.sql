UPDATE design_system_canonical_references AS reference
SET
  description = 'Magnified specimen zoom keeps controls readable under a narrower board review width without overlapping within cards or column headers.',
  legacy_render_route_path = '/design-system/components/kanban-column?ref=KCR-016&width=880&state=magnified&theme=normal&dir=ltr&zoom=100',
  viewport = 'Desktop magnified narrow lane',
  width = 880,
  updated_at = NOW()
FROM design_system_canonical_families AS family
WHERE
  reference.design_system_canonical_family_id = family.design_system_canonical_family_id
  AND family.normalized_family_key = 'kanban-column'
  AND reference.normalized_reference_id = 'kcr-016';
