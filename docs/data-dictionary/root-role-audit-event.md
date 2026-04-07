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
