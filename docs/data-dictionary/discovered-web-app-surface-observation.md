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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Discovered Web App Surface Observation is documented as owned by `webAppSurfaceDiscovery` with source record(s) `discovered_web_app_surface_observations`, `DiscoveredWebAppSurfaceObservationRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
