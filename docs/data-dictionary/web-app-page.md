# Web App Page

## Summary

- Description: Durable page node record for the general-tree hierarchy owned by
  `webAppHierarchyBuilder`.
- Owning feature: `webAppHierarchyBuilder`
- Primary source tables or records: `web_app_pages`, `WebAppPageRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `web_app_pages`
- Related durable records:
  `web_app_root_families`, `web_app_modules`, `web_app_page_locators`,
  `web_app_discovery_links`
- Primary key: `web_app_page_id`
- Foreign key relationships:
  `root_family_id` references `web_app_root_families.root_family_id`;
  `web_app_module_id` references `web_app_modules.web_app_module_id`;
  `parent_page_id` references `web_app_pages.web_app_page_id` when the page is
  placed under another page rather than at the module root or in the orphaned
  pool

## Capabilities Expected To Rely On This Entity

- Create web app page
  Source: `webAppHierarchyBuilder`
- Update web app page metadata and lifecycle
  Source: `webAppHierarchyBuilder`
- Move web app page
  Source: `webAppHierarchyBuilder`
- List resolved web app hierarchy tree
  Source: `webAppHierarchyBuilder`
- List planner-selectable hierarchy nodes
  Source: `webAppHierarchyBuilder`
- List orphaned web app pages
  Source: `webAppHierarchyBuilder`
- Bootstrap web app hierarchy from current app pages
  Source: `webAppHierarchyBuilder`

## Fields

- `web_app_page_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one durable page record.
  Constraints / Notes: Primary key.
- `root_family_id`
  Type / Shape: `TEXT`
  Description: Owning top-level root-family identifier.
  Constraints / Notes: Required. Current approved root families are
  `root-admin`, `login`, and `design-system`.
- `web_app_module_id`
  Type / Shape: `UUID`
  Description: Owning business-module identifier.
  Constraints / Notes: Required. Even orphaned pages retain a module
  association so they can be reviewed and moved without losing module context.
- `parent_page_id`
  Type / Shape: `UUID | NULL`
  Description: Immediate parent page identifier.
  Constraints / Notes: Nullable. `NULL` is allowed only when placement type is
  `module-root` or `orphaned`.
- `placement_type`
  Type / Shape: `'module-root' | 'child-page' | 'orphaned'`
  Description: Placement posture for the page inside the hierarchy.
  Constraints / Notes: Required. This is separate from lifecycle status because
  orphaning is not the same thing as draft/live/inactive lifecycle.
- `page_key`
  Type / Shape: `TEXT`
  Description: Stable machine key for the page record.
  Constraints / Notes: Required and planner-safe.
- `normalized_page_key`
  Type / Shape: `TEXT`
  Description: Trimmed lowercase normalized page key used for deterministic
  uniqueness.
  Constraints / Notes: Required and unique.
- `display_label`
  Type / Shape: `TEXT`
  Description: Human-readable page label for operators and planners.
  Constraints / Notes: Required.
- `route_segment`
  Type / Shape: `TEXT`
  Description: Canonical tree segment for this page relative to its parent.
  Constraints / Notes: Required. This remains part of hierarchy placement
  truth, but it is no longer the only durable route/locator truth.
- `normalized_route_segment`
  Type / Shape: `TEXT`
  Description: Trimmed lowercase normalized route fragment used for sibling
  collision checks.
  Constraints / Notes: Required.
- `resolved_full_route_path`
  Type / Shape: `TEXT | NULL`
  Description: Server-managed resolved locator string for the page.
  Constraints / Notes: Derived truth. For path-backed pages this remains a
  full path. For hash-state pages it resolves to the active canonical locator
  such as `/root-admin/users` for migrated root-admin suites or another
  approved hash-backed canonical locator where hash-state posture still
  remains intentional.
- `status`
  Type / Shape: `'draft' | 'review' | 'live' | 'inactive'`
  Description: Durable lifecycle state of the page record.
  Constraints / Notes: Required.
- `sort_order`
  Type / Shape: `INTEGER`
  Description: Explicit sibling order among pages sharing the same effective
  parent placement.
  Constraints / Notes: Required.
- `created_by_root_admin_user_id`
  Type / Shape: `UUID`
  Description: Root operator attribution for the original create path.
  Constraints / Notes: Required and system-managed.
- `bootstrap_source`
  Type / Shape: `TEXT | NULL`
  Description: Optional source marker for rows created or refreshed by
  bootstrap.
  Constraints / Notes: Nullable. Current implementation uses
  `current-navigable-pages`.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. System-managed.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time.
  Constraints / Notes: Required. Refreshed on every successful metadata,
  status, placement, or route refresh change.

## Indexes And Constraints

- `web_app_pages_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `web_app_page_id`.
  Why It Matters: Preserves durable page identity across moves and edits.
- `web_app_pages.web_app_module_id -> web_app_modules.web_app_module_id`
  Type: `foreign key`
  Definition / Rule: Every page remains associated with one durable module.
  Why It Matters: Planner tooling and generated structure remain anchored to a
  top-level module even when a page is orphaned.
- `web_app_pages.root_family_id -> web_app_root_families.root_family_id`
  Type: `foreign key`
  Definition / Rule: Every page remains associated with one durable root
  family.
  Why It Matters: Route derivation starts from `root-admin`, `login`, or
  `design-system`, not from a flattened module list alone.
- `web_app_pages.parent_page_id -> web_app_pages.web_app_page_id`
  Type: `foreign key`
  Definition / Rule: Child-page placement uses a self-reference.
  Why It Matters: Supports a general tree rather than a fixed-depth schema.
- `placement_type` check
  Type: `check`
  Definition / Rule:
  `placement_type IN ('module-root', 'child-page', 'orphaned')`.
  Why It Matters: Keeps placement semantics bounded and explicit.
- `status` check
  Type: `check`
  Definition / Rule:
  `status IN ('draft', 'review', 'live', 'inactive')`.
  Why It Matters: Keeps lifecycle semantics bounded to the approved first-pass
  page status set.
- placement consistency check
  Type: `check`
  Definition / Rule: `child-page` requires a non-null `parent_page_id`, while
  `module-root` and `orphaned` require `NULL`.
  Why It Matters: Prevents impossible placement states.
- `uq_web_app_pages_normalized_page_key`
  Type: `unique`
  Definition / Rule: Unique on `normalized_page_key`.
  Why It Matters: Preserves stable page-key uniqueness for bootstrap and
  planner seams.
- `uq_web_app_pages_module_root_route_segment`
  Type: `partial unique`
  Definition / Rule: Unique `normalized_route_segment` among module-root pages
  in the same module.
  Why It Matters: Prevents route collisions at module root.
- `uq_web_app_pages_child_route_segment`
  Type: `partial unique`
  Definition / Rule: Unique `normalized_route_segment` among pages sharing the
  same parent page.
  Why It Matters: Prevents route collisions within one branch.
- `ix_web_app_pages_module_parent_sort`, `ix_web_app_pages_root_family_status`
  Type: `other`
  Definition / Rule: Secondary indexes on module/parent traversal and
  root-family plus lifecycle filtering.
  Why It Matters: Supports tree traversal, planner reads, and orphan review.

## Normalization And Uniqueness Rules

- Rule: `web_app_page_id` is system-generated while `page_key` is the stable
  machine key used by operators and bootstrap input.
  Why It Matters: Durable identity survives route refactors and placement
  changes without exposing system-managed ids to bootstrap planning.
- Rule: `route_segment` is the canonical route field on the entity.
  Why It Matters: Tree placement and route derivation stay tied to explicit
  hierarchy structure even though canonical page reachability now lives in the
  related locator seam.
- Rule: Active page reachability truth now lives in `web_app_page_locators`.
  Why It Matters: Path and hash-state pages can both be represented honestly
  without overloading the page row with mutually exclusive locator fields.
- Rule: Full route path is derived from ancestry and refreshed automatically
  whenever placement changes.
  Why It Matters: Descendant pages stay synchronized when a parent moves or its
  route segment changes.
- Rule: Full route derivation starts from the page's root family.
  Why It Matters: The current app has multiple top-level entry families with
  different base URLs.
- Rule: The tree remains strict.
  Why It Matters: One page may appear in only one place at a time; the feature
  prevents multi-parent placement and cycles.

## Lifecycle Semantics

- State or lifecycle rule: Page lifecycle and page placement are separate
  dimensions.
  Meaning: A page can be `draft`, `review`, `live`, or `inactive` while also
  being module-root, child-page, or orphaned.
- State or lifecycle rule: Orphaned pages remain durable records and must not
  be destroyed implicitly.
  Meaning: Removing a page from its current module hierarchy preserves the page
  for later reassignment or review.
- State or lifecycle rule: `inactive` pages remain queryable through explicit
  administrative reads even when planner or generation consumers exclude them
  by default.
  Meaning: Lifecycle history stays durable without requiring hard delete.

## Mutation Semantics

- Mutation rule: Creating a page requires module assignment and route-segment
  validation.
  Effect on stored fields: New pages start with explicit module ownership and a
  validated canonical route fragment under one root family.
- Mutation rule: Moving a page may change `web_app_module_id`,
  `parent_page_id`, `placement_type`, `sort_order`, and the derived full route
  path for the page and all descendants.
  Effect on stored fields: Moves are compatibility-sensitive and require
  automatic descendant route refresh.
- Mutation rule: Orphaning a page clears `parent_page_id` and sets
  `placement_type='orphaned'` without destroying the page.
  Effect on stored fields: The page leaves the active tree but remains durable
  for later move or review capabilities.
- Mutation rule: The current bootstrap path may create or refresh page rows
  only from explicitly supplied observed navigable app pages.
  Effect on stored fields: The implementation avoids guessed rows but does not
  yet auto-discover browser routes from the running app.

## Cross-Feature Read Seams

- Exported seam: resolved hierarchy tree and planner-selectable page readers
  from `webAppHierarchyBuilder`
  Consumer: `pageShellPlanning`, future route generation, future frontend page
  structure generation, and later tenant-facing hierarchy tooling
  Allowed read shape: Stable page ids, root-family ids, module ids, parent
  links, placement type, lifecycle state, sibling order, canonical route
  segment, and derived full route path

## Migration Compatibility Notes

- Note: Bootstrap is mandatory because the current app already exposes real
  navigable pages across the approved root families `root-admin`, `login`, and
  `design-system`.
  Why It Matters For Rebuild Or Shared Environments: The first hierarchy load
  should reflect observed browser-reachable surfaces rather than guessed
  placeholder pages.
- Note: Placement changes can change derived full routes for descendants.
  Why It Matters For Rebuild Or Shared Environments: Move and reparent behavior
  must be treated as compatibility-sensitive, especially for `live` pages.
- Note: The first slice is root-scoped, but the entity contract should remain
  compatible with future tenant-visible readers or editors.
  Why It Matters For Rebuild Or Shared Environments: Avoid baking root-only
  assumptions into durable row semantics that would block later scoped access.

## Compliance Classification And Governance

- Data classification: confidential platform metadata with access-control or actor-context relevance
- Privacy / PII relevance: low: no direct personal data identified in the current dictionary page
- Security relevance: yes: access control, tenant boundary, authentication, or security-sensitive metadata is present
- Audit relevance: yes: lifecycle, actor attribution, or operational evidence fields are present
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Web App Page is documented as owned by `webAppHierarchyBuilder` with source record(s) `web_app_pages`, `WebAppPageRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Related Errors

- `WEB_APP_PAGE_NOT_FOUND`
  Message: We could not find that web-app page.
  Field: `webAppPageId`
  Reason: `not_found`
  When It Happens: Exact page reads or writes target a missing durable page.
- `WEB_APP_PAGE_KEY_ALREADY_EXISTS`
  Message: That page key is already in use by another page.
  Field: `pageKey`
  Reason: `duplicate_page_key`
  When It Happens: Create or bootstrap would violate the page-key uniqueness
  rule.
- `WEB_APP_HIERARCHY_CYCLE`
  Message: That move would create a page-parent cycle in the hierarchy.
  Field: `targetParentPageId`
  Reason: `cycle_detected`
  When It Happens: Move attempts to create an invalid tree cycle.
- `WEB_APP_LIVE_ROUTE_CHANGE_BLOCKED`
  Message: That change would affect a live page route and is blocked until a
  compatibility path exists.
  Field: `routeSegment`
  Reason: `live_route_change_blocked`
  When It Happens: A route-affecting change is blocked for a live page or live
  descendants.
- `WEB_APP_INVALID_PLACEMENT`
  Message: That placement change is not allowed for the requested hierarchy
  shape.
  Field: `targetParentPageId` or `placementType`
  Reason: placement-specific
  When It Happens: Caller submits an impossible or unsupported placement
  combination.

## Notes

- The implemented storage model is a general tree using `parent_page_id`
  rather than a fixed three-level schema.
- The page entity is intentionally scoped under both a root family and a
  business module so top-level URL families are not flattened into ordinary
  modules.
