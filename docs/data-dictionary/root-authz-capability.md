# Root Authz Capability

## Summary

- Description: Durable catalog entry for one root-platform authorization
  capability key.
- Owning feature: `rootRoles`
- Primary source tables or records: `root_authz_capabilities`,
  `RootCapabilityCatalogItem`

## Storage Model

- Primary table or durable record: `root_authz_capabilities`
- Related durable records: `system_root_role_capability_grants`
- Primary key: `capability_key`
- Foreign key relationships: Referenced by
  `system_root_role_capability_grants.capability_key`

## Fields

- `capability_key`
  Type / Shape: `TEXT`
  Description: Stable machine-readable authorization capability key.
- `description`
  Type / Shape: `TEXT`
  Description: Human-readable explanation of the capability.
- `mandatory_for_root_user_admin`
  Type / Shape: `BOOLEAN`
  Description: Whether the capability is mandatory on the protected
  `RootUserAdmin` role.
- `protected_for_root_user_admin`
  Type / Shape: `BOOLEAN`
  Description: Whether the capability is protected on the protected
  `RootUserAdmin` role.
- `created_at`, `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Catalog lifecycle timestamps.

## Indexes And Constraints

- `root_authz_capabilities_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `capability_key`.
- No separate uniqueness rule beyond the primary key is required.

## Lifecycle Semantics

- Catalog entries are durable reference records, not ephemeral configuration.
- The current implementation seeds the root capability catalog in migration
  `0005_create_root_roles.sql`.

## Cross-Feature Read Seams

- Exported seam: root capability checker and role capability list routes
  Consumer: `rootAuth`, `rootUsers`, root-role administration routes
  Allowed read shape: capability key presence and human-readable description

## Migration Compatibility Notes

- Rebuild-from-spec should preserve seeded root capability keys because role
  grants and protected-route authz checks depend on exact string identity.

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Root Authz Capability is documented as owned by `rootRoles` with source record(s) `root_authz_capabilities`, `RootCapabilityCatalogItem`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
