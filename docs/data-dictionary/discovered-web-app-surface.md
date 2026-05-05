# Discovered Web App Surface

## Summary

- Description: Durable current discovered-truth record for one implemented
  web-app route, shell state, support route, or review-required surface.
- Owning feature: `webAppSurfaceDiscovery`
- Primary source tables or records:
  `discovered_web_app_surfaces`, `DiscoveredWebAppSurfaceRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `discovered_web_app_surfaces`
- Related durable records:
  `web_app_discovery_runs`, `discovered_web_app_surface_observations`
- Primary key: `discovered_web_app_surface_id`
- Foreign key relationships:
  `first_discovered_run_id` and `last_discovered_run_id` reference
  `web_app_discovery_runs.web_app_discovery_run_id`

## Capabilities Expected To Rely On This Entity

- Run web app surface discovery
  Source: `webAppSurfaceDiscovery`
- List discovered web app surfaces
  Source: `webAppSurfaceDiscovery`
- Read exact discovered web app surface
  Source: `webAppSurfaceDiscovery`

## Fields

- `discovered_web_app_surface_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one discovered-surface
  lineage.
  Constraints / Notes: Primary key.
- `root_family_id`
  Type / Shape: `TEXT`
  Description: Owning approved root-family identifier.
  Constraints / Notes: Required. Current approved values are `root-admin`,
  `login`, and `design-system`.
- `discovery_key`
  Type / Shape: `TEXT`
  Description: Stable normalized key derived from root family, locator type,
  and canonical locator.
  Constraints / Notes: Required and unique.
- `surface_kind`
  Type / Shape:
  `'page-route' | 'shell-state' | 'support-route' | 'review-required'`
  Description: Classified discovered-surface kind.
  Constraints / Notes: Required.
- `locator_type`
  Type / Shape: `'path' | 'path-with-query-template' | 'hash-state'`
  Description: Explicit locator shape for the discovered surface.
  Constraints / Notes: Required.
- `route_path`
  Type / Shape: `TEXT | NULL`
  Description: Path portion of the discovered locator when applicable.
  Constraints / Notes: Required for `path` and `hash-state` discovery.
- `route_hash`
  Type / Shape: `TEXT | NULL`
  Description: Hash-state portion of the discovered locator when applicable.
  Constraints / Notes: Required only for `hash-state` rows.
- `canonical_locator`
  Type / Shape: `TEXT`
  Description: Canonical human-readable locator such as
  `/design-system/components/top-nav` or `/root-admin/users`.
  Constraints / Notes: Required and unique.
- `display_label`
  Type / Shape: `TEXT | NULL`
  Description: Human-readable label reported by the provider when available.
  Constraints / Notes: Nullable.
- `user_facing_disposition`
  Type / Shape:
  `'user-facing' | 'support-only' | 'review-required'`
  Description: Importability and operator-facing posture for the discovered
  surface.
  Constraints / Notes: Required.
- `provider_key`
  Type / Shape: `TEXT`
  Description: Provider identifier that produced the current row.
  Constraints / Notes: Required.
- `implementation_source_path`
  Type / Shape: `TEXT | NULL`
  Description: Repo-relative implementation path or source seam used for the
  discovery result.
  Constraints / Notes: Nullable.
- `first_discovered_run_id`
  Type / Shape: `UUID`
  Description: Run that originally created the discovered-surface lineage.
  Constraints / Notes: Required.
- `last_discovered_run_id`
  Type / Shape: `UUID`
  Description: Most recent successful run that observed the surface.
  Constraints / Notes: Required.
- `first_discovered_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: First-seen time.
  Constraints / Notes: Required.
- `last_discovered_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Most recent successful observation time.
  Constraints / Notes: Required.
- `stale_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Time the surface became stale because a later successful run no
  longer saw it.
  Constraints / Notes: Nullable.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. System-managed.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last mutation time.
  Constraints / Notes: Required. System-managed.

## Indexes And Constraints

- `discovered_web_app_surfaces_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `discovered_web_app_surface_id`.
  Why It Matters: Preserves durable discovered-surface identity.
- `uq_discovered_web_app_surfaces_discovery_key`
  Type: `unique`
  Definition / Rule: Unique on `discovery_key`.
  Why It Matters: Prevents ambiguous current rows for one normalized surface.
- `uq_discovered_web_app_surfaces_canonical_locator`
  Type: `unique`
  Definition / Rule: Unique on `canonical_locator`.
  Why It Matters: Ensures current discovered truth remains one row per
  canonical locator.
- run foreign keys
  Type: `foreign key`
  Definition / Rule: First-seen and last-seen run ids must reference valid
  discovery runs.
  Why It Matters: Stale review and provenance stay durable.
- locator consistency check
  Type: `check`
  Definition / Rule: `hash-state` rows require both `route_path` and
  `route_hash`; other current locator types require a path and disallow a hash.
  Why It Matters: Prevents ambiguous locator shapes.
- root-family, provider, disposition, and freshness indexes
  Type: `other`
  Definition / Rule: Secondary indexes cover root-family filtering, provider
  filtering, stale review, and last-discovered ordering.
  Why It Matters: Supports operator reads and later reconcile preview.

## Normalization And Uniqueness Rules

- Rule: `canonical_locator` is the durable truth for matching current provider
  output to an existing discovered row.
  Why It Matters: Providers can refresh metadata without collapsing distinct
  surfaces together.
- Rule: hash-backed shell states remain hash-backed locators.
  Why It Matters: Discovery does not silently reinterpret shell states as page
  routes.
- Rule: support-only routes are persisted with explicit disposition.
  Why It Matters: Discovery truth stays honest without falsely making them
  importable pages.

## Lifecycle Semantics

- State or lifecycle rule: Current rows are refreshed in place across runs.
  Meaning: The table holds current discovered truth rather than a new row per
  observation.
- State or lifecycle rule: Missing surfaces become stale rather than hard
  deleted during normal refresh.
  Meaning: Operators can review drift safely over time.

## Mutation Semantics

- Mutation rule: A first-seen surface creates a new discovered-surface row.
  Effect on stored fields: First-seen and last-seen fields both point to the
  creating run initially.
- Mutation rule: A later successful observation refreshes the current row in
  place.
  Effect on stored fields: Metadata, provider source, and last-seen fields are
  updated while stable identity remains.
- Mutation rule: A later successful run that no longer observes the surface
  sets `stale_at`.
  Effect on stored fields: The row remains durable and queryable.

## Cross-Feature Read Seams

- Exported seam: current discovered-surface exact and list reads from
  `webAppSurfaceDiscovery`
  Intended consumer: future `webAppHierarchyBuilder` reconcile preview and
  import flows

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Discovered Web App Surface is documented as owned by `webAppSurfaceDiscovery` with source record(s) `discovered_web_app_surfaces`, `DiscoveredWebAppSurfaceRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
