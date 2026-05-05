# Tenant Session

## Summary

- Description: Server-backed authenticated session for one shared tenant auth
  principal.
- Owning feature: `tenantAuth`
- Primary source tables or records:
  `tenant_session`, `TenantSessionRecord`

## Storage Model

- Primary table or durable record: `tenant_session`
- Related durable records: `tenant_auth_principal`, `tenant`
- Primary key: `session_id`
- Foreign key relationships:
  - `auth_principal_id` references `tenant_auth_principal.auth_principal_id`
  - `active_tenant_id` references `tenant.tenant_id` when present

## Fields

- `session_id`
  Type / Shape: `UUID`
  Description: Opaque bearer-session identifier.
  Constraints / Notes: Primary key and current bearer token value.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `auth_principal_id`
  Type / Shape: `UUID`
  Description: Principal that owns the session.
  Constraints / Notes: Required foreign key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `active_tenant_id`
  Type / Shape: `UUID | NULL`
  Description: Currently selected tenant context.
  Constraints / Notes: Nullable when tenant selection is still required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `selection_required`
  Type / Shape: `BOOLEAN`
  Description: Whether the session still requires explicit tenant selection.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `remediation_required`
  Type / Shape: `BOOLEAN`
  Description: Whether the authenticated session is currently blocked pending
  remediation.
  Constraints / Notes: Required. Defaults to `FALSE`.
  Source: `src/features/tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql`
- `remediation_reason`
  Type / Shape: `TEXT | NULL`
  Description: Current remediation reason attached to the session.
  Constraints / Notes: `NULL` when no remediation is required. Phase one allows
  only `password_policy_upgrade_required`.
  Source: `src/features/tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql`
- `authenticated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Session creation/authentication time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `expires_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Session expiry time.
  Constraints / Notes: Required. Derived at login time from the effective
  tenant auth policy session TTL. When one shared principal can access multiple
  tenants, the currently implemented rule uses the shortest effective tenant
  TTL across accessible tenant contexts at session creation time.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`,
  `src/features/tenantAuth/domain/service.ts`,
  `src/features/tenantConfiguration/domain/service.ts`
- `revoked_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Revocation marker.
  Constraints / Notes: `NULL` means still eligible if other active-session
  rules pass.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`

## Indexes And Constraints

- `tenant_session_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `session_id`.
  Why It Matters: The session token is the durable server-side lookup key.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `ix_tenant_session_auth_principal_active`
  Type: `other`
  Definition / Rule: Active-session lookup index by `auth_principal_id`.
  Why It Matters: Supports principal-scoped session reads and future revocation
  workflows.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `ix_tenant_session_expiry`
  Type: `other`
  Definition / Rule: Expiry-oriented secondary index on `expires_at`.
  Why It Matters: Supports active-session filtering and later maintenance jobs.
  Source: `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `ix_tenant_session_remediation_active`
  Type: `other`
  Definition / Rule: Partial index on `(auth_principal_id, active_tenant_id,
  expires_at DESC)` for unrevoked remediation-gated sessions.
  Why It Matters: Supports exact remediation-state lookups without scanning all
  active sessions for a principal.
  Source: `src/features/tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql`

## Lifecycle Semantics

- State or lifecycle rule: active-session lookup requires `revoked_at IS NULL`,
  `expires_at > NOW()`, and an enabled principal.
  Meaning: expired, revoked, or disabled-principal sessions do not
  authenticate.
  Source: `src/features/tenantAuth/persistence/postgresRepository.ts`,
  `src/lib/auth/middleware.ts`
- State or lifecycle rule: session read may self-heal active-tenant selection
  when exactly one currently accessible tenant context remains.
  Meaning: session state stays aligned with current access rather than blindly
  preserving stale active-tenant values.
  Source: `src/features/tenantAuth/domain/service.ts`
- State or lifecycle rule: valid credential login may create a remediation-gated
  session instead of denying authentication immediately.
  Meaning: an authenticated principal can be blocked from normal access until a
  policy-compliant password change clears the session remediation state.
  Source: `src/features/tenantAuth/domain/service.ts`

## Mutation Semantics

- Mutation rule: password login inserts a new session row.
  Effect on stored fields: creates one durable authenticated session with
  either an auto-selected tenant or `selection_required = true`, and computes
  `expires_at` from the effective shared-principal tenant TTL policy.
  Source: `src/features/tenantAuth/domain/service.ts`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- Mutation rule: explicit tenant selection updates `active_tenant_id` and clears
  `selection_required`.
  Effect on stored fields: session becomes bound to the chosen tenant context
  until later context changes.
  Source: `src/features/tenantAuth/domain/service.ts`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- Mutation rule: remediation-aware login may set `remediation_required = TRUE`
  and `remediation_reason = 'password_policy_upgrade_required'`.
  Effect on stored fields: authenticated session truthfully carries the blocking
  remediation state until the password is updated or the session is revoked.
  Source: `src/features/tenantAuth/domain/service.ts`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- Mutation rule: successful password remediation clears `remediation_required`
  and `remediation_reason`.
  Effect on stored fields: the session returns to normal authenticated state
  without creating a second session solely to clear the gate.
  Source: `src/features/tenantAuth/domain/service.ts`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- Mutation rule: logout sets `revoked_at = COALESCE(revoked_at, NOW())`.
  Effect on stored fields: session is durably revoked while preserving the
  original revocation time on repeated logout/revoke attempts.
  Source: `src/features/tenantAuth/persistence/postgresRepository.ts`

## Cross-Feature Read Seams

- Exported seam: `TenantAuthSessionLookupRepository.findActiveSessionById`
  Consumer: shared tenant-session middleware and, through it, protected
  tenant-auth routes
  Allowed read shape: active session record with `session_id`,
  `auth_principal_id`, `active_tenant_id`, `selection_required`,
  `remediation_required`, `remediation_reason`, `authenticated_at`, and
  `expires_at`
  Source: `src/features/tenantAuth/persistence/repository.ts`,
  `src/lib/auth/middleware.ts`

## Compliance Classification And Governance

- Data classification: confidential security-sensitive data; may include authentication secret material or proof state
- Privacy / PII relevance: yes: sensitive operational metadata may reveal actor or access context
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Tenant Session is documented as owned by `tenantAuth` with source record(s) `tenant_session`, `TenantSessionRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Related Errors

- `INVALID_SESSION`
  Message: inferred middleware error
  Field: `Authorization` header or session token
  Reason: inferred
  When It Happens: shared tenant-session middleware rejects a missing, expired,
  revoked, unknown, or disabled-principal session.
  Source: `src/lib/auth/middleware.ts`,
  `src/features/tenantAuth/persistence/postgresRepository.ts`
- `UNAUTHORIZED`
  Message: inferred middleware error
  Field: `Authorization` header
  Reason: inferred
  When It Happens: protected tenant-auth request omits a usable bearer token.
  Source: `src/lib/auth/middleware.ts`

## Source

- `src/features/tenantAuth/persistence/migrations/0009_create_tenant_auth.sql`
- `src/features/tenantConfiguration/persistence/migrations/0010_create_tenant_auth_policy.sql`
- `src/features/tenantAuth/domain/service.ts`
- `src/lib/auth/middleware.ts`
