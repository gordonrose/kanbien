# System Root Role

## Summary

- Description: Durable definition of a system root role such as
  `RootUserAdmin`.
- Owning feature: `rootRoles`
- Primary source tables or records: `system_root_roles`, `RootRoleRecord`

## Storage Model

- Primary table or durable record: `system_root_roles`
- Related durable records: `system_root_role_capability_grants`,
  `root_user_role_assignments`, `root_role_audit_events`
- Primary key: `system_root_role_id`

## Fields

- `system_root_role_id`
  Type / Shape: `UUID`
  Description: Stable role identifier.
- `role_key`
  Type / Shape: `TEXT`
  Description: Stable machine key for the role.
- `normalized_role_key`
  Type / Shape: `TEXT`
  Description: Canonical lookup/uniqueness form of `role_key`.
- `display_name`
  Type / Shape: `TEXT`
  Description: Editable display label.
- `description`
  Type / Shape: `TEXT`
  Description: Editable operator-facing description.
- `is_protected`
  Type / Shape: `BOOLEAN`
  Description: Indicates whether the role is protected by platform safety
  rules.
- `created_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Role lifecycle timestamps.
- `deactivated_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Null when the role is assignable; non-null when retired from
  future assignment.

## Indexes And Constraints

- `system_root_roles_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `system_root_role_id`.
- `uq_system_root_roles_normalized_role_key_active`
  Type: `partial unique`
  Definition / Rule: Unique active `normalized_role_key` where
  `deactivated_at IS NULL`.
- `ix_system_root_roles_updated_at`
  Type: `other`
  Definition / Rule: Secondary index on `updated_at DESC`.

## Normalization And Uniqueness Rules

- `role_key` is normalized into `normalized_role_key` for durable lookup and
  active-role uniqueness.
- Deactivated roles preserve durable identity and historical assignments while
  no longer blocking future recreation/reactivation logic beyond the active-key
  rule.

## Lifecycle Semantics

- A role may be active/assignable or deactivated/not assignable.
- Deactivation preserves history and current assignments.
- Reactivation restores assignable status.
- Protected roles participate in additional safety checks.

## Mutation Semantics

- Create persists a new role with `deactivated_at = NULL`.
- Update may change `display_name` and `description`, but not `role_key`.
- Deactivate sets `deactivated_at` and `updated_at`.
- Reactivate clears `deactivated_at` and refreshes `updated_at`.

## Migration Compatibility Notes

- `RootUserAdmin` is seeded as the protected bootstrap role in
  `0005_create_root_roles.sql`.
- Rebuild-from-spec must preserve the protected bootstrap role and its durable
  identity semantics.

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | System Root Role is documented as owned by `rootRoles` with source record(s) `system_root_roles`, `RootRoleRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
