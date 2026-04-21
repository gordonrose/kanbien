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
  Description: Page that owns the curated context-nav list.
  Constraints / Notes: Required.
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
  back to a self-only context-nav item without storing a synthetic row.
  Effect on stored fields: Durable storage remains explicit-only while read
  behavior stays truthful for operators.
