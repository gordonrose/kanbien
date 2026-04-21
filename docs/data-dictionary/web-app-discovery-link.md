# Web App Discovery Link

## Summary

- Description: Durable reconcile bridge row connecting discovered structure
  truth to curated hierarchy truth.
- Owning feature: `webAppHierarchyBuilder`
- Primary source tables or records: `web_app_discovery_links`,
  `WebAppDiscoveryLinkRecord`
- Status: implemented in the structure-aware reconcile extension on
  2026-04-19

## Storage Model

- Primary table or durable record: `web_app_discovery_links`
- Related durable records:
  `discovered_web_app_structure_nodes`, `discovered_web_app_surfaces`,
  `web_app_modules`, `web_app_pages`, `web_app_discovery_runs`
- Primary key: `web_app_discovery_link_id`

## Purpose

- persist what discovered node maps to what curated module or page
- expose typed match, drift, and stale posture without recomputing raw joins
- support safe preview/apply and later drift review

## Fields

- `web_app_discovery_link_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one discovery-link row.
- `discovered_web_app_structure_node_id`
  Type / Shape: `UUID`
  Description: Discovered structure node that this link is about.
  Constraints / Notes: Unique current link key in the current implementation.
- `discovered_web_app_surface_id`
  Type / Shape: `UUID | NULL`
  Description: Linked discovered surface when the structure node is leaf-backed.
- `root_family_id`
  Type / Shape: `TEXT`
  Description: Owning root family for the link.
- `curated_target_type`
  Type / Shape: `'module' | 'page'`
  Description: Whether the curated side points at a module or page.
- `curated_web_app_module_id`
  Type / Shape: `UUID | NULL`
  Description: Curated module target when `curated_target_type='module'`.
- `curated_web_app_page_id`
  Type / Shape: `UUID | NULL`
  Description: Curated page target when `curated_target_type='page'`.
- `link_status`
  Type / Shape: `'matched' | 'blocked' | 'stale-discovered'`
  Description: Current reconcile posture for the linked pair.
- `drift_status`
  Type / Shape:
  `'none' | 'locator-drift' | 'placement-drift' | 'metadata-drift' | 'stale-discovered' | 'blocked-locator' | 'blocked-ambiguity'`
  Description: Typed drift or blocked posture for programmatic comparison.
- `drift_summary`
  Type / Shape: `TEXT | NULL`
  Description: Short operator-facing drift explanation when needed.
- `last_compared_web_app_discovery_run_id`
  Type / Shape: `UUID | NULL`
  Description: Most recent discovery run used to compare this link.
- `last_matched_web_app_discovery_run_id`
  Type / Shape: `UUID | NULL`
  Description: Most recent discovery run where this link still matched.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last comparison/apply refresh time.

## Notes

- This row is intentionally separate from both discovered truth and curated
  truth so the system can answer what was imported, what drifted, and what is
  stale without collapsing the two models together.
