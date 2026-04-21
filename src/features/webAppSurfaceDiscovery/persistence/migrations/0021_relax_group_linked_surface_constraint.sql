ALTER TABLE discovered_web_app_structure_nodes
  DROP CONSTRAINT IF EXISTS ck_discovered_web_app_structure_nodes_linked_surface_consistency;

ALTER TABLE discovered_web_app_structure_nodes
  ADD CONSTRAINT ck_discovered_web_app_structure_nodes_linked_surface_consistency CHECK (
    (node_kind = 'root' AND linked_discovered_web_app_surface_id IS NULL)
    OR (node_kind = 'group')
    OR (node_kind NOT IN ('root', 'group') AND linked_discovered_web_app_surface_id IS NOT NULL)
  );
