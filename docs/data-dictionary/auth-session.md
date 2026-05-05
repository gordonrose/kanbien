# Auth Session

## Summary

- Description: Server-backed authenticated session established after successful
  password and SSH proof.
- Owning feature: `rootAuth`
- Primary source tables or records: `auth_sessions`, `AuthSessionRecord`,
  `ActiveAuthSessionRecord`

## Storage Model

- Primary table or durable record: `auth_sessions`
- Related durable records: `auth_principals`, `root_users`,
  `auth_audit_events`
- Primary key: `session_id`
- Foreign key relationships: `auth_principal_id` references
  `auth_principals.auth_principal_id`; `root_user_id` references
  `root_users.root_user_id`

## Capabilities That Rely On This Entity

- Complete SSH challenge creates a session
  Source: `src/features/rootAuth/domain/service.ts`
- Shared bearer-session middleware authenticates protected requests
  Source: `src/lib/auth/middleware.ts`
- List sessions
  Source: `src/features/rootAuth/domain/service.ts`
- Revoke session
  Source: `src/features/rootAuth/domain/service.ts`
- Logout current session
  Source: `src/features/rootAuth/domain/service.ts`
- Password change revokes other sessions
  Source: `src/features/rootAuth/domain/service.ts`

## Fields

- `session_id`
  Type / Shape: `TEXT`
  Description: Opaque session identifier used as the bearer token value.
  Constraints / Notes: Primary key. Current service-generated IDs use the
  `sess_` prefix.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/domain/service.ts`
- `auth_principal_id`
  Type / Shape: `TEXT`
  Description: Auth principal that owns the session.
  Constraints / Notes: Required foreign key to `auth_principals`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `root_user_id`
  Type / Shape: `UUID`
  Description: Root user authenticated through the session.
  Constraints / Notes: Required foreign key to `root_users`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `authenticated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time authentication completed and the session was created.
  Constraints / Notes: Required. Exposed in request auth context and session
  summary responses.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/lib/auth/middleware.ts`
- `expires_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Server-side expiration time.
  Constraints / Notes: Required. Derived from configured session TTL and
  mutable through session touch logic.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/repository.ts`
- `revoked_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Revocation time.
  Constraints / Notes: `NULL` means not revoked. Revoked sessions remain stored
  but no longer authenticate.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Indexes And Constraints

- `auth_sessions_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `session_id`.
  Why It Matters: The session token is the durable server-side lookup key.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `auth_sessions.auth_principal_id -> auth_principals.auth_principal_id`
  Type: `foreign key`
  Definition / Rule: Each session belongs to one auth principal.
  Why It Matters: Session management and ownership checks are principal-scoped.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `auth_sessions.root_user_id -> root_users.root_user_id`
  Type: `foreign key`
  Definition / Rule: Each session is tied to one root user.
  Why It Matters: Active-session checks enforce root-user lifecycle at read
  time.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `ix_auth_sessions_auth_principal_id`
  Type: `other`
  Definition / Rule: Secondary index on `auth_principal_id`.
  Why It Matters: Supports session listing and mass revocation by principal.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `ix_auth_sessions_root_user_id`
  Type: `other`
  Definition / Rule: Secondary index on `root_user_id`.
  Why It Matters: Supports root-user-scoped access patterns and audit analysis.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `ix_auth_sessions_expires_at`
  Type: `other`
  Definition / Rule: Secondary index on `expires_at`.
  Why It Matters: Supports active-session filtering and expiry-oriented
  maintenance.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Normalization And Uniqueness Rules

- Rule: Session IDs are opaque generated identifiers, not structured or
  user-supplied values.
  Why It Matters: Clients must treat the session token as an opaque bearer
  credential and the service can change internals without breaking the API.
  Source: `src/features/rootAuth/domain/service.ts`,
  `src/lib/auth/middleware.ts`

## Lifecycle Semantics

- State or lifecycle rule: Active-session lookup requires `revoked_at IS NULL`
  and `expires_at > NOW()`.
  Meaning: Expired or revoked sessions remain durable but do not authenticate.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`
- State or lifecycle rule: Active-session lookup also requires
  `auth_principal.auth_status = 'active'`, `root_user.status = 'active'`,
  `root_user.deleted_at IS NULL`, and `root_user.anonymized = false`.
  Meaning: Session validity is gated by the current principal and root-user
  lifecycle state, not just by the session row itself.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`
- State or lifecycle rule: Session listing returns only active, non-revoked,
  unexpired sessions for the owning principal.
  Meaning: Historical revoked or expired sessions are not exposed by the
  current listing endpoint.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`

## Mutation Semantics

- Mutation rule: Successful SSH completion inserts a new session row.
  Effect on stored fields: Creates a durable authenticated session with
  `revoked_at = NULL` and a fixed `authenticated_at`.
  Source: `src/features/rootAuth/domain/service.ts`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- Mutation rule: Session revocation sets `revoked_at = COALESCE(revoked_at,
  NOW())`.
  Effect on stored fields: First revocation stamps the session permanently while
  preserving the original revocation time on repeated updates.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`
- Mutation rule: Password change revokes other active sessions for the same
  principal.
  Effect on stored fields: The current session may survive, while sibling active
  sessions get `revoked_at` set.
  Source: `src/features/rootAuth/domain/service.ts`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- Mutation rule: Shared middleware may touch an active session by extending
  `expires_at`.
  Effect on stored fields: Session TTL can move forward without changing the
  durable session identity.
  Source: `src/features/rootAuth/persistence/repository.ts`

## Cross-Feature Read Seams

- Exported seam: `RootAuthSessionLookupRepository.findActiveSessionById`
  Consumer: shared auth middleware and, through it, protected `rootAuth` and
  `rootUsers` routes
  Allowed read shape: Active session record with `session_id`,
  `auth_principal_id`, `root_user_id`, `authenticated_at`, `expires_at`
  Source: `src/features/rootAuth/persistence/repository.ts`,
  `src/lib/auth/middleware.ts`

## Migration Compatibility Notes

- Note: The persistence contract for sessions includes the live join-based
  validity rule against `auth_principals` and `root_users`, not just the
  `auth_sessions` table definition.
  Why It Matters For Rebuild Or Shared Environments: Rebuild-from-spec should
  preserve the same active-session semantics across protected features.
  Source: `src/features/rootAuth/persistence/postgresRepository.ts`,
  `docs/architecture/system-overview.md`

## Compliance Classification And Governance

- Data classification: confidential security-sensitive data; may include authentication secret material or proof state
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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Auth Session is documented as owned by `rootAuth` with source record(s) `auth_sessions`, `AuthSessionRecord`, `ActiveAuthSessionRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | yes | enforced-in-code | Lifecycle and mutation sections in this page; repository/source references cited above | Normal read paths must exclude soft-deleted rows unless an explicit deleted/read capability is documented. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |

## Related Errors

- `SESSION_NOT_FOUND`
  Message: We could not find that session.
  Field: `sessionId`
  Reason: `not_found`
  When It Happens: Logout or session revocation targets a missing or non-owned
  session.
  Source: `src/features/rootAuth/contract/errors.ts`,
  `src/features/rootAuth/domain/service.ts`
- `INVALID_SESSION`
  Message: inferred middleware error
  Field: `Authorization` header or session token
  Reason: inferred
  When It Happens: Shared auth middleware rejects a missing, expired, revoked,
  unknown, disabled-principal, or blocked-root-user session.
  Source: `src/lib/auth/middleware.ts`,
  `src/features/rootAuth/persistence/postgresRepository.ts`
- `UNAUTHORIZED`
  Message: inferred middleware error
  Field: `Authorization` header
  Reason: inferred
  When It Happens: Protected request omits a usable bearer token.
  Source: `src/lib/auth/middleware.ts`

## Notes

- The bearer token sent by API clients is the opaque `session_id`.
- Browser auth uses the same server-side session records through a secure
  cookie transport, so this entity is shared across API and browser shell auth
  paths.
