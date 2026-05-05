# Root User Role Assignment

## Summary

- Description: Durable assignment of one system root role to one root user.
- Owning feature: `rootRoles`
- Primary source tables or records: `root_user_role_assignments`

## Storage Model

- Primary table or durable record: `root_user_role_assignments`
- Related durable records: `root_users`, `system_root_roles`,
  `root_role_audit_events`
- Primary key: `root_user_role_assignment_id`

## Fields

- `root_user_role_assignment_id`
  Type / Shape: `UUID`
- `root_user_id`
  Type / Shape: `UUID`
- `system_root_role_id`
  Type / Shape: `UUID`
- `assigned_by_root_user_id`
  Type / Shape: `UUID`
- `assigned_reason`
  Type / Shape: `TEXT | NULL`
- `assigned_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
- `unassigned_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
- `unassigned_by_root_user_id`
  Type / Shape: `UUID | NULL`
- `unassigned_reason`
  Type / Shape: `TEXT | NULL`

## Indexes And Constraints

- `uq_root_user_role_assignments_active_root_user_role`
  Type: `partial unique`
  Definition / Rule: Unique on `(root_user_id, system_root_role_id)` where
  `unassigned_at IS NULL`.
- `ix_root_user_role_assignments_active_root_user`
  Type: `other`
  Definition / Rule: Active assignment reads by `root_user_id`.
- `ix_root_user_role_assignments_active_role`
  Type: `other`
  Definition / Rule: Active assignment reads by `system_root_role_id`.

## Lifecycle Semantics

- Active assignments have `unassigned_at IS NULL`.
- Unassignment is a durable lifecycle transition, not hard deletion.
- Replacement is modeled as retiring one active assignment and creating another.

## Mutation Semantics

- New assignments take effect immediately in effective-permission reads.
- Unassignment preserves durable history.
- Safety rules prevent leaving a root user with zero roles or the platform with
  zero active `RootUserAdmin` assignments.

## Cross-Feature Read Seams

- Exported seam: effective capability checker
  Consumer: `rootAuth`, `rootUsers`
  Allowed read shape: whether a root user currently has a governing capability

## Migration Compatibility Notes

- Existing eligible root users are backfilled into `RootUserAdmin` assignments
  during `0005_create_root_roles.sql`.
- The same migration also installs the trigger that auto-assigns the bootstrap
  role to newly created eligible root users.

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Root User Role Assignment is documented as owned by `rootRoles` with source record(s) `root_user_role_assignments`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
