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

## Compliance Classification And Governance

- Data classification: internal platform metadata
- Privacy / PII relevance: low: no direct personal data identified in the current dictionary page
- Security relevance: moderate: internal platform metadata still requires integrity protection
- Audit relevance: yes: lifecycle, actor attribution, or operational evidence fields are present
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Web App Discovery Link is documented as owned by `webAppHierarchyBuilder` with source record(s) `web_app_discovery_links`, `WebAppDiscoveryLinkRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Notes

- This row is intentionally separate from both discovered truth and curated
  truth so the system can answer what was imported, what drifted, and what is
  stale without collapsing the two models together.
