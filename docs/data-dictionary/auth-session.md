# Auth Session

## Summary

- Description: Server-backed bearer session established after successful
  password and SSH authentication.
- Owning feature: `rootAuth`
- Primary source tables or records: `auth_sessions`, `AuthSessionRecord`,
  `ActiveAuthSessionRecord`

## Capabilities That Rely On This Entity

- Complete SSH challenge creates a session:
  Source: `src/features/rootAuth/domain/service.ts`
- Shared bearer-session middleware authenticates requests from active sessions:
  Source: `src/lib/auth/middleware.ts`
- List sessions:
  Source: `src/features/rootAuth/domain/service.ts`
- Revoke session:
  Source: `src/features/rootAuth/domain/service.ts`
- Logout current session:
  Source: `src/features/rootAuth/domain/service.ts`
- Password change revokes other sessions:
  Source: `src/features/rootAuth/domain/service.ts`

## Fields

- `session_id`
  Type / Shape: `TEXT`
  Description: Stable session identifier used as the bearer token value.
  Constraints / Notes: Primary key. Generated with `sess_` prefix in current service logic.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
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
  Description: Time the session was established.
  Constraints / Notes: Required. Used in middleware request context.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/lib/auth/middleware.ts`
- `expires_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Session expiration time.
  Constraints / Notes: Required. Derived from configured session TTL.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `revoked_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Revocation timestamp.
  Constraints / Notes: Null for active sessions. Revoked sessions must not authenticate.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `docs/featureDocs/rootAuth-feature.md`
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation timestamp.
  Constraints / Notes: Required. Defaults to `NOW()`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Related Errors

- `SESSION_NOT_FOUND`
  Message: We could not find that session.
  Field: `sessionId`
  Reason: `not_found`
  When It Happens: Logout or session revocation targets a missing or non-owned session.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`
- `INVALID_SESSION`
  Message: inferred middleware error
  Field: `Authorization` header or session token
  Reason: inferred
  When It Happens: Shared auth middleware rejects a missing, expired, revoked, or unknown session.
  Source: `src/lib/auth/middleware.ts`, `src/lib/auth/errors.ts`
- `UNAUTHORIZED`
  Message: inferred middleware error
  Field: `Authorization` header
  Reason: inferred
  When It Happens: Protected request omits a usable bearer token.
  Source: `src/lib/auth/middleware.ts`, `src/lib/auth/errors.ts`

## Notes

- Sessions are request-authentication state, not authorization state.
- The bearer token sent by clients is the opaque `session_id`.
