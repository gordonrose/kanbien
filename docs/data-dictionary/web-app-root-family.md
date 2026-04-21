# Web App Root Family

## Summary

- Description: Durable top-level root-family record for the
  `webAppHierarchyBuilder` feature.
- Owning feature: `webAppHierarchyBuilder`
- Primary source tables or records: `web_app_root_families`,
  `WebAppRootFamilyRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `web_app_root_families`
- Related durable records:
  `web_app_modules`, `web_app_pages`
- Primary key: `root_family_id`
- Foreign key relationships:
  `web_app_modules.root_family_id` and `web_app_pages.root_family_id`
  reference the root-family key

## Capabilities Expected To Rely On This Entity

- Get resolved web app hierarchy tree
  Source: `webAppHierarchyBuilder`
- List planner-selectable hierarchy nodes
  Source: `webAppHierarchyBuilder`
- Bootstrap web app hierarchy from current app pages
  Source: `webAppHierarchyBuilder`

## Fields

- `root_family_id`
  Type / Shape: `TEXT`
  Description: Stable machine identifier for one top-level app-entry family.
  Constraints / Notes: Primary key. Current approved families are
  `root-admin`, `login`, and `design-system`.
- `display_label`
  Type / Shape: `TEXT`
  Description: Human-readable label for the root family.
  Constraints / Notes: Required.
- `route_prefix`
  Type / Shape: `TEXT`
  Description: Canonical base URL path for the root family.
  Constraints / Notes: Required. Current approved values are `/root-admin`,
  `/login`, and `/design-system`.
- `sort_order`
  Type / Shape: `INTEGER`
  Description: Explicit ordering among root families.
  Constraints / Notes: Required.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: System-managed.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time.
  Constraints / Notes: System-managed.

## Indexes And Constraints

- `web_app_root_families_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `root_family_id`.
  Why It Matters: Preserves stable family identity across downstream reads.
- `uq_web_app_root_families_route_prefix`
  Type: `unique`
  Definition / Rule: Unique on `route_prefix`.
  Why It Matters: Prevents multiple top-level root families from claiming the
  same entry path.

## Normalization And Uniqueness Rules

- Rule: Root-family ids are stable machine keys, not mutable labels.
  Why It Matters: Modules and pages reference them durably.
- Rule: Route prefixes are unique and canonical.
  Why It Matters: Route derivation must start from one unambiguous top-level
  entry family.

## Lifecycle Semantics

- State or lifecycle rule: Root families are top-level app-entry families, not
  ordinary business modules.
  Meaning: They should not be flattened into the same entity semantics as
  user-facing business modules.

## Mutation Semantics

- Mutation rule: The backend foundation seeds the approved root families during
  migration rather than requiring operators to create them manually.
  Effect on stored fields: The initial hierarchy starts from the approved
  top-level entry families already present in the app.

## Cross-Feature Read Seams

- Exported seam: resolved root-family-aware hierarchy readers from
  `webAppHierarchyBuilder`
  Consumer: `pageShellPlanning`, future route generation, future frontend page
  structure generation, and later tenant-facing hierarchy tooling
  Allowed read shape: Stable family ids, route prefixes, ordering, and
  downstream module/page projections

## Migration Compatibility Notes

- Note: Current approved root families are `root-admin`, `login`, and
  `design-system`.
  Why It Matters For Rebuild Or Shared Environments: Bootstrap and route
  derivation should start from those known top-level app-entry families rather
  than flattening them into ordinary modules.

## Notes

- Root family is intentionally modeled separately from business module because
  the app currently has multiple top-level URL families with different entry
  semantics.
