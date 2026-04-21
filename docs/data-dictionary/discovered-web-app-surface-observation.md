# Discovered Web App Surface Observation

## Summary

- Description: Durable per-run observation snapshot capturing what one
  discovery run saw for one discovered web-app surface.
- Owning feature: `webAppSurfaceDiscovery`
- Primary source tables or records:
  `discovered_web_app_surface_observations`,
  `DiscoveredWebAppSurfaceObservationRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `discovered_web_app_surface_observations`
- Related durable records:
  `web_app_discovery_runs`, `discovered_web_app_surfaces`
- Primary key: `discovered_web_app_surface_observation_id`
- Foreign key relationships:
  `web_app_discovery_run_id` references `web_app_discovery_runs`;
  `discovered_web_app_surface_id` references `discovered_web_app_surfaces`

## Capabilities Expected To Rely On This Entity

- Run web app surface discovery
  Source: `webAppSurfaceDiscovery`
- Future discovery drift review and reconcile tooling
  Source: `webAppSurfaceDiscovery`, `webAppHierarchyBuilder`

## Fields

- `discovered_web_app_surface_observation_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one observation row.
  Constraints / Notes: Primary key.
- `web_app_discovery_run_id`
  Type / Shape: `UUID`
  Description: Discovery run that produced the observation.
  Constraints / Notes: Required.
- `discovered_web_app_surface_id`
  Type / Shape: `UUID`
  Description: Current discovered-surface lineage associated with the
  observation.
  Constraints / Notes: Required.
- `root_family_id`
  Type / Shape: `TEXT`
  Description: Root-family value observed during that run.
  Constraints / Notes: Required.
- `surface_kind`
  Type / Shape:
  `'page-route' | 'shell-state' | 'support-route' | 'review-required'`
  Description: Snapshot of the discovered surface kind.
  Constraints / Notes: Required.
- `locator_type`
  Type / Shape: `'path' | 'path-with-query-template' | 'hash-state'`
  Description: Snapshot of the locator shape.
  Constraints / Notes: Required.
- `route_path`
  Type / Shape: `TEXT | NULL`
  Description: Snapshot path value when applicable.
  Constraints / Notes: Nullable according to locator shape.
- `route_hash`
  Type / Shape: `TEXT | NULL`
  Description: Snapshot hash value when applicable.
  Constraints / Notes: Nullable according to locator shape.
- `canonical_locator`
  Type / Shape: `TEXT`
  Description: Snapshot canonical locator.
  Constraints / Notes: Required.
- `display_label`
  Type / Shape: `TEXT | NULL`
  Description: Snapshot display label.
  Constraints / Notes: Nullable.
- `user_facing_disposition`
  Type / Shape:
  `'user-facing' | 'support-only' | 'review-required'`
  Description: Snapshot operator-facing classification.
  Constraints / Notes: Required.
- `provider_key`
  Type / Shape: `TEXT`
  Description: Provider that produced the observation.
  Constraints / Notes: Required.
- `implementation_source_path`
  Type / Shape: `TEXT | NULL`
  Description: Snapshot source path or implementation seam.
  Constraints / Notes: Nullable.
- `observed_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Observation time recorded for the run.
  Constraints / Notes: Required.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. System-managed.

## Indexes And Constraints

- `discovered_web_app_surface_observations_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on
  `discovered_web_app_surface_observation_id`.
  Why It Matters: Preserves durable observation identity.
- run and surface foreign keys
  Type: `foreign key`
  Definition / Rule: Observation rows must reference a valid run and current
  discovered-surface lineage.
  Why It Matters: Historical review stays linked to both the run and the
  surface lineage.
- `ix_discovered_web_app_surface_observations_run_id`,
  `ix_discovered_web_app_surface_observations_surface_id`
  Type: `other`
  Definition / Rule: Secondary indexes on run and surface references.
  Why It Matters: Supports future drift review by run or by surface.

## Lifecycle Semantics

- State or lifecycle rule: Observation rows are append-only.
  Meaning: Each successful observation is preserved instead of overwritten.

## Mutation Semantics

- Mutation rule: Every observed current surface during a successful run creates
  one observation row.
  Effect on stored fields: The snapshot captures what the provider reported at
  that moment even if the current discovered row changes later.

## Cross-Feature Read Seams

- Exported seam: none in the current public API contract
  Intended consumer: future internal drift review, diagnostics, and reconcile
  support
