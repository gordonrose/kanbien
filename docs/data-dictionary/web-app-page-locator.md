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
  `/design-system/components/top-nav` or `/root-admin/users`.
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Web App Page Locator is documented as owned by `webAppHierarchyBuilder` with source record(s) `web_app_page_locators`, `WebAppPageLocatorRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Notes

- This seam exists so the hierarchy model can represent path-backed and
  hash-state pages honestly without collapsing route truth into the page row.
