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

## Compliance Classification And Governance

- Data classification: confidential business and identity data; may include personal data or operator/customer contact data
- Privacy / PII relevance: yes: identity, contact, or profile-adjacent fields may identify a person
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Web App Hierarchy Audit Event is documented as owned by `webAppHierarchyBuilder` with source record(s) `web_app_hierarchy_audit_events`, `WebAppHierarchyAuditEventRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Notes

- Successful WEB hierarchy mutation evidence is feature-owned because it needs
  domain before/after state. Capability denials remain platform security audit
  events because they are authz failures rather than hierarchy mutations.
