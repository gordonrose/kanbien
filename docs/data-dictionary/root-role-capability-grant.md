# Root Role Capability Grant

## Summary

- Description: Durable assignment of one authz capability to one system root
  role.
- Owning feature: `rootRoles`
- Primary source tables or records: `system_root_role_capability_grants`

## Storage Model

- Primary table or durable record: `system_root_role_capability_grants`
- Related durable records: `system_root_roles`, `root_authz_capabilities`
- Primary key: `system_root_role_capability_grant_id`

## Fields

- `system_root_role_capability_grant_id`
  Type / Shape: `UUID`
- `system_root_role_id`
  Type / Shape: `UUID`
- `capability_key`
  Type / Shape: `TEXT`
- `is_mandatory`
  Type / Shape: `BOOLEAN`
- `is_protected`
  Type / Shape: `BOOLEAN`
- `created_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
- `revoked_at`
  Type / Shape: `TIMESTAMPTZ | NULL`

## Indexes And Constraints

- `uq_system_root_role_capability_grants_role_capability`
  Type: `unique`
  Definition / Rule: Unique on `(system_root_role_id, capability_key)`.
- `ix_system_root_role_capability_grants_active_role`
  Type: `other`
  Definition / Rule: Secondary index for active grants by role and capability
  where `revoked_at IS NULL`.

## Lifecycle Semantics

- Active grants have `revoked_at IS NULL`.
- Replaced grant sets revoke obsolete rows rather than deleting history.
- Protected and mandatory flags become part of the durable grant contract for a
  role.

## Mutation Semantics

- Bulk replacement updates or revokes rows to converge to the desired grant set.
- Protected `RootUserAdmin` identity rules prevent removal of required grants.

## Migration Compatibility Notes

- Seeded `RootUserAdmin` grants are created during migration
  `0005_create_root_roles.sql`.
- Rebuild-from-spec must preserve protected/mandatory semantics, not only
  capability membership.

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Root Role Capability Grant is documented as owned by `rootRoles` with source record(s) `system_root_role_capability_grants`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
