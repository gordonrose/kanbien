# Web App Page Settings

## Summary

- Description: Durable page-attached settings record for the
  `webAppPageSettings` feature.
- Owning feature: `webAppPageSettings`
- Primary source tables or records:
  `web_app_page_settings`, `WebAppPageSettingsRecord`
- Status: implemented in the page-settings foundation slice on 2026-04-20

## Storage Model

- Primary table or durable record: `web_app_page_settings`
- Related durable records:
  `web_app_pages`, `web_app_page_context_nav_items`
- Primary key: `web_app_page_settings_id`
- Foreign key relationships:
  `web_app_page_settings.web_app_page_id` references
  `web_app_pages.web_app_page_id`

## Fields

- `web_app_page_settings_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one settings row.
  Constraints / Notes: Primary key.
- `web_app_page_id`
  Type / Shape: `UUID`
  Description: Curated page that owns this settings row.
  Constraints / Notes: Required. Unique one-to-one settings ownership.
- `parent_page_id`
  Type / Shape: `UUID | NULL`
  Description: Snapshot of the page's current hierarchy parent at the time of
  the most recent settings save.
  Constraints / Notes: Nullable. References `web_app_pages`. The corrective
  migration backfills existing settings rows from current hierarchy truth.
- `icon_key`
  Type / Shape: `TEXT | NULL`
  Description: Approved icon catalog key requested for the page.
  Constraints / Notes: Nullable. Effective icon falls back when null.
- `show_in_top_nav`
  Type / Shape: `BOOLEAN`
  Description: Whether the page should appear in the top navigation.
  Constraints / Notes: Required. Defaults to `false`.
- `top_nav_order`
  Type / Shape: `INTEGER | NULL`
  Description: Explicit ordering among top-nav-visible pages when applicable.
  Constraints / Notes: Nullable. Expected only when `show_in_top_nav = true`.
- `page_template_key`
  Type / Shape: `TEXT | NULL`
  Description: Approved page-template intent attached to the page.
  Constraints / Notes: Nullable. Effective template currently falls back to
  topology-owned page template truth when null.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. System-managed.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time.
  Constraints / Notes: Required. Every successful update refreshes it.

## Indexes And Constraints

- `web_app_page_settings_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `web_app_page_settings_id`.
  Why It Matters: Preserves durable settings-row identity.
- `uq_web_app_page_settings_page`
  Type: `unique`
  Definition / Rule: Unique on `web_app_page_id`.
  Why It Matters: Enforces one durable settings row per curated page.
- `web_app_page_settings.web_app_page_id -> web_app_pages.web_app_page_id`
  Type: `foreign key`
  Definition / Rule: Settings rows belong only to existing curated pages.
  Why It Matters: Prevents settings from drifting away from topology-owned page
  identity.
- `web_app_page_settings.parent_page_id -> web_app_pages.web_app_page_id`
  Type: `foreign key`
  Definition / Rule: Stored parent-page snapshots point only to existing
  curated pages.
  Why It Matters: Preserves durable parent-page references without inventing a
  separate non-page identifier.
- `ix_web_app_page_settings_top_nav`
  Type: `other`
  Definition / Rule: Secondary index on `show_in_top_nav`, `top_nav_order`,
  and `web_app_page_id`.
  Why It Matters: Supports deterministic top-nav projections and later ordered
  reads.
- `ix_web_app_page_settings_parent_page`
  Type: `other`
  Definition / Rule: Partial secondary index on `parent_page_id` where present.
  Why It Matters: Keeps later parent-page lookups and FK maintenance cheap.

## Mutation Semantics

- Mutation rule: Exact settings update creates or replaces one page-settings row.
  Effect on stored fields: Settings truth remains page-attached and durable.
- Mutation rule: Exact settings update snapshots the current hierarchy parent
  into `parent_page_id`.
  Effect on stored fields: Durable page settings can echo the page's parent
  relationship even when callers are working only from the settings seam.
- Mutation rule: Successful updates refresh `updated_at`.
  Effect on stored fields: Preserves deterministic mutation timing.
- Mutation rule: This entity does not own page placement, module ownership, or
  module landing-page truth.
  Effect on stored fields: Structural routing truth remains in
  `web_app_pages` and `web_app_modules`.

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Web App Page Settings is documented as owned by `webAppPageSettings` with source record(s) `web_app_page_settings`, `WebAppPageSettingsRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify tenant-scoped or permission-sensitive behavior. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Notes

- This entity is intentionally separate from `webAppHierarchyBuilder` so page
  configuration does not blur together with structural topology truth.
