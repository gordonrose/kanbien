# Web App Page Context Nav Item

## Summary

- Description: Durable ordered context-navigation membership row for a page in
  the `webAppPageSettings` feature.
- Owning feature: `webAppPageSettings`
- Primary source tables or records:
  `web_app_page_context_nav_items`, `WebAppPageContextNavItemRecord`
- Status: implemented in the page-settings foundation slice on 2026-04-20

## Storage Model

- Primary table or durable record: `web_app_page_context_nav_items`
- Related durable records:
  `web_app_pages`, `web_app_page_settings`
- Primary key: `web_app_page_context_nav_item_id`
- Foreign key relationships:
  `owner_web_app_page_id` references `web_app_pages.web_app_page_id`;
  `target_web_app_page_id` references `web_app_pages.web_app_page_id`

## Fields

- `web_app_page_context_nav_item_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one membership row.
  Constraints / Notes: Primary key.
- `owner_web_app_page_id`
  Type / Shape: `UUID`
  Description: Page that owns the curated context-nav list for itself when it
  has no parent, or for its immediate child-page sibling group when those
  children are viewed.
  Constraints / Notes: Required. Projection reads use
  `viewedPage.parentPageId ?? viewedPage.webAppPageId` as the owner lookup.
- `target_web_app_page_id`
  Type / Shape: `UUID`
  Description: Page included as a selectable context-nav destination.
  Constraints / Notes: Required. Must remain eligible through the approved
  hierarchy-reader seam at write time.
- `sort_order`
  Type / Shape: `INTEGER`
  Description: Explicit ordering for rendered context-nav items.
  Constraints / Notes: Required.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. System-managed.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time.
  Constraints / Notes: Required. System-managed.

## Indexes And Constraints

- `web_app_page_context_nav_items_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `web_app_page_context_nav_item_id`.
  Why It Matters: Preserves durable membership identity.
- `uq_web_app_page_context_nav_owner_target`
  Type: `unique`
  Definition / Rule: Unique on `owner_web_app_page_id`, `target_web_app_page_id`.
  Why It Matters: Prevents duplicate context-nav entries for the same target page.
- `ix_web_app_page_context_nav_owner_sort`
  Type: `other`
  Definition / Rule: Secondary index on `owner_web_app_page_id`, `sort_order`,
  and `target_web_app_page_id`.
  Why It Matters: Supports deterministic ordered reads per owner page.

## Mutation Semantics

- Mutation rule: The current update capability replaces the full ordered
  membership set when `contextNavTargetPageIds` is supplied.
  Effect on stored fields: Stored order remains deterministic and duplicates are
  rejected before persistence.
- Mutation rule: When no explicit rows exist, the effective API behavior falls
  back to a self-only context-nav item for exact settings reads without storing
  a synthetic row.
  Effect on stored fields: Durable storage remains explicit-only while read
  behavior stays truthful for operators.
- Projection rule: Context-nav projection reads inherit from the viewed page's
  immediate parent when one exists, so sibling pages share the same owner-owned
  context-nav setup.
  Effect on stored fields: No storage migration is required because
  `owner_web_app_page_id` already represents the settings owner page.

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Web App Page Context Nav Item is documented as owned by `webAppPageSettings` with source record(s) `web_app_page_context_nav_items`, `WebAppPageContextNavItemRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
