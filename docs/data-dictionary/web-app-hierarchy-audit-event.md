# Web App Hierarchy Audit Event

## Summary

- Description: Durable mutation audit record for privileged
  `webAppHierarchyBuilder` hierarchy changes.
- Owning feature: `webAppHierarchyBuilder`
- Primary source tables or records: `web_app_hierarchy_audit_events`,
  `WebAppHierarchyAuditEventRecord`
- Status: implemented in the durable WEB hierarchy audit evidence slice on
  2026-05-01

## Storage Model

- Primary table or durable record: `web_app_hierarchy_audit_events`
- Related durable records:
  `root_users`, `web_app_root_families`, `web_app_modules`, `web_app_pages`
- Primary key: `web_app_hierarchy_audit_event_id`

## Purpose

- persist who performed successful privileged hierarchy mutations
- preserve the affected root family, module, or page when applicable
- retain before/after JSON evidence or aggregate mutation summaries
- keep mutation evidence separate from platform security denial audit events

## Fields

- `web_app_hierarchy_audit_event_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one hierarchy audit event.
  Constraints / Notes: Primary key.
- `actor_root_user_id`
  Type / Shape: `UUID | NULL`
  Description: Root operator who initiated the mutation when known.
  Constraints / Notes: References `root_users.root_user_id`.
- `root_family_id`
  Type / Shape: `TEXT | NULL`
  Description: Root family affected by the mutation when a single family is
  known.
  Constraints / Notes: References `web_app_root_families.root_family_id`.
- `web_app_module_id`
  Type / Shape: `UUID | NULL`
  Description: Module affected by the mutation when the event is module-scoped.
  Constraints / Notes: References `web_app_modules.web_app_module_id`.
- `web_app_page_id`
  Type / Shape: `UUID | NULL`
  Description: Page affected by the mutation when the event is page-scoped.
  Constraints / Notes: References `web_app_pages.web_app_page_id`.
- `event_type`
  Type / Shape: `TEXT`
  Description: Programmatic event name such as
  `web_app_hierarchy.page_moved` or
  `web_app_hierarchy.discovery_sync_applied`.
  Constraints / Notes: Required.
- `event_outcome`
  Type / Shape: `'success' | 'failure'`
  Description: Outcome represented by this durable event.
  Constraints / Notes: Current writer records successful mutation evidence;
  platform security denial events remain on the security audit seam.
- `reason`
  Type / Shape: `TEXT | NULL`
  Description: Optional machine-readable reason when needed.
- `before_state`
  Type / Shape: `JSONB | NULL`
  Description: Prior entity state or aggregate count summary before mutation.
- `after_state`
  Type / Shape: `JSONB | NULL`
  Description: Result entity state or aggregate apply/bootstrap summary after
  mutation.
- `occurred_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time the audit event was recorded.
  Constraints / Notes: Required. Defaults to database `NOW()`.

## Indexes And Constraints

- `web_app_hierarchy_audit_events_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `web_app_hierarchy_audit_event_id`.
  Why It Matters: Gives every audit event a stable durable identity.
- `actor_root_user_id` foreign key
  Type: `foreign key`
  Definition / Rule: References `root_users.root_user_id`.
  Why It Matters: Preserves operator attribution for privileged mutations.
- `root_family_id` foreign key
  Type: `foreign key`
  Definition / Rule: References `web_app_root_families.root_family_id`.
  Why It Matters: Keeps audit evidence queryable by hierarchy root family.
- `web_app_module_id` foreign key
  Type: `foreign key`
  Definition / Rule: References `web_app_modules.web_app_module_id`.
  Why It Matters: Keeps module-scoped mutation evidence queryable.
- `web_app_page_id` foreign key
  Type: `foreign key`
  Definition / Rule: References `web_app_pages.web_app_page_id`.
  Why It Matters: Keeps page-scoped mutation evidence queryable.
- `event_outcome` check
  Type: `check`
  Definition / Rule: `event_outcome IN ('success', 'failure')`.
  Why It Matters: Keeps outcome semantics bounded.
- audit lookup indexes
  Type: `btree indexes`
  Definition / Rule: Indexes by occurrence time, root family, module, and page.
  Why It Matters: Supports operator review without broad table scans.

## Notes

- Successful WEB hierarchy mutation evidence is feature-owned because it needs
  domain before/after state. Capability denials remain platform security audit
  events because they are authz failures rather than hierarchy mutations.
