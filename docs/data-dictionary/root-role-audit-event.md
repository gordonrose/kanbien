# Root Role Audit Event

## Summary

- Description: Durable audit record for root-role lifecycle, grant, and
  assignment changes.
- Owning feature: `rootRoles`
- Primary source tables or records: `root_role_audit_events`

## Storage Model

- Primary table or durable record: `root_role_audit_events`
- Related durable records: `root_users`, `system_root_roles`,
  `root_user_role_assignments`
- Primary key: `root_role_audit_event_id`

## Fields

- `root_role_audit_event_id`
  Type / Shape: `UUID`
- `actor_root_user_id`
  Type / Shape: `UUID`
- `target_root_user_id`
  Type / Shape: `UUID | NULL`
- `system_root_role_id`
  Type / Shape: `UUID | NULL`
- `root_user_role_assignment_id`
  Type / Shape: `UUID | NULL`
- `event_type`
  Type / Shape: `TEXT`
- `event_outcome`
  Type / Shape: `'success' | 'failure'`
- `reason`
  Type / Shape: `TEXT | NULL`
- `before_state`
  Type / Shape: `JSONB | NULL`
- `after_state`
  Type / Shape: `JSONB | NULL`
- `occurred_at`
  Type / Shape: `TIMESTAMPTZ`

## Indexes And Constraints

- `root_role_audit_events_pkey`
  Type: `primary key`
- `ix_root_role_audit_events_occurred_at`
  Type: `other`
  Definition / Rule: Descending audit review by time.
- `ix_root_role_audit_events_target_root_user_id`
  Type: `other`
  Definition / Rule: Target-user audit review by time.

## Lifecycle Semantics

- Audit events are append-only durable historical records.
- Current event types include role creation, update, deactivation,
  reactivation, grant replacement, assignment creation, assignment
  unassignment, and assignment replacement.

## Mutation Semantics

- Root-role writes append audit rows in the same logical operation path as the
  protected mutation they describe.
- `before_state` and `after_state` preserve operator-visible change context for
  compliance and rebuild review.

## Migration Compatibility Notes

- Rebuild-from-spec must preserve `root_role_audit_events` as durable evidence,
  not downgrade it to application logs only.

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Root Role Audit Event is documented as owned by `rootRoles` with source record(s) `root_role_audit_events`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
