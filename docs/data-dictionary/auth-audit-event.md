# Auth Audit Event

## Summary

- Description: Durable audit record for auth-related successes, failures,
  throttling, lock-downs, and bootstrap events.
- Owning feature: `rootAuth`
- Primary source tables or records: `auth_audit_events`,
  `CreateAuthAuditEventInput`

## Capabilities That Rely On This Entity

- Create auth principal:
  Source: `src/features/rootAuth/domain/service.ts`
- Password-stage login success and failure:
  Source: `src/features/rootAuth/domain/service.ts`
- SSH-stage login success and failure:
  Source: `src/features/rootAuth/domain/service.ts`
- Password change:
  Source: `src/features/rootAuth/domain/service.ts`
- SSH key add and revoke:
  Source: `src/features/rootAuth/domain/service.ts`
- Session revoke and logout:
  Source: `src/features/rootAuth/domain/service.ts`
- Auth throttling and lock-down events:
  Source: `src/lib/security/rootAuthAbuse.ts`, `src/features/rootAuth/transport/router.ts`
- Bootstrap application:
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Fields

- `event_id`
  Type / Shape: `TEXT`
  Description: Stable identifier for the audit event.
  Constraints / Notes: Primary key. Generated with `evt_` prefix in current service logic and bootstrap SQL.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `auth_principal_id`
  Type / Shape: `TEXT | NULL`
  Description: Related auth principal when known.
  Constraints / Notes: Nullable foreign key to `auth_principals`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `root_user_id`
  Type / Shape: `UUID | NULL`
  Description: Related root user when known.
  Constraints / Notes: Nullable foreign key to `root_users`.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `event_type`
  Type / Shape: `TEXT`
  Description: Category of the security-visible event.
  Constraints / Notes: Required. Examples include login stage events, session revocation, SSH key changes, and bootstrap application.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`, `src/features/rootAuth/domain/service.ts`
- `event_outcome`
  Type / Shape: `'success' | 'failure'`
  Description: Outcome of the event.
  Constraints / Notes: Required. Checked in storage.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `ip_address`
  Type / Shape: `TEXT | NULL`
  Description: Request IP for the event when available.
  Constraints / Notes: Nullable. Used for security visibility.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `user_agent`
  Type / Shape: `TEXT | NULL`
  Description: Request user agent for the event when available.
  Constraints / Notes: Nullable. Used for security visibility.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`
- `occurred_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time the event occurred.
  Constraints / Notes: Required.
  Source: `src/features/rootAuth/persistence/migrations/0002_create_root_auth.sql`

## Related Errors

- `AUTH_THROTTLED`
  Message: Too many authentication attempts. Please wait and try again.
  Field: none
  Reason: none
  When It Happens: Public auth middleware or abuse controls throttle authentication attempts.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/transport/router.ts`
- `AUTH_LOCKED_DOWN`
  Message: Authentication is temporarily locked due to repeated attempts. Please wait and try again.
  Field: none
  Reason: none
  When It Happens: Abuse controls temporarily lock down repeated auth attempts.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/lib/security/rootAuthAbuse.ts`
- `INVALID_CREDENTIALS`
  Message: The supplied credentials were not accepted.
  Field: none
  Reason: none
  When It Happens: Failed auth attempts commonly generate audit events for visibility.
  Source: `src/features/rootAuth/contract/errors.ts`, `src/features/rootAuth/domain/service.ts`

## Notes

- Architecture explicitly calls these records out as security-visible durable
  events.
- This page documents the audit entity itself, not every field of every
  business entity mentioned in an event payload.
