# Web App Page Locator

## Summary

- Description: Durable locator record that owns canonical page reachability
  truth for one curated `webAppPage`.
- Owning feature: `webAppHierarchyBuilder`
- Primary source tables or records: `web_app_page_locators`,
  `WebAppPageLocatorRecord`
- Status: implemented in the structure-aware reconcile extension on
  2026-04-19

## Storage Model

- Primary table or durable record: `web_app_page_locators`
- Related durable records:
  `web_app_pages`, `web_app_root_families`
- Primary key: `web_app_page_locator_id`
- Foreign key relationships:
  `web_app_page_id` references `web_app_pages.web_app_page_id`;
  `root_family_id` references `web_app_root_families.root_family_id`

## Capabilities Expected To Rely On This Entity

- Preview structure-aware web app hierarchy sync
  Source: `webAppHierarchyBuilder`
- Apply structure-aware web app hierarchy sync
  Source: `webAppHierarchyBuilder`
- Get resolved web app hierarchy tree
  Source: `webAppHierarchyBuilder`

## Fields

- `web_app_page_locator_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one locator row.
  Constraints / Notes: Primary key.
- `web_app_page_id`
  Type / Shape: `UUID`
  Description: Curated page that this locator reaches.
  Constraints / Notes: Required foreign key.
- `root_family_id`
  Type / Shape: `TEXT`
  Description: Owning root family for the locator.
  Constraints / Notes: Required. Must stay aligned with the page row.
- `locator_type`
  Type / Shape: `'path' | 'hash-state'`
  Description: Locator-shape category for the active page.
  Constraints / Notes: Required.
- `canonical_locator`
  Type / Shape: `TEXT`
  Description: Canonical resolved locator string such as
  `/design-system/components/top-nav` or `/root-admin#users`.
  Constraints / Notes: Required and uniquely normalized.
- `route_path`
  Type / Shape: `TEXT`
  Description: Base path portion of the locator.
  Constraints / Notes: Required for both path and hash-state locators.
- `route_hash`
  Type / Shape: `TEXT | NULL`
  Description: Hash fragment when the page is reached through a shell state.
  Constraints / Notes: Required for `hash-state`, null for `path`.
- `normalized_locator_key`
  Type / Shape: `TEXT`
  Description: Trimmed lowercase comparison key used for uniqueness.
  Constraints / Notes: Required and unique.
- `is_active`
  Type / Shape: `BOOLEAN`
  Description: Whether this locator is the active current locator for its
  page.
  Constraints / Notes: The current implementation keeps exactly one active
  locator per page.
- `created_by_root_admin_user_id`
  Type / Shape: `UUID | NULL`
  Description: Root operator attribution when known.
  Constraints / Notes: Nullable for migration/backfill-created rows.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: System-managed.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last mutation time.
  Constraints / Notes: System-managed.

## Indexes And Constraints

- `web_app_page_locators_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `web_app_page_locator_id`.
- `uq_web_app_page_locators_normalized_locator_key`
  Type: `unique`
  Definition / Rule: One active normalized locator key may belong to only one
  curated page.
- `uq_web_app_page_locators_active_page`
  Type: `partial unique`
  Definition / Rule: One active locator per `web_app_page_id`.
- locator-shape check
  Type: `check`
  Definition / Rule: `path` rows require null `route_hash`; `hash-state` rows
  require a non-null `route_hash`.

## Notes

- This seam exists so the hierarchy model can represent path-backed and
  hash-state pages honestly without collapsing route truth into the page row.
