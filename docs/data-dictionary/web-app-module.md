# Web App Module

## Summary

- Description: Durable user-facing business-module record for the
  `webAppHierarchyBuilder` feature.
- Owning feature: `webAppHierarchyBuilder`
- Primary source tables or records: `web_app_modules`, `WebAppModuleRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `web_app_modules`
- Related durable records:
  `web_app_root_families`, `web_app_pages`
- Primary key: `web_app_module_id`
- Foreign key relationships:
  `web_app_modules.root_family_id` references
  `web_app_root_families.root_family_id`;
  `web_app_modules.landing_page_web_app_page_id` references
  `web_app_pages.web_app_page_id`

## Capabilities Expected To Rely On This Entity

- Create web app module
  Source: `webAppHierarchyBuilder`
- Update web app module
  Source: `webAppHierarchyBuilder`
- List web app hierarchy tree
  Source: `webAppHierarchyBuilder`
- Bootstrap web app hierarchy from current app pages
  Source: `webAppHierarchyBuilder`
- Planner-facing selectable hierarchy reads
  Source: planned downstream `pageShellPlanning` integration

## Fields

- `root_family_id`
  Type / Shape: `TEXT`
  Description: Owning root-family identifier.
  Constraints / Notes: Required. Modules are scoped under one top-level root
  family such as `root-admin`, `login`, or `design-system`.
- `web_app_module_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one business module.
  Constraints / Notes: Primary key.
- `module_key`
  Type / Shape: `TEXT`
  Description: Stable machine key for the business module.
  Constraints / Notes: Required. Lowercase normalized for uniqueness and
  planner-safe references.
- `normalized_module_key`
  Type / Shape: `TEXT`
  Description: Trimmed lowercase normalized module key used for deterministic
  uniqueness.
  Constraints / Notes: Required and unique.
- `display_label`
  Type / Shape: `TEXT`
  Description: Human-readable module name shown to operators and downstream
  planners.
  Constraints / Notes: Required.
- `landing_page_web_app_page_id`
  Type / Shape: `UUID | NULL`
  Description: Optional direct-child page used as the durable landing target
  when module entry should resolve to a specific page.
  Constraints / Notes: Nullable. When set, it must reference a direct child
  page of the same module with `module-root` placement.
- `status`
  Type / Shape: `'draft' | 'review' | 'live' | 'inactive'`
  Description: Durable lifecycle state for the module itself.
  Constraints / Notes: Required. `orphaned` is not a module status because
  orphaning applies to page placement, not to module lifecycle.
- `sort_order`
  Type / Shape: `INTEGER`
  Description: Explicit sibling ordering among modules inside one root family.
  Constraints / Notes: Required.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. System-managed.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time.
  Constraints / Notes: Required. Every successful update refreshes it.

## Indexes And Constraints

- `web_app_modules_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `web_app_module_id`.
  Why It Matters: Preserves durable module identity across edits and downstream
  references.
- `web_app_modules.root_family_id -> web_app_root_families.root_family_id`
  Type: `foreign key`
  Definition / Rule: Every module belongs to one durable root family.
  Why It Matters: Prevents top-level URL families such as `root-admin`,
  `login`, and `design-system` from being flattened into ordinary modules.
- `web_app_modules.landing_page_web_app_page_id -> web_app_pages.web_app_page_id`
  Type: `foreign key`
  Definition / Rule: Optional link to one curated landing page.
  Why It Matters: Keeps module-entry behavior durable without pretending that
  landing-page selection belongs to page-settings truth.
- `uq_web_app_modules_normalized_module_key`
  Type: `unique`
  Definition / Rule: Unique on `normalized_module_key`.
  Why It Matters: Preserves stable machine-key uniqueness for planner and
  downstream generation seams.
- `status` check
  Type: `check`
  Definition / Rule:
  `status IN ('draft', 'review', 'live', 'inactive')`.
  Why It Matters: Keeps lifecycle semantics bounded to the approved first-pass
  status set.
- `ix_web_app_modules_root_family_sort`
  Type: `other`
  Definition / Rule: Secondary index on `root_family_id`, `sort_order`, and
  `normalized_module_key`.
  Why It Matters: Supports stable tree generation and operator review screens.

## Normalization And Uniqueness Rules

- Rule: Module identity uses a system-generated row id plus a stable machine
  key.
  Why It Matters: Downstream references remain stable while planners and
  bootstrap flows can rely on `module_key`.
- Rule: Modules are scoped under one root family.
  Why It Matters: Business modules should not replace the separate notion of a
  top-level app-entry family.
- Rule: Module-key uniqueness is enforced on normalized values.
  Why It Matters: Prevents case-only duplicates and keeps selection UIs
  deterministic.

## Lifecycle Semantics

- State or lifecycle rule: Module lifecycle is independent from page placement.
  Meaning: Pages may become orphaned without forcing the owning module into a
  special orphan state.
- State or lifecycle rule: `inactive` modules remain durable records.
  Meaning: Module truth can be preserved for historical review or later
  reactivation without destroying child-page records.

## Mutation Semantics

- Mutation rule: Updating module metadata or ordering refreshes `updated_at`.
  Effect on stored fields: Preserves deterministic mutation timing.
- Mutation rule: Updating the module landing page refreshes `updated_at`.
  Effect on stored fields: Preserves direct-child landing-page truth on the
  module row rather than in page-attached settings.
- Mutation rule: Module-linked page records are not implicitly destroyed by
  module edits.
  Effect on stored fields: Child pages remain durable and may later be moved or
  orphaned explicitly.
- Mutation rule: The current bootstrap route creates or updates modules only
  from explicitly supplied observed navigable page input.
  Effect on stored fields: The backend does not yet auto-discover modules from
  app routes on its own.

## Cross-Feature Read Seams

- Exported seam: root-family-aware module catalog and resolved tree readers
  from `webAppHierarchyBuilder`
  Consumer: `pageShellPlanning`, future route generation, future frontend
  planners, and later tenant-facing hierarchy tooling
  Allowed read shape: Stable module ids, module keys, labels, lifecycle state,
  ordering, and derived tree projections needed for planner choices and
  generated structure

## Migration Compatibility Notes

- Note: Bootstrap is required because the current app already has navigable page
  surfaces.
  Why It Matters For Rebuild Or Shared Environments: The first migration and
  bootstrap path should capture real current pages rather than creating a blank
  hierarchy that diverges from the existing app.
- Note: This entity is designed to stay root-operated in the first slice while
  remaining compatible with later tenant-visible readers or editors.
  Why It Matters For Rebuild Or Shared Environments: Authorization seams should
  not assume root-only forever even though the initial capability boundary is
  root.

## Related Errors

- `WEB_APP_MODULE_NOT_FOUND`
  Message: We could not find that web-app module.
  Field: `webAppModuleId`
  Reason: `not_found`
  When It Happens: Exact module reads or writes target a missing durable
  module record.
- `WEB_APP_MODULE_KEY_ALREADY_EXISTS`
  Message: That module key is already in use by another module.
  Field: `moduleKey`
  Reason: `duplicate_module_key`
  When It Happens: Create would violate the normalized module-key uniqueness
  rule.
- `WEB_APP_INVALID_MODULE_LANDING_PAGE`
  Message: That page cannot be used as the module landing page.
  Field: `landingPageWebAppPageId`
  Reason: `page_not_direct_child`
  When It Happens: Module landing-page updates target a page that is not a
  direct child page of the same module.

## Notes

- The module entity is intentionally business-facing rather than tied 1:1 to
  backend feature folders.
- The module entity is intentionally distinct from the root-family layer,
  which owns top-level entry families such as `root-admin`, `login`, and
  `design-system`.
